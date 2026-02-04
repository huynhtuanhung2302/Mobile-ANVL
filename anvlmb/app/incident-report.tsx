import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
    Animated,
    Easing,
    Dimensions,
} from 'react-native';
import { useAppTheme } from '@/ctx/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { saveOfflineIncident } from '@/utils/offline-storage';
import ConfirmationPopup from '@/components/ConfirmationPopup';
import { useMission } from '@/ctx/MissionContext';
import { useAlertQueue } from '@/ctx/AlertQueueContext';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

// Interfaces for Media Types
interface MediaItem {
    id: string;
    type: 'photo' | 'video' | 'audio';
    uri: string;
    timestamp: string;
}

export default function IncidentReportScreen() {
    const { colors } = useAppTheme();
    const { missionState, submitReport } = useMission();
    const { queue } = useAlertQueue();
    const { incidentId, type } = useLocalSearchParams();

    // Attempt to get from missionState first, fallback to AlertQueue
    const activeMission = missionState.missions[incidentId as string];
    const alertFromQueue = queue.find(a => a.id === incidentId);

    // Unified data object
    const displayData = activeMission || (alertFromQueue ? {
        incidentId: alertFromQueue.id,
        type: alertFromQueue.type,
        priority: alertFromQueue.priority,
        location: alertFromQueue.location,
        startTime: alertFromQueue.timestamp,
        status: alertFromQueue.status,
        capturedImages: []
    } : null);

    const styles = dynamicStyles(colors);

    // State
    const [mediaList, setMediaList] = useState<MediaItem[]>(() => {
        if (displayData && displayData.capturedImages && displayData.capturedImages.length > 0) {
            return displayData.capturedImages.map(img => ({
                id: Math.random().toString(),
                type: 'photo' as const,
                uri: img,
                timestamp: new Date().toLocaleString()
            }));
        }
        return [];
    });
    const [status, setStatus] = useState<'success' | 'failure' | null>(null);
    const [note, setNote] = useState('');

    // UI State
    const [showPopup, setShowPopup] = useState(false);
    // const [showSuccessPopup, setShowSuccessPopup] = useState(false); // Removed for new logic
    const [showSuccess, setShowSuccess] = useState(false);
    const [countdown, setCountdown] = useState(5);

    const [showExitPopup, setShowExitPopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [recordingType, setRecordingType] = useState<'none' | 'photo' | 'video' | 'audio'>('none');

    // Animation state
    const syncRotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        let interval: any;
        if (showSuccess && countdown > 0) {
            interval = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        } else if (showSuccess && countdown === 0) {
            router.replace('/(tabs)');
        }
        return () => clearInterval(interval);
    }, [showSuccess, countdown]);

    const [recordDuration, setRecordDuration] = useState(0);
    const recordingTimer = useRef<any>(null);

    // --- Actions ---
    const startPhoto = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setRecordingType('photo');
    };

    const capturePhoto = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        const newItem: MediaItem = {
            id: Date.now().toString(),
            type: 'photo',
            uri: `IMG_${Date.now()}.jpg`,
            timestamp: new Date().toLocaleTimeString()
        };
        setMediaList([...mediaList, newItem]);
        setRecordingType('none');
    };

    const startVideo = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setRecordingType('video');
        setRecordDuration(0);
        recordingTimer.current = setInterval(() => {
            setRecordDuration(prev => prev + 1);
        }, 1000);
    };

    const stopVideo = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        if (recordingTimer.current) clearInterval(recordingTimer.current);
        const newItem: MediaItem = {
            id: Date.now().toString(),
            type: 'video',
            uri: `VID_${Date.now()}.mp4`,
            timestamp: `${recordDuration}s`
        };
        setMediaList([...mediaList, newItem]);
        setRecordingType('none');
    };

    const toggleAudio = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        if (recordingType === 'audio') {
            if (recordingTimer.current) clearInterval(recordingTimer.current);
            const newItem: MediaItem = {
                id: Date.now().toString(),
                type: 'audio',
                uri: `AUD_${Date.now()}.mp3`,
                timestamp: `${recordDuration}s`
            };
            setMediaList([...mediaList, newItem]);
            setRecordingType('none');
        } else {
            setRecordingType('audio');
            setRecordDuration(0);
            recordingTimer.current = setInterval(() => {
                setRecordDuration(prev => prev + 1);
            }, 1000);
        }
    };

    const removeMedia = (id: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setMediaList(mediaList.filter(item => item.id !== id));
    };

    const handleSubmit = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setShowPopup(true);
    };

    const handleBackPress = () => {
        if (mediaList.length > 0 || note.trim().length > 0 || status !== null) {
            setShowExitPopup(true);
        } else {
            router.back();
        }
    };

    const confirmSubmit = async () => {
        setShowPopup(false);
        setLoading(true);
        startSyncAnimation();

        const payload = {
            incidentId: (incidentId as string) || '402',
            type: (type as string) || 'Báo cáo',
            note: note || '',
            status: status,
            media: mediaList,
            timestamp: new Date().toISOString(),
        };

        try {
            await new Promise(resolve => setTimeout(resolve, 3000));
            await saveOfflineIncident(payload);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setLoading(false);
            setIsSyncing(false);
            setLoading(false);
            setIsSyncing(false);
            submitReport(incidentId as string);
            setShowSuccess(true);
            setCountdown(5);
            // setShowSuccessPopup(true); // Removed
            // router.push('/(tabs)'); // Moved to popup confirm
        } catch (error) {
            setLoading(false);
            setIsSyncing(false);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Lỗi', 'Không thể xử lý báo cáo.');
        }
    };

    const startSyncAnimation = () => {
        setIsSyncing(true);
        Animated.loop(
            Animated.timing(syncRotateAnim, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    };

    const renderMediaItem = (item: MediaItem) => {
        let iconName: any = 'image';
        let color = colors.primary;
        if (item.type === 'video') { iconName = 'videocam'; color = colors.warning; }
        if (item.type === 'audio') { iconName = 'mic'; color = colors.safe; }

        return (
            <View key={item.id} style={styles.mediaThumbnailContainer}>
                <View style={styles.mediaThumbnail}>
                    <View style={[styles.thumbnailIcon, { backgroundColor: color + '20' }]}>
                        <Ionicons name={iconName} size={20} color={color} />
                    </View>
                    <TouchableOpacity style={styles.thumbnailDelete} onPress={() => removeMedia(item.id)}>
                        <Ionicons name="close-circle" size={14} color={colors.danger} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.thumbnailLabel} numberOfLines={1}>
                    {item.uri.split('_').pop() || 'FILE'}
                </Text>
            </View>
        );
    };

    const isFormValid = mediaList.length > 0 && status !== null;

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Tactical Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBackPress} style={styles.backBtn}>
                        <Ionicons name="chevron-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <View style={styles.headerInfo}>
                        <Text style={styles.headerSubtitle}>COMMAND INTERFACE</Text>
                        <Text style={styles.headerTitle}>
                            {activeMission && activeMission.type !== 'Tuần tra' ? 'Báo cáo sự vụ' : 'Báo cáo sự cố'}
                        </Text>
                    </View>
                    <View style={styles.headerBadge}>
                        <Text style={styles.headerBadgeText}>#{incidentId || 'SYS-ID'}</Text>
                    </View>
                </View>

                {/* Evidence Section */}
                <View style={styles.sectionHeader}>
                    <Ionicons name="images" size={14} color={colors.primary} />
                    <Text style={styles.sectionTitle}>BẰNG CHỨNG HIỆN TRƯỜNG</Text>
                </View>

                {mediaList.length > 0 ? (
                    <View style={styles.mediaList}>
                        {mediaList.map(renderMediaItem)}
                    </View>
                ) : (
                    <View style={styles.emptyMedia}>
                        <Text style={styles.emptyMediaText}>Chưa có bằng chứng được ghi nhận</Text>
                    </View>
                )}

                <View style={styles.captureActions}>
                    <TouchableOpacity style={styles.captureBtn} onPress={startPhoto}>
                        <View style={[styles.captureIcon, { backgroundColor: colors.primary + '20' }]}>
                            <Ionicons name="camera" size={24} color={colors.primary} />
                        </View>
                        <Text style={styles.captureLabel}>Ảnh</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.captureBtn} onPress={startVideo}>
                        <View style={[styles.captureIcon, { backgroundColor: colors.warning + '20' }]}>
                            <Ionicons name="videocam" size={24} color={colors.warning} />
                        </View>
                        <Text style={styles.captureLabel}>Video</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.captureBtn, recordingType === 'audio' && styles.recordingBtn]} onPress={toggleAudio}>
                        <View style={[styles.captureIcon, recordingType === 'audio' ? { backgroundColor: 'white' } : { backgroundColor: colors.safe + '20' }]}>
                            <Ionicons name={recordingType === 'audio' ? "stop" : "mic"} size={24} color={recordingType === 'audio' ? colors.safe : colors.safe} />
                        </View>
                        <Text style={styles.captureLabel}>{recordingType === 'audio' ? `${recordDuration}s` : "Ghi âm"}</Text>
                    </TouchableOpacity>
                </View>

                {/* Processing Status Section */}
                <View style={styles.sectionHeader}>
                    <Ionicons name="shield-checkmark" size={14} color={colors.primary} />
                    <Text style={styles.sectionTitle}>TRẠNG THÁI XỬ LÝ</Text>
                </View>

                <View style={styles.statusGrid}>
                    <TouchableOpacity
                        style={[styles.statusItem, status === 'success' && styles.statusSafeSelected]}
                        onPress={() => { setStatus('success'); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }}
                    >
                        <Ionicons name="checkmark-circle" size={28} color={status === 'success' ? 'white' : colors.safe} />
                        <Text style={[styles.statusLabelText, status === 'success' && { color: 'white' }]}>THÀNH CÔNG</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.statusItem, status === 'failure' && styles.statusDangerSelected]}
                        onPress={() => { setStatus('failure'); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }}
                    >
                        <Ionicons name="close-circle" size={28} color={status === 'failure' ? 'white' : colors.danger} />
                        <Text style={[styles.statusLabelText, status === 'failure' && { color: 'white' }]}>THẤT BẠI</Text>
                    </TouchableOpacity>
                </View>

                {/* Quick Tags Section */}
                <View style={styles.sectionHeader}>
                    <Ionicons name="flash" size={14} color={colors.primary} />
                    <Text style={styles.sectionTitle}>CHỌN NHANH GHI CHÚ</Text>
                </View>

                <View style={styles.tagCloud}>
                    {['Đã ổn định', 'Đối tượng bỏ trốn', 'Cần hỗ trợ', 'Sai phạm PT'].map(tag => (
                        <TouchableOpacity
                            key={tag}
                            style={styles.tacticalTag}
                            onPress={() => {
                                setNote(prev => {
                                    const currentNote = prev || '';
                                    if (currentNote.includes(tag)) return currentNote;
                                    return currentNote ? `${currentNote} • ${tag}` : tag;
                                });
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            }}
                        >
                            <Text style={styles.tagText}>{tag.toUpperCase()}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Explanatory Note Section */}
                <View style={styles.sectionHeader}>
                    <Ionicons name="create" size={14} color={colors.primary} />
                    <Text style={styles.sectionTitle}>GHI CHÚ GIẢI TRÌNH</Text>
                </View>

                <View style={styles.glassInputContainer}>
                    <TextInput
                        style={styles.tacticalInput}
                        placeholder="Nhập nội dung báo cáo sự vụ..."
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        multiline
                        value={note}
                        onChangeText={setNote}
                    />
                </View>

                {/* Submit Section */}
                <TouchableOpacity
                    style={[styles.heavySubmitBtn, (!isFormValid || loading) && styles.disabledBtn]}
                    onPress={handleSubmit}
                    disabled={!isFormValid || loading}
                >
                    {loading ? <ActivityIndicator color="white" /> : (
                        <Text style={styles.submitBtnText}>XÁC NHẬN GỬI BÁO CÁO SỰ CỐ</Text>
                    )}
                </TouchableOpacity>

            </ScrollView>

            {/* Sync Overlay */}
            {isSyncing && (
                <View style={styles.syncOverlay}>
                    <Animated.View style={{
                        transform: [{
                            rotate: syncRotateAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0deg', '360deg']
                            })
                        }]
                    }}>
                        <Ionicons name="sync" size={60} color={colors.primary} />
                    </Animated.View>
                    <Text style={styles.syncText}>ĐANG ĐỒNG BỘ BÁO CÁO...</Text>
                </View>
            )}

            {/* Camera Overlay Mock */}
            {(recordingType === 'photo' || recordingType === 'video') && (
                <View style={styles.camOverlay}>
                    <View style={styles.camOSD}>
                        <View style={styles.osdGrid} />
                        <View style={styles.camStats}>
                            <View style={styles.recIndicator}>
                                <View style={[styles.recDot, recordingType === 'video' ? { backgroundColor: 'red' } : {}]} />
                                <Text style={styles.osdText}>{recordingType === 'video' ? `REC: ${recordDuration}s` : "CAMERA_OSD"}</Text>
                            </View>
                            <Text style={styles.osdText}>RESOLUTION: 4K_TACTICAL</Text>
                        </View>
                    </View>
                    <View style={styles.camFooter}>
                        <TouchableOpacity style={styles.camCancel} onPress={() => setRecordingType('none')}>
                            <Text style={styles.camCancelText}>HỦY</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.camTrigger} onPress={recordingType === 'photo' ? capturePhoto : stopVideo}>
                            <View style={[styles.camInner, recordingType === 'video' && { borderRadius: 4 }]} />
                        </TouchableOpacity>
                        <View style={{ width: 60 }} />
                    </View>
                </View>
            )}

            <ConfirmationPopup
                isVisible={showPopup}
                title="Gửi báo cáo sự cố?"
                message="Dữ liệu hiện trường sẽ được đồng bộ ngay lập tức về Trung tâm Chỉ huy (IOC)."
                onConfirm={confirmSubmit}
                onCancel={() => setShowPopup(false)}
            />

            <ConfirmationPopup
                isVisible={showExitPopup}
                title="Hủy báo cáo sự cố?"
                message="Dữ liệu chưa được gửi sẽ bị xóa vĩnh viễn khỏi bộ nhớ đệm."
                confirmText="XÓA & THOÁT"
                cancelText="Ở LẠI"
                type="danger"
                onConfirm={() => { setShowExitPopup(false); router.back(); }}
                onCancel={() => setShowExitPopup(false)}
            />

            {/* Success Overlay */}
            {showSuccess && (
                <View style={styles.syncOverlay}>
                    <View style={styles.successCard}>
                        <Ionicons name="checkmark-circle" size={80} color={colors.safe} />
                        <Text style={styles.successTitle}>BÁO CÁO ĐÃ GỬI!</Text>
                        <Text style={styles.successDesc}>Sự cố đã được đồng bộ lên Trung tâm Chỉ huy.</Text>

                        <Text style={styles.countdownText}>Tự động về trang chủ sau {countdown}s</Text>

                        <TouchableOpacity
                            style={styles.homeBtn}
                            onPress={() => router.replace('/(tabs)')}
                        >
                            <Text style={styles.homeBtnText}>VỀ TRANG CHỦ NGAY</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </KeyboardAvoidingView>
    );
}

const dynamicStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.base,
    },
    scrollContent: {
        paddingBottom: 120,
    },
    header: {
        paddingTop: 60,
        paddingBottom: 24,
        paddingHorizontal: 20,
        backgroundColor: colors.surface,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    backBtn: {
        marginRight: 16,
    },
    headerInfo: {
        flex: 1,
    },
    headerSubtitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: colors.primary,
        letterSpacing: 2,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
    },
    headerBadge: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    headerBadgeText: {
        color: colors.text,
        fontSize: 10,
        fontFamily: 'monospace',
        fontWeight: '700',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 20,
        marginTop: 24,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: colors.muted,
        letterSpacing: 1.5,
    },
    mediaList: {
        paddingHorizontal: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    mediaThumbnailContainer: {
        width: (width - 64) / 4,
        alignItems: 'center',
        gap: 4,
    },
    mediaThumbnail: {
        width: '100%',
        height: (width - 64) / 4,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    thumbnailLabel: {
        color: colors.muted,
        fontSize: 8,
        fontWeight: '700',
        textAlign: 'center',
        width: '100%',
    },
    thumbnailIcon: {
        width: '60%',
        height: '60%',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    thumbnailDelete: {
        position: 'absolute',
        top: -6,
        right: -6,
        padding: 4,
    },
    emptyMedia: {
        paddingHorizontal: 20,
        paddingVertical: 30,
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.02)',
        marginHorizontal: 20,
        borderRadius: 20,
        borderStyle: 'dashed',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    emptyMediaText: {
        color: colors.muted,
        fontSize: 12,
        fontWeight: '600',
    },
    captureActions: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginTop: 16,
        gap: 12,
    },
    captureBtn: {
        flex: 1,
        alignItems: 'center',
    },
    captureIcon: {
        width: 60,
        height: 60,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    captureLabel: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    recordingBtn: {
        // Style for active state
    },
    statusGrid: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 12,
    },
    statusItem: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        gap: 8,
    },
    statusSafeSelected: {
        backgroundColor: colors.safe,
        borderColor: colors.safe,
    },
    statusDangerSelected: {
        backgroundColor: colors.danger,
        borderColor: colors.danger,
    },
    statusLabelText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: colors.muted,
        letterSpacing: 1,
    },
    tagCloud: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 20,
        gap: 8,
    },
    tacticalTag: {
        backgroundColor: 'rgba(10, 132, 255, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(10, 132, 255, 0.2)',
    },
    tagText: {
        color: colors.primary,
        fontSize: 9,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    glassInputContainer: {
        marginHorizontal: 20,
        backgroundColor: colors.surface,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.text + '15',
        padding: 16,
    },
    tacticalInput: {
        color: colors.text,
        fontSize: 14,
        fontWeight: '600',
        minHeight: 100,
        textAlignVertical: 'top',
    },
    heavySubmitBtn: {
        margin: 20,
        backgroundColor: colors.primary,
        height: 64,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 15,
        elevation: 10,
    },
    submitBtnText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1.5,
    },
    disabledBtn: {
        opacity: 0.4,
    },
    syncOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.9)',
        zIndex: 1000,
        justifyContent: 'center',
        alignItems: 'center',
    },
    syncText: {
        color: colors.primary,
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 20,
        letterSpacing: 2,
    },
    camOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'black',
        zIndex: 2000,
    },
    camOSD: {
        flex: 1,
        padding: 20,
        paddingTop: 60,
    },
    osdGrid: {
        ...StyleSheet.absoluteFillObject,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        margin: 40,
    },
    camStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    recIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    recDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#FF3B30',
    },
    osdText: {
        color: 'white',
        fontSize: 10,
        fontFamily: 'monospace',
        fontWeight: 'bold',
    },
    camFooter: {
        paddingBottom: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    camCancel: {
        width: 60,
    },
    camCancelText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    camTrigger: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    camInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'white',
    },
    successCard: {
        backgroundColor: colors.surface,
        width: '85%',
        padding: 30,
        borderRadius: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.safe,
    },
    successTitle: {
        color: colors.text,
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 16,
        letterSpacing: 1,
    },
    successDesc: {
        color: colors.muted,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
    },
    countdownText: {
        color: colors.primary,
        fontSize: 12,
        marginBottom: 24,
        fontWeight: 'bold',
    },
    homeBtn: {
        backgroundColor: colors.text + '10',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.text + '20',
    },
    homeBtnText: {
        color: colors.text,
        fontWeight: 'bold',
        fontSize: 12,
    },
});

