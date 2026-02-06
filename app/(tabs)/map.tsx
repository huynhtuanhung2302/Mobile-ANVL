import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useAppTheme } from '@/ctx/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import LayerMenu from '@/components/LayerMenu';
import { useMission } from '@/ctx/MissionContext';
import ConfirmationPopup from '@/components/ConfirmationPopup';

const { width } = Dimensions.get('window');

// Mock Data (Static)
const mockMarkers = {
    alerts: [
        { id: 402, lat: 10.7769, lng: 106.7009, title: 'Cảnh báo #402', type: 'critical' },
        { id: 2, lat: 10.7779, lng: 106.7019, title: 'Sự vụ #403', type: 'warning' },
    ],
    cameras: [
        { id: 1, lat: 10.7774, lng: 106.7014, title: 'Camera 01', status: 'online' },
        { id: 2, lat: 10.7784, lng: 106.7024, title: 'Camera 02', status: 'online' },
        { id: 3, lat: 10.7764, lng: 106.7004, title: 'Camera 03', status: 'offline' },
    ],
    iot: [
        { id: 1, lat: 10.7771, lng: 106.7011, title: 'Cảm biến rung', value: '12%' },
        { id: 2, lat: 10.7781, lng: 106.7021, title: 'Cảm biến nhiệt', value: '28°C' },
    ],
    buildings: [
        { id: 1, name: 'Khu làm việc A', color: 'rgba(10, 132, 255, 0.2)' },
        { id: 2, name: 'Khu y tế', color: 'rgba(52, 199, 89, 0.2)' },
        { id: 3, name: 'Kho bãi', color: 'rgba(255, 204, 0, 0.2)' },
    ],
    zones: [
        { id: 1, name: 'Bãi xe', color: 'rgba(255, 149, 0, 0.15)' },
    ],
};

export default function MapRoutingScreen() {
    const { colors } = useAppTheme();
    // Removed unused startMission
    const { incidentId } = useLocalSearchParams();
    const styles = dynamicStyles(colors);

    // Layer Management
    const [showLayerMenu, setShowLayerMenu] = useState(false);
    const [visibleLayers, setVisibleLayers] = useState({
        alerts: true,
        cameras: true,
        iot: false,
        buildings: true,
        zones: false,
    });

    // GPS Simulation
    const [userLocation, setUserLocation] = useState({ lat: 10.7769, lng: 106.7009 });
    const [accuracy, setAccuracy] = useState(8); // meters

    // Routing State
    const [selectedDestination, setSelectedDestination] = useState<{
        id: string;
        title: string;
        type: string;
        floor?: string;
        steps?: { icon: string; text: string; completed: boolean }[];
        accessPoint?: string;
    } | null>(null);

    const [showConflictWarning, setShowConflictWarning] = useState(false);

    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    // Simulate GPS movement
    useEffect(() => {
        const interval = setInterval(() => {
            setUserLocation(prev => ({
                lat: prev.lat + (Math.random() - 0.5) * 0.0001,
                lng: prev.lng + (Math.random() - 0.5) * 0.0001,
            }));
            setAccuracy(Math.random() * 15 + 5); // 5-20m
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    // Handle incoming routing request from Alert Detail
    useEffect(() => {
        if (incidentId) {
            handleMarkerClick({ id: parseInt(incidentId as string), title: `Sự vụ #${incidentId}` });
        }
    }, [incidentId]);

    const handleToggleLayer = (layer: keyof typeof visibleLayers) => {
        setVisibleLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
    };

    const { missionState } = useMission();

    const handleMarkerClick = (marker: { id: number; title: string; type?: string }) => {
        // If it's an alert marker, check for mission conflict
        const isAlert = marker.title.includes('Cảnh báo') || marker.title.includes('Sự vụ') || marker.type === 'critical';

        setSelectedDestination({
            id: marker.id.toString(),
            title: marker.title,
            type: marker.type || 'location',
            floor: 'Tầng 4',
            accessPoint: 'Sảnh A',
            steps: [
                { icon: 'walk', text: 'Đi đến Sảnh A (Tòa B)', completed: true },
                { icon: 'business', text: 'Lên Tầng 4 bằng Thang máy số 2', completed: false },
                { icon: 'arrow-redo', text: 'Rẽ trái -> Phòng 402', completed: false },
            ]
        });
        setCurrentStepIndex(1); // Mock: user is at the building
    };

    const handleArrived = () => {
        if (incidentId) {
            // Logic handled by the user pressing "BÁO CÁO" on the banner
            // We'll just clear the local routing UI
            setSelectedDestination(null);
            router.push('/(tabs)');
        } else {
            // Clear routing
            setSelectedDestination(null);
        }
    };

    const handleRecenter = () => {
        // Mock: In real implementation, this would call map.animateToRegion()
        setAccuracy(8); // Reset to good accuracy
    };

    const renderMarkers = () => {
        const markers: React.ReactElement[] = [];

        // Alerts
        if (visibleLayers.alerts) {
            mockMarkers.alerts.forEach(alert => (
                markers.push(
                    <TouchableOpacity
                        key={`alert-${alert.id}`}
                        style={[styles.marker, styles.alertMarker]}
                        onPress={() => handleMarkerClick(alert)}
                    >
                        <View style={[styles.markerHalo, { borderColor: colors.danger }]} />
                        <Ionicons name="warning" size={16} color="white" />
                    </TouchableOpacity>
                )
            ));
        }

        // Cameras
        if (visibleLayers.cameras) {
            mockMarkers.cameras.forEach(camera => (
                markers.push(
                    <TouchableOpacity
                        key={`camera-${camera.id}`}
                        style={[styles.marker, styles.cameraMarker]}
                        onPress={() => handleMarkerClick({ id: camera.id, title: camera.title, type: 'camera' })}
                    >
                        <View style={[styles.markerHalo, { borderColor: colors.primary }]} />
                        <Ionicons name="videocam" size={14} color="white" />
                    </TouchableOpacity>
                )
            ));
        }

        // IoT
        if (visibleLayers.iot) {
            mockMarkers.iot.forEach(device => (
                markers.push(
                    <TouchableOpacity
                        key={`iot-${device.id}`}
                        style={[styles.marker, styles.iotMarker]}
                        onPress={() => handleMarkerClick({ id: device.id, title: device.title, type: 'iot' })}
                    >
                        <View style={[styles.markerHalo, { borderColor: colors.safe }]} />
                        <Ionicons name="hardware-chip" size={14} color="white" />
                    </TouchableOpacity>
                )
            ));
        }

        return markers;
    };

    return (
        <View style={styles.container}>
            {/* Map Placeholder with Mock Markers */}
            <View style={styles.mapPlaceholder}>

                {/* Simulated Neon Routing Path */}
                {(incidentId || selectedDestination) && (
                    <View style={styles.routingContainer}>
                        <View style={styles.neonPath} />
                        <View style={styles.neonPathGlow} />
                    </View>
                )}

                {/* Mock Buildings/Zones */}
                {visibleLayers.buildings && (
                    <View style={styles.buildingOverlay}>
                        <Text style={styles.buildingLabel}>KHU LÀM VIỆC A</Text>
                    </View>
                )}

                {/* Mock Markers */}
                <View style={styles.markersContainer}>
                    {renderMarkers()}
                </View>

                {/* User Location with Accuracy Circle */}
                <View style={styles.userLocationContainer}>
                    <View style={[styles.accuracyCircle, {
                        width: accuracy * 4,
                        height: accuracy * 4,
                    }]} />
                    <View style={styles.userDot} />
                    <Text style={styles.accuracyText}>{accuracy.toFixed(1)}M - ĐỘ CHÍNH XÁC</Text>
                </View>
            </View>

            {/* Floating Controls */}
            <View style={styles.floatingControls}>
                <TouchableOpacity style={styles.controlButton} onPress={() => setShowLayerMenu(true)}>
                    <Ionicons name="layers" size={24} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.controlButton}>
                    <Ionicons name="add" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.controlButton}>
                    <Ionicons name="remove" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.controlButton} onPress={handleRecenter}>
                    <Ionicons name="locate" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            {/* Navigation Info Card */}
            {(incidentId || selectedDestination) && (
                <View style={styles.infoCardContainer}>
                    <View style={styles.infoCard}>
                        <View style={styles.dragHandle} />

                        <View style={styles.cardHeader}>
                            <View style={styles.timeContainer}>
                                <Text style={styles.etaText}>4 PHÚT</Text>
                                <Text style={styles.distText}>CÒN 1.2 KM</Text>
                                {incidentId ? (
                                    <Text style={styles.incidentLabel}>SỰ VỤ #{incidentId}</Text>
                                ) : selectedDestination ? (
                                    <Text style={styles.destinationLabel}>{selectedDestination.title.toUpperCase()}</Text>
                                ) : null}
                            </View>

                            {selectedDestination?.floor && (
                                <View style={styles.floatingFloorBadge}>
                                    <Ionicons name="layers" size={14} color={colors.primary} />
                                    <Text style={styles.floorBadgeText}>{selectedDestination.floor.toUpperCase()}</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.infoContent}>
                            <View style={styles.stepsContainer}>
                                {selectedDestination?.steps?.map((step, index) => (
                                    <View key={index} style={styles.stepItem}>
                                        <View style={styles.stepIconCircle}>
                                            <Ionicons
                                                name={step.icon as any}
                                                size={12}
                                                color={colors.primary}
                                            />
                                        </View>
                                        <Text style={styles.stepText}>
                                            {step.text}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        <TouchableOpacity style={styles.arrivedButton} onPress={handleArrived}>
                            <Text style={styles.arrivedButtonText}>TÔI ĐÃ ĐẾN</Text>
                            <Ionicons name="checkmark-circle" size={22} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Layer Menu */}
            <LayerMenu
                visible={showLayerMenu}
                layers={visibleLayers}
                onToggle={handleToggleLayer}
                onClose={() => setShowLayerMenu(false)}
            />

        </View>
    );
}

const dynamicStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.base,
    },
    mapPlaceholder: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: colors.mode === 'light' ? '#E5E5EA' : '#050505',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buildingOverlay: {
        position: 'absolute',
        top: 100,
        left: 50,
        width: 150,
        height: 100,
        backgroundColor: 'rgba(52, 199, 89, 0.05)',
        borderWidth: 1.5,
        borderColor: 'rgba(52, 199, 89, 0.3)',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderStyle: 'dashed',
    },
    buildingLabel: {
        color: 'rgba(52, 199, 89, 0.8)',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    markersContainer: {
        ...StyleSheet.absoluteFillObject,
    },
    marker: {
        position: 'absolute',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        top: '40%',
        left: '50%',
        borderWidth: 2,
        borderColor: 'white',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 10,
    },
    markerHalo: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 18,
        borderWidth: 4,
        opacity: 0.3,
    },
    alertMarker: {
        backgroundColor: colors.danger,
        shadowColor: colors.danger,
        transform: [{ translateX: -18 }, { translateY: -18 }],
    },
    cameraMarker: {
        backgroundColor: colors.primary,
        shadowColor: colors.primary,
        transform: [{ translateX: 30 }, { translateY: -40 }],
    },
    iotMarker: {
        backgroundColor: colors.safe,
        shadowColor: colors.safe,
        transform: [{ translateX: -50 }, { translateY: 20 }],
    },
    userLocationContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    accuracyCircle: {
        position: 'absolute',
        borderRadius: 1000,
        borderWidth: 1.5,
        borderColor: 'rgba(10, 132, 255, 0.2)',
    },
    userDot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: colors.primary,
        borderWidth: 3,
        borderColor: 'white',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 12,
        elevation: 12,
    },
    accuracyText: {
        marginTop: 45,
        color: colors.muted,
        fontSize: 9,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    floatingControls: {
        position: 'absolute',
        right: 16,
        top: 60,
        backgroundColor: 'rgba(0,0,0,0.6)', // Tactical glass
        borderRadius: 16,
        padding: 6,
        gap: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    controlButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoCardContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: 12,
    },
    infoCard: {
        backgroundColor: 'rgba(20,20,20,0.95)', // Tactical Dark
        borderRadius: 28,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -12 },
        shadowOpacity: 0.4,
        shadowRadius: 24,
        elevation: 24,
    },
    dragHandle: {
        width: 36,
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    floatingFloorBadge: {
        backgroundColor: colors.primary + '20',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.primary + '40',
        gap: 6,
    },
    floorBadgeText: {
        color: colors.primary,
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    infoContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    timeContainer: {
        flex: 0.35,
    },
    etaText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.primary,
        letterSpacing: -1,
    },
    distText: {
        fontSize: 11,
        color: colors.muted,
        fontWeight: 'bold',
        marginTop: -2,
        letterSpacing: 0.5,
    },
    divider: {
        width: 1,
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.08)',
        marginHorizontal: 20,
    },
    stepsContainer: {
        flex: 1,
        gap: 8,
    },
    stepItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    stepIconCircle: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: colors.primary + '15',
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepText: {
        fontSize: 13,
        color: 'white',
        fontWeight: '700',
        opacity: 0.9,
    },
    arrivedButton: {
        backgroundColor: colors.primary,
        height: 60,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
    },
    arrivedButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1.5,
    },
    incidentLabel: {
        color: colors.danger,
        fontSize: 10,
        fontWeight: 'bold',
        marginTop: 6,
        letterSpacing: 1,
    },
    destinationLabel: {
        color: colors.primary,
        fontSize: 10,
        fontWeight: 'bold',
        marginTop: 6,
        letterSpacing: 1,
    },
    routingContainer: {
        position: 'absolute',
        width: 200,
        height: 150,
        top: '40%',
        left: '50%',
        transform: [{ translateX: -100 }, { translateY: -75 }],
    },
    neonPath: {
        position: 'absolute',
        width: 2,
        height: '100%',
        backgroundColor: colors.primary,
        left: '50%',
        opacity: 0.8,
    },
    neonPathGlow: {
        position: 'absolute',
        width: 10,
        height: '100%',
        backgroundColor: colors.primary,
        left: '48%',
        opacity: 0.2,
        borderRadius: 5,
    },
});

