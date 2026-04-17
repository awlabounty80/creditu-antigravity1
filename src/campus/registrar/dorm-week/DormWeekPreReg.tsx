// CACHE_BUST_OMEGA_2026_0306_0255
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditUAdmissionsMachineV2 as CreditUAdmissionsMachine } from './CreditUAdmissionsMachineV2';
import { RegistrationForm } from './RegistrationForm';
import { AdmissionSummary } from './AdmissionSummary';
import { useDormWeek } from '@/hooks/useDormWeek';
import { 
    ChevronRight, 
    ArrowRight, 
    Zap, 
    Shield, 
    TrendingUp, 
    UserCheck, 
    Award, 
    Cpu,
    GraduationCap,
    Sparkles
} from 'lucide-react';
import { DORM_WEEK_CURRICULUM } from '@/data/dorm-week-curriculum';

// --- Sub-Components ---

const GraffitiText = ({ children, className, color = "text-pink-500" }: { children: React.ReactNode, className?: string, color?: string }) => (
    <div className={cn("font-black italic transform -rotate-3 tracking-tighter drop-shadow-[5px_5px_0px_rgba(0,0,0,1)]", color, className)} style={{ fontFamily: 'impact, sans-serif' }}>
        {children}
    </div>
);

const AuthorityBadge = ({ icon: Icon, label, color, delay }: { icon: any, label: string, color: string, delay: number }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.8, x: -20, rotate: -5 }}
        animate={{ opacity: 1, scale: 1, x: 0, rotate: 0 }}
        transition={{ duration: 0.5, delay, ease: "backOut" }}
        className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl border bg-black/60 backdrop-blur-md text-xs font-black uppercase tracking-widest shadow-[0_10px_20px_rgba(0,0,0,0.5)] absolute hover:scale-110 transition-transform cursor-help z-20",
            color
        )}
    >
        <Icon className="w-4 h-4" />
        {label}
    </motion.div>
);

const cn = (...classes: any[]) => classes.filter(Boolean).join(' '); // Simple fallback if utils.cn is unavailable or for local use

export default function DormWeekPreReg() {
    const { captureLead, siteState, getAdmissionsSession } = useDormWeek();
    const [step, setStep] = useState<'intro' | 'register' | 'spin' | 'result'>('intro');
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [result, setResult] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Resume session if exists (or reset if requested)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const storedEmail = localStorage.getItem('cu_admissions_email');
        const storedName = localStorage.getItem('cu_admissions_name');

        if (params.get('reset') === 'true') {
            console.log("DormWeekPreReg: [FORCE RESET] Clearing local admissions data.");
            if (storedEmail) localStorage.removeItem(`cu_session_${storedEmail}`);
            localStorage.removeItem('cu_admissions_email');
            localStorage.removeItem('cu_admissions_name');
            // Remove the param and force RELOAD to ensure clean state
            window.history.replaceState({}, '', window.location.pathname);
            window.location.reload();
            return;
        }

        if (storedEmail) {
            setEmail(storedEmail);
            setName(storedName || '');

            getAdmissionsSession(storedEmail).then(session => {
                if (session) {
                    setStep('result');
                }
            });
        }
    }, [getAdmissionsSession]);

    const handleRegister = async (data: { name: string; email: string; password?: string; phone?: string; dob?: string; city?: string; state?: string }) => {
        setIsLoading(true);
        setError(null);

        // SAFETY TIMEOUT: Force-start after 1.5s regardless of DB status
        const safetyTimeout = setTimeout(() => {
            console.warn("handleRegister: Safety timeout reached. Forcing unlock.");
            setEmail(data.email);
            setName(data.name);
            setStep('result');
            setIsLoading(false);
        }, 1500);

        try {
            const capture = await captureLead(data.name, data.email, {
                password: data.password,
                phone: data.phone,
                dob: data.dob,
                city: data.city,
                state: data.state
            });

            if (capture.success) {
                clearTimeout(safetyTimeout);
                localStorage.setItem('cu_admissions_email', data.email);
                localStorage.setItem('cu_admissions_name', data.name);
                setEmail(data.email);
                setName(data.name);

                if (capture.alreadyAccepted) {
                    console.log("DormWeekPreReg: [TESTING] Routing to ID for accepted student.");
                    setStep('result');
                    return;
                }

                setStep('result');
            }
        } catch (err: any) {
            console.warn("handleRegister: Recovering via local protocol.", err);
            clearTimeout(safetyTimeout);
            setEmail(data.email);
            setName(data.name);
            setStep('result');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSpinResult = (spinResult: any) => {
        setResult(spinResult);
        if (spinResult.spinCount === 3) {
            window.location.href = '/locker';
        }
    };

    const handleSummaryComplete = () => {
        setStep('spin');
    };

    const handleStartRegistration = () => {
        setIsMuted(false);
        setStep('register');
        if (videoRef.current) {
            videoRef.current.muted = false;
        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-black text-white selection:bg-indigo-500/30 flex flex-col items-center justify-center">
            {/* CINEMATIC BACKGROUND SYSTEM */}
            <div className="absolute inset-0 z-0 bg-black">
                {/* Stage 1 & 2: Stadium / Meta AI Cinematic */}
                {(step === 'intro' || step === 'register' || step === 'spin') && (
                    <div className={`absolute inset-0 transition-opacity duration-1000 ${step === 'register' || step === 'spin' ? 'opacity-30' : 'opacity-100'}`}>
                        <video 
                            ref={videoRef}
                            src="/assets/meta-ai-hero-video.mp4"
                            autoPlay
                            loop
                            muted={isMuted}
                            playsInline
                            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${step === 'register' || step === 'spin' ? 'blur-sm grayscale-[0.5]' : ''}`}
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t from-black transition-opacity duration-1000 ${step === 'register' || step === 'spin' ? 'via-black/60 to-black/80' : 'via-transparent to-black/20'}`} />
                    </div>
                )}

                {/* Stage 3: Celebration (User Video) */}
                {step === 'result' && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5 }}
                        className="absolute inset-0"
                    >
                        <video 
                            src="/assets/dorm-welcome.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover opacity-60"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
                    </motion.div>
                )}
            </div>

            <div className="relative z-10 w-full max-w-5xl flex flex-col items-center p-6">
                <AnimatePresence mode="wait">
                    {step === 'intro' && (
                        <motion.div
                            key="intro-flow"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                            className="w-full flex flex-col items-center justify-center min-h-[60vh] text-center"
                        >
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9, y: -20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    className="relative mb-8"
                                >
                                    <GraffitiText className="absolute -top-12 -left-4 md:-left-12 rotate-[-12deg] text-3xl md:text-5xl text-pink-500 opacity-90 animate-pulse">
                                        WELCOME TO
                                    </GraffitiText>
                                    <motion.h1 
                                        className="text-7xl md:text-9xl font-black italic tracking-tighter uppercase text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                                        animate={{ textShadow: ["0 0 20px rgba(255,255,255,0.3)", "0 0 50px rgba(255,255,255,0.6)", "0 0 20px rgba(255,255,255,0.3)"] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        DORM WEEK<span className="text-amber-500">.</span>
                                    </motion.h1>
                                    <GraffitiText className="absolute -bottom-8 -right-4 md:-right-12 rotate-[6deg] text-3xl md:text-4xl text-blue-400 opacity-90">
                                        THE TAKEOVER
                                    </GraffitiText>
                                </motion.div>
                                <p className="text-xl md:text-2xl font-bold text-amber-500 tracking-[0.3em] uppercase italic bg-black/40 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                                    The Mandatory <span className="text-white underline underline-offset-4 decoration-amber-500">5-Day Financial Reset</span>.
                                </p>

                            <button
                                onClick={handleStartRegistration}
                                className="group h-24 px-16 text-2xl md:text-4xl font-black uppercase tracking-[0.25em] text-black rounded-full transition-all duration-300 border-4 border-amber-300 flex items-center justify-center relative overflow-hidden bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 hover:scale-105 active:scale-95 shadow-[0_0_80px_rgba(245,158,11,0.5)]"
                            >
                                <span className="relative z-10 flex items-center gap-4 drop-shadow-sm">
                                    START REGISTRATION 
                                    <motion.div
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    >
                                        <ArrowRight className="w-8 h-8 md:w-10 md:h-10" />
                                    </motion.div>
                                </span>
                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        </motion.div>
                    )}

                    {step === 'register' && (
                        <motion.div
                            key="register-flow"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full flex flex-col items-center"
                        >
                            {/* --- PHASE 3: AUTHORITY LOCK (Micro-Signals) --- */}
                            <div className="absolute w-full max-w-4xl h-full pointer-events-none hidden md:block">
                                <AuthorityBadge icon={UserCheck} label="Identity Verified" color="border-emerald-500/50 text-emerald-400 bg-emerald-950/80 top-[15%] left-[10%]" delay={0.5} />
                                <AuthorityBadge icon={TrendingUp} label="Limit Increased" color="border-blue-500/50 text-blue-400 bg-blue-950/80 top-[20%] right-[15%]" delay={1.2} />
                                <AuthorityBadge icon={Shield} label="Dispute Won" color="border-amber-500/50 text-amber-400 bg-amber-950/80 bottom-[20%] left-[20%]" delay={2.0} />
                            </div>

                            <div className="text-center mb-8 space-y-2 relative z-10">
                                <GraffitiText className="text-4xl md:text-6xl text-white">
                                    THE TAKEOVER
                                </GraffitiText>
                                <p className="text-sm md:text-base font-bold text-amber-500 tracking-[0.4em] uppercase italic opacity-80">
                                    Initialize 5-Day Reset Protocol
                                </p>
                            </div>

                            <RegistrationForm
                                onSubmit={handleRegister}
                                isLoading={isLoading}
                                error={error}
                            />

                            {/* --- MISSION BRIEFING --- */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="w-full max-w-3xl mt-12 bg-[#0A0F1E]/80 backdrop-blur-md border border-indigo-500/30 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group shadow-2xl"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />

                                <div className="relative z-10 w-24 h-24 flex-shrink-0">
                                    <div className="absolute inset-0 bg-indigo-500/20 rounded-2xl animate-pulse" />
                                    <div className="relative bg-black w-full h-full rounded-2xl flex items-center justify-center border border-white/10 overflow-hidden shadow-2xl">
                                        <Cpu className="w-12 h-12 text-indigo-400" />
                                    </div>
                                </div>

                                <div className="flex-1 text-left space-y-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Neural Uplink ///</span>
                                        <span className="text-[10px] font-mono text-slate-500">MISSION_BRIEFING_v2.0</span>
                                    </div>
                                    <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">Transmission from Dr. Leverage™</h4>
                                    <p className="text-[#94a3b8] font-mono text-[11px] leading-relaxed border-l-2 border-indigo-500/30 pl-4 py-1">
                                        &gt; STUDENT_NOTICE: The old credit scoring models are being dismantled.<br/>
                                        &gt; Dorm Week is your window to recalibrate your digital footprint.<br/>
                                        &gt; Rebuild your identity. Reclaim your capital.
                                    </p>
                                </div>
                            </motion.div>

                            {/* --- 5-DAY CURRICULUM PREVIEW --- */}
                            <motion.div 
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                className="w-full max-w-5xl mt-24 mb-12"
                            >
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="h-px bg-white/10 flex-1" />
                                    <span className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em]">The Curriculum Protocol</span>
                                    <div className="h-px bg-white/10 flex-1" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                    {DORM_WEEK_CURRICULUM.map((day, i) => (
                                        <div key={i} className="bg-black/60 backdrop-blur-md border border-white/5 p-6 rounded-2xl text-center hover:bg-white/5 transition-all group relative overflow-hidden">
                                            <div className="relative z-10 flex flex-col items-center">
                                                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mb-3 group-hover:bg-amber-500 group-hover:text-black transition-colors border border-white/10">
                                                    <span className="font-black font-mono text-xs">0{day.id}</span>
                                                </div>
                                                <h3 className="font-black text-[10px] uppercase text-white mb-1 tracking-wider">{day.title}</h3>
                                                <p className="text-[9px] text-slate-500 uppercase tracking-widest">{day.theme}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* --- MOO POINTS PREVIEW --- */}
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="w-full max-w-4xl mt-12 mb-20 bg-gradient-to-r from-amber-600/10 via-black/80 to-amber-600/10 border border-amber-500/20 rounded-3xl p-8 relative overflow-hidden shadow-2xl"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Award className="w-40 h-40 text-amber-500" />
                                </div>

                                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-left">
                                    <div>
                                        <GraffitiText className="text-2xl text-amber-400 rotate-0 mb-1">GET PAID TO LEARN</GraffitiText>
                                        <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">Moo Points™ Integration</h3>
                                        <p className="text-slate-400 text-sm max-w-md">
                                            Every mission unlocks real value.
                                            <span className="block text-amber-400 font-bold mt-1">Don't just learn credit. Earn it.</span>
                                        </p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="bg-black/60 border border-amber-500/30 p-6 rounded-2xl text-center shadow-lg transform rotate-[-2deg]">
                                            <span className="block text-3xl font-black text-white">250</span>
                                            <span className="text-[8px] text-amber-500 uppercase font-black tracking-[0.2em]">Pts / Day</span>
                                        </div>
                                        <div className="bg-black/60 border border-amber-500/30 p-6 rounded-2xl text-center shadow-lg transform rotate-[2deg]">
                                            <span className="block text-3xl font-black text-white">VIP</span>
                                            <span className="text-[8px] text-amber-500 uppercase font-black tracking-[0.2em]">Status</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {step === 'spin' && (
                        <motion.div
                            key="spin-flow"
                            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="text-center w-full"
                        >
                            <CreditUAdmissionsMachine email={email} onResult={handleSpinResult} />
                        </motion.div>
                    )}

                    {step === 'result' && (
                        <AdmissionSummary
                            key="result-summary"
                            email={email}
                            name={name}
                            onComplete={handleSummaryComplete}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

