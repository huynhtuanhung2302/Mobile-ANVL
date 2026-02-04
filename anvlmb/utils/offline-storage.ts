import AsyncStorage from '@react-native-async-storage/async-storage';

export interface OfflineIncident {
    id: string;
    type: string;
    timestamp: number;
    data: any;
    status: 'pending' | 'syncing' | 'synced';
}

const STORAGE_KEY = '@anvl_offline_incidents';

export const saveOfflineIncident = async (incident: any) => {
    try {
        const existing = await getOfflineIncidents();
        const newIncident: OfflineIncident = {
            id: Date.now().toString(),
            type: 'incident',
            timestamp: Date.now(),
            data: incident,
            status: 'pending'
        };

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, newIncident]));
        return true;
    } catch (e) {
        console.error('Failed to save offline incident', e);
        return false;
    }
};

export const getOfflineIncidents = async (): Promise<OfflineIncident[]> => {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        return [];
    }
};

export const clearOfflineIncidents = async () => {
    try {
        await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (e) {
        console.error(e);
    }
};

// --- Auth Session Storage ---

export interface UserSession {
    token: string;
    userId: string;
    userName: string;
    lastLogin: number;
    expiryTimestamp: number; // New field for session expiry
    biometricEnabled: boolean;
}

const SESSION_KEY = '@anvl_user_session';

export const saveUserSession = async (session: UserSession) => {
    try {
        await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
        return true;
    } catch (e) {
        return false;
    }
};

export const getUserSession = async (): Promise<UserSession | null> => {
    try {
        const jsonValue = await AsyncStorage.getItem(SESSION_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        return null;
    }
};

export const clearUserSession = async () => {
    try {
        await AsyncStorage.removeItem(SESSION_KEY);
    } catch (e) {
        console.error(e);
    }
};
