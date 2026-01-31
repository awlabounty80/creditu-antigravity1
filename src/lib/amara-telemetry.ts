"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { BehaviorSignals } from "./amara-emotion-logic";

/**
 * Minimal, contextual-only behavior telemetry.
 * - No PII
 * - No emotion history required
 * - Intended to be in-memory (session only)
 */

type ScrollSpeed = "SLOW" | "NORMAL" | "FAST";
type ReadDepth = "LOW" | "MEDIUM" | "HIGH";

export interface TelemetryConfig {
    // thresholds you can tune later
    rapidClickWindowMs?: number;     // time window to count bursts
    rapidClickBurstThreshold?: number; // clicks inside window to count burst
    longPauseMs?: number;            // pause before action threshold
    hoverTrackEnabled?: boolean;     // enable hover tracking
}

const DEFAULT_CONFIG: Required<TelemetryConfig> = {
    rapidClickWindowMs: 1200,
    rapidClickBurstThreshold: 5,
    longPauseMs: 2500,
    hoverTrackEnabled: true,
};

export interface AmaraTelemetry {
    signals: BehaviorSignals;
    reset: () => void;

    // optional helpers
    markGuidanceShown: () => void;   // start "silence after guidance" timer
    markPrimaryActionAttempt: () => void; // measure pause before action
    markStepAbandoned: () => void;   // increment abandoned steps
    markProgressStep: () => void;    // increments clear progression
    markQuickDecision: () => void;   // increments quick decisions
    markHelpRequest: () => void;     // increments help requests
}

/**
 * Hook: useAmaraTelemetry
 * Call once at page level (or in a global shell) and pass signals into the emotion engine.
 */
export function useAmaraTelemetry(config?: TelemetryConfig): AmaraTelemetry {
    const cfg = useMemo(() => ({ ...DEFAULT_CONFIG, ...(config ?? {}) }), [config]);

    const [signals, setSignals] = useState<BehaviorSignals>({
        timeOnPageMs: 0,
        repeatedClicks: 0,
        backAndForthNavCount: 0,
        pausesBeforeActionCount: 0,
        abandonedStepsCount: 0,
        rapidClickBurstCount: 0,
        scrollSpeed: "NORMAL",
        helpRequestsCount: 0,
        silenceAfterGuidanceMs: 0,
        hoverOnPricingOrSettingsMs: 0,
        readDepth: "MEDIUM",
        actionButtonAvoidance: false,
        quickDecisionCount: 0,
        clearProgressionCount: 0,
    });

    // ---- time on page ----
    const startRef = useRef<number>(Date.now());
    useEffect(() => {
        const iv = window.setInterval(() => {
            const ms = Date.now() - startRef.current;
            setSignals((s) => ({ ...s, timeOnPageMs: ms }));
        }, 500);
        return () => window.clearInterval(iv);
    }, []);

    // ---- back-and-forth navigation (browser history popstate) ----
    useEffect(() => {
        const onPopState = () => {
            setSignals((s) => ({ ...s, backAndForthNavCount: (s.backAndForthNavCount ?? 0) + 1 }));
        };
        window.addEventListener("popstate", onPopState);
        return () => window.removeEventListener("popstate", onPopState);
    }, []);

    // ---- repeated clicks + rapid burst detection ----
    const clickTimesRef = useRef<number[]>([]);
    useEffect(() => {
        const onClick = () => {
            // const now = Date.now();
            // setSignals((s) => ({ ...s, repeatedClicks: (s.repeatedClicks ?? 0) + 1 }));
            // ^^^ Commented out simple click count to avoid re-renders on every click if not needed purely.
            // But user wants 'repeatedClicks'. Let's throttle or accept it. 
            // Actually, for telemetry, let's keep it.

            const now = Date.now();
            setSignals((s) => ({ ...s, repeatedClicks: (s.repeatedClicks ?? 0) + 1 }));

            // burst window
            const times = clickTimesRef.current;
            times.push(now);
            const cutoff = now - (cfg.rapidClickWindowMs || 1000); // Use cfg value, default to 1200 from DEFAULT_CONFIG
            const recent = times.filter((t) => t > cutoff);
            clickTimesRef.current = recent;

            if (recent.length >= (cfg.rapidClickBurstThreshold || 5)) {
                setSignals((s) => ({ ...s, rapidClickBurstCount: (s.rapidClickBurstCount ?? 0) + 1 }));
                clickTimesRef.current = []; // reset burst
            }
        };
        window.addEventListener("click", onClick);
        return () => window.removeEventListener("click", onClick);
    }, [cfg.rapidClickWindowMs, cfg.rapidClickBurstThreshold]);

    // ---- scroll speed proxy ----
    const lastScrollRef = useRef<{ y: number; t: number }>({ y: 0, t: Date.now() }); // Safe init
    useEffect(() => {
        // Client side check
        if (typeof window === 'undefined') return;

        lastScrollRef.current = { y: window.scrollY, t: Date.now() };

        const onScroll = () => {
            const now = Date.now();
            const last = lastScrollRef.current;
            const dy = Math.abs(window.scrollY - last.y);
            const dt = Math.max(1, now - last.t);
            const pxPerMs = dy / dt; // crude speed

            let speed: ScrollSpeed = "NORMAL";
            if (pxPerMs < 0.25) speed = "SLOW";
            if (pxPerMs > 1.2) speed = "FAST";

            lastScrollRef.current = { y: window.scrollY, t: now };
            setSignals((s) => ({ ...s, scrollSpeed: speed }));
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // ---- read depth proxy (based on scroll % of page) ----
    useEffect(() => {
        const updateReadDepth = () => {
            const doc = document.documentElement;
            const scrollTop = window.scrollY || doc.scrollTop;
            const scrollHeight = doc.scrollHeight - doc.clientHeight;
            const pct = scrollHeight > 0 ? scrollTop / scrollHeight : 0;

            let rd: ReadDepth = "MEDIUM";
            if (pct < 0.2) rd = "LOW";
            if (pct > 0.65) rd = "HIGH";

            setSignals((s) => ({ ...s, readDepth: rd }));
        };

        const iv = window.setInterval(updateReadDepth, 1200);
        return () => window.clearInterval(iv);
    }, []);

    // ---- hover on pricing/settings (optional; you can tag elements with data-amara="pricing|settings") ----
    const hoverStartRef = useRef<number | null>(null);
    useEffect(() => {
        if (!cfg.hoverTrackEnabled) return;

        const onMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement | null;
            if (!target) return;

            const el = target.closest?.('[data-amara="pricing"], [data-amara="settings"]') as HTMLElement | null;
            if (el) hoverStartRef.current = Date.now();
        };

        const onMouseOut = (e: MouseEvent) => {
            const target = e.target as HTMLElement | null;
            if (!target) return;

            const el = target.closest?.('[data-amara="pricing"], [data-amara="settings"]') as HTMLElement | null;
            if (el && hoverStartRef.current) {
                const delta = Date.now() - hoverStartRef.current;
                hoverStartRef.current = null;
                setSignals((s) => ({
                    ...s,
                    hoverOnPricingOrSettingsMs: (s.hoverOnPricingOrSettingsMs ?? 0) + delta,
                }));
            }
        };

        document.addEventListener("mouseover", onMouseOver, true);
        document.addEventListener("mouseout", onMouseOut, true);
        return () => {
            document.removeEventListener("mouseover", onMouseOver, true);
            document.removeEventListener("mouseout", onMouseOut, true);
        };
    }, [cfg.hoverTrackEnabled]);

    // ---- silence after guidance ----
    const guidanceShownRef = useRef<number | null>(null);
    const markGuidanceShown = () => {
        guidanceShownRef.current = Date.now();
        setSignals((s) => ({ ...s, silenceAfterGuidanceMs: 0 }));
    };

    useEffect(() => {
        const iv = window.setInterval(() => {
            if (!guidanceShownRef.current) return;
            const ms = Date.now() - guidanceShownRef.current;
            setSignals((s) => ({ ...s, silenceAfterGuidanceMs: ms }));
        }, 500);

        return () => window.clearInterval(iv);
    }, []);

    // ---- pause before primary action ----
    const lastUserActivityRef = useRef<number>(Date.now());
    useEffect(() => {
        const touch = () => (lastUserActivityRef.current = Date.now());
        document.addEventListener("mousemove", touch, true);
        document.addEventListener("keydown", touch, true);
        document.addEventListener("click", touch, true);
        return () => {
            document.removeEventListener("mousemove", touch, true);
            document.removeEventListener("keydown", touch, true);
            document.removeEventListener("click", touch, true);
        };
    }, []);

    const markPrimaryActionAttempt = () => {
        const pause = Date.now() - lastUserActivityRef.current;
        if (pause >= (cfg.longPauseMs || 2500)) {
            setSignals((s) => ({
                ...s,
                pausesBeforeActionCount: (s.pausesBeforeActionCount ?? 0) + 1,
            }));
        }
    };

    // ---- step abandoned + progression + quick decisions + help ----
    const markStepAbandoned = () =>
        setSignals((s) => ({ ...s, abandonedStepsCount: (s.abandonedStepsCount ?? 0) + 1 }));

    const markProgressStep = () =>
        setSignals((s) => ({ ...s, clearProgressionCount: (s.clearProgressionCount ?? 0) + 1 }));

    const markQuickDecision = () =>
        setSignals((s) => ({ ...s, quickDecisionCount: (s.quickDecisionCount ?? 0) + 1 }));

    const markHelpRequest = () =>
        setSignals((s) => ({ ...s, helpRequestsCount: (s.helpRequestsCount ?? 0) + 1 }));

    // ---- action button avoidance (optional manual toggle) ----
    // Your app can flip this true when user scrolls/reads but won't click primary CTA.
    // We'll keep it false by default and allow external wiring later.
    // setSignals(s => ({...s, actionButtonAvoidance:true }))

    const reset = () => {
        startRef.current = Date.now();
        clickTimesRef.current = [];
        guidanceShownRef.current = null;
        hoverStartRef.current = null;
        setSignals({
            timeOnPageMs: 0,
            repeatedClicks: 0,
            backAndForthNavCount: 0,
            pausesBeforeActionCount: 0,
            abandonedStepsCount: 0,
            rapidClickBurstCount: 0,
            scrollSpeed: "NORMAL",
            helpRequestsCount: 0,
            silenceAfterGuidanceMs: 0,
            hoverOnPricingOrSettingsMs: 0,
            readDepth: "MEDIUM",
            actionButtonAvoidance: false,
            quickDecisionCount: 0,
            clearProgressionCount: 0,
        });
    };

    return {
        signals,
        reset,
        markGuidanceShown,
        markPrimaryActionAttempt,
        markStepAbandoned,
        markProgressStep,
        markQuickDecision,
        markHelpRequest,
    };
}
