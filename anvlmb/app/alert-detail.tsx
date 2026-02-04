import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Dimensions, Animated } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useAppTheme } from '@/ctx/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useMission } from '@/ctx/MissionContext';
import { useAlertQueue } from '@/ctx/AlertQueueContext';
import * as Haptics from 'expo-haptics';
import ConfirmationPopup from '@/components/ConfirmationPopup';

const { width } = Dimensions.get('window');

// OSD Overlay for Media
const MediaOSD = () => (
    <View style={styles_osd.container}>
        <View style={styles_osd.cornerTL} />
        <View style={styles_osd.cornerTR} />
        <View style={styles_osd.cornerBL} />
        <View style={styles_osd.cornerBR} />
        <View style={styles_osd.recContainer}>
            <View style={styles_osd.recDot} />
            <Text style={styles_osd.recText}>REC</Text>
        </View>
        <Text style={styles_osd.camLabel}>CAM_SEC_042</Text>
    </View>
);

export default function AlertDetailScreen() {
    const { colors } = useAppTheme();
    const params = useLocalSearchParams();
    const styles = dynamicStyles(colors);
    const scanAnim = useRef(new Animated.Value(0)).current;

    const {
        incidentId = '402',
        alertType = 'Cảnh báo',
        severity = 'Cao',
        zone = 'Khu vực Chung',
        building = 'Tòa nhà chính',
        floor = 'Tầng trệt',
        note = 'Không có ghi chú bổ sung.',
        status: initialStatus, // From params
        mediaUri
    } = params;

    const safeIncidentId = incidentId?.toString() || '402';
    const safeSeverity = severity?.toString() || 'CRITICAL';
    const safeType = alertType?.toString() || 'Cảnh báo';

    const { acceptMission, missionState, startMissionImmediately } = useMission();
    const { queue, updateAlertStatus } = useAlertQueue();

    // Get live status from queue
    const liveAlert = queue.find(a => a.id === safeIncidentId);
    const currentStatus = liveAlert?.status || (initialStatus as any) || 'UNPROCESSED';

    const STATUS_LABELS: Record<string, string> = {
        'UNPROCESSED': 'Chờ tiếp nhận',
        'RECEIVED': 'Đã tiếp nhận',
        'REPORTED': 'Đã báo cáo',
        'FINISHED': 'Kết thúc'
    };

    const STATUS_COLORS: Record<string, string> = {
        'UNPROCESSED': colors.danger,
        'RECEIVED': colors.warning,
        'REPORTED': colors.primary,
        'FINISHED': colors.safe
    };

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(scanAnim, {
                    toValue: 1,
                    duration: 3000,
                    useNativeDriver: true,
                }),
                Animated.timing(scanAnim, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const handleUnderstood = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        const currentMission = missionState.missions[safeIncidentId];

        if (currentMission && currentMission.status === 'UNPROCESSED') {
            acceptMission(safeIncidentId);
        } else if (!currentMission) {
            startMissionImmediately({
                id: safeIncidentId,
                type: safeType,
                priority: safeSeverity,
                location: {
                    zone: zone.toString(),
                    building: building.toString(),
                    floor: floor.toString()
                },
                description: note.toString()
            } as any);
        }

        // After accepting, navigate back to Alert List with RECEIVED tab
        router.navigate({
            pathname: '/(tabs)/alerts',
            params: { tab: 'RECEIVED' }
        } as any);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerSubtitle}>THÔNG TIN SỰ VỤ</Text>
                    <Text style={styles.headerTitle}>BẢN TIN SỰ VỤ</Text>
                </View>
                <View style={styles.headerRight} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Media Section */}
                <View style={styles.mediaContainer}>
                    <Image
                        source={mediaUri ? { uri: mediaUri.toString() } : { uri: 'https://images.unsplash.com/photo-1557597774-9d2739f85a76?q=80&w=800&auto=format&fit=crop' }}
                        style={styles.mediaImage}
                        resizeMode="cover"
                    />
                    <MediaOSD />
                    <Animated.View style={[styles.scanLine, {
                        transform: [{
                            translateY: scanAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, width * 0.75]
                            })
                        }]
                    }]} />
                    <View style={styles.mediaOverlayBottom}>
                        <Text style={styles.timestamp}>2026-01-21 09:35:42 • {incidentId}</Text>
                    </View>
                </View>

                {/* Tactical Dashboard Section */}
                <View style={styles.infoSection}>
                    <View style={styles.idBadge}>
                        <View style={styles.idBadgeLeft}>
                            <Text style={styles.idLabel}>ID SỰ VỤ</Text>
                            <Text style={styles.idValue}>#{incidentId}</Text>
                        </View>
                        <View style={[styles.severityBadge, { backgroundColor: severity === 'Khẩn cấp' ? colors.danger : colors.warning }]}>
                            <Text style={styles.severityText}>{severity?.toString().toUpperCase()}</Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[currentStatus] || colors.muted }]}>
                            <Text style={styles.statusText}>{STATUS_LABELS[currentStatus]?.toUpperCase() || 'P-STATUS'}</Text>
                        </View>
                    </View>

                    <View style={styles.typeContainer}>
                        <Text style={styles.typeLabel}>LOẠI HÌNH BÁO ĐỘNG</Text>
                        <Text style={styles.typeValue}>{alertType?.toString().toUpperCase()}</Text>
                    </View>

                    <View style={styles.glassCard}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="location" size={16} color={colors.primary} />
                            <Text style={styles.cardHeaderText}>ĐỊA ĐIỂM TRIỂN KHAI</Text>
                        </View>
                        <Text style={styles.locationValue}>{zone}</Text>
                        <Text style={styles.locationSubValue}>{building} • {floor}</Text>
                    </View>

                    <View style={[styles.glassCard, { borderColor: colors.primary + '40' }]}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="shield-checkmark" size={16} color={colors.primary} />
                            <Text style={styles.cardHeaderText}>CHỈ THỊ VẬN HÀNH (IOC)</Text>
                        </View>
                        <Text style={styles.noteText}>{note?.toString() || 'Không có ghi chú bổ sung.'}</Text>
                    </View>

                    {/* MOCK WEB CONTROL */}
                    <TouchableOpacity
                        style={styles.mockWebButton}
                        onPress={() => {
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                            updateAlertStatus(safeIncidentId, 'FINISHED');
                        }}
                    >
                        <Ionicons name="desktop-outline" size={16} color={colors.muted} />
                        <Text style={styles.mockWebText}>GIẢ LẬP WEB: KẾT THÚC SỰ VỤ</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Action Section */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.actionButton} onPress={handleUnderstood}>
                    <View style={styles.buttonContent}>
                        <Text style={styles.actionButtonText}>ĐÃ HIỂU</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="white" />
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles_osd = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        padding: 20,
        justifyContent: 'space-between',
    },
    cornerTL: { position: 'absolute', top: 15, left: 15, width: 20, height: 20, borderTopWidth: 2, borderLeftWidth: 2, borderColor: 'white' },
    cornerTR: { position: 'absolute', top: 15, right: 15, width: 20, height: 20, borderTopWidth: 2, borderRightWidth: 2, borderColor: 'white' },
    cornerBL: { position: 'absolute', bottom: 15, left: 15, width: 20, height: 20, borderBottomWidth: 2, borderLeftWidth: 2, borderColor: 'white' },
    cornerBR: { position: 'absolute', bottom: 15, right: 15, width: 20, height: 20, borderBottomWidth: 2, borderRightWidth: 2, borderColor: 'white' },
    recContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    recDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF0000' },
    recText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
    camLabel: { color: 'white', fontSize: 10, fontWeight: 'bold', alignSelf: 'flex-end', opacity: 0.8 },
});

const dynamicStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.base,
    },
    header: {
        paddingTop: 60,
        paddingBottom: 16,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    backButton: {
        padding: 4,
    },
    headerTitleContainer: {
        alignItems: 'center',
    },
    headerSubtitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: colors.primary,
        letterSpacing: 2,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
        letterSpacing: 0.5,
    },
    headerRight: {
        width: 32,
    },
    scrollContent: {
        paddingBottom: 120,
    },
    mediaContainer: {
        width: width,
        height: width * 0.75,
        backgroundColor: '#000',
        position: 'relative',
        overflow: 'hidden',
    },
    mediaImage: {
        width: '100%',
        height: '100%',
        opacity: 0.85,
    },
    scanLine: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: colors.primary,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        opacity: 0.5,
    },
    mediaOverlayBottom: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    timestamp: {
        color: 'white',
        fontSize: 10,
        fontFamily: 'monospace',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    infoSection: {
        padding: 20,
    },
    idBadge: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    idBadgeLeft: {
        borderLeftWidth: 3,
        borderLeftColor: colors.primary,
        paddingLeft: 12,
    },
    idLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: colors.muted,
        letterSpacing: 1,
    },
    idValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
    },
    severityBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    severityText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        marginLeft: 8,
    },
    statusText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1,
    },
    typeContainer: {
        marginBottom: 24,
    },
    typeLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: colors.muted,
        letterSpacing: 1,
        marginBottom: 4,
    },
    typeValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.danger,
    },
    glassCard: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    cardHeaderText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: colors.muted,
        letterSpacing: 1,
    },
    locationValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
    },
    locationSubValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.primary,
    },
    noteText: {
        fontSize: 16,
        color: colors.text,
        lineHeight: 24,
        fontWeight: 'bold',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        paddingBottom: 40,
        backgroundColor: colors.base,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
    },
    actionButton: {
        backgroundColor: colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 18,
        borderRadius: 20,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 15,
        elevation: 10,
    },
    buttonContent: {
        flex: 1,
        alignItems: 'center',
    },
    actionButtonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    mockWebButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        marginTop: 10,
        borderStyle: 'dashed',
    },
    mockWebText: {
        color: colors.muted,
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
});

