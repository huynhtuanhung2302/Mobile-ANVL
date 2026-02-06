import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Text, Alert, Vibration, Dimensions } from 'react-native';
import { useAppTheme } from '@/ctx/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    runOnJS,
    withTiming
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useSegments } from 'expo-router';

const { width, height } = Dimensions.get('window');
const BUTTON_SIZE = 72;

export default function GlobalSOS() {
    const { colors } = useAppTheme();
    const styles = dynamicStyles(colors);

    // Visibility Check
    const segments = useSegments();
    // Hide on Auth screens (login, register, etc.)
    const isAuth = segments[0] === 'auth';

    // Shared Values for Dragging
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const context = useSharedValue({ x: 0, y: 0 });

    // Animation Values for SOS Logic
    const scaleAnim = useSharedValue(1);
    const progressAnim = useSharedValue(0);

    // State
    const [pressing, setPressing] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const countdownInterval = useRef<any>(null);
    const timeoutRef = useRef<any>(null);

    const resetState = () => {
        setPressing(false);
        setCountdown(3);
        if (countdownInterval.current) clearInterval(countdownInterval.current);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        scaleAnim.value = withSpring(1);
        progressAnim.value = withTiming(0, { duration: 200 });
    };

    const handlePressIn = () => {
        if (isAuth) return; // double check
        setPressing(true);
        scaleAnim.value = withSpring(1.5);
        progressAnim.value = withTiming(1, { duration: 3000 });

        startCountdown();
    };

    const cancelCountdown = () => {
        setPressing(false);
        setCountdown(3);
        if (countdownInterval.current) clearInterval(countdownInterval.current);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        scaleAnim.value = withSpring(1);
        progressAnim.value = withTiming(0, { duration: 200 });
    };

    const startCountdown = () => {
        setCountdown(3);
        let count = 3;
        if (countdownInterval.current) clearInterval(countdownInterval.current);

        countdownInterval.current = setInterval(() => {
            count -= 1;
            setCountdown(count);
            if (count <= 0) {
                clearInterval(countdownInterval.current);
            }
        }, 1000);

        timeoutRef.current = setTimeout(() => {
            triggerSOS();
        }, 3000);
    };

    const triggerSOS = () => {
        resetState();
        Vibration.vibrate([0, 500, 200, 500]);
        Alert.alert('🚨 ĐÃ GỬI SOS', 'Đã gửi tín hiệu khẩn cấp đến chỉ huy!\n\nVị trí và thông tin đã được ghi nhận.');
    };

    // Unified Pan Gesture
    const pan = Gesture.Pan()
        .onBegin(() => {
            'worklet';
            runOnJS(handlePressIn)();
        })
        .onStart(() => {
            'worklet';
            context.value = { x: translateX.value, y: translateY.value };
        })
        .onUpdate((event) => {
            'worklet';
            // If moved significantly, cancel SOS
            if (Math.abs(event.translationX) > 10 || Math.abs(event.translationY) > 10) {
                runOnJS(cancelCountdown)();
            }
            translateX.value = context.value.x + event.translationX;
            translateY.value = context.value.y + event.translationY;
        })
        .onFinalize(() => {
            'worklet';
            runOnJS(cancelCountdown)(); // Ensure clean up on release

            // Snap to edge logic
            if (translateX.value > 0) {
                translateX.value = withSpring(width / 2 - BUTTON_SIZE / 2 - 20); // Right edge
            } else {
                translateX.value = withSpring(-(width / 2 - BUTTON_SIZE / 2 - 20)); // Left edge
            }
        });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
                { scale: scaleAnim.value }
            ],
            zIndex: 9999,
        };
    });

    const progressStyle = useAnimatedStyle(() => {
        return {
            opacity: progressAnim.value,
            transform: [{ scale: 0.9 + (progressAnim.value * 0.5) }]
        };
    });

    if (isAuth) return null;

    return (
        <View style={styles.container} pointerEvents="box-none">
            <GestureDetector gesture={pan}>
                <Animated.View style={[styles.button, animatedStyle]}>
                    <View style={styles.innerCircle}>
                        {pressing ? (
                            <>
                                <Text style={styles.countdownText}>{countdown}</Text>
                                <Text style={styles.cancelHint}>Trượt để Hủy</Text>
                            </>
                        ) : (
                            <>
                                <Ionicons name="alert-circle" size={32} color="white" />
                                <Text style={styles.text}>SOS</Text>
                            </>
                        )}
                    </View>

                    <Animated.View style={[styles.progressRing, progressStyle]} />
                </Animated.View>
            </GestureDetector>
        </View>
    );
}

const dynamicStyles = (colors: any) => StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        alignItems: 'center', // Centered initially
        justifyContent: 'center',
        zIndex: 9999,
    },
    button: {
        width: BUTTON_SIZE,
        height: BUTTON_SIZE,
        borderRadius: BUTTON_SIZE / 2,
        backgroundColor: colors.danger,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.danger,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 12,
        elevation: 10,
        borderWidth: 4,
        borderColor: colors.surface, // Adaptive border color
    },
    innerCircle: {
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
        marginTop: 2,
    },
    countdownText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 32,
        lineHeight: 36,
    },
    cancelHint: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 8,
        marginTop: 2,
        textTransform: 'uppercase',
    },
    progressRing: {
        position: 'absolute',
        width: BUTTON_SIZE + 12,
        height: BUTTON_SIZE + 12,
        borderRadius: (BUTTON_SIZE + 12) / 2,
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.6)',
        zIndex: 1,
    }
});
