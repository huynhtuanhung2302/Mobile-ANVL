import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { Colors as StaticColors } from '@/constants/theme'; // Keep for static refs if needed
import { useAppTheme } from '@/ctx/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import ConfirmationPopup from '@/components/ConfirmationPopup';

export default function ProfileScreen() {
    const { colors, toggleMode, mode, colorScheme } = useAppTheme();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleCallDispatcher = () => {
        Linking.openURL('tel:113');
    };

    const handleLogout = () => {
        router.replace('/auth/login');
    };

    // Helper to get display label for mode
    const getModeLabel = () => {
        if (mode === 'auto') return 'Tự động (Theo giờ)';
        if (mode === 'light') return 'Sáng (Light)';
        return 'Tối (Dark)';
    };

    // Dynamic Styles
    const styles = dynamicStyles(colors);

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>

                {/* Header User Info */}
                <View style={styles.headerCard}>
                    <View style={styles.avatarContainer}>
                        <Ionicons name="person" size={48} color={colors.primary} />
                    </View>
                    <Text style={styles.userName}>Nhân viên 042</Text>
                    <View style={styles.roleBadge}>
                        <Text style={styles.roleText}>SECURITY GUARD</Text>
                    </View>
                    <Text style={styles.userId}>ID: SF-2024-042</Text>
                </View>

                {/* Device Binding Status - HIDDEN per request */}
                {/* <Text style={styles.sectionTitle}>Thiết bị & Bảo mật</Text> ... */}

                {/* Call Dispatcher */}
                <Text style={styles.sectionTitle}>Khẩn cấp</Text>
                <TouchableOpacity
                    style={styles.dispatcherButton}
                    onPress={handleCallDispatcher}
                >
                    <View style={styles.dispatcherIcon}>
                        <Ionicons name="call" size={32} color="white" />
                    </View>
                    <View>
                        <Text style={styles.dispatcherTitle}>GỌI CHỈ HUY</Text>
                        <Text style={styles.dispatcherSubtitle}>Hotline Trung tâm Điều hành</Text>
                    </View>
                </TouchableOpacity>

                {/* App Settings Mock */}
                <Text style={styles.sectionTitle}>Cài đặt Ứng dụng</Text>

                {/* General Config - HIDDEN */}

                <TouchableOpacity style={styles.settingItem} onPress={toggleMode}>
                    <View style={styles.settingIcon}>
                        <Ionicons
                            name={colorScheme === 'dark' ? "moon" : "sunny"}
                            size={24}
                            color={colors.text}
                        />
                    </View>
                    <Text style={[styles.settingLabel, { flex: 1 }]}>Giao diện</Text>
                    <Text style={{ color: colors.muted }}>{getModeLabel()}</Text>
                </TouchableOpacity>

                <View style={{ marginTop: 8, paddingHorizontal: 16 }}>
                    <Text style={{ fontSize: 12, color: colors.muted, fontStyle: 'italic' }}>
                        *Chạm vào "Giao diện" để chuyển đổi (Test Mode).
                        {'\n'}Mặc định: 06:00-18:00 (Sáng), 18:00-06:00 (Tối).
                    </Text>
                </View>

                {/* Logout */}
                <View style={{ marginTop: 40 }}>
                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={() => setShowLogoutConfirm(true)}
                    >
                        <Text style={styles.logoutText}>Đăng xuất</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>

            <ConfirmationPopup
                isVisible={showLogoutConfirm}
                title="Xác nhận Đăng xuất"
                message="Bạn có chắc chắn muốn đăng xuất?"
                confirmText="Đăng xuất"
                cancelText="Hủy"
                onConfirm={handleLogout}
                onCancel={() => setShowLogoutConfirm(false)}
                type="danger"
            />
        </View>
    );
}

// Style Generator Function
const dynamicStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background, // Dynamic
    },
    content: {
        padding: 24,
        paddingTop: 60,
    },
    headerCard: {
        backgroundColor: colors.surface,
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        marginBottom: 32,
        borderWidth: 1,
        borderColor: colors.text + '10', // 10% opacity
    },
    avatarContainer: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: colors.primary + '20', // 20% opacity
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 2,
        borderColor: colors.primary,
    },
    userName: {
        color: colors.text,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    roleBadge: {
        backgroundColor: colors.text + '20',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 8,
    },
    roleText: {
        color: colors.muted,
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    userId: {
        color: colors.muted,
        fontSize: 14,
    },
    sectionTitle: {
        color: colors.muted,
        fontSize: 12,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        letterSpacing: 1,
        marginBottom: 12,
        marginLeft: 4,
    },
    settingItem: {
        backgroundColor: colors.surface,
        padding: 16,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.text + '05',
    },
    settingIcon: {
        width: 40,
        marginRight: 12,
        alignItems: 'center',
    },
    settingLabel: {
        color: colors.text,
        fontSize: 16,
        fontWeight: '500',
    },
    dispatcherButton: {
        backgroundColor: colors.safe,
        padding: 20,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 32,
        shadowColor: colors.safe,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    dispatcherIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    dispatcherTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    dispatcherSubtitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 13,
    },
    logoutButton: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.danger,
        alignItems: 'center',
    },
    logoutText: {
        color: colors.danger,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
