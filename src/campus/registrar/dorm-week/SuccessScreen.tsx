// CACHE_BUST_OMEGA_2026_0306_0255
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, ArrowRight, Share2, Download, Zap, ShieldCheck, GraduationCap, Sparkles } from 'lucide-react';

interface SuccessScreenProps {
    result: {
        resultKey: 'accepted' | 'almost' | 'scholarship' | 'founders';
        pointsDelta: number;
        dorm_key_awarded: boolean;
    };
    email: string;
    name: string;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({ result, email, name }) => {
    const isWinner = result.dorm_key_awarded;
    const [idNumber] = useState(() => Math.floor(100000 + Math.random() * 900000));

    useEffect(() => {
        console.log("SuccessScreen: COMPONENT MOUNTED. Version: 2.1 (No Shadcn Button)");
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-4xl mx-auto relative"
        >
            {/* --- ELECTRIFYING BACKGROUND FX --- */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {/* Lightning Strikes */}
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: [0, 1, 0, 1, 0],
                            x: [0, Math.random() * 20 - 10, 0]
                        }}
                        transition={{
                            duration: 0.2,
                            repeat: Infinity,
                            repeatDelay: Math.random() * 5 + 2,
                            ease: "linear"
                        }}
                        className="absolute inset-0 bg-blue-400/10 blur-[100px]"
                    />
                ))}
            </div>

            <motion.div
                initial={{ scale: 0.8, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className="relative z-10 bg-[#0a0f2d]/60 backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[4rem] shadow-[0_0_100px_rgba(37,99,235,0.2)] overflow-hidden text-center"
            >
                {/* Cinematic Top Rim */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-500 animate-pulse" />

                <div className="space-y-10">
                    {/* Header Energy */}
                    <div className="space-y-4">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", delay: 0.5 }}
                            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.4em] shadow-[0_0_30px_rgba(37,99,235,0.5)]"
                        >
                            <Zap className="w-4 h-4 fill-current" />
                            Access Granted
                        </motion.div>

                        <div className="space-y-2">
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-400 mb-2">Initialize Entrance Sequence</p>
                            <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                                {result.resultKey === 'accepted' ? 'ACCEPTED' :
                                    result.resultKey === 'scholarship' ? 'SCHOLARSHIP' :
                                        result.resultKey === 'founders' ? 'FOUNDERS' : 'ADMITTED'}
                            </h2>
                        </div>
                    </div>

                    {/* --- THE OFFICIAL STUDENT ID (THE GRAND REVEAL) --- */}
                    <motion.div
                        initial={{ rotateY: 90, opacity: 0 }}
                        animate={{ rotateY: 0, opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        className="relative group h-[320px] w-full max-w-md mx-auto perspective-1000"
                    >
                        {/* ID Glow Layer */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-amber-600 rounded-[2.5rem] blur-[40px] opacity-40 animate-pulse" />

                        <div className="relative h-full w-full bg-[#0a0f2d] border-2 border-white/20 rounded-[2.5rem] p-8 overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] flex flex-col justify-between text-left">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Official Student ID</p>
                                    <p className="text-2xl font-black italic tracking-tighter text-white">CREDIT UNIVERSITY</p>
                                </div>
                                <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                                    <GraduationCap className="w-8 h-8 text-amber-500" />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-1">
                                    <p className="text-[8px] font-bold uppercase text-slate-500 tracking-widest">Full Name</p>
                                    <p className="text-3xl font-black uppercase italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                                        {name || "HEIR OF FICO"}
                                    </p>
                                </div>

                                <div className="flex gap-10">
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-bold uppercase text-slate-500 tracking-widest">Student ID</p>
                                        <p className="text-base font-black text-white font-mono tracking-widest">{idNumber}-{name.length}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-bold uppercase text-slate-500 tracking-widest">Campus Status</p>
                                        <p className="text-base font-black text-amber-500 uppercase italic flex items-center gap-2">
                                            <Sparkles className="w-3 h-3" />
                                            Credit Freshman
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-6 border-t border-white/10">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Security Verified</span>
                                </div>
                                <div className="flex -space-x-1">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="w-2 h-6 bg-blue-500/20 border-l border-white/10" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Result Stats UI */}
                    <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-left">
                            <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">Dorm Access</p>
                            <p className="text-sm font-black text-white italic">
                                {isWinner ? 'DORM KEY ISSUED' : 'QUEUE PLACEMENT'}
                            </p>
                        </div>
                        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-right">
                            <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">FICO Potential</p>
                            <p className="text-sm font-black text-emerald-400">+{result.pointsDelta} PTS</p>
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className="space-y-4 max-w-md mx-auto pt-4">
                        <button
                            onClick={() => window.location.href = `/register?email=${email}`}
                            className="group relative w-full h-20 bg-white text-black hover:bg-slate-200 font-black uppercase tracking-[0.2em] rounded-[2rem] transition-all hover:scale-[1.05] shadow-[0_20px_50px_rgba(255,255,255,0.2)] flex items-center justify-center gap-3 text-lg"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                Complete Entrance Sequence
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                            </span>
                        </button>

                        <div className="flex gap-4">
                            <button className="flex-1 h-14 border border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center transition-colors">
                                <Download className="w-4 h-4 mr-3" /> Download ID
                            </button>
                            <button className="flex-1 h-14 border border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center transition-colors">
                                <Share2 className="w-4 h-4 mr-3" /> Share Access
                            </button>
                        </div>
                    </div>

                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.5em] pt-4">
                        RSA-4096 // ENCRYPTED ACCESS // THE YARD
                    </p>
                </div>
            </motion.div>

            {/* Ambient Particles Layer */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-blue-500 rounded-full"
                        animate={{
                            opacity: [0, 1, 0],
                            y: [0, -100],
                            x: [0, Math.random() * 50 - 25]
                        }}
                        transition={{
                            duration: 2 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2
                        }}
                        style={{
                            left: `${Math.random() * 100}%`,
                            bottom: `20%`
                        }}
                    />
                ))}
            </div>
        </motion.div>
    );
};
