import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useAppTheme } from '@/ctx/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface Action {
    id: string;
    label: string;
    icon: keyof typeof Ionicons.prototype.components;
    color: string;
    onPress: () => void;
}

interface ContextualActionsProps {
    missionStatus: 'en-route' | 'arrived' | 'monitoring';
    onAction: (actionId: string) => void;
}

export default function ContextualActions({ missionStatus, onAction }: ContextualActionsProps) {
    const { colors } = useAppTheme();

    const getActions = (): Action[] => {
        const baseActions: Action[] = [
            { id: 'sos', label: 'CẤP CỨU/HỖ TRỢ', icon: 'megaphone', color: colors.danger, onPress: () => onAction('sos') },
        ];

        if (missionStatus === 'en-route') {
            return [
                ...baseActions,
                { id: 'traffic', label: 'KẸT ĐƯỜNG', icon: 'car-sport', color: colors.warning, onPress: () => onAction('traffic') },
                { id: 'blocked', label: 'LỐI ĐI BỊ CHẶN', icon: 'close-circle', color: colors.warning, onPress: () => onAction('blocked') },
            ];
        }

        if (missionStatus === 'arrived') {
            return [
                ...baseActions,
                { id: 'secure', label: 'HIỆN TRƯỜNG AN TOÀN', icon: 'shield-checkmark', color: colors.safe, onPress: () => onAction('secure') },
                { id: 'backup', label: 'CẦN THÊM NGƯỜI', icon: 'people', color: colors.primary, onPress: () => onAction('backup') },
            ];
        }

        return baseActions;
    };

    const actions = getActions();

    return (
        <View style={styles.outerContainer}>
            <Text style={[styles.sectionTitle, { color: colors.muted }]}>HÀNH ĐỘNG NHANH</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.container}
            >
                {actions.map(action => (
                    <TouchableOpacity
                        key={action.id}
                        style={[styles.actionButton, { borderColor: action.color + '40' }]}
                        onPress={action.onPress}
                    >
                        <View style={[styles.iconCircle, { backgroundColor: action.color + '15' }]}>
                            <Ionicons name={action.icon as any} size={20} color={action.color} />
                        </View>
                        <Text style={[styles.actionLabel, { color: action.color }]}>{action.label}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    outerContainer: {
        marginTop: 16,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 8,
        letterSpacing: 1,
    },
    container: {
        gap: 12,
        paddingBottom: 8,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.03)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
    },
    iconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    actionLabel: {
        fontSize: 12,
        fontWeight: 'bold',
    },
});
