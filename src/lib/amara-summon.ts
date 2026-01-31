export type SummonReason =
    | "USER_REQUEST"
    | "OVERWHELMED_SIGNAL"
    | "CAUTIOUS_SIGNAL"
    | "DISENGAGED_SIGNAL"
    | "ASSISTANCE_NEEDED";

export type SummonIntensity = "LOW" | "MEDIUM" | "HIGH";

export interface SummonDecision {
    shouldSummon: boolean;
    intensity: SummonIntensity;
    reason?: SummonReason;
    message?: string; // what overlay says as she appears
}

export function decideSummon(args: {
    // from Step 4 policy
    uiIntensity: SummonIntensity;
    uiMode: "STEADY" | "CALM" | "TRANSPARENT" | "ENERGIZE" | "SOFT_EXIT";

    // from telemetry
    rapidClickBurstCount: number;
    backAndForthNavCount: number;
    pausesBeforeActionCount: number;
    helpRequestsCount: number;
    silenceAfterGuidanceMs: number;

    // from UI actions
    userClickedGuideMe: boolean;
    userDeclinedRecently: boolean;
}): SummonDecision {
    // Respect decline
    if (args.userDeclinedRecently) {
        return { shouldSummon: false, intensity: "LOW" };
    }

    // Always summon when user explicitly asks
    if (args.userClickedGuideMe) {
        return {
            shouldSummon: true,
            intensity: args.uiIntensity,
            reason: "USER_REQUEST",
            message: "I’m here. Tell me what you want to do on this page, and I’ll guide you.",
        };
    }

    // Never auto-summon in soft-exit (disengaged) mode—only soft check-ins
    if (args.uiMode === "SOFT_EXIT") {
        return { shouldSummon: false, intensity: "LOW" };
    }

    // Confusion/overwhelm signals (non-invasive)
    const overwhelmScore =
        args.rapidClickBurstCount * 2 +
        args.backAndForthNavCount * 1.2 +
        args.pausesBeforeActionCount * 1.0;

    if (overwhelmScore >= 6) {
        return {
            shouldSummon: true,
            intensity: "LOW", // keep gentle when overwhelmed
            reason: "OVERWHELMED_SIGNAL",
            message: "Let’s slow this down. I can give you one clear next step.",
        };
    }

    // Repeated help requests (active need)
    if (args.helpRequestsCount >= 2) {
        return {
            shouldSummon: true,
            intensity: args.uiIntensity,
            reason: "ASSISTANCE_NEEDED",
            message: "I’m with you. Ask me anything about this page and I’ll walk you through it.",
        };
    }

    // Default: don’t interrupt
    return { shouldSummon: false, intensity: "LOW" };
}
