import { useState, useEffect } from "react";

/* 
  PHASE 10: DIGNITY-FIRST RE-ENTRY
  Manages the experience for returning users (paused/canceled -> active).
*/

export type ReEntryStatus = "IDLE" | "PENDING" | "COMPLETED";

const STORAGE_KEY = "amara_reentry_status";

// Persist only the status to avoid recurring triggers
interface ReEntryState {
    status: ReEntryStatus;
}

const INITIAL_STATE: ReEntryState = {
    status: "IDLE"
};

export function useAmaraReEntry(userId?: string) {
    const [state, setState] = useState<ReEntryState>(() => {
        if (typeof window === 'undefined') return INITIAL_STATE;
        const key = userId ? `${STORAGE_KEY}:${userId}` : STORAGE_KEY;
        const saved = localStorage.getItem(key);
        // Default to IDLE execution
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

    const persist = (newState: ReEntryState) => {
        setState(newState);
        const key = userId ? `${STORAGE_KEY}:${userId}` : STORAGE_KEY;
        localStorage.setItem(key, JSON.stringify(newState));
    };

    // Call this when Login detects a returner
    const trigger = () => {
        persist({ status: "PENDING" });
    };

    const complete = () => {
        persist({ status: "COMPLETED" });
    };

    // Debug / Dev helpers
    const reset = () => {
        persist({ status: "IDLE" });
    }

    return {
        state,
        trigger,
        complete,
        reset
    };
}
