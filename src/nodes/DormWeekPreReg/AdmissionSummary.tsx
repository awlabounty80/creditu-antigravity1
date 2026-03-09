// ADMISSION SUMMARY - MASTER BUILD
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Trophy,
    Sparkles,
    ArrowRight,
    ShieldCheck,
    GraduationCap,
    Zap,
    Gift,
    CheckCircle2,
    Lock
} from 'lucide-react';
import { useDormWeek, Reward } from '@/hooks/useDormWeek';
import { supabase } from '@/lib/supabase';

import confetti from 'canvas-confetti';

interface AdmissionSummaryProps {
    email: string;
    name: string;
    onComplete: () => void;
}

export const AdmissionSummary: React.FC<AdmissionSummaryProps> = ({ email, name, onComplete }) => {
    const { getAdmissionsSession, completeAdmissions } = useDormWeek();
    const [rewards, setRewards] = useState<Reward[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCompleting, setIsCompleting] = useState(false);

    useEffect(() => {
        const load = async () => {
            const session = await getAdmissionsSession(email);
            if (session && session.rewards_won && session.rewards_won.length > 0) {
                // Fetch reward details from the pool using the session's won rewards list
                const { data, error: fetchError } = await supabase
                    .from('dormweek_reward_pool')
                    .select('*')
                    .in('id', session.rewards_won);

                if (fetchError) console.error("AdmissionSummary: Error fetching rewards:", fetchError);

                // Maintain sequence order if possible
                if (data) {
                    const sortedRewards = session.rewards_won
                        .map(id => data.find(r => r.id === id))
                        .filter(Boolean) as Reward[];
                    setRewards(sortedRewards);
                }
            }
            setIsLoading(false);

            // Final celebration
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#fbbf24', '#3b82f6', '#ffffff']
            });
        };
        load();
    }, [email, getAdmissionsSession]);

    const handleFinalize = async () => {
        setIsCompleting(true);
        await completeAdmissions(email);
        onComplete();
    };

    if (isLoading) return <div className="flex items-center justify-center p-20"><Zap className="w-12 h-12 text-amber-500 animate-spin" /></div>;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-4xl mx-auto space-y-8"
        >
            {/* Header */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.4em] shadow-[0_0_30px_rgba(37,99,235,0.5)]">
                    <Trophy className="w-4 h-4 fill-current" />
                    Admissions Complete
                </div>
                <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                    Official Acceptance
                </h2>
                <p className="text-amber-500 text-xl font-bold uppercase tracking-widest italic">
                    Welcome to the 700+ Club, {name || 'Architect'}.
                </p>
            </div>

            {/* Reward Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {rewards.map((reward, i) => (
                    <motion.div
                        key={reward.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2 }}
                        className="bg-black/60 backdrop-blur-3xl border-2 border-white/10 p-6 rounded-[2.5rem] relative overflow-hidden group hover:border-amber-500/50 transition-all"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                            <CheckCircle2 className="w-12 h-12 text-amber-500" />
                        </div>

                        <div className="space-y-4">
                            <div className="p-3 bg-white/5 rounded-2xl inline-block border border-white/10">
                                {reward.type === 'tip' && <Sparkles className="w-6 h-6 text-blue-400" />}
                                {reward.type === 'resource' && <Gift className="w-6 h-6 text-amber-400" />}
                                {reward.type === 'acceptance' && <GraduationCap className="w-6 h-6 text-white" />}
                            </div>

                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
                                    {reward.type === 'tip' ? 'Major Tip Unlocked' : reward.type === 'resource' ? 'Tool Collected' : 'Campus Status'}
                                </p>
                                <h4 className="text-xl font-black text-white uppercase italic leading-tight">
                                    {reward.title}
                                </h4>
                            </div>

                            <p className="text-xs text-slate-400 line-clamp-3 italic">
                                "{reward.content}"
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Official Credentials Box */}
            <div className="bg-gradient-to-br from-indigo-900/40 via-black to-blue-900/40 border-4 border-white/10 rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-10 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

                <div className="flex-1 space-y-6 relative z-10 text-left">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-400">Campus Protocol</p>
                        <h3 className="text-4xl font-black italic uppercase text-white tracking-tighter">Your Locker is Active</h3>
                    </div>
                    <p className="text-slate-400 text-lg">
                        All won rewards have been secured in your **Student Locker**. Use them to architect your 750+ profile starting today.
                    </p>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                            <ShieldCheck className="w-4 h-4" />
                            Session Secured
                        </div>
                        <div className="flex items-center gap-2 text-amber-400 bg-amber-500/5 border border-amber-500/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                            <Zap className="w-4 h-4" />
                            Dorm Key Issued
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-auto space-y-4 relative z-10">
                    <button
                        onClick={handleFinalize}
                        disabled={isCompleting}
                        className="group relative w-full md:w-80 h-24 bg-white text-black hover:bg-slate-200 font-black uppercase tracking-[0.2em] rounded-[2rem] transition-all hover:scale-[1.05] active:scale-[0.98] shadow-[0_20px_50px_rgba(255,255,255,0.2)] flex items-center justify-center gap-3 text-2xl"
                    >
                        {isCompleting ? (
                            <Loader2 className="w-8 h-8 animate-spin" />
                        ) : (
                            <>
                                Enter Credit U
                                <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                            </>
                        )}
                    </button>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] text-center">Redirecting to The Yard</p>
                </div>
            </div>

            <div className="flex flex-col items-center gap-4 py-8">
                <button
                    onClick={() => {
                        localStorage.removeItem(`cu_session_${email}`);
                        window.location.href = '/admissions?reset=true';
                    }}
                    className="text-[10px] text-white/10 uppercase tracking-[1em] hover:text-amber-500 transition-colors cursor-pointer"
                >
                    [ RESET ADMISSIONS SEQUENCE ]
                </button>

                <button
                    onClick={() => window.location.href = '/learn'}
                    className="text-[10px] text-white/5 uppercase tracking-[0.5em] hover:text-blue-500 transition-colors"
                >
                    Bypass to Campus Hub
                </button>
            </div>

            <p className="text-center text-[10px] text-white/20 font-black uppercase tracking-[0.8em] pb-12">
                RSA-4096 // ENCRYPTED ACCESS // THE YARD
            </p>
        </motion.div>
    );
};

const Loader2 = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
);
