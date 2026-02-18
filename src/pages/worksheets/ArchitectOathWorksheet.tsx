import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShieldCheck, TrendingUp, CreditCard, Key, Car, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProfile } from '@/hooks/useProfile';
import { DormResetCertificate } from '@/components/DormResetCertificate';
import { CreditUniversityEnrollment } from '@/components/marketing/CreditUniversityEnrollment';
import { CreditULogo } from '@/components/common/CreditULogo';
import confetti from 'canvas-confetti';

// Simple Confetti Component
const Confetti = () => {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
            {[...Array(50)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{
                        opacity: 1,
                        x: Math.random() * window.innerWidth,
                        y: -20,
                        rotate: 0
                    }}
                    animate={{
                        opacity: 0,
                        y: window.innerHeight + 100,
                        x: Math.random() * window.innerWidth + (Math.random() - 0.5) * 200,
                        rotate: 360 * (Math.random() > 0.5 ? 1 : -1)
                    }}
                    transition={{
                        duration: Math.random() * 2 + 2,
                        ease: "linear",
                        repeat: Infinity,
                        delay: Math.random() * 2
                    }}
                    className="absolute w-2 h-2 rounded-sm"
                    style={{
                        backgroundColor: i % 2 === 0 ? '#fbbf24' : '#3b82f6', // Gold & Blue
                    }}
                />
            ))}
        </div>
    )
}

export default function ArchitectOathWorksheet() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const { profile } = useProfile();


    // Form State
    const [targetScore, setTargetScore] = useState('');
    const [utilizationGoal, setUtilizationGoal] = useState('');
    const [focus, setFocus] = useState('');
    const [claimed, setClaimed] = useState<number[]>([]);

    const toggleClaim = (index: number) => {
        setClaimed(prev => {
            if (prev.includes(index)) return prev.filter(i => i !== index);
            return [...prev, index];
        });
    };

    useEffect(() => {
        setIsLoading(false); // Load immediately
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white font-mono">
                <div className="w-64 h-1 bg-slate-800 rounded-full overflow-hidden mb-8">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 3, ease: "easeInOut" }}
                        className="h-full bg-blue-500"
                    />
                </div>
                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm tracking-[0.2em] animate-pulse text-blue-400 uppercase"
                >
                    Repositioning Your Financial Identity...
                </motion.h2>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden">
            <Confetti />

            {/* Header/Nav */}
            <div className="p-6 flex justify-between items-center bg-slate-900/50 backdrop-blur-sm border-b border-white/5 sticky top-0 z-40">
                <div className="flex items-center gap-6">
                    <Button onClick={() => navigate('/dashboard/orientation')} variant="ghost" className="text-slate-500 hover:text-white hover:bg-white/5 gap-2 text-xs uppercase tracking-widest p-0 h-auto">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </Button>
                    <div className="h-4 w-px bg-white/10"></div>
                    <div className="flex items-center gap-2 text-amber-500 font-bold tracking-widest text-[10px] uppercase">
                        <CreditULogo className="w-8 h-8" variant="gold" showShield={false} />
                        Credit University // Reset Graduate
                    </div>
                </div>
                <div className="text-xs text-slate-500 font-mono">
                    {new Date().toLocaleDateString()}
                </div>
            </div>

            <main className="max-w-4xl mx-auto p-6 md:p-12 flex flex-col items-center">

                {/* 1. HERO SECTION */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-block p-4 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-[0_0_50px_rgba(251,191,36,0.3)] mb-8">
                        <ShieldCheck className="w-16 h-16 text-white" />
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
                        Reset Complete
                    </h1>
                    <p className="text-blue-400 font-bold uppercase tracking-[0.3em] mb-8">
                        Orientation Status: Graduated
                    </p>

                    <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        You didn't just complete five days — you shifted your trajectory. You moved from confusion to clarity. From reaction to strategy. Today, your profile begins to speak with authority.
                    </p>
                </motion.div>

                {/* 2. DECLARATION FORM */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-8 mb-12 backdrop-blur-sm"
                >
                    <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
                        <CheckCircle2 className="text-emerald-500 w-6 h-6" />
                        <h2 className="text-xl font-bold uppercase tracking-wide">Step 1: Declare Your New Standard</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">My Target Score</label>
                            <input
                                value={targetScore} onChange={e => setTargetScore(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded p-3 text-2xl font-black text-amber-500 focus:border-amber-500 focus:outline-none text-center"
                                placeholder="800+"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Utilization Goal</label>
                            <input
                                value={utilizationGoal} onChange={e => setUtilizationGoal(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded p-3 text-2xl font-black text-blue-500 focus:border-blue-500 focus:outline-none text-center"
                                placeholder="<10%"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">90-Day Focus</label>
                            <input
                                value={focus} onChange={e => setFocus(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded p-3 text-lg font-bold text-white focus:border-white focus:outline-none text-center"
                                placeholder="e.g. Payoff"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* 3. FUTURE VISUALIZATION */}
                {/* 3. FUTURE VISUALIZATION & EDUCATION */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-16"
                >
                    {[
                        {
                            icon: TrendingUp,
                            label: "Score Rising",
                            color: "text-emerald-500",
                            border: "border-emerald-500/50",
                            bg: "bg-emerald-500/10",
                            strategy: "Payment History (35%) and Utilization (30%) control 65% of your score. Automate minimums to secure history, then attack balances weekly to crush utilization."
                        },
                        {
                            icon: CreditCard,
                            label: "Higher Limits",
                            color: "text-blue-500",
                            border: "border-blue-500/50",
                            bg: "bg-blue-500/10",
                            strategy: "Banks lend to those who don't need it. Keep balances reported at 1-3%, then request Credit Limit Increases (CLIs) every 6-9 months. High limits beget higher limits."
                        },
                        {
                            icon: Key,
                            label: "Key Approvals",
                            color: "text-amber-500",
                            border: "border-amber-500/50",
                            bg: "bg-amber-500/10",
                            strategy: "Match your profile to the lender's tier. Don't apply for Tier 1 cards (Amex/Chase) with a Tier 3 profile. Fix the data first, then the approval is mathematical."
                        },
                        {
                            icon: Car,
                            label: "Asset Power",
                            color: "text-purple-500",
                            border: "border-purple-500/50",
                            bg: "bg-purple-500/10",
                            strategy: "Credit is leverage, not free money. Use high-limit funding to acquire cash-flowing assets. The goal isn't a new car; it's a fleet that pays for itself."
                        },
                    ].map((item, i) => {
                        const isClaimed = claimed.includes(i);
                        return (
                            <div
                                key={i}
                                onClick={() => toggleClaim(i)}
                                className={`
                                    p-6 rounded-xl flex flex-col items-center justify-center gap-4 transition-all duration-300 cursor-pointer group relative overflow-hidden text-center min-h-[200px]
                                    ${isClaimed ? `bg-white/10 ${item.border} border-2 shadow-[0_0_30px_rgba(255,255,255,0.1)]` : 'bg-white/5 border border-white/5 hover:bg-white/10'}
                                `}
                            >
                                {isClaimed && <div className={`absolute inset-0 ${item.bg} opacity-20`} />}

                                <item.icon className={`w-8 h-8 ${item.color} transition-transform duration-300 ${isClaimed ? 'scale-110 mb-2' : 'group-hover:scale-110'}`} />

                                <div>
                                    <span className={`text-[10px] uppercase font-bold tracking-widest transition-colors block mb-2 ${isClaimed ? 'text-white' : 'text-slate-400'}`}>
                                        {isClaimed ? "STRATEGY UNLOCKED" : item.label}
                                    </span>

                                    {isClaimed && (
                                        <motion.p
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-sm font-medium text-slate-300 leading-relaxed px-4"
                                        >
                                            {item.strategy}
                                        </motion.p>
                                    )}
                                </div>

                                {isClaimed && (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-4 right-4">
                                        <CheckCircle2 className={`w-5 h-5 ${item.color}`} />
                                    </motion.div>
                                )}
                            </div>
                        );
                    })}
                </motion.div>





                {/* 4. CERTIFICATION */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8 }}
                    onViewportEnter={() => {
                        const end = Date.now() + 3000;
                        const colors = ['#f59e0b', '#ffffff', '#fbbf24'];
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
                    }}
                    className="w-full mb-16"
                >
                    <DormResetCertificate studentName={profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}` : undefined} />
                </motion.div>

                {/* 5. ENROLLMENT CTA (WOW FACTOR) */}
                <CreditUniversityEnrollment />

                {/* 6. FINAL CTA (Legacy / Lab Access) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.5 }}
                    className="text-center w-full"
                >
                    <p className="text-slate-500 text-xs font-mono uppercase tracking-widest mb-6 animate-pulse">
                        System Access Granted: Freshman Level Unlocked
                    </p>

                    <Link to="/resources/credit-lab">
                        <Button
                            className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-8 px-12 rounded-full shadow-[0_0_50px_rgba(37,99,235,0.4)] text-xl tracking-widest transition-all hover:scale-105 hover:shadow-[0_0_80px_rgba(37,99,235,0.6)]"
                        >
                            ENTER THE CREDIT LAB &rarr;
                        </Button>
                    </Link>

                    <div className="mt-8 flex justify-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">
                            Live Connection Established
                        </div>
                    </div>
                </motion.div>

            </main>
        </div>
    );
}
