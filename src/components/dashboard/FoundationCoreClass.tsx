import { CheckCircle2, Clock, PlayCircle, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { FOUNDATION_SYLLABI } from './FoundationSyllabi'
import { useNavigate } from 'react-router-dom'
import { useFoundationProgress } from '@/hooks/useFoundationProgress'

export function FoundationCoreClass() {
    const navigate = useNavigate()
    const { completedLessons, completeLesson, loading } = useFoundationProgress()

    const handleStartLesson = (lesson: any) => {
        if (lesson.content_url.startsWith('/')) {
            navigate(lesson.content_url)
        } else {
            // External Video Handling
            window.open(lesson.content_url, '_blank')
            // Optionally auto-complete or setup listeners here
            completeLesson(lesson.id, 50) // Small "started" bonus? Or just rely on manual complete.
        }
    }

    const completedCount = completedLessons.size
    const progressPercent = (completedCount / FOUNDATION_SYLLABI.length) * 100

    return (
        <Card className="bg-[#0A0F1E] border-white/10 hover:border-indigo-500/30 transition-all">
            <CardHeader>
                <div className="flex justify-between items-center mb-2">
                    <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 uppercase tracking-widest text-[10px]">
                        Dr. Leverage Approved
                    </Badge>
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
                        <Clock size={12} /> 25m Total
                    </div>
                </div>
                <CardTitle className="text-2xl font-heading text-white">Foundation Core</CardTitle>
                <CardDescription className="text-slate-400">
                    Mandatory protocols before accessing the Global Campus.
                </CardDescription>
                <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1 text-slate-500 font-bold uppercase tracking-wider">
                        <span>Modules Completed</span>
                        <span>{completedCount} / {FOUNDATION_SYLLABI.length}</span>
                    </div>
                    {/* @ts-ignore */}
                    <Progress value={progressPercent} className="h-2 bg-slate-800" />
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {/* Dean's Welcome Message */}
                <div className="mb-4 rounded-xl overflow-hidden border border-white/10 bg-black shadow-lg relative group">
                    <video
                        src="/assets/dean-welcome.mp4"
                        controls
                        className="w-full aspect-video object-cover opacity-90 hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute bottom-3 left-3 z-10">
                        <p className="text-xs font-bold text-white shadow-black drop-shadow-md">Dean's Transmission</p>
                    </div>
                </div>

                {FOUNDATION_SYLLABI.map((lesson, index) => {
                    const isCompleted = completedLessons.has(lesson.id)
                    const isLocked = index > 0 && !completedLessons.has(FOUNDATION_SYLLABI[index - 1].id)

                    if (loading) return <div key={lesson.id} className="h-16 bg-white/5 rounded-xl animate-pulse" />

                    return (
                        <div
                            key={lesson.id}
                            className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${isLocked
                                ? 'bg-black/20 border-white/5 opacity-50 cursor-not-allowed'
                                : 'bg-slate-900/40 border-white/5 hover:bg-slate-800/60 hover:border-indigo-500/20 cursor-pointer'
                                }`}
                            onClick={() => !isLocked && handleStartLesson(lesson)}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isCompleted ? 'bg-emerald-500/20 text-emerald-400' :
                                isLocked ? 'bg-slate-800 text-slate-600' : 'bg-indigo-500/20 text-indigo-400'
                                }`}>
                                {isCompleted ? <CheckCircle2 size={16} /> : isLocked ? <Lock size={16} /> : <PlayCircle size={16} />}
                            </div>

                            <div className="flex-1">
                                <h4 className={`text-sm font-bold ${isLocked ? 'text-slate-500' : 'text-white'}`}>{lesson.title}</h4>
                                <p className="text-xs text-slate-500 line-clamp-1">{lesson.description}</p>
                            </div>

                            {!isLocked && !isCompleted && (
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 text-[10px] uppercase font-bold text-slate-400 hover:text-white"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        completeLesson(lesson.id, lesson.xp_reward)
                                    }}
                                >
                                    Mark Done
                                </Button>
                            )}

                            {isCompleted && (
                                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider px-2">Complete</span>
                            )}
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    )
}

function Badge({ children, className }: any) {
    return <span className={`px-2 py-0.5 rounded text-xs font-semibold ${className}`}>{children}</span>
}
