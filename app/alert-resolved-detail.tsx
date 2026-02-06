import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useAppTheme } from '@/ctx/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function AlertResolvedDetailScreen() {
    const { colors } = useAppTheme();
    const params = useLocalSearchParams();
    const styles = dynamicStyles(colors);

    const {
        incidentId = '301',
        alertType = 'Cảnh báo',
        severity = 'Thấp',
        status = 'FINISHED',
        zone = 'Khu vực Chung',
        building = 'Tòa nhà chính',
        floor = 'Tầng trệt',
        note = 'Đã nhắc nhở nhân viên đóng cửa.'
    } = params;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerSubtitle}>TỔNG HỢP SỰ VỤ</Text>
                    <Text style={styles.headerTitle}>LỊCH SỬ XỬ LÝ</Text>
                </View>
                <View style={styles.headerRight} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Status Banner */}
                <View style={[
                    styles.statusBanner,
                    status === 'REPORTED' && { backgroundColor: colors.primary + '15', borderBottomColor: colors.primary + '30' }
                ]}>
                    <Ionicons
                        name={status === 'REPORTED' ? "time" : "checkmark-circle"}
                        size={24}
                        color={status === 'REPORTED' ? colors.primary : colors.safe}
                    />
                    <Text style={[
                        styles.statusText,
                        status === 'REPORTED' && { color: colors.primary }
                    ]}>
                        {status === 'REPORTED' ? 'ĐANG CHỜ TRUNG TÂM CHỈ HUY XÁC NHẬN' : 'ĐÃ HOÀN THÀNH XỬ LÝ'}
                    </Text>
                </View>

                {/* Section 1: Alert Details */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="alert-circle" size={18} color={colors.primary} />
                        <Text style={styles.sectionTitle}>THÔNG TIN CẢNH BÁO GỐC</Text>
                    </View>

                    <View style={styles.infoCard}>
                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.label}>ID SỰ VỤ</Text>
                                <Text style={styles.value}>#{incidentId}</Text>
                            </View>
                            <View style={[styles.severityBadge, { backgroundColor: severity === 'Khẩn cấp' ? colors.danger : colors.warning }]}>
                                <Text style={styles.severityText}>{severity?.toString().toUpperCase()}</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <Text style={styles.label}>LOẠI HÌNH</Text>
                        <Text style={styles.mainValue}>{alertType}</Text>

                        <Text style={[styles.label, { marginTop: 16 }]}>VỊ TRÍ</Text>
                        <Text style={styles.value}>{zone} • {building} • {floor}</Text>

                        <Text style={[styles.label, { marginTop: 16 }]}>GHI CHÚ IOC</Text>
                        <Text style={styles.noteText}>{note}</Text>
                    </View>
                </View>

                {/* Section 2: Resolution Report */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="document-text" size={18} color={colors.primary} />
                        <Text style={styles.sectionTitle}>BÁO CÁO KẾT QUẢ XỬ LÝ</Text>
                    </View>

                    <View style={styles.infoCard}>
                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.label}>NGƯỜI XỬ LÝ</Text>
                                <Text style={styles.value}>Nhân viên 042 (Nguyễn Văn A)</Text>
                            </View>
                            <View style={styles.timeBadge}>
                                <Text style={styles.timeText}>10:45 - 21/01/2026</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <Text style={styles.label}>KẾT LUẬN HIỆN TRƯỜNG</Text>
                        <Text style={styles.mainValue}>SỰ CỐ ĐÃ ĐƯỢC KIỂM SOÁT</Text>

                        <Text style={[styles.label, { marginTop: 16 }]}>NỘI DUNG XỬ LÝ CHI TIẾT</Text>
                        <Text style={styles.reportContent}>
                            Tiếp cận hiện trường lúc 10:30. Phát hiện cửa kho thang máy bị kẹt do vật cản.
                            Đã tiến hành di dời vật cản và kiểm tra hệ thống cảm biến.
                            Mọi thứ đã hoạt động bình thường trở lại.
                        </Text>

                        <Text style={[styles.label, { marginTop: 16 }]}>HÌNH ẢNH GHI NHẬN</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
                            <Image
                                source={{ uri: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?q=80&w=200&auto=format&fit=crop' }}
                                style={styles.capturedImage}
                            />
                            <Image
                                source={{ uri: 'https://images.unsplash.com/photo-1557597774-9d2739f85a76?q=80&w=200&auto=format&fit=crop' }}
                                style={styles.capturedImage}
                            />
                        </ScrollView>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const dynamicStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.base,
    },
    header: {
        paddingTop: 60,
        paddingBottom: 16,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    backButton: {
        padding: 4,
    },
    headerTitleContainer: {
        alignItems: 'center',
    },
    headerSubtitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: colors.primary,
        letterSpacing: 2,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
        letterSpacing: 0.5,
    },
    headerRight: {
        width: 32,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    statusBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.safe + '15',
        paddingVertical: 12,
        gap: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.safe + '30',
    },
    statusText: {
        color: colors.safe,
        fontSize: 13,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    section: {
        padding: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.muted,
        letterSpacing: 1,
    },
    infoCard: {
        backgroundColor: colors.surface,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: colors.text + '08',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    col: {
        flex: 1,
    },
    label: {
        fontSize: 10,
        fontWeight: 'bold',
        color: colors.muted,
        letterSpacing: 1,
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
    },
    mainValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.primary,
    },
    severityBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    severityText: {
        color: 'white',
        fontSize: 9,
        fontWeight: 'bold',
    },
    timeBadge: {
        backgroundColor: colors.text + '10',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    timeText: {
        color: colors.muted,
        fontSize: 10,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: colors.text + '08',
        marginVertical: 16,
    },
    noteText: {
        fontSize: 14,
        color: colors.text,
        fontWeight: '500',
        lineHeight: 20,
        fontStyle: 'italic',
    },
    reportContent: {
        fontSize: 15,
        color: colors.text,
        fontWeight: '500',
        lineHeight: 22,
    },
    imageScroll: {
        marginTop: 12,
    },
    capturedImage: {
        width: 140,
        height: 100,
        borderRadius: 12,
        marginRight: 12,
        backgroundColor: colors.text + '05',
    }
});
