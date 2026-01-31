/**
 * Credit U — Guide Amara U.
 * PHASE 4: Adaptive Emotion Logic (Discernment Engine) — CODE
 *
 * Goals:
 * - Infer emotional state from non-invasive behavior signals (pattern-based)
 * - Adjust tone, pace, depth, and guidance style
 * - Enforce ethics: never pressure, never guilt, never emotionally upsell
 * - Contextual-only: no persistent emotion history required
 *
 * Drop-in TypeScript module (works in web apps, Next.js, etc.)
 */

export type EmotionState =
    | "OVERWHELMED"
    | "CAUTIOUS_DISTRUSTFUL"
    | "CURIOUS_ENGAGED"
    | "CONFIDENT_READY"
    | "DISENGAGED_FATIGUED";

export type ToneStyle = "GENTLE" | "WARM_AUTHORITY" | "TRANSPARENT" | "ENERGETIC" | "EFFICIENT";
export type Pace = "SLOW" | "NORMAL" | "FAST";
export type Depth = "LIGHT" | "STANDARD" | "DEEP";
export type GuidanceStyle =
    | "ONE_ACTION_ONLY"
    | "PERMISSION_BASED"
    | "INSIGHT_RICH"
    | "EXECUTION_FAST"
    | "SOFT_PRESENCE";

/** Non-invasive behavior signals (no personal data required) */
export interface BehaviorSignals {
    timeOnPageMs?: number;          // time spent on current page
    repeatedClicks?: number;        // repeated clicks/hesitation patterns
    backAndForthNavCount?: number;  // back/forward navigation loops
    pausesBeforeActionCount?: number; // pauses before primary actions
    abandonedStepsCount?: number;   // started but not completed flows
    rapidClickBurstCount?: number;  // rapid clicking bursts (overwhelm)
    scrollSpeed?: "SLOW" | "NORMAL" | "FAST";
    helpRequestsCount?: number;     // repeated help summons
    silenceAfterGuidanceMs?: number; // time after guidance with no response
    hoverOnPricingOrSettingsMs?: number; // time hovering pricing/settings areas
    readDepth?: "LOW" | "MEDIUM" | "HIGH"; // proxy: how much content they read
    actionButtonAvoidance?: boolean; // user avoids primary CTA
    quickDecisionCount?: number;     // user makes quick selections
    clearProgressionCount?: number;  // number of completed consecutive steps
}

/** Output adjustment profile (what Amara changes) */
export interface EmotionAdjustment {
    state: EmotionState;
    confidence: number; // 0..1
    tone: ToneStyle;
    pace: Pace;
    depth: Depth;
    guidanceStyle: GuidanceStyle;

    // "How she behaves" primitives
    maxChoicesToShow: number; // reduce choices when overwhelmed
    shouldProactivelyCheckIn: boolean; // soft check-in for disengaged
    shouldOfferStepByStep: boolean; // offer guided execution
    shouldStepBackIfSilent: boolean; // respect silence

    // Human-facing copy building blocks
    openingLine: string;
    supportLine: string;
    choicePrompts: string[];
}

/** Immutable ethical rules for the agent */
export const ETHICS = Object.freeze({
    neverPressure: true,
    neverGuilt: true,
    neverUpsellEmotionally: true,
    alwaysOfferChoice: true,
    alwaysExplainWhy: true,
    alwaysRespectSilence: true,
});

/** Utility: clamp value */
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

/**
 * Scoring model:
 * Produce a score per state, then choose the max.
 * Keep it simple, transparent, and easy to tune.
 */
export function inferEmotionState(signals: BehaviorSignals): {
    state: EmotionState;
    confidence: number;
    scores: Record<EmotionState, number>;
} {
    const t = signals.timeOnPageMs ?? 0;
    const repeated = signals.repeatedClicks ?? 0;
    const nav = signals.backAndForthNavCount ?? 0;
    const pauses = signals.pausesBeforeActionCount ?? 0;
    const abandoned = signals.abandonedStepsCount ?? 0;
    const bursts = signals.rapidClickBurstCount ?? 0;
    const help = signals.helpRequestsCount ?? 0;
    const silence = signals.silenceAfterGuidanceMs ?? 0;
    const hover = signals.hoverOnPricingOrSettingsMs ?? 0;
    const readDepth = signals.readDepth ?? "MEDIUM";
    const avoid = signals.actionButtonAvoidance ?? false;
    const quick = signals.quickDecisionCount ?? 0;
    const progress = signals.clearProgressionCount ?? 0;
    const scroll = signals.scrollSpeed ?? "NORMAL";

    // Base scores
    let overwhelmed = 0;
    let cautious = 0;
    let curious = 0;
    let confident = 0;
    let disengaged = 0;

    // OVERWHELMED signals
    overwhelmed += bursts * 1.6;
    overwhelmed += nav * 1.0;
    overwhelmed += pauses * 0.9;
    overwhelmed += abandoned * 1.2;
    overwhelmed += avoid ? 1.2 : 0;
    overwhelmed += repeated * 0.8;
    overwhelmed += t > 120000 ? 0.6 : 0; // lingering can indicate overwhelm

    // CAUTIOUS / DISTRUSTFUL signals
    cautious += (readDepth === "HIGH" ? 1.0 : readDepth === "MEDIUM" ? 0.4 : 0.1);
    cautious += hover > 8000 ? 1.4 : hover > 3000 ? 0.7 : 0;
    cautious += avoid ? 0.8 : 0;
    cautious += pauses * 0.4;
    cautious += nav * 0.3;

    // CURIOUS / ENGAGED signals
    curious += help * 0.7; // asking questions can be engagement too
    curious += (scroll === "SLOW" ? 1.0 : scroll === "NORMAL" ? 0.4 : 0.2);
    curious += repeated * 0.3; // exploring may include repeated clicks
    curious += readDepth === "HIGH" ? 0.6 : 0.2;

    // CONFIDENT / READY signals
    confident += quick * 1.2;
    confident += progress * 1.6;
    confident += (t < 45000 ? 0.6 : 0); // efficient pace can indicate confidence
    confident += help === 0 ? 0.3 : 0; // not needing help sometimes indicates confidence

    // DISENGAGED / FATIGUED signals
    disengaged += silence > 20000 ? 1.6 : silence > 8000 ? 0.8 : 0;
    disengaged += t > 180000 && progress === 0 ? 1.2 : 0; // idle + no progress
    disengaged += abandoned > 0 && help === 0 ? 0.6 : 0;  // quits without seeking help
    disengaged += scroll === "FAST" && readDepth === "LOW" ? 0.6 : 0;

    const scores: Record<EmotionState, number> = {
        OVERWHELMED: overwhelmed,
        CAUTIOUS_DISTRUSTFUL: cautious,
        CURIOUS_ENGAGED: curious,
        CONFIDENT_READY: confident,
        DISENGAGED_FATIGUED: disengaged,
    };

    // Choose best state
    const entries = Object.entries(scores) as [EmotionState, number][];
    entries.sort((a, b) => b[1] - a[1]);

    const [topState, topScore] = entries[0];
    const secondScore = entries[1]?.[1] ?? 0;

    // Confidence: difference ratio between top and second (simple + tunable)
    const confidence = clamp01((topScore - secondScore) / (topScore + 1e-6));

    return { state: topState, confidence, scores };
}

/** Build the adjustment profile (tone, pace, depth, behavior) */
export function getEmotionAdjustment(signals: BehaviorSignals): EmotionAdjustment {
    const { state, confidence } = inferEmotionState(signals);

    switch (state) {
        case "OVERWHELMED":
            return {
                state,
                confidence,
                tone: "WARM_AUTHORITY",
                pace: "SLOW",
                depth: "LIGHT",
                guidanceStyle: "ONE_ACTION_ONLY",
                maxChoicesToShow: 2,
                shouldProactivelyCheckIn: true,
                shouldOfferStepByStep: true,
                shouldStepBackIfSilent: true,
                openingLine: "Let’s pause for a second.",
                supportLine: "You don’t need to do everything right now.",
                choicePrompts: [
                    "I can narrow this down to one clear step.",
                    "Would you like me to guide you through it, step by step?",
                ],
            };

        case "CAUTIOUS_DISTRUSTFUL":
            return {
                state,
                confidence,
                tone: "TRANSPARENT",
                pace: "NORMAL",
                depth: "STANDARD",
                guidanceStyle: "PERMISSION_BASED",
                maxChoicesToShow: 3,
                shouldProactivelyCheckIn: true,
                shouldOfferStepByStep: false,
                shouldStepBackIfSilent: true,
                openingLine: "It’s okay to take your time here.",
                supportLine: "Nothing moves forward unless you choose it.",
                choicePrompts: [
                    "Would you like me to explain how this protects you?",
                    "Do you want a quick overview or full details?",
                ],
            };

        case "CURIOUS_ENGAGED":
            return {
                state,
                confidence,
                tone: "ENERGETIC",
                pace: "NORMAL",
                depth: "DEEP",
                guidanceStyle: "INSIGHT_RICH",
                maxChoicesToShow: 4,
                shouldProactivelyCheckIn: false,
                shouldOfferStepByStep: true,
                shouldStepBackIfSilent: true,
                openingLine: "Great question.",
                supportLine: "This connects to what you were exploring earlier.",
                choicePrompts: [
                    "Want to see how these pieces work together?",
                    "Do you want examples or a walkthrough?",
                ],
            };

        case "CONFIDENT_READY":
            return {
                state,
                confidence,
                tone: "EFFICIENT",
                pace: "FAST",
                depth: "STANDARD",
                guidanceStyle: "EXECUTION_FAST",
                maxChoicesToShow: 3,
                shouldProactivelyCheckIn: false,
                shouldOfferStepByStep: false,
                shouldStepBackIfSilent: true,
                openingLine: "You’re ready for this step.",
                supportLine: "Once you complete it, you’ll unlock what’s next.",
                choicePrompts: [
                    "Want me to stay nearby or step back?",
                    "Ready to execute now?",
                ],
            };

        case "DISENGAGED_FATIGUED":
        default:
            return {
                state,
                confidence,
                tone: "GENTLE",
                pace: "SLOW",
                depth: "LIGHT",
                guidanceStyle: "SOFT_PRESENCE",
                maxChoicesToShow: 2,
                shouldProactivelyCheckIn: true,
                shouldOfferStepByStep: false,
                shouldStepBackIfSilent: true,
                openingLine: "I’ll step back for now.",
                supportLine: "You can return anytime—this will be right where you left it.",
                choicePrompts: [
                    "If you want, I can simplify this when you’re ready.",
                    "Would you like to pause or keep going with one small step?",
                ],
            };
    }
}

/** UI-safe choices (always offer autonomy; never pressure) */
export type HelpChoiceAction = "STEP_BY_STEP" | "EXPLAIN" | "QUICK_SUMMARY" | "NOT_NOW" | "MINIMIZE";

export interface AmaraEmotionResponse {
    state: EmotionState;
    confidence: number;
    speak: string;
    tone: ToneStyle;
    pace: Pace;
    depth: Depth;
    guidanceStyle: GuidanceStyle;
    maxChoicesToShow: number;
    choices: { label: string; action: HelpChoiceAction }[];
    ethics: typeof ETHICS;
}

/** Generate a user-facing response template from adjustment + page context */
export function buildAmaraEmotionResponse(args: {
    userName?: string;
    pageLabel?: string; // e.g., "Credit Lab", "Dashboard"
    signals: BehaviorSignals;
}): AmaraEmotionResponse {
    const adj = getEmotionAdjustment(args.signals);
    const name = args.userName ? `${args.userName}, ` : "";
    const page = args.pageLabel ? ` on ${args.pageLabel}` : "";

    // Always: explain why (without sounding creepy). Keep it light.
    const whyLine =
        adj.state === "OVERWHELMED"
            ? "We can take this one step at a time."
            : adj.state === "CAUTIOUS_DISTRUSTFUL"
                ? "You stay in control the entire time."
                : adj.state === "CURIOUS_ENGAGED"
                    ? "Let’s connect the dots so it makes sense fast."
                    : adj.state === "CONFIDENT_READY"
                        ? "Let’s keep your momentum."
                        : "No pressure—your progress will still be here.";

    const speak =
        `${name}${adj.openingLine}\n` +
        `${adj.supportLine}\n` +
        `${whyLine}\n` +
        (adj.choicePrompts.length ? `\n${adj.choicePrompts[0]}` : "") +
        `${page ? `\n\n(You’re here${page}.)` : ""}`;

    // Choice sets: aligned with style, always includes “Not right now”
    const baseChoices: { label: string; action: HelpChoiceAction }[] =
        adj.guidanceStyle === "ONE_ACTION_ONLY"
            ? [
                { label: "One clear step", action: "QUICK_SUMMARY" },
                { label: "Guide me step-by-step", action: "STEP_BY_STEP" },
                { label: "Not right now", action: "NOT_NOW" },
            ]
            : adj.guidanceStyle === "PERMISSION_BASED"
                ? [
                    { label: "Explain how this protects me", action: "EXPLAIN" },
                    { label: "Quick overview", action: "QUICK_SUMMARY" },
                    { label: "Not right now", action: "NOT_NOW" },
                ]
                : adj.guidanceStyle === "INSIGHT_RICH"
                    ? [
                        { label: "Show how it connects", action: "EXPLAIN" },
                        { label: "Walk me through it", action: "STEP_BY_STEP" },
                        { label: "Quick summary", action: "QUICK_SUMMARY" },
                        { label: "Not right now", action: "NOT_NOW" },
                    ]
                    : adj.guidanceStyle === "EXECUTION_FAST"
                        ? [
                            { label: "Step back, I’ve got it", action: "NOT_NOW" },
                            { label: "Stay nearby", action: "MINIMIZE" },
                            { label: "Quick summary", action: "QUICK_SUMMARY" },
                        ]
                        : [
                            { label: "Pause for now", action: "NOT_NOW" },
                            { label: "One small next step", action: "QUICK_SUMMARY" },
                            { label: "Minimize", action: "MINIMIZE" },
                        ];

    const choices = baseChoices.slice(0, adj.maxChoicesToShow + 1); // +1 ensures "Not right now" often included

    return {
        state: adj.state,
        confidence: adj.confidence,
        speak,
        tone: adj.tone,
        pace: adj.pace,
        depth: adj.depth,
        guidanceStyle: adj.guidanceStyle,
        maxChoicesToShow: adj.maxChoicesToShow,
        choices,
        ethics: ETHICS,
    };
}
