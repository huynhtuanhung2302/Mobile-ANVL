import React, { useEffect, useRef, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Animated,
    Dimensions,
    TouchableOpacity,
    PanResponder,
} from 'react-native';
import { useAppTheme } from '@/ctx/ThemeContext';
import { useMission } from '@/ctx/MissionContext';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

// Sound Visualizer component
const SoundVisualizer = ({ pulseAnim }: { pulseAnim: Animated.Value }) => {
    const bars = [0, 1, 2, 3, 4, 5, 6, 7];
    return (
        <View style={styles_visualizer.container}>
            {bars.map((i) => (
                <Animated.View
                    key={i}
                    style={[
                        styles_visualizer.bar,
                        {
                            transform: [{
                                scaleY: pulseAnim.interpolate({
                                    inputRange: [1, 1.2],
                                    outputRange: [1, 3 + Math.random() * 2],
                                })
                            }],
                            opacity: pulseAnim.interpolate({
                                inputRange: [1, 1.2],
                                outputRange: [0.3, 1],
                            }),
                        },
                    ]}
                />
            ))}
        </View>
    );
};

export default function AlertOverlay() {
    const { colors } = useAppTheme();
    const { missionState, acceptMission, confirmBriefing } = useMission();

    // Derived state from Mission Context
    const isVisible = missionState.status === 'RINGING' && missionState.data !== null;
    const alertData = missionState.data;

    const pulseAnim = useRef(new Animated.Value(1)).current;
    const backgroundPulseAnim = useRef(new Animated.Value(0)).current;
    const pan = useRef(new Animated.Value(0)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;

    const [isEscalated, setIsEscalated] = useState(false);
    const escalationTimer = useRef<any>(null);

    const SLIDE_WIDTH = width - 80;
    const SLIDE_THRESHOLD = SLIDE_WIDTH * 0.7;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dx > 0 && gestureState.dx < SLIDE_WIDTH - 60) {
                    pan.setValue(gestureState.dx);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dx > SLIDE_THRESHOLD) {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    Animated.timing(pan, {
                        toValue: SLIDE_WIDTH - 60,
                        duration: 200,
                        useNativeDriver: true,
                    }).start(() => {
                        handleAccept();
                        pan.setValue(0);
                    });
                } else {
                    Animated.spring(pan, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    const handleAccept = () => {
        // Final guard check
        if (missionState.status !== 'RINGING' && missionState.status !== 'IDLE') {
            console.warn('[AlertOverlay] Accept rejected: Another mission is active', missionState.status);
            pan.setValue(0);
            return;
        }

        // Trigger state change. 
        // Navigation is now handled by MissionNavigationHandler based on 'BRIEFING' state.
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        acceptMission();

        // Reset slider immediately
        pan.setValue(0);
    };

    useEffect(() => {
        if (isVisible) {
            setIsEscalated(false);

            // Continuous heavy haptics for critical alert
            const hapticInterval = setInterval(() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            }, 1000);

            // Escalation timer: 30 seconds
            escalationTimer.current = setTimeout(() => {
                setIsEscalated(true);
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            }, 30000);

            // Heartbeat Pulse (120 BPM = 0.5s per cycle)
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.15,
                        duration: 150,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 100,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1.1,
                        duration: 150,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 600,
                        useNativeDriver: true,
                    }),
                ])
            ).start();

            // Background Flash Pulse
            Animated.loop(
                Animated.sequence([
                    Animated.timing(backgroundPulseAnim, {
                        toValue: 0.6,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                    Animated.timing(backgroundPulseAnim, {
                        toValue: 0,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ])
            ).start();

            // Glow Animation
            Animated.loop(
                Animated.sequence([
                    Animated.timing(glowAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(glowAnim, {
                        toValue: 0,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();

            return () => {
                clearInterval(hapticInterval);
                if (escalationTimer.current) clearTimeout(escalationTimer.current);
            };
        }
    }, [isVisible]);

    const styles = dynamicStyles(colors);

    // Guard clause: Only render if Visible AND Data exists
    if (!isVisible || !alertData) return null;

    return (
        <View style={styles.overlay}>
            {/* Background Layer with Pulsating Scrim */}
            <Animated.View style={[styles.backgroundPulse, { opacity: backgroundPulseAnim }]} />

            <View style={styles.content}>
                {/* Tactical Header with Visualizer */}
                <SoundVisualizer pulseAnim={pulseAnim} />

                <Animated.View style={[styles.iconContainer, { transform: [{ scale: pulseAnim }] }]}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="warning" size={70} color="white" />
                        <Animated.View style={[styles.neonGlow, { opacity: glowAnim }]} />
                    </View>
                </Animated.View>

                <Text style={[styles.alertTitle, isEscalated && styles.alertTitleEscalated]}>
                    {alertData.type.toUpperCase()}
                </Text>

                <View style={styles.severityContainer}>
                    <View style={[styles.severityBadge, { backgroundColor: alertData.priority === 'Khẩn cấp' || alertData.priority === 'CRITICAL' ? '#000' : 'rgba(0,0,0,0.5)' }]}>
                        <Text style={styles.severityText}>{alertData.priority.toUpperCase()}</Text>
                    </View>
                </View>

                {/* Glassmorphism Note Container */}
                <View style={styles.noteContainer}>
                    <View style={styles.noteHeader}>
                        <Ionicons name="megaphone" size={12} color="white" />
                        <Text style={styles.noteLabel}>CHỈ THỊ TỪ TRUNG TÂM:</Text>
                    </View>
                    <Text style={styles.noteText}>{alertData.note || 'Di chuyển đến hiện trường ngay lập tức.'}</Text>
                </View>

                {/* Tactical Location Badge */}
                <View style={styles.locationBadge}>
                    <Ionicons name="location" size={16} color="white" />
                    <Text style={styles.locationText}>
                        {alertData.location.zone} • {alertData.location.building} • {alertData.location.floor}
                    </Text>
                </View>

                <Text style={styles.incidentId}>CASE ID: #{alertData.incidentId}</Text>

                {isEscalated && (
                    <Animated.View style={[styles.escalationBadge, { transform: [{ scale: pulseAnim }] }]}>
                        <Ionicons name="alert-circle" size={14} color="white" />
                        <Text style={styles.escalationBadgeText}>CHƯA PHẢN HỒI - ĐANG LEO THANG</Text>
                    </Animated.View>
                )}

                {/* Tactical Slider */}
                <View style={[styles.sliderContainer, { width: SLIDE_WIDTH }]}>
                    <View style={styles.sliderTrack}>
                        <Animated.View
                            style={[
                                styles.sliderButton,
                                { transform: [{ translateX: pan }] }
                            ]}
                            {...panResponder.panHandlers}
                        >
                            <Ionicons name="arrow-forward" size={28} color={colors.danger} />
                        </Animated.View>
                        <View style={styles.sliderTextContainer}>
                            <Text style={styles.sliderText}>TRƯỢT ĐỂ NHẬN LỆNH</Text>
                        </View>
                        {/* Animated track gradient effect */}
                        <Animated.View style={[styles.trackGlow, {
                            width: SLIDE_WIDTH,
                            transform: [{
                                scaleX: pan.interpolate({
                                    inputRange: [0, SLIDE_WIDTH - 60],
                                    outputRange: [60 / SLIDE_WIDTH, 1]
                                })
                            }, {
                                translateX: -SLIDE_WIDTH / 2 + 30 // Keep left-aligned during scale
                            }, {
                                translateX: SLIDE_WIDTH / 2 - 30 // Correcting for scale origin
                            }],
                            backgroundColor: colors.safe
                        }]} />
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles_visualizer = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        height: 60,
        gap: 4,
        marginBottom: 20,
    },
    bar: {
        width: 4,
        height: 15, // Base height
        backgroundColor: 'white',
        borderRadius: 2,
    }
});

const dynamicStyles = (colors: any) => StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: colors.danger,
        zIndex: 9999,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundPulse: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'black',
    },
    content: {
        alignItems: 'center',
        width: '100%',
        padding: 24,
    },
    iconContainer: {
        marginBottom: 24,
    },
    iconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    neonGlow: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 60,
        borderWidth: 8,
        borderColor: 'white',
        opacity: 0.5,
    },
    alertTitle: {
        fontSize: 34,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        letterSpacing: -1,
        marginBottom: 8,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 10,
    },
    severityContainer: {
        marginBottom: 24,
    },
    severityBadge: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: 'white',
    },
    severityText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    noteContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.12)', // Glassmorphism
        padding: 18,
        borderRadius: 20,
        width: '100%',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.25)',
    },
    noteHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
        opacity: 0.8,
    },
    noteLabel: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    noteText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '800',
        lineHeight: 24,
    },
    locationBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        marginBottom: 12,
    },
    locationText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '700',
    },
    incidentId: {
        fontSize: 12,
        color: 'white',
        opacity: 0.6,
        fontWeight: '700',
        fontFamily: 'monospace',
    },
    sliderContainer: {
        marginTop: 40,
    },
    sliderTrack: {
        height: 64,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        borderRadius: 32,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 4,
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        overflow: 'hidden',
    },
    trackGlow: {
        position: 'absolute',
        left: 0,
        height: '100%',
        zIndex: 2, // Above text, below button
        opacity: 0.3,
    },
    sliderButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 5, // Higher than trackGlow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    sliderTextContainer: {
        position: 'absolute',
        width: '100%',
        alignItems: 'center',
        zIndex: 1,
    },
    sliderText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 1,
        opacity: 0.7,
    },
    alertTitleEscalated: {
        transform: [{ scale: 1.05 }],
    },
    escalationBadge: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        marginTop: 16,
    },
    escalationBadgeText: {
        color: colors.danger,
        fontSize: 10,
        fontWeight: 'bold',
    },
});

