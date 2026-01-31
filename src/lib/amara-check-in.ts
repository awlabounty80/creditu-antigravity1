import type { EmotionUiPolicy } from "./amara-ui-policy";

export function shouldSoftCheckIn(args: {
    policy: EmotionUiPolicy;
    silenceAfterGuidanceMs: number;
    dockState: "OPEN" | "MINIMIZED" | "CLOSED";
}): boolean {
    if (!args.policy.allowAutoCheckIn) return false;

    // We generally only check in if the dock is OPEN (the user is engaging but went silent)
    // OR if you want Amara to pop up from minimized, remove this check. 
    // For now, based on instructions, we assume Open Dock check-in.
    if (args.dockState !== "OPEN") return false;

    return args.silenceAfterGuidanceMs >= args.policy.checkInAfterSilenceMs;
}
