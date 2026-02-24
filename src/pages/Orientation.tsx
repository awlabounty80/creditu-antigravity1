import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Lock, Activity, CreditCard, ChevronLeft, FileText, Award, CheckCircle2, ChevronRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { DormResetCertificate } from '@/components/DormResetCertificate';
import { CreditULogo } from '@/components/common/CreditULogo';
import { DailyReferral } from '@/components/DailyReferral';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/lib/supabase';
import { ReferralThanksForm } from '@/components/referral/ReferralThanksForm';
import { DigitalIDCard } from '@/components/referral/DigitalIDCard';
import { DORM_WEEK_CURRICULUM } from '@/data/dorm-week-curriculum';
import confetti from 'canvas-confetti';
import { ProfessorGenerative } from '@/components/dashboard/ProfessorGenerative';

// --- Types ---
type OnboardingStep =
    | 'arrival'
    | 'welcome'
    | 'reframe'
    | 'consent'
    | 'calibration'
    | 'identity'
    | 'map'
    | 'day1_briefing'
    | 'activation'
    | 'certificate'
    | 'close';

interface UserState {
    hasConsented: boolean;
    stressResponse: string;
    completedDayOne: boolean;
    signatureName?: string;
    firstName?: string;
    lastName?: string;
    studentLevel?: string;
    primaryMission?: string;
    studentIdCode?: string;
    ssn?: string;
    completedDays?: number[];
    dormStartDate?: number;
    lastDayCompletedAt?: number;
    giftUnlocked?: boolean;
    dailyLoginTime?: number;
    dailyTrialUsed?: boolean;
    mooPoints?: number;
}

// --- Specialized Components ---

const FloatingCreditCard = ({ className, delay = 0 }: { className?: string, delay?: number }) => (
    <motion.div
        animate={{
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1]
        }}
        transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delay
        }}
        className={cn("absolute w-40 h-24 md:w-64 md:h-40 rounded-2xl bg-gradient-to-br p-1 shadow-2xl backdrop-blur-sm z-0 opacity-80 pointer-events-none", className)}
    >
        <div className="w-full h-full rounded-xl bg-black/40 border border-white/20 p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
            <div className="w-8 h-5 md:w-12 md:h-8 bg-amber-200/20 rounded mb-2 md:mb-4" />
            <div className="w-20 md:w-32 h-3 md:h-4 bg-white/10 rounded mb-2" />
            <div className="w-12 md:w-20 h-3 md:h-4 bg-white/10 rounded" />
            <div className="absolute bottom-4 right-4 text-white/50 text-[10px] md:text-xs font-mono">CREDIT U</div>
        </div>
    </motion.div>
)

const GraffitiText = ({ children, className, color = "text-pink-500" }: { children: React.ReactNode, className?: string, color?: string }) => (
    <div className={cn("font-black italic transform -rotate-3 tracking-tighter drop-shadow-[5px_5px_0px_rgba(0,0,0,1)]", color, className)} style={{ fontFamily: 'impact, sans-serif' }}>
        {children}
    </div>
);

const SecurityTimer = ({ dailyLoginTime }: { dailyLoginTime?: number }) => {
    const [timeLeft, setTimeLeft] = useState<string>("");

    useEffect(() => {
        const loginTime = dailyLoginTime || Date.now();
        const timer = setInterval(() => {
            const now = Date.now();
            const timeSinceLogin = now - loginTime;
            const delay = 5 * 60 * 1000;
            const duration = 60 * 60 * 1000;

            if (timeSinceLogin < delay) {
                const remaining = delay - timeSinceLogin;
                const m = Math.floor(remaining / 60000);
                const s = Math.floor((remaining % 60000) / 1000);
                setTimeLeft(`WARMING UP: ${m}:${s.toString().padStart(2, '0')}`);
            } else if (timeSinceLogin < delay + duration) {
                const remaining = (delay + duration) - timeSinceLogin;
                const m = Math.floor(remaining / 60000);
                const s = Math.floor((remaining % 60000) / 1000);
                setTimeLeft(`DAILY ACCESS: ${m}:${s.toString().padStart(2, '0')}`);
            } else {
                setTimeLeft("TRIAL ENDED");
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [dailyLoginTime]);

    if (!timeLeft) return null;

    return (
        <div className="fixed top-24 right-6 z-40 bg-black/80 backdrop-blur border border-amber-500/50 px-6 py-3 rounded-xl shadow-[0_0_30px_rgba(245,158,11,0.3)] border-l-4">
            <div className="flex items-center gap-4">
                <Activity className={cn("w-5 h-5", timeLeft.includes('WARMING') ? "text-blue-400 animate-pulse" : "text-amber-500 animate-pulse")} />
                <div className="text-sm font-mono font-bold tracking-wider">
                    <span className={cn("mr-2", timeLeft.includes('WARMING') ? "text-blue-400" : "text-amber-500")}>{timeLeft}</span>
                </div>
            </div>
        </div>
    );
};

const FadeIn = ({ children, delay = 0, className, duration = 0.8 }: { children: React.ReactNode, delay?: number, className?: string, duration?: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
        className={className}
    >
        {children}
    </motion.div>
);

const ArrivalStep = ({ setStep }: { setStep: (s: OnboardingStep) => void }) => {
    useEffect(() => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#fbbf24', '#ef4444', '#3b82f6']
        });
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full relative overflow-hidden z-10 perspective-1000 bg-[#020412]">
            <div className="absolute inset-0 bg-gradient-to-b from-[#0f1742] via-[#050818] to-[#020412] -z-30" />
            {/* Dynamic Background for Arrival View */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-20%] left-[-20%] w-[1000px] h-[1000px] bg-indigo-600/30 rounded-full blur-[150px] mix-blend-screen animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-sky-600/20 rounded-full blur-[120px] mix-blend-screen" />
            </div>

            {/* Background Party Elements */}
            <FloatingCreditCard className="top-20 left-10 from-blue-600 to-purple-600 border-blue-400 rotate-[-12deg]" delay={0} />
            <FloatingCreditCard className="bottom-32 right-10 from-amber-500 to-red-600 border-amber-400 rotate-[12deg]" delay={1.5} />
            <FloatingCreditCard className="top-1/2 right-20 from-emerald-500 to-teal-600 border-emerald-400 rotate-[-5deg] scale-75 blur-[1px]" delay={0.8} />

            <FadeIn delay={0.2} duration={0.8}>
                <div className="relative group cursor-pointer mb-12 transform transition-transform duration-500 hover:scale-110">
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 text-6xl animate-bounce drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]">👑</div>
                    <div className="w-48 h-48 bg-black/60 rounded-full flex items-center justify-center border-4 border-amber-500 shadow-[0_0_80px_rgba(251,191,36,0.6)] relative z-10 backdrop-blur-md group-hover:border-white overflow-hidden">
                        <CreditULogo className="w-full h-full" variant="gold" showShield={false} iconClassName="w-40 h-40" />
                    </div>
                </div>
            </FadeIn>

            <FadeIn delay={0.4} className="text-center relative z-20">
                <GraffitiText className="text-6xl md:text-8xl text-pink-500 mb-4 rotate-[-6deg] animate-pulse">
                    WELCOME
                </GraffitiText>
                <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white drop-shadow-[0_10px_0px_rgba(0,0,0,0.5)] uppercase leading-[0.85] mb-8">
                    HOME<span className="text-amber-500">.</span>
                </h1>

                <div className="mt-8">
                    <Button
                        onClick={() => setStep('welcome')}
                        className="group relative px-20 py-10 text-2xl font-black tracking-[0.25em] uppercase transition-all duration-300 rounded-2xl bg-white text-black hover:scale-105 hover:rotate-1 shadow-[0_20px_50px_rgba(255,255,255,0.3)] border-4 border-black"
                    >
                        <span className="relative z-10">ENTER THE PARTY</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-pink-500 to-amber-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                    </Button>
                </div>
            </FadeIn>
        </div>
    );
};

const WelcomeStep = ({ setStep }: { setStep: (s: OnboardingStep) => void }) => (
    <div className="flex flex-col items-center justify-center min-h-[70vh] max-w-6xl mx-auto px-6 z-10 relative">
        <FadeIn delay={0} className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase mb-4">Dorm Week <span className="text-amber-400">Reset</span></h1>
            <p className="text-slate-400 font-mono text-xs md:text-sm tracking-[0.2em] uppercase">Mandatory 5-Day Initiation</p>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-12">
            <div className="bg-[#0A0F29]/80 border border-white/10 p-8 rounded-2xl h-full backdrop-blur-md">
                <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-4">The Why</h3>
                <p className="text-slate-300 font-light leading-relaxed">It's time to repair your financial nervous system and prepare for high-limit funding.</p>
            </div>
            <div className="bg-[#0A0F29]/80 border border-white/10 p-8 rounded-2xl h-full backdrop-blur-md">
                <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-4">The What</h3>
                <ul className="text-slate-300 space-y-2 text-sm uppercase font-bold tracking-widest">
                    <li>01 Identity Reframe</li>
                    <li>02 Credit Architect</li>
                    <li>03 Funding Secured</li>
                    <li>04 Wealth Systems</li>
                    <li>05 Graduation Pathway</li>
                </ul>
            </div>
        </div>
        <FadeIn delay={0.8}><Button onClick={() => setStep('reframe')} className="bg-white text-black hover:bg-slate-200 px-12 py-6 text-lg font-bold rounded-full">Accept Challenge</Button></FadeIn>
    </div>
);

const ReframeStep = ({ setStep }: { setStep: (s: OnboardingStep) => void }) => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-6xl mx-auto px-6 z-10 relative">
        <FadeIn delay={0.2} className="relative z-10 w-full mb-16">
            <div className="w-64 h-64 mx-auto mb-8"><CreditULogo className="w-full h-full" variant="gold" showShield={false} iconClassName="w-36 h-36" /></div>
            <h1 className="text-6xl md:text-8xl font-black text-white uppercase leading-[0.9]">WELCOME TO <br /><span className="text-amber-400">THE YARD</span></h1>
        </FadeIn>
        <FadeIn delay={0.6}>
            <Button onClick={() => setStep('consent')} className="bg-amber-500 hover:bg-amber-400 text-black px-12 py-6 text-lg font-black tracking-widest uppercase rounded-full shadow-[0_0_30px_rgba(245,158,11,0.5)] transform hover:scale-110">Initiate Profile</Button>
        </FadeIn>
    </div>
);

const ConsentStep = ({ setStep, saveState }: { setStep: (s: OnboardingStep) => void, saveState: (s: Partial<UserState>) => void }) => {
    const [signature, setSignature] = useState('');
    const [isSigned, setIsSigned] = useState(false);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto px-6 z-10">
            <FadeIn delay={0.2} className="text-center w-full">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-12 uppercase">The Reset Protocol</h1>
                <div className="bg-[#0F1629]/80 border border-white/10 p-8 rounded-xl shadow-2xl backdrop-blur-md mb-8">
                    <p className="text-slate-300 text-lg leading-relaxed">I reclaim my authority as the Architect of my own life. I understand that precision and discipline are required for this sequence.</p>
                </div>
                <Input
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    placeholder="Type your full name to sign"
                    className="bg-black/40 border-white/10 py-8 text-2xl text-indigo-300 placeholder:text-slate-700 text-center rounded-xl mb-12"
                />
                <Button
                    onClick={() => {
                        if (signature.length > 2) {
                            setIsSigned(true);
                            setTimeout(() => {
                                saveState({ hasConsented: true, signatureName: signature });
                                setStep('calibration');
                            }, 1000);
                        }
                    }}
                    disabled={signature.length < 3}
                    className={cn("w-full py-8 text-lg font-bold uppercase rounded-full transition-all", signature.length > 2 && !isSigned ? "bg-indigo-600 text-white" : isSigned ? "bg-emerald-600 text-white" : "bg-white/5 text-slate-700")}
                >
                    {isSigned ? "Protocol Accepted" : "Initialize Reset"}
                </Button>
            </FadeIn>
        </div>
    );
};

const CalibrationStep = ({ setStep }: { setStep: (s: OnboardingStep) => void }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] max-w-5xl mx-auto px-6 z-10 w-full">
            <FadeIn delay={0.2} className="w-full">
                <div className="mb-12">
                    <ProfessorGenerative
                        transcript="Architect, the foundation of your new reality begins here. We are about to calibrate your neural interface with the Credit U system core. This is not just a profile; it is your digital scoreboard. Be precise. Your legacy is being written in real-time. Proceed to identity synchronization."
                        onComplete={() => { }}
                    />
                </div>
                <div className="text-center">
                    <h1 className="text-4xl font-black text-white italic uppercase mb-2 tracking-tighter">System Calibration</h1>
                    <p className="text-indigo-400 font-mono text-[10px] tracking-[0.4em] uppercase animate-pulse mb-8">Establishing Neural Link...</p>

                    <Button
                        onClick={() => setStep('identity')}
                        className="bg-white text-black hover:bg-indigo-50 px-12 py-8 rounded-2xl text-xl font-black uppercase tracking-widest shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:scale-105 transition-all"
                    >
                        Sync Identity
                    </Button>
                </div>
            </FadeIn>
        </div>
    );
};

const IdentityStep = ({ setStep, saveState, userState }: { setStep: (s: OnboardingStep) => void, saveState: (s: Partial<UserState>) => void, userState: UserState }) => {
    const [form, setForm] = useState({
        firstName: userState.firstName || '',
        lastName: userState.lastName || '',
        studentLevel: userState.studentLevel || 'FRESHMAN',
        primaryMission: userState.primaryMission || '',
        studentIdCode: userState.studentIdCode || `CU-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    });

    const isComplete = form.firstName && form.lastName && form.primaryMission;

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] max-w-5xl mx-auto px-6 z-10 w-full">
            <FadeIn delay={0} className="text-center mb-16 w-full">
                <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-500/30">
                        <Activity className="w-6 h-6 text-indigo-400 animate-pulse-2s" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">Biometric Uplink</h1>
                        <p className="text-slate-500 text-[10px] font-mono uppercase tracking-[0.3em]">Neural Interface Calibration Active</p>
                    </div>
                </div>
            </FadeIn>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full mb-12 items-center">
                <div className="lg:col-span-6 space-y-8">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-indigo-400/70 uppercase tracking-widest ml-2">Assign Legal Name</label>
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                value={form.firstName}
                                onChange={e => setForm({ ...form, firstName: e.target.value })}
                                placeholder="First Name"
                                className="bg-black/60 border-indigo-500/20 h-16 text-lg focus:border-indigo-500/50 transition-all rounded-2xl"
                            />
                            <Input
                                value={form.lastName}
                                onChange={e => setForm({ ...form, lastName: e.target.value })}
                                placeholder="Last Name"
                                className="bg-black/60 border-indigo-500/20 h-16 text-lg focus:border-indigo-500/50 transition-all rounded-2xl"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-indigo-400/70 uppercase tracking-widest ml-2">Declare Primary Objective</label>
                        <Input
                            value={form.primaryMission}
                            onChange={e => setForm({ ...form, primaryMission: e.target.value })}
                            placeholder="e.g. $100K High Limit Funding"
                            className="bg-black/60 border-indigo-500/20 h-16 text-lg focus:border-indigo-500/50 transition-all rounded-2xl"
                        />
                    </div>

                    <div className="p-6 bg-indigo-950/20 border border-indigo-500/20 rounded-2xl">
                        <p className="text-xs text-slate-400 leading-relaxed italic">
                            "By syncing this identity, you authorize the Credit U engine to analyze your current visibility data and generate a customized roadmap for your transition from Consumer to Architect."
                        </p>
                    </div>
                </div>

                <div className="lg:col-span-6">
                    <div className="relative group">
                        {/* Glow FX */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition-all" />

                        <div className="relative aspect-[1.6/1] w-full bg-[#050914] rounded-[2.5rem] border border-white/10 p-10 flex flex-col justify-between shadow-3xl overflow-hidden">
                            {/* Scanning Line */}
                            <div className="absolute inset-x-0 h-[2px] bg-indigo-500/30 blur-[1px] top-0 animate-scan pointer-events-none" />

                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-indigo-400 font-mono text-[9px] uppercase tracking-[0.4em] mb-4">Identification Node</div>
                                    <div className="text-white text-4xl font-black tracking-tighter italic uppercase drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
                                        {form.firstName || '???'} {form.lastName}
                                    </div>
                                </div>
                                <div className="w-16 h-16 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center backdrop-blur-md">
                                    <CreditULogo className="w-10 h-10 opacity-70" variant="gold" showShield={false} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="h-px w-full bg-gradient-to-r from-indigo-500/50 to-transparent" />
                                <div className="flex justify-between items-end">
                                    <div>
                                        <div className="text-slate-500 font-mono text-[8px] uppercase tracking-widest mb-1">Status: CALIBRATING</div>
                                        <div className="text-amber-500 text-xs font-black uppercase tracking-[0.2em]">{form.primaryMission || 'WAITING FOR DATA...'}</div>
                                    </div>
                                    <div className="text-slate-700 text-[10px] font-mono tracking-widest uppercase bg-white/5 px-3 py-1 rounded-md border border-white/5">
                                        {form.studentIdCode}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center gap-6">
                <Button
                    disabled={!isComplete}
                    onClick={() => {
                        saveState(form);
                        setStep('map');
                    }}
                    className={cn(
                        "px-24 py-10 text-2xl font-black rounded-3xl transition-all shadow-3xl border-4",
                        isComplete
                            ? "bg-white text-black border-white hover:scale-105 hover:shadow-white/20"
                            : "bg-black/50 text-slate-700 border-white/10"
                    )}
                >
                    {isComplete ? "FINALIZE CALIBRATION" : "INPUT REQUIRED"}
                </Button>
                <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Caution: Identity locks are permanent for this session.</p>
            </div>
        </div>
    );
};

const MapStep = ({ setStep }: { setStep: (s: OnboardingStep) => void }) => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-4xl mx-auto px-6 z-10 text-center">
        <FadeIn delay={0}>
            <div className="text-4xl mb-6">🗺️</div>
            <h1 className="text-3xl font-black text-white mb-4 uppercase italic">Protocol Blueprint</h1>
            <p className="text-slate-400 font-light text-lg mb-12 max-w-xl">Observe your trajectory. The sequence is locked. You are now entering the tactical phase.</p>
        </FadeIn>
        <Button onClick={() => setStep('close')} className="bg-indigo-600 hover:bg-indigo-500 text-white px-12 py-8 text-lg font-black rounded-full uppercase tracking-widest">Access Day 01 Briefing</Button>
    </div>
);

const ApprovalMeter = () => {
    const [util, setUtil] = useState(30);
    const score = Math.max(0, 100 - (util * 1.5));
    return (
        <div className="w-full max-w-lg mx-auto bg-[#050914] border border-white/10 rounded-2xl p-6 mb-8 text-center shadow-inner">
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-6 tracking-widest">Approval Readiness Index</h4>
            <div className="text-5xl font-black text-emerald-400 mb-6 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">{Math.round(score)}%</div>
            <input type="range" min="0" max="100" value={util} onChange={(e) => setUtil(Number(e.target.value))} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
            <div className="flex justify-between mt-2 text-[8px] text-slate-500 font-bold uppercase tracking-widest">
                <span>Low Utilization</span>
                <span>High Utilization</span>
            </div>
        </div>
    );
};

const DayScript = ({ dayId, theme, script, onClose, onBack, checklistItems = [], videoUrl, requiresInput, worksheetPath, userState, saveState }: any) => {
    const navigate = useNavigate();
    const [checklist, setChecklist] = useState<boolean[]>(new Array(checklistItems.length).fill(false));
    const [inputValue, setInputValue] = useState(userState?.primaryMission || '');
    const [videoEnded, setVideoEnded] = useState(false);

    const toggleCheck = (index: number) => {
        const nc = [...checklist]; nc[index] = !nc[index]; setChecklist(nc);
    };

    const isVideoRequired = !!videoUrl;
    const isInputRequired = !!requiresInput;

    const allChecked = (checklist.length === 0 || checklist.every(Boolean)) &&
        (!isVideoRequired || videoEnded) &&
        (!isInputRequired || inputValue.length > 5);

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] max-w-7xl mx-auto px-4 z-10 py-12 relative w-full font-sans">
            {/* Dynamic Background for Day View */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[100px] mix-blend-screen" />
            </div>

            {/* Header / Nav */}
            <div className="w-full flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/10 pb-6 relative z-10">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-white uppercase tracking-[0.2em] transition-colors group bg-white/5 px-4 py-2 rounded-full border border-white/5 hover:bg-white/10"
                    >
                        <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Back to Map
                    </button>
                    <div className="h-6 w-px bg-white/10 mx-2 hidden md:block" />
                    <div className="text-[10px] text-indigo-400 font-mono tracking-widest uppercase hidden md:block">
                        INITIATION SEQUENCE // ONLINE
                    </div>
                </div>

                <div className="text-right">
                    <div className="flex items-center justify-end gap-3 mb-1">
                        <span className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-slate-500 italic tracking-tighter">
                            DAY 0{dayId}
                        </span>
                        <div className="flex flex-col items-start">
                            <span className="text-[10px] bg-amber-500 text-black px-1.5 rounded font-black uppercase tracking-wider">Current</span>
                            <span className="text-[10px] text-slate-500 font-mono">OBJECTIVE_LOCKED</span>
                        </div>
                    </div>
                    <GraffitiText className="text-3xl md:text-4xl text-indigo-500 -rotate-1 origin-right">
                        {theme}
                    </GraffitiText>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full h-full relative z-10">
                {/* Left Column: Media & Script (7 Cols) */}
                <div className="lg:col-span-7 space-y-8">
                    {videoUrl && (
                        <div className="relative group rounded-3xl overflow-hidden border border-white/20 bg-gray-900 shadow-2xl">
                            {/* Cinematic Glow */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 blur-lg group-hover:opacity-40 transition-opacity duration-1000" />

                            <div className="relative aspect-video bg-black">
                                <video
                                    src={videoUrl}
                                    controls
                                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                    onEnded={() => setVideoEnded(true)}
                                />
                                {/* Overlay Gradient for Depth */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                            </div>

                            {!videoEnded && (
                                <div className="absolute top-4 right-4 z-30 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">Intel Required</span>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl relative overflow-hidden shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                                <Activity className="w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-black text-white uppercase tracking-widest">
                                Mission Briefing
                            </h3>
                        </div>

                        <div className="space-y-6 text-lg md:text-xl text-slate-300 font-light leading-relaxed font-sans relative z-10">
                            {script && script.map((line: string, i: number) => (
                                <div key={i} className="flex gap-4">
                                    <span className="text-indigo-500/50 font-mono text-xs mt-2">0{i + 1}</span>
                                    <p>{line}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Execution & Input (5 Cols) */}
                <div className="lg:col-span-5 space-y-6 flex flex-col h-full">
                    {/* Mission System Checklist */}
                    <div className="bg-gradient-to-b from-slate-900/90 to-black/90 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 flex-1 relative overflow-hidden shadow-2xl">
                        {/* Decorative Element */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full blur-2xl" />

                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div>
                                <h3 className="text-lg font-black text-white uppercase italic tracking-tighter">
                                    Action Plan
                                </h3>
                                <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mt-1">
                                    Execute all protocols to advance
                                </p>
                            </div>
                            <div className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-emerald-400 font-bold font-mono">
                                {checklist.filter(Boolean).length}/{checklist.length + (isVideoRequired ? 1 : 0)} COMPLETE
                            </div>
                        </div>

                        <div className="space-y-4 relative z-10">
                            {checklistItems.map((item: string, idx: number) => (
                                <div
                                    key={idx}
                                    onClick={() => toggleCheck(idx)}
                                    className={cn(
                                        "group flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-300 active:scale-[0.98]",
                                        checklist[idx]
                                            ? "bg-emerald-500/10 border-emerald-500/30"
                                            : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20"
                                    )}
                                >
                                    <div className={cn(
                                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all mt-0.5 shrink-0",
                                        checklist[idx] ? "bg-emerald-500 border-emerald-500 text-black scale-110 shadow-[0_0_15px_rgba(16,185,129,0.4)]" : "border-slate-600 group-hover:border-slate-400"
                                    )}>
                                        {checklist[idx] && <Check className="w-3.5 h-3.5 stroke-[4]" />}
                                    </div>
                                    <div>
                                        <div className={cn("text-sm font-medium leading-snug transition-colors", checklist[idx] ? "text-white" : "text-slate-400 group-hover:text-slate-200")}>
                                            {item}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isVideoRequired && (
                                <div className={cn(
                                    "flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300",
                                    videoEnded
                                        ? "bg-amber-500/10 border-amber-500/30"
                                        : "bg-white/5 border-white/5 opacity-80"
                                )}>
                                    <div className={cn(
                                        "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0",
                                        videoEnded ? "bg-amber-500 border-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]" : "border-slate-600"
                                    )}>
                                        {videoEnded && <Check className="w-3.5 h-3.5 stroke-[4]" />}
                                    </div>
                                    <div>
                                        <div className={cn("text-sm font-medium leading-snug", videoEnded ? "text-white" : "text-slate-400")}>
                                            Watch Full Initiation Video
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>


                    {dayId === 3 && <ApprovalMeter />}


                    {(requiresInput || worksheetPath) && (
                        <div className="bg-gradient-to-br from-indigo-900/40 to-black/60 backdrop-blur-xl border border-indigo-500/30 rounded-3xl p-8 relative shadow-xl overflow-hidden group hover:border-indigo-500/50 transition-colors">
                            <div className="absolute inset-0 bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors" />

                            <h3 className="text-white font-black mb-6 uppercase tracking-widest text-sm flex items-center gap-2 relative z-10">
                                <FileText className="w-4 h-4 text-indigo-400" /> Mission Deliverable
                            </h3>

                            {worksheetPath ? (
                                <div onClick={() => navigate(worksheetPath)} className="cursor-pointer relative z-10">
                                    <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                                        This mission requires you to complete an external module. Launch the interface below to begin.
                                    </p>
                                    <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-4 text-center hover:bg-indigo-500/20 transition-all group/btn">
                                        <div className="flex items-center justify-center gap-3">
                                            <div className="p-2 bg-indigo-500 rounded-lg text-white group-hover/btn:scale-110 transition-transform">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div className="text-left">
                                                <div className="text-white font-bold uppercase text-xs tracking-wider">Launch Worksheet</div>
                                                <div className="text-[10px] text-indigo-300">REQ_ID: {dayId}_WS</div>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-indigo-400 ml-auto group-hover/btn:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative z-10">
                                    <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                                        Input your primary mission parameters to synchronize with the system core.
                                    </p>
                                    <textarea
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder=">> DECLARED MISSION PARAMETERS..."
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white font-mono text-sm focus:outline-none focus:border-indigo-500 focus:bg-black/60 resize-none min-h-[120px] placeholder:text-slate-600 transition-all shadow-inner"
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Compact Referral Option */}
                    <div className="border border-white/5 rounded-2xl overflow-hidden bg-white/5 backdrop-blur-md hover:border-white/10 transition-colors">
                        <DailyReferral variant="compact" />
                    </div>
                </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="fixed bottom-8 left-0 w-full z-40 flex justify-center pointer-events-none px-4">
                <Button
                    onClick={() => {
                        if (requiresInput) saveState({ primaryMission: inputValue });
                        onClose();
                    }}
                    disabled={!allChecked}
                    className={cn(
                        "pointer-events-auto shadow-2xl px-12 md:px-24 py-6 md:py-8 rounded-full text-lg md:text-xl font-black uppercase tracking-[0.2em] transition-all transform hover:-translate-y-2 border-4",
                        allChecked
                            ? "bg-white text-black border-white hover:bg-slate-200 hover:scale-105 shadow-[0_0_50px_rgba(255,255,255,0.3)]"
                            : "bg-black/80 text-slate-600 border-slate-700 backdrop-blur-md cursor-not-allowed"
                    )}
                >
                    <span className="relative z-10 flex items-center gap-4">
                        {allChecked ? <CheckCircle2 className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
                        {allChecked ? "Complete Day 0" + dayId : "Awaiting Completion"}
                    </span>
                </Button>
            </div>

            {/* Spacer for sticky footer */}
            <div className="h-32" />
        </div>
    );
};

const DayCompletionOverlay = ({ onClose, pointsEarned, isGraduation }: { onClose: () => void, pointsEarned: number, isGraduation?: boolean }) => {
    useEffect(() => {
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: isGraduation ? 20 : 10,
                angle: 60,
                spread: 70,
                origin: { x: 0 },
                colors: isGraduation ? ['#fbbf24', '#ffffff', '#10b981', '#ef4444'] : ['#10b981', '#ffffff', '#fbbf24']
            });
            confetti({
                particleCount: isGraduation ? 20 : 10,
                angle: 120,
                spread: 70,
                origin: { x: 1 },
                colors: isGraduation ? ['#fbbf24', '#ffffff', '#10b981', '#ef4444'] : ['#10b981', '#ffffff', '#fbbf24']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        frame();
    }, [isGraduation]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black font-sans overflow-hidden">
            {/* Cinematic Celebration Video */}
            <video
                src="/assets/celebration-loop.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-screen"
            />

            {/* Overlay Layers */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black opacity-90" />
            <div className="absolute inset-0 backdrop-blur-sm" />

            {/* Floating Party Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <FloatingCreditCard className="top-10 left-10 rotate-12 scale-125 from-purple-500 to-indigo-600 border-purple-400" />
                <FloatingCreditCard className="bottom-10 right-10 -rotate-12 scale-125 from-amber-500 to-orange-600 border-amber-400" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative z-10 text-center p-8 md:p-16 max-w-4xl"
            >
                <div className="relative inline-block mb-12">
                    <GraffitiText className="absolute -top-12 -left-12 text-6xl text-pink-500 -rotate-12 animate-pulse">
                        BOOM!
                    </GraffitiText>
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0],
                        }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                        className={cn("w-32 h-32 rounded-3xl border-4 flex items-center justify-center shadow-[0_0_100px_rgba(255,255,255,0.5)] transform rotate-3 bg-black", isGraduation ? "border-amber-400" : "border-emerald-400")}
                    >
                        {isGraduation ? <Award className="w-16 h-16 text-amber-400" /> : <CheckCircle2 className="w-16 h-16 text-emerald-400" />}
                    </motion.div>
                </div>

                <h2 className="text-7xl md:text-9xl font-black text-white mb-6 uppercase italic tracking-tighter leading-[0.85] drop-shadow-[0_10px_0_rgba(0,0,0,0.5)] transform -rotate-2">
                    {isGraduation ? "GRADUATION" : "MISSION"} <br />
                    <span className={cn("text-transparent bg-clip-text bg-gradient-to-r", isGraduation ? "from-amber-400 via-yellow-200 to-amber-500" : "from-emerald-400 via-emerald-200 to-teal-500")}>
                        {isGraduation ? "CERTIFIED" : "CRUSHED"}
                    </span>
                </h2>

                <div className="flex items-center justify-center gap-4 mb-16 bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 mx-auto max-w-md transform rotate-2">
                    <span className="text-5xl font-black text-white text-shadow">+{pointsEarned}</span>
                    <div className="text-left leading-none">
                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Moo Points</span>
                        <span className="block text-xl font-black text-amber-500 uppercase italic">SECURED</span>
                    </div>
                </div>

                <Button
                    onClick={onClose}
                    className={cn("group relative text-black px-24 py-12 text-2xl font-black rounded-2xl hover:scale-105 transition-all uppercase tracking-widest overflow-hidden shadow-[0_0_60px_rgba(255,255,255,0.3)] border-4 border-black", isGraduation ? "bg-amber-400" : "bg-emerald-400")}
                >
                    <span className="relative z-10">{isGraduation ? "CLAIM DIPLOMA" : "NEXT LEVEL"}</span>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-30 transition-opacity" />
                </Button>
            </motion.div>
        </div>
    );
};

const AccessProtocol = ({ dayId, onComplete }: { dayId: number, onComplete: () => void }) => {
    const [progress, setProgress] = useState(0);
    const [log, setLog] = useState<string[]>([]);

    useEffect(() => {
        const logs = [
            `ESTABLISHING SECURE CONNECTION TO DAY 0${dayId}...`,
            "BYPASSING FIREWALLS...",
            "DECRYPTING DORM DATA...",
            "SYNCHRONIZING...",
            "ACCESS GRANTED."
        ];

        const interval = setInterval(() => {
            setProgress(p => {
                if (p >= 100) { clearInterval(interval); setTimeout(onComplete, 500); return 100; }
                // Add sporadic log lines based on progress
                if (Math.random() > 0.7 && p < 90) {
                    setLog(l => [...l.slice(-4), logs[Math.floor((p / 20)) % logs.length]]);
                }
                return p + 4;
            });
        }, 30);
        return () => clearInterval(interval);
    }, []);
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black font-mono">
            <div className="w-64 h-64 relative mb-12">
                <div className="absolute inset-0 border-4 border-slate-800 rounded-full opacity-30" />
                <div className="absolute inset-0 border-t-4 border-emerald-500 rounded-full animate-spin" />
                <div className="absolute inset-4 border-b-4 border-emerald-500/50 rounded-full animate-[spin_3s_linear_infinite_reverse]" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-black text-white">{progress}%</span>
                </div>
            </div>
            <div className="max-w-md w-full px-6 space-y-2">
                {log.map((l, i) => (
                    <div key={i} className="text-[10px] text-emerald-500/70 font-mono uppercase tracking-widest text-center animate-pulse">
                        {l}
                    </div>
                ))}
            </div>
        </div>
    );
};

const MenuStep = ({ setStep, userState, saveState, setShowIDCard, dailyLoginTime }: any) => {
    const [activeDay, setActiveDay] = useState<number | null>(null);
    const [isAccessing, setIsAccessing] = useState(false);
    const [completedDay, setCompletedDay] = useState<any>(null);

    const coreDays = DORM_WEEK_CURRICULUM;

    if (completedDay) {
        return <DayCompletionOverlay
            pointsEarned={completedDay.rewardPoints || 0}
            isGraduation={completedDay.id === 5}
            onClose={() => {
                const current = userState.completedDays || [];
                const currentPoints = userState.mooPoints || 0;

                if (!current.includes(completedDay.id)) {
                    saveState({
                        completedDays: [...current, completedDay.id],
                        mooPoints: currentPoints + (completedDay.rewardPoints || 0)
                    });
                }

                if (completedDay.id === 5) setStep('certificate');
                else { setCompletedDay(null); setActiveDay(null); setIsAccessing(false); }
            }}
        />;
    }

    if (activeDay) {
        if (!isAccessing) return <AccessProtocol dayId={activeDay} onComplete={() => setIsAccessing(true)} />;
        const day = coreDays.find(d => d.id === activeDay);
        return <DayScript {...day} userState={userState} saveState={saveState} onBack={() => { setActiveDay(null); setIsAccessing(false); }} onClose={() => { setCompletedDay(day); setActiveDay(null); }} />;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-7xl mx-auto px-4 py-20 relative z-10 font-sans">
            {/* Dynamic Background for Map View */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[900px] h-[900px] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[100px] mix-blend-screen" />
            </div>

            <SecurityTimer dailyLoginTime={dailyLoginTime} />

            {/* HUD / Status Bar */}
            <div className="absolute top-8 left-4 md:left-8 flex gap-4 z-50">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full flex items-center gap-4 shadow-2xl hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="bg-amber-500/20 p-2 rounded-full"><Award className="w-5 h-5 text-amber-400" /></div>
                        <div>
                            <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none mb-1">Total Assets</div>
                            <div className="text-xl font-black text-white leading-none tracking-tight">{userState.mooPoints || 0} <span className="text-[10px] text-amber-500 font-bold align-top">PTS</span></div>
                        </div>
                    </div>
                </div>
            </div>

            <FadeIn delay={0} className="text-center mb-24 relative z-10">
                <div className="relative inline-block">
                    <GraffitiText className="text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 absolute -top-12 -left-8 -rotate-12 w-full text-center opacity-80 decoration-slice">
                        INITIATION
                    </GraffitiText>
                    <h1 className="text-8xl md:text-[10rem] font-black text-white uppercase italic tracking-tighter drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform -rotate-2 relative z-10 leading-[0.8]">
                        DORM WEEK
                    </h1>
                    <GraffitiText className="text-4xl md:text-5xl text-amber-400 absolute -bottom-8 -right-12 rotate-6 w-full text-center">
                        SEQUENCE
                    </GraffitiText>
                </div>
                <div className="mt-8">
                    <div className="text-sm font-bold text-indigo-300 tracking-[0.5em] uppercase bg-indigo-500/10 border border-indigo-500/20 inline-block px-6 py-2 rounded-full">
                        Credits Required: 05
                    </div>
                </div>
            </FadeIn>

            {/* Hexagonal / Tech Grid Layout */}
            <div className="relative w-full max-w-6xl mb-12">
                {/* Connection Line */}
                <div className="absolute top-1/2 left-4 right-4 h-1 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent -translate-y-1/2 hidden md:block rounded-full blurred-sm" />

                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10 place-items-center perspective-1000">
                    {coreDays.map((day, i) => {
                        const isLocked = i > 0 && !userState.completedDays?.includes(coreDays[i - 1].id) && !userState.completedDays?.includes(day.id);
                        const isDone = userState.completedDays?.includes(day.id);
                        const isNext = !isLocked && !isDone;

                        return (
                            <div key={day.id} className="relative group w-full flex flex-col items-center">
                                {/* Day Node */}
                                <button
                                    disabled={isLocked}
                                    onClick={() => setActiveDay(day.id)}
                                    className={cn(
                                        "w-40 h-56 md:w-44 md:h-64 rounded-3xl border flex flex-col items-center justify-between p-6 transition-all duration-500 relative overflow-hidden group-hover:-translate-y-4 shadow-2xl skew-y-[-2deg]",
                                        isLocked
                                            ? "bg-black/40 border-white/5 text-slate-700 backdrop-blur-sm grayscale opacity-60"
                                            : isDone
                                                ? "bg-emerald-900/20 border-emerald-500/50 text-emerald-400 backdrop-blur-md shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                                                : "bg-white/5 border-white/20 text-white backdrop-blur-xl hover:bg-white/10 hover:border-indigo-400 hover:shadow-[0_0_50px_rgba(99,102,241,0.3)]"
                                    )}
                                >
                                    {/* Background Gradient for Active Cards */}
                                    {!isLocked && !isDone && (
                                        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/0 via-indigo-500/5 to-indigo-500/20 pointer-events-none" />
                                    )}

                                    <div className="w-full flex justify-between items-start opacity-50 relative z-10">
                                        <div className="text-[10px] font-black uppercase tracking-widest">DAY</div>
                                        <div className="font-mono text-xs font-bold">0{day.id}</div>
                                    </div>

                                    <div className="absolute inset-0 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500">
                                        {isLocked ? <Lock className="w-8 h-8 opacity-20" /> : isDone ? <Check className="w-12 h-12 text-emerald-400" /> : <div className="text-5xl drop-shadow-2xl">🔥</div>}
                                    </div>

                                    <div className="w-full text-center relative z-10">
                                        <div className="text-[10px] font-black uppercase leading-tight mb-3 tracking-wide text-slate-300 group-hover:text-white transition-colors line-clamp-2">
                                            {day.title}
                                        </div>
                                        {!isLocked && !isDone && (
                                            <div className="text-[9px] font-bold bg-amber-400 text-black px-2 py-0.5 rounded shadow-lg inline-block">
                                                +{day.rewardPoints} PTS
                                            </div>
                                        )}
                                    </div>

                                    {/* Active State Animator */}
                                    {isNext && (
                                        <>
                                            <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/20 to-transparent animate-pulse" />
                                            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-400 shadow-[0_0_10px_rgba(99,102,241,1)]" />
                                        </>
                                    )}
                                </button>

                                {isNext && <div className="mt-6 text-sm font-black text-amber-400 uppercase tracking-widest animate-bounce drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]">Start Here</div>}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Dorm Week Info Section */}
            <div className="mt-12 max-w-4xl mx-auto text-center relative z-20 mb-20">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden group hover:border-indigo-500/30 transition-colors shadow-2xl">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />

                    <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                        <div className="w-24 h-24 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 transform rotate-3 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                            <span className="text-4xl">🎓</span>
                        </div>
                        <div className="text-left flex-1">
                            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">
                                WHAT IS <span className="text-indigo-400">DORM WEEK</span>?
                            </h3>
                            <p className="text-slate-400 leading-relaxed text-sm md:text-base font-light">
                                Dorm Week is your 5-day initiation into the Credit U ecosystem. It's designed to audit your current financial identity, strip away bad habits, and rebuild your credit foundation from the ground up.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                            <div className="text-amber-500 font-black text-xl mb-2">01.</div>
                            <h4 className="text-white font-bold uppercase text-xs tracking-widest mb-2">Audit & Analyze</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">We scan your current report for errors, negative items, and utilization spikes.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                            <div className="text-emerald-500 font-black text-xl mb-2">02.</div>
                            <h4 className="text-white font-bold uppercase text-xs tracking-widest mb-2">Rebuild & Optimize</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">Implement rapid rescoring tricks and dispute strategies to boost your score.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                            <div className="text-pink-500 font-black text-xl mb-2">03.</div>
                            <h4 className="text-white font-bold uppercase text-xs tracking-widest mb-2">Graduate & Scale</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">Unlock high-limit funding and elite credit cards upon completion.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-12 flex justify-center">
                <Button onClick={() => setShowIDCard(true)} variant="outline" className="group text-sm uppercase tracking-widest font-black h-16 px-10 border-white/10 bg-white/5 hover:bg-white hover:text-black rounded-full transition-all shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] backdrop-blur-md">
                    <CreditCard className="w-5 h-5 mr-3 group-hover:text-indigo-600 transition-colors" />
                    Access Student ID
                </Button>
            </div>
        </div >
    );
};

const NervousSystemBackground = () => (
    <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-blue-900/20 to-transparent" />
        <div className="absolute inset-0 bg-radial-gradient from-indigo-500/5 via-transparent to-transparent pointer-events-none" />
    </div>
);

// --- Main Page Component ---

export default function Orientation() {
    const navigate = useNavigate();
    const { profile } = useProfile();
    const [pendingReferrer, setPendingReferrer] = useState<{ id: string, name: string } | null>(null);
    const [showIDCard, setShowIDCard] = useState(false);
    const [userState, setUserState] = useState<UserState>(() => {
        if (typeof window === 'undefined') return { hasConsented: false, stressResponse: '', completedDayOne: false, signatureName: '', completedDays: [] };
        const saved = localStorage.getItem('credit_u_reset_state');
        if (saved) {
            try { return { completedDays: [], ...JSON.parse(saved) }; }
            catch (e) { console.error(e); }
        }
        return { hasConsented: false, stressResponse: '', completedDayOne: false, signatureName: '', completedDays: [], dormStartDate: Date.now(), dailyLoginTime: Date.now() };
    });

    const [step, setStep] = useState<OnboardingStep>(() => {
        if (typeof window === 'undefined') return 'arrival';
        const saved = localStorage.getItem('credit_u_reset_state');
        if (saved) {
            try { if (JSON.parse(saved).hasConsented) return 'close'; } catch (e) { }
        }
        return 'arrival';
    });

    useEffect(() => {
        if (profile?.id) {
            const checkReferral = async () => {
                const { data } = await supabase.from('referrals').select('referrer_id, profiles!referrals_referrer_id_fkey(full_name)').eq('referred_email', profile.email).eq('status', 'signed_up').single();
                if (data) {
                    const { data: res } = await supabase.from('referral_responses').select('id').eq('referred_id', profile.id).eq('referrer_id', data.referrer_id).single();
                    if (!res) setPendingReferrer({ id: data.referrer_id, name: (data as any).profiles?.full_name || 'Your Referrer' });
                }
            };
            checkReferral();
        }
    }, [profile?.id, profile?.email]);

    const saveState = (newState: Partial<UserState>) => {
        const updated = { ...userState, ...newState };
        setUserState(updated);
        localStorage.setItem('credit_u_reset_state', JSON.stringify(updated));
    };

    return (
        <div className="min-h-screen bg-[#020412] text-white flex flex-col font-sans overflow-hidden relative selection:bg-indigo-500/30">
            <NervousSystemBackground />

            <div className="absolute top-0 w-full p-8 flex justify-between items-center z-50">
                <div className="flex items-center gap-6">
                    <div className="text-[10px] font-black tracking-[0.5em] text-white/30 uppercase">Credit U // Dorm Week</div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-500 hover:text-white flex items-center gap-2 uppercase tracking-[0.2em] text-[10px] h-auto p-0"
                        onClick={() => navigate('/dashboard')}
                    >
                        <ChevronLeft className="w-3 h-3" /> Back to Campus
                    </Button>
                </div>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((_, i) => (
                        <div key={i} className={cn("w-1 h-1 rounded-full transition-all duration-500", (userState.completedDays?.length || 0) > i ? "bg-emerald-500" : "bg-white/10")} />
                    ))}
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center relative z-[10] w-full">
                <AnimatePresence mode="wait">
                    {step === 'arrival' && <motion.div className="w-full h-full" key="arr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.1 }} transition={{ duration: 0.5 }}><ArrivalStep setStep={setStep} /></motion.div>}
                    {step === 'welcome' && <motion.div className="w-full h-full" key="wel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.1 }} transition={{ duration: 0.5 }}><WelcomeStep setStep={setStep} /></motion.div>}
                    {step === 'reframe' && <motion.div className="w-full h-full" key="ref" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.1 }} transition={{ duration: 0.5 }}><ReframeStep setStep={setStep} /></motion.div>}
                    {step === 'consent' && <motion.div className="w-full h-full" key="con" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.1 }} transition={{ duration: 0.5 }}><ConsentStep setStep={setStep} saveState={saveState} /></motion.div>}
                    {step === 'calibration' && <motion.div className="w-full h-full" key="cal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.1 }} transition={{ duration: 0.5 }}><CalibrationStep setStep={setStep} /></motion.div>}
                    {step === 'identity' && <motion.div className="w-full h-full" key="ide" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.1 }} transition={{ duration: 0.5 }}><IdentityStep setStep={setStep} saveState={saveState} userState={userState} /></motion.div>}
                    {step === 'map' && <motion.div className="w-full h-full" key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.1 }} transition={{ duration: 0.5 }}><MapStep setStep={setStep} /></motion.div>}
                    {step === 'close' && <motion.div className="w-full h-full" key="clo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.1 }} transition={{ duration: 0.5 }}><MenuStep setStep={setStep} userState={userState} saveState={saveState} profile={profile} setShowIDCard={setShowIDCard} dailyLoginTime={userState.dailyLoginTime} /></motion.div>}
                    {step === 'certificate' && <motion.div className="w-full h-full" key="cer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}><DormResetCertificate studentName={`${userState.firstName || ''} ${userState.lastName || ''}`.trim() || 'Credit Architect'} /></motion.div>}
                </AnimatePresence>
            </div>

            {pendingReferrer && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                    <ReferralThanksForm referrerId={pendingReferrer.id} referrerName={pendingReferrer.name} onComplete={() => setPendingReferrer(null)} />
                </div>
            )}

            {showIDCard && (
                <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md">
                    <DigitalIDCard
                        firstName={userState.firstName || profile?.first_name || 'STUDENT'}
                        lastName={userState.lastName || profile?.last_name || ''}
                        level={userState.studentLevel || 'FRESHMAN'}
                        mission={userState.primaryMission || 'FINANCIAL OPTIMIZATION'}
                        idCode={userState.studentIdCode || `CU-ID`}
                        onClose={() => setShowIDCard(false)}
                    />
                </div>
            )}

            <div className="fixed bottom-4 right-4 z-[100] flex items-center gap-4">
                <button
                    onClick={() => {
                        localStorage.removeItem('credit_u_reset_state');
                        window.location.reload();
                    }}
                    className="flex items-center gap-2 text-[10px] text-white/30 hover:text-white uppercase tracking-widest font-mono border border-white/10 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm transition-all shadow-sm hover:shadow-md"
                >
                    <RefreshCw className="w-3 h-3" /> Refresh Protocol
                </button>
            </div>

            <div className="absolute bottom-4 w-full text-center text-[8px] font-black uppercase tracking-[0.5em] text-white/10 pointer-events-none">
                Authorization Node: ACTIVE // Security Layer: ENFORCED
            </div>
        </div>
    );
}
