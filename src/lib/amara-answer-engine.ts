import { PageId, AllowedAction, PageKnowledgeMap } from '@/lib/amara-knowledge-maps'
import { EmotionState } from '@/lib/amara-emotion-logic'

export type UiMode = "STEADY" | "CALM" | "TRANSPARENT" | "ENERGIZE" | "SOFT_EXIT";



export interface AnswerContext {
    pageId: PageId;
    pageLabel?: string;
    userName?: string;
    emotionState: EmotionState;
    uiMode: UiMode;
    map: PageKnowledgeMap;
    timeOnPageMs?: number;
}

export interface AnswerPolicy {
    maxBullets: number;
    maxSteps: number;
    includeWhy: boolean;
    offerChoices: boolean;
    tone: "CALM" | "TRANSPARENT" | "ENERGIZE" | "EFFICIENT" | "SOFT";
}

export function getAnswerPolicy(ctx: AnswerContext): AnswerPolicy {
    switch (ctx.emotionState) {
        case "OVERWHELMED":
            return { maxBullets: 3, maxSteps: 1, includeWhy: true, offerChoices: true, tone: "CALM" };
        case "CAUTIOUS_DISTRUSTFUL":
            return { maxBullets: 4, maxSteps: 2, includeWhy: true, offerChoices: true, tone: "TRANSPARENT" };
        case "CURIOUS_ENGAGED":
            return { maxBullets: 6, maxSteps: 4, includeWhy: true, offerChoices: true, tone: "ENERGIZE" };
        case "CONFIDENT_READY":
            return { maxBullets: 4, maxSteps: 4, includeWhy: false, offerChoices: true, tone: "EFFICIENT" };
        case "DISENGAGED_FATIGUED":
        default:
            return { maxBullets: 2, maxSteps: 1, includeWhy: false, offerChoices: true, tone: "SOFT" };
    }
}

export type UserQuestionIntent =
    | "HOW_DO_I_START"
    | "WHAT_IS_THIS_PAGE"
    | "HOW_DO_I_USE_THIS"
    | "WHAT_DO_I_DO_NEXT"
    | "PRIVACY_SECURITY"
    | "PRICING_LEVELS"
    | "REWARDS"
    | "TROUBLESHOOT"
    | "CONCEPTUAL_WHY"
    | "UNKNOWN";

export function classifyQuestion(q: string): UserQuestionIntent {
    const s = (q || "").toLowerCase();

    if (/why|concept|theory|strategy|explain the logic|how does this work/.test(s)) return "CONCEPTUAL_WHY";
    if (/start|begin|where do i start|first step|how to start/.test(s)) return "HOW_DO_I_START";
    if (/what is this page|what is this|what does this do|purpose/.test(s)) return "WHAT_IS_THIS_PAGE";
    if (/how do i use|how to use|how does this work|walk me through|step by step|how do i/.test(s)) return "HOW_DO_I_USE_THIS";
    if (/next|what do i do next|best next step|now what/.test(s)) return "WHAT_DO_I_DO_NEXT";
    if (/privacy|secure|security|data|store|save|ssn|dob|personal info/.test(s)) return "PRIVACY_SECURITY";
    if (/pricing|price|level|membership|upgrade|plan/.test(s)) return "PRICING_LEVELS";
    if (/reward|vending|spin|prize|moo points/.test(s)) return "REWARDS";
    if (/error|not working|stuck|problem|issue|bug|help/.test(s)) return "TROUBLESHOOT";

    return "UNKNOWN";
}

export interface AmaraAnswer {
    text: string;
    choices: { label: string; action: AllowedAction | "STEP_BY_STEP" | "MINIMIZE" | "DECLINE" | "HANDOFF_TO_LEVERAGE" }[];
    suggestedAction?: AllowedAction | "STEP_BY_STEP" | "HANDOFF_TO_LEVERAGE";
    intent: UserQuestionIntent;
}

function tonePrefix(policy: AnswerPolicy, userName?: string) {
    const name = userName ? `${userName}, ` : "";
    switch (policy.tone) {
        case "CALM":
            return `${name}let’s slow it down together.`;
        case "TRANSPARENT":
            return `${name}I’ll be clear and you stay in control.`;
        case "ENERGIZE":
            return `${name}you’re exploring the right way—let’s connect the dots.`;
        case "EFFICIENT":
            return `${name}here’s the fastest path.`;
        case "SOFT":
        default:
            return `${name}no pressure—I'm here if you want help.`;
    }
}

function limitList(items: string[], max: number) {
    return items.slice(0, Math.max(0, max));
}

function defaultChoices(ctx: AnswerContext): AmaraAnswer["choices"] {
    const base: AmaraAnswer["choices"] = [
        { label: "Guide me step-by-step", action: "STEP_BY_STEP" },
        { label: "Minimize", action: "MINIMIZE" },
    ];
    if (ctx.map.nextBestActions[0]) {
        base.splice(1, 0, { label: "Show my next best step", action: ctx.map.nextBestActions[0] });
    }
    return base;
}

export function answerQuestion(args: { question: string; ctx: AnswerContext }): AmaraAnswer {
    const { question, ctx } = args;
    const intent = classifyQuestion(question);
    const policy = getAnswerPolicy(ctx);

    const header = tonePrefix(policy, ctx.userName);
    const identityLine = `You’re on: ${ctx.map.pageTitle} — ${ctx.map.pageIdentity}.`;
    const purposeLine = `Purpose: ${ctx.map.pagePurpose}.`;

    let bullets: string[] = [];
    let steps: string[] = [];
    let suggestedAction: AmaraAnswer["suggestedAction"] = "STEP_BY_STEP";

    if (intent === "CONCEPTUAL_WHY") {
        return {
            text: `${header}\n\nYou're asking about the deep strategy ("Why"). That's Dr. Leverage's specialty.\n\nWould you like a deeper explanation from Dr. Leverage, our Credit U professor?\nHe focuses on the logic behind the strategy. You can return to me anytime.`,
            choices: [
                { label: "Yes, bring in Dr. Leverage", action: "HANDOFF_TO_LEVERAGE" },
                { label: "Not right now", action: "DECLINE" }
            ],
            suggestedAction: "HANDOFF_TO_LEVERAGE",
            intent
        }
    }

    if (intent === "WHAT_IS_THIS_PAGE") {

        bullets = limitList(
            [
                identityLine,
                purposeLine,
                `If you tell me what you’re trying to accomplish, I’ll guide you without overwhelming you.`,
            ],
            policy.maxBullets
        );
        suggestedAction = ctx.map.nextBestActions[0] ?? "tour";
    }

    if (intent === "HOW_DO_I_START" || intent === "WHAT_DO_I_DO_NEXT") {
        const next = ctx.map.nextBestActions[0] ?? "tour";
        const next2 = ctx.map.nextBestActions[1];
        bullets = limitList(
            [
                `Start with one step: **${formatAction(next)}**.`,
                policy.includeWhy ? `Why: this matches the page purpose and gets you moving fast.` : "",
                next2 ? `If you prefer, you can also: **${formatAction(next2)}**.` : "",
            ].filter(Boolean),
            policy.maxBullets
        );
        suggestedAction = next;
    }

    if (intent === "HOW_DO_I_USE_THIS") {
        steps = limitList(
            [
                `Click the primary action on this page (the main button/card).`,
                `Follow the on-screen prompts.`,
                `Save/confirm when you finish so your progress counts.`,
                `If you want, I can turn on step-by-step spotlight guidance.`,
            ],
            policy.maxSteps
        );
        suggestedAction = "STEP_BY_STEP";
    }

    if (intent === "PRIVACY_SECURITY") {
        bullets = limitList(
            [
                `We don’t need sensitive personal data to guide you.`,
                `I respond to behavior signals (time on page, hesitation patterns) — not private details.`,
                `You can decline or close me anytime.`,
                `If you're in Settings, I can explain what each toggle affects.`,
            ],
            policy.maxBullets
        );
        suggestedAction = "manage_privacy";
    }

    if (intent === "PRICING_LEVELS") {
        bullets = limitList(
            [
                `You can compare levels without upgrading.`,
                `I can show what changes at each level in outcomes (support/tools), not hype.`,
                `If you want, tell me your goal and I’ll recommend the best fit—no pressure.`,
            ],
            policy.maxBullets
        );
        suggestedAction = "compare_levels";
    }

    if (intent === "REWARDS") {
        bullets = limitList(
            [
                `Rewards reflect progress and keep momentum joyful.`,
                `You can redeem now or save for later.`,
                `If you tell me what you unlocked, I’ll explain what it helps you do.`,
            ],
            policy.maxBullets
        );
        suggestedAction = "redeem_reward";
    }

    if (intent === "TROUBLESHOOT") {
        steps = limitList(
            [
                `Tell me what you clicked and what you expected to happen.`,
                `I’ll give you one clear next step (or spotlight the exact button).`,
            ],
            policy.maxSteps
        );
        suggestedAction = "STEP_BY_STEP";
    }

    if (intent === "UNKNOWN") {
        bullets = limitList(
            [
                identityLine,
                `Tell me what you’re trying to do on this page in one sentence.`,
                `I can explain, guide step-by-step, or step back—your choice.`,
            ],
            policy.maxBullets
        );
        suggestedAction = "STEP_BY_STEP";
    }

    const body =
        bullets.length > 0
            ? bullets.map((b) => `• ${b}`).join("\n")
            : steps.length > 0
                ? `Steps:\n${steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}`
                : `• ${identityLine}\n• ${purposeLine}`;

    return {
        text: `${header}\n\n${body}`,
        choices: defaultChoices(ctx),
        suggestedAction,
        intent
    };
}

function formatAction(a: AllowedAction) {
    return a
        .replace(/_/g, " ")
        .replace(/\b\w/g, (m) => m.toUpperCase());
}
