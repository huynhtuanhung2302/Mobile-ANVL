import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router, useLocalSearchParams } from 'expo-router';
import { useAppTheme } from '@/ctx/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function CheckpointScannerScreen() {
    const { colors } = useAppTheme();
    const { cpId, cpName } = useLocalSearchParams();
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);
    const styles = dynamicStyles(colors);

    // State
    const [image, setImage] = useState<string | null>(null);
    const [capturedAt, setCapturedAt] = useState<string | null>(null);
    const [checklist, setChecklist] = useState([
        { id: 1, label: 'Kiểm tra Thiết bị / Điện', checked: false },
        { id: 2, label: 'Kiểm tra Nhiệt độ / Độ ẩm', checked: false },
        { id: 3, label: 'Kiểm tra An ninh / Khóa', checked: false },
    ]);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Live Clock for Watermark
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    if (!permission) {
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <View style={styles.permissionContent}>
                    <Text style={styles.permissionText}>Cần quyền truy cập Camera để chụp ảnh minh chứng tuần tra.</Text>
                    <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
                        <Text style={styles.permissionButtonText}>Cấp quyền Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.backButtonSimple} onPress={() => router.back()}>
                        <Text style={styles.backButtonText}>Quay lại</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 0.7,
                    skipProcessing: true, // Faster capture
                });

                if (photo) {
                    setImage(photo.uri);
                    setCapturedAt(new Date().toISOString());
                }
            } catch (error) {
                Alert.alert('Lỗi', 'Không thể chụp ảnh: ' + (error as Error).message);
            }
        }
    };

    const retakePicture = () => {
        setImage(null);
        setCapturedAt(null);
    };

    const toggleCheck = (id: number) => {
        setChecklist(prev => prev.map(item =>
            item.id === id ? { ...item, checked: !item.checked } : item
        ));
    };

    const allChecked = checklist.every(item => item.checked);

    const handleFinish = () => {
        if (allChecked && image) {
            // Here we would send the data to DB
            // { id: cpId, image: image, capturedAt: capturedAt, checklist: checklist }
            console.log('Submitting:', { cpId, capturedAt, image });
            router.back();
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>{cpName || 'CHECKPOINT'}</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                {!image ? (
                    <View style={styles.cameraContainer}>
                        <CameraView
                            ref={cameraRef}
                            style={styles.camera}
                            facing="back"
                        >
                            <View style={styles.watermarkOverlay}>
                                <View style={styles.watermarkBadge}>
                                    <Ionicons name="location" size={12} color="white" />
                                    <Text style={styles.watermarkText}>{cpName}</Text>
                                </View>
                                <View style={styles.watermarkBadge}>
                                    <Ionicons name="time" size={12} color="white" />
                                    <Text style={styles.watermarkText}>{currentTime.toLocaleString('vi-VN')}</Text>
                                </View>
                                <View style={styles.watermarkBadge}>
                                    <Ionicons name="person" size={12} color="white" />
                                    <Text style={styles.watermarkText}>Nhân viên 042</Text>
                                </View>
                            </View>
                        </CameraView>

                        <View style={styles.cameraControls}>
                            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                                <View style={styles.captureInner} />
                            </TouchableOpacity>
                            <Text style={styles.captureHint}>Chụp ảnh minh chứng hiện trường</Text>
                        </View>
                    </View>
                ) : (
                    <View style={styles.successContainer}>
                        <View style={styles.previewContainer}>
                            <Image source={{ uri: image }} style={styles.previewImage} resizeMode="cover" />
                            {/* Re-render Watermark on preview to simulate "hard" watermark logic visually */}
                            <View style={styles.watermarkOverlayStatic}>
                                <Text style={styles.watermarkTextStatic}>{cpName}</Text>
                                <Text style={styles.watermarkTextStatic}>
                                    {capturedAt ? new Date(capturedAt).toLocaleString('vi-VN') : ''}
                                </Text>
                            </View>
                            <TouchableOpacity style={styles.retakeButton} onPress={retakePicture}>
                                <Ionicons name="refresh" size={20} color="white" />
                                <Text style={styles.retakeText}>Chụp lại</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.checklistCard}>
                            <Text style={styles.checklistHeader}>DANH MỤC KIỂM TRA</Text>
                            {checklist.map(item => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={styles.checkItem}
                                    onPress={() => toggleCheck(item.id)}
                                >
                                    <Ionicons
                                        name={item.checked ? "checkbox" : "square-outline"}
                                        size={28}
                                        color={item.checked ? colors.safe : colors.muted}
                                    />
                                    <Text style={[styles.checkText, item.checked && styles.checkTextActive]}>
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity
                            style={[styles.finishButton, (!allChecked || !image) && { opacity: 0.5 }]}
                            onPress={handleFinish}
                            disabled={!allChecked || !image}
                        >
                            <Text style={styles.finishButtonText}>HOÀN THÀNH & GỬI</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
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
        justifyContent: 'space-between',
        paddingTop: 60,
        paddingHorizontal: 20,
        marginBottom: 20,
        backgroundColor: colors.surface,
        paddingBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.text + '0D',
        borderRadius: 12,
    },
    headerTitle: {
        color: colors.text,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    headerSubtitle: {
        color: colors.muted,
        fontSize: 12,
        textAlign: 'center',
    },
    content: {
        flex: 1,
    },
    // Camera Styles
    cameraContainer: {
        flex: 1,
        backgroundColor: 'black',
    },
    camera: {
        flex: 1,
        width: '100%',
    },
    watermarkOverlay: {
        position: 'absolute',
        top: 20,
        left: 20,
        gap: 8,
    },
    watermarkBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
        alignSelf: 'flex-start',
    },
    watermarkText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    cameraControls: {
        position: 'absolute',
        bottom: 40,
        width: '100%',
        alignItems: 'center',
        gap: 16,
    },
    captureButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureInner: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'white',
    },
    captureHint: {
        color: 'white',
        fontSize: 14,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    // Permission Styles
    permissionContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    permissionText: {
        color: colors.text,
        textAlign: 'center',
        marginBottom: 24,
        fontSize: 16,
    },
    permissionButton: {
        backgroundColor: colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginBottom: 16,
    },
    permissionButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    backButtonSimple: {
        padding: 12,
    },
    backButtonText: {
        color: colors.muted,
    },
    // Success/Preview Styles
    successContainer: {
        flex: 1,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    previewContainer: {
        width: '100%',
        height: 250,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: colors.text + '1A',
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    watermarkOverlayStatic: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 8,
        borderRadius: 8,
        alignItems: 'flex-end',
    },
    watermarkTextStatic: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 10,
    },
    retakeButton: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: 'rgba(0,0,0,0.6)',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 8,
        gap: 4,
    },
    retakeText: {
        color: 'white',
        fontSize: 12,
    },
    checklistCard: {
        width: '100%',
        backgroundColor: colors.surface,
        borderRadius: 24,
        padding: 24,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: colors.text + '0D',
    },
    checklistHeader: {
        color: colors.muted,
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 16,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    checkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 12,
    },
    checkText: {
        color: colors.muted,
        fontSize: 16,
        flex: 1,
    },
    checkTextActive: {
        color: colors.text,
        fontWeight: '600',
    },
    finishButton: {
        width: '100%',
        backgroundColor: colors.safe,
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 20,
    },
    finishButtonText: {
        color: 'white', // Usually white on 'safe' (green)
        fontWeight: 'bold',
        fontSize: 16,
    },
});
