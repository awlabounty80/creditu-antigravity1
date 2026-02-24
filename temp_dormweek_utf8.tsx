import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Share2, Download, Mail, Check, Shield, GraduationCap, ChevronRight, Star, CreditCard, Lock, Zap, CheckCircle2, Target, Flame, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Toaster, toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useProfile } from '@/hooks/useProfile';

// --- Types ---
type StudentLevel = 'Freshman' | 'Sophomore' | 'Junior' | 'Senior' | 'Graduate';
type FinancialGoal = 'Raise my score' | 'Fix late payments' | 'Lower utilization' | 'Remove errors/collections' | 'Get credit cards' | 'Build business credit';

interface RegistrationData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string; // Already existed
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

    const handleScrollToForm = () => {
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDownload = async () => {
        const element = document.getElementById('student-id-card');
        if (element) {
            try {
                toast.info("Generating PDF...");
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
                toast.success("PDF Downloaded!");
            } catch (e) {
                console.error(e);
                toast.error("PDF Failed. Please screenshot.");
            }
        }
    };

    const handleEmail = () => {
        const subject = "My Credit U Student ID";
        const body = `I just registered for Credit U Dorm Week!\n\nStudent ID: ${studentID?.code}\nLevel: ${formData.level}\nMission: ${formData.goal}`;
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        toast.info("Opening email client...");
    };

    const handleShare = async () => {
        const shareData = {
            title: 'Credit U Dorm Week',
            text: `I just registered for Credit U Dorm Week! Student ID: ${studentID?.code}`,
            url: window.location.href
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
                toast.success("Shared!");
            } catch (err) {
                console.error("Share failed", err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied to clipboard!");
            } catch (err) {
                toast.error("Copy failed.");
            }
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

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        setIsScanning(true);

        // Simulate Gate Scan
        await new Promise(resolve => setTimeout(resolve, 2500));
        setIsScanning(false);

        const newID = {
            code: generateID(),
            issueDate: new Date().toLocaleDateString(),
            status: 'REGISTERED'
        };

        setStudentID(newID);

        // Sync to Supabase Profile if logged in
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

        // Sync to Orientation LocalStorage
        const orientationState = {
            hasConsented: true,
            firstName: formData.firstName,
            lastName: formData.lastName,
            signatureName: `${formData.firstName} ${formData.lastName}`,
            studentLevel: formData.level,
            primaryMission: formData.goal,
            studentIdCode: newID.code,
            dormStartDate: Date.now(),
            completedDays: []
        };
        localStorage.setItem('credit_u_reset_state', JSON.stringify(orientationState));

        setIsRegistered(true);

        // Confetti Burst
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

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        frame();
    };

    const [microLineIndex, setMicroLineIndex] = useState(0);
    const microLines = [
        "Utilization about to behave.",
        "Late payments on notice.",
        "We don't begΓÇöWe build.",
        "Scoreboard season."
    ];

    useEffect(() => {
        if (isRegistered) {
            const interval = setInterval(() => {
                setMicroLineIndex(prev => (prev + 1) % microLines.length);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [isRegistered]);

    // --- Retro Moving Arrow Component ---
    const RetroArrow = () => (
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 md:w-32 md:h-32 drop-shadow-2xl transform rotate-12">
            <motion.g
                animate={{
                    y: [0, 15, 0],
                    x: [0, 5, 0],
                    rotate: [0, 5, 0]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                {/* 3D Depth/Shadow Layer */}
                <path d="M20 10 L80 10 L80 50 L110 50 L60 110 L10 50 L40 50 L40 10 Z" fill="#1e293b" transform="translate(8, 8)" />

                {/* Main Arrow Body - Yellow */}
                <path d="M20 10 L80 10 L80 50 L110 50 L60 110 L10 50 L40 50 L40 10 Z" fill="#FCD34D" stroke="#000" strokeWidth="3" />

                {/* Marquee Dots (Blue Lights) */}
                {/* Top Line */}
                <circle cx="25" cy="15" r="2.5" fill="#0EA5E9" stroke="black" strokeWidth="0.5" />
                <circle cx="35" cy="15" r="2.5" fill="#0EA5E9" stroke="black" strokeWidth="0.5" />
                <circle cx="45" cy="15" r="2.5" fill="#0EA5E9" stroke="black" strokeWidth="0.5" />
                <circle cx="55" cy="15" r="2.5" fill="#0EA5E9" stroke="black" strokeWidth="0.5" />
                <circle cx="65" cy="15" r="2.5" fill="#0EA5E9" stroke="black" strokeWidth="0.5" />
                <circle cx="75" cy="15" r="2.5" fill="#0EA5E9" stroke="black" strokeWidth="0.5" />

                {/* Right Side */}
                <circle cx="77" cy="25" r="2.5" fill="#0EA5E9" stroke="black" strokeWidth="0.5" />
                <circle cx="77" cy="35" r="2.5" fill="#0EA5E9" stroke="black" strokeWidth="0.5" />
                <circle cx="77" cy="45" r="2.5" fill="#0EA5E9" stroke="black" strokeWidth="0.5" />

                {/* Arrow Head Right */}
                <circle cx="85" cy="53" r="2.5" fill="#0EA5E9" stroke="black" strokeWidth="0.5" />
                <circle cx="95" cy="53" r="2.5" fill="#0EA5E9" stroke="black" strokeWidth="0.5" />
                <circle cx="105" cy="53" r="2.5" fill="#0EA5E9" stroke="black" strokeWidth="0.5" />

                {/* Point */}
                <circle cx="100" cy="65" r="2.5" fill="#0EA5E9" stroke="black" strokeWidth="0.5" />
                <circle cx="88" cy="80" r="2.5" fill="#0EA5E9" stroke="black" strokeWidth="0.5" />
                <circle cx="75" cy="95" r="2.5" fill="#0EA5E9" stroke="black" strokeWidth="0.5" />
                <circle cx="60" cy="107" r="2.5" fill="#0EA5E9" stroke="black" strokeWidth="0.5" />
                <circle cx="45" cy="95" r="2.5" fill="#0EA5E9" stroke="black" strokeWidth="0.5" />
                <circle cx="32" cy="80" r="2.5" fill="#0EA5E9" stroke="black" strokeWidth="0.5" />
                <circle cx="20" cy="65" r="2.5" fill="#0EA5E9" stroke="black" strokeWidth="0.5" />

                {/* Left and Bottom Stem */}
                <circle cx="15" cy="53" r="2.5" fill="#0EA5E9" stroke="black" strokeWidth="0.5" />
                <circle cx="25" cy="53" r="2.5" fill="#0EA5E9" stroke="black" strokeWidth="0.5" />
                <circle cx="35" cy="53" r="2.5" fill="#0EA5E9" stroke="black" strokeWidth="0.5" />

                <circle cx="43" cy="45" r="2.5" fill="#0EA5E9" stroke="black" strokeWidth="0.5" />
                <circle cx="43" cy="35" r="2.5" fill="#0EA5E9" stroke="black" strokeWidth="0.5" />
                <circle cx="43" cy="25" r="2.5" fill="#0EA5E9" stroke="black" strokeWidth="0.5" />
            </motion.g>
        </svg>
    );


    return (
        <div className="min-h-screen bg-[#020412] text-white font-sans overflow-x-hidden selection:bg-amber-500/30">
            {/* Background Texture */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-[#050a1f] via-[#020412] to-black opacity-90" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
                {/* Equalizer Pulse Effect */}
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-blue-900/10 to-transparent animate-pulse-slow" />
            </div>

            {/* --- HERO SECTION --- */}
            <section className="relative z-10 min-h-[90vh] flex flex-col items-center justify-center text-center px-6 pt-20">
                <FadeIn delay={0.2}>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-950/50 border border-blue-500/30 text-blue-300 text-xs font-mono tracking-widest uppercase mb-8 backdrop-blur-md">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                        DORM WEEK PROTOCOLΓäó
                    </div>
                </FadeIn>

                {/* Progress Tease Bar */}
                <FadeIn delay={0.3}>
                    <div className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 rounded-lg px-4 py-2 mx-auto w-fit mb-8">
                        <Lock className="w-3 h-3 text-slate-400" />
                        <span className="text-xs font-mono text-slate-300 uppercase tracking-widest">
                            Dorm Week Progress: <span className="text-red-400">Not Started</span>
                        </span>
                        <div className="h-1.5 w-16 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full w-0 bg-amber-500" />
                        </div>
                    </div>
                </FadeIn>

                <FadeIn delay={0.4}>
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase leading-[0.9] mb-6 drop-shadow-2xl">
                        Your 5-Day <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-600 drop-shadow-[0_0_30px_rgba(245,158,11,0.4)]">
                            Financial Reset
                        </span> <br />
                        Begins Now
                    </h1>
                </FadeIn>

                <FadeIn delay={0.6}>
                    <p className="text-lg md:text-2xl text-blue-100/80 font-light tracking-wide max-w-2xl mx-auto mb-10">
                        This is not orientation. <br />
                        <span className="text-white font-bold">This is where your credit profile gets rebuilt with precision.</span>
                    </p>
                </FadeIn>

                <FadeIn delay={0.8}>
                    <div className="relative inline-block group">
                        {/* Animated Arrow - Positioned Left */}
                        <div className="absolute -left-20 md:-left-36 -top-10 md:-top-12 z-20 pointer-events-none opacity-90 hidden md:block">
                            <RetroArrow />
                        </div>

                        <Button
                            onClick={handleScrollToForm}
                            className="relative bg-white text-blue-950 px-10 py-8 text-xl font-black tracking-widest uppercase rounded-full hover:bg-amber-400 hover:text-black hover:scale-105 transition-all duration-300 shadow-[0_0_40px_-5px_rgba(255,255,255,0.3)] z-10"
                        >
                            START THE 5-DAY RESET
                            <ChevronRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                    <p className="mt-4 text-[10px] uppercase tracking-widest text-white/30">
                        Average completion time: 15ΓÇô20 minutes per day
                    </p>
                </FadeIn>

                {/* ID Teaser */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                    animate={{ opacity: 0.9, scale: 0.9, rotate: -5 }}
                    transition={{ duration: 1, delay: 1 }}
                    className="absolute -right-20 bottom-10 w-[600px] h-[400px] bg-gradient-to-br from-blue-900 via-[#0a0f29] to-black rounded-3xl border border-white/10 pointer-events-none hidden lg:block z-0 overflow-hidden shadow-2xl"
                >
                    <div className="absolute inset-0 bg-white/5 animate-pulse" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />

                    <div className="absolute inset-0 flex items-center justify-center p-10">
                        <h3 className="text-4xl md:text-5xl font-black text-white/20 uppercase tracking-tight text-center leading-tight">
                            At Credit U,<br />
                            <span className="text-white/40">It Starts With You</span>
                        </h3>
                    </div>
                </motion.div>
            </section>

            {/* ≡ƒ¢í∩╕Å THE WHY & WHAT SECTIONS */}
            <section className="relative z-10 bg-[#0a0f29]/80 backdrop-blur-md border-y border-white/5 py-24">
                <div className="container mx-auto px-6 max-w-5xl space-y-24">

                    {/* WHY */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-black uppercase tracking-tight mb-6">Why This Reset Matters</h2>
                            <div className="space-y-6 text-slate-400 leading-relaxed">
                                <p>You cannot build wealth on an unstable credit foundation. <strong className="text-white">Dorm WeekΓäó is your structured financial reset.</strong></p>
                                <p>It is designed to stabilize your profile, sharpen your strategy, and position you for higher approvals.</p>
                            </div>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
                            <ul className="space-y-4">
                                {["Speaks to pain", "Creates authority", "Removes fluff", "Feels necessary"].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-lg font-medium"><CheckCircle2 className="w-5 h-5 text-emerald-500" />{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* WHAT (5 Days) */}
                    <div>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-black uppercase tracking-tight mb-4">What YouΓÇÖre About to Execute</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            {[
                                { day: "01", title: "System Reality", icon: Target },
                                { day: "02", title: "Strategic Pos.", icon: Lock },
                                { day: "03", title: "Optimization", icon: Flame },
                                { day: "04", title: "Approval Ready", icon: CheckCircle2 },
                                { day: "05", title: "Graduation", icon: Zap },
                            ].map((item, i) => (
                                <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center hover:bg-white/10 transition">
                                    <item.icon className="w-8 h-8 text-blue-400 mb-4 mx-auto" />
                                    <h3 className="font-bold text-xs uppercase text-white">{item.title}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>


            {/* --- REGISTRATION / REVEAL SECTION --- */}
            <section ref={formRef} className="relative z-20 container mx-auto px-6 py-24 min-h-screen flex items-center justify-center">

                <AnimatePresence mode="wait">
                    {isScanning ? (
                        /* --- SCANNING GATE ANIMATION --- */
                        <motion.div
                            key="scanning"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 1.5, filter: "blur(20px)" }}
                            className="flex flex-col items-center justify-center text-center"
                        >
                            <div className="relative w-64 h-64 mb-8">
                                {/* Rotating Rings */}
                                <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full border-t-blue-500 animate-spin" />
                                <div className="absolute inset-4 border-4 border-amber-500/30 rounded-full border-b-amber-500 animate-spin-slow-reverse" />

                                {/* Biometric Print */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Shield className="w-32 h-32 text-blue-400/50 animate-pulse" />
                                </div>

                                {/* Scanning Line */}
                                <motion.div
                                    animate={{ top: ['0%', '100%', '0%'] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="absolute left-0 right-0 h-1 bg-amber-400/80 shadow-[0_0_20px_#fbbf24] z-10"
                                />
                            </div>
                            <h2 className="text-2xl font-mono text-blue-400 tracking-widest uppercase animate-pulse">
                                Initializing Protocol...
                            </h2>
                            <p className="text-xs text-blue-500/50 mt-2 font-mono">ACCESSING CREDIT U DATABASE</p>
                        </motion.div>
                    ) : !isRegistered ? (
                        /* --- REGISTRATION FORM (ORIGINAL RESTORED) --- */
                        /* --- REGISTRATION FORM (ENHANCED CREDIT U TERMINAL) --- */
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
                            transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                            className="w-full max-w-3xl relative"
                        >
                            {/* Glowing Backplate */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-amber-500 to-blue-600 opacity-30 blur-xl animate-pulse" />

                            <div className="relative bg-[#050a1f]/95 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl overflow-hidden group">

                                {/* Tech Accents */}
                                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-tl-[2rem] pointer-events-none" />
                                <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-amber-500/20 to-transparent rounded-br-[2rem] pointer-events-none" />
                                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                                <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

                                {/* Header Section */}
                                <div className="text-center mb-10 relative z-10">
                                    <div className="inline-flex items-center justify-center p-3 mb-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                                        <Shield className="w-8 h-8 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-2">
                                        Initialize <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Student Profile</span>
                                    </h2>
                                    <p className="text-slate-400 max-w-lg mx-auto text-sm md:text-base font-medium">
                                        Secure your spot in the protocol. <span className="text-amber-400/90">Zero cost. High leverage.</span>
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2 group/input">
                                            <Label htmlFor="firstName" className="text-[10px] font-black uppercase text-blue-400/80 tracking-widest pl-1 group-focus-within/input:text-amber-400 transition-colors">First Name</Label>
                                            <div className="relative">
                                                <Input
                                                    id="firstName"
                                                    required
                                                    value={formData.firstName}
                                                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                                    className="bg-black/50 border-white/5 focus:border-amber-400/50 text-white h-14 pl-4 rounded-xl transition-all shadow-inner focus:shadow-[0_0_20px_rgba(251,191,36,0.1)] placeholder:text-white/20"
                                                    placeholder="ENTER FIRST NAME"
                                                />
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-500/30 group-focus-within/input:bg-amber-400 transition-colors" />
                                            </div>
                                        </div>
                                        <div className="space-y-2 group/input">
                                            <Label htmlFor="lastName" className="text-[10px] font-black uppercase text-blue-400/80 tracking-widest pl-1 group-focus-within/input:text-amber-400 transition-colors">Last Name</Label>
                                            <div className="relative">
                                                <Input
                                                    id="lastName"
                                                    required
                                                    value={formData.lastName}
                                                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                                    className="bg-black/50 border-white/5 focus:border-amber-400/50 text-white h-14 pl-4 rounded-xl transition-all shadow-inner focus:shadow-[0_0_20px_rgba(251,191,36,0.1)] placeholder:text-white/20"
                                                    placeholder="ENTER LAST NAME"
                                                />
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-500/30 group-focus-within/input:bg-amber-400 transition-colors" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 group/input">
                                        <Label htmlFor="email" className="text-[10px] font-black uppercase text-blue-400/80 tracking-widest pl-1 group-focus-within/input:text-amber-400 transition-colors">Email Address</Label>
                                        <div className="relative">
                                            <Input
                                                id="email"
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                className="bg-black/50 border-white/5 focus:border-amber-400/50 text-white h-14 pl-4 rounded-xl transition-all shadow-inner focus:shadow-[0_0_20px_rgba(251,191,36,0.1)] placeholder:text-white/20"
                                                placeholder="YOUR@EMAIL.COM"
                                            />
                                            <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within/input:text-amber-400 transition-colors" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2 group/input">
                                            <Label htmlFor="phone" className="text-[10px] font-black uppercase text-blue-400/80 tracking-widest pl-1 group-focus-within/input:text-amber-400 transition-colors">Cell Phone (Optional)</Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                className="bg-black/50 border-white/5 focus:border-amber-400/50 text-white h-14 pl-4 rounded-xl transition-all shadow-inner focus:shadow-[0_0_20px_rgba(251,191,36,0.1)] placeholder:text-white/20"
                                                placeholder="(555) 000-0000"
                                            />
                                        </div>
                                        <div className="space-y-2 group/input">
                                            <Label htmlFor="dob" className="text-[10px] font-black uppercase text-blue-400/80 tracking-widest pl-1 group-focus-within/input:text-amber-400 transition-colors">Date of Birth (Optional)</Label>
                                            <Input
                                                id="dob"
                                                type="date"
                                                value={formData.dob || ''}
                                                onChange={e => setFormData({ ...formData, dob: e.target.value })}
                                                className="bg-black/50 border-white/5 focus:border-amber-400/50 text-white h-14 pl-4 rounded-xl transition-all shadow-inner focus:shadow-[0_0_20px_rgba(251,191,36,0.1)]"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2 group/input">
                                            <Label htmlFor="city" className="text-[10px] font-black uppercase text-blue-400/80 tracking-widest pl-1 group-focus-within/input:text-amber-400 transition-colors">City</Label>
                                            <Input
                                                id="city"
                                                required
                                                value={formData.city}
                                                onChange={e => setFormData({ ...formData, city: e.target.value })}
                                                className="bg-black/50 border-white/5 focus:border-amber-400/50 text-white h-14 pl-4 rounded-xl transition-all shadow-inner focus:shadow-[0_0_20px_rgba(251,191,36,0.1)] placeholder:text-white/20"
                                                placeholder="CITY"
                                            />
                                        </div>
                                        <div className="space-y-2 group/input">
                                            <Label htmlFor="state" className="text-[10px] font-black uppercase text-blue-400/80 tracking-widest pl-1 group-focus-within/input:text-amber-400 transition-colors">State</Label>
                                            <Input
                                                id="state"
                                                required
                                                value={formData.state}
                                                onChange={e => setFormData({ ...formData, state: e.target.value })}
                                                className="bg-black/50 border-white/5 focus:border-amber-400/50 text-white h-14 pl-4 rounded-xl transition-all shadow-inner focus:shadow-[0_0_20px_rgba(251,191,36,0.1)] placeholder:text-white/20"
                                                placeholder="STATE"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2 group/input">
                                            <Label className="text-[10px] font-black uppercase text-blue-400/80 tracking-widest pl-1 group-focus-within/input:text-amber-400 transition-colors">Student Level</Label>
                                            <div className="relative">
                                                <select
                                                    className="flex h-14 w-full items-center justify-between rounded-xl border border-white/5 bg-black/50 px-4 py-2 text-sm text-white focus:border-amber-400/50 focus:outline-none focus:ring-0 focus:shadow-[0_0_20px_rgba(251,191,36,0.1)] appearance-none shadow-inner"
                                                    value={formData.level}
                                                    onChange={(e) => setFormData({ ...formData, level: e.target.value as StudentLevel })}
                                                >
                                                    {['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'].map(level => (
                                                        <option key={level} value={level} className="bg-[#0a0f29] text-white">
                                                            {level}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 rotate-90 pointer-events-none" />
                                            </div>
                                        </div>
                                        <div className="space-y-2 group/input">
                                            <Label className="text-[10px] font-black uppercase text-blue-400/80 tracking-widest pl-1 group-focus-within/input:text-amber-400 transition-colors">Primary Goal</Label>
                                            <div className="relative">
                                                <select
                                                    className="flex h-14 w-full items-center justify-between rounded-xl border border-white/5 bg-black/50 px-4 py-2 text-sm text-white focus:border-amber-400/50 focus:outline-none focus:ring-0 focus:shadow-[0_0_20px_rgba(251,191,36,0.1)] appearance-none shadow-inner"
                                                    value={formData.goal}
                                                    onChange={(e) => setFormData({ ...formData, goal: e.target.value as FinancialGoal })}
                                                >
                                                    {['Raise my score', 'Fix late payments', 'Lower utilization', 'Remove errors/collections', 'Get credit cards', 'Build business credit'].map(g => (
                                                        <option key={g} value={g} className="bg-[#0a0f29] text-white">
                                                            {g}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 rotate-90 pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-950/20 border border-blue-500/10 rounded-xl p-4 flex items-start space-x-3">
                                        <Checkbox
                                            id="consent"
                                            checked={formData.consent}
                                            onCheckedChange={(c: boolean) => setFormData({ ...formData, consent: c })}
                                            className="border-blue-400/30 data-[state=checked]:bg-amber-500 data-[state=checked]:text-black mt-1"
                                        />
                                        <label htmlFor="consent" className="text-xs text-blue-200/60 leading-relaxed cursor-pointer select-none">
                                            I confirm I am ready to begin the financial reset sequence and authorize generation of my student credentials.
                                        </label>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isLoading || !formData.consent}
                                        className="relative w-full group overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 hover:from-amber-500 hover:via-amber-400 hover:to-amber-500 text-white hover:text-black h-16 text-lg font-black tracking-[0.2em] uppercase rounded-xl transition-all duration-300 disabled:opacity-50 disabled:grayscale shadow-[0_10px_40px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_0_50px_-5px_rgba(245,158,11,0.6)]"
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-3">
                                            {isLoading ? (
                                                <>
                                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    Generate ID & Begin
                                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </span>
                                        {/* Shine Effect */}
                                        <div className="absolute inset-0 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                                    </Button>
                                </form>
                            </div>
                        </motion.div>
                    ) : (
                        /* --- ID REVEAL STAGE --- */
                        <motion.div
                            key="id-reveal"
                            className="w-full flex flex-col items-center"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center mb-12"
                            >
                                <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                                    Welcome To The Dorm, Student.
                                </h2>
                                <p className="text-blue-200 font-mono tracking-widest uppercase">Protocol Activated ΓÇó Reset Mode: ON</p>
                            </motion.div>

                            {/* --- ID CARD --- */}
                            <motion.div
                                id="student-id-card"
                                initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
                                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                                transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                                className="relative w-full max-w-[600px] aspect-[1.586/1] rounded-3xl overflow-hidden shadow-[0_0_80px_-20px_rgba(59,130,246,0.5)] group perspective-1000 mb-12"
                            >
                                {/* Card Background */}
                                <div className="absolute inset-0 bg-[#050a1f] border-[6px] border-white/10 rounded-3xl z-0">
                                    {/* Mesh Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-[#020412] to-amber-900/20" />
                                    {/* Noise */}
                                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                                    {/* Crest Watermark */}
                                    <div className="absolute -right-20 -bottom-20 w-80 h-80 opacity-10 blur-sm pointer-events-none">
                                        <Shield className="w-full h-full text-white" />
                                    </div>
                                </div>

                                {/* Holographic Strip */}
                                <motion.div
                                    initial={{ x: '-100%' }}
                                    animate={{ x: '200%' }}
                                    transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
                                    className="absolute top-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 z-20 pointer-events-none"
                                />

                                {/* Card Content */}
                                <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                                    {/* Header */}
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-gradient-to-br from-amber-300 to-amber-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20">
                                                <GraduationCap className="w-8 h-8 text-black" />
                                            </div>
                                            <div>
                                                <h3 className="font-heading font-black text-2xl text-white tracking-widest">CREDIT U</h3>
                                                <p className="font-mono text-[10px] text-amber-400 uppercase tracking-[0.2em]">Dorm WeekΓäó Student ID</p>
                                            </div>
                                        </div>
                                        {/* Status Chip */}
                                        <div className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 px-3 py-1 rounded text-[10px] font-bold tracking-widest uppercase backdrop-blur-md">
                                            Active
                                        </div>
                                    </div>

                                    {/* Student Info */}
                                    <div className="grid grid-cols-2 gap-8 mt-4">
                                        <div>
                                            <p className="text-[10px] uppercase text-slate-500 tracking-widest mb-1">Student Name</p>
                                            <p className="text-xl font-bold text-white uppercase truncate">{formData.firstName} {formData.lastName}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase text-slate-500 tracking-widest mb-1">Student Level</p>
                                            <p className="text-xl font-bold text-white uppercase">{formData.level}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-[10px] uppercase text-slate-500 tracking-widest mb-1">Primary Mission</p>
                                            <p className="text-lg font-medium text-blue-200 uppercase mb-2">{formData.goal}</p>

                                            {/* Micro-Line Rotator */}
                                            <div className="inline-block bg-white/10 rounded-full px-3 py-1">
                                                <p className="font-mono text-[10px] text-amber-300 tracking-wider">
                                                    {microLines[microLineIndex]}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex justify-between items-end border-t border-white/10 pt-4 mt-auto">
                                        <div>
                                            <p className="text-[10px] uppercase text-slate-500 tracking-widest mb-0.5">Student ID No.</p>
                                            <p className="font-mono text-lg text-amber-400 tracking-widest">{studentID?.code}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] uppercase text-slate-500 tracking-widest mb-0.5">Issued</p>
                                            <p className="font-mono text-sm text-white">{studentID?.issueDate}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* STAMP ANIMATION */}
                                <motion.div
                                    initial={{ scale: 2, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.3, delay: 1.2, type: "spring" }}
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 border-[4px] md:border-[6px] border-emerald-500 text-emerald-500 font-black text-3xl md:text-5xl p-2 md:p-4 rounded-xl -rotate-12 opacity-80 mix-blend-plus-lighter pointer-events-none whitespace-nowrap"
                                >
                                    {studentID?.status}
                                </motion.div>
                            </motion.div>

                            {/* Actions */}
                            <div className="flex flex-col gap-6 w-full max-w-md mx-auto items-center">
                                <div className="flex justify-center gap-4">
                                    <Button onClick={handleDownload} variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10 gap-2">
                                        <Download className="w-4 h-4" /> Save
                                    </Button>
                                    <Button onClick={handleEmail} className="bg-amber-500 hover:bg-amber-600 text-black font-bold gap-2 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                                        <Mail className="w-4 h-4" /> Email
                                    </Button>
                                    <Button onClick={handleShare} variant="ghost" className="text-blue-300 hover:text-white gap-2">
                                        <Share2 className="w-4 h-4" /> Share
                                    </Button>
                                </div>

                                <Button
                                    onClick={() => navigate('/dashboard/orientation')}
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black text-xl py-8 rounded-xl uppercase tracking-widest shadow-[0_0_40px_rgba(37,99,235,0.5)] animate-pulse"
                                >
                                    ENTER DORM WEEK <ChevronRight className="ml-2 w-6 h-6" />
                                </Button>
                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>

            </section>

            {/* --- INJECTED PROTOCOL CONTENT (THE "WHY" / "WHAT" / "HOW") --- */}
            {/* This section replaces the old "WHAT'S INCLUDED" section with the new Protocol copy, per user request to use the info */}
            {!isRegistered && !isScanning && (
                <section className="container mx-auto px-6 pb-24 max-w-5xl">
                    <div className="bg-[#0a0f29]/50 border border-white/5 rounded-3xl p-8 md:p-12 backdrop-blur-sm">

                        <div className="grid md:grid-cols-2 gap-12 mb-16">
                            <div>
                                <h3 className="text-2xl font-black uppercase tracking-tight mb-4 text-white">Why This Reset Matters</h3>
                                <p className="text-slate-400 leading-relaxed mb-4">
                                    Dorm WeekΓäó is your structured financial reset. It is designed to stabilize your profile, sharpen your strategy, and position you for higher approvals.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-2xl font-black uppercase tracking-tight mb-4 text-white">What You'll Execute</h3>
                                <ul className="space-y-2 text-sm text-slate-300 font-mono uppercase tracking-wide">
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-amber-500 rounded-full" /> 01 ΓÇö System Reality Check</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-amber-500 rounded-full" /> 02 ΓÇö Strategic Positioning</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-amber-500 rounded-full" /> 03 ΓÇö Optimization & Approval Readiness</li>
                                </ul>
                            </div>
                        </div>

                        <div className="text-center border-t border-white/5 pt-8">
                            <h4 className="text-xl font-bold uppercase tracking-widest text-blue-400 mb-2">How It Works</h4>
                            <p className="text-slate-400 max-w-2xl mx-auto">Each day unlocks a focused execution task. Follow the sequence. Complete the actions. Track the results.</p>
                        </div>
                    </div>
                </section>
            )}

            <div className="fixed bottom-4 right-4 z-[100]">
                <button
                    onClick={() => window.location.reload()}
                    className="text-[10px] text-white/30 hover:text-white uppercase tracking-widest font-mono border border-white/10 px-2 py-1 rounded bg-black/50 backdrop-blur-sm transition-colors"
                >
                    Refresh System v1.2
                </button>
            </div>

            <Toaster position="top-center" theme="dark" />
        </div>
    );
}

