// CREDIT U ADMISSIONS MACHINE (STABILIZED V1.1)
// CACHE_BUST_OMEGA_REDEFINED_2026
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck,
    CreditCard,
    GraduationCap,
    Key,
    Trophy,
    DollarSign,
    Zap,
    Sparkles,
    ChevronRight,
    Loader2,
    Play
} from 'lucide-react';
import { useDormWeek, AcceptanceStatus } from '@/hooks/useDormWeek';
import confetti from 'canvas-confetti';

const SYMBOLS = [
    { icon: ShieldCheck, color: 'text-blue-400', label: 'APPROVED' },
    { icon: CreditCard, color: 'text-amber-400', label: 'FUNDED' },
    { icon: GraduationCap, color: 'text-white', label: 'ADMITTED' },
    { icon: Key, color: 'text-amber-500', label: 'DORM KEY' },
    { icon: Trophy, color: 'text-indigo-400', label: 'FOUNDER' },
    { icon: DollarSign, color: 'text-emerald-400', label: 'GRANT' }
];

interface CreditUAdmissionsMachineProps {
    email: string;
    onResult: (result: any) => void;
}

export const CreditUAdmissionsMachine: React.FC<CreditUAdmissionsMachineProps> = ({ email, onResult }) => {
    const { getSpinResult } = useDormWeek();
    const [isSpinning, setIsSpinning] = useState(false);
    const [reels, setReels] = useState([0, 1, 2]);
    const [result, setResult] = useState<any>(null);
    const [showResultOverlay, setShowResultOverlay] = useState(false);
    const [shake, setShake] = useState(false);

    useEffect(() => {
        console.log("CreditUAdmissionsMachine V1.1: COMPONENT MOUNTED. Hard Stabilization Active.");
    }, []);

    const spin = async () => {
        if (isSpinning) return;
        setIsSpinning(true);
        setShowResultOverlay(false);
        setShake(false);

        try {
            const spinResult = await getSpinResult(email);
            let duration = 3500;
            let startTime = Date.now();

            const animate = () => {
                const now = Date.now();
                const elapsed = now - startTime;
                if (elapsed < duration) {
                    setReels([
                        Math.floor(Math.random() * SYMBOLS.length),
                        Math.floor(Math.random() * SYMBOLS.length),
                        Math.floor(Math.random() * SYMBOLS.length)
                    ]);
                    requestAnimationFrame(animate);
                } else {
                    setReels(spinResult.reels);
                    setResult(spinResult);
                    setIsSpinning(false);
                    triggerCelebration(spinResult.resultKey);
                    if (['scholarship', 'founders', 'accepted'].includes(spinResult.resultKey)) {
                        setShake(true);
                        setTimeout(() => setShake(false), 800);
                    }
                    setTimeout(() => setShowResultOverlay(true), 500);
                    setTimeout(() => onResult(spinResult), 3500);
                }
            };
            requestAnimationFrame(animate);
        } catch (error) {
            console.error("Machine ERROR:", error);
            setIsSpinning(false);
            alert("Connection error. Please try again.");
        }
    };

    const triggerCelebration = (status: AcceptanceStatus) => {
        if (['accepted', 'scholarship', 'founders'].includes(status)) {
            const end = Date.now() + 3000;
            const colors = ['#fbbf24', '#3b82f6', '#ffffff'];
            (function frame() {
                confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0, y: 0.6 }, colors, zIndex: 100 });
                confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1, y: 0.6 }, colors, zIndex: 100 });
                if (Date.now() < end) requestAnimationFrame(frame);
            }());
        }
    };

    return (
        <div className="flex flex-col items-center gap-8 w-full">
            <motion.div
                animate={shake ? { x: [0, -10, 10, -10, 10, 0], y: [0, 5, -5, 5, -5, 0] } : {}}
                className="relative w-full max-w-[800px] mx-auto aspect-square flex items-center justify-center select-none"
            >
                <div
                    className="absolute inset-0 bg-contain bg-center bg-no-repeat z-0 pointer-events-none"
                    style={{ backgroundImage: 'url("/creditu-slot-frame.png")' }}
                />

                {/* Reels */}
                <div className="absolute top-[48%] left-1/2 -translate-x-1/2 w-[62%] h-[24%] z-10 flex gap-[2%] items-center px-[2%]">
                    {reels.map((symbolIdx, i) => {
                        const SymbolIcon = SYMBOLS[symbolIdx].icon;
                        return (
                            <div key={i} className="flex-1 h-full bg-black/40 backdrop-blur-sm relative overflow-hidden flex items-center justify-center">
                                <motion.div
                                    key={`${i}-${symbolIdx}`}
                                    initial={{ y: -60, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="relative z-0 flex flex-col items-center gap-2"
                                >
                                    <SymbolIcon className={`w-12 h-12 md:w-20 md:h-20 ${SYMBOLS[symbolIdx].color}`} />
                                    <span className={`text-[8px] md:text-[10px] font-black uppercase ${SYMBOLS[symbolIdx].color} opacity-80`}>
                                        {SYMBOLS[symbolIdx].label}
                                    </span>
                                </motion.div>
                            </div>
                        );
                    })}
                </div>

                {/* Result Overlay */}
                <AnimatePresence>
                    {showResultOverlay && result && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute top-[25%] left-1/2 -translate-x-1/2 z-30 w-full max-w-[400px] text-center"
                        >
                            <div className="bg-black/90 backdrop-blur-xl border-2 border-amber-500/50 p-6 rounded-2xl">
                                <h3 className="text-4xl md:text-5xl font-black text-white uppercase italic">
                                    {result.resultKey === 'accepted' ? 'ACCEPTED' :
                                        result.resultKey === 'scholarship' ? 'SCHOLARSHIP' :
                                            result.resultKey === 'founders' ? 'FOUNDERS' : 'ALMOST ADMITTED'}
                                </h3>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Spin Trigger */}
                <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[35%] h-[15%] z-20">
                    <button
                        onClick={spin}
                        disabled={isSpinning}
                        className="w-full h-full relative group cursor-pointer flex items-center justify-center p-4 bg-gradient-to-r from-amber-500 to-amber-600 rounded-3xl"
                    >
                        {isSpinning ? <Loader2 className="w-12 h-12 text-black animate-spin" /> : <Play className="w-12 h-12 text-black fill-current" />}
                    </button>
                </div>
            </motion.div>

            {/* Standard HTML Button to bypass Shadcn Issues */}
            {!isSpinning && (
                <button
                    onClick={spin}
                    className="h-16 px-12 text-xl font-black italic tracking-widest rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-900 text-white shadow-lg hover:scale-105 transition-transform"
                >
                    INITIALIZE SPIN
                </button>
            )}
        </div>
    );
};
