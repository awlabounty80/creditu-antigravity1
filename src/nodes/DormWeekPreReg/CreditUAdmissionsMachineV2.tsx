// CREDIT U ADMISSIONS MACHINE V5.0 (HIGH-ENERGY EXPERIENCE)
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck,
    CreditCard,
    GraduationCap,
    Key,
    Trophy,
    DollarSign,
    Sparkles,
    Gift,
    ChevronRight,
    Trophy as TrophyIcon
} from 'lucide-react';
import { useDormWeek, Reward, AdmissionsSession } from '@/hooks/useDormWeek';
import confetti from 'canvas-confetti';

const SYMBOLS = [
    { icon: ShieldCheck, color: 'text-blue-400', label: 'APPROVED' },
    { icon: CreditCard, color: 'text-amber-400', label: 'FUNDED' },
    { icon: GraduationCap, color: 'text-white', label: 'ADMITTED' },
    { icon: Key, color: 'text-amber-500', label: 'DORM KEY' },
    { icon: Trophy, color: 'text-indigo-400', label: 'FOUNDER' },
    { icon: DollarSign, color: 'text-emerald-400', label: 'GRANT' }
];

// Audio Sound Engine (Generative Arcade Sounds)
const playSound = (type: 'spin' | 'stop' | 'win' | 'jackpot') => {
    try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === 'spin') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(200, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        } else if (type === 'stop') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(440, ctx.currentTime);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
        } else if (type === 'win') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
            osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.2); // C6
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        } else if (type === 'jackpot') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(100, ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(1000, ctx.currentTime + 1);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 1);
        }

        osc.start();
        osc.stop(ctx.currentTime + (type === 'jackpot' ? 1.5 : 0.2));
    } catch (e) {
        console.warn("Audio Context failed to initialize (Interaction required)");
    }
};

// Talking Machine Logic
const speak = (text: string) => {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.2;
        utterance.pitch = 0.9;
        window.speechSynthesis.speak(utterance);
    }
};

interface CreditUAdmissionsMachineProps {
    email: string;
    onResult: (result: any) => void;
}

export const CreditUAdmissionsMachineV2: React.FC<CreditUAdmissionsMachineProps> = ({ email, onResult }) => {
    const { getSpinResult, getAdmissionsSession } = useDormWeek();
    const [isSpinning, setIsSpinning] = useState(false);
    const [reels, setReels] = useState([0, 1, 2]);
    const [session, setSession] = useState<AdmissionsSession | null>(null);
    const [currentReward, setCurrentReward] = useState<Reward | null>(null);
    const [showResultOverlay, setShowResultOverlay] = useState(false);
    const [shake, setShake] = useState(false);
    const [localSpinCount, setLocalSpinCount] = useState(0);
    const [excitementText, setExcitementText] = useState<string | null>(null);

    useEffect(() => {
        const init = async () => {
            const sess = await getAdmissionsSession(email);
            if (sess) {
                setSession(sess);
                setLocalSpinCount(sess.spin_count);
            }
        };
        init();
    }, [email, getAdmissionsSession]);

    const spin = async () => {
        if (isSpinning || localSpinCount >= 3) return;

        setIsSpinning(true);
        setShowResultOverlay(false);
        setShake(false);
        setExcitementText(null);

        // Talking Feed
        const phrases = [
            "Initializing yard sequence!",
            "Ramping up the energy!",
            "Let's win some Moo Points!",
            "Final Admission Step Active!"
        ];
        speak(phrases[localSpinCount] || phrases[0]);

        // Start Spin Sound Loop
        const spinInterval = setInterval(() => playSound('spin'), 150);

        try {
            const res = await getSpinResult(email);

            // Reduced latency for snap
            setTimeout(() => {
                clearInterval(spinInterval);
                setReels(res.reels);
                setCurrentReward(res.reward);
                setIsSpinning(false);
                setLocalSpinCount(res.spinCount);
                playSound('stop');

                // Update session
                setSession(prev => {
                    const base = prev || { email, spin_count: 0, rewards_won: [], is_accepted: false, admissions_complete: false, current_step: 'spin' };
                    return {
                        ...base,
                        spin_count: res.spinCount,
                        rewards_won: [...base.rewards_won, res.reward.id],
                        is_accepted: res.isAccepted
                    } as AdmissionsSession;
                });

                // Excitement Overlays
                if (res.isAccepted) {
                    setExcitementText("CONGRATULATIONS! ADMITTED!");
                    speak("Congratulations! You are officially admitted to Credit University!");
                    playSound('jackpot');
                } else {
                    setExcitementText(`WINNER! ${3 - res.spinCount} SPINS LEFT!`);
                    speak(`Winner! ${3 - res.spinCount} spins remaining! Keep going!`);
                    playSound('win');
                }

                triggerCelebration(res.reward.type);
                if (res.reward.type === 'acceptance') {
                    setShake(true);
                    setTimeout(() => setShake(false), 800);
                }
                setTimeout(() => setShowResultOverlay(true), 800);
            }, 1800); // 1.8s Fast Spin duration

        } catch (error) {
            clearInterval(spinInterval);
            setIsSpinning(false);
            console.error("Spin error:", error);
        }
    };

    const triggerCelebration = (type: string) => {
        const end = Date.now() + 3000;
        const colors = ['#fbbf24', '#3b82f6', '#ffffff', '#fb923c'];
        (function frame() {
            confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0, y: 0.6 }, colors });
            confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1, y: 0.6 }, colors });
            if (Date.now() < end) requestAnimationFrame(frame);
        }());
    };

    const handleProceed = () => {
        setShowResultOverlay(false);
        if (localSpinCount === 3) {
            onResult({ spinCount: 3, isAccepted: true });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center gap-4 w-full relative">
            <AnimatePresence>
                {excitementText && !showResultOverlay && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0, y: -50 }}
                        animate={{ opacity: 1, scale: 1.2, y: 0 }}
                        exit={{ opacity: 0, scale: 2, filter: 'blur(10px)' }}
                        className="absolute -top-24 z-50 text-amber-500 font-black text-4xl md:text-6xl italic uppercase tracking-tighter drop-shadow-[0_0_20px_rgba(245,158,11,0.8)] text-center"
                    >
                        {excitementText}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Session Indicator */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex gap-4">
                {[1, 2, 3].map(i => (
                    <div
                        key={i}
                        className={`w-3 h-3 rounded-full border border-white/20 transition-all duration-500 ${i <= localSpinCount ? 'bg-amber-500 shadow-[0_0_15px_#f59e0b] scale-125' : 'bg-white/5'}`}
                    />
                ))}
            </div>

            <motion.div
                animate={shake ? { x: [0, -20, 20, -20, 20, 0], y: [0, 10, -10, 10, -10, 0] } : {}}
                className="relative w-full max-w-[800px] aspect-square flex items-center justify-center select-none"
            >
                <div
                    className="absolute inset-0 bg-contain bg-center bg-no-repeat z-0 pointer-events-none drop-shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
                    style={{ backgroundImage: 'url("/creditu-slot-frame-master-v2.png")' }}
                />

                {/* THE REEL SYSTEM - VERTICAL SPINNING ROWS */}
                <div
                    onClick={() => { if (!isSpinning) spin(); }}
                    className="absolute top-[48.5%] left-1/2 -translate-x-1/2 w-[60%] h-[23%] z-30 flex gap-[2%] items-center px-[1%] cursor-pointer"
                >
                    {[0, 1, 2].map((reelIdx) => (
                        <div key={reelIdx} className="flex-1 h-full bg-black/80 backdrop-blur-md relative overflow-hidden flex flex-col items-center border-x border-white/10 shadow-[inner_0_0_80px_rgba(0,0,0,1)]">
                            <motion.div
                                animate={isSpinning ? { y: ["0%", "-500%"] } : { y: "0%" }}
                                transition={isSpinning ? { duration: 0.15, repeat: Infinity, ease: "linear" } : { type: "spring", stiffness: 300, damping: 20 }}
                                className="w-full flex flex-col pt-[15%]"
                            >
                                {isSpinning ? (
                                    // High-Speed Blur Reels
                                    [...Array(6)].map((_, i) => (
                                        <div key={i} className="flex flex-col items-center justify-center h-24 filter blur-[2px] opacity-40">
                                            {React.createElement(SYMBOLS[i % SYMBOLS.length].icon, { className: `w-12 h-12 ${SYMBOLS[i % SYMBOLS.length].color}` })}
                                        </div>
                                    ))
                                ) : (
                                    // Static Winning Result
                                    <div className="flex flex-col items-center justify-center gap-1">
                                        {React.createElement(SYMBOLS[reels[reelIdx]].icon, {
                                            className: `w-12 h-12 md:w-20 md:h-20 ${SYMBOLS[reels[reelIdx]].color} drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]`
                                        })}
                                        <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest ${SYMBOLS[reels[reelIdx]].color}`}>
                                            {SYMBOLS[reels[reelIdx]].label}
                                        </span>
                                    </div>
                                )}
                            </motion.div>

                            {/* Reel Glass Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none z-10" />
                            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none z-10" />
                        </div>
                    ))}
                </div>

                {/* HIGH-ENERGY SPIN BUTTON */}
                <div className="absolute bottom-[23%] left-1/2 -translate-x-1/2 w-[30%] h-[12%] z-40">
                    <button
                        onClick={(e) => { e.stopPropagation(); if (!isSpinning) spin(); }}
                        disabled={isSpinning || localSpinCount >= 3}
                        className="w-full h-full cursor-pointer transition-all active:scale-90 group"
                    >
                        <div className={`w-full h-full bg-gradient-to-b from-amber-400 to-amber-700 rounded-[20px] border-[6px] border-black p-1 shadow-[0_10px_0_0_rgb(146,64,14),0_20px_40px_rgba(0,0,0,0.5)] transform ${isSpinning ? 'translate-y-2 brightness-75' : 'hover:-translate-y-1'}`}>
                            <div className="w-full h-full bg-gradient-to-t from-amber-500 to-amber-300 rounded-lg flex flex-col items-center justify-center overflow-hidden">
                                {isSpinning ? (
                                    <div className="flex flex-col items-center">
                                        <Sparkles className="w-8 h-8 text-black animate-pulse" />
                                        <span className="text-[10px] font-black text-black">SPINNING...</span>
                                    </div>
                                ) : (
                                    <>
                                        <span className="text-2xl md:text-4xl font-black text-black leading-none">{localSpinCount >= 3 ? "FINISH" : "SPIN"}</span>
                                        <span className="text-[8px] font-bold text-black opacity-60 tracking-widest">{localSpinCount}/3 READY</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </button>
                </div>
            </motion.div>

            {/* RESULT PANEL */}
            <AnimatePresence>
                {showResultOverlay && currentReward && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.5 }}
                        className="fixed inset-x-0 bottom-10 z-[100] flex justify-center px-4"
                    >
                        <div className="bg-black/95 backdrop-blur-3xl border-4 border-amber-500 p-8 rounded-[40px] shadow-[0_0_120px_rgba(245,158,11,0.7)] text-center max-w-xl w-full border-b-[12px]">
                            <motion.div initial={{ rotate: -5 }} animate={{ rotate: 5 }} transition={{ duration: 0.5, repeat: Infinity, repeatType: 'mirror' }} className="inline-flex p-4 bg-amber-500 rounded-[2rem] shadow-[0_0_30px_#f59e0b] -mt-12 mb-6">
                                {currentReward.type === 'tip' && <Sparkles className="w-10 h-10 text-black" />}
                                {currentReward.type === 'resource' && <Gift className="w-10 h-10 text-black" />}
                                {currentReward.type === 'acceptance' && <TrophyIcon className="w-10 h-10 text-black" />}
                            </motion.div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-[12px] font-black uppercase tracking-[0.8em] text-amber-500 mb-2">YOU WON REWARD {localSpinCount} OF 3</p>
                                    <h3 className="text-4xl md:text-5xl font-black italic uppercase text-white leading-tight drop-shadow-lg">
                                        {currentReward.title}
                                    </h3>
                                </div>
                                <p className="text-slate-300 text-lg italic px-6 font-medium leading-relaxed">"{currentReward.content}"</p>
                                <button
                                    onClick={handleProceed}
                                    className="group relative w-full h-20 bg-white text-black font-black uppercase tracking-widest text-xl rounded-2xl hover:bg-amber-400 transition-all flex items-center justify-center gap-4 shadow-xl overflow-hidden"
                                >
                                    <span className="relative z-10">{localSpinCount === 3 ? "REVEAL ADMISSION" : "SPIN AGAIN!"}</span>
                                    <ChevronRight className="relative z-10 w-8 h-8 group-hover:translate-x-2 transition-transform" />
                                    <div className="absolute inset-x-0 bottom-0 h-0 bg-black/10 group-hover:h-full transition-all duration-300" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
