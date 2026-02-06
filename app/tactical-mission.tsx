import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Image, Platform, ScrollView, SafeAreaView } from 'react-native';
import { useAppTheme } from '@/ctx/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useAlertQueue } from '@/ctx/AlertQueueContext';
import * as Haptics from 'expo-haptics';

export default function TacticalMissionScreen() {
    const { colors, colorScheme } = useAppTheme();
    const { incidentId } = useLocalSearchParams();
    const { queue } = useAlertQueue();

    const [now, setNow] = useState(Date.now());
    const alert = queue.find(a => a.id === incidentId);

    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    if (!alert) {
        return (
            <View style={[styles.container, { backgroundColor: colors.base, justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: colors.text }}>Không tìm thấy thông tin sự vụ.</Text>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
                    <Text style={{ color: colors.primary }}>Quay lại</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handleArrived = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.push({
            pathname: '/incident-report',
            params: { incidentId: alert.id }
        } as any);
    };

    const handleOpenMap = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push({
            pathname: '/(tabs)/map',
            params: { incidentId: alert.id }
        });
    };

    // Mock Routing Steps
    const routingSteps = [
        { type: 'OUTDOOR', icon: 'navigate', text: 'Di chuyển theo trục đường chính đến Tòa nhà B', completed: true },
        { type: 'INDOOR', icon: 'business', text: 'Vào Sảnh Đông -> Lên Thang máy số 3', completed: false },
        { type: 'INDOOR', icon: 'layers', text: 'Lên Tầng 4 -> Rẽ trái cuối hành lang', completed: false },
        { type: 'INDOOR', icon: 'log-in', text: 'Cửa phòng 402 (Phòng Server)', completed: false },
    ];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.base }]}>
            {/* STICKY HEADER */}
            <View style={[styles.header, { borderBottomColor: colors.muted + '20' }]}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={[styles.headerSubtitle, { color: colors.muted }]}>TÁC CHIẾN HIỆN TRƯỜNG</Text>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>THÔNG TIN CHI TIẾT</Text>
                </View>
                <View style={styles.headerRight} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* 1. UNIFIED BRIEFING CARD (ID, Priority, Location, TOC Notes) */}
                <View style={[styles.card, { backgroundColor: colors.surface }]}>
                    <View style={styles.briefingHeader}>
                        <View style={styles.briefingIdCol}>
                            <Text style={[styles.label, { color: colors.muted }]}>MÃ SỰ VỤ</Text>
                            <Text style={[styles.alertIdMain, { color: colors.text }]}>#{alert.id.toUpperCase()}</Text>
                        </View>
                        <View style={[styles.severityBadgeBriefing, { backgroundColor: alert.priority === 'CRITICAL' ? colors.danger : colors.warning }]}>
                            <Text style={styles.severityTextBriefing}>{alert.priority}</Text>
                        </View>
                    </View>

                    <View style={styles.dividerBriefing} />

                    <View style={styles.sectionBriefing}>
                        <Text style={[styles.label, { color: colors.muted }]}>LOẠI CẢNH BÁO</Text>
                        <Text style={[styles.alertTypeMainBrief, { color: colors.danger }]}>{alert.type.toUpperCase()}</Text>
                    </View>

                    <View style={styles.sectionBriefing}>
                        <Text style={[styles.label, { color: colors.muted }]}>ĐỊA ĐIỂM CẢNH BÁO</Text>
                        <Text style={[styles.locationMainBrief, { color: colors.primary }]}>{alert.location.building} • {alert.location.floor}</Text>
                        <Text style={[styles.locationSubBrief, { color: colors.muted }]}>{alert.location.zone}</Text>
                    </View>

                    <View style={[styles.iocNoteBox, { backgroundColor: colors.primary + '10' }]}>
                        <View style={styles.iocHeader}>
                            <Ionicons name="information-circle" size={14} color={colors.primary} />
                            <Text style={[styles.iocLabel, { color: colors.primary }]}>NỘI DUNG XỬ LÝ</Text>
                        </View>
                        <Text style={[styles.descriptionText, { color: colors.text }]}>{alert.description || 'Tiếp cận hiện trường và xác minh tình hình.'}</Text>

                        {alert.iocNote && (
                            <>
                                <View style={[styles.dividerBriefing, { marginVertical: 12, height: 0.5, opacity: 0.3 }]} />
                                <View style={styles.iocHeader}>
                                    <Ionicons name="document-text" size={14} color={colors.primary} />
                                    <Text style={[styles.iocLabel, { color: colors.primary }]}>GHI CHÚ</Text>
                                </View>
                                <Text style={[styles.descriptionText, { color: colors.text, fontSize: 13, opacity: 0.8 }]}>{alert.iocNote}</Text>
                            </>
                        )}
                    </View>
                </View>

                {/* 2. TACTICAL MAP WIDGET (Enhanced) */}
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={handleOpenMap}
                    style={[styles.card, styles.mapWidget, { borderColor: colors.muted + '20' }]}
                >
                    <View style={styles.widgetHeader}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
                            <Ionicons name="navigate" size={16} color={colors.primary} />
                            <Text style={[styles.widgetTitle, { color: colors.muted }]}>BẢN ĐỒ DẪN ĐƯỜNG TÁC CHIẾN</Text>
                        </View>
                        <Ionicons name="expand" size={14} color={colors.muted} />
                    </View>
                    <View style={styles.mapFrame}>
                        <Image
                            source={{ uri: 'https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/106.7018,10.7765,15,0/600x300?access_token=pk.eyJ1IjoibW9ja2VydSIsImEiOiJjbTVoN3Qyam0wMXJpMmpzNDB4MThnaXp4In0.rL8O6E7v6E8Z9R5Rk8vG7A' }}
                            style={StyleSheet.absoluteFill}
                        />
                        <View style={styles.mapOverlay}>
                            <View style={[styles.routingLine, { borderLeftColor: colors.primary }]} />
                            <View style={[styles.targetMarker, { backgroundColor: colors.danger }]}>
                                <Ionicons name="flag" size={12} color="white" />
                            </View>
                            <View style={[styles.userMarker, { backgroundColor: colors.primary }]} />
                        </View>
                        {/* Map HUD Overlay */}
                        <View style={styles.mapHud}>
                            <Text style={styles.hudText}>0.8 KM • 3 PHÚT</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* 3. LỘ TRÌNH TIẾP CẬN (NEW) */}
                <View style={[styles.card, { backgroundColor: colors.surface }]}>
                    <View style={styles.widgetHeaderNoBorder}>
                        <Ionicons name="list" size={16} color={colors.primary} />
                        <Text style={[styles.widgetTitle, { color: colors.muted }]}>LỘ TRÌNH TIẾP CẬN</Text>
                    </View>

                    <View style={styles.stepList}>
                        {routingSteps.map((step, index) => (
                            <View key={index} style={styles.stepItem}>
                                <View style={styles.stepLeft}>
                                    <View style={[styles.stepDot, {
                                        backgroundColor: step.completed ? colors.safe : colors.muted + '40',
                                        borderColor: step.completed ? colors.safe : colors.muted + '60'
                                    }]}>
                                        {step.completed && <Ionicons name="checkmark" size={10} color="white" />}
                                    </View>
                                    {index < routingSteps.length - 1 && <View style={[styles.stepLine, { backgroundColor: colors.muted + '20' }]} />}
                                </View>
                                <View style={styles.stepRight}>
                                    <View style={styles.stepHeader}>
                                        <View style={[styles.stepBadge, { backgroundColor: step.type === 'INDOOR' ? colors.primary + '15' : colors.warning + '15' }]}>
                                            <Text style={[styles.stepBadgeText, { color: step.type === 'INDOOR' ? colors.primary : colors.warning }]}>
                                                {step.type}
                                            </Text>
                                        </View>
                                        <Ionicons name={step.icon as any} size={14} color={colors.muted} />
                                    </View>
                                    <Text style={[styles.stepText, { color: step.completed ? colors.muted : colors.text }]}>{step.text}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* 4. MEDIA EVIDENCE CARD */}
                <View style={[styles.card, { backgroundColor: colors.surface, padding: 0, overflow: 'hidden' }]}>
                    <View style={styles.mediaFrame}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1557597774-9d2739f85a76?q=80&w=800&auto=format&fit=crop' }}
                            style={styles.mediaImage}
                        />
                        <View style={styles.mediaOsd}>
                            <View style={[styles.recDot, { backgroundColor: colors.muted }]} />
                            <Text style={styles.osdText}>
                                {(alert as any).mediaType === 'video' ? 'Video ghi nhận' : 'Hình ảnh ghi nhận'}
                            </Text>
                        </View>
                    </View>
                </View>


                {/* 5. RESPONDER & DISTANCE CARD */}
                <View style={[styles.card, styles.responderCard, { backgroundColor: colors.surface }]}>
                    <View style={styles.responderInfo}>
                        <Text style={[styles.label, { color: colors.muted }]}>NHÂN VIÊN TIẾP NHẬN</Text>
                        <Text style={[styles.responderName, { color: colors.text }]}>Nhân viên 042 (Bạn)</Text>
                        <Text style={[styles.responderTeam, { color: colors.muted }]}>Đội phản ứng nhanh</Text>
                    </View>
                    <View style={[styles.distanceContainer, { borderLeftColor: colors.muted + '20' }]}>
                        <Text style={[styles.distanceValue, { color: colors.primary }]}>0.8</Text>
                        <Text style={[styles.distanceUnit, { color: colors.muted }]}>KM</Text>
                    </View>
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* FLOATING ACTION PANEL */}
            <View style={[styles.footer, { backgroundColor: colors.base, borderTopColor: colors.muted + '20' }]}>
                <TouchableOpacity
                    style={[styles.arriveBtn, { backgroundColor: colors.primary }]}
                    onPress={handleArrived}
                >
                    <Text style={styles.arriveBtnText}>XÁC NHẬN ĐÃ ĐẾN</Text>
                    <Ionicons name="checkmark-circle" size={22} color="white" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    backBtn: { padding: 4 },
    headerTitleContainer: { flex: 1, marginLeft: 12 },
    headerSubtitle: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
    headerTitle: { fontSize: 16, fontWeight: '800' },
    headerRight: { width: 32 },
    scrollView: { flex: 1 },
    scrollContent: { padding: 16, gap: 16 },
    card: {
        borderRadius: 24,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    label: { fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 4 },
    briefingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    briefingIdCol: { flex: 1 },
    alertIdMain: { fontSize: 24, fontWeight: '900' },
    severityBadgeBriefing: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
    severityTextBriefing: { color: 'white', fontSize: 11, fontWeight: '900' },
    dividerBriefing: { height: 1, backgroundColor: 'rgba(128,128,128,0.1)', marginVertical: 20 },
    sectionBriefing: { marginBottom: 16 },
    alertTypeMainBrief: { fontSize: 18, fontWeight: '900' },
    locationMainBrief: { fontSize: 20, fontWeight: '900' },
    locationSubBrief: { fontSize: 14, fontWeight: '600', marginTop: 2 },
    iocNoteBox: { padding: 16, borderRadius: 16, marginTop: 4 },
    iocHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
    iocLabel: { fontSize: 11, fontWeight: '900', letterSpacing: 0.5 },
    descriptionText: { fontSize: 15, fontWeight: '700', lineHeight: 22 },
    mapWidget: { padding: 0, overflow: 'hidden', borderWidth: 1 },
    widgetHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(128,128,128,0.1)' },
    widgetHeaderNoBorder: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingBottom: 16 },
    widgetTitle: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
    mapFrame: { height: 180, width: '100%', position: 'relative' },
    mapOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
    routingLine: { position: 'absolute', top: '30%', height: '40%', borderLeftWidth: 2, borderStyle: 'dashed', opacity: 0.5 },
    targetMarker: { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'white', position: 'absolute', top: '25%' },
    userMarker: { width: 10, height: 10, borderRadius: 5, position: 'absolute', bottom: '25%', borderWidth: 1.5, borderColor: 'white' },
    mapHud: { position: 'absolute', bottom: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    hudText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
    stepList: { gap: 0 },
    stepItem: { flexDirection: 'row', minHeight: 60 },
    stepLeft: { width: 30, alignItems: 'center' },
    stepDot: { width: 16, height: 16, borderRadius: 8, borderWidth: 2, justifyContent: 'center', alignItems: 'center', zIndex: 1, backgroundColor: 'transparent' },
    stepLine: { width: 2, flex: 1, marginVertical: 4 },
    stepRight: { flex: 1, paddingLeft: 8, paddingBottom: 20 },
    stepHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    stepBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    stepBadgeText: { fontSize: 8, fontWeight: '900' },
    stepText: { fontSize: 14, fontWeight: '700', lineHeight: 20 },
    mediaFrame: { height: 180, width: '100%', position: 'relative' },
    mediaImage: { width: '100%', height: '100%', opacity: 0.8 },
    mediaOsd: { position: 'absolute', top: 10, left: 10, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    recDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'red' },
    osdText: { color: 'white', fontSize: 9, fontWeight: 'bold' },
    divider: { height: 1, marginVertical: 12 },
    responderCard: { flexDirection: 'row', alignItems: 'center' },
    responderInfo: { flex: 1 },
    responderName: { fontSize: 16, fontWeight: 'bold' },
    responderTeam: { fontSize: 12, marginTop: 2 },
    distanceContainer: { paddingLeft: 16, borderLeftWidth: 1, alignItems: 'center' },
    distanceValue: { fontSize: 24, fontWeight: '900' },
    distanceUnit: { fontSize: 10, fontWeight: 'bold' },
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingTop: 16, paddingHorizontal: 20, paddingBottom: Platform.OS === 'ios' ? 40 : 20, borderTopWidth: 1 },
    arriveBtn: { height: 60, borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12 },
    arriveBtnText: { color: 'white', fontSize: 16, fontWeight: '900', letterSpacing: 0.5 }
});
