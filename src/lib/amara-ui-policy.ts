import type { EmotionState } from "./amara-emotion-logic";

export type UiMode = "STEADY" | "CALM" | "TRANSPARENT" | "ENERGIZE" | "SOFT_EXIT";

export interface EmotionUiPolicy {
    uiMode: UiMode;

    // How the UI behaves
    maxChoices: number;
    autoOpenOnHelp: boolean;
    allowAutoCheckIn: boolean;
    checkInAfterSilenceMs: number; // when to softly check in
    preferStepByStep: boolean;

    // What to avoid
    disableUrgencyLanguage: boolean;
    neverUpsell: boolean;

    // Visual intensity level for the panel (for later summon animations)
    intensity: "LOW" | "MEDIUM" | "HIGH";
}

export function getEmotionUiPolicy(state: EmotionState): EmotionUiPolicy {
    switch (state) {
        case "OVERWHELMED":
            return {
                uiMode: "CALM",
                maxChoices: 2,
                autoOpenOnHelp: true,
                allowAutoCheckIn: true,
                checkInAfterSilenceMs: 12000,
                preferStepByStep: true,
                disableUrgencyLanguage: true,
                neverUpsell: true,
                intensity: "LOW",
            };

        case "CAUTIOUS_DISTRUSTFUL":
            return {
                uiMode: "TRANSPARENT",
                maxChoices: 3,
                autoOpenOnHelp: true,
                allowAutoCheckIn: true,
                checkInAfterSilenceMs: 16000,
                preferStepByStep: false,
                disableUrgencyLanguage: true,
                neverUpsell: true,
                intensity: "LOW",
            };

        case "CURIOUS_ENGAGED":
            return {
                uiMode: "ENERGIZE",
                maxChoices: 4,
                autoOpenOnHelp: true,
                allowAutoCheckIn: false,
                checkInAfterSilenceMs: 999999,
                preferStepByStep: true,
                disableUrgencyLanguage: false,
                neverUpsell: true,
                intensity: "MEDIUM",
            };

        case "CONFIDENT_READY":
            return {
                uiMode: "STEADY",
                maxChoices: 3,
                autoOpenOnHelp: true,
                allowAutoCheckIn: false,
                checkInAfterSilenceMs: 999999,
                preferStepByStep: false,
                disableUrgencyLanguage: false,
                neverUpsell: true,
                intensity: "MEDIUM",
            };

        case "DISENGAGED_FATIGUED":
        default:
            return {
                uiMode: "SOFT_EXIT",
                maxChoices: 2,
                autoOpenOnHelp: false, // don’t interrupt—let user summon
                allowAutoCheckIn: true,
                checkInAfterSilenceMs: 9000,
                preferStepByStep: false,
                disableUrgencyLanguage: true,
                neverUpsell: true,
                intensity: "LOW",
            };
    }
}
