// CREDIT U ADMISSIONS MACHINE V5.1 (HARDENED BUILD)
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
    Trophy as TrophyIcon,
    ScrollText,
    Award,
    ListChecks,
    Share2,
    Stamp
} from 'lucide-react';
import { useDormWeek, Reward, AdmissionsSession } from '@/hooks/useDormWeek';
import confetti from 'canvas-confetti';

const SYMBOLS = [
    { icon: ScrollText, color: 'text-blue-400', label: 'CREDIT U CREDIT TIPS' },
    { icon: Award, color: 'text-amber-400', label: 'CREDIT U FOUNDERS PASS' },
    { icon: ListChecks, color: 'text-emerald-400', label: 'CREDIT CHECKLIST' },
    { icon: ShieldCheck, color: 'text-blue-400', label: 'APPROVED' },
    { icon: CreditCard, color: 'text-amber-500', label: 'FUNDED' },
    { icon: Key, color: 'text-zinc-600', label: 'LOCKED' } // Index 5 for locked placeholder
];

// Audio Sound Engine (Generative Arcade Sounds)
const playSound = (type: 'spin' | 'stop' | 'win' | 'jackpot') => {
    try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Layer 1: Core Frequency
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        // Layer 2: Harmony/Texture
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);

        if (type === 'spin') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(150, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        } else if (type === 'stop') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(330, ctx.currentTime);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
        } else if (type === 'win') {
            // Arpeggio feel
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
            osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.2);
            
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
            osc2.frequency.exponentialRampToValueAtTime(1318.51, ctx.currentTime + 0.2);
            
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain2.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
            gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        } else if (type === 'jackpot') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(100, ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(2000, ctx.currentTime + 1.5);
            
            osc2.type = 'square';
            osc2.frequency.setValueAtTime(150, ctx.currentTime);
            osc2.frequency.linearRampToValueAtTime(300, ctx.currentTime + 1.5);

            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain2.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 1.5);
            gain2.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 1.5);
        }

        osc.start();
        osc2.start();
        osc.stop(ctx.currentTime + (type === 'jackpot' ? 1.5 : 0.2));
        osc2.stop(ctx.currentTime + (type === 'jackpot' ? 1.5 : 0.2));
    } catch (e) {
        console.warn("Audio engine feedback loop active.");
    }
};

// Talking Machine Logic
const speak = (text: string) => {
    if ('speechSynthesis' in window) {
        // Cancel ongoing to prevent queue lag
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Find a high-energy voice if possible
        const voices = window.speechSynthesis.getVoices();
        const highEnergyVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Announcer') || v.name.includes('Male')) || voices[0];
        
        if (highEnergyVoice) utterance.voice = highEnergyVoice;
        
        utterance.rate = 1.1; 
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
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
    const [reels, setReels] = useState([5, 5, 5]); // Initialize to LOCKED
    const [session, setSession] = useState<AdmissionsSession | null>(null);
    const [currentReward, setCurrentReward] = useState<Reward | null>(null);
    const [shake, setShake] = useState(false);
    const [localSpinCount, setLocalSpinCount] = useState(0);
    const [showStamp, setShowStamp] = useState(false);
    const [showShareModule, setShowShareModule] = useState(false);
    const [bonusReelSpun, setBonusReelSpun] = useState(false);

    useEffect(() => {
        const init = async () => {
            await new Promise(r => setTimeout(r, 500));
            const sess = await getAdmissionsSession(email);
            if (sess) {
                setSession(sess);
                setLocalSpinCount(sess.spin_count);
                // Set initial reels based on progress
                if (sess.spin_count === 1) setReels([0, 5, 5]);
                else if (sess.spin_count === 2) setReels([0, 1, 5]);
                else if (sess.spin_count >= 3) {
                    setReels([0, 1, 2]);
                    setShowStamp(true);
                    setShowShareModule(true);
                }
            }
        };
        init();
    }, [email, getAdmissionsSession]);


    const spin = async () => {
        if (isSpinning || localSpinCount >= 3) return;

        setIsSpinning(true);
        setShake(false);

        // Talking Feed
        const phrases = ["Initializing sequence!", "Ramping up energy!", "Final Step Active!"];
        speak(phrases[localSpinCount] || phrases[0]);

        let spinCount = 0;
        const spinInterval = setInterval(() => {
            const pitchShift = Math.min(2000, 150 + (spinCount * 40));
            playSound('spin');
            spinCount++;
        }, 120);

        try {
            const res = await getSpinResult(email);

            setTimeout(() => {
                clearInterval(spinInterval);
                
                // PROGRESSIVE REEL LOCKING 
                if (res.spinCount === 1) setReels([0, 5, 5]);
                else if (res.spinCount === 2) setReels([0, 1, 5]);
                else if (res.spinCount >= 3) setReels([0, 1, 2]);
                
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

                if (res.spinCount === 3) {
                    speak("YOU DID IT! OFFICIAL ADMISSION! You are officially a Freshman at Credit University! Let's Go!");
                    
                    // Fire massive Stadium Horn & Crowd Roar from the video asset track at 100% volume
                    const megaHorn = new Audio('/dorm-week-celebration.mp4');
                    megaHorn.volume = 1.0;
                    megaHorn.play().catch(e => console.warn('Horn audio prevented', e));

                    playSound('jackpot');
                    setShake(true);
                    setTimeout(() => setShake(false), 800);
                    setShowStamp(true);
                    setTimeout(() => setShowShareModule(true), 2500);
                } else {
                    const remaining = 3 - res.spinCount;
                    speak(`NICE SHOT! ${remaining} TO GO! Keep that momentum moving!`);
                    playSound('win');
                }

                try { triggerCelebration(res.spinCount === 3 ? 'acceptance' : 'resource'); } catch(e) {}
                
            }, 1800);

        } catch (error) {
            clearInterval(spinInterval);
            setIsSpinning(false);
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
        if (localSpinCount >= 3) {
            onResult({ spinCount: 3, isAccepted: true });
        }
    };

    const handleBonusSpin = async () => {
        setBonusReelSpun(true);
        triggerCelebration('bonus');
        speak("Bonus Moo Points Unlocked! Viral Access Granted!");
        
        // Permanently Credit the Wallet for the Student Locker
        try {
            const currentMoo = parseInt(localStorage.getItem(`cu_moo_points_${email}`) || '500');
            localStorage.setItem(`cu_moo_points_${email}`, (currentMoo + 1000).toString());
        } catch(e) {}

        // Native Viral Share Logic
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Credit University Alpha Class',
                    text: 'I just got accepted into the Credit University Dorm Week Takeover. Join me on the inside.',
                    url: 'https://creditu-antigravity1.vercel.app/'
                });
            } catch (err) {
                console.log('Share dismissed');
            }
        } else {
            try {
                navigator.clipboard.writeText('https://creditu-antigravity1.vercel.app/');
                alert('Access Link copied to clipboard! Paste it to a friend!');
            } catch(e) {}
        }
    };

    return (
        <div className="flex flex-col items-center justify-start gap-8 w-full relative pb-20">
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
                    className="absolute inset-0 bg-contain bg-center bg-no-repeat z-10 pointer-events-none drop-shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
                    style={{ backgroundImage: 'url("/creditu-machine-luxury.png")' }}
                />

                {/* THE REEL SYSTEM - VERTICAL SPINNING ROWS */}
                {/* REELS PLACED AT Z-30 ON TOP OF IMAGE, BUT WITH MIX BLEND SCREEN & NO BACKGROUND TO MERGE WITH THE BLACK WINDOWS */}
                <div
                    onClick={() => { if (!isSpinning) spin(); }}
                    className="absolute top-[41.5%] left-1/2 -translate-x-1/2 w-[58%] h-[24.5%] z-30 flex gap-[2%] items-center px-[2%] cursor-pointer mix-blend-screen"
                >
                    {[0, 1, 2].map((reelIdx) => (
                        <div key={reelIdx} className="flex-1 h-full bg-transparent relative overflow-hidden flex flex-col items-center">
                            <motion.div
                                animate={isSpinning ? { y: ["0%", "-500%"] } : { y: "0%" }}
                                transition={isSpinning ? { duration: 0.15, repeat: Infinity, ease: "linear" } : { type: "spring", stiffness: 300, damping: 20 }}
                                className="w-full flex flex-col items-center justify-start h-[600%]"
                            >
                                {isSpinning ? (
                                    // High-Speed Blur Reels
                                    [...Array(6)].map((_, i) => (
                                        <div key={i} className="flex flex-col items-center justify-center h-[16.666%] filter blur-[3px] opacity-40">
                                            {React.createElement(SYMBOLS[i % SYMBOLS.length].icon, { className: `w-12 h-12 ${SYMBOLS[i % SYMBOLS.length].color}` })}
                                        </div>
                                    ))
                                ) : (
                                    // Static Winning Result based on state logic (LOCKED or ACTUAL VALUE)
                                    <div className={`flex flex-col items-center justify-center h-[16.666%] gap-1 ${reels[reelIdx] === 5 ? 'opacity-40' : 'opacity-100'} w-full p-2`}>
                                        {React.createElement(SYMBOLS[reels[reelIdx]].icon, {
                                            className: `w-12 h-12 md:w-20 md:h-20 ${SYMBOLS[reels[reelIdx]].color} drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]`
                                        })}
                                    </div>
                                )}
                            </motion.div>

                            {/* Light Bloom overlay for Holo Effect */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_100%)] pointer-events-none z-10" />
                        </div>
                    ))}
                </div>

                {/* THE "APPROVED" SMASH STAMP */}
                <AnimatePresence>
                    {showStamp && (
                        <motion.div 
                            initial={{ scale: 5, opacity: 0, rotate: -20 }}
                            animate={{ scale: 1, opacity: 1, rotate: -5 }}
                            transition={{ type: "spring", stiffness: 300, damping: 10 }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] z-[60] pointer-events-none flex flex-col items-center justify-center"
                        >
                            <div className="border-[8px] border-[#E6911D] rounded-xl p-4 bg-blue-900/40 backdrop-blur-md shadow-[0_0_100px_rgba(230,145,29,1)] flex flex-col items-center text-center transform perspective-[1000px] rotateX-[10deg]">
                                <Stamp className="w-20 h-20 text-[#E6911D] mb-2 drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]" />
                                <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-[#E6911D] uppercase drop-shadow-[0_5px_5px_rgba(0,0,0,1)] leading-none border-b-4 border-[#E6911D] pb-2 mb-2">APPROVED</h1>
                                <p className="text-3xl font-black text-white tracking-[0.3em] uppercase">CREDIT U DORM WEEK</p>
                                <p className="text-xl font-bold text-blue-300 tracking-[0.5em] uppercase mt-1">ALPHA CLASS</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* HIGH-ENERGY SPIN BUTTON */}
                <div className="absolute bottom-[23%] left-1/2 -translate-x-1/2 w-[30%] h-[12%] z-40">
                    <button
                        onClick={(e) => { 
                            e.stopPropagation(); 
                            if (!isSpinning) {
                                if (localSpinCount >= 3) {
                                    onResult({ spinCount: 3, isAccepted: true });
                                } else {
                                    spin();
                                }
                            } 
                        }}
                        disabled={isSpinning}
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
                                        <span className="text-2xl md:text-4xl font-black text-black leading-none">
                                            {localSpinCount >= 3 ? "FINISH" : localSpinCount === 0 ? "START" : `SPIN #${localSpinCount + 1}`}
                                        </span>
                                        <span className="text-[8px] font-bold text-black opacity-60 tracking-widest uppercase">
                                            {localSpinCount >= 3 ? "MISSION COMPLETE" : `STEP ${localSpinCount + 1} OF 3 ACTIVE`}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </button>
                </div>

            </motion.div>

            {/* IN-DOC MODULES (No fixed overlays!) */}
            <div className="w-full max-w-4xl flex flex-col items-center gap-8 mt-4 z-50">
                
                {/* REWARD DISPLAY FOR SPINS 1 & 2 */}
                <AnimatePresence mode="wait">
                    {currentReward && localSpinCount > 0 && localSpinCount < 3 && (
                        <motion.div
                            key={currentReward.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="bg-[#0a0f1d]/90 backdrop-blur-xl border-2 border-amber-500/50 p-6 md:p-8 rounded-3xl shadow-[0_0_60px_rgba(245,158,11,0.2),inset_0_0_20px_rgba(245,158,11,0.1)] w-full text-center relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.1)_0%,transparent_100%)] pointer-events-none" />
                            <p className="text-[12px] md:text-sm font-black uppercase tracking-[0.5em] text-amber-500 mb-3 drop-shadow-md">
                                SEQUENCE #{localSpinCount} REWARD SECURED
                            </p>
                            <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full mb-4 shadow-[0_0_30px_rgba(245,158,11,0.5)]">
                                {currentReward.type === 'tip' && <Sparkles className="w-8 h-8 text-black" />}
                                {currentReward.type === 'resource' && <Gift className="w-8 h-8 text-black" />}
                                {currentReward.type === 'acceptance' && <Award className="w-8 h-8 text-black" />}
                            </div>
                            <h3 className="text-3xl md:text-5xl font-black italic uppercase text-white mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                                {currentReward.title}
                            </h3>
                            <p className="text-slate-300 text-lg md:text-xl italic px-4 md:px-12 font-medium leading-relaxed drop-shadow-sm">
                                "{currentReward.content}"
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 3rd Spin Acceptance Letter */}
                <AnimatePresence>
                    {localSpinCount >= 3 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="bg-gradient-to-br from-[#0f172a] to-[#020617] backdrop-blur-3xl border border-amber-500/40 p-8 md:p-12 rounded-3xl shadow-[0_0_100px_rgba(245,158,11,0.15)] w-full relative overflow-hidden"
                        >
                            {/* Watermark Logo/Effect */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
                                <Award className="w-96 h-96 text-amber-500" />
                            </div>

                            <div className="flex flex-col items-center text-center relative z-10">
                                <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center border-2 border-amber-500/50 mb-6 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                                    <ScrollText className="w-10 h-10 text-amber-400" />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 tracking-widest uppercase mb-2">
                                    OFFICIAL ACCEPTANCE
                                </h2>
                                <h3 className="text-lg md:text-xl font-bold uppercase text-white tracking-[0.4em] mb-8 border-b border-amber-500/20 pb-6 w-full max-w-lg">
                                    CREDIT UNIVERSITY
                                </h3>
                                
                                <div className="text-slate-300 text-lg md:text-xl leading-relaxed space-y-6 max-w-2xl font-serif">
                                    <p>
                                        Dear Future Alumnus,
                                    </p>
                                    <p>
                                        We are honored to officially welcome you to <strong className="text-white font-sans font-black tracking-wider">Credit University's Alpha Class</strong>. Your progression through the Dorm Week Initiation sequence has been verified and fully approved.
                                    </p>
                                    <p>
                                        You now possess the foundational tools required to engineer your elite financial architecture. This pristine access grants you immediate entry to the Student Locker and all exclusive curriculum protocols.
                                    </p>
                                    <p className="text-amber-400 font-sans font-black tracking-[0.3em] uppercase text-sm mt-8 pt-6 border-t border-amber-500/20">
                                        Welcome to the 1%
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* HOLOGRAPHIC SHARE CARD (Bonus Reel) */}
                <AnimatePresence>
                    {showShareModule && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }} 
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full bg-gradient-to-r from-blue-900/40 to-black border border-blue-500/50 rounded-3xl p-8 shadow-[0_0_60px_rgba(59,130,246,0.3)] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden backdrop-blur-xl"
                        >
                            {!bonusReelSpun ? (
                                <>
                                    <div className="flex flex-col flex-1">
                                        <h4 className="text-2xl font-black italic text-white tracking-wider uppercase">Share with friend to unlock <span className="text-amber-500 block text-3xl">Bonus Moo Points Spin</span></h4>
                                        <p className="text-blue-300 mt-2 font-semibold">Earn critical gamification tokens immediately.</p>
                                    </div>
                                    <button 
                                        onClick={handleBonusSpin}
                                        className="bg-blue-600 hover:bg-blue-500 w-full md:w-auto text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest shadow-[0_0_40px_rgba(37,99,235,0.6)] flex items-center justify-center gap-3 transition-transform active:scale-95"
                                    >
                                        <Share2 className="w-7 h-7" /> Share Access
                                    </button>
                                </>
                            ) : (
                                <div className="w-full flex justify-center items-center bg-black/50 p-6 rounded-2xl border border-amber-500/30">
                                    <div className="flex items-center gap-8">
                                        <div className="w-24 h-24 bg-amber-500/20 border border-amber-500 rounded-2xl flex items-center justify-center animate-pulse shadow-[0_0_60px_#f59e0b]">
                                            <Award className="w-12 h-12 text-amber-500" />
                                        </div>
                                        <div className="text-center md:text-left">
                                            <p className="text-amber-500 font-extrabold tracking-[0.3em] text-sm uppercase mb-1">Bonus Spin Win!</p>
                                            <p className="text-5xl font-black italic text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">1000 MOO POINTS</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* PROCEED TO NEXT PHASE */}
                {localSpinCount >= 3 && (
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        onClick={handleProceed}
                        className="group relative w-full h-24 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-black uppercase tracking-[0.2em] text-2xl rounded-3xl hover:brightness-110 transition-all flex items-center justify-center gap-4 shadow-[0_0_80px_rgba(245,158,11,0.4)] overflow-hidden"
                    >
                        <span className="relative z-10">PROCEED TO LOCKER</span>
                        <ChevronRight className="relative z-10 w-10 h-10 group-hover:translate-x-3 transition-transform" />
                        <div className="absolute inset-x-0 bottom-0 h-0 bg-black/10 group-hover:h-full transition-all duration-300" />
                    </motion.button>
                )}
            </div>
        </div>
    );
};
