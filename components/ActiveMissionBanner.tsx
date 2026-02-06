import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, ScrollView, Platform } from 'react-native';
import { useMission } from '@/ctx/MissionContext';
import { useAppTheme } from '@/ctx/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAlertQueue } from '@/ctx/AlertQueueContext';

export default function ActiveMissionBanner() {
    const { colors } = useAppTheme();
    const { missionState, setCurrentMission } = useMission();
    const { queue } = useAlertQueue();
    const { currentMissionId } = missionState;
    const [now, setNow] = useState(Date.now());

    // Update time every second for the elapsed timer
    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Source from AlertQueueContext to ensure absolute sync with the queue
    const activeAlerts = queue.filter(a => a.status === 'RECEIVED');

    if (activeAlerts.length === 0) return null;

    const formatElapsedTime = (timestamp: number) => {
        const seconds = Math.floor((now - timestamp) / 1000);
        if (seconds < 0) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const styles = dynamicStyles(colors);

    return (
        <View style={styles.outerContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {activeAlerts.map((alert) => {
                    const isActive = alert.id === currentMissionId;
                    const statusColor = '#FF3B30'; // Always Red for RECEIVED on dashboard

                    return (
                        <TouchableOpacity
                            key={alert.id}
                            style={[
                                styles.container,
                                { backgroundColor: statusColor + 'CC' },
                                isActive && styles.activeContainer
                            ]}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                setCurrentMission(alert.id);
                                // Navigate directly to report as per requirement
                                router.push({
                                    pathname: '/tactical-mission',
                                    params: { incidentId: alert.id }
                                } as any);
                            }}
                        >
                            <View style={styles.leftContent}>
                                <View style={styles.timerBadge}>
                                    <Text style={styles.timerText}>{formatElapsedTime(alert.timestamp)}</Text>
                                </View>
                                <View style={styles.textContent}>
                                    <Text style={styles.typeText}>{alert.type.toUpperCase()}</Text>
                                    <Text style={styles.locationText} numberOfLines={1}>
                                        {alert.location.building}
                                    </Text>
                                </View>
                            </View>

                            <Ionicons name="chevron-forward" size={16} color="white" style={{ opacity: 0.6 }} />
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const dynamicStyles = (colors: any) => StyleSheet.create({
    outerContainer: {
        marginTop: 12,
        height: 70,
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 12,
        alignItems: 'center',
    },
    container: {
        height: 54,
        minWidth: 160,
        borderRadius: 16,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
    activeContainer: {
        borderWidth: 2,
        borderColor: 'white',
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    timerBadge: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingHorizontal: 6,
        paddingVertical: 4,
        borderRadius: 8,
        marginRight: 10,
        minWidth: 45,
        alignItems: 'center',
    },
    timerText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    textContent: {
        flex: 1,
    },
    typeText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 9,
        letterSpacing: 0.5,
    },
    locationText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '700',
        marginTop: 1,
    },
});

