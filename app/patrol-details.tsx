import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Platform } from 'react-native';
import { useAppTheme } from '@/ctx/ThemeContext';
import { usePatrol } from '@/ctx/PatrolContext';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';

// GPS Route Mock Data
const PLANNED_ROUTE = [
    { x: 50, y: 350 }, { x: 80, y: 310 }, { x: 120, y: 280 }, { x: 160, y: 250 },
    { x: 200, y: 220 }, { x: 240, y: 180 }, { x: 280, y: 150 }, { x: 320, y: 100 }
];

export default function PatrolDetailsScreen() {
    const { colors } = useAppTheme();
    const { routeId, routeName } = useLocalSearchParams();
    const { getRouteById, updatePatrolStatus } = usePatrol();
    const currentRoute = getRouteById(routeId as string);
    const [viewMode, setViewMode] = React.useState<'map' | 'list'>('map');
    const styles = dynamicStyles(colors);

    // Initial Logs to show history
    const [actualPath, setActualPath] = React.useState<{ x: number, y: number }[]>([
        { x: 50, y: 350 }, { x: 85, y: 315 }, { x: 122, y: 285 }
    ]);
    const [gpsLogs, setGpsLogs] = React.useState<{ time: string, status: string, location: string, note: string }[]>([
        { time: '15:10:00', status: 'Đã đồng bộ', location: 'Cổng Chính', note: 'Vị trí GPS [50, 350] - Khu vực Cổng Chính (Zone A)' },
        { time: '15:10:30', status: 'Đã đồng bộ', location: 'Cổng Chính', note: 'Vị trí GPS [85, 315] - Khu vực Cổng Chính (Zone A)' },
        { time: '15:11:00', status: 'Đã đồng bộ', location: 'Văn Phòng', note: 'Vị trí GPS [122, 285] - Tòa nhà Văn Phòng (Zone B)' },
    ]);
    const [isTracking, setIsTracking] = React.useState(true);

    // Derive starting point from coordinates
    const getAreaFromCoords = (x: number, y: number) => {
        if (x < 100) return 'Cổng Chính (Zone A)';
        if (x < 180) return 'Tòa nhà A';
        if (x < 260) return 'Hành lang B';
        if (x < 340) return 'Tòa nhà E';
        return 'Khu vực Kho (Zone C)';
    };

    const startingPoint = getAreaFromCoords(PLANNED_ROUTE[0].x, PLANNED_ROUTE[0].y);
    const progress = Math.min((actualPath.length / PLANNED_ROUTE.length) * 100, 100);

    // Simulate GPS Updates
    React.useEffect(() => {
        if (!isTracking) return;

        const interval = setInterval(() => {
            setActualPath(prev => {
                if (prev.length >= PLANNED_ROUTE.length + 5) {
                    setIsTracking(false);
                    return prev;
                }
                const lastPoint = prev[prev.length - 1];
                const nextX = lastPoint.x + (Math.random() * 25 + 10);
                const nextY = lastPoint.y - (Math.random() * 25 + 5);

                const areaName = getAreaFromCoords(nextX, nextY);
                const newLog = {
                    time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                    status: 'Đã đồng bộ',
                    location: areaName,
                    note: `Vị trí GPS [${nextX.toFixed(0)}, ${nextY.toFixed(0)}] - ${areaName}`
                };
                setGpsLogs(logs => [newLog, ...logs]);

                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                return [...prev, { x: nextX, y: nextY }];
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [isTracking]);

    const renderGpsLog = ({ item }: { item: any }) => (
        <View style={styles.logRow}>
            <View style={styles.logTimeContainer}>
                <Text style={styles.logTime}>{item.time}</Text>
            </View>
            <View style={styles.logContent}>
                <View style={styles.logCard}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <Ionicons name="location" size={14} color={colors.primary} />
                        <Text style={styles.logLocation}>{item.location}</Text>
                    </View>
                    <View style={styles.logCardHeader}>
                        <Text style={styles.logNote}>{item.note}</Text>
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <View style={{ flex: 1, marginLeft: 16 }}>
                    <Text style={styles.headerTitle}>{routeName?.toString() || 'Tuyến Điều Phối TTCH'}</Text>
                    <View style={styles.headerMeta}>
                        <Ionicons name="play-circle" size={12} color={colors.primary} />
                        <Text style={styles.startPointText}>BẮT ĐẦU: {startingPoint}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.progressOverview}>
                <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>TIẾN ĐỘ LỘ TRÌNH THỰC TẾ</Text>
                    <Text style={styles.progressValue}>{Math.round(progress)}%</Text>
                </View>
                <View style={styles.progressBarTrack}>
                    <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                </View>
            </View>

            <View style={styles.viewToggle}>
                <TouchableOpacity
                    style={[styles.toggleBtn, viewMode === 'map' && styles.toggleBtnActive]}
                    onPress={() => setViewMode('map')}
                >
                    <Text style={[styles.toggleText, viewMode === 'map' && styles.toggleTextActive]}>BẢN ĐỒ TUYẾN</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.toggleBtn, viewMode === 'list' && styles.toggleBtnActive]}
                    onPress={() => setViewMode('list')}
                >
                    <Text style={[styles.toggleText, viewMode === 'list' && styles.toggleTextActive]}>NHẬT KÝ VỊ TRÍ</Text>
                </TouchableOpacity>
            </View>

            {viewMode === 'list' ? (
                <FlatList
                    data={gpsLogs}
                    renderItem={renderGpsLog}
                    keyExtractor={(_, index) => index.toString()}
                    contentContainerStyle={styles.listContent}
                    ListHeaderComponent={<Text style={styles.sectionTitle}>Lịch sử đồng bộ với TTCH</Text>}
                />
            ) : (
                <View style={styles.mapContainer}>
                    <View style={styles.mapGrid}>
                        {/* PLANNED ROUTE Nodes */}
                        {PLANNED_ROUTE.map((p, i) => (
                            <View key={`planned-${i}`} style={[styles.pathNode, { top: p.y, left: p.x }]} />
                        ))}

                        {/* ACTUAL ROUTE Nodes */}
                        {actualPath.map((p, idx) => (
                            <View key={`actual-${idx}`} style={[
                                styles.mapPoint,
                                { top: p.y, left: p.x }
                            ]}>
                                <View style={[styles.gpsDot, idx === actualPath.length - 1 && styles.gpsDotActive]} />
                                {idx === actualPath.length - 1 && (
                                    <View style={styles.pulseRing} />
                                )}
                            </View>
                        ))}
                    </View>

                    {/* High-Contrast Legend */}
                    <View style={styles.legendOverlay}>
                        <View style={styles.legendHeader}>
                            <Text style={styles.legendHeaderText}>CHÚ THÍCH BẢN ĐỒ</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: colors.muted, borderWidth: 1, borderColor: '#fff' }]} />
                            <Text style={styles.legendText}>Lộ trình tuần tra</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: colors.primary }]} />
                            <Text style={styles.legendText}>Thực tế di chuyển</Text>
                        </View>
                    </View>

                    <View style={styles.mapInfo}>
                        <Ionicons name="location" size={14} color={colors.primary} />
                        <Text style={styles.mapInfoText}>VỊ TRÍ HIỆN TẠI: {actualPath[actualPath.length - 1].x.toFixed(0)}, {actualPath[actualPath.length - 1].y.toFixed(0)}</Text>
                    </View>
                </View>
            )}

            <View style={styles.bottomActions}>
                <TouchableOpacity
                    style={styles.incidentButton}
                    onPress={() => router.push({
                        pathname: '/occurrence-report',
                        params: { type: 'patrol' }
                    })}
                >
                    <Ionicons name="warning" size={20} color={colors.text} />
                    <Text style={styles.buttonText}>BÁO CÁO SỰ CỐ</Text>
                </TouchableOpacity>

                {currentRoute?.status === 'HOÀN THÀNH' ? (
                    <TouchableOpacity
                        style={[styles.finishButton, { backgroundColor: colors.primary, borderColor: colors.primary }]}
                        onPress={() => router.push({
                            pathname: '/patrol-report',
                            params: {
                                routeId: routeId as string,
                                distance: '1.24 km',
                                updates: actualPath.length,
                                incidents: 0,
                                duration: '32m'
                            }
                        })}
                    >
                        <Text style={[styles.buttonText, { color: '#fff' }]}>LẬP BÁO CÁO</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={[styles.finishButton, progress < 100 && { opacity: 0.6 }]}
                        onPress={() => {
                            if (progress < 100) {
                                alert('Vui lòng đi hết tuyến đường trước khi xác nhận hoàn thành.');
                                return;
                            }
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                            updatePatrolStatus(routeId as string, 'HOÀN THÀNH');
                            router.back();
                        }}
                    >
                        <Text style={styles.buttonText}>XÁC NHẬN HOÀN THÀNH</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const dynamicStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.base,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 24,
        paddingTop: 60,
        backgroundColor: colors.surface,
    },
    headerTitle: {
        color: colors.text,
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    startPointText: {
        color: colors.primary,
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    progressOverview: {
        padding: 20,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.text + '05',
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    progressLabel: {
        color: colors.muted,
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    progressValue: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: 'bold',
    },
    progressBarTrack: {
        height: 6,
        backgroundColor: colors.text + '10',
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: colors.primary,
        borderRadius: 3,
    },
    progressSubtext: {
        color: colors.muted,
        fontSize: 10,
        fontWeight: '500',
    },
    viewToggle: {
        flexDirection: 'row',
        padding: 16,
        gap: 12,
    },
    toggleBtn: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 12,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.text + '10',
    },
    toggleBtnActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    toggleText: {
        color: colors.muted,
        fontWeight: 'bold',
        fontSize: 12,
    },
    toggleTextActive: {
        color: '#fff',
    },
    sectionTitle: {
        color: colors.muted,
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 20,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    listContent: {
        padding: 20,
    },
    logRow: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    logTimeContainer: {
        width: 85,
        alignItems: 'flex-start',
    },
    logTime: {
        color: colors.primary,
        fontSize: 12,
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    signalDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginTop: 4,
    },
    logContent: {
        flex: 1,
        borderLeftWidth: 1,
        borderLeftColor: colors.text + '10',
        paddingLeft: 16,
        marginLeft: -12,
    },
    logCard: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: colors.text + '05',
    },
    logCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    logLocation: {
        color: colors.text,
        fontSize: 14,
        fontWeight: 'bold',
    },
    logNote: {
        color: colors.muted,
        fontSize: 11,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    mapContainer: {
        flex: 1,
        backgroundColor: colors.mode === 'light' ? '#E5E5EA' : '#000',
        margin: 16,
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.text + '10',
        position: 'relative',
    },
    mapGrid: {
        flex: 1,
        position: 'relative',
    },
    pathNode: {
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.muted,
        borderWidth: 1,
        borderColor: '#fff',
        zIndex: 1,
        opacity: 0.8,
    },
    mapPoint: {
        position: 'absolute',
        zIndex: 5,
        alignItems: 'center',
        justifyContent: 'center',
        width: 20,
        height: 20,
        marginLeft: -10,
        marginTop: -10,
    },
    gpsDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.primary,
    },
    gpsDotActive: {
        backgroundColor: colors.primary,
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    pulseRing: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: colors.primary,
        opacity: 0.5,
    },
    legendOverlay: {
        position: 'absolute',
        top: 16,
        left: 16,
        right: 16,
        backgroundColor: 'rgba(0,0,0,0.85)',
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        gap: 8,
    },
    legendHeader: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        paddingBottom: 8,
        marginBottom: 8,
    },
    legendHeaderText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
        textAlign: 'center',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    legendColor: {
        width: 14,
        height: 14,
        borderRadius: 4,
    },
    legendText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    mapInfo: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: 16,
        backgroundColor: 'rgba(0,0,0,0.8)',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 24,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: colors.primary + '40',
    },
    mapInfoText: {
        color: colors.primary,
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    bottomActions: {
        flexDirection: 'row',
        padding: 20,
        paddingBottom: 40,
        backgroundColor: colors.surface,
        gap: 12,
    },
    incidentButton: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: colors.warning,
        paddingVertical: 16,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    finishButton: {
        flex: 1,
        backgroundColor: colors.surface,
        paddingVertical: 16,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.text + '10',
    },
    buttonText: {
        color: colors.text,
        fontWeight: 'bold',
        fontSize: 14,
    },
});
