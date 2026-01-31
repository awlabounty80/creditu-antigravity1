import { useState, useEffect } from "react";

/* ============================================================
   TYPES + PROGRESS STORE
============================================================ */

export type PageId =
    | "home_dashboard"
    | "credit_lab"
    | "credit_tools"
    | "courses_lessons"
    | "membership_levels"
    | "vending_machine"
    | "vision_center"
    | "community"
    | "profile_settings";

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
    | "join_discussion"
    | "stay_current"
    | "upgrade_intentionally"
    | "redeem_reward"
    | "save_reward"
    | "learn_reward_meaning"
    | "manifest_goal"
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

export type StepKind = "CLICK" | "READ" | "WATCH" | "INPUT" | "CONFIRM";

export interface GuidedStep {
    id: string;
    title: string;
    why: string;
    kind: StepKind;
    targetSelector?: string;
    instruction?: string;
    completion?: {
        type: "SIGNAL" | "DOM";
        signal?: CompletionSignal;
        domSelector?: string;
    };
}

export interface GuidedPlaybook {
    pageId: PageId;
    action: AllowedAction;
    steps: GuidedStep[];
    completionSignalsToSet?: CompletionSignal[];
}

export interface ProgressState {
    completedSignals: Partial<Record<CompletionSignal, boolean>>;
    lastPlaybookKey?: string;
}

const progressStore: ProgressState = {
    completedSignals: {},
    lastPlaybookKey: undefined,
};

export function setCompletion(signal: CompletionSignal, value = true) {
    progressStore.completedSignals[signal] = value;
}

export function isCompleted(signal: CompletionSignal): boolean {
    return !!progressStore.completedSignals[signal];
}

export function setLastPlaybookKey(key: string) {
    progressStore.lastPlaybookKey = key;
}

export function getLastPlaybookKey(): string | undefined {
    return progressStore.lastPlaybookKey;
}

/* ============================================================
   PLAYBOOK LIBRARY
============================================================ */

const PB = (pageId: PageId, action: AllowedAction, steps: GuidedStep[], completionSignalsToSet?: CompletionSignal[]): GuidedPlaybook => ({
    pageId,
    action,
    steps,
    completionSignalsToSet,
});

export const PLAYBOOKS: GuidedPlaybook[] = [
    PB(
        "home_dashboard",
        "start_foundation_task",
        [
            {
                id: "hd-1",
                title: "Choose your first foundation task",
                why: "One clear step builds momentum without overwhelm.",
                kind: "CLICK",
                targetSelector: '[data-amara-target="foundation-task"]',
                instruction: "Click the Foundation Task card to begin your first win.",
            },
            {
                id: "hd-2",
                title: "Complete the foundation task",
                why: "Completion unlocks clarity and confidence for the next stage.",
                kind: "CONFIRM",
                targetSelector: '[data-amara-target="foundation-complete"]',
                instruction: "Press Complete when finished.",
                completion: { type: "SIGNAL", signal: "foundation_task_completed" },
            },
        ],
        ["foundation_task_completed"]
    ),
    PB(
        "home_dashboard",
        "tour",
        [
            {
                id: "tour-1",
                title: "Start the Credit U tour",
                why: "A quick overview reduces confusion.",
                kind: "CLICK",
                targetSelector: '[data-amara-target="start-tour"]',
                instruction: "Click Start Tour.",
            },
            {
                id: "tour-2",
                title: "Finish the tour",
                why: "Once you see the map, you'll know what to do.",
                kind: "CONFIRM",
                targetSelector: '[data-amara-target="finish-tour"]',
                completion: { type: "SIGNAL", signal: "tour_completed" },
            },
        ],
        ["tour_completed"]
    ),
    PB(
        "credit_lab",
        "start_first_lab_task",
        [
            {
                id: "dispute-1",
                title: "Select your target",
                why: "We focus on one negative item at a time for maximum leverage.",
                kind: "CLICK",
                targetSelector: '[data-tour-id="account-list"]',
                instruction: "Click on an account marked 'Collection' or 'Late'.",
                completion: { type: "DOM", domSelector: '[data-tour-id="reason-options"]' }
            },
            {
                id: "dispute-2",
                title: "Choose the ground of dispute",
                why: "Accuracy is the law. If they can't prove it, they must remove it.",
                kind: "CLICK",
                targetSelector: '[data-tour-id="reason-options"]',
                instruction: "Select the reason. 'Not Mine' requires them to produce the original contract.",
                completion: { type: "DOM", domSelector: '[data-tour-id="letter-preview"]' }
            },
            {
                id: "dispute-3",
                title: "Review the legal weapon",
                why: "This letter uses FCRA 611 to force an investigation.",
                kind: "READ",
                targetSelector: '[data-tour-id="letter-preview"]',
                instruction: "Read the generated text. Ensure the account number is correct.",
                completion: { type: "SIGNAL", signal: "lab_task_completed" } // Placeholder, really just manual next
            },
            {
                id: "dispute-4",
                title: "Execute",
                why: "Action beats anxiety. Download and mail it.",
                kind: "CLICK",
                targetSelector: '[data-tour-id="download-btn"]',
                instruction: "Click Download. You'll get +100 Moo Points.",
            }
        ],
        ["lab_task_completed"]
    ),
    PB(
        "credit_tools",
        "run_simulation",
        [
            {
                id: "sim-1",
                title: "Adjust your variables",
                why: "This panel mimics the levers you pull in real life.",
                kind: "CLICK",
                targetSelector: '[data-tour-id="sim-controls"]',
                instruction: "Look at the 'Simulation Parameters' card.",
            },
            {
                id: "sim-2",
                title: "Test the Golden Rule",
                why: "Utilization is 30% of your score. Lower is better.",
                kind: "INPUT",
                targetSelector: '[data-tour-id="sim-utilization"]',
                instruction: "Drag the Utilization slider down to 9%. Watch what happens.",
                completion: { type: "DOM", domSelector: '[data-tour-id="sim-result"]' } // Weak completion signal, mostly manual Next
            },
            {
                id: "sim-3",
                title: "View the projection",
                why: "This is your potential future if you execute the plan.",
                kind: "READ",
                targetSelector: '[data-tour-id="sim-result"]',
                instruction: "See your new score? That gap is your opportunity.",
                completion: { type: "SIGNAL", signal: "simulation_run_completed" }
            }
        ],
        ["simulation_run_completed"]
    ),
    PB(
        "vending_machine",
        "redeem_reward",
        [
            {
                id: "moo-1",
                title: "Check your buying power",
                why: "Your Moo Points are your currency. Earn them by completing lessons.",
                kind: "READ",
                targetSelector: '[data-tour-id="moo-points"]',
                instruction: "See how much capital you have available.",
            },
            {
                id: "moo-2",
                title: "Filter by category",
                why: "Looking for tools? Or just fun wallpapers?",
                kind: "CLICK",
                targetSelector: '[data-tour-id="moo-tabs"]',
                instruction: "Use the tabs to narrow down your search.",
            },
            {
                id: "moo-3",
                title: "Select your reward",
                why: "Once you buy it, it's yours forever.",
                kind: "CLICK",
                targetSelector: '[data-tour-id="moo-grid"]',
                instruction: "Click 'Acquire' on any item you can afford.",
            }
        ],
        []
    ),
    PB(
        "vision_center",
        "manifest_goal",
        [
            {
                id: "vis-1",
                title: "Initiate manifestation",
                why: "Goals must be externalized to be realized.",
                kind: "CLICK",
                targetSelector: '[data-tour-id="add-manifestation"]',
                instruction: "Click the '+' card to start framing your vision.",
                completion: { type: "DOM", domSelector: '[data-tour-id="category-selector"]' }
            },
            {
                id: "vis-2",
                title: "Select 'Luxury Travel'",
                why: "Align with your new curriculum track.",
                kind: "CLICK",
                targetSelector: '[data-tour-id="cat-travel"]',
                instruction: "Choose the 'Luxury Travel' category.",
            },
            {
                id: "vis-3",
                title: "Define the details",
                why: "Specifics matter. 'Trip to Paris' < 'First Class to Paris'.",
                kind: "INPUT",
                targetSelector: '[data-tour-id="vision-input"]',
                instruction: "Type your specific goal below.",
            },
            {
                id: "vis-4",
                title: "Commit to the vision",
                why: "Adding it to the board makes it 'Real' to your subconscious.",
                kind: "CLICK",
                targetSelector: '[data-tour-id="confirm-vision"]',
                instruction: "Click Confirm Goal.",
            }
        ],
        []
    ),
    PB(
        "community",
        "join_discussion",
        [
            {
                id: "comm-1",
                title: "Join the conversation",
                why: "Your network is your net worth. Connect with others.",
                kind: "CLICK",
                targetSelector: '[data-tour-id="comm-start-btn"]',
                instruction: "Click 'Start Discussion' to open a new thread.",
                completion: { type: "DOM", domSelector: '[data-tour-id="comm-title-input"]' }
            },
            {
                id: "comm-2",
                title: "Define your topic",
                why: "A clear question gets the best answers.",
                kind: "INPUT",
                targetSelector: '[data-tour-id="comm-title-input"]',
                instruction: "Type a title for your discussion.",
            },
            {
                id: "comm-3",
                title: "Categorize it",
                why: "This helps experts find your question.",
                kind: "CLICK",
                targetSelector: '[data-tour-id="comm-category-select"]',
                instruction: "Select the relevant category.",
            },
            {
                id: "comm-4",
                title: "Broadcast",
                why: "Share your knowledge or ask for help.",
                kind: "CLICK",
                targetSelector: '[data-tour-id="comm-post-btn"]',
                instruction: "Click 'Post Global' to publish.",
            }
        ],
        []
    ),
    // Add other playbooks here...
];

export function getPlaybook(pageId: PageId, action: AllowedAction): GuidedPlaybook | undefined {
    return PLAYBOOKS.find((p) => p.pageId === pageId && p.action === action);
}

/* ============================================================
   HOOK: GUIDED ENGINE
============================================================ */

export interface GuidedEngineState {
    isActive: boolean;
    playbook?: GuidedPlaybook;
    stepIndex: number;
}

export function useGuidedEngine() {
    const [state, setState] = useState<GuidedEngineState>({
        isActive: false,
        playbook: undefined,
        stepIndex: 0,
    });

    const start = (playbook: GuidedPlaybook) => {
        const key = `${playbook.pageId}:${playbook.action}`;
        setLastPlaybookKey(key);
        setState({ isActive: true, playbook, stepIndex: 0 });
    };

    const exit = () => {
        setState({ isActive: false, playbook: undefined, stepIndex: 0 });
    };

    const goToStep = (idx: number) => {
        setState((s) => ({ ...s, stepIndex: Math.max(0, Math.min(idx, (s.playbook?.steps.length ?? 1) - 1)) }));
    };

    const completeCurrentStep = () => {
        setState((s) => {
            if (!s.playbook) return s;
            const step = s.playbook.steps[s.stepIndex];

            if (step.completion?.type === "SIGNAL" && step.completion.signal) {
                setCompletion(step.completion.signal, true);
            }

            const nextIdx = Math.min(s.stepIndex + 1, s.playbook.steps.length - 1);
            return { ...s, stepIndex: nextIdx };
        });
    };

    useEffect(() => {
        const pb = state.playbook;
        if (!state.isActive || !pb) return;

        const step = pb.steps[state.stepIndex];
        if (!step?.completion || step.completion.type !== "DOM" || !step.completion.domSelector) return;

        const iv = window.setInterval(() => {
            const el = document.querySelector(step.completion!.domSelector!) as HTMLElement | null;
            if (el) {
                completeCurrentStep();
            }
        }, 500);

        return () => window.clearInterval(iv);
    }, [state.isActive, state.playbook, state.stepIndex]);

    const finishIfLastStep = () => {
        const pb = state.playbook;
        if (!state.isActive || !pb) return;

        const isLast = state.stepIndex >= pb.steps.length - 1;
        if (isLast) {
            (pb.completionSignalsToSet ?? []).forEach((sig) => setCompletion(sig, true));
            exit();
        }
    };

    return { state, start, exit, goToStep, completeCurrentStep, finishIfLastStep };
}
