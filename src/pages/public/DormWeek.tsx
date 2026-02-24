
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Share2, Download, Shield, GraduationCap, ChevronRight, TrendingUp, UserCheck, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Toaster, toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useProfile } from '@/hooks/useProfile';
import { DORM_WEEK_CURRICULUM } from '@/data/dorm-week-curriculum';
import { FloatingCreditCards } from '@/components/orientation/FloatingCreditCards';

// --- Flags ---
// DORM_WEEK_YARD_V1_LOCKED_02_19_26

// --- Types ---
type StudentLevel = 'Freshman' | 'Sophomore' | 'Junior' | 'Senior' | 'Graduate';
type FinancialGoal = 'Raise my score' | 'Fix late payments' | 'Lower utilization' | 'Remove errors/collections' | 'Get credit cards' | 'Build business credit';

interface RegistrationData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dob?: string;
    city: string;
    state: string;
    level: StudentLevel;
    goal: FinancialGoal;
    consent: boolean;
}

interface StudentID {
    code: string;
    issueDate: string;
    status: string;
}

// --- Components ---

const FadeIn = ({ children, delay = 0, className }: { children: React.ReactNode, delay?: number, className?: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay, ease: "easeOut" }}
        className={className}
    >
        {children}
    </motion.div>
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
        className={cn("absolute w-64 h-40 rounded-2xl bg-gradient-to-br p-1 shadow-2xl backdrop-blur-sm z-0 opacity-80", className)}
    >
        <div className="w-full h-full rounded-xl bg-black/40 border border-white/20 p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
            <div className="w-12 h-8 bg-amber-200/20 rounded mb-4" />
            <div className="w-32 h-4 bg-white/10 rounded mb-2" />
            <div className="w-20 h-4 bg-white/10 rounded" />
            <div className="absolute bottom-4 right-4 text-white/50 text-xs font-mono">CREDIT U</div>
        </div>
    </motion.div>
)

const FloatingMoneySign = ({ className, delay = 0, size = "text-6xl" }: { className?: string, delay?: number, size?: string }) => (
    <motion.div
        animate={{
            y: [0, -30, 0],
            rotate: [0, 15, -15, 0],
            opacity: [0.1, 0.3, 0.1]
        }}
        transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delay
        }}
        className={cn("absolute font-black text-amber-500/30 pointer-events-none z-0 select-none", size, className)}
    >
        $
    </motion.div>
)

const GraffitiText = ({ children, className, color = "text-pink-500" }: { children: React.ReactNode, className?: string, color?: string }) => (
    <div className={cn("font-black italic transform -rotate-3 tracking-tighter drop-shadow-[5px_5px_0px_rgba(0,0,0,1)]", color, className)} style={{ fontFamily: 'impact, sans-serif' }}>
        {children}
    </div>
);

// --- Main Page Component ---

export default function DormWeek() {
    const { profile } = useProfile();
    const [isRegistered, setIsRegistered] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [formData, setFormData] = useState<RegistrationData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dob: '',
        city: '',
        state: '',
        level: 'Freshman',
        goal: 'Raise my score',
        consent: false
    });
    const [studentID, setStudentID] = useState<StudentID | null>(null);

    const formRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // --- Energy Lift Effect ---
    useEffect(() => {
        // Continuous confetti for party vibe
        const end = Date.now() + 1000;
        const colors = ['#fbbf24', '#ef4444', '#3b82f6'];

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
    }, []);

    const handleScrollToForm = () => {
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDownload = async () => {
        const element = document.getElementById('student-id-card');
        if (element) {
            try {
                toast.info("Generating ID Card...");
                // @ts-ignore
                const html2pdf = (await import('html2pdf.js')).default;
                const opt = {
                    margin: 0.2,
                    filename: `CreditU_ID_${studentID?.code}.pdf`,
                    image: { type: 'jpeg' as const, quality: 0.98 },
                    html2canvas: { scale: 2, useCORS: true },
                    jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' as const }
                };
                html2pdf().set(opt).from(element).save();
                toast.success("ID Secured");
            } catch (e) {
                console.error(e);
                toast.error("Download failed. Please screenshot.");
            }
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Credit U Dorm Week - 5-Day Reset',
                    text: 'I just initialized my 5-day credit reset protocol. Join me in the dorms.',
                    url: window.location.href,
                });
                toast.success('Shared successfully!');
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            // Fallback for browsers that don't support Web Share API
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard!');
        }
    };

    const generateID = () => {
        const date = new Date();
        const yymm = `${date.getFullYear().toString().substr(-2)}${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        const random = Math.floor(1000 + Math.random() * 9000);
        return `CU-DW-${yymm}-${random}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        setIsScanning(true);

        // Cinematic Scan Sequence
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsScanning(false);

        const newID = {
            code: generateID(),
            issueDate: new Date().toLocaleDateString(),
            status: 'ACTIVE_STUDENT'
        };

        setStudentID(newID);

        // Persistence Logic
        if (profile?.id) {
            try {
                await supabase.from('profiles').update({
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    academic_level: formData.level.toLowerCase() as any,
                    student_id_number: newID.code
                }).eq('id', profile.id);
            } catch (err) {
                console.error("Supabase sync failed:", err);
            }
        }

        const orientationState = {
            hasConsented: true,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            signatureName: `${formData.firstName} ${formData.lastName} `,
            studentLevel: formData.level,
            primaryMission: formData.goal,
            studentIdCode: newID.code,
            dormStartDate: Date.now(),
            completedDays: []
        };
        localStorage.setItem('credit_u_reset_state', JSON.stringify(orientationState));

        setIsRegistered(true);

        // Major Celebration
        const duration = 3000;
        const end = Date.now() + duration;
        const frame = () => {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#fbbf24', '#3b82f6', '#ffffff'] // Gold, Blue, White
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#fbbf24', '#3b82f6', '#ffffff']
            });
            if (Date.now() < end) requestAnimationFrame(frame);
        };
        frame();
    };

    const [microLineIndex, setMicroLineIndex] = useState(0);
    const microLines = [
        "Identity Reframe Complete.",
        "System Access Granted.",
        "Welcome to the 700 Club Path.",
        "Let's Build Wealth."
    ];

    useEffect(() => {
        if (isRegistered) {
            const interval = setInterval(() => {
                setMicroLineIndex(prev => (prev + 1) % microLines.length);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [isRegistered]);

    return (
        <div className="min-h-screen bg-[#020412] text-white font-sans overflow-x-hidden selection:bg-pink-500/30">
            {/* --- PHASE 1: CINEMATIC ARRIVAL (Background) --- */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <video
                    src="/assets/hero-background.mp4"
                    autoPlay
                    loop
                    muted
                    className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-screen"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#020412] via-[#020412]/80 to-[#020412]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
            </div>

            <Toaster position="top-center" theme="dark" />

            {/* Floating 3D Elements */}
            {!isRegistered && (
                <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                    <FloatingCreditCards />

                    <FloatingCreditCard className="top-[10%] left-[5%] from-blue-600 to-indigo-900 border-blue-400" delay={0} />
                    <FloatingCreditCard className="bottom-[20%] right-[5%] from-amber-500 to-orange-900 border-amber-400" delay={2} />
                    <FloatingCreditCard className="top-[40%] right-[15%] from-emerald-500 to-green-900 border-emerald-400 scale-75 blur-[1px]" delay={1} />

                    {/* Decorative Floating Money Signs */}
                    <FloatingMoneySign className="top-[20%] left-[20%]" delay={0} size="text-[15vw]" />
                    <FloatingMoneySign className="top-[60%] left-[40%]" delay={1.5} size="text-[10vw]" />
                    <FloatingMoneySign className="top-[30%] right-[30%]" delay={3} size="text-[20vw]" />
                    <FloatingMoneySign className="bottom-[10%] left-[10%]" delay={0.5} size="text-[8vw]" />
                </div>
            )}

            <main className="relative z-10 container mx-auto px-4 py-8 md:py-16 max-w-6xl">

                {!isRegistered ? (
                    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12 relative">

                        {/* --- PHASE 3: AUTHORITY LOCK (Micro-Signals) --- */}
                        <div className="absolute w-full max-w-4xl h-full pointer-events-none hidden md:block">
                            <AuthorityBadge icon={UserCheck} label="Identity Verified" color="border-emerald-500/50 text-emerald-400 bg-emerald-950/80 top-[15%] left-[10%]" delay={0.5} />
                            <AuthorityBadge icon={TrendingUp} label="Limit Increased" color="border-blue-500/50 text-blue-400 bg-blue-950/80 top-[20%] right-[15%]" delay={1.2} />
                            <AuthorityBadge icon={Shield} label="Dispute Won" color="border-amber-500/50 text-amber-400 bg-amber-950/80 bottom-[20%] left-[20%]" delay={2.0} />
                        </div>

                        {/* --- HERO SECTION --- */}
                        <div className="space-y-6 max-w-4xl mx-auto relative z-10">
                            <FadeIn delay={0.2}>
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-black uppercase tracking-[0.2em] text-blue-300 mb-6 shadow-[0_0_20px_rgba(59,130,246,0.2)] animate-pulse">
                                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                                    Reset Initiated // 2026
                                </div>
                            </FadeIn>

                            <FadeIn delay={0.4}>
                                <div className="relative">
                                    <GraffitiText className="absolute -top-12 -left-4 md:-left-12 rotate-[-12deg] text-3xl md:text-5xl text-pink-500 opacity-90 animate-pulse">
                                        WELCOME TO
                                    </GraffitiText>
                                    <h1 className="text-7xl md:text-9xl font-black uppercase italic tracking-tighter leading-[0.8] text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                                        DORM WEEK<span className="text-amber-500">.</span>
                                    </h1>
                                    <GraffitiText className="absolute -bottom-8 -right-4 md:-right-12 rotate-[6deg] text-3xl md:text-4xl text-blue-400 opacity-90">
                                        THE TAKEOVER
                                    </GraffitiText>
                                </div>
                            </FadeIn>

                            <FadeIn delay={0.6}>
                                <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed mt-8 bg-black/40 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                                    The mandatory <span className="text-white font-black underline decoration-amber-500">5-Day Financial Reset</span>. <br className="hidden md:block" />
                                    Stop trying to fix your credit. <span className="text-amber-400 font-bold">Rebuild your identity.</span>
                                </p>
                            </FadeIn>

                            <FadeIn delay={0.8} className="pt-8">
                                <Button
                                    onClick={handleScrollToForm}
                                    className="h-20 px-16 text-xl md:text-2xl font-black uppercase tracking-widest bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-full shadow-[0_0_50px_rgba(79,70,229,0.5)] hover:shadow-[0_0_80px_rgba(79,70,229,0.8)] hover:scale-110 transition-all duration-300 border-2 border-white/20 group relative overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center">
                                        ENTER THE YARD <ChevronRight className="w-8 h-8 ml-2 group-hover:translate-x-2 transition-transform" />
                                    </span>
                                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                                </Button>
                            </FadeIn>
                        </div>

                        {/* --- 5-DAY STRUCTURE PREVIEW --- */}
                        <FadeIn delay={1.0} className="w-full max-w-6xl mt-32">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-px bg-white/20 flex-1" />
                                <span className="text-slate-500 font-mono text-xs uppercase tracking-widest">The Curriculum</span>
                                <div className="h-px bg-white/20 flex-1" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                {DORM_WEEK_CURRICULUM.map((day, i) => (
                                    <div key={i} className="bg-black/60 backdrop-blur-md border border-white/10 p-6 rounded-2xl text-center hover:bg-white/10 hover:border-amber-500/50 hover:-translate-y-2 transition-all group relative overflow-hidden shadow-2xl">
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="relative z-10 flex flex-col items-center">
                                            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform group-hover:bg-amber-500 group-hover:text-black border border-white/10">
                                                <span className="font-black font-mono">0{day.id}</span>
                                            </div>
                                            <h3 className="font-black text-sm uppercase text-white mb-1 tracking-tight">{day.title}</h3>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-wider group-hover:text-amber-300">{day.theme}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>

                        {/* --- MOO POINTS PREVIEW --- */}
                        <FadeIn delay={1.2} className="w-full max-w-4xl mt-12 bg-gradient-to-r from-amber-600/20 via-black/80 to-amber-600/20 border border-amber-500/30 rounded-3xl p-8 relative overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.2)]">
                            {/* Floating coins effect (simulated) */}
                            <div className="absolute top-0 right-0 p-4 opacity-20 animate-pulse">
                                <DollarSign className="w-48 h-48 text-amber-500" />
                            </div>

                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-left">
                                <div>
                                    <GraffitiText className="text-3xl text-amber-400 rotate-0 mb-2">GET PAID TO LEARN</GraffitiText>
                                    <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-4">Moo Points™ Integration</h3>
                                    <p className="text-slate-300 text-lg max-w-md">
                                        Every mission you complete unlocks real value.
                                        <span className="block text-amber-400 font-bold mt-1">Don't just learn credit. Earn it.</span>
                                    </p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="bg-black/60 border border-amber-500/40 p-6 rounded-2xl text-center shadow-lg transform rotate-[-2deg]">
                                        <span className="block text-4xl font-black text-white">250</span>
                                        <span className="text-xs text-amber-500 uppercase font-black tracking-widest">Pts / Day</span>
                                    </div>
                                    <div className="bg-black/60 border border-amber-500/40 p-6 rounded-2xl text-center shadow-lg transform rotate-[2deg]">
                                        <span className="block text-4xl font-black text-white">VIP</span>
                                        <span className="text-xs text-amber-500 uppercase font-black tracking-widest">Status</span>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>

                        {/* --- REGISTRATION FORM --- */}
                        <div ref={formRef} className="w-full max-w-xl mx-auto mt-32 scroll-mt-24 relative z-20">
                            <div className="bg-[#0F1629]/90 backdrop-blur-xl border border-white/20 p-8 md:p-10 rounded-[2rem] shadow-[0_0_60px_rgba(0,0,0,0.5)] relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-pink-500 to-amber-500" />

                                <div className="text-center mb-8">
                                    <h2 className="text-3xl font-black uppercase text-white mb-2">Secure Your Seat</h2>
                                    <p className="text-sm text-slate-400 font-mono uppercase tracking-widest">Initialize 5-Day Reset Protocol</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6 text-left">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase text-slate-500 pl-1">First Name</Label>
                                            <Input
                                                required
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                className="bg-black/50 border-white/10 focus:border-pink-500 h-14 rounded-xl text-white font-bold"
                                                placeholder="First Name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase text-slate-500 pl-1">Last Name</Label>
                                            <Input
                                                required
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                className="bg-black/50 border-white/10 focus:border-pink-500 h-14 rounded-xl text-white font-bold"
                                                placeholder="Last Name"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase text-slate-500 pl-1">Email Address</Label>
                                        <Input
                                            required
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="bg-black/50 border-white/10 focus:border-pink-500 h-14 rounded-xl text-white font-bold"
                                            placeholder="you@email.com"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase text-slate-500 pl-1">Current Academic Status</Label>
                                        <select
                                            className="w-full bg-black/50 border border-white/10 focus:border-pink-500 h-14 rounded-xl text-white font-bold px-3 text-sm appearance-none"
                                            value={formData.level}
                                            onChange={(e) => setFormData({ ...formData, level: e.target.value as StudentLevel })}
                                        >
                                            <option value="Freshman">Freshman (Just Starting)</option>
                                            <option value="Sophomore">Sophomore (Building)</option>
                                            <option value="Junior">Junior (Optimizing)</option>
                                            <option value="Senior">Senior (Scaling)</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase text-slate-500 pl-1">Primary Mission Objective</Label>
                                        <select
                                            className="w-full bg-black/50 border border-white/10 focus:border-pink-500 h-14 rounded-xl text-white font-bold px-3 text-sm appearance-none"
                                            value={formData.goal}
                                            onChange={(e) => setFormData({ ...formData, goal: e.target.value as FinancialGoal })}
                                        >
                                            <option value="Raise my score">Raise my credit score</option>
                                            <option value="Fix late payments">Delete late payments</option>
                                            <option value="Lower utilization">Lower utilization</option>
                                            <option value="Remove errors/collections">Erase collections/errors</option>
                                            <option value="Get credit cards">Get high-limit funding</option>
                                            <option value="Build business credit">Build business credit</option>
                                        </select>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                                        <Checkbox
                                            id="consent"
                                            checked={formData.consent}
                                            onCheckedChange={(c) => setFormData({ ...formData, consent: c as boolean })}
                                            className="mt-1 data-[state=checked]:bg-pink-500 border-white/20"
                                        />
                                        <label htmlFor="consent" className="text-xs text-slate-300 leading-relaxed font-medium">
                                            I accept the <span className="text-white hover:underline cursor-pointer font-bold">Student Oath</span> and agree to execute the 5-day protocol with full integrity.
                                        </label>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isLoading || !formData.consent}
                                        className="w-full h-16 bg-white text-black hover:bg-slate-200 font-black uppercase tracking-[0.2em] rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all hover:scale-[1.02]"
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center gap-2">
                                                <span className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent"></span>
                                                PROCESSING...
                                            </span>
                                        ) : "Confirm Registration"}
                                    </Button>
                                </form>
                            </div>
                        </div>

                    </div>
                ) : (
                    // --- SUCCESS STATE: STUDENT ID ---
                    <div className="flex flex-col items-center justify-center min-h-screen py-12 animate-in fade-in zoom-in duration-500">
                        {isScanning ? (
                            <div className="text-center space-y-8 relative">
                                <div className="absolute inset-0 bg-blue-500/20 blur-[100px] animate-pulse" />
                                <div className="relative w-40 h-40 mx-auto">
                                    <div className="absolute inset-0 rounded-full border-4 border-blue-500/30 animate-ping"></div>
                                    <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 animate-spin"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Shield className="w-16 h-16 text-blue-400" />
                                    </div>
                                </div>
                                <GraffitiText className="text-4xl text-white">ACCESS GRANTED</GraffitiText>
                            </div>
                        ) : (
                            <div className="w-full max-w-4xl space-y-12 text-center relative z-10">
                                <div className="space-y-6">
                                    <GraffitiText className="text-6xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-pink-500 to-amber-500 rotate-[-2deg]">
                                        YOU ARE IN.
                                    </GraffitiText>

                                    <p className="text-xl text-slate-300 font-medium max-w-2xl mx-auto bg-black/40 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                                        {microLines[microLineIndex]}
                                    </p>
                                </div>

                                {/* ID CARD + ACTIONS */}
                                <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
                                    {/* ID Card Display */}
                                    <div
                                        id="student-id-card"
                                        className="relative w-full max-sm aspect-[1.586] bg-black rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/20 group hover:scale-[1.02] transition-transform duration-500 transform rotate-1"
                                    >
                                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>

                                        <div className="absolute top-4 left-4 w-12 h-12 bg-amber-500/20 rounded-full blur-xl" />

                                        <div className="relative z-10 p-6 h-full flex flex-col justify-between text-left">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-full bg-black border-2 border-white/20 shadow-lg flex items-center justify-center">
                                                        <GraduationCap className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-black text-white text-lg tracking-tight leading-none mb-1">CREDIT U™</h3>
                                                        <p className="text-[10px] font-mono text-blue-300 uppercase tracking-wider">LMS Student ID</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Academic Year</div>
                                                    <div className="text-sm font-black text-white bg-white/10 px-2 py-0.5 rounded">2026</div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <div className="text-[10px] uppercase text-slate-500 font-bold mb-1">Student Name</div>
                                                    <div className="text-xl font-black text-white uppercase tracking-wide truncate">{formData.firstName} {formData.lastName}</div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <div className="text-[10px] uppercase text-slate-500 font-bold mb-1">ID Number</div>
                                                        <div className="font-mono text-xs text-blue-300">{studentID?.code}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] uppercase text-slate-500 font-bold mb-1">Level</div>
                                                        <div className="font-mono text-xs text-amber-400 uppercase">{formData.level}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                                                <div className="w-16 h-8 bg-white/10 rounded overflow-hidden">
                                                    <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]"></div>
                                                </div>
                                                <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                    ACTIVE STATUS
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Grid */}
                                    <div className="flex flex-col gap-4 w-full max-w-xs">
                                        <Button
                                            onClick={() => navigate('/dashboard/orientation')}
                                            className="h-20 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase text-xl tracking-widest rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:scale-105 transition-all text-shadow border-2 border-emerald-300/50"
                                        >
                                            ENTER THE PORTAL
                                            <ChevronRight className="w-6 h-6 ml-2" />
                                        </Button>

                                        <div className="grid grid-cols-2 gap-3">
                                            <Button variant="outline" onClick={handleDownload} className="h-12 border-white/20 hover:bg-white/10 text-slate-300 text-xs font-bold uppercase tracking-wider">
                                                <Download className="w-4 h-4 mr-2" /> Save ID
                                            </Button>
                                            <Button variant="outline" onClick={handleShare} className="h-12 border-white/20 hover:bg-white/10 text-slate-300 text-xs font-bold uppercase tracking-wider">
                                                <Share2 className="w-4 h-4 mr-2" /> Share
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
