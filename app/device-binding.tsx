import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function DeviceBindingScreen() {
    const [deviceId, setDeviceId] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleBind = () => {
        setLoading(true);
        setError('');

        // Simulating API call
        setTimeout(() => {
            if (deviceId.toUpperCase() === 'ERROR') {
                setError('Mã thiết bị không hợp lệ. Vui lòng thử lại.');
                setLoading(false);
            } else {
                setLoading(false);
                router.replace('/auth/login');
            }
        }, 1500);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name="link-outline" size={80} color={Colors.dark.primary} />
                </View>

                <Text style={styles.title}>Ràng buộc thiết bị</Text>
                <Text style={styles.subtitle}>Vui lòng nhập mã định danh thiết bị để bắt đầu sử dụng ứng dụng ANVL.</Text>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập Device ID hoặc Mã QR"
                        placeholderTextColor={Colors.dark.muted}
                        value={deviceId}
                        onChangeText={setDeviceId}
                        autoCapitalize="characters"
                    />
                    <TouchableOpacity style={styles.qrButton}>
                        <Ionicons name="qr-code-outline" size={24} color={Colors.dark.text} />
                    </TouchableOpacity>
                </View>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <TouchableOpacity
                    style={[styles.button, (!deviceId || loading) && styles.buttonDisabled]}
                    onPress={handleBind}
                    disabled={!deviceId || loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? 'ĐANG XÁC THỰC...' : 'XÁC NHẬN RÀNG BUỘC'}
                    </Text>
                </TouchableOpacity>

                <Text style={styles.footerText}>Version 1.0.0 - Security Protocol v2</Text>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.base,
    },
    content: {
        flex: 1,
        padding: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.dark.text,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.dark.muted,
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        width: '100%',
        backgroundColor: Colors.dark.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    input: {
        flex: 1,
        height: 56,
        color: Colors.dark.text,
        fontSize: 16,
    },
    qrButton: {
        padding: 8,
    },
    button: {
        backgroundColor: Colors.dark.primary,
        width: '100%',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: Colors.dark.text,
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    footerText: {
        position: 'absolute',
        bottom: 40,
        color: Colors.dark.muted,
        fontSize: 12,
    },
    errorText: {
        color: Colors.dark.danger,
        fontSize: 14,
        marginBottom: 16,
        textAlign: 'center',
    },
});
