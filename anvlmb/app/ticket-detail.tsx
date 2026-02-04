import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
} from 'react-native';
import { useAppTheme } from '@/ctx/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import ConfirmationPopup from '@/components/ConfirmationPopup';

export default function TicketDetailScreen() {
    const { colors } = useAppTheme();
    const styles = dynamicStyles(colors);
    const { ticketId } = useLocalSearchParams();
    const [parts, setParts] = useState('');
    const [note, setNote] = useState('');
    const [status, setStatus] = useState('Chờ xử lý');
    const [popupConfig, setPopupConfig] = useState<{
        isVisible: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    } | null>(null);

    const handleCancel = () => {
        setPopupConfig({
            isVisible: true,
            title: 'Hủy bỏ thay đổi?',
            message: 'Bạn có chắc chắn muốn hủy các thay đổi? Thông tin đã nhập sẽ bị mất.',
            onConfirm: () => {
                setPopupConfig(null);
                router.back();
            }
        });
    };

    const handleStart = () => {
        setPopupConfig({
            isVisible: true,
            title: 'Bắt đầu xử lý?',
            message: 'Xác nhận bắt đầu thực hiện ticket này.',
            onConfirm: () => {
                setStatus('Đang thực thực hiện');
                setPopupConfig(null);
            }
        });
    };

    const handleComplete = () => {
        setPopupConfig({
            isVisible: true,
            title: 'Hoàn thành Ticket?',
            message: 'Gửi báo cáo và đóng Ticket? Hành động này không thể hoàn tác.',
            onConfirm: () => {
                setStatus('Đã hoàn thành');
                setPopupConfig(null);
                router.back();
            }
        });
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Chi tiết Ticket</Text>
                    <View style={{ width: 24 }} />
                </View>

                <View style={styles.infoSection}>
                    <View style={styles.card}>
                        <Text style={styles.label}>Mã Ticket</Text>
                        <Text style={styles.value}>{ticketId || 'TKT-001'}</Text>

                        <View style={styles.divider} />

                        <Text style={styles.label}>Thiết bị</Text>
                        <Text style={styles.value}>Camera West-02</Text>

                        <View style={styles.divider} />

                        <Text style={styles.label}>Mô tả sự cố</Text>
                        <Text style={styles.value}>Mất kết nối định kỳ, nghi ngờ lỗi nguồn hoặc cáp tín hiệu.</Text>
                    </View>
                </View>

                <View style={styles.formSection}>
                    <Text style={styles.sectionTitle}>Cập nhật xử lý</Text>

                    <Text style={styles.label}>Phụ tùng thay thế</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ví dụ: Cáp RJ45, Nguồn 12V..."
                        placeholderTextColor={colors.muted}
                        value={parts}
                        onChangeText={setParts}
                    />

                    <Text style={styles.label}>Ghi chú kỹ thuật</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Nhập chi tiết quá trình xử lý..."
                        placeholderTextColor={colors.muted}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        value={note}
                        onChangeText={setNote}
                    />
                </View>
            </ScrollView>

            <View style={styles.footer}>
                {status === 'Chờ xử lý' && (
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={handleStart}
                    >
                        <Text style={styles.buttonText}>BẮT ĐẦU LÀM</Text>
                    </TouchableOpacity>
                )}
                {status === 'Đang thực thực hiện' && (
                    <View style={styles.inProgressButtons}>
                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={handleCancel}
                        >
                            <Text style={styles.secondaryButtonText}>HỦY BỎ</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.primaryButtonInProgress}
                            onPress={handleComplete}
                        >
                            <Text style={styles.buttonText}>HOÀN THÀNH</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {popupConfig && (
                <ConfirmationPopup
                    isVisible={popupConfig.isVisible}
                    title={popupConfig.title}
                    message={popupConfig.message}
                    onConfirm={popupConfig.onConfirm}
                    onCancel={() => setPopupConfig(null)}
                />
            )}
        </View>
    );
}

const dynamicStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.base,
    },
    scrollContent: {
        padding: 20,
        paddingTop: 60,
        paddingBottom: 100,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
    },
    infoSection: {
        marginBottom: 32,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: colors.text + '0D',
    },
    label: {
        fontSize: 10,
        color: colors.muted,
        textTransform: 'uppercase',
        marginBottom: 4,
        fontWeight: 'bold',
    },
    value: {
        fontSize: 16,
        color: colors.text,
        marginBottom: 16,
    },
    divider: {
        height: 1,
        backgroundColor: colors.text + '0D',
        marginBottom: 16,
    },
    formSection: {
        gap: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 8,
    },
    input: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 16,
        color: colors.text,
        fontSize: 16,
        borderWidth: 1,
        borderColor: colors.text + '0D',
    },
    textArea: {
        minHeight: 100,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: 20,
        backgroundColor: colors.base,
        borderTopWidth: 1,
        borderTopColor: colors.text + '0D',
    },
    inProgressButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    primaryButton: {
        backgroundColor: colors.primary,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    primaryButtonInProgress: {
        flex: 1,
        backgroundColor: colors.primary,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    secondaryButton: {
        flex: 1,
        backgroundColor: 'transparent',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.muted,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    secondaryButtonText: {
        color: colors.muted,
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
});
