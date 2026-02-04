import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useAppTheme } from '@/ctx/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { saveUserSession, getUserSession, UserSession } from '@/utils/offline-storage';

export default function LoginScreen() {
    const { colors } = useAppTheme();
    const styles = dynamicStyles(colors);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Offline / Biometric State
    const [isOffline, setIsOffline] = useState(false); // Simulated Network State
    const [hasSession, setHasSession] = useState(false); // Check if user logged in before
    const [storedUser, setStoredUser] = useState<string | null>(null);
    const [sessionExpiry, setSessionExpiry] = useState<string>('');
    const [isSessionExpired, setIsSessionExpired] = useState(false);

    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        // Reserved for future session check
    };

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
            return;
        }

        setLoading(true);

        // Simulate API Login
        setTimeout(async () => {
            setLoading(false);
            // Accept any non-empty username for mock purposes
            if (username.length > 2) {
                // Mock Success
                const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
                const newSession: UserSession = {
                    token: 'mock-jwt-token',
                    userId: username,
                    userName: 'Nhân viên 042',
                    lastLogin: Date.now(),
                    expiryTimestamp: Date.now() + TWENTY_FOUR_HOURS,
                    biometricEnabled: true
                };
                await saveUserSession(newSession);
                router.replace('/(tabs)');
            } else {
                Alert.alert('Lỗi', 'Sai thông tin đăng nhập');
            }
        }, 1500);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.content}>
                <View style={styles.logoContainer}>
                    <Ionicons name="shield-checkmark" size={80} color={colors.primary} />
                    <Text style={styles.logoText}>Hệ thống an ninh vật lý</Text>
                    <Text style={styles.logoSubText}>Lực lượng an ninh</Text>
                </View>

                <View style={styles.formContainer}>
                    <View style={styles.inputWrapper}>
                        <Ionicons name="person-outline" size={20} color={colors.muted} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Tên đăng nhập / Mã nhân viên"
                            placeholderTextColor={colors.muted}
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                            editable={!loading}
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <Ionicons name="lock-closed-outline" size={20} color={colors.muted} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Mật khẩu"
                            placeholderTextColor={colors.muted}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            editable={!loading}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons
                                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                size={20}
                                color={colors.muted}
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[styles.loginButton, loading && styles.disabledButton]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={colors.text} />
                        ) : (
                            <Text style={styles.loginButtonText}>ĐĂNG NHẬP</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const dynamicStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.base,
    },
    offlineBanner: {
        backgroundColor: colors.warning + '26', // 15%
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    offlineText: {
        color: colors.warning,
        fontSize: 12,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 48,
    },
    logoText: {
        fontSize: 24, // Reduced from 32 to fit "Hệ thống an ninh vật lý"
        fontWeight: 'bold',
        color: colors.text,
        marginTop: 8,
        letterSpacing: 1, // Reduced from 4
        textAlign: 'center',
    },
    logoSubText: {
        fontSize: 10,
        color: colors.muted,
        letterSpacing: 2,
    },
    formContainer: {
        backgroundColor: colors.surface,
        padding: 24,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.text + '20',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: colors.text + '20',
        marginBottom: 16,
        paddingVertical: 8,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        color: colors.text,
        fontSize: 16,
    },
    loginButton: {
        backgroundColor: colors.primary,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 24,
    },
    disabledButton: {
        backgroundColor: colors.text + '20',
        opacity: 0.7,
    },
    loginButtonText: {
        color: colors.text, // Often white/dark depending on contrast, but themes usually handle primary text contrast
        fontSize: 16,
        fontWeight: 'bold',
    },
    biometricContainer: {
        alignItems: 'center',
        marginTop: 48,
    },
    biometricButton: {
        alignItems: 'center',
        gap: 8,
    },
    biometricDisabled: {
        opacity: 0.5,
    },
    biometricIcon: {
        padding: 10,
        borderRadius: 30,
    },
    biometricText: {
        color: colors.muted,
        fontSize: 12,
    },
    netToggle: {
        position: 'absolute',
        bottom: 40,
        alignSelf: 'center',
    },
    // Premium Offline Styles
    offlineContainer: {
        alignItems: 'center',
        paddingVertical: 32,
        width: '100%',
    },
    avatarContainer: {
        marginBottom: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarRing: {
        position: 'absolute',
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 1,
        borderColor: colors.primary + '4D',
    },
    userAvatarLarge: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#1C1C1E', // Keep dark for avatar background often
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.primary,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    welcomeTitle: {
        color: colors.muted,
        fontSize: 12,
        letterSpacing: 2,
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    welcomeName: {
        color: colors.text,
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    expiryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 40,
        gap: 6,
    },
    expiryText: {
        color: colors.warning,
        fontSize: 12,
        fontWeight: '600',
    },
    bioButtonPremium: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        position: 'relative',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 12,
        elevation: 8,
    },
    bioButtonExpired: {
        backgroundColor: colors.muted,
        shadowOpacity: 0,
        elevation: 0,
    },
    bioButtonGlow: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: colors.primary + '33',
    },
    touchHint: {
        color: colors.muted,
        fontSize: 14,
    },
});
