
import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ChevronLeft, CheckCircle, Lock, Menu, Check, Circle, Loader2, AlertTriangle, AlertCircle, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCourse, Lesson } from '@/hooks/useCourse'
import ReactMarkdown from 'react-markdown'
import { getLessonContent, getLessonContentByTitle } from '@/lib/lesson-content-map'

export default function CoursePlayer() {
    const { courseId } = useParams<{ courseId: string }>()
    const { course, loading, error, markLessonComplete } = useCourse(courseId)
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
    const [localNotes, setLocalNotes] = useState('')

    // Load notes when lesson changes
    useEffect(() => {
        if (activeLesson) {
            const saved = localStorage.getItem(`notes-${activeLesson.id}`)
            setLocalNotes(saved || '')
        }
    }, [activeLesson])

    const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value
        setLocalNotes(val)
        if (activeLesson) {
            localStorage.setItem(`notes-${activeLesson.id}`, val)
        }
    }

    useEffect(() => {
        if (course && !activeLesson) {
            const allLessons = course.modules.flatMap(m => m.lessons)
            // If lessons exist, pick the first unlock uncompleted request or just the first
            if (allLessons.length > 0) {
                const firstUncompleted = allLessons.find(l => !l.isCompleted && !l.isLocked)
                const lessonToSet = firstUncompleted || allLessons[0] || null
                console.log('🎯 Setting active lesson:', lessonToSet?.title)
                console.log('📝 Lesson has content_markdown:', !!lessonToSet?.content_markdown)
                console.log('📏 Content length:', lessonToSet?.content_markdown?.length)
                console.log('📄 Full lesson object:', lessonToSet)
                setActiveLesson(lessonToSet)
            }
        }
    }, [course, activeLesson])

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center flex-col gap-4 bg-[#020412]">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                <p className="text-indigo-300 font-mono text-xs animate-pulse tracking-widest">INITIALIZING NEURAL LINK...</p>
            </div>
        )
    }

    if (error || !course) {
        return (
            <div className="flex flex-col h-screen items-center justify-center space-y-6 bg-[#020412] p-6 text-center">
                <AlertCircle className="w-16 h-16 text-red-500 opacity-80" />
                <div>
                    <h2 className="text-white font-bold text-2xl mb-2">Signal Lost</h2>
                    <p className="text-slate-400 max-w-lg mb-4">
                        {error ? error.message : "The requested frequency could not be established. The course data may be corrupted or permission is denied."}
                    </p>
                </div>
                <div className="bg-white/5 p-4 rounded border border-white/10 font-mono text-xs text-slate-500">
                    ERR_ID: {courseId || "UNKNOWN"}
                </div>
                <Link to="/dashboard/curriculum">
                    <Button variant="outline" className="border-indigo-500/30 text-indigo-300 hover:text-white hover:bg-indigo-500/20">
                        <ChevronLeft className="w-4 h-4 mr-2" /> Return to Intelligence Center
                    </Button>
                </Link>
            </div>
        )
    }

    const handleLessonSelect = (lesson: Lesson) => {
        if (!lesson.isLocked) {
            setActiveLesson(lesson)
            if (window.innerWidth < 768) setSidebarOpen(false)
        }
    }

    const handleComplete = async () => {
        if (activeLesson) {
            await markLessonComplete(activeLesson.id)
            // awardPoints handed by RPC in markLessonComplete
        }
    }

    return (
        <div className="flex h-[calc(100vh-5rem)] bg-[#020412] text-white overflow-hidden rounded-tl-2xl">
            {/* Sidebar */}
            <aside className={cn(
                "w-80 border-r border-white/5 bg-[#050B1D] flex flex-col transition-all duration-300 absolute md:relative z-30 h-full",
                sidebarOpen ? "translate-x-0" : "-translate-x-full md:w-0 md:opacity-0 md:translate-x-0"
            )}>
                <div className="p-6 border-b border-white/5 bg-black/20">
                    <h3 className="font-heading font-bold text-lg leading-tight text-white mb-2">{course.title}</h3>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div
                            className="bg-emerald-500 h-full transition-all duration-500"
                            style={{ width: `${course.progress || 0}%` }}
                        ></div>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-wider font-bold">{course.progress || 0}% Completed</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar">
                    {course.modules.length === 0 && (
                        <div className="p-4 text-center">
                            <p className="text-xs text-slate-500 italic">No modules available yet.</p>
                        </div>
                    )}

                    {course.modules.map((module, idx) => (
                        <div key={module.id}>
                            <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] mb-3 px-3">
                                Module {idx + 1}: {module.title}
                            </h4>
                            <div className="space-y-1">
                                {module.lessons.map((lesson) => {
                                    const isActive = activeLesson?.id === lesson.id
                                    return (
                                        <button
                                            key={lesson.id}
                                            onClick={() => handleLessonSelect(lesson)}
                                            disabled={lesson.isLocked}
                                            className={cn(
                                                "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left text-sm transition-all group",
                                                isActive ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-400/50" : "text-slate-400 hover:bg-white/5 hover:text-white",
                                                lesson.isLocked && "opacity-40 cursor-not-allowed hover:bg-transparent hover:text-slate-400"
                                            )}
                                        >
                                            {lesson.isCompleted ? (
                                                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                                            ) : lesson.isLocked ? (
                                                <Lock className="w-4 h-4 shrink-0" />
                                            ) : (
                                                <div className={cn("w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center", isActive ? "border-white" : "border-slate-600")}>
                                                    {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>}
                                                </div>
                                            )}

                                            <div className="flex-1 truncate font-medium">{lesson.title}</div>
                                            <span className="text-[10px] opacity-60 font-mono">{lesson.duration_minutes}m</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Main Player Area */}
            <div className="flex-1 flex flex-col overflow-hidden relative bg-[#020412]">
                <button
                    className="absolute top-4 left-4 z-40 md:hidden p-2 bg-indigo-600 rounded-lg text-white shadow-lg"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    <Menu className="w-5 h-5" />
                </button>

                {!sidebarOpen && (
                    <button
                        className="hidden md:flex absolute top-4 left-4 z-40 p-2 bg-white/5 rounded-lg text-slate-400 hover:text-white border border-white/5 hover:border-white/20 transition-all"
                        onClick={() => setSidebarOpen(true)}
                        title="Show Menu"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                )}

                <div className="flex-1 p-6 md:p-10 overflow-y-auto custom-scrollbar">
                    {activeLesson ? (
                        <div className="max-w-5xl mx-auto space-y-8 pb-20">

                            {/* Breadcrumb */}
                            <Link to="/dashboard/curriculum" className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-indigo-400 uppercase tracking-widest transition-colors mb-4">
                                <ChevronLeft className="w-4 h-4 mr-1" /> Back to Intelligence Center
                            </Link>

                            {/* Content Stage */}
                            <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative group">
                                {/* Video Player (Primary) */}
                                {activeLesson.type === 'video' && activeLesson.video_url && (
                                    <div className="aspect-video bg-black relative border-b border-white/10">
                                        {(activeLesson.video_url?.includes('embed') || activeLesson.video_url?.includes('youtube') || activeLesson.video_url?.includes('vimeo')) ? (
                                            <iframe
                                                src={activeLesson.video_url}
                                                className="w-full h-full"
                                                title={activeLesson.title}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        ) : (
                                            <video
                                                key={activeLesson.id} // Force reload on lesson change
                                                src={activeLesson.video_url}
                                                className="w-full h-full object-cover"
                                                controls
                                                poster="/assets/poster-default.jpg"
                                            >
                                                Your browser does not support the video tag.
                                            </video>
                                        )}
                                    </div>
                                )}

                                {/* Lesson Content (Text) */}
                                <div className="p-8 md:p-12 min-h-[500px] bg-gradient-to-br from-[#0A0F1E] to-[#020412]">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                                            <BookOpen className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-indigo-400 font-mono uppercase tracking-wider">Lesson {activeLesson.order_index + 1}</div>
                                            <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">
                                                {activeLesson.title}
                                            </h1>
                                        </div>
                                    </div>

                                    <div id="amara-page-content" className="prose prose-invert prose-lg max-w-none text-slate-300 course-content">
                                        {(() => {
                                            // Try to get content from lesson object first
                                            let content = activeLesson.content_markdown;

                                            // If not available, try to get from content map by ID
                                            if (!content && activeLesson.id) {
                                                content = getLessonContent(activeLesson.id);
                                            }

                                            // If still not available, try by title
                                            if (!content && activeLesson.title) {
                                                content = getLessonContentByTitle(activeLesson.title);
                                            }

                                            // Display content or fallback
                                            if (content) {
                                                return <ReactMarkdown>{content}</ReactMarkdown>;
                                            } else {
                                                return (
                                                    <div className="space-y-4">
                                                        <p className="text-lg leading-relaxed">
                                                            This lesson covers important concepts in credit education.
                                                            The content is being prepared for optimal learning.
                                                        </p>
                                                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-6">
                                                            <h3 className="text-indigo-400 font-bold mb-2">Key Topics</h3>
                                                            <ul className="space-y-2 text-slate-300">
                                                                <li>Understanding credit fundamentals</li>
                                                                <li>Building strong financial habits</li>
                                                                <li>Protecting your credit score</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        })()}
                                    </div>
                                </div>
                            </div>

                            {/* Action Area */}
                            <div className="flex flex-col md:flex-row justify-between items-center gap-6 p-6 bg-white/5 border border-white/5 rounded-2xl">
                                <div>
                                    <h3 className="text-white font-bold text-sm uppercase tracking-wide">Lesson Status</h3>
                                    <p className="text-slate-400 text-sm">Action required to proceed.</p>
                                </div>
                                <Button
                                    size="lg"
                                    className={cn(
                                        "min-w-[200px] h-12 font-bold tracking-wide transition-all",
                                        activeLesson.isCompleted
                                            ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                                            : "bg-white text-black hover:bg-slate-200"
                                    )}
                                    onClick={handleComplete}
                                    disabled={activeLesson.isCompleted}
                                >
                                    {activeLesson.isCompleted ? (
                                        <>COMPLETED <Check className="ml-2 w-5 h-5" /></>
                                    ) : (
                                        <>MARK COMPLETE <Circle className="ml-2 w-5 h-5 fill-black text-black" /></>
                                    )}
                                </Button>
                            </div>

                            {/* Field Notes (DO MORE Feature) */}
                            <div className="p-6 bg-[#050B1D] border border-white/5 rounded-2xl">
                                <h3 className="text-xs font-bold uppercase text-indigo-400 mb-4 tracking-widest flex items-center gap-2">
                                    <BookOpen className="w-4 h-4" /> Field Notes
                                </h3>
                                <textarea
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-slate-300 min-h-[150px] focus:outline-none focus:border-indigo-500/50 resize-y text-sm font-mono leading-relaxed"
                                    placeholder="// Record tactical observations here..."
                                    value={localNotes}
                                    onChange={handleNoteChange}
                                />
                                <div className="flex justify-end mt-2 text-[10px] text-slate-600 font-mono">
                                    AUTO-SAVED TO LOCAL STORAGE
                                </div>
                            </div>

                        </div>
                    ) : (
                        <div className="flex h-full items-center justify-center flex-col gap-6 text-slate-600">
                            {course.modules.length === 0 ? (
                                <>
                                    <AlertTriangle className="w-16 h-16 opacity-30 text-amber-500" />
                                    <div className="text-center">
                                        <p className="font-heading font-bold text-lg text-slate-400">Classified Content</p>
                                        <p className="text-sm font-mono mt-2">No learning modules have been declassified for this course yet.</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Lock className="w-16 h-16 opacity-20" />
                                    <p className="font-mono text-sm uppercase tracking-widest">Select a frequency to begin transmission</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
