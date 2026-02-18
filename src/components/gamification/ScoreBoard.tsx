import { useEffect, useRef } from 'react'
import { motion, useSpring, useTransform, animate } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Trophy, TrendingUp, Activity, Star, Zap, Crown } from 'lucide-react'

interface ScoreBoardProps {
    creditScore: number
    xp: number
    streak: number
    rank?: string
    maxScore?: number
}

function Counter({ value, className }: { value: number, className?: string }) {
    const ref = useRef<HTMLSpanElement>(null)
    const spring = useSpring(value, { mass: 0.8, stiffness: 75, damping: 15 })
    const display = useTransform(spring, (current) => Math.round(current).toLocaleString())

    useEffect(() => {
        spring.set(value)
    }, [value])

    return <motion.span ref={ref} className={className}>{display}</motion.span>
}

export function ScoreBoard({ creditScore, xp, streak, rank = "Cadet", maxScore = 850 }: ScoreBoardProps) {
    const progress = Math.min(100, Math.max(0, ((creditScore - 300) / (850 - 300)) * 100))

    return (
        <div className="relative w-full overflow-hidden rounded-3xl bg-[#020412] border border-white/10 shadow-2xl">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-amber-900/20" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />

            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[url('/grid-pattern.svg')]" />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 p-6 md:p-8 items-center">

                {/* LEFT: RANK & XP */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-blue-400 font-mono text-xs uppercase tracking-[0.2em]">
                        <Crown className="w-4 h-4" /> Current Rank
                    </div>
                    <div className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase drop-shadow-[0_0_10px_rgba(37,99,235,0.5)]">
                        {rank}
                    </div>
                    <div className="mt-2 flex items-center gap-3 bg-white/5 rounded-lg p-2 border border-white/5 w-fit">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="font-mono text-xl font-bold text-white">
                            <Counter value={xp} /> <span className="text-xs text-slate-400 font-normal">XP</span>
                        </span>
                    </div>
                </div>

                {/* CENTER: MAIN SCOREBOARD */}
                <div className="flex flex-col items-center justify-center relative">
                    {/* Glowing Ring Background */}
                    <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full" />

                    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Simulated Credit Score</div>

                    <div className="relative">
                        <div className={cn(
                            "text-7xl md:text-8xl font-black tracking-tighter tabular-nums",
                            creditScore >= 700 ? "text-transparent bg-clip-text bg-gradient-to-b from-emerald-300 to-emerald-600 drop-shadow-[0_0_25px_rgba(16,185,129,0.4)]" :
                                creditScore >= 650 ? "text-transparent bg-clip-text bg-gradient-to-b from-amber-300 to-amber-600 drop-shadow-[0_0_25px_rgba(245,158,11,0.4)]" :
                                    "text-transparent bg-clip-text bg-gradient-to-b from-red-300 to-red-600 drop-shadow-[0_0_25px_rgba(239,68,68,0.4)]"
                        )}>
                            <Counter value={creditScore} />
                        </div>

                        {/* Status Indicator */}
                        <div className="absolute -right-8 top-0 flex flex-col gap-1">
                            <div className={cn("w-2 h-2 rounded-full", creditScore >= 800 ? "bg-emerald-400 shadow-[0_0_10px_#34d399]" : "bg-emerald-900")} />
                            <div className={cn("w-2 h-2 rounded-full", creditScore >= 700 ? "bg-emerald-600" : "bg-emerald-900")} />
                            <div className={cn("w-2 h-2 rounded-full", creditScore >= 600 ? "bg-amber-500" : "bg-amber-900")} />
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full max-w-[200px] h-2 bg-slate-800 rounded-full mt-4 overflow-hidden relative">
                        <motion.div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-amber-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ type: "spring", bounce: 0, duration: 1 }}
                        />
                    </div>
                </div>

                {/* RIGHT: STREAK & MULTIPLIER */}
                <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-[0.2em] text-right">
                        <Activity className="w-4 h-4" /> Performance
                    </div>

                    {streak > 1 ? (
                        <div className="flex flex-col items-end animate-bounce">
                            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)] italic">
                                {streak}x
                            </div>
                            <div className="text-xs font-bold text-amber-200 uppercase tracking-widest">Combo Active</div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-end opacity-50">
                            <div className="text-4xl font-black text-slate-700 italic">1x</div>
                            <div className="text-xs font-bold text-slate-600 uppercase tracking-widest">No Streak</div>
                        </div>
                    )}

                    <div className="mt-4 flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-900/10">
                        <Zap className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-bold text-blue-300">SYSTEM ONLINE</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
