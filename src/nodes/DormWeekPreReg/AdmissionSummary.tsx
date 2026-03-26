// ADMISSION SUMMARY - MASTER BUILD V5.3 (MAX WOW EDITION)
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
    GraduationCap, 
    ShieldCheck, 
    Sparkles, 
    Download, 
    Share2, 
    ArrowRight,
    Zap,
    Trophy,
    Star
} from 'lucide-react';
import { useDormWeek } from '@/hooks/useDormWeek';
import confetti from 'canvas-confetti';

interface AdmissionSummaryProps {
    email: string;
    name: string;
    onComplete: () => void;
}

export const AdmissionSummary: React.FC<AdmissionSummaryProps> = ({ email, name, onComplete }) => {
    const navigate = useNavigate();
    const { getAdmissionsSession } = useDormWeek();
    const [isLoading, setIsLoading] = useState(true);
    const [isVideoPlaying, setIsVideoPlaying] = useState(true);
    const [idNumber] = useState(() => Math.floor(100000 + Math.random() * 900000));

    // WINNER PROTOCOL: Trigger Confetti on Mount
    useEffect(() => {
        if (isVideoPlaying || isLoading) return;

        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
    }, [isVideoPlaying, isLoading]);

    useEffect(() => {
        const load = async () => {
            await getAdmissionsSession(email);
            setIsLoading(false);
        };
        load();
    }, [email, getAdmissionsSession]);

    const handleFinalize = () => {
        onComplete();
    };

    if (isLoading) return <div className="flex items-center justify-center p-20"><Zap className="w-12 h-12 text-amber-500 animate-spin" /></div>;

    if (isVideoPlaying) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center"
            >
                <video 
                    src="/assets/dorm-welcome.mp4" 
                    autoPlay 
                    playsInline
                    onEnded={() => setIsVideoPlaying(false)}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
                <button 
                    onClick={() => setIsVideoPlaying(false)} 
                    className="absolute bottom-10 px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white/50 uppercase tracking-[0.2em] text-xs font-black transition-colors z-[101]"
                >
                    SKIP TRANSMISSION
                </button>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full min-h-screen relative flex flex-col items-center justify-center space-y-12 py-10 overflow-hidden"
        >
            {/* AMBIENT BACKGROUND VIDEO */}
            <div className="absolute inset-0 z-0">
                <video 
                    src="/assets/hero-background.mp4" 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f2d] via-[#0a0f2d]/80 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-black/40 pointer-events-none" />
            </div>

            {/* GIANT BACKGROUND HEADER */}
            <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-full text-center pointer-events-none z-0">
                 <h1 className="text-[10rem] md:text-[18rem] font-black text-white/[0.08] tracking-[-0.05em] uppercase leading-none select-none drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                    Scholarship
                 </h1>
            </div>

            {/* --- THE OFFICIAL STUDENT ID --- */}
            <motion.div
                initial={{ rotateY: 90, opacity: 0, scale: 0.8 }}
                animate={{ rotateY: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: "circOut" }}
                className="relative group h-[340px] w-full max-w-[500px] perspective-1000 z-10"
            >
                {/* Holographic Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-indigo-500 to-amber-500 rounded-[3rem] blur-[60px] opacity-10 animate-pulse" />

                <div className="relative h-full w-full bg-[#0a0f2d]/90 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 overflow-hidden shadow-[0_60px_120px_-20px_rgba(0,0,0,1)] flex flex-col justify-between text-left">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />
                    
                    {/* ID Header */}
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">DORM WEEK™ STUDENT ID</p>
                            <p className="text-3xl font-black italic tracking-tighter text-white">CREDIT UNIVERSITY</p>
                        </div>
                        <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                            <GraduationCap className="w-8 h-8 text-amber-500" />
                        </div>
                    </div>

                    {/* ID Body */}
                    <div className="space-y-8">
                        <div className="space-y-1">
                            <p className="text-[9px] font-bold uppercase text-slate-600 tracking-[0.3em]">Full Name</p>
                            <p className="text-4xl font-black uppercase italic tracking-tighter text-white leading-none">
                                {name || "ASHLEY"}
                            </p>
                        </div>

                        <div className="flex gap-12">
                            <div className="space-y-1">
                                <p className="text-[9px] font-bold uppercase text-slate-600 tracking-[0.3em]">Student ID</p>
                                <p className="text-xl font-black text-white font-mono tracking-[0.2em]">258736-7</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-bold uppercase text-slate-600 tracking-[0.3em]">Campus Status</p>
                                <p className="text-xl font-black text-amber-500 uppercase italic flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 fill-current text-white/20" />
                                    Freshman
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ID Footer */}
                    <div className="flex justify-between items-center pt-6 border-t border-white/10">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="w-5 h-5 text-emerald-400/60" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400/80">Security Verified</span>
                        </div>
                        <div className="flex -space-x-[1px] opacity-40">
                             {[...Array(20)].map((_, i) => (
                                <div key={i} className="w-[1px] h-6 bg-blue-500" />
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* STATUS BOXES (As seen in screenshot) */}
            <div className="flex flex-col md:flex-row gap-6 w-full max-w-[500px] z-10">
                <motion.div 
                    initial={{ y: 20, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }} 
                    transition={{ delay: 0.5 }}
                    className="flex-1 bg-white/5 border border-white/10 p-6 rounded-[1.8rem] flex flex-col items-center justify-center text-center space-y-1 backdrop-blur-md"
                >
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Dorm Access</p>
                    <p className="text-xl font-black text-white uppercase italic tracking-tight">Dorm Key Issued</p>
                </motion.div>
                
                <motion.div 
                    initial={{ y: 20, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }} 
                    transition={{ delay: 0.6 }}
                    className="flex-1 bg-white/5 border border-white/10 p-6 rounded-[1.8rem] flex flex-col items-center justify-center text-center space-y-1 backdrop-blur-md"
                >
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">FICO Potential</p>
                    <p className="text-xl font-black text-emerald-400 uppercase italic tracking-tight">+500 PTS</p>
                </motion.div>
            </div>

            {/* MAIN ACTION BUTTON (As seen in screenshot) */}
            <div className="w-full max-w-[480px] space-y-6 pt-4">
                <motion.button
                    onClick={handleFinalize}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="group relative w-full h-24 bg-white text-black font-black uppercase tracking-[0.1em] rounded-full transition-all hover:scale-[1.03] active:scale-[0.98] shadow-[0_20px_60px_rgba(255,255,255,0.2)] flex items-center justify-center gap-4 text-2xl"
                >
                    Proceed To Slot Machine
                    <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                </motion.button>
                
                {/* Secondary Buttons */}
                <div className="flex gap-4">
                    <button className="flex-1 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-slate-300 hover:text-white transition-colors">
                        <Download className="w-5 h-5" /> Download ID
                    </button>
                    <button className="flex-1 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-slate-300 hover:text-white transition-colors">
                        <Share2 className="w-5 h-5" /> Share Access
                    </button>
                </div>
            </div>

            {/* Cinematic Footer */}
            <p className="text-[11px] text-white/30 font-black uppercase tracking-[0.6em] pb-10">
                RSA-4096 // ENCRYPTED ACCESS // THE YARD
            </p>
        </motion.div>
    );
};

