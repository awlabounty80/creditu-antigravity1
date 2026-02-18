
import { useState, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, CheckCircle, Lock, Menu, Check, Circle, Loader2, AlertTriangle, AlertCircle, BookOpen, Search, Copy, Terminal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useCourse, Lesson } from '@/hooks/useCourse'
import ReactMarkdown from 'react-markdown'
import { getLessonContent, getLessonContentByTitle } from '@/lib/lesson-content-map'
import { ProfessorGenerative } from '@/components/dashboard/ProfessorGenerative'
import { AdvancedProfessorPlayer } from '@/components/dashboard/AdvancedProfessorPlayer'

function SmartVideoPlayer({ src }: { src: string }) {
    const bgRef = useRef<HTMLVideoElement>(null)
    const mainRef = useRef<HTMLVideoElement>(null)

    const syncPlay = () => bgRef.current?.play()
    const syncPause = () => bgRef.current?.pause()
    const syncTime = () => {
        if (bgRef.current && mainRef.current && Math.abs(bgRef.current.currentTime - mainRef.current.currentTime) > 0.5) {
            bgRef.current.currentTime = mainRef.current.currentTime
        }
    }

    return (
        <div className="relative w-full h-full overflow-hidden bg-black/95 border border-white/10 rounded-3xl shadow-2xl ring-1 ring-white/5 group">
            {/* Ambient Background (Blurred & Darkened) */}
            <div className="absolute inset-0 z-0">
                <video
                    ref={bgRef}
                    src={src}
                    className="w-full h-full object-cover blur-3xl opacity-20 scale-125 pointer-events-none"
                    muted
                    loop
                    playsInline
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020412] via-transparent to-[#020412]/50" />
            </div>

            {/* Main Content (Windowed & Contained) */}
            <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
                <div className="relative w-full h-full overflow-hidden rounded-2xl border border-white/5 shadow-inner bg-black/50">
                    <video
                        ref={mainRef}
                        src={src}
                        className="w-full h-full object-contain"
                        controls
                        playsInline
                        onPlay={syncPlay}
                        onPause={syncPause}
                        onTimeUpdate={syncTime}
                        onSeeked={syncTime}
                    >
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>
        </div>
    )
}

export default function CoursePlayer() {
    const { courseId } = useParams<{ courseId: string }>()
    const { course, loading, error, markLessonComplete } = useCourse(courseId)
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
    const [localNotes, setLocalNotes] = useState('')
    const [bypassLoading, setBypassLoading] = useState(false)

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
                setActiveLesson(lessonToSet)
            }
        }
    }, [course, activeLesson])

    // Sync activeLesson with course updates (e.g. completion status)
    useEffect(() => {
        if (course && activeLesson) {
            const updatedLesson = course.modules
                .flatMap(m => m.lessons)
                .find(l => l.id === activeLesson.id)

            // Only update if completion status actually changed
            if (updatedLesson && updatedLesson.isCompleted !== activeLesson.isCompleted) {
                console.log('🔄 Syncing active lesson status:', updatedLesson.isCompleted);
                setActiveLesson(updatedLesson)
            }
        }
    }, [course]) // Only run when course data changes (e.g. after markLessonComplete)

    if (loading && !bypassLoading) {
        return (
            <div className="flex h-screen items-center justify-center flex-col gap-4 bg-[#020412]">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                <p className="text-indigo-300 font-mono text-xs animate-pulse tracking-widest">INITIALIZING NEURAL LINK...</p>

                {/* Fallback Escape Hatch */}
                <Button
                    variant="link"
                    className="text-xs text-slate-600 hover:text-indigo-400 mt-4 font-mono"
                    onClick={() => setBypassLoading(true)}
                >
                    [BYPASS SECURITY CHECK]
                </Button>
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
            {/* Sidebar (Tactical Menu) */}
            <aside className={cn(
                "w-80 border-r border-white/5 bg-[#0A0F1E]/95 backdrop-blur-xl flex flex-col transition-all duration-300 absolute md:relative z-30 h-full shadow-2xl",
                sidebarOpen ? "translate-x-0" : "-translate-x-full md:w-0 md:opacity-0 md:translate-x-0"
            )}>
                {/* Decorative Top Line */}
                <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500"></div>

                <div className="p-6 border-b border-white/5 bg-gradient-to-br from-indigo-950/20 to-transparent relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 bg-indigo-500/10 rounded-full blur-xl -mr-6 -mt-6"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                                Secure Uplink
                            </span>
                            <span className="text-[10px] font-bold text-slate-500">{course.progress || 0}% Complete</span>
                        </div>
                        <h3 className="font-heading font-bold text-lg leading-tight text-white mb-3 shadow-black drop-shadow-md">{course.title}</h3>

                        {/* Progress Bar */}
                        <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden border border-white/5">
                            <div
                                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                                style={{ width: `${course.progress || 0}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar relative">
                    {/* Background Grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-20"></div>

                    {course.modules.length === 0 && (
                        <div className="p-4 text-center relative z-10">
                            <p className="text-xs text-slate-500 italic">No modules available yet.</p>
                        </div>
                    )}

                    {course.modules.map((module, idx) => (
                        <div key={module.id} className="relative z-10">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 px-3 flex items-center gap-2">
                                <span className="w-4 h-px bg-slate-700"></span>
                                Phase {idx + 1}: {module.title}
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
                                                "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left text-sm transition-all group relative overflow-hidden",
                                                isActive ? "bg-indigo-600/10 border border-indigo-500/30 text-white shadow-[0_0_15px_rgba(99,102,241,0.15)]" : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent",
                                                lesson.isLocked && "opacity-40 cursor-not-allowed hover:bg-transparent hover:text-slate-400"
                                            )}
                                        >
                                            {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>}

                                            {lesson.isCompleted ? (
                                                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                                            ) : lesson.isLocked ? (
                                                <Lock className="w-4 h-4 shrink-0" />
                                            ) : (
                                                <div className={cn("w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors", isActive ? "border-indigo-400" : "border-slate-700 group-hover:border-slate-500")}>
                                                    {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>}
                                                </div>
                                            )}

                                            <div className="flex-1 truncate font-medium">{lesson.title}</div>
                                            <span className="text-[10px] opacity-60 font-mono hidden md:block">{lesson.duration_minutes}m</span>
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
                            {/* Breadcrumb */}
                            <div className="flex justify-center w-full mb-4">
                                <Link to="/dashboard/curriculum" className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-indigo-400 uppercase tracking-widest transition-colors">
                                    <ChevronLeft className="w-4 h-4 mr-1" /> Back to Intelligence Center
                                </Link>
                            </div>

                            {/* Video/Content Stage (Neural Interface) */}
                            <div className="bg-[#050B1D] border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] relative group ring-1 ring-white/5 hover:ring-indigo-500/30 transition-all duration-500">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-50"></div>

                                {/* Video Player (Primary) - With Authorized Source Fallback */}
                                {activeLesson.type === 'video' && (activeLesson.video_url || activeLesson.video_object?.external_resource_url) && (
                                    <div className="aspect-[4/3] bg-black relative border-b border-white/10">
                                        {(() => {
                                            // ============================================
                                            // SOURCE LOCK SECURITY - DOMAIN WHITELIST
                                            // ============================================
                                            const AUTHORIZED_DOMAINS = [
                                                'consumerfinance.gov', 'consumer.ftc.gov', 'khanacademy.org',
                                                'fdic.gov', 'vimeo.com', 'player.vimeo.com', 'youtube.com', 'youtu.be',
                                                'mymoney.gov', 'nfcc.org', 'pbs.org',
                                                'experian.com', 'equifax.com', 'transunion.com', 'supabase.co'
                                            ];

                                            const primaryVideo = activeLesson.video_url;
                                            const externalUrl = activeLesson.video_object?.external_resource_url;

                                            // SECURITY CHECK: Validate video source domain
                                            const isAuthorizedDomain = (url: string | undefined) => {
                                                if (!url) return false;
                                                // Local assets are always authorized
                                                if (url.startsWith('/')) return true;

                                                try {
                                                    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
                                                    return AUTHORIZED_DOMAINS.some(domain => urlObj.hostname.includes(domain));
                                                } catch {
                                                    return false;
                                                }
                                            };

                                            // Block unauthorized sources
                                            if (primaryVideo && !isAuthorizedDomain(primaryVideo)) {
                                                return (
                                                    <div className="w-full h-full flex items-center justify-center bg-red-900/20">
                                                        <div className="text-center p-8">
                                                            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                                                            <p className="text-white font-bold text-lg">Unauthorized Video Source</p>
                                                            <p className="text-slate-400 text-sm mt-2">This video source is not from an approved educational domain</p>
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            // CHECK FOR GENERATIVE PROFESSOR (ADVANCED VS STANDARD)
                                            // Fix: If URL is from Supabase (user uploaded), treat as standard video, NOT AI
                                            const isSupabaseVideo = primaryVideo?.includes('supabase.co');

                                            const isGenerative = !isSupabaseVideo && (
                                                !!activeLesson.video_mode ||
                                                primaryVideo?.includes('generative') ||
                                                activeLesson.video_object?.type === 'ai_professor' ||
                                                (activeLesson.transcript && !primaryVideo?.startsWith('http'))
                                            );

                                            if (isGenerative && activeLesson.transcript) {
                                                const isAdvanced = !!activeLesson.video_mode || primaryVideo?.includes('generative-advanced');
                                                return (
                                                    <div className="w-full h-full bg-black">
                                                        {isAdvanced ? (
                                                            <AdvancedProfessorPlayer
                                                                key={activeLesson.id}
                                                                transcript={activeLesson.transcript}
                                                                videoUrl={primaryVideo?.split('?')[0]}
                                                                initialMode={activeLesson.video_mode === 'AVATAR' ? 'avatar' : 'video'}
                                                                onComplete={() => {
                                                                    if (!activeLesson.isCompleted) {
                                                                        markLessonComplete(activeLesson.id);
                                                                    }
                                                                }}
                                                            />
                                                        ) : (
                                                            <ProfessorGenerative
                                                                key={activeLesson.id}
                                                                transcript={activeLesson.transcript}
                                                                onComplete={() => {
                                                                    if (!activeLesson.isCompleted) {
                                                                        markLessonComplete(activeLesson.id);
                                                                    }
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                );
                                            }

                                            // Video source detection
                                            const isExternalEmbed = primaryVideo?.startsWith('http');
                                            const isVimeo = primaryVideo?.includes('vimeo.com') || externalUrl?.includes('vimeo.com');
                                            const isKhanAcademy = primaryVideo?.includes('khanacademy.org') || externalUrl?.includes('khanacademy.org');
                                            const isYouTube = primaryVideo?.includes('youtube.com') || primaryVideo?.includes('youtu.be') ||
                                                externalUrl?.includes('youtube.com') || externalUrl?.includes('youtu.be');
                                            const isGovResource = primaryVideo?.includes('.gov') || externalUrl?.includes('.gov');

                                            // Generate embed URL
                                            let embedSrc = '';

                                            // If primary video is already a player URL (Vimeo, Khan, YouTube), use it directly
                                            if (isExternalEmbed && (isVimeo || isKhanAcademy || isYouTube || primaryVideo?.includes('player.vimeo.com'))) {
                                                embedSrc = primaryVideo || '';
                                            }
                                            // Otherwise, try to generate embed from external URL
                                            else if (isKhanAcademy && externalUrl && !embedSrc) {
                                                const match = externalUrl.match(/\/v\/([^?]+)/);
                                                if (match) {
                                                    embedSrc = `https://www.khanacademy.org/embed_video?v=${match[1]}`;
                                                }
                                            } else if (isYouTube && externalUrl && !embedSrc) {
                                                const videoId = externalUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/)?.[1];
                                                if (videoId) {
                                                    embedSrc = `https://www.youtube.com/embed/${videoId}`;
                                                }
                                            }

                                            // Render iframe for external embeds
                                            if (embedSrc) {
                                                return (
                                                    <iframe
                                                        src={embedSrc}
                                                        className="w-full h-full"
                                                        title={activeLesson.title}
                                                        frameBorder="0"
                                                        allow="autoplay; fullscreen; picture-in-picture"
                                                        allowFullScreen
                                                    />
                                                );
                                            }

                                            // .GOV RESOURCE FALLBACK: Large styled button
                                            if (isGovResource && (primaryVideo || externalUrl)) {
                                                const resourceUrl = primaryVideo || externalUrl || '';
                                                return (
                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900/20 to-indigo-900/20">
                                                        <div className="text-center p-8 max-w-md">
                                                            <div className="mb-6">
                                                                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
                                                                    <BookOpen className="w-10 h-10 text-white" />
                                                                </div>
                                                                <p className="text-white font-bold text-xl mb-2">Official Government Resource</p>
                                                                <p className="text-slate-300 text-sm">This educational content is hosted on an official U.S. government website</p>
                                                            </div>
                                                            <a
                                                                href={resourceUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-lg transition-all shadow-2xl hover:shadow-blue-500/50 hover:scale-105"
                                                            >
                                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                                </svg>
                                                                Launch Official Education Video
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                                </svg>
                                                            </a>
                                                            <p className="text-slate-500 text-xs mt-4">Opens in new tab • Secured by HTTPS</p>
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            // Render local video player OR direct MP4 (Supabase)
                                            // Fix: Allow http links if they are direct video files or Supabase storage
                                            const isDirectVideo = primaryVideo?.endsWith('.mp4') || primaryVideo?.includes('supabase.co');

                                            if (primaryVideo && (!isExternalEmbed || isDirectVideo)) {
                                                return (
                                                    <SmartVideoPlayer src={primaryVideo} />
                                                );
                                            }

                                            // No playable video, show placeholder
                                            return (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-900/20 to-purple-900/20">
                                                    <div className="text-center p-8">
                                                        <BookOpen className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
                                                        <p className="text-white font-bold text-lg">Educational Resource Available</p>
                                                        <p className="text-slate-400 text-sm mt-2">Click "Watch Resource" below to view content</p>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                )}

                                {/* AUTHORIZED EDUCATIONAL RESOURCE LINK */}
                                {activeLesson.video_object?.external_resource_url && (
                                    <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-b border-indigo-500/30 p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <BookOpen className="w-5 h-5 text-indigo-400" />
                                                <div>
                                                    <p className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Authorized Educational Resource</p>
                                                    <p className="text-sm text-white">{activeLesson.video_object.external_resource_title || 'Public Education Material'}</p>
                                                </div>
                                            </div>
                                            <a
                                                href={activeLesson.video_object.external_resource_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-sm transition-all flex items-center gap-2 shadow-lg"
                                            >
                                                Watch Resource
                                                <ChevronRight className="w-4 h-4" />
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {/* Lesson Content (Text) */}
                                <div className="p-8 md:p-12 min-h-[500px] bg-gradient-to-br from-[#0A0F1E] to-[#020412]">
                                    <div className="flex items-center justify-center gap-3 mb-6">
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
                                            // THIS IS THE CRITICAL FIX: The map likely has the content if the DB doesn't yet
                                            if (!content && activeLesson.id) {
                                                content = getLessonContent(activeLesson.id);
                                            }

                                            // If still not available, try by title
                                            if (!content && activeLesson.title) {
                                                content = getLessonContentByTitle(activeLesson.title);
                                            }

                                            // Force debug log to see what we are getting
                                            console.log('Markdown Render:', {
                                                id: activeLesson.id,
                                                hasDirectContent: !!activeLesson.content_markdown,
                                                hasMapContent: !!getLessonContent(activeLesson.id),
                                                finalContentLength: content?.length
                                            });

                                            // Display content or fallback
                                            if (content) {
                                                return <ReactMarkdown>{content}</ReactMarkdown>;
                                            } else {
                                                return (
                                                    <div className="space-y-4">
                                                        <p className="text-lg leading-relaxed text-slate-300">
                                                            {"Loading content secure stream..."}
                                                        </p>
                                                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-6">
                                                            <h3 className="text-indigo-400 font-bold mb-2">Lesson ID: {activeLesson.id}</h3>
                                                            <p className="text-xs font-mono text-slate-500">{activeLesson.title}</p>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        })()}
                                    </div>
                                </div>
                            </div>

                            {/* CHAT LOG (If Available) */}
                            {activeLesson.chat_log && (
                                <div className="group relative rounded-2xl bg-[#050B1D] border border-indigo-500/20 shadow-2xl overflow-hidden ring-1 ring-white/5 transition-all hover:ring-indigo-500/40">
                                    {/* BACKGROUND GRID FX */}
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(17,24,39,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(17,24,39,0.5)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-20"></div>
                                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-50"></div>

                                    {/* HEADER */}
                                    <div className="relative z-10 bg-indigo-950/30 p-4 border-b border-indigo-500/10 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                                                <Terminal className="w-4 h-4 text-indigo-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-indigo-100 uppercase tracking-widest flex items-center gap-2">
                                                    Archived Transmission Log
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                </h3>
                                                <p className="text-[10px] text-indigo-400/60 font-mono">SECURE_CHANNEL_ESTABLISHED // ENCRYPTED</p>
                                            </div>
                                        </div>

                                        {/* SEARCH BAR (In-Memory) */}
                                        <div className="relative w-full md:w-64 group/search">
                                            <Search className="absolute left-3 top-2.5 w-3 h-3 text-indigo-400/50 group-focus-within/search:text-indigo-400 transition-colors" />
                                            <Input
                                                className="h-8 pl-8 bg-black/50 border-white/10 text-xs font-mono text-indigo-100 placeholder:text-indigo-900/50 focus:border-indigo-500/50 focus:bg-indigo-950/30 transition-all rounded-md"
                                                placeholder="SEARCH_LOG_DATA..."
                                                id="chat-search"
                                            // Note: Simple filter implementation would require state. 
                                            // For now, this is a visual enhancement for the "Beautiful" request.
                                            // Ideally we'd wire this to a state variable [search, setSearch].
                                            />
                                        </div>
                                    </div>

                                    {/* CONTENT */}
                                    <div className="relative z-10 p-6 max-h-[400px] overflow-y-auto font-mono text-sm space-y-2 text-slate-400 custom-scrollbar bg-gradient-to-b from-transparent to-black/40">
                                        {activeLesson.chat_log.split('\n').map((line, i) => {
                                            // Render Logic
                                            if (!line.trim()) return null;

                                            // Search Filter Logic (Mocked via ID selector in real app, but here just raw render)
                                            // In a real implementation we would filter specifically.

                                            const separatorIndex = line.indexOf(':');
                                            if (separatorIndex > -1) {
                                                const name = line.substring(0, separatorIndex);
                                                const message = line.substring(separatorIndex + 1);
                                                const isPro = name.toLowerCase().includes('admin') ||
                                                    name.toLowerCase().includes('prof') ||
                                                    name.toLowerCase().includes('support');

                                                // Highlight Keywords
                                                const highlightRegex = /(interest|credit|money|wealth|points|card|score|bank)/gi;
                                                const highlightedMessage = message.split(highlightRegex).map((part, idx) =>
                                                    highlightRegex.test(part)
                                                        ? <span key={idx} className="text-emerald-400 font-bold bg-emerald-900/20 px-1 rounded">{part}</span>
                                                        : part
                                                );

                                                return (
                                                    <div key={i} className="flex gap-4 hover:bg-white/5 p-2 rounded-lg transition-all group/line border border-transparent hover:border-white/5">
                                                        <div className={cn(
                                                            "font-bold shrink-0 min-w-[100px] text-right text-xs uppercase tracking-wider py-1",
                                                            isPro ? "text-amber-400 text-shadow-glow" : "text-indigo-400"
                                                        )}>
                                                            {name}
                                                        </div>
                                                        <div className="text-slate-300 leading-relaxed text-sm flex-1 break-words opacity-90 group-hover/line:opacity-100">
                                                            {highlightedMessage}
                                                        </div>
                                                        <button
                                                            className="opacity-0 group-hover/line:opacity-100 p-1 hover:bg-white/10 rounded transition-all"
                                                            title="Copy Data"
                                                            onClick={() => navigator.clipboard.writeText(message)}
                                                        >
                                                            <Copy className="w-3 h-3 text-slate-500" />
                                                        </button>
                                                    </div>
                                                )
                                            }
                                            // System Messages / Timestamps
                                            return <div key={i} className="text-slate-600 italic text-[10px] uppercase tracking-widest text-center py-2 opactiy-50 border-t border-white/5 mt-2 pt-2">{line}</div>
                                        })}

                                        {/* END OF LOG MARKER */}
                                        <div className="text-center py-8 opacity-30">
                                            <div className="inline-block w-2 h-2 bg-indigo-500 rounded-full animate-ping mb-2"></div>
                                            <p className="text-[10px] uppercase tracking-[0.3em] text-indigo-400">End of Transmission</p>
                                        </div>
                                    </div>
                                </div>
                            )}

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

                            {/* Field Notes (Tactical Log) */}
                            <div className="p-1 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/10">
                                <div className="bg-[#020408] rounded-xl p-6 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-2 opacity-30 animate-pulse">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                    </div>

                                    <h3 className="text-[10px] font-black uppercase text-indigo-400 mb-4 tracking-[0.2em] flex items-center gap-2">
                                        <BookOpen className="w-4 h-4" />
                                        <span>Personal Tactical Log</span>
                                        <span className="h-px w-20 bg-indigo-500/30"></span>
                                    </h3>

                                    <div className="relative">
                                        <textarea
                                            className="w-full bg-[#0A0F1E] border border-white/10 rounded-lg p-4 text-slate-300 min-h-[150px] focus:outline-none focus:border-indigo-500/50 resize-y text-sm font-mono leading-relaxed placeholder:text-slate-700/50"
                                            placeholder="// Input observations for future extraction..."
                                            value={localNotes}
                                            onChange={handleNoteChange}
                                        />
                                        <div className="absolute bottom-4 right-4 text-[10px] text-emerald-500/50 font-mono flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-emerald-500/50 rounded-full animate-ping"></span>
                                            ENCRYPTED_SAVE_ACTIVE
                                        </div>
                                    </div>
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
            </div >
        </div >
    )
}
