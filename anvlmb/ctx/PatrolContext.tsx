import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

export type PatrolStatus = 'CHƯA THỰC HIỆN' | 'ĐANG THỰC HIỆN' | 'HOÀN THÀNH' | 'ĐÃ BÁO CÁO';

export interface PatrolRoute {
    id: string;
    date: string;
    name: string;
    checkpoints: number;
    completed: number;
    status: PatrolStatus;
    time: string;
    notes?: string;
}

const MOCK_ROUTES: PatrolRoute[] = [
    // Yesterday (2026-02-02)
    { id: 'R-001', date: '2026-02-02', name: 'Kiểm tra PCCC', checkpoints: 12, completed: 12, status: 'ĐÃ BÁO CÁO', time: '08:30' },

    // Today (2026-02-03)
    { id: 'R-101', date: '2026-02-03', name: 'Tuần tra Khu Tây', checkpoints: 5, completed: 2, status: 'ĐANG THỰC HIỆN', time: '08:00' },
    { id: 'R-101B', date: '2026-02-03', name: 'Tuần tra Khu Đông', checkpoints: 6, completed: 6, status: 'HOÀN THÀNH', time: '10:00' },
    { id: 'R-102', date: '2026-02-03', name: 'Kiểm tra Kho bãi', checkpoints: 8, completed: 0, status: 'CHƯA THỰC HIỆN', time: '14:00' },

    // Tomorrow (2026-02-04)
    { id: 'R-201', date: '2026-02-04', name: 'Bảo trì Hệ thống A', checkpoints: 4, completed: 0, status: 'CHƯA THỰC HIỆN', time: '09:00' },
    { id: 'R-202', date: '2026-02-04', name: 'Tuần tra Chu vi', checkpoints: 10, completed: 0, status: 'CHƯA THỰC HIỆN', time: '16:00' },
];

interface PatrolContextType {
    routes: PatrolRoute[];
    updatePatrolStatus: (id: string, status: PatrolStatus, notes?: string) => void;
    getRouteById: (id: string) => PatrolRoute | undefined;
}

const PatrolContext = createContext<PatrolContextType | undefined>(undefined);

export function PatrolProvider({ children }: { children: React.ReactNode }) {
    const [routes, setRoutes] = useState<PatrolRoute[]>(MOCK_ROUTES);

    const updatePatrolStatus = useCallback((id: string, status: PatrolStatus, notes?: string) => {
        setRoutes(prev => prev.map(r => r.id === id ? { ...r, status, ...(notes !== undefined ? { notes } : {}) } : r));
    }, []);

    const getRouteById = useCallback((id: string) => {
        return routes.find(r => r.id === id);
    }, [routes]);

    const value = useMemo(() => ({
        routes,
        updatePatrolStatus,
        getRouteById
    }), [routes, updatePatrolStatus, getRouteById]);

    return (
        <PatrolContext.Provider value={value}>
            {children}
        </PatrolContext.Provider>
    );
}

export function usePatrol() {
    const context = useContext(PatrolContext);
    if (context === undefined) {
        throw new Error('usePatrol must be used within a PatrolProvider');
    }
    return context;
}
