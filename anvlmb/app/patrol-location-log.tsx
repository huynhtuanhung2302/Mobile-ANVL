import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Dimensions, Platform } from 'react-native';
import { useAppTheme } from '@/ctx/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');

// Mock Data for GPS Heartbeat Log
const MOCK_GPS_LOGS = [
    { id: '1', time: '08:30:05', location: 'Cổng Chính', coords: '[10.7626, 106.6602]', signal: 'excellent' },
    { id: '2', time: '08:35:12', location: 'Tòa nhà A', coords: '[10.7628, 106.6605]', signal: 'good' },
    { id: '3', time: '08:40:20', location: 'Hành lang B', coords: '[10.7630, 106.6608]', signal: 'excellent' },
    { id: '4', time: '08:45:30', location: 'Tòa nhà E', coords: '[10.7632, 106.6610]', signal: 'fair' },
    { id: '5', time: '08:50:45', location: 'Sân bãi phía Tây', coords: '[10.7635, 106.6615]', signal: 'excellent' },
    { id: '6', time: '08:55:55', location: 'Khu vực Tòa nhà E', coords: '[10.7638, 106.6620]', signal: 'good' },
    { id: '7', time: '09:01:05', location: 'Cửa Kho B', coords: '[10.7640, 106.6625]', signal: 'excellent' },
    { id: '8', time: '09:06:15', location: 'Tòa nhà C', coords: '[10.7642, 106.6630]', signal: 'fair' },
    { id: '9', time: '09:12:00', location: 'Phòng Trực', coords: '[10.7645, 106.6635]', signal: 'excellent' },
];

export default function PatrolLocationLogScreen() {
    const { colors } = useAppTheme();
    const params = useLocalSearchParams();
    const styles = dynamicStyles(colors);

    const routeName = params.routeName as string || 'Nhiệm vụ tuần tra';

    const renderItem = ({ item, index }: { item: any, index: number }) => (
        <View style={styles.logRow}>
            <View style={styles.timelineColumn}>
                <View style={[styles.timelineDot, { backgroundColor: index === 0 ? colors.safe : colors.primary }]} />
                {index < MOCK_GPS_LOGS.length - 1 && <View style={[styles.timelineLine, { backgroundColor: colors.text + '10' }]} />}
            </View>

            <View style={styles.contentCard}>
                <View style={styles.cardHeader}>
                    <Text style={styles.timeText}>{item.time}</Text>
                    <View style={styles.signalBadge}>
                        <Ionicons
                            name="wifi"
                            size={12}
                            color={item.signal === 'excellent' ? colors.safe : item.signal === 'good' ? colors.primary : colors.warning}
                        />
                    </View>
                </View>

                <View style={styles.locationContainer}>
                    <Text style={[styles.locationLabel, { color: colors.text }]}>{item.location}</Text>
                    <Text style={[styles.coordsText, { color: colors.muted }]}>Vị trí GPS {item.coords} - {item.location}</Text>
                </View>
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
                    <Text style={styles.headerTitle}>Nhật ký Vị trí (GPS)</Text>
                    <Text style={styles.headerSubtitle}>{routeName}</Text>
                </View>
            </View>

            <FlatList
                data={MOCK_GPS_LOGS}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
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
        elevation: 2,
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
    },
    logRow: {
        flexDirection: 'row',
        minHeight: 80,
    },
    timelineColumn: {
        width: 20,
        alignItems: 'center',
    },
    timelineDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginTop: 6,
        zIndex: 2,
    },
    timelineLine: {
        width: 2,
        flex: 1,
        marginTop: -4,
    },
    contentCard: {
        flex: 1,
        marginLeft: 16,
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.text + '08',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    timeText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: colors.primary,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    signalBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    locationContainer: {
        gap: 4,
    },
    locationLabel: {
        fontSize: 15,
        fontWeight: '800',
    },
    coordsText: {
        fontSize: 11,
        opacity: 0.6,
    }
});
