import { Link } from 'react-router-dom'
import { Lock, UserCheck, CreditCard, ChevronRight, ShieldCheck, ScanLine, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

import { CreditULogo } from '@/components/common/CreditULogo'

// Access Card Component
const AccessCard = ({ to, icon: Icon, title, subtitle, colorClass, delay }: any) => {
    return (
        <Link to={to} className="group relative w-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay, duration: 0.5, ease: "backOut" }}
                className={cn(
                    "relative overflow-hidden rounded-xl border border-white/5 bg-slate-900/40 p-6 backdrop-blur-md transition-all duration-500",
                    "hover:border-amber-400/50 hover:bg-slate-900/60 hover:shadow-2xl hover:shadow-amber-900/20 hover:-translate-y-1",
                    "after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/5 after:to-transparent after:-translate-x-full group-hover:after:animate-shimmer"
                )}
            >
                {/* Glow Effect on Hover */}
                <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br", colorClass)}></div>

                <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        {/* Icon Badge */}
                        <div className={cn(
                            "relative flex h-14 w-14 items-center justify-center rounded-full border border-white/5 bg-slate-950/50 text-slate-300 transition-all duration-500",
                            "group-hover:scale-110 group-hover:border-amber-400/30 group-hover:text-amber-400 shadow-lg"
                        )}>
                            <Icon size={24} strokeWidth={1.5} />
                            {/* Pulse Ring */}
                            <div className="absolute inset-0 rounded-full border border-white/5 opacity-0 group-hover:opacity-100 group-hover:animate-ping-slow"></div>
                        </div>

                        <div className="text-left space-y-1">
                            <h3 className="font-heading text-lg font-bold tracking-wide text-white group-hover:text-amber-100 transition-colors">
                                {title}
                            </h3>
                            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 group-hover:text-amber-400/80 transition-colors">
                                {subtitle}
                            </p>
                        </div>
                    </div>

                    {/* Chevron Interaction */}
                    <ChevronRight className="text-slate-700 transition-all duration-300 group-hover:translate-x-1 group-hover:text-amber-400" />
                </div>
            </motion.div>
        </Link>
    )
}

export default function TheGate() {
    return (
        <div className="relative h-screen w-full overflow-hidden bg-[#020412] text-white selection:bg-amber-500/30">

            {/* --- CINEMATIC BACKGROUND LAYER --- */}

            {/* Deep Atmosphere */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#050a1f] via-[#020412] to-black z-0 pointer-events-none"></div>

            {/* Animated Fog/Smoke (CSS Animation simulation via motion) */}
            <motion.div
                animate={{ x: [-50, 50, -50], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 pointer-events-none mix-blend-overlay"
            ></motion.div>

            {/* Rotating Halo */}
            <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full border border-indigo-900/20 bg-gradient-to-b from-indigo-500/5 to-transparent z-0 blur-3xl pointer-events-none animate-spin-ultra-slow"></div>

            {/* Light Rays */}
            <div className="absolute top-0 right-0 w-[500px] h-[800px] bg-gradient-to-bl from-blue-600/10 via-transparent to-transparent z-0 blur-3xl pointer-events-none rotate-12 opacity-50"></div>


            {/* --- CONTENT LAYER --- */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">

                {/* HEADLINE SECTION */}
                <div className="mb-16 flex flex-col items-center text-center">

                    {/* Living Logo */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="relative mb-8"
                    >
                        {/* Official Image Logo */}
                        <div className="relative h-48 w-48 rounded-full overflow-hidden shadow-2xl shadow-indigo-500/20 border border-white/10">
                            <CreditULogo className="w-full h-full" showShield={false} iconClassName="w-44 h-44" />
                        </div>
                    </motion.div>

                    {/* Typography */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tight text-white drop-shadow-2xl">
                            CREDIT <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-600">U</span>
                        </h1>
                        <div className="h-px w-32 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mx-auto my-4"></div>
                        <p className="font-mono text-xs md:text-sm uppercase tracking-[0.4em] text-blue-200/80 mb-2">
                            Financial Identity & Access Portal
                        </p>
                        <p className="font-serif text-lg md:text-xl text-slate-400 italic opacity-80">
                            "Where your credit becomes your capital."
                        </p>
                    </motion.div>
                </div>

                {/* ACCESS GRID */}
                {/* HERO ACTION - STEP 1 */}
                <div className="w-full max-w-2xl mb-8">
                    <Link to="/onboarding" className="group relative w-full block">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="relative overflow-hidden rounded-2xl border border-indigo-500/50 bg-[#0A0F1E]/80 p-8 backdrop-blur-xl transition-all duration-500 hover:bg-[#0A0F1E] hover:border-indigo-400 hover:shadow-[0_0_50px_-10px_rgba(99,102,241,0.3)] group-hover:-translate-y-1"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-50">
                                <span className="flex h-3 w-3 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                                </span>
                            </div>

                            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                                <div className="h-20 w-20 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-transform duration-500 shadow-xl">
                                    <Sparkles className="h-10 w-10 text-indigo-400 group-hover:text-white transition-colors" />
                                </div>
                                <div className="space-y-2 flex-1">
                                    <div className="flex items-center justify-center md:justify-start gap-3">
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest bg-indigo-500 text-white uppercase">Step 01</span>
                                    </div>
                                    <h2 className="text-3xl font-heading font-bold text-white tracking-tight group-hover:text-amber-200 transition-colors">
                                        Dorm Week™ Orientation
                                    </h2>
                                    <p className="text-slate-400 font-light text-sm tracking-wide group-hover:text-white/80">
                                        Begin the 5-Day Cultural & Financial Homecoming.
                                    </p>
                                </div>
                                <div className="hidden md:flex h-12 w-12 rounded-full border border-white/10 items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                    <ChevronRight className="w-6 h-6" />
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                </div>

                {/* ACCESS GRID (Secondary) */}
                <div className="grid w-full max-w-2xl grid-cols-1 gap-4 md:grid-cols-2 opacity-80 hover:opacity-100 transition-opacity">

                    <AccessCard
                        to="/login"
                        icon={Lock}
                        title="Enter as Student"
                        subtitle="Enrolled Users Only"
                        colorClass="from-emerald-600 to-emerald-900"
                        delay={0.6}
                    />

                    <AccessCard
                        to="/apply"
                        icon={UserCheck}
                        title="Apply for Admission"
                        subtitle="Start Your Legacy"
                        colorClass="from-amber-600 to-amber-900"
                        delay={0.7}
                    />

                    <AccessCard
                        to="/status"
                        icon={CreditCard}
                        title="Check Status"
                        subtitle="Applications & Payments"
                        colorClass="from-blue-600 to-blue-900"
                        delay={0.8}
                    />
                    {/* Removed old 'Begin Reset' card as it's now the Hero */}
                </div>

                {/* TRUST FOOTER */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 1 }}
                    className="absolute bottom-8 flex w-full max-w-4xl items-center justify-between px-6 text-[10px] md:text-xs uppercase tracking-widest text-slate-600"
                >
                    <div className="flex items-center gap-3">
                        <div className="relative h-2 w-2">
                            <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500 opacity-75"></div>
                            <div className="relative h-2 w-2 rounded-full bg-emerald-500"></div>
                        </div>
                        <span className="font-mono text-emerald-500/80">Systems Online</span>
                    </div>

                    <div className="hidden md:flex items-center gap-4 opacity-50">
                        <ShieldCheck size={12} />
                        <span>Secure Verification • v2.4.0</span>
                    </div>

                    <div className="flex items-center gap-2 opacity-30">
                        <ScanLine size={12} />
                        <span className="animate-pulse">ID Scan Active</span>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
