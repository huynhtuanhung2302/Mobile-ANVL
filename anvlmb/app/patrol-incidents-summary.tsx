import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { useAppTheme } from '@/ctx/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');

// Mock Data for Incidents in a specific patrol
const MOCK_INCIDENTS = [
    {
        id: 'OCC-101',
        type: 'Cửa hỏng / Cần bảo trì',
        time: '08:45',
        location: 'Kho B • Cửa thoát hiểm số 2',
        description: 'Ổ khóa bị kẹt, không thể đóng hoàn toàn. Đã dán nhãn cảnh báo.',
        status: 'ĐÃ TIẾP NHẬN'
    },
    {
        id: 'OCC-102',
        type: 'Rò rỉ nước',
        time: '09:05',
        location: 'Khu A • Hành lang sàn 2',
        description: 'Phát hiện nước tràn từ phòng vệ sinh. Đã báo kỹ thuật tòa nhà.',
        status: 'ĐANG XỬ LÝ'
    }
];

export default function PatrolIncidentsSummaryScreen() {
    const { colors } = useAppTheme();
    const params = useLocalSearchParams();
    const styles = dynamicStyles(colors);

    const routeName = params.routeName as string || 'Nhiệm vụ tuần tra';

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.incidentCard}>
            <View style={styles.cardHeader}>
                <View style={styles.typeBadge}>
                    <Text style={[styles.typeText, { color: colors.primary }]}>{item.type}</Text>
                </View>
                <Text style={styles.timeText}>{item.time}</Text>
            </View>

            <View style={styles.cardBody}>
                <Text style={styles.idText}>Báo cáo: {item.id}</Text>
                <View style={styles.locRow}>
                    <Ionicons name="location" size={12} color={colors.muted} />
                    <Text style={styles.locText}>{item.location}</Text>
                </View>
                <Text style={styles.descText}>{item.description}</Text>
            </View>

            <View style={styles.cardFooter}>
                <View style={[styles.statusBadge, { backgroundColor: item.status === 'ĐÃ TIẾP NHẬN' ? colors.primary + '15' : colors.warning + '15' }]}>
                    <Text style={[styles.statusText, { color: item.status === 'ĐÃ TIẾP NHẬN' ? colors.primary : colors.warning }]}>
                        {item.status}
                    </Text>
                </View>
                <TouchableOpacity style={styles.detailBtn}>
                    <Text style={[styles.detailBtnText, { color: colors.primary }]}>XEM CHI TIẾT</Text>
                    <Ionicons name="chevron-forward" size={14} color={colors.primary} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle}>Sự cố Đã báo cáo</Text>
                    <Text style={styles.headerSubtitle}>{routeName}</Text>
                </View>
            </View>

            <FlatList
                data={MOCK_INCIDENTS}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={() => (
                    <View style={styles.emptyState}>
                        <Ionicons name="checkmark-done-circle" size={64} color={colors.safe + '40'} />
                        <Text style={styles.emptyText}>Không có sự cố nào được ghi nhận trong ca này.</Text>
                    </View>
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
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
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
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
    },
    headerSubtitle: {
        fontSize: 12,
        color: colors.muted,
        marginTop: 2,
    },
    listContent: {
        padding: 20,
        paddingBottom: 40,
    },
    incidentCard: {
        backgroundColor: colors.surface,
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.text + '0D',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    typeBadge: {
        backgroundColor: colors.primary + '10',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    typeText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    timeText: {
        fontSize: 12,
        color: colors.muted,
        fontWeight: '600',
    },
    cardBody: {
        marginBottom: 16,
    },
    idText: {
        fontSize: 11,
        color: colors.muted,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    locRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
    },
    locText: {
        fontSize: 13,
        fontWeight: '700',
        color: colors.text,
    },
    descText: {
        fontSize: 14,
        color: colors.text,
        lineHeight: 20,
        opacity: 0.8,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: colors.text + '08',
        paddingTop: 12,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '900',
    },
    detailBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    detailBtnText: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 100,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 14,
        color: colors.muted,
        textAlign: 'center',
        maxWidth: 240,
    }
});
