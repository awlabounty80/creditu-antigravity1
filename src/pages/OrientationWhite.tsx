import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Shield, Lock, Activity, CreditCard, RefreshCw, ArrowLeft, ChevronLeft } from 'lucide-react';
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

// --- Types ---
type OnboardingStep =
    | 'arrival'
    | 'welcome'
    | 'reframe'
    | 'consent'
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
}

// --- Specialized Components (Defined outside to prevent re-renders) ---

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
        <div className="fixed top-24 right-6 z-40 bg-white/10 backdrop-blur-xl border border-slate-200 px-6 py-3 rounded-xl shadow-xl border-l-4 border-l-amber-500">
            <div className="flex items-center gap-4">
                <Activity className={cn("w-5 h-5", timeLeft.includes('WARMING') ? "text-blue-600 animate-pulse" : "text-amber-600 animate-pulse")} />
                <div className="text-sm font-mono font-bold tracking-wider">
                    <span className={cn("mr-2", timeLeft.includes('WARMING') ? "text-blue-600" : "text-amber-600")}>{timeLeft}</span>
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
    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full relative overflow-hidden z-10 perspective-1000 bg-[#f8fafc]">
            <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-slate-100 -z-30" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-200 via-amber-500 to-amber-200" />

            <FadeIn delay={0.2} duration={0.8}>
                <div className="relative group cursor-pointer mb-10 transform transition-transform duration-500 hover:scale-105">
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-4xl animate-[spin_8s_linear_infinite_reverse] opacity-80 filter drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]">👑</div>
                    <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center border-2 border-amber-500/30 shadow-2xl relative z-10 backdrop-blur-md group-hover:border-amber-400 overflow-hidden">
                        <CreditULogo className="w-full h-full" variant="gold" showShield={false} iconClassName="w-36 h-36" />
                    </div>
                </div>
            </FadeIn>
            <FadeIn delay={0.4} className="text-center">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 drop-shadow-sm uppercase relative z-10 leading-[0.9]">
                    WELCOME <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-b from-amber-400 via-amber-600 to-amber-800">HOME</span>
                </h1>
                <div className="mt-8">
                    <Button
                        onClick={() => setStep('welcome')}
                        className="group bg-slate-900 hover:bg-slate-800 text-white border border-amber-500/40 px-16 py-8 text-xl font-black tracking-[0.25em] uppercase transition-all duration-300 rounded-full shadow-2xl hover:shadow-amber-500/20 hover:scale-105"
                    >
                        ENTER DORM WEEK
                    </Button>
                </div>
            </FadeIn>
        </div>
    );
};

const WelcomeStep = ({ setStep }: { setStep: (s: OnboardingStep) => void }) => (
    <div className="flex flex-col items-center justify-center min-h-[70vh] max-w-6xl mx-auto px-6 z-10 relative">
        <FadeIn delay={0} className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight uppercase mb-4">Dorm Week <span className="text-amber-600">Reset</span></h1>
            <p className="text-slate-500 font-mono text-xs md:text-sm tracking-[0.2em] uppercase">Mandatory 5-Day Initiation</p>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-12">
            <div className="bg-white border border-slate-200 p-8 rounded-2xl h-full shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 uppercase tracking-wider mb-4">The Why</h3>
                <p className="text-slate-600 font-light leading-relaxed">It's time to repair your financial nervous system and prepare for high-limit funding.</p>
            </div>
            <div className="bg-white border border-slate-200 p-8 rounded-2xl h-full shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 uppercase tracking-wider mb-4">The What</h3>
                <ul className="text-slate-700 space-y-2 text-sm uppercase font-bold tracking-widest text-left md:text-center inline-block">
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-amber-500 rounded-full" /> 01 Identity Reframe</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-amber-500 rounded-full" /> 02 Credit Architect</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-amber-500 rounded-full" /> 03 Funding Secured</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-amber-500 rounded-full" /> 04 Wealth Systems</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-amber-500 rounded-full" /> 05 Graduation Pathway</li>
                </ul>
            </div>
        </div>
        <FadeIn delay={0.8}><Button onClick={() => setStep('reframe')} className="bg-slate-900 text-white hover:bg-slate-800 px-12 py-6 text-lg font-bold rounded-full shadow-lg">Accept Challenge</Button></FadeIn>
    </div>
);

const ReframeStep = ({ setStep }: { setStep: (s: OnboardingStep) => void }) => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-6xl mx-auto px-6 z-10 relative">
        <FadeIn delay={0.2} className="relative z-10 w-full mb-16">
            <div className="w-64 h-64 mx-auto mb-8"><CreditULogo className="w-full h-full" variant="gold" showShield={false} iconClassName="w-36 h-36" /></div>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 uppercase leading-[0.9]">WELCOME TO <br /><span className="text-amber-600">THE YARD</span></h1>
        </FadeIn>
        <FadeIn delay={0.6}>
            <Button onClick={() => setStep('consent')} className="bg-amber-600 hover:bg-amber-500 text-white px-12 py-6 text-lg font-black tracking-widest uppercase rounded-full shadow-xl transform hover:scale-110">Initiate Profile</Button>
        </FadeIn>
    </div>
);

const ConsentStep = ({ setStep, saveState }: { setStep: (s: OnboardingStep) => void, saveState: (s: Partial<UserState>) => void }) => {
    const [signature, setSignature] = useState('');
    const [isSigned, setIsSigned] = useState(false);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto px-6 z-10">
            <FadeIn delay={0.2} className="text-center w-full">
                <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-12 uppercase leading-tight">The Reset Protocol</h1>
                <div className="bg-white border border-slate-200 p-8 rounded-xl shadow-xl mb-8">
                    <p className="text-slate-700 text-lg leading-relaxed italic">"I reclaim my authority as the Architect of my own life. I understand that precision and discipline are required for this sequence."</p>
                </div>
                <Input
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    placeholder="Type your full name to sign"
                    className="bg-white border-slate-200 py-8 text-2xl text-slate-900 placeholder:text-slate-300 text-center rounded-xl mb-12 shadow-inner font-serif italic"
                />
                <Button
                    onClick={() => {
                        if (signature.length > 2) {
                            setIsSigned(true);
                            setTimeout(() => {
                                saveState({ hasConsented: true, signatureName: signature });
                                setStep('identity');
                            }, 1000);
                        }
                    }}
                    disabled={signature.length < 3}
                    className={cn("w-full py-8 text-lg font-bold uppercase rounded-full transition-all", signature.length > 2 && !isSigned ? "bg-slate-900 text-white" : isSigned ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-400")}
                >
                    {isSigned ? "Protocol Accepted" : "Initialize Reset"}
                </Button>
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
        <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-4xl mx-auto px-6 z-10">
            <FadeIn delay={0} className="text-center mb-12">
                <h1 className="text-3xl font-black text-slate-900 mb-2 uppercase italic">Identity Reconstruction</h1>
                <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">Secure Entry Sequence Active</p>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full mb-12">
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <Input value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} placeholder="First Name" className="bg-white border-slate-200 h-14 shadow-sm" />
                        <Input value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} placeholder="Last Name" className="bg-white border-slate-200 h-14 shadow-sm" />
                    </div>
                    <Input value={form.primaryMission} onChange={e => setForm({ ...form, primaryMission: e.target.value })} placeholder="Mission Objective (e.g. Financial Freedom)" className="bg-white border-slate-200 h-14 shadow-sm" />
                </div>
                <div className="aspect-[1.6/1] w-full bg-white rounded-2xl border border-slate-200 p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -mr-8 -mt-8" />
                    <div className="text-slate-900 text-2xl font-black tracking-tighter italic uppercase">{form.firstName || '???'} {form.lastName}</div>
                    <div className="text-amber-600 text-[10px] font-black uppercase tracking-[0.3em]">{form.primaryMission || 'ANALYZING MISSION...'}</div>
                    <div className="flex justify-between items-end">
                        <div className="text-slate-400 text-[8px] font-mono tracking-widest uppercase">{form.studentIdCode}</div>
                        <CreditULogo className="w-12 h-12" variant="gold" showShield={false} />
                    </div>
                </div>
            </div>
            <Button
                disabled={!isComplete}
                onClick={() => {
                    saveState(form);
                    setStep('map');
                }}
                className={cn("px-16 py-8 text-xl font-black rounded-full transition-all shadow-xl", isComplete ? "bg-slate-900 text-white hover:scale-105" : "bg-slate-100 text-slate-400")}
            >
                {isComplete ? "LOCK IDENTIFICATION" : "COMPLETE INTEL"}
            </Button>
        </div>
    );
};

const MapStep = ({ setStep }: { setStep: (s: OnboardingStep) => void }) => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-4xl mx-auto px-6 z-10 text-center">
        <FadeIn delay={0}>
            <div className="text-4xl mb-6">🗺️</div>
            <h1 className="text-3xl font-black text-slate-900 mb-4 uppercase italic">Protocol Blueprint</h1>
            <p className="text-slate-600 font-light text-lg mb-12 max-w-xl">Observe your trajectory. The sequence is locked. You are now entering the tactical phase.</p>
        </FadeIn>
        <Button onClick={() => setStep('close')} className="bg-slate-900 hover:bg-slate-800 text-white px-12 py-8 text-lg font-black rounded-full uppercase tracking-widest shadow-xl">Access Day 01 Briefing</Button>
    </div>
);

const ApprovalMeter = () => {
    const [util, setUtil] = useState(30);
    const score = Math.max(0, 100 - (util * 1.5));
    return (
        <div className="w-full max-w-lg mx-auto bg-white border border-slate-200 rounded-2xl p-6 mb-8 text-center shadow-lg">
            <h4 className="text-xs font-bold text-slate-400 uppercase mb-6 tracking-widest">Approval Readiness Index</h4>
            <div className="text-5xl font-black text-emerald-600 mb-6 drop-shadow-sm">{Math.round(score)}%</div>
            <input type="range" min="0" max="100" value={util} onChange={(e) => setUtil(Number(e.target.value))} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900" />
            <div className="flex justify-between mt-2 text-[8px] text-slate-400 font-bold uppercase tracking-widest">
                <span>Low Utilization</span>
                <span>High Utilization</span>
            </div>
        </div>
    );
};

const DayScript = ({ dayId, theme, script, onClose, onBack, checklistItems = [], videoUrl, requiresInput, userState, saveState }: any) => {
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
        <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-4xl mx-auto px-6 z-10 text-center py-20 relative">
            <button
                onClick={onBack}
                className="absolute top-10 left-6 flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-slate-900 uppercase tracking-widest transition-colors group"
            >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Return to Protocols
            </button>
            <div className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-[0.4em]">Day 0{dayId} // {theme}</div>

            {videoUrl && (
                <div className="w-full aspect-video bg-black rounded-3xl overflow-hidden border border-slate-200 mb-12 shadow-2xl relative group">
                    <video
                        src={videoUrl}
                        controls
                        className="w-full h-full object-cover"
                        onEnded={() => setVideoEnded(true)}
                    />
                    {!videoEnded && (
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200 text-[10px] font-mono text-amber-600 uppercase tracking-widest animate-pulse">
                            Watch to Unlock
                        </div>
                    )}
                </div>
            )}

            <div className="space-y-6 text-xl text-slate-800 font-light text-left w-full mb-12 leading-relaxed max-w-2xl mx-auto">
                {script && script.map((line: string, i: number) => <p key={i}>{line}</p>)}
            </div>

            {dayId === 3 && <ApprovalMeter />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-12 max-w-4xl">
                <div className="bg-white border border-slate-200 p-8 rounded-2xl text-left shadow-xl">
                    <h3 className="text-slate-900 font-bold mb-6 uppercase tracking-wider text-sm flex items-center gap-2">
                        <Shield className="w-4 h-4 text-emerald-600" /> Mission Checklist
                    </h3>
                    <div className="space-y-4">
                        {checklistItems.map((item: string, idx: number) => (
                            <div key={idx} onClick={() => toggleCheck(idx)} className="flex items-center gap-4 cursor-pointer group">
                                <div className={cn("w-6 h-6 rounded border flex items-center justify-center transition-all", checklist[idx] ? "bg-emerald-500 border-emerald-500" : "border-slate-200 group-hover:border-slate-400")}>
                                    {checklist[idx] && <Check className="w-4 h-4 text-white" />}
                                </div>
                                <span className={cn("text-sm transition-colors", checklist[idx] ? "text-emerald-700" : "text-slate-400 group-hover:text-slate-900")}>{item}</span>
                            </div>
                        ))}
                        {isVideoRequired && (
                            <div className="flex items-center gap-4 opacity-50">
                                <div className={cn("w-6 h-6 rounded border flex items-center justify-center", videoEnded ? "bg-amber-500 border-amber-500" : "border-slate-200")}>
                                    {videoEnded && <Check className="w-4 h-4 text-white" />}
                                </div>
                                <span className={cn("text-sm transition-colors", videoEnded ? "text-amber-600" : "text-slate-400")}>Video Transmission Complete</span>
                            </div>
                        )}
                    </div>
                </div>

                {requiresInput && (
                    <div className="bg-white border border-slate-200 p-8 rounded-2xl text-left shadow-xl flex flex-col">
                        <h3 className="text-slate-900 font-bold mb-6 uppercase tracking-wider text-sm flex items-center gap-2">
                            <Activity className="w-4 h-4 text-blue-600" /> Mission Briefing
                        </h3>
                        <textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Type your primary mission objective here..."
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 text-sm focus:outline-none focus:border-blue-500/50 resize-none min-h-[120px]"
                        />
                        <div className="mt-4 text-[10px] text-slate-400 font-mono uppercase tracking-widest">
                            {inputValue.length > 5 ? "Input Validated" : "Requires at least 5 characters"}
                        </div>
                    </div>
                )}
            </div>

            <Button
                onClick={() => {
                    if (requiresInput) saveState({ primaryMission: inputValue });
                    onClose();
                }}
                disabled={!allChecked}
                className={cn("px-16 py-8 rounded-full text-xl font-black uppercase tracking-[0.2em] transition-all shadow-xl", allChecked ? "bg-slate-900 text-white hover:scale-105" : "bg-slate-100 text-slate-400 cursor-not-allowed")}
            >
                {allChecked ? "Execute Action" : "Complete Protocol Steps"}
            </Button>
        </div>
    );
};

const DayCompletionOverlay = ({ onClose }: { onClose: () => void }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/95 backdrop-blur-xl animate-in fade-in duration-500">
        <div className="text-center p-6 bg-white border border-slate-200 rounded-3xl shadow-2xl py-20 px-12">
            <div className="text-6xl mb-8 animate-bounce">🛡️</div>
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-4 uppercase italic tracking-tighter leading-none">Mission <br />Complete</h2>
            <p className="text-emerald-600 font-mono tracking-widest text-[10px] uppercase mb-12">PROTOCOL SYNCHRONIZATION SUCCESSFUL</p>
            <Button onClick={onClose} className="bg-slate-900 text-white px-16 py-8 text-xl font-black rounded-full hover:scale-105 transition-transform uppercase tracking-widest shadow-xl">CONTINUE OP</Button>
        </div>
    </div>
);

const AccessProtocol = ({ dayId, onComplete }: { dayId: number, onComplete: () => void }) => {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(p => {
                if (p >= 100) { clearInterval(interval); setTimeout(onComplete, 800); return 100; }
                return p + 5;
            });
        }, 30);
        return () => clearInterval(interval);
    }, []);
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white font-mono">
            <div className="max-w-xs w-full px-6">
                <div className="w-full h-2 bg-slate-100 mb-8 border border-slate-200 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-slate-900 shadow-sm" />
                </div>
                <div className="text-[9px] text-slate-400 uppercase tracking-[0.3em] text-center animate-pulse">ACCESSING PROTOCOL 0{dayId}...</div>
            </div>
        </div>
    );
};

const MenuStep = ({ setStep, userState, saveState, setShowIDCard, dailyLoginTime }: any) => {
    const [activeDay, setActiveDay] = useState<number | null>(null);
    const [isAccessing, setIsAccessing] = useState(false);
    const [completedDay, setCompletedDay] = useState<any>(null);

    const coreDays = [
        { id: 1, title: 'Mindset', theme: 'IDENTITY REFRAME', intro: ["Welcome to your first reset sequence.", "Today we rebuild the psychological foundation."], videoUrl: "/assets/dean-welcome-v2.mp4", requiresInput: true, task: "Protocol Initiation", checklistItems: ["Watch initiation video", "Record primary mission objectives"] },
        { id: 2, title: 'Architect', theme: 'CREDIT ARCHITECT', intro: ["Tactical data analysis is active.", "We are auditing the reports for structural flaws."], videoUrl: "/assets/dr-leverage-matrix.mp4", task: "Bureau Review", checklistItems: ["Access bureau reports", "Identify legacy errors"] },
        { id: 3, title: 'Funding', theme: 'FUNDING SECURED', intro: ["Optimization sequence active.", "Positioning profile for elite institutional capital."], videoUrl: "/assets/dean-part-2.mp4", task: "Approval Positioning", checklistItems: ["Verify utilization compliance", "Check inquiry velocity"] },
        { id: 4, title: 'Systems', theme: 'WEALTH SYSTEMS', intro: ["Automation is the goal.", "Removing the human factor from the funding equation."], task: "System Setup", checklistItems: ["Configure auto-pilot systems"] },
        { id: 5, title: 'Reset', theme: 'THE GRADUATION', intro: ["Final verification sequence.", "You are ready to enter the next phase of the protocol."], videoUrl: "/assets/celebration-loop.mp4", task: "Oath of Excellence", checklistItems: ["Sign the graduation oath"] }
    ];

    if (completedDay) {
        return <DayCompletionOverlay onClose={() => {
            const current = userState.completedDays || [];
            if (!current.includes(completedDay.id)) saveState({ completedDays: [...current, completedDay.id] });
            if (completedDay.id === 5) setStep('certificate');
            else { setCompletedDay(null); setActiveDay(null); setIsAccessing(false); }
        }} />;
    }

    if (activeDay) {
        if (!isAccessing) return <AccessProtocol dayId={activeDay} onComplete={() => setIsAccessing(true)} />;
        const day = coreDays.find(d => d.id === activeDay);
        return <DayScript {...day} userState={userState} saveState={saveState} onBack={() => { setActiveDay(null); setIsAccessing(false); }} onClose={() => { setCompletedDay(day); setActiveDay(null); }} />;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-5xl mx-auto px-6 z-10 w-full py-20 bg-white relative">
            <SecurityTimer dailyLoginTime={dailyLoginTime} />
            <FadeIn delay={0} className="text-center mb-20">
                <h1 className="text-3xl font-thin text-slate-800 tracking-[0.3em] uppercase opacity-80">
                    CREDIT U DORM WEEK <span className="font-bold border-b-2 border-slate-900">RESET</span>
                </h1>
            </FadeIn>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 w-full mb-24">
                {coreDays.map((day, i) => {
                    const isLocked = i > 0 && !userState.completedDays?.includes(coreDays[i - 1].id) && !userState.completedDays?.includes(day.id);
                    const isDone = userState.completedDays?.includes(day.id);
                    return (
                        <div key={day.id} className="flex flex-col items-center gap-4 group">
                            <button
                                disabled={isLocked}
                                onClick={() => setActiveDay(day.id)}
                                className={cn(
                                    "w-20 h-20 rounded-2xl flex items-center justify-center text-xl font-black border-2 transition-all duration-500 relative overflow-hidden shadow-sm",
                                    isLocked ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed" :
                                        isDone ? "bg-emerald-50 border-emerald-200 text-emerald-600" :
                                            "bg-white border-slate-200 text-slate-900 hover:border-slate-900 hover:scale-110 shadow-lg"
                                )}
                            >
                                {isLocked ? <Lock className="w-6 h-6" /> : isDone ? <Check className="w-8 h-8" /> : day.id}
                                {!isLocked && !isDone && <div className="absolute inset-x-0 bottom-0 h-1 bg-amber-500/20 animate-pulse" />}
                            </button>
                            <span className={cn("text-[9px] uppercase font-black transition-colors tracking-widest text-center", isLocked ? "text-slate-300" : isDone ? "text-emerald-600" : "text-slate-500")}>
                                {day.title}
                            </span>
                        </div>
                    );
                })}
            </div>
            <DailyReferral />
            <div className="mt-12">
                <Button onClick={() => setShowIDCard(true)} variant="outline" className="text-xs uppercase tracking-widest font-black h-12 px-8 border-slate-200 hover:bg-slate-50 transition-colors">
                    <CreditCard className="w-4 h-4 mr-2" /> View Digital ID
                </Button>
            </div>
        </div>
    );
};

const NervousSystemBackground = () => (
    <div className="absolute inset-0 pointer-events-none opacity-40 z-0">
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-slate-100 to-transparent" />
        <div className="absolute inset-0 bg-radial-gradient from-amber-500/5 via-transparent to-transparent pointer-events-none" />
    </div>
);

// --- Main Page Component ---

export default function OrientationWhite() {
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
        <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans overflow-hidden relative selection:bg-amber-500/20">
            <NervousSystemBackground />

            <div className="absolute top-0 w-full p-8 flex justify-between items-center z-50">
                <div className="flex items-center gap-6">
                    <div className="text-[10px] font-black tracking-[0.5em] text-slate-300 uppercase">Credit U // Dorm Week</div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-500 hover:text-slate-900 flex items-center gap-2 uppercase tracking-[0.2em] text-[10px] h-auto p-0"
                        onClick={() => navigate('/dashboard')}
                    >
                        <ChevronLeft className="w-3 h-3" /> Back to Campus
                    </Button>
                </div>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((_, i) => (
                        <div key={i} className={cn("w-1 h-1 rounded-full transition-all duration-500", (userState.completedDays?.length || 0) > i ? "bg-amber-500" : "bg-slate-200")} />
                    ))}
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center relative z-[10] w-full">
                <AnimatePresence mode="wait">
                    {step === 'arrival' && <motion.div className="w-full h-full" key="arr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.1 }} transition={{ duration: 0.5 }}><ArrivalStep setStep={setStep} /></motion.div>}
                    {step === 'welcome' && <motion.div className="w-full h-full" key="wel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.1 }} transition={{ duration: 0.5 }}><WelcomeStep setStep={setStep} /></motion.div>}
                    {step === 'reframe' && <motion.div className="w-full h-full" key="ref" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.1 }} transition={{ duration: 0.5 }}><ReframeStep setStep={setStep} /></motion.div>}
                    {step === 'consent' && <motion.div className="w-full h-full" key="con" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.1 }} transition={{ duration: 0.5 }}><ConsentStep setStep={setStep} saveState={saveState} /></motion.div>}
                    {step === 'identity' && <motion.div className="w-full h-full" key="ide" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.1 }} transition={{ duration: 0.5 }}><IdentityStep setStep={setStep} saveState={saveState} userState={userState} /></motion.div>}
                    {step === 'map' && <motion.div className="w-full h-full" key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.1 }} transition={{ duration: 0.5 }}><MapStep setStep={setStep} /></motion.div>}
                    {step === 'close' && <motion.div className="w-full h-full" key="clo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.1 }} transition={{ duration: 0.5 }}><MenuStep setStep={setStep} userState={userState} saveState={saveState} profile={profile} setShowIDCard={setShowIDCard} dailyLoginTime={userState.dailyLoginTime} /></motion.div>}
                    {step === 'certificate' && <motion.div className="w-full h-full" key="cer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}><DormResetCertificate studentName={`${userState.firstName || ''} ${userState.lastName || ''}`.trim() || 'Credit Architect'} /></motion.div>}
                </AnimatePresence>
            </div>

            {pendingReferrer && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
                    <ReferralThanksForm referrerId={pendingReferrer.id} referrerName={pendingReferrer.name} onComplete={() => setPendingReferrer(null)} />
                </div>
            )}

            {showIDCard && (
                <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
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
                    className="flex items-center gap-2 text-[10px] text-slate-300 hover:text-slate-900 uppercase tracking-widest font-mono border border-slate-100 px-3 py-1.5 rounded-full bg-white/50 backdrop-blur-sm transition-all shadow-sm hover:shadow-md"
                >
                    <RefreshCw className="w-3 h-3" /> Refresh Protocol
                </button>
            </div>

            <div className="absolute bottom-4 w-full text-center text-[8px] font-black uppercase tracking-[0.5em] text-slate-200 pointer-events-none">
                Authorization Node: ACTIVE // Security Layer: ENFORCED
            </div>
        </div>
    );
}
