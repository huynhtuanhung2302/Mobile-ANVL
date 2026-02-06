import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOffline } from '@/ctx/OfflineContext';
import { useAppTheme } from '@/ctx/ThemeContext';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';

export default function OfflineIndicator() {
    const { offlineQueue, isOffline, retryAll } = useOffline();
    const { colors } = useAppTheme();

    if (offlineQueue.length === 0) return null;

    return (
        <Animated.View
            entering={FadeInUp.delay(200)}
            exiting={FadeOutUp}
            style={[styles.container, { backgroundColor: colors.warning }]}
        >
            <TouchableOpacity onPress={retryAll} activeOpacity={0.8} style={styles.content}>
                <Ionicons name={isOffline ? "cloud-offline" : "cloud-upload"} size={16} color="white" />
                <Text style={styles.text}>
                    {offlineQueue.length} dữ liệu đang chờ gửi {isOffline ? '(Offline)' : '(Chạm để thử lại)'}
                </Text>
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 60, // Adjust based on header height
        alignSelf: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        zIndex: 100,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
    }
});
