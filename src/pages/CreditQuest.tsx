import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useGamification } from '@/hooks/useGamification'
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import confetti from 'canvas-confetti'
import { supabase } from '@/lib/supabase'
import { useProfile } from '@/hooks/useProfile'
import { generateScenario, TEMPLATES, type Scenario, type Choice } from '@/lib/quest-engine'
import { LevelUpOverlay } from '@/components/gamification/LevelUpOverlay'
import { useSound } from '@/hooks/useSound'
import { ScoreBoard } from '@/components/gamification/ScoreBoard'

export default function CreditQuest() {
    const { user, profile } = useProfile()
    const { awardPoints } = useGamification()
    const { playHover, playClick, playSuccess, playError } = useSound()

    const [scenarios, setScenarios] = useState<Scenario[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null)
    const [gameCompleted, setGameCompleted] = useState(false)
    const [totalPoints, setTotalPoints] = useState(0)
    const [simulatedScore, setSimulatedScore] = useState(650)
    const [loading, setLoading] = useState(true)
    const [showTestCelebration, setShowTestCelebration] = useState(false)
    const [initialMooPoints, setInitialMooPoints] = useState(0)

    // Combo & Streak State
    const [combo, setCombo] = useState(0)
    const [shakeScreen, setShakeScreen] = useState(false)

    useEffect(() => {
        if (user && !initialMooPoints && profile?.moo_points) {
            setInitialMooPoints(profile.moo_points)
        }
    }, [user, profile])

    useEffect(() => {
        if (user) {
            initSession()
        } else {
            const newGame = Array.from({ length: 5 }).map((_, i) => generateScenario(i))
            setScenarios(newGame)
            setLoading(false)
        }
    }, [user])

    async function initSession() {
        setLoading(true)
        try {
            const { data: history } = await supabase.rpc('get_quest_stats', { user_uuid: user?.id })
            const stats = history || {}

            const playlist = TEMPLATES.sort((a, b) => {
                const statA = stats[a.id] || { attempts: 0, correct: 0 }
                const statB = stats[b.id] || { attempts: 0, correct: 0 }
                const scoreA = getPriorityScore(statA)
                const scoreB = getPriorityScore(statB)
                return scoreB - scoreA
            }).slice(0, 5)

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
        if (stat.attempts === 0) return 10;
        if (stat.correct === 0) return 20;
        return 1;
    }

    const currentScenario = scenarios[currentIndex]

    const handleChoice = async (choice: Choice) => {
        if (selectedChoice) return
        setSelectedChoice(choice)
        playClick()

        if (choice.isCorrect) {
            playSuccess()
            setCombo(prev => prev + 1)

            // Award points + Combo Bonus
            const comboBonus = combo > 1 ? combo * 10 : 0
            const total = choice.points + comboBonus

            setTotalPoints(prev => prev + total)
            awardPoints(total, `Quest: ${currentScenario.title}`)

            setSimulatedScore(prev => Math.min(850, Math.max(300, prev + choice.statImpact.score)))

            confetti({
                particleCount: 100 + (combo * 20),
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#2563eb', '#f59e0b', '#ffd700', '#ffffff'], // Royal Blue, Amber, Gold, White
                shapes: ['square', 'circle'], // Square = Card/Bill, Circle = Coin
                scalar: 1.2,
                gravity: 0.8
            })
        } else {
            playError()
            setCombo(0)
            setShakeScreen(true)
            setTimeout(() => setShakeScreen(false), 400)
            setSimulatedScore(prev => Math.min(850, Math.max(300, prev + choice.statImpact.score)))
        }

        if (user && currentScenario.templateId) {
            await supabase.from('quest_history').insert({
                user_id: user.id,
                template_id: currentScenario.templateId,
                is_correct: choice.isCorrect
            })
        }
    }

    const nextScenario = () => {
        playClick()
        setSelectedChoice(null)
        if (currentIndex < scenarios.length - 1) {
            setCurrentIndex(prev => prev + 1)
        } else {
            setGameCompleted(true)
            playSuccess() // Big success
            awardPoints(500, "Quest Completion Bonus")

            // Trigger Epic Celebration - Wait 3s so user can see Grand Scoreboard
            setTimeout(() => setShowTestCelebration(true), 3000)
        }
    }



    const continueGame = () => {
        playClick()
        initSession()
        setCurrentIndex(0)
        setSelectedChoice(null)
        setGameCompleted(false)
    }

    if (loading) return <div className="min-h-screen bg-[#020412] flex items-center justify-center text-white">Loading Simulation...</div>
    if (!currentScenario && !loading) return <div className="min-h-screen bg-[#020412] flex items-center justify-center text-white">Simulation Error. Please Refresh.</div>

    // Calculate Dynamic XP for Scoreboard
    const currentDisplayXP = initialMooPoints + totalPoints;
    const finalDisplayXP = gameCompleted ? currentDisplayXP + 500 : currentDisplayXP;

    return (
        <div className={cn("min-h-screen bg-[#020412] text-white p-6 md:p-12 font-sans relative overflow-hidden transition-transform duration-100", shakeScreen ? "translate-x-1" : "")}>
            {shakeScreen && <div className="absolute inset-0 bg-red-500/10 z-50 pointer-events-none animate-pulse" />}

            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                <div className="absolute top-10 right-10 w-96 h-96 bg-indigo-600/30 rounded-full blur-[100px]" />
                <div className="absolute bottom-10 left-10 w-64 h-64 bg-emerald-600/20 rounded-full blur-[80px]" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">

                {/* Header Stats - REPLACED WITH COMMAND BOARD */}
                {!gameCompleted && (
                    <div className="mb-12 animate-in slide-in-from-top-4 duration-700">
                        <ScoreBoard
                            creditScore={simulatedScore}
                            xp={currentDisplayXP}
                            streak={combo}
                            rank={currentDisplayXP > 5000 ? "Master Architect" : currentDisplayXP > 2000 ? "Senior Agent" : "Cadet"}
                        />
                    </div>
                )}

                {showTestCelebration && (
                    <LevelUpOverlay
                        newLevel="MASTER ARCHITECT"
                        onDismiss={() => setShowTestCelebration(false)}
                    />
                )}

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
                            <Card className="bg-[#0A0F1E] border-white/10 shadow-2xl overflow-hidden relative">
                                {/* Scenario Header */}
                                <div className="p-8 border-b border-white/5 bg-gradient-to-br from-white/5 via-indigo-900/10 to-transparent relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />

                                    <div className="flex items-center justify-between mb-6 relative z-10">
                                        <div className="flex items-center gap-4">
                                            <Badge variant="outline" className="bg-black/40 border-white/10 text-slate-400 font-mono tracking-wider">
                                                SCENARIO {currentIndex + 1} / {scenarios.length}
                                            </Badge>
                                            {['nuclear_cfpb', 'pay_for_delete', 'piggyback', 'statement_hack'].includes(currentScenario?.templateId) ? (
                                                <Badge className="bg-red-500/20 text-red-300 border-red-500/50 animate-pulse">
                                                    ⚠️ ADVANCED TACTIC
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/50">
                                                    CORE FUNDAMENTAL
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-6 relative z-10">
                                        <div className={cn("p-4 rounded-2xl h-fit shadow-xl backdrop-blur-sm", "bg-black/40 border border-white/10")}>
                                            <currentScenario.icon className={cn("w-10 h-10", currentScenario?.themeColor)} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">{currentScenario?.title}</h2>
                                            <p className="text-lg text-slate-300 leading-relaxed font-light">{currentScenario?.description}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Choices */}
                                <div className="p-8 space-y-4">
                                    {currentScenario?.choices.map((choice) => (
                                        <button
                                            key={choice.id}
                                            onMouseEnter={playHover}
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
                                                            <div className="mt-4 flex items-center justify-between">
                                                                <div className="text-xs opacity-70">
                                                                    Impact: Score {choice.statImpact.score > 0 ? '+' : ''}{choice.statImpact.score}
                                                                </div>

                                                                {['pay_for_delete', 'ghost_debt', 'nuclear_cfpb', 'dispute_law'].includes(currentScenario?.templateId) && (
                                                                    <Button size="sm" variant="outline" className="h-7 text-xs border-indigo-500/30 hover:bg-indigo-500/10 text-indigo-300" onClick={(e) => { e.stopPropagation(); window.open('/dashboard/tools/dispute-generator', '_blank') }}>
                                                                        Open Dispute Tool <ArrowRight className="w-3 h-3 ml-1" />
                                                                    </Button>
                                                                )}
                                                                {['utilize_windfall', 'statement_hack', 'limit_increase'].includes(currentScenario?.templateId) && (
                                                                    <Button size="sm" variant="outline" className="h-7 text-xs border-indigo-500/30 hover:bg-indigo-500/10 text-indigo-300" onClick={(e) => { e.stopPropagation(); window.open('/dashboard/tools/utilization', '_blank') }}>
                                                                        Check Calculator <ArrowRight className="w-3 h-3 ml-1" />
                                                                    </Button>
                                                                )}
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
                        /* COMPLETION SCREEN - GRAND SCOREBOARD */
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-12"
                        >
                            <div className="w-full transform scale-110 mb-12">
                                <ScoreBoard
                                    creditScore={simulatedScore}
                                    xp={finalDisplayXP}
                                    streak={3} // Force high streak visualization
                                    rank={finalDisplayXP > 5000 ? "Master Architect" : "Senior Agent"}
                                />
                            </div>

                            <div className="text-center space-y-4 animate-in slide-in-from-bottom-5 fade-in duration-700 delay-300">
                                <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter">
                                    MISSION ACCOMPLISHED
                                </h1>
                                <p className="text-lg text-slate-300">
                                    Simulation data has been uploaded. Your profile has been updated.
                                </p>

                                <div className="inline-flex items-center gap-4 bg-emerald-500/10 border border-emerald-500/20 px-6 py-3 rounded-full mt-4">
                                    <span className="text-emerald-400 font-bold tracking-widest uppercase text-sm">Session Rewards</span>
                                    <span className="text-2xl font-black text-white">+{totalPoints + 500} XP</span>
                                </div>
                            </div>

                            <div className="flex justify-center gap-4 mt-12 animate-in slide-in-from-bottom-5 fade-in duration-700 delay-500">
                                <Button onClick={continueGame} className="bg-indigo-600 hover:bg-indigo-500 text-white h-12 px-8 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                                    Continue Training (Endless)
                                </Button>
                                <Button variant="outline" className="border-white/10 hover:bg-white/5 text-slate-300 h-12 px-8 rounded-full" onClick={() => window.location.href = '/dashboard'}>
                                    Return to HQ
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    )
}
