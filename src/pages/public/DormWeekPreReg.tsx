
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, ChevronRight, CheckCircle2, Star, Zap, Brain, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toaster, toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { CreditULogo } from '@/components/common/CreditULogo';

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
        {children}
    </motion.div>
);

export default function DormWeekPreReg() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        email: '',
        phone: '',
        struggle: '',
        scoreRange: '500-600'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { error } = await supabase.from('dorm_week_pre_reg').insert({
                first_name: formData.firstName,
                email: formData.email,
                phone: formData.phone,
                biggest_struggle: formData.struggle,
                credit_score_range: formData.scoreRange,
                source: 'Dorm Week Pre-Reg Page'
            });

            if (error) throw error;

            toast.success("Intelligence Secured. You are on the list.");

            // Redirect to the main dorm week page for full registration or onboarding
            setTimeout(() => navigate('/dorm-week'), 2000);
        } catch (err: any) {
            console.error(err);
            toast.error("Protocol error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020412] text-white font-sans selection:bg-amber-500/30 overflow-x-hidden relative">
            <Toaster position="top-center" theme="dark" />

            {/* Ambient Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-amber-500/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            </div>

            <nav className="relative z-50 p-6 flex justify-between items-center max-w-7xl mx-auto">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-white/5 border border-white/10 p-2 rounded-lg backdrop-blur-md group-hover:bg-white/10 transition-all">
                        <CreditULogo className="w-8 h-8" variant="gold" showShield={false} iconClassName="w-5 h-5" />
                    </div>
                    <span className="font-heading font-bold tracking-tight">CREDIT U</span>
                </Link>
                <Link to="/gate">
                    <Button variant="ghost" className="text-slate-400 hover:text-white">Back to Gate</Button>
                </Link>
            </nav>

            <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 p-6 lg:p-24 items-center">
                {/* Left side: Value Prop */}
                <div className="space-y-8">
                    <FadeIn delay={0.1}>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-black uppercase tracking-widest">
                            <Star className="w-3 h-3 animate-pulse" /> Limited Fall 2026 Intake
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.2}>
                        <h1 className="text-5xl md:text-7xl font-black uppercase italic italic leading-none tracking-tighter">
                            PRE-REGISTRATION <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-amber-200">ACTIVE NOW</span>
                        </h1>
                    </FadeIn>

                    <FadeIn delay={0.3}>
                        <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-md">
                            Secure your priority access to the March 2026 Dorm Week intake. Early applicants receive a custom Credit U ID and immediate access to the <span className="text-white border-b border-white/20">Identity Reframe</span> module.
                        </p>
                    </FadeIn>

                    <FadeIn delay={0.4}>
                        <div className="grid gap-6">
                            {[
                                { icon: Shield, title: "Priority Enrollment", desc: "Skip the 10,000+ person waitlist." },
                                { icon: Brain, title: "Psychological Reset", desc: "Unlock Day 1 content immediately." },
                                { icon: Zap, title: "VVIP Status", desc: "Early access to high-limit lender lists." }
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                                    <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-sm uppercase tracking-tight text-white">{item.title}</h3>
                                        <p className="text-xs text-slate-500">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </FadeIn>
                </div>

                {/* Right side: Form */}
                <FadeIn delay={0.5}>
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 to-indigo-500/20 rounded-[2.5rem] blur-2xl opacity-50"></div>
                        <div className="relative bg-[#0A0F1E]/80 backdrop-blur-2xl border border-white/10 p-8 md:p-12 rounded-[2rem] shadow-2xl">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-pink-600 to-indigo-600"></div>

                            <div className="mb-8 text-center lg:text-left">
                                <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-2">Initialize VVIP Access</h2>
                                <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">Protocol: Lead_Capture_V2</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">First Name</Label>
                                    <Input
                                        required
                                        placeholder="Enter your name"
                                        className="h-14 bg-black/40 border-white/10 rounded-xl focus:border-amber-500/50 transition-all font-bold"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Email Address</Label>
                                    <Input
                                        required
                                        type="email"
                                        placeholder="name@example.com"
                                        className="h-14 bg-black/40 border-white/10 rounded-xl focus:border-amber-500/50 transition-all font-bold"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Current Score Range</Label>
                                    <select
                                        className="w-full h-14 bg-black/40 border border-white/10 rounded-xl px-4 text-sm font-bold text-white focus:outline-none focus:border-amber-500/50 transition-all appearance-none"
                                        value={formData.scoreRange}
                                        onChange={(e) => setFormData({ ...formData, scoreRange: e.target.value })}
                                    >
                                        <option value="300-500">Unrated (300-500)</option>
                                        <option value="500-600">Freshman (500-600)</option>
                                        <option value="600-700">Sophomore (600-700)</option>
                                        <option value="700-850">Elite (700-850)</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Biggest Financial Struggle</Label>
                                    <select
                                        className="w-full h-14 bg-black/40 border border-white/10 rounded-xl px-4 text-sm font-bold text-white focus:outline-none focus:border-amber-500/50 transition-all appearance-none"
                                        value={formData.struggle}
                                        onChange={(e) => setFormData({ ...formData, struggle: e.target.value })}
                                        required
                                    >
                                        <option value="">Select your objective...</option>
                                        <option value="Late Payments">Removing Late Payments</option>
                                        <option value="High Utilization">Lowering Utilization</option>
                                        <option value="Business Funding">Securing Business Funding</option>
                                        <option value="Home Purchase">Buying My First Home</option>
                                    </select>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-16 bg-white text-black hover:bg-amber-500 font-black uppercase tracking-[0.2em] rounded-xl shadow-xl transition-all hover:scale-[1.02]"
                                >
                                    {isLoading ? "Synchronizing..." : "Initialize High-Priority Enrollment"}
                                </Button>

                                <p className="text-[10px] text-center text-slate-600 font-medium">
                                    By submitting, you agree to receive institutional briefings and protocol updates via email and SMS.
                                </p>
                            </form>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
}

