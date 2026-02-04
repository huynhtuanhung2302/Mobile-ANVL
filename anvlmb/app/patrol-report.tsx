import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useAppTheme } from '@/ctx/ThemeContext';
import { usePatrol } from '@/ctx/PatrolContext';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import ConfirmationPopup from '@/components/ConfirmationPopup';

export default function PatrolReportScreen() {
    const { colors } = useAppTheme();
    const params = useLocalSearchParams();
    const styles = dynamicStyles(colors);

    const parseParam = (val: string | string[] | undefined, defaultVal: number): number => {
        if (!val) return defaultVal;
        if (Array.isArray(val)) return Number(val[0]) || defaultVal;
        return Number(val) || defaultVal;
    };

    const parseString = (val: string | string[] | undefined, defaultVal: string): string => {
        if (!val) return defaultVal;
        if (Array.isArray(val)) return val[0];
        return val;
    };

    // Parse params or use defaults
    const distance = parseString(params.distance, '1.2km');
    const gpsUpdates = parseParam(params.updates, 10);
    const incidents = parseParam(params.incidents, 0);
    const duration = parseString(params.duration, '32m');

    const { updatePatrolStatus } = usePatrol();
    const routeId = parseString(params.routeId, '');
    const [showExitPopup, setShowExitPopup] = useState(false);
    const [showSignaturePopup, setShowSignaturePopup] = useState(false);
    const [isSigned, setIsSigned] = useState(false);
    const [userNotes, setUserNotes] = useState('Lộ trình tuần tra thực tế đã được ghi nhận và đối soát với kế hoạch từ TTCH. Toàn bộ tín hiệu GPS (30s/lần) đã được gửi thành công.');

    const handleBackPress = () => {
        setShowExitPopup(true);
    };

    const handleSubmit = () => {
        if (!isSigned) {
            alert('Vui lòng ký xác nhận báo cáo trước khi gửi.');
            return;
        }
        if (routeId) {
            updatePatrolStatus(routeId, 'ĐÃ BÁO CÁO', userNotes);
        }
        router.replace('/patrol');
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBackPress}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Báo cáo Kết thúc Ca</Text>
            </View>

            <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Tổng quan Tuyến tuần tra (GPS)</Text>
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{distance}</Text>
                        <Text style={styles.statLabel}>Quãng đường</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{duration}</Text>
                        <Text style={styles.statLabel}>Thời gian</Text>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>Tình trạng Lộ trình</Text>
                    <TouchableOpacity
                        style={styles.logLink}
                        onPress={() => router.push({
                            pathname: '/patrol-location-log',
                            params: { routeId, routeName: params.routeName }
                        } as any)}
                    >
                        <Text style={styles.logLinkText}>Xem nhật ký</Text>
                        <Ionicons name="chevron-forward" size={12} color={colors.primary} />
                    </TouchableOpacity>
                </View>
                <View style={styles.reportRow}>
                    <Ionicons name="map" size={20} color={colors.primary} />
                    <Text style={styles.reportText}>Độ phủ lộ trình: 98% (Đã khớp TTCH)</Text>
                </View>
                <View style={styles.reportRow}>
                    <Ionicons name="cloud-done" size={20} color={colors.safe} />
                    <Text style={styles.reportText}>Dữ liệu GPS: Đã đồng bộ 100%</Text>
                </View>
                <TouchableOpacity
                    style={styles.reportRow}
                    onPress={() => router.push({
                        pathname: '/patrol-incidents-summary',
                        params: { routeName: params.routeName }
                    } as any)}
                >
                    <Ionicons name="alert-circle" size={20} color={incidents > 0 ? colors.warning : colors.muted} />
                    <Text style={styles.reportText}>Sự cố phát hiện: {incidents} trường hợp</Text>
                    <Ionicons name="chevron-forward" size={14} color={colors.muted} style={{ marginLeft: 'auto' }} />
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ghi chú tổng kết</Text>
                <View style={styles.noteBox}>
                    <TextInput
                        style={styles.noteInput}
                        multiline
                        placeholder="Nhập ghi chú tổng kết tại đây..."
                        placeholderTextColor={colors.muted}
                        value={userNotes}
                        onChangeText={setUserNotes}
                    />
                </View>
            </View>

            <View style={styles.signatureSection}>
                <Text style={styles.sectionTitle}>Xác nhận của nhân viên</Text>
                <TouchableOpacity
                    style={[
                        styles.signatureBox,
                        isSigned && styles.signatureBoxConfirmed
                    ]}
                    onPress={() => setShowSignaturePopup(true)}
                >
                    {isSigned ? (
                        <View style={styles.confirmedContent}>
                            <View style={styles.checkCircle}>
                                <Ionicons name="checkmark" size={20} color="#fff" />
                            </View>
                            <Text style={styles.signatureConfirmedText}>NHÂN VIÊN 042 ĐÃ XÁC NHẬN</Text>
                            <Text style={styles.signatureStatusLabel}>Đã ký lúc 14:40</Text>
                        </View>
                    ) : (
                        <View style={styles.unconfirmedContent}>
                            <Ionicons name="create-outline" size={24} color={colors.muted} />
                            <Text style={styles.signaturePlaceholder}>NHẤN ĐỂ KÝ XÁC NHẬN</Text>
                            <Text style={styles.signatureStatusLabel}>Chưa ký</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
            >
                <Text style={styles.submitButtonText}>GỬI BÁO CÁO & KẾT THÚC</Text>
            </TouchableOpacity>

            <ConfirmationPopup
                isVisible={showExitPopup}
                title="Hủy kết thúc ca?"
                message="Báo cáo chưa được gửi. Bạn có chắc chắn muốn thoát không?"
                confirmText="Thoát & Hủy"
                cancelText="Quay lại"
                type="danger"
                onConfirm={() => {
                    setShowExitPopup(false);
                    router.back();
                }}
                onCancel={() => setShowExitPopup(false)}
            />

            <ConfirmationPopup
                isVisible={showSignaturePopup}
                title="Xác nhận báo cáo"
                message="Nhân viên Nhân viên 042 có xác nhận thông tin trong báo cáo tuần tra là đúng?"
                confirmText="Xác nhận"
                cancelText="Hủy"
                onConfirm={() => {
                    setIsSigned(true);
                    setShowSignaturePopup(false);
                }}
                onCancel={() => setShowSignaturePopup(false)}
            />
        </ScrollView >
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
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 32,
        gap: 16,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.text,
    },
    summaryCard: {
        backgroundColor: colors.surface,
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: colors.text + '0D',
        marginBottom: 24,
    },
    summaryTitle: {
        color: colors.muted,
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 20,
        textAlign: 'center',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        color: colors.text,
        fontSize: 24,
        fontWeight: 'bold',
    },
    statLabel: {
        color: colors.muted,
        fontSize: 10,
        marginTop: 4,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        color: colors.muted,
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    logLink: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    logLinkText: {
        color: colors.primary,
        fontSize: 12,
        fontWeight: 'bold',
    },
    reportRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.text + '0D',
        gap: 12,
    },
    reportText: {
        color: colors.text,
        fontSize: 14,
    },
    noteBox: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 4,
        borderWidth: 1,
        borderColor: colors.text + '0D',
    },
    noteInput: {
        color: colors.text,
        fontSize: 14,
        lineHeight: 22,
        padding: 12,
        minHeight: 80,
        textAlignVertical: 'top',
    },
    signatureSection: {
        marginBottom: 40,
    },
    signatureBox: {
        height: 140,
        backgroundColor: colors.text + '05',
        borderRadius: 24,
        borderStyle: 'dashed',
        borderWidth: 1.5,
        borderColor: colors.muted + '40',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signatureBoxConfirmed: {
        backgroundColor: colors.safe + '10',
        borderStyle: 'solid',
        borderColor: colors.safe,
    },
    unconfirmedContent: {
        alignItems: 'center',
        gap: 8,
    },
    confirmedContent: {
        alignItems: 'center',
        gap: 4,
    },
    checkCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.safe,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    signaturePlaceholder: {
        color: colors.muted,
        fontSize: 14,
        fontWeight: '800',
    },
    signatureConfirmedText: {
        color: colors.safe,
        fontSize: 14,
        fontWeight: '900',
    },
    signatureStatusLabel: {
        color: colors.muted,
        fontSize: 11,
        fontWeight: '600',
    },
    signatureMeta: {
        color: colors.muted,
        fontSize: 10,
        marginTop: 8,
    },
    submitButton: {
        backgroundColor: colors.safe,
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 40,
    },
    submitButtonText: {
        color: colors.text,
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 1,
    }
});
