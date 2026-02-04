import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const MOCK_TICKETS = [
    { id: 'TKT-001', device: 'Camera West-02', issue: 'Mất kết nối', status: 'Chờ' },
    { id: 'TKT-002', device: 'Cảm biến Gate-01', issue: 'Pin yếu', status: 'Đang thực hiện' },
    { id: 'TKT-003', device: 'Khóa North-A4', issue: 'Kẹt cơ học', status: 'Hoàn thành' },
];

export default function TicketListScreen() {
    const renderItem = ({ item }: { item: typeof MOCK_TICKETS[0] }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => router.push({ pathname: '/ticket-detail', params: { id: item.id } })}
        >
            <View style={styles.cardHeader}>
                <Text style={styles.ticketId}>{item.id}</Text>
                <View style={[
                    styles.badge,
                    item.status === 'Hoàn thành' ? styles.badgeSafe :
                        item.status === 'Đang thực hiện' ? styles.badgePrimary : styles.badgeWarning
                ]}>
                    <Text style={styles.badgeText}>{
                        item.status === 'Chờ' ? 'CHỜ XỬ LÝ' :
                            item.status === 'Đang thực hiện' ? 'ĐANG LÀM' : 'HOÀN THÀNH'
                    }</Text>
                </View>
            </View>

            <Text style={styles.deviceText}>{item.device}</Text>
            <Text style={styles.issueText}>{item.issue}</Text>

            <View style={styles.cardFooter}>
                <Ionicons name="chevron-forward" size={20} color={Colors.dark.muted} />
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Danh sách Ticket</Text>
            </View>

            <FlatList
                data={MOCK_TICKETS}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.base,
    },
    header: {
        padding: 20,
        paddingTop: 60,
        backgroundColor: Colors.dark.surface,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.dark.text,
    },
    listContent: {
        padding: 20,
    },
    card: {
        backgroundColor: Colors.dark.surface,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    ticketId: {
        color: Colors.dark.primary,
        fontWeight: 'bold',
        fontSize: 16,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    badgeWarning: {
        backgroundColor: 'rgba(255, 149, 0, 0.2)',
    },
    badgePrimary: {
        backgroundColor: 'rgba(10, 132, 255, 0.2)',
    },
    badgeSafe: {
        backgroundColor: 'rgba(52, 199, 89, 0.2)',
    },
    badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: Colors.dark.text,
    },
    deviceText: {
        color: Colors.dark.text,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    issueText: {
        color: Colors.dark.muted,
        fontSize: 14,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 8,
    },
});
