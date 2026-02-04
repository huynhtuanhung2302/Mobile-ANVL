import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useAppTheme } from '@/ctx/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const MOCK_ALERTS = [
    {
        id: '1',
        type: 'Xâm nhập trái phép',
        location: 'Khu A • Nhà 1 Tầng • Tầng 1',
        time: '2 phút trước',
        severity: 'Khẩn cấp',
        note: 'Có người lạ xuất hiện tại sảnh chính, yêu cầu kiểm tra thẻ nhân viên.'
    },
    {
        id: '2',
        type: 'Phương tiện danh sách đen',
        location: 'Khu B • Nhà 2 Tầng • Tầng 1',
        time: '5 phút trước',
        severity: 'Cao',
        note: 'Xe 29A-123.45 đi vào bãi xe không qua hầm. Yêu cầu phối hợp dừng xe.'
    },
];

export default function AlertQueueScreen() {
    const { colors } = useAppTheme();
    const styles = dynamicStyles(colors);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>HÀNG ĐỢI KHẨN CẤP</Text>
                <View style={styles.countBadge}>
                    <Text style={styles.countBadgeText}>{MOCK_ALERTS.length}</Text>
                </View>
            </View>

            <FlatList
                data={MOCK_ALERTS}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.alertCard}
                        onPress={() => router.push({
                            pathname: '/alert-detail',
                            params: {
                                incidentId: item.id,
                                alertType: item.type,
                                severity: item.severity,
                                zone: item.location.split(' • ')[0],
                                building: item.location.split(' • ')[1],
                                floor: item.location.split(' • ')[2],
                                note: item.note,
                                mediaUri: item.type === 'Xâm nhập trái phép' ? 'intruder_alert_iot_1768809889699.png' : 'blacklist_vehicle_iot_1768809909551.png'
                            }
                        })}
                    >
                        <View style={styles.alertHeader}>
                            <View style={styles.typeBadge}>
                                <Text style={styles.typeBadgeText}>{item.type}</Text>
                            </View>
                            <Text style={styles.timeText}>{item.time}</Text>
                        </View>
                        <Text style={styles.locationText}>{item.location}</Text>
                        <View style={styles.noteBox}>
                            <Text style={styles.noteText} numberOfLines={2}>{item.note}</Text>
                        </View>
                        <View style={styles.actionRow}>
                            <Text style={[styles.severityText, { color: item.severity === 'Khẩn cấp' ? colors.danger : colors.warning }]}>
                                {item.severity.toUpperCase()}
                            </Text>
                            <View style={styles.acceptButton}>
                                <Text style={styles.acceptButtonText}>XỬ LÝ NGAY</Text>
                                <Ionicons name="chevron-forward" size={16} color={colors.text} />
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
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
        flexDirection: 'row',
        alignItems: 'center',
        padding: 24,
        paddingTop: 60,
        backgroundColor: colors.alert,
        gap: 16,
    },
    headerTitle: {
        color: colors.text,
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    countBadge: {
        backgroundColor: colors.text,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    countBadgeText: {
        color: colors.alert,
        fontWeight: 'bold',
        fontSize: 12,
    },
    listContent: {
        padding: 20,
    },
    alertCard: {
        backgroundColor: colors.surface,
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.alert + '4D',
        borderLeftWidth: 6,
        borderLeftColor: colors.alert,
    },
    alertHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    typeBadge: {
        backgroundColor: colors.alert + '1A',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    typeBadgeText: {
        color: colors.alert,
        fontSize: 12,
        fontWeight: 'bold',
    },
    timeText: {
        color: colors.muted,
        fontSize: 12,
    },
    locationText: {
        color: colors.text,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    severityText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    noteBox: {
        backgroundColor: colors.text + '05',
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
    },
    noteText: {
        color: colors.muted,
        fontSize: 13,
        fontStyle: 'italic',
    },
    acceptButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.alert,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        gap: 4,
    },
    acceptButtonText: {
        color: colors.text,
        fontSize: 12,
        fontWeight: 'bold',
    },
});
