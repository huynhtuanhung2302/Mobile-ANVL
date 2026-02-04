import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useAppTheme } from '@/ctx/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const MOCK_MAINTENANCE = [
    { id: '1', task: 'Kiểm tra hệ thống điện khu A', category: 'ĐIỆN LỰC', priority: 'TRUNG BÌNH', time: 'Hôm nay' },
    { id: '2', task: 'Mất kết nối cảm biến rung #04', category: 'KỸ THUẬT', priority: 'CAO', time: '14:00' },
    { id: '3', task: 'Bảo trì định kỳ máy phát hầm B', category: 'VẬN HÀNH', priority: 'THẤP', time: 'Ngày mai' },
];

export default function MaintenanceListScreen() {
    const { colors } = useAppTheme();
    const styles = dynamicStyles(colors);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>NHIỆM VỤ BẢO TRÌ</Text>
            </View>

            <FlatList
                data={MOCK_MAINTENANCE}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => router.push({ pathname: '/ticket-detail', params: { ticketId: item.id } })}
                    >
                        <View style={styles.cardHeader}>
                            <View style={[styles.categoryBadge, { backgroundColor: colors.maintenance + '1A' }]}>
                                <Text style={styles.categoryText}>{item.category}</Text>
                            </View>
                            <Text style={styles.priorityText}>{item.priority}</Text>
                        </View>
                        <Text style={styles.taskText}>{item.task}</Text>
                        <div style={styles.footer}>
                            <View style={styles.timeContainer}>
                                <Ionicons name="time-outline" size={14} color={colors.muted} />
                                <Text style={styles.timeText}>{item.time}</Text>
                            </View>
                            <View style={styles.startButton}>
                                <Text style={styles.startButtonText}>BẮT ĐẦU</Text>
                            </View>
                        </div>
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
        backgroundColor: colors.surface,
        gap: 16,
    },
    headerTitle: {
        color: colors.text,
        fontSize: 18,
        fontWeight: 'bold',
    },
    listContent: {
        padding: 20,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.text + '0D',
        borderLeftWidth: 4,
        borderLeftColor: colors.maintenance,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    categoryBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    categoryText: {
        color: colors.maintenance,
        fontSize: 10,
        fontWeight: 'bold',
    },
    priorityText: {
        color: colors.muted,
        fontSize: 10,
        fontWeight: 'bold',
    },
    taskText: {
        color: colors.text,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    timeText: {
        color: colors.muted,
        fontSize: 13,
    },
    startButton: {
        backgroundColor: colors.maintenance + '1A',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 10,
    },
    startButtonText: {
        color: colors.maintenance,
        fontSize: 12,
        fontWeight: 'bold',
    },
});
