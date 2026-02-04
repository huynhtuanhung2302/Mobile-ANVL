import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useAppTheme } from '@/ctx/ThemeContext';
import { usePatrol } from '@/ctx/PatrolContext';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import ConfirmationPopup from '@/components/ConfirmationPopup';

const { width } = Dimensions.get('window');

export default function PatrolHistoryDetailScreen() {
    const { colors } = useAppTheme();
    const params = useLocalSearchParams();
    const { getRouteById } = usePatrol();
    const styles = dynamicStyles(colors);

    const routeId = params.routeId as string || 'N/A';
    const currentRoute = getRouteById(routeId);
    const routeName = currentRoute?.name || params.routeName as string || 'Nhiệm vụ tuần tra';
    const [showSignaturePopup, setShowSignaturePopup] = React.useState(false);

    // Helpers to get status display
    const getStatusColor = () => {
        if (currentRoute?.status === 'ĐÃ BÁO CÁO') return colors.safe;
        return colors.primary; // For 'HOÀN THÀNH'
    };

    // Summary Stats (Mocked or passed via params)
    const stats = {
        distance: '1.45 km',
        duration: '42 phút',
        gpsSync: '100%',
        incidents: 1,
        startTime: '08:30',
        endTime: '09:12',
        date: '02/02/2026'
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle}>Lịch sử Tuần tra</Text>
                    <Text style={styles.headerSubtitle}>{stats.date} • {stats.startTime} - {stats.endTime}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor() }]}>{currentRoute?.status || 'HOÀN THÀNH'}</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* 1. Main Info Card */}
                <View style={styles.infoCard}>
                    <View style={styles.routeHeader}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="shield-checkmark" size={28} color={colors.primary} />
                        </View>
                        <View style={{ flex: 1, marginLeft: 16 }}>
                            <Text style={styles.routeName}>{routeName}</Text>
                            <Text style={styles.routeId}>Mã số: {routeId}</Text>
                        </View>
                    </View>

                    <View style={styles.statsGrid}>
                        <View style={styles.statBox}>
                            <Text style={styles.statValue}>{stats.distance}</Text>
                            <Text style={styles.statLabel}>Quãng đường</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={[styles.statValue, { color: colors.primary }]}>{stats.duration}</Text>
                            <Text style={styles.statLabel}>Thời gian</Text>
                        </View>
                    </View>
                </View>

                {/* 2. Detailed Metrics */}
                <Text style={styles.sectionTitle}>Chi tiết báo cáo</Text>

                <View style={styles.metricRow}>
                    <View style={styles.metricIcon}>
                        <Ionicons name="cloud-done" size={20} color={colors.safe} />
                    </View>
                    <View style={styles.metricInfo}>
                        <Text style={styles.metricLabel}>Đồng bộ GPS</Text>
                        <Text style={styles.metricValue}>Hoàn tất (Dữ liệu đã lưu tại TTCH)</Text>
                    </View>
                    <Text style={styles.metricRight}>{stats.gpsSync}</Text>
                </View>

                <TouchableOpacity
                    style={styles.metricRow}
                    onPress={() => router.push({
                        pathname: '/patrol-incidents-summary',
                        params: { routeId, routeName }
                    })}
                >
                    <View style={styles.metricIcon}>
                        <Ionicons name="alert-circle" size={20} color={stats.incidents > 0 ? colors.warning : colors.muted} />
                    </View>
                    <View style={styles.metricInfo}>
                        <Text style={styles.metricLabel}>Sự cố phát hiện</Text>
                        <Text style={styles.metricValue}>
                            {stats.incidents > 0
                                ? `Phát hiện ${stats.incidents} trường hợp bất thường`
                                : 'Không phát hiện sự cố'}
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={colors.muted} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.metricRow}
                    onPress={() => router.push({
                        pathname: '/patrol-location-log',
                        params: { routeId, routeName }
                    })}
                >
                    <View style={styles.metricIcon}>
                        <Ionicons name="location-outline" size={20} color={colors.primary} />
                    </View>
                    <View style={styles.metricInfo}>
                        <Text style={styles.metricLabel}>Nhật ký Vị trí (GPS)</Text>
                        <Text style={styles.metricValue}>Toàn bộ lộ trình di chuyển đồng bộ</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={colors.muted} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.metricRow}
                    onPress={() => setShowSignaturePopup(true)}
                >
                    <View style={styles.metricIcon}>
                        <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                    </View>
                    <View style={styles.metricInfo}>
                        <Text style={styles.metricLabel}>Xác nhận của Nhân viên</Text>
                        <Text style={styles.metricValue}>Nhân viên 042 • Đã ký số</Text>
                    </View>
                    <Ionicons name="finger-print" size={16} color={colors.primary} />
                </TouchableOpacity>

                {/* 3. Summary Note */}
                <View style={styles.noteSection}>
                    <Text style={styles.sectionTitle}>Ghi chú tổng kết</Text>
                    <View style={styles.noteBox}>
                        <Text style={styles.noteText}>
                            {currentRoute?.notes || 'Không có ghi chú tổng kết cho ca tuần tra này.'}
                        </Text>
                    </View>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.closeButton, { backgroundColor: colors.surface }]}
                    onPress={() => router.back()}
                >
                    <Text style={[styles.closeButtonText, { color: colors.text }]}>ĐÓNG TÓM TẮT</Text>
                </TouchableOpacity>
            </View>

            <ConfirmationPopup
                isVisible={showSignaturePopup}
                title="Xác nhận báo cáo"
                message="Nhân viên Nhân viên 042 có xác nhận thông tin trong báo cáo tuần tra là đúng?"
                confirmText="Xác nhận"
                cancelText="Hủy"
                onConfirm={() => setShowSignaturePopup(false)}
                onCancel={() => setShowSignaturePopup(false)}
            />
        </View>
    );
}

const dynamicStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.base,
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    headerInfo: {
        flex: 1,
        marginLeft: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
    },
    headerSubtitle: {
        fontSize: 12,
        color: colors.muted,
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    scrollContent: {
        padding: 20,
    },
    infoCard: {
        backgroundColor: colors.surface,
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: colors.text + '0D',
        marginBottom: 32,
    },
    routeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: colors.primary + '10',
        justifyContent: 'center',
        alignItems: 'center',
    },
    routeName: {
        fontSize: 20,
        fontWeight: '900',
        color: colors.text,
    },
    routeId: {
        fontSize: 12,
        color: colors.muted,
        marginTop: 4,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: colors.text + '08',
        paddingTop: 20,
    },
    statBox: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
    },
    statLabel: {
        fontSize: 10,
        color: colors.muted,
        marginTop: 4,
        textTransform: 'uppercase',
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.muted,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 16,
    },
    metricRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.text + '08',
    },
    metricIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: colors.text + '05',
        justifyContent: 'center',
        alignItems: 'center',
    },
    metricInfo: {
        flex: 1,
        marginLeft: 16,
    },
    metricLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.text,
    },
    metricValue: {
        fontSize: 12,
        color: colors.muted,
        marginTop: 2,
    },
    metricRight: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.text,
    },
    noteSection: {
        marginTop: 32,
    },
    noteBox: {
        backgroundColor: colors.text + '05',
        borderRadius: 16,
        padding: 20,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: colors.muted + '40',
    },
    noteText: {
        fontSize: 14,
        lineHeight: 22,
        color: colors.text,
        opacity: 0.8,
    },
    footer: {
        padding: 20,
        paddingBottom: 40,
    },
    closeButton: {
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(128,128,128,0.2)',
    },
    closeButtonText: {
        fontSize: 14,
        fontWeight: '900',
        letterSpacing: 1,
    },
    submitButton: {
        backgroundColor: colors.primary,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 12,
        elevation: 8,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '900',
        letterSpacing: 1,
    }
});
