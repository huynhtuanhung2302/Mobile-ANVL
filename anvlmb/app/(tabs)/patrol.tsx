import React, { useState, useMemo } from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    Platform,
} from 'react-native';
import { useAppTheme } from '@/ctx/ThemeContext';
import { usePatrol, PatrolStatus } from '@/ctx/PatrolContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function PatrolRouteScreen() {
    const { colors } = useAppTheme();
    const { routes, updatePatrolStatus } = usePatrol();
    const [selectedDate, setSelectedDate] = useState('2026-02-03');
    const [activeTab, setActiveTab] = useState<PatrolStatus>('CHƯA THỰC HIỆN');

    // Get current time string (e.g. "12:30") for comparison
    const now = new Date();
    const currentTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const dayRoutes = useMemo(() => routes.filter(r => r.date === selectedDate), [selectedDate, routes]);
    const filteredRoutes = useMemo(() => dayRoutes.filter(r => r.status === activeTab), [dayRoutes, activeTab]);

    const stats = useMemo(() => {
        const total = dayRoutes.length;
        const done = dayRoutes.filter(r => r.status === 'HOÀN THÀNH').length;
        const reported = dayRoutes.filter(r => r.status === 'ĐÃ BÁO CÁO').length;
        const ongoing = dayRoutes.filter(r => r.status === 'ĐANG THỰC HIỆN').length;
        const todo = dayRoutes.filter(r => r.status === 'CHƯA THỰC HIỆN').length;
        // % display should count both completed and reported
        return { total, done, ongoing, todo, reported, percent: total > 0 ? ((done + reported) / total) * 100 : 0 };
    }, [dayRoutes]);

    const handleRoutePress = (item: any) => {
        if (item.status === 'HOÀN THÀNH' || item.status === 'ĐÃ BÁO CÁO') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push({
                pathname: '/patrol-report',
                params: { routeId: item.id, routeName: item.name }
            });
        } else if (item.status === 'ĐANG THỰC HIỆN') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push({
                pathname: '/patrol-details',
                params: { routeId: item.id, routeName: item.name }
            });
        }
    };

    const handleStartMission = (id: string) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        updatePatrolStatus(id, 'ĐANG THỰC HIỆN');
        // Auto switch to "Ongoing" tab to show the change
        setActiveTab('ĐANG THỰC HIỆN');
    };

    const dates = [
        { label: 'CN', day: '01', full: '2026-02-01' },
        { label: 'T2', day: '02', full: '2026-02-02' },
        { label: 'T3', day: '03', full: '2026-02-03' },
        { label: 'T4', day: '04', full: '2026-02-04' },
        { label: 'T5', day: '05', full: '2026-02-05' },
        { label: 'T6', day: '06', full: '2026-02-06' },
        { label: 'T7', day: '07', full: '2026-02-07' },
    ];

    return (
        <View style={[styles.container, { backgroundColor: colors.base }]}>
            {/* 1. HEADER WITH PROGRESS */}
            <View style={[styles.header, { backgroundColor: colors.surface }]}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={[styles.headerTitle, { color: colors.text }]}>Lịch trình Tuần tra</Text>
                        <Text style={[styles.headerSubtitle, { color: colors.muted }]}>Hôm nay, 03 Tháng 2</Text>
                    </View>
                    <View style={styles.progressCircleContainer}>
                        <Text style={[styles.progressText, { color: colors.primary }]}>{Math.round(stats.percent)}%</Text>
                        <Text style={[styles.progressSubtext, { color: colors.muted }]}>Xong</Text>
                    </View>
                </View>

                {/* Daily Progress Bar */}
                <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${stats.percent}%`, backgroundColor: colors.primary }]} />
                </View>

                {/* 2. DATE STRIP */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateStrip}>
                    {dates.map((d) => (
                        <TouchableOpacity
                            key={d.full}
                            style={[
                                styles.dateItem,
                                selectedDate === d.full && { backgroundColor: colors.primary + '20', borderColor: colors.primary }
                            ]}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setSelectedDate(d.full);
                            }}
                        >
                            <Text style={[styles.dateLabel, { color: selectedDate === d.full ? colors.primary : colors.muted }]}>{d.label}</Text>
                            <Text style={[styles.dateDay, { color: selectedDate === d.full ? colors.primary : colors.text }]}>{d.day}</Text>
                            {routes.some(r => r.date === d.full) && <View style={[styles.dot, { backgroundColor: colors.primary }]} />}
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* 3. STATUS TABS WITH COUNTS */}
            <View style={styles.tabsWrapper}>
                {[
                    { key: 'CHƯA THỰC HIỆN', label: 'Chờ làm', count: stats.todo, color: '#FF9500' },
                    { key: 'ĐANG THỰC HIỆN', label: 'Đang làm', count: stats.ongoing, color: '#0A84FF' },
                    { key: 'HOÀN THÀNH', label: 'Hoàn thành', count: stats.done, color: '#00F2FF' },
                    { key: 'ĐÃ BÁO CÁO', label: 'Đã báo cáo', count: stats.reported, color: '#34C759' },
                ].map((tab) => (
                    <TouchableOpacity
                        key={tab.key}
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            setActiveTab(tab.key as PatrolStatus);
                        }}
                        style={[
                            styles.tabItem,
                            activeTab === tab.key && { borderBottomColor: tab.color, borderBottomWidth: 3 }
                        ]}
                    >
                        <Text style={[styles.tabLabel, { color: activeTab === tab.key ? colors.text : colors.muted }]}>
                            {tab.label}
                        </Text>
                        <View style={[styles.countBadge, { backgroundColor: activeTab === tab.key ? tab.color : colors.muted + '20' }]}>
                            <Text style={styles.countText}>{tab.count}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            {/* 4. TASK LIST */}
            <FlatList
                data={filteredRoutes}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.taskCard,
                            { backgroundColor: colors.surface, borderColor: colors.muted + '10' },
                            item.status === 'ĐANG THỰC HIỆN' && { borderColor: colors.primary, borderWidth: 1.5, elevation: 8, shadowColor: colors.primary }
                        ]}
                        onPress={() => handleRoutePress(item)}
                    >
                        <View style={styles.cardTimeColumn}>
                            <Text style={[styles.taskTime, { color: colors.text }]}>{item.time}</Text>
                            <View style={[styles.timeLine, { backgroundColor: colors.muted + '20' }]} />
                        </View>

                        <View style={styles.cardMain}>
                            <View style={styles.cardHeader}>
                                {item.status === 'ĐANG THỰC HIỆN' ? (
                                    <View style={styles.liveBadge}>
                                        <View style={styles.pulseDot} />
                                        <Text style={styles.liveText}>ĐANG CHẠY</Text>
                                    </View>
                                ) : item.status === 'CHƯA THỰC HIỆN' && item.time < '12:00' ? ( // Mock comparison for "Late"
                                    <View style={[styles.liveBadge, { backgroundColor: colors.danger + '10' }]}>
                                        <Ionicons name="alert-circle" size={10} color={colors.danger} />
                                        <Text style={[styles.liveText, { color: colors.danger }]}>BẮT ĐẦU MUỘN</Text>
                                    </View>
                                ) : null}
                            </View>
                            <Text style={[styles.taskName, { color: colors.text }]}>{item.name}</Text>
                            <View style={styles.cardFooter}>
                                <View style={styles.meta}>
                                    <Ionicons name="time-outline" size={12} color={colors.muted} />
                                    <Text style={[styles.metaText, { color: colors.muted }]}>Dự kiến: 45 phút</Text>
                                </View>

                                {item.status === 'CHƯA THỰC HIỆN' && (
                                    <TouchableOpacity
                                        style={[styles.startInnerBtn, { backgroundColor: colors.primary }]}
                                        onPress={() => handleStartMission(item.id)}
                                    >
                                        <Text style={styles.startInnerBtnText}>BẮT ĐẦU</Text>
                                        <Ionicons name="play" size={10} color="white" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={colors.muted} />
                    </TouchableOpacity>
                )}
                ListEmptyComponent={() => (
                    <View style={styles.emptyBox}>
                        <Ionicons name="calendar-outline" size={60} color={colors.muted + '20'} />
                        <Text style={[styles.emptyText, { color: colors.muted }]}>Không có lịch trình trong mục này</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    headerTitle: { fontSize: 22, fontWeight: '900' },
    headerSubtitle: { fontSize: 13, fontWeight: '600', marginTop: 2 },
    progressCircleContainer: { alignItems: 'center' },
    progressText: { fontSize: 18, fontWeight: '900' },
    progressSubtext: { fontSize: 9, fontWeight: '800', textTransform: 'uppercase' },
    progressBarBg: { height: 6, width: '100%', backgroundColor: 'rgba(128,128,128,0.1)', borderRadius: 3, marginBottom: 20, overflow: 'hidden' },
    progressBarFill: { height: '100%', borderRadius: 3 },
    dateStrip: { flexDirection: 'row' },
    dateItem: { width: 50, height: 70, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 12, borderWidth: 1, borderColor: 'transparent' },
    dateLabel: { fontSize: 10, fontWeight: '800' },
    dateDay: { fontSize: 18, fontWeight: '900', marginTop: 4 },
    dot: { width: 4, height: 4, borderRadius: 2, marginTop: 4 },
    tabsWrapper: { flexDirection: 'row', paddingHorizontal: 16, marginTop: 20, gap: 10, justifyContent: 'space-between' },
    tabItem: { flexDirection: 'row', alignItems: 'center', paddingBottom: 8, gap: 4 },
    tabLabel: { fontSize: 12, fontWeight: '800' },
    countBadge: { paddingHorizontal: 4, paddingVertical: 1, borderRadius: 8, minWidth: 16, alignItems: 'center' },
    countText: { color: 'white', fontSize: 10, fontWeight: '900' },
    listContent: { padding: 20, paddingBottom: 120 },
    taskCard: { flexDirection: 'row', borderRadius: 24, padding: 16, marginBottom: 16, alignItems: 'center', borderWidth: 1 },
    cardTimeColumn: { alignItems: 'center', width: 50, marginRight: 12 },
    taskTime: { fontSize: 13, fontWeight: '900' },
    timeLine: { width: 2, flex: 1, marginTop: 8, borderRadius: 1 },
    cardMain: { flex: 1 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FF3B3010', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    pulseDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FF3B30' },
    liveText: { color: '#FF3B30', fontSize: 8, fontWeight: '900' },
    taskName: { fontSize: 16, fontWeight: '800', marginBottom: 8 },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    meta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    metaText: { fontSize: 11, fontWeight: '700' },
    startInnerBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
    },
    startInnerBtnText: { color: 'white', fontSize: 10, fontWeight: '900' },
    emptyBox: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60, gap: 16 },
    emptyText: { fontSize: 14, fontWeight: '600' }
});
