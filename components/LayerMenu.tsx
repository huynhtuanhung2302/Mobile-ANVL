import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
import { useAppTheme } from '@/ctx/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface LayerMenuProps {
    visible: boolean;
    layers: {
        alerts: boolean;
        cameras: boolean;
        iot: boolean;
        buildings: boolean;
        zones: boolean;
    };
    onToggle: (layer: keyof LayerMenuProps['layers']) => void;
    onClose: () => void;
}

export default function LayerMenu({ visible, layers, onToggle, onClose }: LayerMenuProps) {
    const { colors } = useAppTheme();
    const styles = dynamicStyles(colors);

    const layerConfig = [
        { key: 'alerts' as const, label: 'Cảnh báo/Sự vụ', icon: 'warning', color: colors.danger },
        { key: 'cameras' as const, label: 'Camera', icon: 'videocam', color: colors.primary },
        { key: 'iot' as const, label: 'Thiết bị IoT', icon: 'hardware-chip', color: colors.safe },
        { key: 'buildings' as const, label: 'Tòa nhà', icon: 'business', color: colors.muted },
        { key: 'zones' as const, label: 'Khu vực', icon: 'map', color: colors.warning },
    ];

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableOpacity style={styles.backdrop} onPress={onClose} />
                <View style={styles.bottomSheet}>
                    <View style={styles.dragHandle} />
                    <Text style={styles.title}>Lớp hiển thị</Text>

                    {layerConfig.map((layer) => (
                        <TouchableOpacity
                            key={layer.key}
                            style={styles.layerItem}
                            onPress={() => onToggle(layer.key)}
                        >
                            <View style={styles.layerLeft}>
                                <Ionicons name={layer.icon as any} size={24} color={layer.color} />
                                <Text style={styles.layerLabel}>{layer.label}</Text>
                            </View>
                            <View style={[
                                styles.toggle,
                                layers[layer.key] && styles.toggleActive
                            ]}>
                                <View style={[
                                    styles.toggleThumb,
                                    layers[layer.key] && styles.toggleThumbActive
                                ]} />
                            </View>
                        </TouchableOpacity>
                    ))}

                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Đóng</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const dynamicStyles = (colors: any) => StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    bottomSheet: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
        borderWidth: 1,
        borderColor: colors.text + '10',
    },
    dragHandle: {
        width: 40,
        height: 4,
        backgroundColor: colors.muted,
        opacity: 0.3,
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 24,
    },
    layerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.text + '05',
    },
    layerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    layerLabel: {
        fontSize: 16,
        color: colors.text,
    },
    toggle: {
        width: 50,
        height: 28,
        borderRadius: 14,
        backgroundColor: colors.text + '20', // Default off state
        padding: 2,
        justifyContent: 'center',
    },
    toggleActive: {
        backgroundColor: colors.primary,
    },
    toggleThumb: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.background, // Use background color for thumb
    },
    toggleThumbActive: {
        alignSelf: 'flex-end',
    },
    closeButton: {
        marginTop: 24,
        backgroundColor: colors.primary,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'white', // Primary button text always white usually
        fontSize: 16,
        fontWeight: 'bold',
    },
});
