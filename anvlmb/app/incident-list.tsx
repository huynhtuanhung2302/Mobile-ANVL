import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useAppTheme } from '@/ctx/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const MOCK_INCIDENTS = [
    { id: '1', title: 'Nhiệt độ phòng Server cao', location: 'Tầng 4', status: 'CẦN KIỂM TRA', time: '10:45' },
    { id: '2', title: 'Camera số 12 hình ảnh kém', location: 'Bãi xe B', status: 'CHỜ XỬ LÝ', time: '09:20' },
    { id: '3', title: 'Nhân viên quẹt thẻ sai (3 lần)', location: 'Cổng chính', status: 'THEO DÕI', time: '08:15' },
];

export default function IncidentListScreen() {
    const { colors } = useAppTheme();
    const styles = dynamicStyles(colors);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>DANH SÁCH SỰ VỤ</Text>
            </View>

            <FlatList
                data={MOCK_INCIDENTS}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => router.push({ pathname: '/incident-report', params: { incidentId: item.id } })}
                    >
                        <View style={styles.cardHeader}>
                            <View style={[styles.statusBadge, { backgroundColor: colors.incident + '1A' }]}>
                                <Text style={[styles.statusText, { color: colors.incident }]}>{item.status}</Text>
                            </View>
                            <Text style={styles.timeText}>{item.time}</Text>
                        </View>
                        <Text style={styles.titleText}>{item.title}</Text>
                        <View style={styles.footer}>
                            <View style={styles.locationContainer}>
                                <Ionicons name="location" size={14} color={colors.muted} />
                                <Text style={styles.locationText}>{item.location}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={colors.muted} />
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
        borderLeftColor: colors.incident,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    timeText: {
        color: colors.muted,
        fontSize: 12,
    },
    titleText: {
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
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    locationText: {
        color: colors.muted,
        fontSize: 13,
    },
});
