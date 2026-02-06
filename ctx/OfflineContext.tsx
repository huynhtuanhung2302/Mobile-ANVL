import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface OfflineRequest {
    id: string;
    type: 'REPORT_INCIDENT' | 'REPORT_CHECKPOINT' | 'REPORT_PATROL' | 'OTHER';
    payload: any;
    timestamp: number;
    retryCount: number;
}

interface OfflineContextType {
    isOffline: boolean;
    offlineQueue: OfflineRequest[];
    addToQueue: (request: Omit<OfflineRequest, 'id' | 'timestamp' | 'retryCount'>) => void;
    removeFromQueue: (id: string) => void;
    retryAll: () => Promise<void>;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

const STORAGE_KEY = '@offline_queue';

export function OfflineProvider({ children }: { children: React.ReactNode }) {
    const [isOffline, setIsOffline] = useState(false);
    const [offlineQueue, setOfflineQueue] = useState<OfflineRequest[]>([]);

    // Load queue from storage on mount
    useEffect(() => {
        loadQueue();
        const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
            const offline = state.isConnected === false;
            setIsOffline(offline);
            if (!offline && offlineQueue.length > 0) {
                // Auto retry when back online
                // retryAll(); // Optimal: Auto retry or manual trigger? Let's keep manual or silent auto
            }
        });
        return () => unsubscribe();
    }, []);

    // Persist queue whenever it changes
    useEffect(() => {
        saveQueue(offlineQueue);
    }, [offlineQueue]);

    const loadQueue = async () => {
        try {
            const json = await AsyncStorage.getItem(STORAGE_KEY);
            if (json) {
                setOfflineQueue(JSON.parse(json));
            }
        } catch (e) {
            console.error('Failed to load offline queue', e);
        }
    };

    const saveQueue = async (queue: OfflineRequest[]) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
        } catch (e) {
            console.error('Failed to save offline queue', e);
        }
    };

    const addToQueue = useCallback((req: Omit<OfflineRequest, 'id' | 'timestamp' | 'retryCount'>) => {
        const newRequest: OfflineRequest = {
            ...req,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: Date.now(),
            retryCount: 0,
        };
        setOfflineQueue(prev => [...prev, newRequest]);
    }, []);

    const removeFromQueue = useCallback((id: string) => {
        setOfflineQueue(prev => prev.filter(req => req.id !== id));
    }, []);

    const retryAll = useCallback(async () => {
        if (isOffline) return;

        // Mock retry logic - in real app this would iterate and call APIs
        console.log('Retrying offline requests:', offlineQueue.length);

        // Simulate success for demo
        // adjustable delay or logic here
    }, [isOffline, offlineQueue]);

    return (
        <OfflineContext.Provider value={{ isOffline, offlineQueue, addToQueue, removeFromQueue, retryAll }}>
            {children}
        </OfflineContext.Provider>
    );
}

export function useOffline() {
    const context = useContext(OfflineContext);
    if (context === undefined) {
        throw new Error('useOffline must be used within a OfflineProvider');
    }
    return context;
}
