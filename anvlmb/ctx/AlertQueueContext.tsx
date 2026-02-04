import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

export type AlertPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type AlertStatus = 'UNPROCESSED' | 'RECEIVED' | 'REPORTED' | 'FINISHED';

export interface AlertData {
    id: string;
    type: string;
    priority: AlertPriority;
    status: AlertStatus; // New field
    title: string;
    description?: string;
    location: {
        zone: string;
        building: string;
        floor: string;
    };
    timestamp: number;
    metadata?: any;
}

interface AlertQueueContextType {
    queue: AlertData[];
    currentAlert: AlertData | null;
    enqueueAlert: (alert: AlertData) => void;
    dequeueAlert: (id: string) => void;
    updateAlertStatus: (id: string, status: AlertStatus) => void; // New function
    clearQueue: () => void;
}

const AlertQueueContext = createContext<AlertQueueContextType | undefined>(undefined);

const PRIORITY_MAP: Record<AlertPriority, number> = {
    'CRITICAL': 4,
    'HIGH': 3,
    'MEDIUM': 2,
    'LOW': 1,
};

export function AlertQueueProvider({ children }: { children: React.ReactNode }) {
    const [queue, setQueue] = useState<AlertData[]>([
        {
            id: 'mock-1',
            type: 'Xâm nhập trái phép',
            priority: 'CRITICAL',
            status: 'UNPROCESSED',
            title: 'Phát hiện xâm nhập Khu A',
            description: 'Đối tượng leo rào tại phía Tây. Cảnh báo mới chưa có người nhận!',
            location: { zone: 'Khu A', building: 'Nhà kho 1', floor: 'Tầng 1' },
            timestamp: Date.now() - 1000 * 60 * 5, // 5 mins ago
        },
        {
            id: 'mock-2',
            type: 'Hệ thống báo cháy',
            priority: 'CRITICAL',
            status: 'UNPROCESSED',
            title: 'Báo cháy Khu C',
            description: 'Cảm biến khói tại kho hóa chất. Cảnh báo mới chưa có người nhận!',
            location: { zone: 'Khu C', building: 'Xưởng sản xuất', floor: 'Tầng 2' },
            timestamp: Date.now() - 1000 * 60 * 2, // 2 mins ago
        },
        {
            id: 'mock-3',
            type: 'Phương tiện danh sách đen',
            priority: 'HIGH',
            status: 'UNPROCESSED',
            title: 'Xe nghi vấn 29A-123.45',
            description: 'Phát hiện xe trong danh sách đen đi vào hầm. Yêu cầu phối hợp!',
            location: { zone: 'Hầm gửi xe', building: 'Tòa nhà A', floor: 'B1' },
            timestamp: Date.now() - 1000 * 60 * 10,
        },
        {
            id: 'mock-4',
            type: 'Tụ tập đám đông',
            priority: 'MEDIUM',
            status: 'UNPROCESSED',
            title: 'Đám đông sảnh chính',
            description: 'Phát hiện trên 10 người tụ tập tại sảnh chính. Yêu cầu xử lý!',
            location: { zone: 'Khu A', building: 'Văn phòng 1', floor: 'Sảnh' },
            timestamp: Date.now() - 1000 * 60 * 15,
        },
        {
            id: 'mock-5',
            type: 'Hành vi bất thường',
            priority: 'MEDIUM',
            status: 'UNPROCESSED',
            title: 'Dò xét khu vực hàng rào',
            description: 'Đối tượng có hành vi lạ tại hàng rào phía Đông. Yêu cầu kiểm tra!',
            location: { zone: 'Khu D', building: 'Hàng rào', floor: 'Ngoài trời' },
            timestamp: Date.now() - 1000 * 60 * 45,
        },
        {
            id: 'mock-6',
            type: 'Mất tín hiệu Camera',
            priority: 'MEDIUM',
            status: 'REPORTED',
            title: 'Mất kết nối Cam #14',
            description: 'Camera cổng bảo vệ mất tín hiệu. Đã gửi báo cáo kỹ thuật chờ xử lý từ Web.',
            location: { zone: 'Cổng chính', building: 'Trạm gác', floor: 'Ngoài trời' },
            timestamp: Date.now() - 1000 * 60 * 60, // 1 hour ago
        },
        {
            id: 'mock-7',
            type: 'Cửa mở quá lâu',
            priority: 'LOW',
            status: 'REPORTED',
            title: 'Cửa kỹ thuật mở',
            description: 'Cửa phòng Server mở quá 5 phút. Đã kiểm tra và lập biên bản, chờ xác nhận từ Web.',
            location: { zone: 'Khu B', building: 'Văn phòng 2', floor: 'Tầng 3' },
            timestamp: Date.now() - 1000 * 60 * 90, // 1.5 hours ago
        },
        {
            id: 'mock-8',
            type: 'Sự cố thiết bị IoT',
            priority: 'LOW',
            status: 'FINISHED',
            title: 'Cảm biến cửa hầm lỗi',
            description: 'Cảm biến cửa hầm B2 báo lỗi giả. Đã reset thiết bị, sự vụ kết thúc.',
            location: { zone: 'Khu C', building: 'Hầm xe B2', floor: 'B2' },
            timestamp: Date.now() - 1000 * 60 * 180, // 3 hours ago
        }
    ]);

    const enqueueAlert = useCallback((newAlert: AlertData) => {
        setQueue(prev => {
            // Check if already exists
            if (prev.find(a => a.id === newAlert.id)) return prev;

            const newQueue = [...prev, newAlert];
            // Sort by priority (descending) then timestamp (descending - newer first)
            return newQueue.sort((a, b) => {
                const priorityDiff = PRIORITY_MAP[b.priority] - PRIORITY_MAP[a.priority];
                if (priorityDiff !== 0) return priorityDiff;
                return b.timestamp - a.timestamp;
            });
        });
    }, []);

    const dequeueAlert = useCallback((id: string) => {
        setQueue(prev => prev.filter(a => a.id !== id));
    }, []);

    const updateAlertStatus = useCallback((id: string, status: AlertStatus) => {
        setQueue(prev => prev.map(alert =>
            alert.id === id ? { ...alert, status } : alert
        ));
    }, []);

    const clearQueue = useCallback(() => {
        setQueue([]);
    }, []);

    // The current alert is always the head of the queue
    const currentAlert = useMemo(() => queue.length > 0 ? queue[0] : null, [queue]);

    return (
        <AlertQueueContext.Provider value={{ queue, currentAlert, enqueueAlert, dequeueAlert, updateAlertStatus, clearQueue }}>
            {children}
        </AlertQueueContext.Provider>
    );
}

export function useAlertQueue() {
    const context = useContext(AlertQueueContext);
    if (context === undefined) {
        throw new Error('useAlertQueue must be used within a AlertQueueProvider');
    }
    return context;
}
