import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useAppTheme } from '@/ctx/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useAlertQueue, AlertStatus } from '@/ctx/AlertQueueContext';
import { useMission } from '@/ctx/MissionContext';

// No static alerts here anymore, using live data from context

export default function AlertsTabScreen() {
    const { colors } = useAppTheme();
    const { queue } = useAlertQueue();
    const { setCurrentMission } = useMission();
    const params = useLocalSearchParams();
    const styles = dynamicStyles(colors);

    // Default to 'RECEIVED' as requested (Top priority)
    const [activeTab, setActiveTab] = React.useState<AlertStatus>((params.tab as AlertStatus) || 'UNPROCESSED');

    // Effect to sync tab from navigation params if needed
    React.useEffect(() => {
        if (params.tab) {
            setActiveTab(params.tab as AlertStatus);
        }
    }, [params.tab]);

    const currentAlerts = queue.filter(alert => alert.status === activeTab);

    const getStatusColor = (tab: AlertStatus) => {
        switch (tab) {
            case 'RECEIVED': return colors.danger;
            case 'UNPROCESSED': return colors.warning;
            case 'REPORTED': return colors.primary;
            case 'FINISHED': return colors.safe;
            default: return colors.primary;
        }
    };

    const statusColor = getStatusColor(activeTab);

    return (
        <View style={styles.container}>
            <View style={[styles.header, { backgroundColor: statusColor }]}>
                <Text style={styles.headerTitle}>DANH SÁCH CẢNH BÁO</Text>
            </View>

            {/* Tab Selector - 4 Tabs */}
            <View style={styles.tabContainer}>
                {[
                    { id: 'UNPROCESSED', label: 'CHỜ TIẾP NHẬN' },
                    { id: 'RECEIVED', label: 'ĐÃ TIẾP NHẬN' },
                    { id: 'REPORTED', label: 'ĐÃ BÁO CÁO' },
                    { id: 'FINISHED', label: 'KẾT THÚC' }
                ].map((tab) => {
                    const count = queue.filter(a => a.status === tab.id).length;
                    const isActive = activeTab === tab.id;
                    const tabColor = getStatusColor(tab.id as AlertStatus);

                    return (
                        <TouchableOpacity
                            key={tab.id}
                            style={[
                                styles.tabButton,
                                isActive && { backgroundColor: tabColor }
                            ]}
                            onPress={() => setActiveTab(tab.id as AlertStatus)}
                        >
                            <Text style={[styles.tabText, isActive && styles.activeTabText]}>{tab.label}</Text>
                            {count > 0 && (
                                <View style={[styles.tabBadge, !isActive && { backgroundColor: tabColor }]}>
                                    <Text style={styles.tabBadgeText}>{count}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>

            <FlatList
                data={currentAlerts}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.alertCard, { borderLeftColor: statusColor, borderColor: statusColor + '4D' }]}
                        onPress={() => {
                            if (activeTab === 'RECEIVED') {
                                // 1. RECEIVED -> Navigate to Map with routing
                                setCurrentMission(item.id);
                                router.navigate({
                                    pathname: '/tactical-mission',
                                    params: { incidentId: item.id }
                                } as any);
                            } else if (activeTab === 'UNPROCESSED') {
                                // 2. UNPROCESSED -> Navigate to Detail for briefing
                                router.push({
                                    pathname: '/alert-detail',
                                    params: {
                                        incidentId: item.id,
                                        alertType: item.type,
                                        severity: item.priority === 'CRITICAL' ? 'Khẩn cấp' : 'Bình thường',
                                        status: item.status,
                                        zone: item.location.zone,
                                        building: item.location.building,
                                        floor: item.location.floor,
                                        note: item.description,
                                        mediaUri: item.type === 'Xâm nhập trái phép' ? 'https://images.unsplash.com/photo-1557597774-9d2739f85a76?q=80&w=800' : 'https://images.unsplash.com/photo-1582139329536-e7284fece509?q=80&w=800'
                                    }
                                });
                            } else {
                                // 3. REPORTED/FINISHED -> Navigate to History Summary
                                router.push({
                                    pathname: '/alert-resolved-detail',
                                    params: {
                                        incidentId: item.id,
                                        alertType: item.type,
                                        severity: item.priority === 'CRITICAL' ? 'Khẩn cấp' : 'Bình thường',
                                        status: item.status,
                                        zone: item.location.zone,
                                        building: item.location.building,
                                        floor: item.location.floor,
                                        note: item.description,
                                        mediaUri: item.type === 'Xâm nhập trái phép' ? 'https://images.unsplash.com/photo-1557597774-9d2739f85a76?q=80&w=800' : 'https://images.unsplash.com/photo-1582139329536-e7284fece509?q=80&w=800'
                                    }
                                });
                            }
                        }}
                    >
                        <View style={styles.alertHeader}>
                            <View style={[styles.typeBadge, { backgroundColor: statusColor + '1A' }]}>
                                <Text style={[styles.typeBadgeText, { color: statusColor }]}>{item.type}</Text>
                            </View>
                            <Text style={styles.timeText}>Vừa xong</Text>
                        </View>
                        <Text style={styles.locationText}>
                            {item.location.zone} • {item.location.building} • {item.location.floor}
                        </Text>
                        <View style={styles.noteBox}>
                            <Text style={styles.noteText} numberOfLines={2}>{item.description || 'Không có ghi chú.'}</Text>
                        </View>
                        <View style={styles.actionRow}>
                            <Text style={[styles.severityText, { color: item.priority === 'CRITICAL' ? colors.danger : colors.warning }]}>
                                {item.priority.toUpperCase()}
                            </Text>

                            {activeTab === 'RECEIVED' && (
                                <View style={styles.buttonGroup}>
                                    <TouchableOpacity
                                        style={styles.secondaryButton}
                                        onPress={(e) => {
                                            e.stopPropagation();
                                            router.push({
                                                pathname: '/alert-detail',
                                                params: {
                                                    incidentId: item.id,
                                                    alertType: item.type,
                                                    severity: item.priority === 'CRITICAL' ? 'Khẩn cấp' : 'Bình thường',
                                                    status: item.status,
                                                    zone: item.location.zone,
                                                    building: item.location.building,
                                                    floor: item.location.floor,
                                                    note: item.description,
                                                    mediaUri: item.type === 'Xâm nhập trái phép' ? 'https://images.unsplash.com/photo-1557597774-9d2739f85a76?q=80&w=800' : 'https://images.unsplash.com/photo-1582139329536-e7284fece509?q=80&w=800'
                                                }
                                            });
                                        }}
                                    >
                                        <Ionicons name="information-circle-outline" size={16} color={colors.text} />
                                        <Text style={styles.secondaryButtonText}>CHI TIẾT</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.acceptButton, { backgroundColor: statusColor }]}
                                        onPress={(e) => {
                                            e.stopPropagation();
                                            setCurrentMission(item.id);
                                            router.navigate({
                                                pathname: '/tactical-mission',
                                                params: { incidentId: item.id }
                                            } as any);
                                        }}
                                    >
                                        <Text style={styles.acceptButtonText}>ĐẾN DẪN ĐƯỜNG</Text>
                                        <Ionicons name="navigate" size={16} color="white" />
                                    </TouchableOpacity>
                                </View>
                            )}

                            {activeTab === 'UNPROCESSED' && (
                                <View style={[styles.acceptButton, { backgroundColor: statusColor }]}>
                                    <Text style={styles.acceptButtonText}>CHI TIẾT</Text>
                                    <Ionicons name="eye" size={16} color="white" />
                                </View>
                            )}

                            {(activeTab === 'REPORTED' || activeTab === 'FINISHED') && (
                                <View style={[styles.acceptButton, { backgroundColor: statusColor }]}>
                                    <Text style={styles.acceptButtonText}>XEM BÁO CÁO</Text>
                                    <Ionicons name="document-text" size={16} color="white" />
                                </View>
                            )}
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
        justifyContent: 'center',
        padding: 24,
        paddingTop: 60,
        backgroundColor: colors.alert,
    },
    headerTitle: {
        color: colors.text,
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 8,
        paddingVertical: 12,
        backgroundColor: 'rgba(255,255,255,0.03)',
        gap: 6,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 14,
        backgroundColor: 'transparent',
        position: 'relative',
    },
    tabText: {
        fontSize: 8,
        fontWeight: '900',
        color: colors.muted,
        textAlign: 'center',
    },
    activeTabText: {
        color: 'white',
    },
    tabBadge: {
        position: 'absolute',
        top: 2,
        right: 2,
        backgroundColor: colors.danger,
        paddingHorizontal: 4,
        paddingVertical: 1,
        borderRadius: 6,
        minWidth: 14,
        alignItems: 'center',
    },
    tabBadgeText: {
        color: 'white',
        fontSize: 7,
        fontWeight: '900',
    },
    listContent: {
        padding: 20,
    },
    alertCard: {
        backgroundColor: colors.surface,
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.alert + '4D', // 30% opacity
        borderLeftWidth: 6,
        borderLeftColor: colors.alert,
    },
    alertHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    typeBadge: {
        backgroundColor: colors.alert + '1A', // 10% opacity
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    typeBadgeText: {
        color: colors.alert,
        fontSize: 12,
        fontWeight: 'bold',
    },
    timeText: {
        color: colors.muted,
        fontSize: 12,
    },
    locationText: {
        color: colors.text,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    severityText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    noteBox: {
        backgroundColor: colors.text + '05',
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
    },
    noteText: {
        color: colors.muted,
        fontSize: 13,
        fontStyle: 'italic',
    },
    buttonGroup: {
        flexDirection: 'row',
        gap: 8,
    },
    secondaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.text + '33',
        gap: 4,
    },
    secondaryButtonText: {
        color: colors.text,
        fontSize: 11,
        fontWeight: 'bold',
    },
    acceptButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.alert,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        gap: 4,
    },
    acceptButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
});
