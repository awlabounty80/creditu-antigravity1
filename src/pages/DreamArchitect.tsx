import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Car, Home, Plane, Briefcase, ChevronRight, Calculator, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

// Mock Data for "Power" Analysis
const DREAMS = [
    {
        id: 'car',
        label: 'Dream Car',
        icon: Car,
        color: 'text-rose-400',
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/20',
        defaultPrice: 45000,
        questions: ['New or Used?', 'Down Payment?']
    },
    {
        id: 'home',
        label: 'First Home',
        icon: Home,
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
        defaultPrice: 350000,
        questions: ['State?', 'FHA or Conventional?']
    },
    {
        id: 'business',
        label: 'Business Funding',
        icon: Briefcase,
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
        defaultPrice: 50000,
        questions: ['LLC Age?', 'Revenue?']
    },
    {
        id: 'travel',
        label: 'World Travel',
        icon: Plane,
        color: 'text-cyan-400',
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/20',
        defaultPrice: 10000,
        questions: ['Destination?', 'Points or Cash?']
    }
]

export default function DreamArchitect() {
    const [selectedDream, setSelectedDream] = useState<typeof DREAMS[0] | null>(null)
    const [price, setPrice] = useState(0)
    const [step, setStep] = useState(0) // 0=Select, 1=Configure, 2=Blueprint

    const currentScore = 650 // Hook this up to real data later

    const handleSelect = (dream: typeof DREAMS[0]) => {
        setSelectedDream(dream)
        setPrice(dream.defaultPrice)
        setStep(1)
    }

    const calculateRequirements = (amount: number, type: string) => {
        // "Powerful" Logic: Reverse engineer the requirement
        if (type === 'home') return { score: 720, down: amount * 0.035, timeline: '6 Months' }
        if (type === 'car') return { score: 680, down: amount * 0.10, timeline: '3 Months' }
        if (type === 'business') return { score: 700, down: 0, timeline: '4 Months' }
        return { score: 660, down: 0, timeline: '2 Months' }
    }

    const reqs = selectedDream ? calculateRequirements(price, selectedDream.id) : { score: 0, down: 0, timeline: '' }
    const scoreGap = reqs.score - currentScore

    return (
        <div className="min-h-screen bg-[#020412] text-white p-6 md:p-12 font-sans relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <header className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                        DREAM ARCHITECT
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl font-light">
                        Don't just fix your credit. Build your future. Select a goal to reverse-engineer your perfect credit profile.
                    </p>
                </header>

                <AnimatePresence mode="wait">
                    {step === 0 && (
                        <motion.div
                            key="selection"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                        >
                            {DREAMS.map((dream) => (
                                <button
                                    key={dream.id}
                                    onClick={() => handleSelect(dream)}
                                    className="group relative h-80 rounded-3xl overflow-hidden border border-white/5 bg-[#0A0F1E] hover:border-white/20 transition-all duration-500 text-left p-6 flex flex-col justify-between"
                                >
                                    <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-transparent to-black/80", dream.bg)} />

                                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", dream.bg, dream.color)}>
                                        <dream.icon className="w-7 h-7" />
                                    </div>

                                    <div className="relative z-10">
                                        <h3 className="text-2xl font-bold text-white mb-2">{dream.label}</h3>
                                        <div className="h-1 w-12 bg-white/20 rounded-full group-hover:w-full group-hover:bg-white transition-all duration-500" />
                                    </div>

                                    <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                                        <ChevronRight className="w-6 h-6 text-white" />
                                    </div>
                                </button>
                            ))}
                        </motion.div>
                    )}

                    {step === 1 && selectedDream && (
                        <motion.div
                            key="config"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                        >
                            {/* Left: Input */}
                            <div className="lg:col-span-5 bg-[#0A0F1E] border border-white/10 rounded-3xl p-8 h-fit">
                                <button onClick={() => setStep(0)} className="text-slate-500 hover:text-white mb-6 text-sm flex items-center gap-2">
                                    ← Back to Dreams
                                </button>

                                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-6", selectedDream.bg, selectedDream.color)}>
                                    <selectedDream.icon className="w-8 h-8" />
                                </div>

                                <h2 className="text-3xl font-bold mb-8">Design your {selectedDream.label}</h2>

                                <div className="space-y-8">
                                    <div>
                                        <label className="text-sm font-mono text-slate-400 uppercase tracking-widest mb-4 block">Target Value</label>
                                        <div className="text-5xl font-black text-white mb-4 tracking-tighter">
                                            ${price.toLocaleString()}
                                        </div>
                                        <Slider
                                            value={[price]}
                                            onValueChange={(val) => setPrice(val[0])}
                                            max={selectedDream.defaultPrice * 3}
                                            step={1000}
                                            className="py-4"
                                        />
                                    </div>

                                    <Button onClick={() => setStep(2)} className="w-full h-14 text-lg font-bold bg-white text-black hover:bg-slate-200 rounded-xl">
                                        Generate Blueprint <Target className="w-5 h-5 ml-2" />
                                    </Button>
                                </div>
                            </div>

                            {/* Right: Real-time Analysis */}
                            <div className="lg:col-span-7 space-y-6">
                                <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-white/10 relative overflow-hidden">
                                    <div className="relative z-10">
                                        <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                                            <Calculator className="w-5 h-5 text-indigo-400" /> Analysis
                                        </h3>
                                        <div className="grid grid-cols-2 gap-8">
                                            <div>
                                                <div className="text-sm text-slate-400 mb-1">Required Score</div>
                                                <div className="text-4xl font-mono font-bold text-white">{reqs.score}</div>
                                                {scoreGap > 0 ? (
                                                    <div className="text-red-400 text-sm mt-1">You are {scoreGap} points away</div>
                                                ) : (
                                                    <div className="text-emerald-400 text-sm mt-1">You are qualified!</div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="text-sm text-slate-400 mb-1">Est. Down Payment</div>
                                                <div className="text-4xl font-mono font-bold text-white">${reqs.down.toLocaleString()}</div>
                                                <div className="text-indigo-400 text-sm mt-1">3.5% assumption</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && selectedDream && (
                        <motion.div
                            key="blueprint"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-[#0A0F1E] border border-white/10 rounded-3xl p-8 md:p-12 text-center max-w-3xl mx-auto"
                        >
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-400 mb-6 border border-emerald-500/20">
                                <Target className="w-10 h-10" />
                            </div>
                            <h2 className="text-4xl font-black text-white mb-2">Blueprint Generated</h2>
                            <p className="text-slate-400 mb-8 max-w-md mx-auto">
                                To acquire your <span className="text-white font-bold">${price.toLocaleString()} {selectedDream.label}</span> in {reqs.timeline}, here is your mission:
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left mb-12">
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                    <div className="text-xs text-slate-500 uppercase tracking-widest mb-2">Primary Target</div>
                                    <div className="text-xl font-bold text-white">Reach {reqs.score} FICO</div>
                                    <div className="text-sm text-rose-400 mt-1">Currently {currentScore}</div>
                                </div>
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                    <div className="text-xs text-slate-500 uppercase tracking-widest mb-2">Capital Needed</div>
                                    <div className="text-xl font-bold text-white">${reqs.down.toLocaleString()}</div>
                                    <div className="text-sm text-emerald-400 mt-1">Save ${(reqs.down / 6).toFixed(0)}/mo</div>
                                </div>
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                    <div className="text-xs text-slate-500 uppercase tracking-widest mb-2">Key Action</div>
                                    <div className="text-xl font-bold text-white">Lower Utilization</div>
                                    <div className="text-sm text-indigo-400 mt-1">Pay down cards</div>
                                </div>
                            </div>

                            <Button onClick={() => setStep(0)} variant="outline" className="border-white/10 text-slate-400 hover:text-white">
                                Design Another Dream
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
