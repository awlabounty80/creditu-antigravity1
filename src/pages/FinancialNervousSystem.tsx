
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, Shield, Pause, Brain, Fingerprint, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { generateProtocolCalendar } from '@/lib/calendar-generator';

// --- Types ---

type OnboardingStep =
    | 'arrival'
    | 'reframe'
    | 'consent'
    | 'identity'
    | 'map'
    | 'activation'
    | 'close';

interface UserState {
    hasConsented: boolean;
    stressResponse: string;
    completedDayOne: boolean;
    firstName?: string;
    lastName?: string;
    ssn?: string;
}

// --- Particle System ---

class Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    canvasWidth: number;
    canvasHeight: number;

    constructor(w: number, h: number) {
        this.canvasWidth = w;
        this.canvasHeight = h;
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
    }

    update(speedMultiplier: number) {
        this.x += this.vx * speedMultiplier;
        this.y += this.vy * speedMultiplier;

        if (this.x < 0 || this.x > this.canvasWidth) this.vx *= -1;
        if (this.y < 0 || this.y > this.canvasHeight) this.vy *= -1;
    }

    draw(ctx: CanvasRenderingContext2D, color: string) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
    }
}

const NervousSystemBackground = ({ step }: { step: OnboardingStep }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animationFrameRef = useRef<number>();

    // Configuration based on step
    const getConfig = (s: OnboardingStep) => {
        switch (s) {
            case 'arrival': return { speed: 2, color: 'rgba(100, 116, 139, 0.5)', connectionDist: 150, nodeCount: 60 };
            case 'reframe': return { speed: 0.5, color: 'rgba(52, 211, 153, 0.4)', connectionDist: 180, nodeCount: 60 }; // Slower, calm green
            case 'consent': return { speed: 0.2, color: 'rgba(99, 102, 241, 0.4)', connectionDist: 200, nodeCount: 50 }; // Very slow, indigo
            case 'identity': return { speed: 1.5, color: 'rgba(59, 130, 246, 0.4)', connectionDist: 150, nodeCount: 60 }; // Blue, encrypted feel
            case 'map': return { speed: 0.1, color: 'rgba(255, 255, 255, 0.15)', connectionDist: 300, nodeCount: 40 }; // Structured grid-like
            case 'activation': return { speed: 8, color: 'rgba(244, 63, 94, 0.3)', connectionDist: 100, nodeCount: 80 }; // Excited/Active
            case 'close': return { speed: 0.1, color: 'rgba(16, 185, 129, 0.2)', connectionDist: 150, nodeCount: 40 }; // Peaceful
            default: return { speed: 1, color: 'rgba(255,255,255,0.2)', connectionDist: 150, nodeCount: 50 };
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            // Re-init particles on resize
            const { nodeCount } = getConfig(step);
            particlesRef.current = Array.from({ length: nodeCount }, () => new Particle(canvas.width, canvas.height));
        };
        window.addEventListener('resize', resize);
        resize();

        const animate = () => {
            const { speed, color, connectionDist } = getConfig(step);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and draw particles
            particlesRef.current.forEach(p => {
                p.update(speed);
                p.draw(ctx, color);
            });

            // Draw connections
            particlesRef.current.forEach((p1, i) => {
                particlesRef.current.slice(i + 1).forEach(p2 => {
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDist) {
                        ctx.beginPath();
                        ctx.strokeStyle = color;
                        ctx.lineWidth = 1 - dist / connectionDist;
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                });
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, [step]); // Re-run when step changes to update behavior

    return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-60" />;
};

// --- Components ---

const FadeIn = ({ children, delay = 0, className, duration = 0.8 }: { children: React.ReactNode, delay?: number, className?: string, duration?: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
        transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }} // Custom easing
        className={className}
    >
        {children}
    </motion.div>
);

// Hold Button Component
const HoldButton = ({ onClick, children, className, disabled }: { onClick: () => void, children: React.ReactNode, className?: string, disabled?: boolean }) => {
    const [progress, setProgress] = useState(0);
    const [isHolding, setIsHolding] = useState(false);
    const requestRef = useRef<number>();
    const startTimeRef = useRef<number>();
    const completedRef = useRef(false);

    const animate = (time: number) => {
        if (!startTimeRef.current) startTimeRef.current = time;
        const elapsed = time - startTimeRef.current;
        const duration = 1500; // 1.5s hold time

        const newProgress = Math.min((elapsed / duration) * 100, 100);
        setProgress(newProgress);

        if (newProgress < 100) {
            requestRef.current = requestAnimationFrame(animate);
        } else {
            if (!completedRef.current) {
                completedRef.current = true;
                onClick();
            }
        }
    };

    const startHold = () => {
        if (disabled) return;
        setIsHolding(true);
        completedRef.current = false;
        startTimeRef.current = undefined;
        requestRef.current = requestAnimationFrame(animate);
    };

    const endHold = () => {
        setIsHolding(false);
        setProgress(0);
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };

    return (
        <div className="relative group">
            {/* Progress Ring / Glow */}
            <div className={cn(
                "absolute -inset-1 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 transition-opacity duration-1000 blur-lg",
                isHolding ? "opacity-100" : "opacity-0"
            )} />

            <button
                onMouseDown={startHold}
                onMouseUp={endHold}
                onMouseLeave={endHold}
                onTouchStart={startHold}
                onTouchEnd={endHold}
                disabled={disabled}
                className={cn(
                    "relative overflow-hidden w-full select-none",
                    className
                )}
            >
                {/* Fill effect */}
                <div
                    className="absolute inset-0 bg-white/10 transition-all duration-75 ease-linear origin-left"
                    style={{ width: `${progress}%` }}
                />
                <span className="relative z-10 flex items-center justify-center gap-2">
                    {children}
                    {isHolding && progress < 100 && <span className="text-[10px] animate-pulse">HOLD...</span>}
                </span>
            </button>
        </div>
    );
};


export default function Onboarding() {
    const navigate = useNavigate();
    const [step, setStep] = useState<OnboardingStep>('arrival');
    const [userState, setUserState] = useState<UserState>({
        hasConsented: false,
        stressResponse: '',
        completedDayOne: false
    });

    // Mock persistence
    useEffect(() => {
        const saved = localStorage.getItem('credit_u_reset_state');
        if (saved) {
            const parsed = JSON.parse(saved);
            setUserState(parsed);
            if (parsed.completedDayOne) setStep('close');
            else if (parsed.hasConsented) setStep('map');
        }
    }, []);

    const saveState = (newState: Partial<UserState>) => {
        const updated = { ...userState, ...newState };
        setUserState(updated);
        localStorage.setItem('credit_u_reset_state', JSON.stringify(updated));
    };

    // --- Audio System ---
    const readText = (text: string[] | string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const content = Array.isArray(text) ? text.join('. ') : text;
            const utterance = new SpeechSynthesisUtterance(content);

            // Voice Selection Strategy: Prioritize softer/natural voices
            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(v =>
                v.name.includes("Google US English") ||
                v.name.includes("Samantha") ||
                v.name.includes("Zira") ||
                (!v.name.includes("David") && !v.name.includes("Mark")) // Avoid rougher defaults
            );

            if (preferredVoice) utterance.voice = preferredVoice;

            utterance.rate = 0.95; // Near natural speed, calm but not lethargic
            utterance.pitch = 1.05; // Slightly brighter/friendlier
            utterance.volume = 0.9;

            window.speechSynthesis.speak(utterance);
        }
    };

    // --- Components ---

    const ArrivalStep = () => (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-xl mx-auto px-6 z-10">
            {/* ... icon ... */}
            <FadeIn delay={0.2} duration={1.5}>
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full flex items-center justify-center mb-12 mx-auto ring-1 ring-white/10 shadow-[0_0_100px_-20px_rgba(99,102,241,0.3)] animate-float">
                    <Shield className="w-8 h-8 text-indigo-200/80" strokeWidth={1} />
                </div>
            </FadeIn>

            <FadeIn delay={0.6}>
                <h1 className="text-4xl md:text-6xl font-thin tracking-tighter text-white mb-8 drop-shadow-2xl">
                    You're in the <br /><span className="italic font-serif text-indigo-300">right place.</span>
                </h1>
            </FadeIn>

            <FadeIn delay={1.2}>
                <div className="space-y-6 text-lg md:text-xl text-slate-400 leading-relaxed font-light mix-blend-screen relative group">
                    <p>
                        "Today is not about money.<br />
                        It’s about how your <span className="text-white">body learned to respond</span> to money."
                    </p>
                    <button
                        onClick={() => readText("Today is not about money. It’s about how your body learned to respond to money.")}
                        className="absolute -right-12 top-0 opacity-0 group-hover:opacity-100 transition-opacity p-2 text-indigo-400 hover:text-white"
                        title="Listen"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-5 h-5"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                    </button>
                </div>
            </FadeIn>

            <FadeIn delay={2.0} className="mt-16">
                <Button
                    onClick={() => setStep('reframe')}
                    className="bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/30 px-10 py-8 text-lg font-light tracking-widest uppercase transition-all duration-700 backdrop-blur-md rounded-full shadow-2xl"
                >
                    Begin Reset
                </Button>
            </FadeIn>
        </div>
    );

    const ReframeStep = () => (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-3xl mx-auto px-6 z-10">
            <FadeIn delay={0}>
                {/* Breathing Animation added to Brain Icon */}
                <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping-slow opacity-20"></div>
                    <div className="w-20 h-20 bg-emerald-900/20 rounded-full flex items-center justify-center mb-10 mx-auto ring-1 ring-emerald-500/20 shadow-[0_0_60px_-10px_rgba(16,185,129,0.2)] animate-pulse">
                        <Brain className="w-8 h-8 text-emerald-400/80" strokeWidth={1} />
                    </div>
                </div>
                <div className="text-[10px] text-emerald-500/50 uppercase tracking-[0.3em] mb-8 animate-pulse">Breathe</div>
            </FadeIn>

            <FadeIn delay={0.3}>
                <h1 className="text-4xl md:text-5xl font-thin tracking-tight text-white mb-10">
                    Nothing is <span className="text-red-400/80 line-through decoration-1 decoration-red-400/50">wrong</span> with you.
                </h1>
            </FadeIn>

            <FadeIn delay={0.6}>
                <div className="relative group max-w-2xl mx-auto">
                    <p className="text-xl md:text-2xl text-slate-300 leading-relaxed font-thin mb-16">
                        "If finances have ever made you anxious, rushed, or frozen —
                        <span className="text-white block mt-4 font-normal drop-shadow-lg">that is not failure.</span>
                        <span className="block mt-4 text-emerald-200/60 font-serif italic text-3xl">That is a nervous system that learned under pressure."</span>
                    </p>
                    <button
                        onClick={() => readText("If finances have ever made you anxious, rushed, or frozen — that is not failure. That is a nervous system that learned under pressure.")}
                        className="absolute -right-12 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-2 text-emerald-400 hover:text-white"
                        title="Listen"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-5 h-5"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                    </button>
                </div>
            </FadeIn>

            <FadeIn delay={1.5}>
                <Button
                    onClick={() => setStep('consent')}
                    variant="ghost"
                    className="text-slate-500 hover:text-white hover:bg-white/5 px-8 py-4 text-sm tracking-[0.2em] font-light uppercase border-b border-transparent hover:border-white/20 rounded-none transition-all duration-500"
                >
                    I Understand
                </Button>
            </FadeIn>
        </div>
    );

    const ConsentStep = () => {
        const [checks, setChecks] = useState({ slow: false, honest: false, regulate: false });
        const allChecked = Object.values(checks).every(Boolean);

        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-lg mx-auto px-6 z-10">
                <FadeIn delay={0}>
                    <h1 className="text-3xl md:text-4xl font-thin text-center text-white mb-6 tracking-tight">
                        This works because <span className="font-normal text-indigo-300">you choose it.</span>
                    </h1>
                </FadeIn>

                <FadeIn delay={0.3}>
                    <p className="text-slate-400/80 text-center mb-16 text-lg font-light leading-relaxed">
                        This reset is not about fixing you.<br />
                        It's about slowing you down enough to hear yourself again.
                    </p>
                </FadeIn>

                <FadeIn delay={0.6} className="w-full space-y-4 mb-16">
                    {[
                        { id: 'slow', label: 'I agree to move slowly' },
                        { id: 'honest', label: 'I agree to be honest with myself' },
                        { id: 'regulate', label: 'I agree to prioritize regulation over urgency' }
                    ].map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 + (i * 0.2) }}
                            onClick={() => setChecks(c => ({ ...c, [item.id]: !c[item.id as keyof typeof checks] }))}
                            className={cn(
                                "flex items-center p-6 rounded-2xl border transition-all duration-500 cursor-pointer group backdrop-blur-sm",
                                checks[item.id as keyof typeof checks]
                                    ? "bg-indigo-900/20 border-indigo-500/30 shadow-[0_0_30px_-10px_rgba(79,70,229,0.1)]"
                                    : "bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/10"
                            )}
                        >
                            <div className={cn(
                                "w-6 h-6 rounded-full border flex items-center justify-center mr-6 transition-all duration-500",
                                checks[item.id as keyof typeof checks]
                                    ? "bg-indigo-500 border-indigo-500 scale-110"
                                    : "border-slate-700 group-hover:border-slate-500"
                            )}>
                                {checks[item.id as keyof typeof checks] && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <span className={cn(
                                "text-lg font-light transition-colors duration-500",
                                checks[item.id as keyof typeof checks] ? "text-white tracking-wide" : "text-slate-500"
                            )}>{item.label}</span>
                        </motion.div>
                    ))}
                </FadeIn>

                <FadeIn delay={1.4} className="w-full">
                    <Button
                        onClick={() => {
                            saveState({ hasConsented: true });
                            setStep('identity');
                        }}
                        disabled={!allChecked}
                        className={cn(
                            "w-full py-8 text-lg font-medium tracking-widest uppercase transition-all duration-700 rounded-xl shadow-2xl",
                            allChecked
                                ? "bg-indigo-600 text-white hover:bg-indigo-500 hover:scale-[1.02] shadow-[0_0_50px_-10px_rgba(79,70,229,0.4)]"
                                : "bg-white/5 text-slate-700 cursor-not-allowed border border-white/5"
                        )}
                    >
                        Commit to Protocol
                    </Button>
                </FadeIn>
            </div>
        );
    };

    const IdentityStep = () => {
        const [form, setForm] = useState({ firstName: '', lastName: '', ssn: '', email: '', phone: '' });
        // Default to Calendar Sync instead of Email/SMS which need Keys
        const [preferences, setPreferences] = useState({ calendarSync: true, emailReminders: false });
        const [isVerifying, setIsVerifying] = useState(false);

        const handleVerify = () => {
            setIsVerifying(true);

            // Trigger Sovereign Calendar Download if selected
            if (preferences.calendarSync) {
                generateProtocolCalendar();
            }

            // Simulate API check
            setTimeout(() => {
                saveState({ ...form, ...preferences });
                setStep('map');
            }, 2500);
        };

        const isValid = form.firstName.length > 1 &&
            form.lastName.length > 1 &&
            form.ssn.length === 4;

        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-md mx-auto px-6 z-10 w-full text-center">
                <FadeIn delay={0}>
                    <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-8 mx-auto ring-1 ring-blue-500/20 shadow-[0_0_50px_-10px_rgba(59,130,246,0.3)]">
                        <Shield className="w-6 h-6 text-blue-400/80" strokeWidth={1} />
                    </div>
                </FadeIn>

                <FadeIn delay={0.3}>
                    <h1 className="text-3xl font-thin text-white mb-4">
                        Secure Link <span className="font-normal text-blue-300">Initialized</span>
                    </h1>
                    <p className="text-slate-400 mb-10 font-light text-sm">
                        Verify your sovereign identity to begin.
                        <br />We recommend syncing the protocol to your local calendar.
                    </p>
                </FadeIn>

                <FadeIn delay={0.6} className="w-full space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            placeholder="First Name"
                            value={form.firstName}
                            onChange={e => setForm({ ...form, firstName: e.target.value })}
                            className="bg-white/5 border-white/10 text-center py-6 focus:border-blue-500/50 rounded-xl"
                        />
                        <Input
                            placeholder="Last Name"
                            value={form.lastName}
                            onChange={e => setForm({ ...form, lastName: e.target.value })}
                            className="bg-white/5 border-white/10 text-center py-6 focus:border-blue-500/50 rounded-xl"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            placeholder="Email (Optional)"
                            type="email"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            className="bg-white/5 border-white/10 text-center py-6 focus:border-blue-500/50 rounded-xl"
                        />
                        <Input
                            placeholder="Last 4 SSN"
                            maxLength={4}
                            type="password"
                            value={form.ssn}
                            onChange={e => setForm({ ...form, ssn: e.target.value.replace(/\D/g, '') })}
                            className="bg-white/5 border-white/10 text-center py-6 tracking-[2px] focus:border-blue-500/50 rounded-xl"
                        />
                    </div>

                    {/* Notification Preferences with Calendar Sync */}
                    <div className="pt-4 flex items-center justify-center gap-6">
                        <div
                            className="flex items-center gap-3 cursor-pointer group hover:opacity-100 transition-opacity"
                            onClick={() => setPreferences(p => ({ ...p, calendarSync: !p.calendarSync }))}
                        >
                            <div className={cn("w-4 h-4 rounded-full border border-slate-500 flex items-center justify-center transition-colors", preferences.calendarSync ? "bg-indigo-500 border-indigo-500" : "")}>
                                {preferences.calendarSync && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className={cn("text-xs uppercase tracking-wider", preferences.calendarSync ? "text-indigo-400 font-bold" : "text-slate-400")}>Sync 5-Day Protocol (.ICS)</span>
                        </div>
                    </div>
                </FadeIn>

                <FadeIn delay={0.8} className="mt-8 w-full">
                    <Button
                        onClick={handleVerify}
                        disabled={!isValid || isVerifying}
                        className={cn(
                            "w-full py-7 text-lg font-medium tracking-widest uppercase transition-all duration-500 rounded-xl overflow-hidden relative",
                            isValid && !isVerifying
                                ? "bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_40px_-5px_rgba(37,99,235,0.4)]"
                                : "bg-white/5 text-slate-600 border border-white/5"
                        )}
                    >
                        {isVerifying ? (
                            <span className="flex items-center gap-2 animate-pulse">
                                <Brain className="w-4 h-4" /> Syncing Protocol...
                            </span>
                        ) : "Confirm & Sync"}

                        {isVerifying && (
                            <motion.div
                                initial={{ x: '-100%' }}
                                animate={{ x: '100%' }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            />
                        )}
                    </Button>
                </FadeIn>
            </div>
        )
    };

    const MapStep = () => (
        <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-5xl mx-auto px-6 z-10 w-full">
            <FadeIn delay={0}>
                <h1 className="text-3xl font-thin text-center text-white mb-20 tracking-[0.2em] uppercase opacity-80">
                    Orientation
                </h1>
            </FadeIn>

            <div className="grid md:grid-cols-5 gap-8 w-full mb-24 relative">
                {/* Connecting Line */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
                    className="hidden md:block absolute top-[26px] left-0 w-full h-[1px] bg-gradient-to-r from-indigo-500 via-white/20 to-indigo-900 origin-left -z-10 opacity-30"
                />

                {['Reset', 'Interrupt', 'Identity', 'Rewire', 'Seal'].map((day, i) => (
                    <FadeIn key={day} delay={0.8 + (i * 0.15)} className="flex flex-col items-center group cursor-default">
                        <div className={cn(
                            "w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold border mb-8 bg-[#020412] relative z-10 transition-all duration-500",
                            i === 0
                                ? "border-indigo-500 text-white shadow-[0_0_30px_rgba(99,102,241,0.5)] scale-110"
                                : "border-white/10 text-slate-700 group-hover:border-white/30"
                        )}>
                            {i + 1}
                            {i === 0 && <div className="absolute inset-0 rounded-full border border-indigo-500/50 animate-ping-slow" />}
                        </div>
                        <div className={cn(
                            "text-sm font-medium tracking-[0.2em] uppercase transition-colors duration-500",
                            i === 0 ? "text-indigo-400" : "text-slate-600 group-hover:text-slate-400"
                        )}>{day}</div>
                    </FadeIn>
                ))}
            </div>

            <FadeIn delay={2.0} className="w-full max-w-md mx-auto">
                <Button
                    onClick={() => setStep('activation')}
                    className="w-full bg-white text-black hover:bg-slate-200 py-6 text-lg font-medium tracking-wide rounded-full shadow-2xl hover:scale-105 transition-transform duration-300"
                >
                    Start Day One
                </Button>
            </FadeIn>
        </div>
    );

    const ActivationStep = () => {
        const [response, setResponse] = useState('');

        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto px-6 z-10">
                <FadeIn delay={0}>
                    <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mb-12 mx-auto ring-1 ring-rose-500/20 shadow-[0_0_50px_-10px_rgba(244,63,94,0.2)]">
                        <Fingerprint className="w-8 h-8 text-rose-400/80" strokeWidth={1} />
                    </div>
                </FadeIn>

                <FadeIn delay={0.3}>
                    <div className="relative group max-w-2xl mx-auto">
                        <p className="text-2xl text-center text-slate-300 mb-16 font-thin leading-relaxed">
                            "Before we talk about money,<br />
                            we listen to how your body responds to it."
                        </p>
                        <button
                            onClick={() => readText("Before we talk about money, we listen to how your body responds to it.")}
                            className="absolute -right-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity p-2 text-rose-400 hover:text-white"
                            title="Listen"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-5 h-5"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                        </button>
                    </div>
                </FadeIn>

                <FadeIn delay={0.6} className="w-full">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-indigo-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <Input
                            value={response}
                            onChange={(e) => setResponse(e.target.value)}
                            placeholder="Tight, heavy, anxious, numb..."
                            className="relative bg-white/5 border-white/10 text-white text-center py-10 text-3xl font-serif focus:ring-0 focus:border-rose-500/50 transition-all placeholder:text-slate-700 placeholder:italic placeholder:font-sans rounded-xl backdrop-blur-xl"
                            autoFocus
                        />
                    </div>

                    <div className="h-24 mt-8 flex items-center justify-center">
                        <AnimatePresence>
                            {response.length > 0 && (
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center text-xl text-slate-400 font-light"
                                >
                                    "When money feels stressful, I usually feel <span className="text-rose-400 font-normal italic">{response}</span>."
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>
                </FadeIn>

                <FadeIn delay={0.8} className="mt-8">
                    <Button
                        onClick={() => {
                            saveState({ stressResponse: response });
                            setStep('close');
                        }}
                        disabled={response.length < 3}
                        className={cn(
                            "px-12 py-8 text-lg transition-all duration-500 rounded-full",
                            response.length > 2
                                ? "bg-rose-600 text-white hover:bg-rose-500 shadow-[0_0_40px_-5px_rgba(225,29,72,0.4)]"
                                : "bg-white/5 text-slate-600 opacity-50"
                        )}
                    >
                        Burn It Into Fuel
                    </Button>
                </FadeIn>
            </div>
        );
    };

    // Generic Day Script Component for Days 2-5
    const DayScript = ({ dayId, theme, script, prompt, onClose }: any) => {
        const [showActivation, setShowActivation] = useState(false);
        const [response, setResponse] = useState('');

        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto px-6 z-10 text-center">
                <FadeIn delay={0}>
                    <div className="text-xs font-bold tracking-[0.5em] text-indigo-400 mb-4 uppercase">Day 0{dayId} // {theme}</div>
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-8 mx-auto ring-1 ring-white/10">
                        <Brain className="w-8 h-8 text-white/50" strokeWidth={1} />
                    </div>
                </FadeIn>

                {!showActivation ? (
                    <>
                        <FadeIn delay={0.3} className="space-y-6 text-xl md:text-2xl text-slate-300 font-light leading-relaxed relative group">
                            {script && script.map((line: string, i: number) => (
                                <p key={i}>{line}</p>
                            ))}
                            <button
                                onClick={() => readText(script)}
                                className="absolute -right-12 top-0 opacity-0 group-hover:opacity-100 transition-opacity p-2 text-indigo-400 hover:text-white"
                                title="Listen"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-5 h-5"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                            </button>
                        </FadeIn>
                        <FadeIn delay={1.5}>
                            <Button onClick={() => setShowActivation(true)} className="mt-12 bg-white/10 hover:bg-white/20 text-white border border-white/10 px-8 py-6 rounded-full">
                                Begin Activation
                            </Button>
                        </FadeIn>
                    </>
                ) : (
                    <FadeIn delay={0.2} className="w-full">
                        <div className="mb-12 text-lg text-indigo-200 font-mono">{prompt?.instruction}</div>

                        {prompt?.input ? (
                            <div className="space-y-8">
                                <Input
                                    value={response}
                                    onChange={(e) => setResponse(e.target.value)}
                                    placeholder={prompt.placeholder || "Your reflection..."}
                                    className="bg-white/5 border-white/10 text-center py-8 text-xl"
                                />
                                <Button
                                    onClick={onClose}
                                    disabled={!response}
                                    className="px-10 py-6 bg-indigo-600 hover:bg-indigo-500 rounded-full"
                                >
                                    Complete Day
                                </Button>
                            </div>
                        ) : (
                            <Button onClick={onClose} className="px-10 py-6 bg-indigo-600 hover:bg-indigo-500 rounded-full">
                                I Have Done This
                            </Button>
                        )}
                    </FadeIn>
                )}
            </div>
        )
    };

    const MenuStep = () => {
        const days = [
            { id: 1, title: 'The Reset', theme: 'Safety', intro: ["Today is not about money.", "It’s about how your body learned to respond to money."], available: true },
            {
                id: 2,
                title: 'The Interruption',
                theme: 'Awareness',
                available: userState.completedDayOne,
                intro: ["Most financial mistakes are not about math. They are about speed.", "Today, we interrupt speed — without changing anything."],
                prompt: { instruction: "Before any non-essential spending today, pause for 10 seconds. Ask: Is this survival, comfort, or strategy?", input: true, placeholder: "The decision I paused on..." }
            },
            {
                id: 3,
                title: 'The Identity Shift',
                theme: 'Authority',
                available: false, // In real app, check day 2 completion
                intro: ["People with power do not rush decisions.", "Today, you practice not rushing."],
                prompt: { instruction: "Choose one financial decision and delay it for 24 hours.", input: true, placeholder: "Not rushing made me realize..." }
            },
            {
                id: 4,
                title: 'The Rewire',
                theme: 'Trust',
                available: false,
                intro: ["Money responds best to calm hands.", "Your nervous system must feel safe before strategy can work."],
                prompt: { instruction: "Repeat three times: I am safe while building.", input: true, placeholder: "After saying this, my body felt..." }
            },
            {
                id: 5,
                title: 'The Seal',
                theme: 'Readiness',
                available: false,
                intro: ["You are now regulated enough to move forward.", "Freshman Level opens now — not to teach you more, but to train how you move."],
                prompt: { instruction: "Declaration: I do not chase money. I build capacity.", input: false }
            }
        ];

        const [activeDay, setActiveDay] = useState<number | null>(null);

        if (activeDay && activeDay > 1) {
            const day = days.find(d => d.id === activeDay);
            if (!day) return null; // Should not happen if activeDay is valid
            return <DayScript
                dayId={day.id}
                theme={day.theme}
                script={day.intro}
                prompt={day.prompt}
                onClose={() => setActiveDay(null)}
            />
        }

        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-4xl mx-auto px-6 z-10 w-full">
                <FadeIn delay={0}>
                    <h1 className="text-3xl font-thin text-white mb-12 tracking-[0.2em] uppercase text-center">
                        Regulation Protocol
                    </h1>
                </FadeIn>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full">
                    {days.map((day, i) => (
                        <FadeIn key={day.id} delay={i * 0.1}>
                            <button
                                disabled={!day.available}
                                onClick={() => {
                                    if (day.id === 1) setStep('arrival');
                                    else setActiveDay(day.id);
                                }}
                                className={cn(
                                    "flex flex-col items-center p-6 rounded-2xl border transition-all duration-500 w-full h-full text-center group",
                                    day.available
                                        ? "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 cursor-pointer"
                                        : "bg-black/20 border-white/5 opacity-40 cursor-not-allowed"
                                )}
                            >
                                <div className={cn(
                                    "w-12 h-12 rounded-full border flex items-center justify-center mb-4 transition-all",
                                    day.available ? "border-indigo-500 text-indigo-400" : "border-slate-800 text-slate-700"
                                )}>
                                    {day.available ? (day.id === 1 && !userState.completedDayOne ? <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping" /> : day.id) : <Lock className="w-4 h-4" />}
                                </div>

                                <h3 className={cn("text-xs font-bold uppercase tracking-widest mb-2", day.available ? "text-white" : "text-slate-600")}>
                                    Day 0{day.id}
                                </h3>
                                <p className="text-[10px] text-slate-500 font-mono uppercase">
                                    {day.theme}
                                </p>
                            </button>
                        </FadeIn>
                    ))}
                </div>

                <FadeIn delay={0.8} className="mt-16 w-full max-w-md text-center space-y-4">
                    <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                        <p className="text-indigo-300 text-sm font-light">
                            "You are allowed to decide slowly."
                        </p>
                    </div>
                    {userState.completedDayOne && (
                        <Button
                            onClick={() => navigate('/signup')}
                            className="w-full bg-white text-black hover:bg-slate-200"
                        >
                            Enroll in Freshman Class
                        </Button>
                    )}
                </FadeIn>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#020412] text-white flex flex-col font-sans selection:bg-rose-500/30 overflow-hidden relative">

            {/* --- VISUAL FX LAYER --- */}

            {/* Dynamic Nervous System Background */}
            <NervousSystemBackground step={step} />

            {/* Vignette */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#020412]/50 to-[#020412] pointer-events-none z-[1]" />

            {/* Noise Grain */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-[2] pointer-events-none mix-blend-overlay"></div>


            {/* --- CONTENT LAYER --- */}

            {/* Header */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                className="absolute top-0 w-full p-8 flex justify-between items-center z-[20] mix-blend-difference"
            >
                <div className="text-xs font-bold tracking-[0.5em] text-white">CREDIT U <span className='opacity-50 ml-2 font-normal'>// RESET</span></div>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((s, i) => (
                        <div key={i} className={cn("w-1 h-1 rounded-full bg-white transition-all duration-500", step === 'activation' && s === 1 ? "opacity-100 scale-150" : "opacity-20")} />
                    ))}
                </div>
            </motion.div>

            {/* Main Stage */}
            <div className="flex-1 flex items-center justify-center relative z-[10] w-full">
                <AnimatePresence mode="wait">
                    {step === 'arrival' && <motion.div className="w-full" key="arrival" exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.1, transition: { duration: 0.5 } }}><ArrivalStep /></motion.div>}
                    {step === 'reframe' && <motion.div className="w-full" key="reframe" exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.1, transition: { duration: 0.5 } }}><ReframeStep /></motion.div>}
                    {step === 'consent' && <motion.div className="w-full" key="consent" exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.1, transition: { duration: 0.5 } }}><ConsentStep /></motion.div>}
                    {step === 'identity' && <motion.div className="w-full" key="identity" exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.1, transition: { duration: 0.5 } }}><IdentityStep /></motion.div>}
                    {step === 'map' && <motion.div className="w-full" key="map" exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.1, transition: { duration: 0.5 } }}><MapStep /></motion.div>}
                    {step === 'activation' && <motion.div className="w-full" key="activation" exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.1, transition: { duration: 0.5 } }}><ActivationStep /></motion.div>}
                    {step === 'close' && <motion.div className="w-full" key="close" exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.1, transition: { duration: 0.5 } }}><MenuStep /></motion.div>}
                </AnimatePresence>
            </div>

            {/* Footer Quote */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                className="absolute bottom-6 w-full text-center z-[20]"
            >
                <p className="text-[10px] text-white font-mono tracking-[0.2em] uppercase">
                    Regulation First. Strategy Second.
                </p>
            </motion.div>
        </div>
    );
}
