
import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FOUNDATION_SYLLABI } from '@/components/dashboard/FoundationSyllabi'
import { useFoundationProgress } from '@/hooks/useFoundationProgress'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, Lock, ArrowRight, Play, Pause, Volume2, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

export default function FreshmanClassroom() {
    const { classId } = useParams()
    const navigate = useNavigate()
    const { completeLesson, completedLessons } = useFoundationProgress()

    // Find current class based on ID (adjusting to string/number logic if needed)
    // Syllabus uses 'freshman-1', 'freshman-2'. URL might be '1', '2'.
    const currentClass = FOUNDATION_SYLLABI.find(c => c.id === `freshman-${classId}`) || FOUNDATION_SYLLABI[0]

    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const [actionVerified, setActionVerified] = useState(false)
    const [isCompleted, setIsCompleted] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)

    // Check if previously completed
    useEffect(() => {
        if (completedLessons.has(currentClass.id)) {
            setIsCompleted(true)
            setProgress(100)
            setActionVerified(true)
        } else {
            setIsCompleted(false)
            setProgress(0)
            setActionVerified(false)
        }
    }, [currentClass.id, completedLessons])

    // Video Progress Simulation (since we might not have real 5min video)
    useEffect(() => {
        if (isPlaying && progress < 100 && !isCompleted) {
            const timer = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(timer)
                        return 100
                    }
                    return prev + 0.5 // Simulate progress
                })
            }, 100)
            return () => clearInterval(timer)
        }
    }, [isPlaying, progress, isCompleted])

    const handleActionVerify = () => {
        if (progress < 95 && !isCompleted) {
            alert("Please watch the lecture before completing the action step.")
            return
        }
        setActionVerified(true)
        if (!isCompleted) {
            handleCompletion()
        }
    }

    const handleCompletion = () => {
        completeLesson(currentClass.id, currentClass.xp_reward)
        setIsCompleted(true)
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        })
    }

    const handleNext = () => {
        const nextId = parseInt(classId || '1') + 1
        if (nextId <= 5) {
            navigate(`/dashboard/class/freshman/${nextId}`)
        } else {
            navigate('/dashboard')
        }
    }

    return (
        <div className="min-h-screen bg-[#020412] text-white p-6 md:p-12 relative overflow-hidden">
            {/* Atmosphere */}
            <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-indigo-900/20 to-transparent pointer-events-none"></div>

            <div className="max-w-5xl mx-auto relative z-10">

                {/* Header / Professor Identity */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-white/10">
                                <User size={16} className="text-slate-400" />
                            </div>
                            <span className="text-sm font-bold text-slate-400 tracking-wider uppercase">Dr. Leverage • Professor of Personal Credit Systems</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-heading font-black text-white">{currentClass.title}</h1>
                        <p className="text-slate-400 mt-2 text-lg">{currentClass.description}</p>
                    </div>
                    {/* Progress Indicator */}
                    <div className="hidden md:block text-right">
                        <div className="text-2xl font-mono font-bold text-indigo-400">Class {classId} / 5</div>
                        <div className="text-xs text-slate-500 uppercase tracking-widest">Freshman Orientation</div>
                    </div>
                </div>

                {/* Main Classroom Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT: Video Player (Hybrid Format) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="relative aspect-video bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
                            {/* Simulate Hybrid Video: Professor + B-Roll */}
                            <video
                                ref={videoRef}
                                src="/assets/hero-background.mp4"
                                className={`w-full h-full object-cover transition-opacity duration-1000 ${isPlaying ? 'opacity-100' : 'opacity-60'}`}
                                loop
                                muted // Muted for auto-play simulation, normally unmuted
                                playsInline
                            />

                            {/* Overlay Controls */}
                            {!isPlaying && !isCompleted && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                                    <button
                                        onClick={() => { setIsPlaying(true); videoRef.current?.play() }}
                                        className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:scale-110 transition-transform group-hover:bg-indigo-600 group-hover:border-indigo-500"
                                    >
                                        <Play size={32} className="ml-1 text-white" />
                                    </button>
                                </div>
                            )}

                            {/* Progress Bar */}
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
                                <div
                                    className="h-full bg-indigo-500 transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Truth Drop Section */}
                        <div className="p-6 bg-indigo-900/10 border-l-4 border-indigo-500 rounded-r-xl">
                            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">The Truth Drop</h3>
                            <p className="text-xl font-heading font-bold text-white italic">
                                "{currentClass.title === 'The Credit Mindset Reset' ? 'You are not your score.' :
                                    currentClass.title.includes('Payment') ? 'Lenders do not care about your excuses, only your patterns.' :
                                        'Mathematics is the only language the credit bureau speaks.'}"
                            </p>
                        </div>
                    </div>

                    {/* RIGHT: Action & Authority */}
                    <div className="space-y-6">

                        {/* Action Card */}
                        <Card className="bg-[#0A0F1E] border-white/10 h-fit">
                            <CardContent className="p-6 space-y-6">
                                <div>
                                    <h3 className="font-bold text-white text-lg flex items-center gap-2 mb-1">
                                        <CheckCircle2 className="text-emerald-500" size={20} /> Action Step
                                    </h3>
                                    <p className="text-sm text-slate-400 leading-relaxed">
                                        {currentClass.action_step || "Complete the observation assignment."}
                                    </p>
                                </div>

                                <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Assignment Status</h4>
                                    {isCompleted || actionVerified ? (
                                        <div className="flex items-center gap-2 text-emerald-400 font-bold bg-emerald-500/10 p-2 rounded-lg justify-center">
                                            <CheckCircle2 size={16} /> COMPLETED
                                        </div>
                                    ) : (
                                        <Button
                                            onClick={handleActionVerify}
                                            disabled={progress < 95}
                                            className="w-full bg-white/5 hover:bg-emerald-600/20 hover:text-emerald-400 text-slate-400 border border-white/10"
                                        >
                                            {progress < 95 ? `Watch Lecture (${Math.round(progress)}%)` : "Mark Assignment Complete"}
                                        </Button>
                                    )}
                                </div>

                                {/* Next Class Navigation */}
                                {(isCompleted || actionVerified) && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <Button
                                            onClick={handleNext}
                                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-12 shadow-[0_0_20px_rgba(79,70,229,0.3)]"
                                        >
                                            {parseInt(classId || '0') < 5 ? "Proceed to Next Class" : "Graduate Orientation"} <ArrowRight className="ml-2 w-4 h-4" />
                                        </Button>
                                    </motion.div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Authority Line */}
                        <div className="text-center">
                            <p className="text-[10px] text-slate-600 uppercase tracking-[0.2em]">Credit University • Est. 2024</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
