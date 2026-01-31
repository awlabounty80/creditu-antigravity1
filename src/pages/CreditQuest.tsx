import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useGamification } from '@/hooks/useGamification'
import { Trophy, CheckCircle, XCircle, ArrowRight, Brain } from 'lucide-react'
import { cn } from '@/lib/utils'
import confetti from 'canvas-confetti'
import { supabase } from '@/lib/supabase'
import { useProfile } from '@/hooks/useProfile'
import { generateScenario, TEMPLATES, type Scenario, type Choice } from '@/lib/quest-engine'

export default function CreditQuest() {
    const { user } = useProfile()
    const { awardPoints } = useGamification()
    const [scenarios, setScenarios] = useState<Scenario[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null)
    const [gameCompleted, setGameCompleted] = useState(false)
    const [totalPoints, setTotalPoints] = useState(0)
    const [simulatedScore, setSimulatedScore] = useState(650)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (user) {
            initSession()
        }
    }, [user])

    async function initSession() {
        setLoading(true)
        try {
            // 1. Fetch History
            const { data: history, error } = await supabase.rpc('get_quest_stats', { user_uuid: user?.id })

            const stats = history || {} // { 'template_id': { attempts: 1, correct: 0 } }

            // 2. Sort Templates by "Need"
            // Priority: Failed > New > Mastered
            const playlist = TEMPLATES.sort((a, b) => {
                const statA = stats[a.id] || { attempts: 0, correct: 0 }
                const statB = stats[b.id] || { attempts: 0, correct: 0 }

                const scoreA = getPriorityScore(statA)
                const scoreB = getPriorityScore(statB)

                return scoreB - scoreA // Descending priority
            }).slice(0, 5) // Take top 5

            // 3. Generate Scenarios
            const sessionScenarios = playlist.map((t, i) => generateScenario(i, t.id))
            setScenarios(sessionScenarios)

        } catch (e) {
            console.error("Agent Offline, defaulting to random.", e)
            const newGame = Array.from({ length: 5 }).map((_, i) => generateScenario(i))
            setScenarios(newGame)
        }
        setLoading(false)
    }

    function getPriorityScore(stat: any) {
        if (stat.attempts === 0) return 10; // New Content (High Priority)
        if (stat.correct === 0) return 20; // Failed Content (Highest Priority - Review)
        return 1; // Mastered (Low priority)
    }

    const currentScenario = scenarios[currentIndex]

    const handleChoice = async (choice: Choice) => {
        if (selectedChoice) return
        setSelectedChoice(choice)

        // Award points
        if (choice.points > 0) {
            setTotalPoints(prev => prev + choice.points)
            awardPoints(choice.points, `Quest: ${currentScenario.title}`)
        }

        // Update Sim Score
        setSimulatedScore(prev => Math.min(850, Math.max(300, prev + choice.statImpact.score)))

        // Confetti
        if (choice.isCorrect) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#4ade80', '#22c55e', '#ffffff']
            })
        }

        // SAVE HISTORY to DB (The "Memory")
        if (user && currentScenario.templateId) {
            await supabase.from('quest_history').insert({
                user_id: user.id,
                template_id: currentScenario.templateId,
                is_correct: choice.isCorrect
            })
        }
    }

    const nextScenario = () => {
        setSelectedChoice(null)
        if (currentIndex < scenarios.length - 1) {
            setCurrentIndex(prev => prev + 1)
        } else {
            setGameCompleted(true)
            awardPoints(500, "Quest Completion Bonus")
        }
    }

    const resetGame = () => {
        // Refresh session with new priorities
        initSession()
        setCurrentIndex(0)
        setSelectedChoice(null)
        setGameCompleted(false)
        setTotalPoints(0)
        setSimulatedScore(650)
    }

    if (loading || !currentScenario) return <div className="min-h-screen bg-[#020412] flex items-center justify-center text-white">Loading Simulation...</div>

    return (
        <div className="min-h-screen bg-[#020412] text-white p-6 md:p-12 font-sans relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                <div className="absolute top-10 right-10 w-96 h-96 bg-indigo-600/30 rounded-full blur-[100px]" />
                <div className="absolute bottom-10 left-10 w-64 h-64 bg-emerald-600/20 rounded-full blur-[80px]" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">

                {/* Header Stats */}
                <div className="flex flex-col md:flex-row justify-between items-center bg-white/5 border border-white/10 rounded-2xl p-6 mb-12 backdrop-blur-md">
                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                        <div className="bg-indigo-600 p-3 rounded-lg shadow-lg shadow-indigo-500/20">
                            <Brain className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black italic tracking-tighter">CREDIT QUEST</h1>
                            <p className="text-xs text-slate-400 font-mono tracking-widest">TACTICAL SIMULATION v2.0</p>
                        </div>
                    </div>

                    <div className="flex gap-8">
                        <div className="text-center">
                            <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Sim Score</p>
                            <div className={cn("text-2xl font-bold font-mono transition-colors duration-500",
                                simulatedScore >= 700 ? "text-emerald-400" : simulatedScore >= 650 ? "text-amber-400" : "text-red-400"
                            )}>
                                {simulatedScore}
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Session XP</p>
                            <div className="text-2xl font-bold text-indigo-400 font-mono">+{totalPoints}</div>
                        </div>
                    </div>
                </div>

                {/* GAME STAGE */}
                <AnimatePresence mode="wait">
                    {!gameCompleted ? (
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="bg-[#0A0F1E] border-white/10 shadow-2xl overflow-hidden">
                                {/* Scenario Header */}
                                <div className="p-8 border-b border-white/5 bg-gradient-to-r from-white/5 to-transparent">
                                    <div className="flex items-center gap-4 mb-4">
                                        <Badge variant="outline" className="bg-white/5 border-white/20 text-slate-300">
                                            Scenario {currentIndex + 1} of {scenarios.length}
                                        </Badge>
                                        <div className="h-px flex-1 bg-white/10" />
                                    </div>
                                    <div className="flex gap-6">
                                        <div className={cn("p-4 rounded-2xl h-fit shadow-xl", "bg-black/40 border border-white/10")}>
                                            <currentScenario.icon className={cn("w-10 h-10", currentScenario.themeColor)} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{currentScenario.title}</h2>
                                            <p className="text-lg text-slate-300 leading-relaxed font-light">{currentScenario.description}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Choices */}
                                <div className="p-8 space-y-4">
                                    {currentScenario.choices.map((choice) => (
                                        <button
                                            key={choice.id}
                                            onClick={() => handleChoice(choice)}
                                            disabled={!!selectedChoice}
                                            className={cn(
                                                "w-full text-left p-6 rounded-xl border transition-all duration-300 relative overflow-hidden group",
                                                selectedChoice?.id === choice.id
                                                    ? choice.isCorrect
                                                        ? "bg-emerald-900/20 border-emerald-500/50 shadow-emerald-900/20"
                                                        : "bg-red-900/20 border-red-500/50 shadow-red-900/20"
                                                    : selectedChoice
                                                        ? "opacity-50 grayscale border-white/5 bg-white/5"
                                                        : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-indigo-500/30 hover:scale-[1.01]"
                                            )}
                                        >
                                            <div className="flex items-center gap-4 relative z-10">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors border-2",
                                                    selectedChoice?.id === choice.id
                                                        ? choice.isCorrect ? "bg-emerald-500 border-emerald-500 text-black" : "bg-red-500 border-red-500 text-white"
                                                        : "border-white/20 text-slate-400 group-hover:border-indigo-500 group-hover:text-indigo-400"
                                                )}>
                                                    {choice.id}
                                                </div>
                                                <div className="flex-1">
                                                    <p className={cn("font-medium text-lg", selectedChoice?.id === choice.id ? "text-white" : "text-slate-300 group-hover:text-white")}>
                                                        {choice.text}
                                                    </p>

                                                    {selectedChoice?.id === choice.id && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            className="mt-3 text-sm font-mono border-t border-white/10 pt-3"
                                                        >
                                                            {choice.isCorrect ? (
                                                                <span className="text-emerald-400 flex items-center gap-2"><CheckCircle className="w-4 h-4" /> {choice.feedback}</span>
                                                            ) : (
                                                                <span className="text-red-400 flex items-center gap-2"><XCircle className="w-4 h-4" /> {choice.feedback}</span>
                                                            )}
                                                            <div className="mt-2 text-xs opacity-70">
                                                                Impact: Score {choice.statImpact.score > 0 ? '+' : ''}{choice.statImpact.score}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {/* Navigate Next */}
                                {selectedChoice && (
                                    <div className="p-8 pt-0 flex justify-end">
                                        <Button onClick={nextScenario} size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 animate-in fade-in slide-in-from-bottom-5">
                                            {currentIndex === scenarios.length - 1 ? 'Finish Simulation' : 'Next Scenario'} <ArrowRight className="w-5 h-5 ml-2" />
                                        </Button>
                                    </div>
                                )}
                            </Card>
                        </motion.div>
                    ) : (
                        /* COMPLETION SCREEN */
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-12"
                        >
                            <Trophy className="w-32 h-32 text-amber-400 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] animate-bounce" />
                            <h2 className="text-5xl font-black text-white mb-4">SIMULATION COMPLETE</h2>
                            <p className="text-xl text-slate-300 max-w-lg mx-auto mb-12">
                                You demonstrated excellent strategic instincts. Your simulated credit score is now <span className="text-emerald-400 font-bold">{simulatedScore}</span>.
                            </p>

                            <div className="inline-flex flex-col items-center gap-4 bg-white/5 p-8 rounded-3xl border border-white/10 mb-12">
                                <span className="text-sm font-mono uppercase tracking-widest text-slate-500">Total Rewards Earned</span>
                                <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                                    {totalPoints + 500} MP
                                </span>
                            </div>

                            <div className="flex justify-center gap-4">
                                <Button onClick={resetGame} variant="outline" className="border-white/10 hover:bg-white/5 text-slate-300">
                                    Replay Simulation
                                </Button>
                                <Button className="bg-emerald-600 hover:bg-emerald-500 text-white" onClick={() => window.location.href = '/dashboard/curriculum'}>
                                    Return to Base
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    )
}
