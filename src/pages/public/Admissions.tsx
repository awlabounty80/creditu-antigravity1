import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle2, ArrowRight, Shield, RefreshCw, Cpu, Sparkles, Globe, Lock, ChevronRight } from 'lucide-react'
import { CreditULogo } from '@/components/common/CreditULogo'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAdmissions } from '@/context/AdmissionsContext'

export default function Admissions() {
    const navigate = useNavigate()
    const { applicant, updateApplicant } = useAdmissions()

    // --- SYNC ORIENTATION STATE ---
    useEffect(() => {
        const saved = localStorage.getItem('credit_u_reset_state');
        if (saved && !applicant.firstName) {
            try {
                const data = JSON.parse(saved);

                // Map goals from Dorm Week to Admissions format
                let mappedGoal = '';
                const dwGoal = data.primaryMission || '';
                if (dwGoal === 'Build business credit') {
                    mappedGoal = 'Build Business Credit';
                } else if (dwGoal) {
                    mappedGoal = 'Fix Personal Credit';
                }

                if (data.firstName || data.lastName || data.email || data.studentIdCode) {
                    updateApplicant({
                        firstName: data.firstName || '',
                        lastName: data.lastName || '',
                        email: data.email || '',
                        goal: mappedGoal || applicant.goal,
                        studentId: data.studentIdCode || '',
                        academicLevel: data.studentLevel || 'Freshman'
                    });
                }
            } catch (e) { console.error(e); }
        }
    }, [updateApplicant, applicant.firstName, applicant.goal]);

    const handleProceed = () => {
        if (!applicant.firstName || !applicant.email) {
            alert("Please complete all required fields.")
            return
        }
        navigate('/tuition')
    }

    return (
        <div className="min-h-screen bg-[#020412] text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden relative">

            {/* --- CINEMATIC ATMOSPHERE --- */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <video
                    src="/assets/hero-background.mp4"
                    autoPlay
                    loop
                    muted
                    className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-lighten grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#020412] via-[#020412]/90 to-indigo-950/20" />

                {/* Dynamic Mesh Gradients */}
                <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-blue-500/10 rounded-full blur-[120px] animate-pulse-slow active:scale-110 transition-transform"></div>

                {/* Floating Particles/Grid */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.05)_0%,transparent_50%)]"></div>
            </div>

            <nav className="relative z-50 p-8 flex justify-between items-center max-w-7xl mx-auto backdrop-blur-sm">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="bg-white/5 border border-white/10 p-2.5 rounded-2xl backdrop-blur-md group-hover:bg-white/10 group-hover:border-indigo-400 group-hover:scale-110 transition-all duration-500 shadow-2xl">
                        <CreditULogo className="w-10 h-10" variant="gold" showShield={false} iconClassName="w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-heading font-black tracking-tighter text-xl text-white group-hover:text-indigo-400 transition-colors uppercase italic leading-none">CREDIT U</span>
                        <span className="text-[8px] font-mono text-slate-500 tracking-[0.4em] uppercase">Admissions Office</span>
                    </div>
                </Link>
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/5 bg-white/5 backdrop-blur-md">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Server Status: OPTIMAL</span>
                    </div>
                    <Link to="/gate">
                        <Button variant="ghost" className="text-slate-400 hover:text-white font-black uppercase text-xs tracking-widest hover:bg-white/5 transition-all">Back to Gate</Button>
                    </Link>
                </div>
            </nav>

            <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 p-8 lg:p-16 items-center min-h-[85vh]">

                {/* Left Side: The Value Proposition */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="lg:col-span-6 space-y-12"
                >
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="h-px w-12 bg-indigo-500/50" />
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                <Sparkles className="w-3 h-3" /> Fall 2026 Enrollment Now Open
                            </div>
                        </div>

                        <h1 className="font-heading text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.9] text-white drop-shadow-3xl">
                            YOUR <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-500 animate-gradient-x">LEGACY</span> <br />
                            STARTS HERE<span className="text-indigo-500">.</span>
                        </h1>

                        <p className="text-xl text-slate-400 leading-relaxed font-light max-w-xl">
                            Join the ranks of the <span className="text-white font-bold">Credit Architects</span>.
                            This is not just a school; it is an initiation into the mechanisms of global capital and institutional visibility.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { text: "The Credit Lab™ Access", icon: Cpu, desc: "Neural dispute engine" },
                            { text: "Institutional Roadmaps", icon: Globe, desc: "Tier 1 funding paths" },
                            { text: "Business Certification", icon: Shield, desc: "Corporate credit proof" },
                            { text: "Founder's Tier Network", icon: Lock, desc: "Elite private community" }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + (i * 0.1), duration: 0.8 }}
                                className="group p-5 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-xl hover:bg-white/10 hover:border-indigo-400/30 transition-all duration-500"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="bg-indigo-500/10 p-3 rounded-2xl text-indigo-400 group-hover:scale-110 transition-transform">
                                        <item.icon size={24} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-black text-white uppercase text-xs tracking-wider">{item.text}</span>
                                        <span className="text-[10px] text-slate-500 uppercase font-mono">{item.desc}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Right Side: Application Portal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
                    className="lg:col-span-6"
                >
                    <div className="relative group">
                        {/* Outer Glow */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition-all duration-1000"></div>

                        <Card className="bg-[#050914]/90 border-white/10 backdrop-blur-2xl shadow-3xl relative overflow-hidden rounded-[2.5rem] border-t-indigo-500/50">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>

                            <CardHeader className="p-10 pb-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <CardTitle className="text-3xl font-black text-white uppercase italic tracking-tighter">Application Portal</CardTitle>
                                        </div>
                                        <CardDescription className="text-slate-500 text-xs font-mono uppercase tracking-[0.2em]">Initialize Student Profile Sync</CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                                        <RefreshCw className="w-3 h-3 text-indigo-400 animate-[spin_4s_linear_infinite]" />
                                        <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Neural Sync active</span>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="p-10 pt-0 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Legal First Name</Label>
                                        <Input
                                            placeholder="First Name"
                                            className="h-14 bg-black/60 border-white/5 rounded-2xl text-white placeholder:text-slate-700 focus:border-indigo-500/50 transition-all font-bold group-hover:bg-black/40"
                                            value={applicant.firstName}
                                            onChange={(e) => updateApplicant({ firstName: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Legal Last Name</Label>
                                        <Input
                                            placeholder="Last Name"
                                            className="h-14 bg-black/60 border-white/5 rounded-2xl text-white placeholder:text-slate-700 focus:border-indigo-500/50 transition-all font-bold group-hover:bg-black/40"
                                            value={applicant.lastName}
                                            onChange={(e) => updateApplicant({ lastName: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Communication Uplink (Email)</Label>
                                    <Input
                                        placeholder="address@proton.me"
                                        type="email"
                                        className="h-14 bg-black/60 border-white/5 rounded-2xl text-white placeholder:text-slate-700 focus:border-indigo-500/50 transition-all font-bold group-hover:bg-black/40"
                                        value={applicant.email}
                                        onChange={(e) => updateApplicant({ email: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Define Core Objective</Label>
                                    <div className="relative">
                                        <select
                                            className="w-full h-14 bg-black/60 border border-white/5 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 px-5 font-bold appearance-none transition-all group-hover:bg-black/40"
                                            value={applicant.goal}
                                            onChange={(e) => updateApplicant({ goal: e.target.value })}
                                        >
                                            <option value="" className="bg-[#050914] text-white">Select Objective...</option>
                                            <option value="Fix Personal Credit" className="bg-[#050914] text-white">REPAIR: Factual Inaccuracy Removal</option>
                                            <option value="Build Business Credit" className="bg-[#050914] text-white">LEVERAGE: Business Credit Architecture</option>
                                            <option value="Buy a Home" className="bg-[#050914] text-white">ASSET: Mortgage Approval Protocol</option>
                                            <option value="General Wealth Building" className="bg-[#050914] text-white">LEGACY: Core Visibility & Funding</option>
                                        </select>
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                                            <ChevronRight className="rotate-90 w-4 h-4" />
                                        </div>
                                    </div>
                                </div>

                                {applicant.studentId && (
                                    <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-emerald-500/20 p-2 rounded-xl">
                                                <Shield className="w-5 h-5 text-emerald-400" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Biometric Link Found</p>
                                                <p className="text-sm font-mono font-bold text-white uppercase">{applicant.studentId}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Sync Status</p>
                                            <p className="text-[10px] font-bold text-emerald-400 uppercase">SYNCHRONIZED</p>
                                        </div>
                                    </div>
                                )}

                                <div className="pt-4">
                                    <Button
                                        className="w-full h-20 bg-white text-black hover:bg-indigo-50 font-black uppercase tracking-[0.2em] text-lg rounded-3xl shadow-[0_20px_50px_rgba(255,255,255,0.1)] transition-all hover:-translate-y-1 active:scale-[0.98] group"
                                        onClick={handleProceed}
                                    >
                                        SECURE ENROLLMENT <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                    </Button>
                                </div>
                                <p className="text-[9px] text-center text-slate-600 font-mono uppercase tracking-[0.3em]">
                                    Institutional Privacy Secured // AES-256 Encrypted Transfer
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </motion.div>

            </div>

            {/* Subtle Footer */}
            <footer className="relative z-10 p-12 text-center">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/5 pt-12">
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">© 2026 Credit University // Innovation District</p>
                    <div className="flex gap-8">
                        {['Academy Terms', 'Privacy Protocol', 'Honesty Code'].map((item) => (
                            <a key={item} href="#" className="text-[10px] font-mono text-slate-500 uppercase tracking-widest hover:text-white transition-colors">{item}</a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    )
}
