import type { EmotionUiPolicy } from "./amara-ui-policy";

export type Choice = { label: string; action: string; kind?: "PRIMARY" | "SECONDARY" };

export function applyChoicePolicy(input: {
    choices: Choice[];
    policy: EmotionUiPolicy;
}): Choice[] {
    const { choices, policy } = input;

    // Always keep "Not right now" if present
    const notNow = choices.find((c) => c.action === "NOT_NOW" || c.action === "decline_help" || c.label.toLowerCase().includes("not right"));
    const minimize = choices.find((c) => c.action === "MINIMIZE" || c.label.toLowerCase().includes("minimize"));

    // Remove any upsell-like actions if policy says never upsell
    const filtered = policy.neverUpsell
        ? choices.filter((c) => !/upgrade|buy|purchase|pricing|plan/i.test(c.label))
        : choices;

    // Prioritize step-by-step if overwhelmed/curious and available
    let ordered = [...filtered];
    if (policy.preferStepByStep) {
        ordered.sort((a, b) => {
            const aScore = /step|walk|guide/i.test(a.label) ? -1 : 0;
            const bScore = /step|walk|guide/i.test(b.label) ? -1 : 0;
            return aScore - bScore;
        });
    }

    // Limit to maxChoices but preserve "Not right now" / Minimize when possible
    let limited = ordered.slice(0, policy.maxChoices);

    if (notNow && !limited.some((c) => c.action === notNow.action)) limited.push(notNow);
    else if (!notNow && minimize && !limited.some((c) => c.action === minimize.action)) limited.push(minimize);

    // Hard cap after adding a safety choice
    limited = limited.slice(0, Math.max(policy.maxChoices, 2) + 1);

    return limited;
}
