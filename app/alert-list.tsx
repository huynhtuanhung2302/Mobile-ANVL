import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { useAppTheme } from '@/ctx/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const MOCK_ALERTS = [
    { id: 'ALR-001', title: 'Phát hiện Xâm nhập', location: 'Khu vực A - Cổng Đông', time: '10:45 AM', priority: 'Cao' },
    { id: 'ALR-002', title: 'Báo cháy', location: 'Khu vực Bếp', time: '11:20 AM', priority: 'Khẩn cấp' },
    { id: 'ALR-003', title: 'Pin yếu', location: 'Cảm biến West-04', time: '09:15 AM', priority: 'Thấp' },
];

export default function AlertListScreen() {
    const { colors } = useAppTheme();
    const styles = dynamicStyles(colors);

    const renderItem = ({ item }: { item: typeof MOCK_ALERTS[0] }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => router.push('/(tabs)/map')}
        >
            <View style={styles.cardHeader}>
                <View style={styles.titleGroup}>
                    <Ionicons
                        name={item.priority === 'Khẩn cấp' ? 'flame' : 'warning'}
                        size={20}
                        color={item.priority === 'Khẩn cấp' ? colors.danger : colors.warning}
                    />
                    <Text style={styles.alertTitle}>{item.title}</Text>
                </View>
                <Text style={styles.timeText}>{item.time}</Text>
            </View>

            <Text style={styles.locationText}>{item.location}</Text>

            <View style={styles.priorityBadge}>
                <Text style={[
                    styles.priorityText,
                    { color: item.priority === 'Khẩn cấp' ? colors.danger : item.priority === 'Cao' ? colors.warning : colors.muted }
                ]}>
                    {item.priority.toUpperCase()}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Hệ thống Cảnh báo</Text>
                <View style={{ width: 24 }} />
            </View>

            <FlatList
                data={MOCK_ALERTS}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
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
        padding: 20,
        paddingTop: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.surface,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
    },
    listContent: {
        padding: 20,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.text + '1A',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    titleGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    alertTitle: {
        color: colors.text,
        fontSize: 16,
        fontWeight: 'bold',
    },
    timeText: {
        color: colors.muted,
        fontSize: 12,
    },
    locationText: {
        color: colors.muted,
        fontSize: 14,
        marginBottom: 12,
    },
    priorityBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        backgroundColor: colors.text + '0D',
    },
    priorityText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
});
