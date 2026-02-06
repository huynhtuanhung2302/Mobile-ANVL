import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { AlertData, useAlertQueue } from './AlertQueueContext';

// Define the precise states of a Mission
export type MissionStatus =
    | 'IDLE'        // No active mission
    | 'RINGING'     // Overlay showing, waiting for user
    | 'BRIEFING'    // User accepted, reading details/instruction
    | 'RESPONDING'  // Moving to target (Map view)
    | 'ON_SITE'     // Arrived at location
    | 'REPORTING';  // Filling final report

export interface ActiveMission {
    incidentId: string;
    type: string;
    priority: string;
    status: 'UNPROCESSED' | 'RECEIVED' | 'REPORTED' | 'FINISHED';
    location: {
        zone: string;
        building: string;
        floor: string;
    };
    note: string;
    startTime: number;
    capturedImages: string[];
}

interface MissionState {
    missions: Record<string, ActiveMission>;
    currentMissionId: string | null;
}

type MissionAction =
    | { type: 'INJECT_ALERT'; payload: AlertData }
    | { type: 'ACCEPT_MISSION'; payload: string }
    | { type: 'CONFIRM_BRIEFING' } // Move to RESPONDING
    | { type: 'ARRIVE_ON_SITE' }
    | { type: 'START_REPORT' }
    | { type: 'SUBMIT_REPORT'; payload: string }
    | { type: 'CANCEL_MISSION'; payload: string }
    | { type: 'ADD_IMAGE'; payload: string }
    | { type: 'SELF_DISPATCH'; payload: AlertData }
    | { type: 'SET_CURRENT_MISSION'; payload: string };

const initialState: MissionState = {
    missions: {},
    currentMissionId: null,
};

function missionReducer(state: MissionState, action: MissionAction): MissionState {
    switch (action.type) {
        case 'INJECT_ALERT':
            return {
                ...state,
                missions: {
                    ...state.missions,
                    [action.payload.id]: {
                        incidentId: action.payload.id,
                        type: action.payload.type,
                        priority: action.payload.priority,
                        status: 'UNPROCESSED',
                        location: action.payload.location,
                        note: action.payload.description || '',
                        startTime: Date.now(),
                        capturedImages: []
                    }
                }
            };
        case 'SELF_DISPATCH':
            return {
                ...state,
                currentMissionId: action.payload.id,
                missions: {
                    ...state.missions,
                    [action.payload.id]: {
                        incidentId: action.payload.id,
                        type: action.payload.type,
                        priority: action.payload.priority,
                        status: 'RECEIVED',
                        location: action.payload.location,
                        note: action.payload.description || '',
                        startTime: Date.now(),
                        capturedImages: []
                    }
                }
            };
        case 'ACCEPT_MISSION':
            if (!state.missions[action.payload]) return state;
            return {
                ...state,
                currentMissionId: action.payload,
                missions: {
                    ...state.missions,
                    [action.payload]: {
                        ...state.missions[action.payload],
                        status: 'RECEIVED'
                    }
                }
            };
        case 'CONFIRM_BRIEFING':
            // Logic BRIEFING/RESPONDING internal states removed as per user's 4-status rule
            return state;
        case 'ARRIVE_ON_SITE':
            // Can be used to trigger haptics or internal flags, but status remains 'RECEIVED' 
            // per user's strict 4-state rule unless we decide ON_SITE is part of RECEIVED
            return state;
        case 'START_REPORT':
            return state;
        case 'SUBMIT_REPORT':
            if (!state.missions[action.payload]) return state;
            return {
                ...state,
                missions: {
                    ...state.missions,
                    [action.payload]: {
                        ...state.missions[action.payload],
                        status: 'REPORTED'
                    }
                }
            };
        case 'CANCEL_MISSION':
            const newMissions = { ...state.missions };
            delete newMissions[action.payload];
            return {
                ...state,
                missions: newMissions,
                currentMissionId: state.currentMissionId === action.payload ? (Object.keys(newMissions)[0] || null) : state.currentMissionId
            };
        case 'ADD_IMAGE':
            if (!state.currentMissionId || !state.missions[state.currentMissionId]) return state;
            return {
                ...state,
                missions: {
                    ...state.missions,
                    [state.currentMissionId]: {
                        ...state.missions[state.currentMissionId],
                        capturedImages: [...state.missions[state.currentMissionId].capturedImages, action.payload]
                    }
                }
            };
        case 'SET_CURRENT_MISSION':
            return {
                ...state,
                currentMissionId: action.payload
            };
        default:
            return state;
    }
}

interface MissionContextType {
    missionState: MissionState;
    injectAlert: (alert: AlertData) => void;
    acceptMission: (id: string) => void;
    confirmBriefing: () => void;
    arriveOnSite: () => void;
    startReport: () => void;
    submitReport: (id: string) => void;
    cancelMission: (id: string) => void;
    addCapturedImage: (uri: string) => void;
    startMissionImmediately: (alert: AlertData) => void;
    setCurrentMission: (id: string) => void;
}

const MissionContext = createContext<MissionContextType | undefined>(undefined);

export function MissionProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(missionReducer, initialState);
    const { updateAlertStatus } = useAlertQueue(); // Access status updater

    const injectAlert = useCallback((alert: AlertData) => {
        dispatch({ type: 'INJECT_ALERT', payload: alert });
    }, []);

    const setCurrentMission = useCallback((id: string) => {
        // Find alert in queue if not already in missions
        dispatch({ type: 'SET_CURRENT_MISSION', payload: id });
    }, []);

    const acceptMission = useCallback((id: string) => {
        updateAlertStatus(id, 'RECEIVED');
        dispatch({ type: 'ACCEPT_MISSION', payload: id });
    }, [updateAlertStatus]);

    const confirmBriefing = useCallback(() => dispatch({ type: 'CONFIRM_BRIEFING' }), []);
    const arriveOnSite = useCallback(() => dispatch({ type: 'ARRIVE_ON_SITE' }), []);
    const startReport = useCallback(() => dispatch({ type: 'START_REPORT' }), []);

    const submitReport = useCallback((id: string) => {
        updateAlertStatus(id, 'REPORTED');
        dispatch({ type: 'SUBMIT_REPORT', payload: id });
    }, [updateAlertStatus]);

    const cancelMission = useCallback((id: string) => dispatch({ type: 'CANCEL_MISSION', payload: id }), []);
    const addCapturedImage = useCallback((uri: string) => dispatch({ type: 'ADD_IMAGE', payload: uri }), []);

    const startMissionImmediately = useCallback((alert: AlertData) => {
        updateAlertStatus(alert.id, 'RECEIVED');
        dispatch({ type: 'SELF_DISPATCH', payload: alert });
    }, [updateAlertStatus]);

    return (
        <MissionContext.Provider value={{
            missionState: state,
            injectAlert,
            acceptMission,
            confirmBriefing,
            arriveOnSite,
            startReport,
            submitReport,
            cancelMission,
            addCapturedImage,
            startMissionImmediately,
            setCurrentMission
        }}>
            {children}
        </MissionContext.Provider>
    );
}

export function useMission() {
    const context = useContext(MissionContext);
    if (context === undefined) {
        throw new Error('useMission must be used within a MissionProvider');
    }
    return context;
}
