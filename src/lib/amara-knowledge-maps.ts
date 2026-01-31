/**
 * Credit U — Guide Amara U.
 * PHASE 3: Page Knowledge Maps (Brain Blueprint) — CODE
 *
 * Drop-in TypeScript module you can wire into Antigravity / Next.js / any web app.
 * - Stores Page Knowledge Maps
 * - Labels each page with: Page ID, Purpose, Allowed Actions, Completion Signals
 * - Provides a "Next Best Action" selector
 * - Provides script logic + choices without overwhelming the user
 */

export type PageId =
    | "home_dashboard"
    | "credit_lab"
    | "credit_tools"
    | "courses_lessons"
    | "membership_levels"
    | "vending_machine"
    | "profile_settings"
    | "unknown";

export type UserIntentSignal =
    | "where_do_i_start"
    | "am_i_in_right_place"
    | "curious_uncertain"
    | "focused"
    | "nervous_about_mistakes"
    | "wants_results"
    | "curious"
    | "analytical"
    | "risk_aware"
    | "learning_mode"
    | "feels_behind"
    | "comparing"
    | "evaluating_worth"
    | "cautious_trust"
    | "excitement"
    | "playfulness"
    | "motivation"
    | "control_focused"
    | "privacy_aware";

export type AllowedAction =
    | "tour"
    | "resume_last_activity"
    | "start_foundation_task"
    | "start_first_lab_task"
    | "learn_before_execute"
    | "check_readiness"
    | "run_simulation"
    | "adjust_variables"
    | "save_results"
    | "watch_lesson"
    | "read_summary"
    | "take_notes"
    | "compare_levels"
    | "stay_current"
    | "upgrade_intentionally"
    | "redeem_reward"
    | "save_reward"
    | "learn_reward_meaning"
    | "update_profile"
    | "manage_privacy"
    | "manage_notifications";

export type CompletionSignal =
    | "tour_completed"
    | "foundation_task_completed"
    | "lab_task_completed"
    | "simulation_run_completed"
    | "lesson_completed"
    | "notes_saved"
    | "level_compared"
    | "upgrade_completed"
    | "reward_redeemed"
    | "profile_updated"
    | "privacy_settings_saved";

export interface PageKnowledgeMap {
    pageId: PageId;
    pageTitle: string;

    // Layer 1: Identity (what this page is)
    pageIdentity: string;

    // Layer 2: Purpose (why it exists)
    pagePurpose: string;

    // Layer 3: User intent signals (what user is likely feeling/trying to do)
    userIntentSignals: UserIntentSignal[];

    // Layer 4: Next best actions
    nextBestActions: AllowedAction[];

    // Amara behavior and script logic
    amaraDefaultBehavior: string[];
    keyScriptLogic: string;

    // Implementation labels (for Antigravity/page telemetry)
    allowedActions: AllowedAction[];
    completionSignals: CompletionSignal[];
}

/** MASTER: Page Knowledge Maps */
export const PAGE_KNOWLEDGE_MAPS: Record<PageId, PageKnowledgeMap> = {
    home_dashboard: {
        pageId: "home_dashboard",
        pageTitle: "Home / Dashboard",
        pageIdentity: "The Command Center",
        pagePurpose: "Orient the user, reduce overwhelm, create momentum",
        userIntentSignals: ["where_do_i_start", "am_i_in_right_place", "curious_uncertain"],
        amaraDefaultBehavior: ["Brief grounding", "Big-picture clarity", "Offer a path, not pressure"],
        keyScriptLogic:
            "This dashboard shows you where you are and where you’re going. You don’t need to do everything today. Would you like me to highlight your best next step?",
        nextBestActions: ["tour", "resume_last_activity", "start_foundation_task"],
        allowedActions: ["tour", "resume_last_activity", "start_foundation_task"],
        completionSignals: ["tour_completed", "foundation_task_completed"],
    },

    credit_lab: {
        pageId: "credit_lab",
        pageTitle: "Credit Lab",
        pageIdentity: "Action + Transformation Zone",
        pagePurpose: "Teach credit through execution, not theory",
        userIntentSignals: ["focused", "nervous_about_mistakes", "wants_results"],
        amaraDefaultBehavior: ["Slow down", "Explain why before action", "Encourage confidence"],
        keyScriptLogic:
            "This is where change actually happens. Each action here builds leverage. Would you like me to walk beside you step by step?",
        nextBestActions: ["start_first_lab_task", "learn_before_execute", "check_readiness"],
        allowedActions: ["start_first_lab_task", "learn_before_execute", "check_readiness"],
        completionSignals: ["lab_task_completed"],
    },

    credit_tools: {
        pageId: "credit_tools",
        pageTitle: "Credit Tools (Simulators / Builders / Trackers)",
        pageIdentity: "Strategy Instruments",
        pagePurpose: "Let users see outcomes before committing",
        userIntentSignals: ["curious", "analytical", "risk_aware"],
        amaraDefaultBehavior: ["Translate numbers into meaning", "Connect tools to real life"],
        keyScriptLogic:
            "This tool shows you the future before you step into it. Would you like to test scenarios or understand how this affects your real credit?",
        nextBestActions: ["run_simulation", "adjust_variables", "save_results"],
        allowedActions: ["run_simulation", "adjust_variables", "save_results"],
        completionSignals: ["simulation_run_completed"],
    },

    courses_lessons: {
        pageId: "courses_lessons",
        pageTitle: "Courses / Lessons",
        pageIdentity: "Knowledge Transfer Hall",
        pagePurpose: "Build understanding, not overwhelm",
        userIntentSignals: ["learning_mode", "feels_behind"],
        amaraDefaultBehavior: ["Normalize pace", "Reinforce progress"],
        keyScriptLogic:
            "You’re not behind. You’re right on time for this lesson. Would you like a summary or to go deeper?",
        nextBestActions: ["watch_lesson", "read_summary", "take_notes"],
        allowedActions: ["watch_lesson", "read_summary", "take_notes"],
        completionSignals: ["lesson_completed", "notes_saved"],
    },

    membership_levels: {
        pageId: "membership_levels",
        pageTitle: "Membership / Levels",
        pageIdentity: "Access & Expansion Gateway",
        pagePurpose: "Show value clearly, not pressure upgrades",
        userIntentSignals: ["comparing", "evaluating_worth", "cautious_trust"],
        amaraDefaultBehavior: ["Explain benefits in outcomes, not hype", "Honor autonomy"],
        keyScriptLogic:
            "Each level unlocks support, not superiority. Would you like to see what changes at the next level—or stay right where you are?",
        nextBestActions: ["compare_levels", "stay_current", "upgrade_intentionally"],
        allowedActions: ["compare_levels", "stay_current", "upgrade_intentionally"],
        completionSignals: ["level_compared", "upgrade_completed"],
    },

    vending_machine: {
        pageId: "vending_machine",
        pageTitle: "Credit U Vending Machine",
        pageIdentity: "Reward + Surprise Engine",
        pagePurpose: "Reinforce progress through delight",
        userIntentSignals: ["excitement", "playfulness", "motivation"],
        amaraDefaultBehavior: ["Celebrate wins", "Encourage engagement"],
        keyScriptLogic:
            "You earned this. Every reward here reflects movement forward. Ready to see what you unlocked?",
        nextBestActions: ["redeem_reward", "save_reward", "learn_reward_meaning"],
        allowedActions: ["redeem_reward", "save_reward", "learn_reward_meaning"],
        completionSignals: ["reward_redeemed"],
    },

    profile_settings: {
        pageId: "profile_settings",
        pageTitle: "Profile / Settings",
        pageIdentity: "Identity & Control Center",
        pagePurpose: "Empower ownership and safety",
        userIntentSignals: ["control_focused", "privacy_aware"],
        amaraDefaultBehavior: ["Reassure security", "Explain impact of changes"],
        keyScriptLogic:
            "This is where you stay in control. Nothing here changes your progress unless you choose it.",
        nextBestActions: ["update_profile", "manage_privacy", "manage_notifications"],
        allowedActions: ["update_profile", "manage_privacy", "manage_notifications"],
        completionSignals: ["profile_updated", "privacy_settings_saved"],
    },

    unknown: {
        pageId: "unknown",
        pageTitle: "Unknown Wing",
        pageIdentity: "Uncharted Territory",
        pagePurpose: "Provide general assistance",
        userIntentSignals: ["curious_uncertain"],
        amaraDefaultBehavior: ["Offer general help"],
        keyScriptLogic: "I'm right here if you need anything. What's on your mind?",
        nextBestActions: [],
        allowedActions: [],
        completionSignals: []
    }
};

/** Runtime context you can feed from your app */
export interface PageContext {
    pageId: PageId;
    userName?: string;

    // Lightweight behavior signals (optional)
    timeOnPageMs?: number;
    repeatedClicks?: number;
    backNavCount?: number;
    helpRequestsCount?: number;

    // What actions are currently possible (dynamic)
    availableActions?: AllowedAction[];

    // Completed signals already achieved (progress)
    completed?: Partial<Record<CompletionSignal, boolean>>;

    // Optional: inferred intent signals from your app/agent layer
    inferredIntentSignals?: UserIntentSignal[];
}

/** Amara output structure (UI-ready) */
export interface AmaraGuidance {
    pageId: PageId;
    speak: string; // what she says
    choices: { label: string; action: AllowedAction | "decline_help" | "minimize" }[];
    nextBestAction?: AllowedAction;
    reason?: string;
}

/** Utility: choose next best action, honoring what’s available */
function pickNextBestAction(
    map: PageKnowledgeMap,
    ctx: PageContext
): { action?: AllowedAction; reason?: string } {
    const available = new Set(ctx.availableActions ?? map.allowedActions);

    // Prefer resuming progress if possible and not already completed
    if (available.has("resume_last_activity")) {
        return { action: "resume_last_activity", reason: "Resuming momentum reduces overwhelm and increases completion." };
    }

    // If the page has a canonical first action, choose it
    const preferredOrder: AllowedAction[] = map.nextBestActions;
    for (const a of preferredOrder) {
        if (available.has(a)) return { action: a, reason: `This aligns with the page purpose: ${map.pagePurpose}.` };
    }

    // Fallback: first available action
    return { action: map.nextBestActions[0], reason: "Selecting the safest available action for forward progress." };
}

/** Public: Generate Amara guidance for any page (the brain in motion) */
export function getAmaraGuidance(ctx: PageContext): AmaraGuidance {
    const map = PAGE_KNOWLEDGE_MAPS[ctx.pageId] || PAGE_KNOWLEDGE_MAPS.unknown;
    const { action, reason } = pickNextBestAction(map, ctx);

    const namePrefix = ctx.userName ? `${ctx.userName}, ` : "";
    const speak = map.keyScriptLogic
        ? `${namePrefix}${map.keyScriptLogic}`
        : `I am here to help.`;

    // Standard choice set (always offers choice, never pressure)
    const baseChoices: AmaraGuidance["choices"] = [
        { label: "Guide me step-by-step", action: action || "tour" },
        { label: "Explain this page", action: map.nextBestActions[0] || "tour" as any },
        { label: "Not right now", action: "decline_help" },
    ];

    return {
        pageId: ctx.pageId,
        speak,
        choices: baseChoices,
        nextBestAction: action,
        reason,
    };
}
