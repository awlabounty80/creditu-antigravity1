
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Moon, Lock, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/hooks/useProfile';

// Quote rotation
const REST_QUOTES = [
    "Nature does not hurry, yet everything is accomplished.",
    "Silence is not empty. It is full of answers.",
    "Credit is trust. Trust requires calm.",
    "The calm mind is the only weapon against the algorithm.",
    "Rest is not a reward. It is a requirement."
];

export function DashboardResetMode({ onBypass }: { onBypass?: () => void }) {
    const { profile } = useProfile();
    const navigate = useNavigate();
    const [quote, setQuote] = useState(REST_QUOTES[0]);

    useEffect(() => {
        setQuote(REST_QUOTES[Math.floor(Math.random() * REST_QUOTES.length)]);
    }, []);

    return (
        <div className="min-h-screen bg-[#020412] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">

            {/* Ambient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.03),transparent_70%)] pointer-events-none" />
            <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent opacity-50" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="max-w-2xl w-full text-center z-10"
            >
                {/* Status Indicator */}
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-900/10 border border-emerald-500/10 mb-12">
                    <Moon className="w-3 h-3 text-emerald-400 fill-emerald-400/20" />
                    <span className="text-[10px] uppercase tracking-[0.3em] text-emerald-300/60 font-medium">System Resting</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-heading font-thin text-white mb-8 tracking-wide">
                    Welcome to the Silence, <br />
                    <span className="font-serif italic text-slate-400">{profile?.first_name || "Initiate"}.</span>
                </h1>

                <p className="text-lg text-slate-500 font-light italic mb-16 leading-relaxed">
                    "{quote}"
                </p>

                {/* The ONE Available Action */}
                <div className="grid gap-6 max-w-sm mx-auto">
                    <Button
                        onClick={() => navigate('/dashboard/library')}
                        className="h-auto py-6 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-indigo-500/30 group transition-all duration-500"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                                <BookOpen className="w-5 h-5 text-indigo-400 group-hover:text-white" />
                            </div>
                            <div className="text-left">
                                <div className="text-sm font-bold text-white uppercase tracking-wider mb-0.5">Enter the Library</div>
                                <div className="text-[10px] text-slate-500">Read & Internalize</div>
                            </div>
                        </div>
                    </Button>

                    <div className="p-4 rounded-xl border border-white/5 bg-black/20 flex items-center gap-4 opacity-50 cursor-not-allowed">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                            <Lock className="w-4 h-4 text-slate-600" />
                        </div>
                        <div className="text-left">
                            <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-0.5">Credit Simulator</div>
                            <div className="text-[10px] text-slate-600">Locked until Day 2</div>
                        </div>
                    </div>
                </div>

                {/* Hidden Bypass for Dev/Impatience */}
                {onBypass && (
                    <button
                        onClick={onBypass}
                        className="mt-24 text-[10px] text-slate-800 hover:text-slate-600 uppercase tracking-widest transition-colors"
                    >
                        [Override System Lock]
                    </button>
                )}

            </motion.div>
        </div>
    );
}
