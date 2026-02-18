import { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Crown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPortal } from 'react-dom';

interface LevelUpOverlayProps {
    newLevel: string;
    onDismiss: () => void;
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()";

export function LevelUpOverlay({ newLevel, onDismiss }: LevelUpOverlayProps) {
    const [step, setStep] = useState(0);
    const [displayText, setDisplayText] = useState(newLevel);

    // Parallax Tilt Logic
    const [rotate, setRotate] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const card = e.currentTarget;
        const box = card.getBoundingClientRect();
        const x = e.clientX - box.left;
        const y = e.clientY - box.top;
        const centerX = box.width / 2;
        const centerY = box.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        setRotate({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setRotate({ x: 0, y: 0 }); // Reset on leave
    };

    // Scramble / Decode Effect
    useEffect(() => {
        if (step < 2) return; // Wait until card appears

        let iteration = 0;
        const interval = setInterval(() => {
            setDisplayText(prev =>
                newLevel
                    .split("")
                    .map((letter, index) => {
                        if (index < iteration) {
                            return newLevel[index];
                        }
                        return CHARS[Math.floor(Math.random() * CHARS.length)];
                    })
                    .join("")
            );

            if (iteration >= newLevel.length) {
                clearInterval(interval);
            }

            iteration += 1 / 3; // Speed of decode
        }, 30);

        return () => clearInterval(interval);
    }, [step, newLevel]);

    useEffect(() => {
        // Sequence the animation
        const timer1 = setTimeout(() => setStep(1), 100); // Fade in bg
        const timer2 = setTimeout(() => setStep(2), 500); // Scale up card (SLAM)
        const timer3 = setTimeout(() => {
            setStep(3); // Confetti
            fireConfetti();
        }, 800);

        // Continuous confetti bursts for extra hype
        const confettiInterval = setInterval(() => {
            if (step >= 3) fireConfetti();
        }, 2000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            clearInterval(confettiInterval);
        }
    }, []);

    const fireConfetti = () => {
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#2563eb', '#f59e0b', '#ffd700', '#ffffff'], // Royal Blue & Gold
                shapes: ['square', 'circle'],
                scalar: 1.2,
                gravity: 0.8
            });
            confetti({
                particleCount: 8,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#2563eb', '#f59e0b', '#ffd700', '#ffffff'], // Royal Blue & Gold
                shapes: ['square', 'circle'],
                scalar: 1.2,
                gravity: 0.8
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        frame();
    };

    return createPortal(
        <div className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-700 ${step >= 1 ? 'bg-black/90 backdrop-blur-xl' : 'bg-transparent pointer-events-none'}`}>

            {/* Ambient Glow / Video Background */}
            <div className={`absolute inset-0 bg-black transition-opacity duration-1000 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}>
                <video
                    src="/assets/celebration-loop.mp4"
                    autoPlay
                    loop
                    playsInline
                    className="w-full h-full object-cover opacity-80 mix-blend-screen animate-pulse-slow"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 via-black/40 to-black/80" />
            </div>

            {/* Main Card Container with Perspective */}
            <div
                className="relative perspective-1000"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                <style>{`
                    @keyframes beat {
                        0%, 100% { transform: scale(1); }
                        25% { transform: scale(1.02); }
                        50% { transform: scale(1.05); }
                        75% { transform: scale(1.02); }
                    }
                    @keyframes impact-shake {
                        0% { transform: translate(0, 0); }
                        10% { transform: translate(-10px, -10px); }
                        20% { transform: translate(10px, 10px); }
                        30% { transform: translate(-10px, 10px); }
                        40% { transform: translate(10px, -10px); }
                        50% { transform: translate(-5px, -5px); }
                        60% { transform: translate(5px, 5px); }
                        100% { transform: translate(0, 0); }
                    }
                    .animate-beat {
                        animation: beat 0.8s infinite ease-in-out;
                    }
                    .animate-impact {
                        animation: impact-shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
                    }
                `}</style>

                <div
                    className={`relative w-[90vw] max-w-lg p-1 transition-all duration-200 ease-out 
                        ${step >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                        ${step === 2 ? 'animate-impact' : ''} 
                    `}
                    style={{
                        transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(${step >= 2 ? 1 : 0.5})`,
                        transformStyle: 'preserve-3d'
                    }}
                >
                    {/* Border Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-emerald-500 rounded-[2.5rem] p-[2px] animate-gradient-xy shadow-[0_0_50px_rgba(99,102,241,0.5)]" />

                    {/* BEAT WRAPPER */}
                    <div className="animate-beat w-full h-full">
                        <div className="relative bg-[#050B1C]/90 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-12 text-center overflow-hidden border border-white/10" style={{ transform: 'translateZ(20px)' }}>
                            {/* Background rays */}
                            <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(99,102,241,0.3)_90deg,transparent_180deg)] animate-[spin_4s_linear_infinite] opacity-50 mixing-blend-screen" />

                            {/* Particle effects inside card */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.2)_0%,transparent_70%)] animate-pulse" />
                            </div>

                            <div className="relative z-10 flex flex-col items-center transform-style-3d">
                                <div className="mb-6 relative group" style={{ transform: 'translateZ(40px)' }}>
                                    <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-60 animate-pulse group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 delay-100" />
                                    <Crown className="w-24 h-24 text-amber-400 drop-shadow-[0_0_25px_rgba(251,191,36,0.8)] animate-bounce relative z-10" strokeWidth={1.5} />
                                </div>

                                <h2 className="text-sm font-black text-indigo-300 uppercase tracking-[0.4em] mb-2 animate-in slide-in-from-bottom-2 fade-in duration-700 delay-300 fill-mode-backwards drop-shadow-[0_0_10px_rgba(99,102,241,0.8)]" style={{ transform: 'translateZ(30px)' }}>
                                    Clearance Updated
                                </h2>

                                {/* DECODING TEXT EFFECT */}
                                <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-indigo-100 to-indigo-300 mb-6 uppercase tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.4)] leading-tight w-full min-h-[1.2em] font-mono" style={{ transform: 'translateZ(50px)' }}>
                                    {displayText}
                                </h1>

                                <p className="text-slate-300 text-lg mb-8 max-w-xs mx-auto animate-in slide-in-from-bottom-2 fade-in duration-700 delay-700 fill-mode-backwards font-medium leading-relaxed" style={{ transform: 'translateZ(30px)' }}>
                                    You have unlocked exclusive tools. The path to financial freedom accelerates now.
                                </p>

                                <div className="flex gap-4 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-1000 fill-mode-backwards w-full" style={{ transform: 'translateZ(40px)' }}>
                                    <Button
                                        onClick={onDismiss}
                                        className="w-full h-16 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-lg font-black tracking-widest shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_50px_rgba(99,102,241,0.6)] hover:scale-[1.02] transition-all border border-white/20 relative overflow-hidden group"
                                    >
                                        <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:animate-shine" />
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            CONTINUE MISSION <ArrowRight className="w-5 h-5" />
                                        </span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
