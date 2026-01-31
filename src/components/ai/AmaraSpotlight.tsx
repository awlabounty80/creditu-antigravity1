import { useEffect, useState } from "react";
import { GuidedPlaybook } from "@/lib/amara-playbook";
import { motion } from "framer-motion";
import { X, CheckCircle } from "lucide-react";

/* ============================================================
   SPOTLIGHT OVERLAY (Highlight UI Element)
============================================================ */

export function SpotlightOverlay(props: {
    targetSelector?: string;
    isActive: boolean;
    onDismiss: () => void;
    helperText?: string;
}) {
    const [rect, setRect] = useState<DOMRect | null>(null);

    useEffect(() => {
        if (!props.isActive || !props.targetSelector) {
            setRect(null);
            return;
        }

        const update = () => {
            const el = document.querySelector(props.targetSelector!) as HTMLElement | null;
            if (!el) {
                setRect(null);
                return;
            }
            setRect(el.getBoundingClientRect());
        };

        update();
        const iv = window.setInterval(update, 250);
        window.addEventListener("resize", update);
        window.addEventListener("scroll", update, true);

        return () => {
            window.clearInterval(iv);
            window.removeEventListener("resize", update);
            window.removeEventListener("scroll", update, true);
        };
    }, [props.isActive, props.targetSelector]);

    if (!props.isActive) return null;

    // If no target found, just show a modal-like bubble in center? Or return null?
    // Let's fallback to center if no rect, or just hide spotlight and show checklists.
    // Actually, let's just return if no rect but keep the bubble generally?
    // User logic returns null if no rect.
    if (!rect) return null;

    const pad = 10;
    const hole = {
        top: rect.top - pad,
        left: rect.left - pad,
        width: rect.width + pad * 2,
        height: rect.height + pad * 2,
    };

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 10000 }} aria-hidden="false">
            {/* Dim layer */}
            <div
                onClick={props.onDismiss}
                style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.55)",
                }}
            />

            {/* Hole border */}
            <div
                style={{
                    position: "absolute",
                    top: hole.top,
                    left: hole.left,
                    width: hole.width,
                    height: hole.height,
                    borderRadius: 14,
                    border: "2px solid rgba(255,255,255,0.9)",
                    boxShadow: "0 0 0 9999px rgba(0,0,0,0.55)",
                    pointerEvents: "none",
                }}
            />

            {/* Helper bubble */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    position: "absolute",
                    top: hole.top + hole.height + 12,
                    left: Math.min(hole.left, window.innerWidth - 320),
                    width: 300,
                    padding: 16,
                    borderRadius: 20,
                    background: "white",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
                }}
            >
                <div style={{ fontWeight: 900, marginBottom: 6, color: '#1e293b' }}>Next step</div>
                <div style={{ opacity: 0.85, whiteSpace: "pre-wrap", color: '#475569', fontSize: 14, lineHeight: 1.5 }}>
                    {props.helperText ?? "Tap the highlighted area to continue."}
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <button
                        onClick={props.onDismiss}
                        className="text-xs font-bold text-slate-400 hover:text-slate-600 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        Close Guide
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

/* ============================================================
   GUIDED CHECKLIST (Step-by-step UI)
============================================================ */

export function GuidedChecklist(props: {
    playbook: GuidedPlaybook;
    currentStepIndex: number;
    onStepClick: (index: number) => void;
    onExit: () => void;
}) {
    return (
        <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="fixed top-24 right-6 w-80 bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl overflow-hidden z-[9995]"
        >
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Guided Mode</div>
                    <div className="font-heading font-bold text-slate-800">Your Playbook</div>
                </div>
                <button onClick={props.onExit} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                    <X size={16} />
                </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2 space-y-2">
                {props.playbook.steps.map((s, idx) => {
                    const isCurrent = idx === props.currentStepIndex;
                    const isDone = idx < props.currentStepIndex;

                    return (
                        <button
                            key={s.id}
                            onClick={() => props.onStepClick(idx)}
                            className={`w-full text-left p-3 rounded-xl transition-all border ${isCurrent
                                ? "bg-amber-50 border-amber-200 ring-1 ring-amber-100"
                                : isDone
                                    ? "bg-slate-50 border-transparent opacity-60"
                                    : "bg-white border-slate-100 hover:border-amber-200"
                                }`}
                        >
                            <div className="flex gap-3">
                                <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${isCurrent ? "bg-amber-500 border-amber-500 text-white" : isDone ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 text-slate-400"
                                    }`}>
                                    {isDone ? <CheckCircle size={12} /> : <span className="text-[10px] font-bold">{idx + 1}</span>}
                                </div>
                                <div>
                                    <div className={`text-sm font-bold ${isCurrent ? "text-slate-800" : "text-slate-600"}`}>
                                        {s.title}
                                    </div>
                                    {isCurrent && (
                                        <div className="text-xs text-slate-500 mt-1 leading-relaxed">
                                            {s.why}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </button>
                    )
                })}
            </div>
        </motion.div>
    );
}
