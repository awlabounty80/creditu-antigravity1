import { Link } from 'react-router-dom'
import { Lock, UserCheck, CreditCard, ChevronRight, Zap, Music } from 'lucide-react'
import { CreditULogo } from '@/components/common/CreditULogo'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// Access Card (Variant B - High Energy)
const AccessCardB = ({ to, icon: Icon, title, subtitle, accentColor, delay }: any) => {
    return (
        <Link to={to} className="group relative w-full">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay, duration: 0.4, type: "spring" }}
                className={cn(
                    "relative overflow-hidden rounded-xl border-2 border-white/10 bg-indigo-950/40 p-6 backdrop-blur-md transition-all duration-300",
                    "hover:border-amber-400 hover:bg-indigo-900/60 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(251,191,36,0.2)]",
                    "after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent after:-translate-x-full group-hover:after:animate-shine-fast"
                )}
            >
                <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-5">
                        <div className={cn(
                            "relative flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-900 to-black border border-white/10 text-white transition-all duration-300",
                            "group-hover:rotate-6 group-hover:scale-110",
                            accentColor
                        )}>
                            <Icon size={24} strokeWidth={2} />
                        </div>

                        <div className="text-left">
                            <h3 className="font-heading text-xl font-bold uppercase tracking-wider text-white group-hover:text-amber-300 transition-colors">
                                {title}
                            </h3>
                            <p className="font-mono text-[10px] text-indigo-200/80 group-hover:text-amber-100">
                                {subtitle}
                            </p>
                        </div>
                    </div>

                    <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-amber-400 group-hover:text-black transition-colors">
                        <ChevronRight size={16} />
                    </div>
                </div>
            </motion.div>
        </Link>
    )
}

export default function TheGateVariantB() {
    return (
        <div className="relative h-screen w-full overflow-hidden bg-[#0a0e24] text-white selection:bg-amber-500">

            {/* --- HOMECOMING ATMOSPHERE --- */}

            {/* Dynamic Gradient Mesh */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e24] via-[#1a1f4d] to-[#05081c] z-0"></div>

            {/* Stadium Lights (Marching Band Rhythm) */}
            <motion.div
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-0 left-0 w-full h-[300px] bg-gradient-to-t from-blue-600/20 to-transparent blur-3xl z-0"
            ></motion.div>

            {/* Gold Confetti / Dust Particles */}
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-amber-400/60 rounded-full blur-[1px]"
                    initial={{
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight,
                        scale: Math.random() * 0.5 + 0.2
                    }}
                    animate={{
                        y: [null, Math.random() * -100],
                        opacity: [0, 1, 0]
                    }}
                    transition={{
                        duration: Math.random() * 5 + 5,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    style={{ width: Math.random() * 4 + 1, height: Math.random() * 4 + 1 }}
                />
            ))}

            {/* --- CONTENT --- */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">

                {/* HERO BADGE */}
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className="mb-12 text-center"
                >
                    <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-indigo-900/50 border border-indigo-500/30 backdrop-blur-md mb-6 animate-pulse-slow">
                        <Zap size={14} className="text-amber-400 fill-amber-400" />
                        <span className="text-xs font-bold tracking-widest uppercase text-indigo-100">The Future is Here</span>
                    </div>

                    <h1 className="font-heading text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-indigo-200 drop-shadow-2xl">
                        CREDIT U
                    </h1>
                    <p className="font-heading text-xl md:text-2xl text-amber-400 font-bold tracking-widest mt-2 uppercase">
                        University AI
                    </p>
                </motion.div>

                {/* ACCESS DECK */}
                <div className="grid w-full max-w-3xl grid-cols-1 md:grid-cols-2 gap-4">
                    <AccessCardB
                        to="/login"
                        icon={Lock}
                        title="Student Login"
                        subtitle="Access the Vault"
                        accentColor="group-hover:bg-emerald-600"
                        delay={0.2}
                    />
                    <AccessCardB
                        to="/apply"
                        icon={UserCheck}
                        title="Apply Now"
                        subtitle="Join the Legacy"
                        accentColor="group-hover:bg-amber-500 text-amber-100" // Special gold treatment
                        delay={0.3}
                    />
                    <AccessCardB
                        to="/status"
                        icon={CreditCard}
                        title="My Status"
                        subtitle="Check Application"
                        accentColor="group-hover:bg-blue-600"
                        delay={0.4}
                    />
                    <AccessCardB
                        to="/tour"
                        icon={() => <CreditULogo className="h-6 w-6" variant="gold" showShield={false} iconClassName="h-6 w-6" />}
                        title="Guest Pass"
                        subtitle="Take the Tour"
                        accentColor="group-hover:bg-indigo-600"
                        delay={0.5}
                    />
                </div>

                {/* FOOTER VIBE */}
                <div className="absolute bottom-8 flex items-center justify-center gap-6 w-full opacity-60">
                    <div className="h-px w-24 bg-gradient-to-r from-transparent to-white/20"></div>
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/50">
                        <Music size={12} />
                        <span>Sonic Identity: Muted</span>
                    </div>
                    <div className="h-px w-24 bg-gradient-to-l from-transparent to-white/20"></div>
                </div>

            </div>
        </div>
    )
}
