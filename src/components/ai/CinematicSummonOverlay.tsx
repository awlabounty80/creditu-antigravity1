import React, { useEffect, useState } from "react";
import type { SummonIntensity } from "@/lib/amara-summon";
import { Sparkles, Crown } from "lucide-react";

export function CinematicSummonOverlay(props: {
    open: boolean;
    intensity: SummonIntensity;
    headline?: string;
    subtext?: string;
    onClose: () => void;
    onDecline: () => void;
    avatarUrl?: string;
}) {
    const [phase, setPhase] = useState<"ENTER" | "HOLD" | "EXIT">("ENTER");

    useEffect(() => {
        if (!props.open) return;

        setPhase("ENTER");
        const t1 = window.setTimeout(() => setPhase("HOLD"), 900);
        return () => window.clearTimeout(t1);
    }, [props.open]);

    if (!props.open) return null;

    const intensity = props.intensity;

    // Intensity Config
    const config = {
        LOW: { glow: 'rgba(59, 130, 246, 0.4)', speed: '12s', scale: 0.95 },   // Blue, calm
        MEDIUM: { glow: 'rgba(245, 158, 11, 0.6)', speed: '6s', scale: 1.0 },   // Gold, active
        HIGH: { glow: 'rgba(239, 68, 68, 0.5)', speed: '2s', scale: 1.05 }      // Red/Hot, urgent
    }[intensity];

    return (
        <div style={sx.wrap} role="dialog" aria-label="Amara Summon Overlay">
            {/* Dim Backdrop with Blur Transition */}
            <div
                style={{
                    ...sx.backdrop,
                    opacity: phase === "EXIT" ? 0 : 1,
                    backdropFilter: phase === "ENTER" ? "blur(0px)" : "blur(4px)",
                    transition: "opacity 300ms, backdrop-filter 1s ease",
                }}
                onClick={props.onClose}
            />

            {/* Main Card Container */}
            <div
                style={{
                    ...sx.portalContainer,
                    transform:
                        phase === "ENTER"
                            ? `scale(0.8) translateY(20px)`
                            : phase === "HOLD"
                                ? `scale(${config.scale}) translateY(0)`
                                : `scale(0.9) translateY(10px)`,
                    opacity: phase === "EXIT" ? 0 : 1,
                    border: intensity === 'HIGH' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(255, 255, 255, 0.2)',
                }}
            >
                {/* 1. Portal Ring (Rotating Energy) */}
                <div
                    style={{
                        ...sx.ring,
                        background: `conic-gradient(from 0deg, transparent 0%, ${config.glow} 50%, transparent 100%)`,
                        animation: `amaraSpin ${config.speed} linear infinite`,
                    }}
                />

                {/* 2. Reverse Ring (Counter-rotation for complexity) */}
                <div
                    style={{
                        ...sx.ring,
                        width: '110%', height: '110%',
                        opacity: 0.5,
                        background: `conic-gradient(from 180deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)`,
                        animation: `amaraSpin ${parseInt(config.speed) * 1.5}s linear infinite reverse`,
                    }}
                />

                {/* 3. Screen Breach / Glare */}
                <div
                    style={{
                        ...sx.breach,
                        background: intensity === 'HIGH'
                            ? "radial-gradient(circle at 50% 0%, rgba(239,68,68,0.2), transparent 70%)"
                            : "radial-gradient(circle at 50% 0%, rgba(59,130,246,0.15), transparent 70%)",
                    }}
                />

                {/* 4. Content */}
                <div style={{ position: 'relative', zIndex: 10 }}>
                    {/* Character Avatar Bubble */}
                    <div
                        style={{
                            ...sx.avatarBubble,
                            boxShadow: `0 10px 40px ${config.glow}`,
                        }}
                    >
                        {props.avatarUrl ? (
                            <img
                                src={props.avatarUrl}
                                alt="Guide Amara U."
                                style={sx.avatarImg}
                            />
                        ) : (
                            <div style={sx.avatarPlaceholder}>
                                <div style={{ fontWeight: 900 }}>Amara U.</div>
                            </div>
                        )}

                        {/* Bee + Crown Motif (Watermark) */}
                        <div style={sx.motif}>
                            <Crown size={12} fill="#f59e0b" color="#f59e0b" />
                        </div>
                    </div>

                    {/* Text & Actions */}
                    <div style={sx.copy}>
                        <div style={sx.headline}>
                            {props.headline ?? "I'm here."}
                            <Sparkles size={16} className={`inline ml-2 ${intensity === 'HIGH' ? 'text-red-400' : 'text-amber-400'}`} />
                        </div>
                        <div style={sx.subtext}>
                            {props.subtext ?? "Ask me what you want to do on this page, and I'll guide you."}
                        </div>

                        <div style={sx.btnRow}>
                            <button style={sx.btnPrimary} onClick={props.onClose}>
                                Continue
                            </button>
                            <button
                                style={sx.btnSecondary}
                                onClick={() => {
                                    setPhase("EXIT");
                                    window.setTimeout(() => props.onDecline(), 220);
                                }}
                            >
                                Decline assistance
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Animations */}
            <style>{`
                @keyframes amaraSpin {
                  0% { transform: translate(-50%, -50%) rotate(0deg); }
                  100% { transform: translate(-50%, -50%) rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

const sx: Record<string, React.CSSProperties> = {
    wrap: {
        position: "fixed",
        inset: 0,
        zIndex: 12000,
        display: "grid",
        placeItems: "center",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
        perspective: "1000px", // Enhances 3D feels
    },
    backdrop: {
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.6)", // Darker for cinema focus
    },
    portalContainer: {
        position: "relative",
        width: 400,
        maxWidth: "92vw",
        borderRadius: 24,
        padding: 24,
        background: "rgba(10, 15, 30, 0.95)", // Detailed dark glass
        color: "white",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.1), 0 20px 60px rgba(0,0,0,0.6)", // Glass border + depth
        overflow: "hidden",
        textAlign: "center",
        display: "flex",
        flexDirection: "col" as any, // Flex column workaround for TS
        alignItems: "center",
        gap: 16,
        transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease", // Springy entrance
    },
    ring: {
        position: "absolute",
        top: "50%",
        left: "50%",
        width: "120%",
        height: "120%",
        borderRadius: "50%",
        pointerEvents: "none",
        mixBlendMode: "screen", // Energy blending
    },
    breach: {
        position: "absolute",
        top: 0, left: 0, right: 0, height: "100%",
        pointerEvents: "none",
    },
    avatarBubble: {
        width: 100,
        height: 100,
        borderRadius: "40%", // Squircle
        overflow: "hidden",
        border: "2px solid rgba(255,255,255,0.1)",
        background: "#000",
        position: "relative",
        margin: "0 auto",
    },
    avatarImg: { width: "100%", height: "100%", objectFit: "cover" },
    avatarPlaceholder: {
        width: '100%', height: '100%',
        display: 'grid', placeItems: 'center',
        background: '#1f2937', color: '#9ca3af'
    },
    motif: {
        position: 'absolute',
        bottom: 6, right: 6,
        background: 'rgba(0,0,0,0.6)',
        borderRadius: '50%',
        padding: 4,
    },
    copy: {
        display: "grid",
        gap: 8,
        maxWidth: 320,
    },
    headline: {
        fontWeight: 800,
        fontSize: 20,
        color: '#f3f4f6',
        letterSpacing: '-0.02em',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    subtext: {
        fontSize: 14,
        lineHeight: 1.5,
        color: '#9ca3af', // Muted text
    },
    btnRow: {
        display: "flex",
        gap: 8,
        marginTop: 12,
        justifyContent: "center",
        width: "100%",
    },
    btnPrimary: {
        flex: 1,
        padding: "10px 16px",
        borderRadius: 12,
        border: "none",
        background: "linear-gradient(135deg, #f59e0b, #d97706)", // Amber gold gradient
        color: "#fff",
        fontWeight: 700,
        fontSize: 14,
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)",
        transition: "transform 0.1s",
    },
    btnSecondary: {
        padding: "10px 16px",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.1)",
        background: "transparent",
        color: '#9ca3af',
        fontWeight: 600,
        fontSize: 13,
        cursor: "pointer",
        transition: "background 0.2s",
    },
};
