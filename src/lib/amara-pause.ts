import { useState, useEffect } from "react";

/* 
  PHASE 11: PAUSE MODE RITUAL
  Manages the intentional rest state ("Pause Mode").
  Ensures no friction, preserved progress, and optional gentle check-ins.
*/

export type PauseStatus = "ACTIVE" | "PAUSING" | "PAUSED";
export type CheckInPreference = "NONE" | "OCCASIONAL";

const STORAGE_KEY = "amara_pause_state";

interface PauseState {
    status: PauseStatus;
    checkInPreference: CheckInPreference;
    pausedAt?: string;
}

const INITIAL_STATE: PauseState = {
    status: "ACTIVE",
    checkInPreference: "NONE"
};

export function useAmaraPause(userId?: string) {
    const [state, setState] = useState<PauseState>(() => {
        if (typeof window === 'undefined') return INITIAL_STATE;
        const key = userId ? `${STORAGE_KEY}:${userId}` : STORAGE_KEY;
        const saved = localStorage.getItem(key);
        if (!saved) return INITIAL_STATE;
        return JSON.parse(saved);
    });

    useEffect(() => {
        if (!userId) return;
        const key = `${STORAGE_KEY}:${userId}`;
        const saved = localStorage.getItem(key);
        if (saved) setState(JSON.parse(saved));
        else setState(INITIAL_STATE);
    }, [userId]);

    const persist = (newState: PauseState) => {
        setState(newState);
        const key = userId ? `${STORAGE_KEY}:${userId}` : STORAGE_KEY;
        localStorage.setItem(key, JSON.stringify(newState));
    };

    const startPauseFlow = () => {
        persist({ ...state, status: "PAUSING" });
    };

    const confirmPause = () => {
        persist({
            ...state,
            status: "PAUSED",
            pausedAt: new Date().toISOString()
        });
    };

    const setCheckInPreference = (pref: CheckInPreference) => {
        persist({ ...state, checkInPreference: pref });
    };

    const resume = () => {
        persist({ ...INITIAL_STATE });
    };

    const cancelFlow = () => {
        persist({ ...state, status: "ACTIVE" });
    }

    return {
        state,
        startPauseFlow,
        confirmPause,
        setCheckInPreference,
        resume,
        cancelFlow
    };
}
