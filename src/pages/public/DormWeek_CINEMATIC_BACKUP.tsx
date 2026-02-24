
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ChevronRight, AlertTriangle, Brain, CreditCard, DollarSign, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Toaster, toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useProfile } from '@/hooks/useProfile';

// --- Types ---
type StudentLevel = 'Freshman' | 'Sophomore' | 'Junior' | 'Senior';
type FinancialGoal = 'Raise my score' | 'Fix late payments' | 'Lower utilization' | 'Remove errors/collections' | 'Get credit cards' | 'Build business credit';

interface RegistrationData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    level: StudentLevel;
    goal: FinancialGoal;
    consent: boolean;
}

// --- Sub-Components ---

const FadeIn = ({ children, delay = 0, className }: { children: React.ReactNode, delay?: number, className?: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay, ease: "easeOut" }}
        className={className}
    >
        {children}
    </motion.div>
);

// The 4-day curriculum exactly matching the photo
const YARD_CURRICULUM = [
    {
        id: 1,
        title: 'IDENTITY REFRAME',
        theme: 'Destroy the "broke" mindset. Build the CEO.',
        icon: Brain,
        color: 'from-purple-600 to-indigo-700',
        accent: 'border-purple-500/50',
    },
    {
        id: 2,
        title: 'CREDIT ARCHITECT',
        theme: 'Master the 5 credit bureaus. Own the algorithm.',
        icon: CreditCard,
        color: 'from-blue-600 to-cyan-700',
        accent: 'border-blue-500/50',
    },
    {
        id: 3,
        title: 'FUNDING SECURED',
        theme: 'High-limit approvals. The bag is secured.',
        icon: DollarSign,
        color: 'from-amber-600 to-orange-700',
        accent: 'border-amber-500/50',
        active: true,
    },
    {
        id: 4,
        title: 'WEALTH SYSTEMS',
        theme: 'Automate success. Build the empire.',
        icon: TrendingUp,
        color: 'from-emerald-600 to-teal-700',
        accent: 'border-emerald-500/50',
    },
];

// --- Main Page Component ---

export default function DormWeek() {
    const { profile } = useProfile();
    const navigate = useNavigate();
    const formRef = useRef<HTMLDivElement>(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<RegistrationData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        level: 'Freshman',
        goal: 'Raise my score',
        consent: false,
    });

    // Confetti burst on page load
    useEffect(() => {
        const end = Date.now() + 1200;
        const colors = ['#fbbf24', '#3b82f6', '#a855f7', '#ffffff'];
        (function frame() {
            confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors });
            confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors });
            if (Date.now() < end) requestAnimationFrame(frame);
        }());
    }, []);

    const handleScrollToForm = () => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const generateID = () => {
        const date = new Date();
        const yymm = `${date.getFullYear().toString().slice(-2)}${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        const random = Math.floor(1000 + Math.random() * 9000);
        return `CU-DW-${yymm}-${random}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await new Promise(r => setTimeout(r, 1400));

        const newID = generateID();
        const orientationState = {
            hasConsented: true,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            signatureName: `${formData.firstName} ${formData.lastName}`,
            studentLevel: formData.level,
            primaryMission: formData.goal,
            studentIdCode: newID,
            dormStartDate: Date.now(),
            completedDays: [],
        };
        localStorage.setItem('credit_u_reset_state', JSON.stringify(orientationState));

        if (profile?.id) {
            try {
                await supabase.from('profiles').update({
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    academic_level: formData.level.toLowerCase() as any,
                    student_id_number: newID,
                }).eq('id', profile.id);
            } catch (err) {
                console.error('Supabase sync failed:', err);
            }
        }

        setIsLoading(false);
        setIsRegistered(true);

        // Celebration burst
        const end = Date.now() + 3000;
        const frame = () => {
            confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#fbbf24', '#3b82f6', '#ffffff'] });
            confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#fbbf24', '#3b82f6', '#ffffff'] });
            if (Date.now() < end) requestAnimationFrame(frame);
        };
        frame();

        setTimeout(() => navigate('/dashboard/orientation'), 2200);
    };

    return (
        <div className="min-h-screen bg-[#050B1F] text-white font-sans overflow-x-hidden selection:bg-amber-400/30">
            <Toaster position="top-center" theme="dark" />

            {/* Ambient background glows */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] bg-indigo-900/30 rounded-full blur-[140px]" />
                <div className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] bg-amber-700/20 rounded-full blur-[120px]" />
                <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] bg-blue-900/20 rounded-full blur-[100px]" />
                {/* Grid overlay */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                    }}
                />
            </div>

            <main className="relative z-10">

                {/* ===================== HERO SECTION ===================== */}
                <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-20 relative">

                    {/* Badge */}
                    <FadeIn delay={0.1}>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-black uppercase tracking-[0.25em] mb-6">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                            AI APPROVED · POWERED BY CREDIT.COM
                        </div>
                    </FadeIn>

                    {/* Main heading */}
                    <FadeIn delay={0.25}>
                        <h1 className="font-black uppercase leading-none tracking-tighter">
                            <span
                                className="block text-sm md:text-base font-black uppercase tracking-[0.3em] text-blue-300 mb-2"
                                style={{ fontFamily: 'impact, sans-serif' }}
                            >
                                WELCOME TO
                            </span>
                            <span
                                className="block text-[5rem] md:text-[9rem] text-white drop-shadow-[0_6px_30px_rgba(100,130,255,0.4)]"
                                style={{ fontFamily: 'impact, sans-serif', letterSpacing: '-0.02em' }}
                            >
                                THE YARD
                            </span>
                        </h1>
                    </FadeIn>

                    {/* Subtitle pill */}
                    <FadeIn delay={0.4}>
                        <div className="mt-4 mb-10 inline-flex items-center gap-2 px-8 py-3 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-200 text-sm font-black uppercase tracking-[0.2em]">
                            THE OFFICIAL DORM WEEK™ HOMECOMING
                        </div>
                    </FadeIn>

                    {/* 4-Day Cards */}
                    <FadeIn delay={0.55}>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl w-full mb-10">
                            {YARD_CURRICULUM.map((day) => {
                                const Icon = day.icon;
                                return (
                                    <motion.div
                                        key={day.id}
                                        whileHover={{ y: -4, scale: 1.02 }}
                                        transition={{ type: 'spring', stiffness: 300 }}
                                        className={cn(
                                            "relative bg-[#0A1428]/80 border rounded-2xl p-5 text-left group cursor-default overflow-hidden backdrop-blur-sm",
                                            day.active ? "border-amber-500/70 shadow-[0_0_20px_rgba(245,158,11,0.2)]" : day.accent
                                        )}
                                    >
                                        <div className={`absolute inset-0 bg-gradient-to-br ${day.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`} />
                                        <div className="relative z-10">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                    DAY 0{day.id}
                                                </span>
                                                <Icon className={cn("w-5 h-5", day.active ? "text-amber-400" : "text-slate-500 group-hover:text-white transition-colors")} />
                                            </div>
                                            <h3 className="font-black text-sm md:text-base text-white uppercase leading-tight mb-2">
                                                {day.title}
                                            </h3>
                                            <p className="text-[11px] text-slate-400 leading-snug">
                                                {day.theme}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </FadeIn>

                    {/* Warning banner */}
                    <FadeIn delay={0.7}>
                        <div className="flex flex-col items-center gap-2 mb-8">
                            <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-widest">
                                <AlertTriangle className="w-4 h-4" />
                                WARNING: EXTREME LEVEL UP IMMINENT
                            </div>
                            <p className="text-slate-400 text-sm italic">
                                "We don't just study wealth. We become it."
                            </p>
                        </div>
                    </FadeIn>

                    {/* CTA Button */}
                    <FadeIn delay={0.85}>
                        <Button
                            onClick={handleScrollToForm}
                            className="h-16 px-14 text-lg font-black uppercase tracking-[0.2em] bg-amber-500 hover:bg-amber-400 text-black rounded-full shadow-[0_0_40px_rgba(245,158,11,0.45)] hover:shadow-[0_0_60px_rgba(245,158,11,0.65)] hover:scale-105 transition-all duration-300 border-2 border-amber-300/40 group"
                        >
                            ENTER THE EXPERIENCE
                            <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                        </Button>
                    </FadeIn>
                </section>

                {/* ===================== REGISTRATION FORM ===================== */}
                <section ref={formRef} className="min-h-screen flex items-center justify-center px-6 pb-24 scroll-mt-0">
                    {!isRegistered ? (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, ease: 'easeOut' }}
                            className="w-full max-w-md"
                        >
                            <div className="bg-[#0A1428]/90 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
                                {/* Top accent bar */}
                                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-amber-500" />

                                <div className="text-center mb-8">
                                    <h2 className="text-3xl font-black uppercase text-white mb-2">Secure Your Seat</h2>
                                    <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">Initialize 5-Day Reset Protocol</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5 text-left">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">First Name</Label>
                                            <Input
                                                required
                                                value={formData.firstName}
                                                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                                className="bg-black/50 border-white/10 focus:border-blue-500/60 h-12 rounded-xl text-white font-bold placeholder:text-slate-600"
                                                placeholder="First"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Last Name</Label>
                                            <Input
                                                required
                                                value={formData.lastName}
                                                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                                className="bg-black/50 border-white/10 focus:border-blue-500/60 h-12 rounded-xl text-white font-bold placeholder:text-slate-600"
                                                placeholder="Last"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Email Address</Label>
                                        <Input
                                            required
                                            type="email"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="bg-black/50 border-white/10 focus:border-blue-500/60 h-12 rounded-xl text-white font-bold placeholder:text-slate-600"
                                            placeholder="you@email.com"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Current Academic Status</Label>
                                        <select
                                            className="w-full bg-black/50 border border-white/10 focus:border-blue-500/60 h-12 rounded-xl text-white font-bold px-3 text-sm appearance-none"
                                            value={formData.level}
                                            onChange={e => setFormData({ ...formData, level: e.target.value as StudentLevel })}
                                        >
                                            <option value="Freshman">Freshman (Just Starting)</option>
                                            <option value="Sophomore">Sophomore (Building)</option>
                                            <option value="Junior">Junior (Optimizing)</option>
                                            <option value="Senior">Senior (Scaling)</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Primary Mission Objective</Label>
                                        <select
                                            className="w-full bg-black/50 border border-white/10 focus:border-blue-500/60 h-12 rounded-xl text-white font-bold px-3 text-sm appearance-none"
                                            value={formData.goal}
                                            onChange={e => setFormData({ ...formData, goal: e.target.value as FinancialGoal })}
                                        >
                                            <option value="Raise my score">Raise my credit score</option>
                                            <option value="Fix late payments">Delete late payments</option>
                                            <option value="Lower utilization">Lower utilization</option>
                                            <option value="Remove errors/collections">Erase collections / errors</option>
                                            <option value="Get credit cards">Get high-limit funding</option>
                                            <option value="Build business credit">Build business credit</option>
                                        </select>
                                    </div>

                                    <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
                                        <Checkbox
                                            id="consent-yard"
                                            checked={formData.consent}
                                            onCheckedChange={c => setFormData({ ...formData, consent: c as boolean })}
                                            className="mt-0.5 data-[state=checked]:bg-amber-500 border-white/20"
                                        />
                                        <label htmlFor="consent-yard" className="text-xs text-slate-300 leading-relaxed font-medium cursor-pointer">
                                            I accept the <span className="text-white font-bold">Student Oath</span> and commit to executing the 5-day protocol with full integrity.
                                        </label>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isLoading || !formData.consent}
                                        className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black uppercase tracking-[0.2em] rounded-xl shadow-[0_0_30px_rgba(79,70,229,0.4)] transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center gap-2">
                                                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                                PROCESSING...
                                            </span>
                                        ) : 'CONFIRM REGISTRATION'}
                                    </Button>
                                </form>
                            </div>
                        </motion.div>
                    ) : (
                        /* Success state — auto-redirects to orientation */
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-6"
                        >
                            <div className="w-24 h-24 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center">
                                <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                            </div>
                            <h2 className="text-4xl font-black uppercase text-white">YOU'RE IN.</h2>
                            <p className="text-slate-400 font-mono text-sm uppercase tracking-widest">
                                Initiating Dorm Week Protocol...
                            </p>
                            <div className="w-48 h-1.5 mx-auto bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: '0%' }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 2, ease: 'easeInOut' }}
                                    className="h-full bg-gradient-to-r from-blue-500 to-amber-500 rounded-full"
                                />
                            </div>
                        </motion.div>
                    )}
                </section>

            </main>
        </div>
    );
}
