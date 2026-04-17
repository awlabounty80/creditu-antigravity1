// CACHE_BUST_OMEGA_2026_0306_0255
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, Star, ChevronRight, Loader2 } from 'lucide-react';
import { useDormWeek, AcceptanceStatus } from '@/hooks/useDormWeek';
import confetti from 'canvas-confetti';

const SYMBOLS = ['🎓', '💰', '🏆', '🐮', '✨'];

interface AcceptanceSpinProps {
    email: string;
    onResult: (result: any) => void;
}

export const AcceptanceSpin: React.FC<AcceptanceSpinProps> = ({ email, onResult }) => {
    const { getSpinResult } = useDormWeek();
    const [isSpinning, setIsSpinning] = useState(false);
    const [reels, setReels] = useState([0, 1, 2]);
    const [result, setResult] = useState<any>(null);

    useEffect(() => {
        console.log("AcceptanceSpin: COMPONENT MOUNTED. Version: 2.1 (No Shadcn Button)");
    }, []);

    const spin = async () => {
        if (isSpinning) return;
        setIsSpinning(true);

        const spinResult = await getSpinResult(email);

        // Cinematic spin timing
        let duration = 3000;
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
                setTimeout(() => onResult(spinResult), 1500);
            }
        };

        requestAnimationFrame(animate);
    };

    const triggerCelebration = (status: AcceptanceStatus) => {
        if (['accepted', 'scholarship', 'founders'].includes(status)) {
            const end = Date.now() + 3000;
            const colors = ['#fbbf24', '#3b82f6', '#ffffff'];

            (function frame() {
                confetti({
                    particleCount: 3,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: colors
                });
                confetti({
                    particleCount: 3,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: colors
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            }());
        }
    };

    return (
        <div className="relative w-full max-w-4xl mx-auto aspect-[16/9] flex items-center justify-center p-8">
            {/* Slot Machine Frame Background */}
            <div
                className="absolute inset-0 bg-contain bg-center bg-no-repeat z-0"
                style={{ backgroundImage: 'url("/creditu-slot-frame.png")' }}
            />

            {/* Reel Windows Overlay */}
            <div className="relative z-10 flex gap-4 md:gap-8 mt-12">
                {reels.map((symbolIdx, i) => (
                    <div
                        key={i}
                        className="w-20 h-28 md:w-32 md:h-44 bg-black/80 backdrop-blur-md rounded-xl border-2 border-amber-500/30 flex items-center justify-center text-4xl md:text-6xl shadow-inner overflow-hidden"
                    >
                        <motion.div
                            key={`${i}-${symbolIdx}`}
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.1 }}
                        >
                            {SYMBOLS[symbolIdx]}
                        </motion.div>
                    </div>
                ))}
            </div>

            {/* Spin Button UI Overlay */}
            <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 z-20">
                <button
                    onClick={spin}
                    disabled={isSpinning}
                    className="h-16 md:h-20 px-12 md:px-20 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-black text-xl md:text-3xl rounded-full shadow-[0_0_50px_rgba(245,158,11,0.5)] hover:shadow-[0_0_80px_rgba(245,158,11,0.8)] border-4 border-black/20 hover:scale-105 transition-all group overflow-hidden flex items-center justify-center gap-2"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        {isSpinning ? <Loader2 className="animate-spin w-8 h-8" /> : "SPIN NOW"}
                        {!isSpinning && <ChevronRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />}
                    </span>
                    <div className="absolute inset-0 bg-white/20 animate-pulse mix-blend-overlay" />
                </button>
            </div>

            {/* Dynamic HUD Elements */}
            <div className="absolute top-[15%] left-[10%] right-[10%] flex justify-between items-start pointer-events-none">
                <div className="bg-black/60 backdrop-blur border border-indigo-500/30 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-indigo-400">
                    <div className="flex items-center gap-2">
                        <Star className="w-3 h-3 animate-pulse" />
                        Wealth Potential: MAX
                    </div>
                </div>
                <div className="bg-black/60 backdrop-blur border border-amber-500/30 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-amber-500 text-right">
                    <div className="flex items-center gap-2">
                        Jackpot Meter
                        <Trophy className="w-3 h-3 animate-bounce" />
                    </div>
                    <div className="w-24 h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
                        <div className="w-3/4 h-full bg-amber-500 animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
};
