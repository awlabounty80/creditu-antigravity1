import { useState, useEffect } from "react";

/* 
  PHASE 9: DAY-ONE ONBOARDING
  Manages the multi-step "First Login" experience.
*/

export type OnboardingStep =
    | "WELCOME"       // Step 1: Home Dashboard (Safety)
    | "TOUR"          // Step 2: Dashboard Highlights (Orientation)
    | "FIRST_WIN"     // Step 3: Credit Lab (Safe Action)
    | "REWARD"        // Step 4: Vending Machine (Celebration)
    | "NEXT_STEPS"    // Step 5: Dashboard Return (Transition)
    | "COMPLETE";     // Done.

export interface OnboardingState {
    status: "IDLE" | "ACTIVE" | "PAUSED" | "COMPLETED";
    currentStep: OnboardingStep;
    hasStarted: boolean;
}

const STORAGE_KEY = "amara_onboarding_v1";

const INITIAL_STATE: OnboardingState = {
    status: "IDLE",
    currentStep: "WELCOME",
    hasStarted: false
};

// Map step order
const STEPS: OnboardingStep[] = ["WELCOME", "TOUR", "FIRST_WIN", "REWARD", "NEXT_STEPS", "COMPLETE"];

export function useAmaraOnboarding(userId?: string) {
    const [state, setState] = useState<OnboardingState>(() => {
        if (typeof window === 'undefined') return INITIAL_STATE;
        // If no userId, we can default to unkeyed storage or return initial
        // Ideally we wait for userId. For now, fall back to global key if missing.
        const key = userId ? `${STORAGE_KEY}:${userId}` : STORAGE_KEY;
        const saved = localStorage.getItem(key);
        if (!saved) return INITIAL_STATE;
        return JSON.parse(saved);
    });

    // Re-sync when userId changes
    useEffect(() => {
        if (!userId) return;
        const key = `${STORAGE_KEY}:${userId}`;
        const saved = localStorage.getItem(key);
        if (saved) {
            setState(JSON.parse(saved));
        } else {
            // If switching users and no state found, reset to initial
            setState(INITIAL_STATE);
        }
    }, [userId]);

    const persist = (newState: OnboardingState) => {
        setState(newState);
        const key = userId ? `${STORAGE_KEY}:${userId}` : STORAGE_KEY;
        localStorage.setItem(key, JSON.stringify(newState));
    };

    const start = () => {
        if (state.status === "COMPLETED") return; // Never re-run if done
        persist({ ...state, status: "ACTIVE", hasStarted: true, currentStep: "WELCOME" });
    };

    const advance = () => {
        const idx = STEPS.indexOf(state.currentStep);
        if (idx === -1 || idx >= STEPS.length - 1) {
            complete();
            return;
        }
        const nextStep = STEPS[idx + 1];
        if (nextStep === "COMPLETE") {
            complete();
        } else {
            persist({ ...state, currentStep: nextStep });
        }
    };

    const pause = () => {
        persist({ ...state, status: "PAUSED" });
    };

    const resume = () => {
        persist({ ...state, status: "ACTIVE" });
    };

    const complete = () => {
        persist({ ...state, status: "COMPLETED", currentStep: "COMPLETE" });
    };

    const skip = () => {
        complete(); // Skipping marks as done so it doesn't nag
    };

    const reset = () => {
        persist(INITIAL_STATE);
    }

    return {
        state,
        start,
        advance,
        pause,
        resume,
        complete,
        skip,
        reset
    };
}
