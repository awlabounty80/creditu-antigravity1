import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    PlayCircle,
    CheckCircle,
    FileText,
    ChevronLeft,
    Save,
    Zap,
    Flame,
    ExternalLink,
    BookOpen,
    GraduationCap,
    Award,
    Check,
    Circle
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { getClientCourse } from '../../lib/client-curriculum';
import { supabase } from '../../lib/supabaseClient';
import { GamificationService } from '../../lib/gamification';
import { cn } from '../../lib/utils';
import ReactMarkdown from 'react-markdown';

export default function CoursePlayer() {
    const { trackSlug, lessonSlug } = useParams();
    const navigate = useNavigate();

    const [lesson, setLesson] = useState<any | null>(null);
    const [notes, setNotes] = useState("");
    const [completed, setCompleted] = useState(false);
    const [loading, setLoading] = useState(true);

    // Gamification State
    const [wallet, setWallet] = useState<any | null>(null);
    const [streak, setStreak] = useState<any | null>(null);
    const [rewardMessage, setRewardMessage] = useState<string | null>(null);

    useEffect(() => {
        async function loadLesson() {
            if (!lessonSlug || !trackSlug) return;
            try {
                // 1. Try Client-Side Fallback First (100 High Fidelity Lessons)
                const clientCourse = getClientCourse(trackSlug);
                const clientLesson = clientCourse?.modules
                    .flatMap(m => m.lessons)
                    .find(l => l.id === lessonSlug);

                if (clientLesson) {
                    setLesson(clientLesson);

                    // Fetch Progress & Gamification Data
                    const { data: { user } } = await supabase.auth.getUser();
                    if (user) {
                        const { data: progressData } = await supabase
                            .from('student_progress')
                            .select('completed')
                            .eq('lesson_id', clientLesson.id)
                            .eq('user_id', user.id)
                            .single();

                        if (progressData?.completed) setCompleted(true);

                        const { data: walletData } = await supabase.from('student_moo_points').select('*').eq('user_id', user.id).single();
                        setWallet(walletData || { total_points: 0 }); // Fallback to 0 if no wallet yet

                        const { data: streakData } = await supabase.from('student_streaks').select('*').eq('user_id', user.id).single();
                        setStreak(streakData);
                    }
                    setLoading(false);
                    return;
                }

                // 2. Fallback to Supabase
                const { data: lessonData, error: lessonError } = await supabase
                    .from('lessons')
                    .select('*')
                    .eq('slug', lessonSlug)
                    .single();

                if (lessonError) throw lessonError;
                setLesson(lessonData);

            } catch (e) {
                console.error("Error loading lesson:", e);
            } finally {
                setLoading(false);
            }
        }
        loadLesson();
    }, [lessonSlug, trackSlug]);

    const handleComplete = async () => {
        if (!lesson || completed) return;
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                alert("You must be signed in to save progress.");
                return;
            }

            // Find module_id if possible (logic from loadLesson)
            const clientCourse = getClientCourse(trackSlug || "");
            const parentModule = clientCourse?.modules.find(m => m.lessons.some(l => l.id === lesson.id));

            const { data, error } = await supabase.rpc('upsert_lesson_completion', {
                p_lesson_id: lesson.id,
                p_module_id: parentModule?.id || "unknown_module",
                p_phase_id: trackSlug || "unknown_phase",
                p_points_reward: 25
            });

            if (error) throw error;

            if (data.success) {
                setCompleted(true);
                setRewardMessage("MOO! +25 Moo Points Earned!");

                // Update local wallet total
                setWallet(prev => ({
                    ...prev,
                    total_points: data.total_points
                }));

                if (data.new_achievement) {
                    console.log("Achievement Awarded!");
                }

                setTimeout(() => setRewardMessage(null), 5000);
            }

        } catch (e) {
            console.error("Error marking complete:", e);
        }
    };

    const getPrivacySafeEmbedUrl = (url: string) => {
        if (!url) return null;
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            // Extract Video ID
            let videoId = '';
            if (url.includes('embed/')) {
                videoId = url.split('embed/')[1].split('?')[0];
            } else if (url.includes('v=')) {
                videoId = url.split('v=')[1].split('&')[0];
            } else {
                videoId = url.split('/').pop()?.split('?')[0] || '';
            }
            return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&controls=1`;
        }
        return url;
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-screen bg-[#020412]">
            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
            <p className="text-indigo-300 font-mono text-xs tracking-widest">TRANSMITTING LESSON DATA...</p>
        </div>
    );

    if (!lesson) return (
        <div className="flex flex-col items-center justify-center h-screen bg-[#020412] text-white p-8">
            <h1 className="text-2xl font-bold mb-4">Lesson Declassified</h1>
            <p className="text-slate-400 mb-6">This lesson is either restricted or does not exist in the current sector.</p>
            <Button onClick={() => navigate(`/learn/${trackSlug}`)}>Return to Track</Button>
        </div>
    );

    return (
        <div className="flex flex-col h-screen bg-[#020412] text-white overflow-hidden">
            {/* Cinematic Header */}
            <header className="h-20 bg-[#0A0F1E] border-b border-white/5 flex items-center justify-between px-6 shrink-0 relative z-20">
                <div className="flex items-center gap-6">
                    <Button variant="ghost" onClick={() => navigate(`/learn/${trackSlug}`)} className="text-slate-400 hover:text-white hover:bg-white/5 gap-2 px-3">
                        <ChevronLeft className="w-4 h-4" /> <span className="hidden md:inline">Track Overview</span>
                    </Button>
                    <div className="h-6 w-px bg-white/5" />
                    <div>
                        <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none mb-1">
                            Sovereign Education // Lesson 101
                        </div>
                        <h1 className="font-bold text-lg leading-none tracking-tight">{lesson.title}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {rewardMessage && (
                        <div className="text-xs font-black text-yellow-500 animate-bounce">
                            {rewardMessage}
                        </div>
                    )}

                    <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-2 group">
                            <Zap className="w-4 h-4 text-yellow-500 group-hover:scale-110 transition-transform" />
                            <span className="font-mono font-bold">{wallet?.total_points || 0}</span>
                        </div>
                        <div className="w-px h-4 bg-white/10" />
                        <div className="flex items-center gap-2 group">
                            <Flame className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
                            <span className="font-mono font-bold">{streak?.current_streak || 0}</span>
                        </div>
                    </div>

                    {completed ? (
                        <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-2xl border border-emerald-500/20 font-black text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                            <CheckCircle className="w-4 h-4" /> Mastered
                        </div>
                    ) : (
                        <Button
                            onClick={handleComplete}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-widest h-11 px-6 rounded-2xl shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all active:scale-95"
                        >
                            Mark Complete (+25 XP)
                        </Button>
                    )}
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden">
                {/* Content Area */}
                <div className="flex-1 overflow-y-auto bg-[#020412] custom-scrollbar">
                    <div className="max-w-4xl mx-auto p-8 lg:p-12 space-y-12 pb-32">
                        {/* Video Section */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                            <div className="relative aspect-video bg-[#0A0F1E] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                                {lesson.video_url ? (
                                    <iframe
                                        src={getPrivacySafeEmbedUrl(lesson.video_url)}
                                        className="w-full h-full"
                                        allowFullScreen
                                        title={lesson.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center w-full h-full bg-slate-900/50 backdrop-blur-sm border border-white/5 relative">
                                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px] opacity-20" />
                                        <div className="p-4 bg-indigo-500/10 rounded-full mb-4 animate-pulse">
                                            <PlayCircle className="w-16 h-16 text-indigo-400/50" />
                                        </div>
                                        <h3 className="text-xl font-black text-white uppercase tracking-widest">Signal Pending</h3>
                                        <p className="text-indigo-300/60 font-mono text-[10px] mt-2 tracking-[0.2em]">CREDIT U LESSON VIDEO COMING SOON</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Verified Source Badge (Conditioned on Video presence) */}
                        {lesson.video_url && (
                            <div className="flex items-center gap-4 px-6 py-3 bg-white/5 border border-white/5 rounded-2xl w-fit">
                                <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-none mb-1">
                                        {lesson.video_url.includes('ftc.gov') ? 'FTC Verified' :
                                            lesson.video_url.includes('cfpb.gov') ? 'CFPB Verified' :
                                                lesson.video_url.includes('experian') ? 'Experian Education' :
                                                    lesson.video_url.includes('khanacademy') ? 'Khan Academy Lesson' :
                                                        'Credit U Original'}
                                    </div>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Authorized Educational Resource</p>
                                </div>
                            </div>
                        )}

                        {/* Reading Content */}
                        <div className="prose prose-invert max-w-none">
                            <div className="bg-[#0A0F1E] border border-white/5 rounded-3xl p-8 md:p-12 shadow-inner">
                                <ReactMarkdown
                                    components={{
                                        h1: ({ node, ...props }) => <h1 className="text-3xl font-black mb-6 text-white tracking-tight uppercase" {...props} />,
                                        h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-10 mb-4 text-indigo-400 tracking-wide uppercase border-l-2 border-indigo-500 pl-4" {...props} />,
                                        p: ({ node, ...props }) => <p className="text-slate-300 leading-relaxed text-lg mb-6" {...props} />,
                                        li: ({ node, ...props }) => <li className="text-slate-300 mb-2 list-none flex gap-3 before:content-['▹'] before:text-indigo-500 before:font-bold" {...props} />,
                                    }}
                                >
                                    {lesson.content_markdown || lesson.reading_markdown || "# Lesson Overview\n\nTransmission data pending declassification."}
                                </ReactMarkdown>
                            </div>
                        </div>

                        {/* Action Area */}
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6 p-8 bg-white/5 border border-white/5 rounded-3xl">
                            <div>
                                <h3 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-1">Mission Logistics</h3>
                                <p className="text-slate-400 text-sm italic">Declassify this lesson to authorize your next objective.</p>
                            </div>
                            <Button
                                size="lg"
                                className={cn(
                                    "min-w-[240px] h-14 font-black tracking-widest transition-all text-xs uppercase rounded-2xl",
                                    completed
                                        ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                                        : "bg-white text-indigo-900 hover:bg-slate-200"
                                )}
                                onClick={handleComplete}
                                disabled={completed}
                            >
                                {completed ? (
                                    <>DECLASSIFIED <Check className="ml-2 w-5 h-5" /></>
                                ) : (
                                    <>MARK COMPLETE <Circle className="ml-2 w-5 h-5 fill-indigo-900/10" /></>
                                )}
                            </Button>
                        </div>

                        {/* External Resource Card */}
                        {lesson.video_object?.external_resource_url && (
                            <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-indigo-500/60 transition-all duration-500">
                                <div className="space-y-2 text-center md:text-left">
                                    <div className="flex items-center gap-2 justify-center md:justify-start">
                                        <BookOpen className="w-5 h-5 text-indigo-400" />
                                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Master Resource</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white tracking-tight">{lesson.video_object.external_resource_title || "Deep Dive Literature"}</h3>
                                    <p className="text-slate-400 text-sm max-w-md">Reference the source materials used by DR_LEVERAGE for this lesson briefing.</p>
                                </div>
                                <a
                                    href={lesson.video_object.external_resource_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white text-indigo-900 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] flex items-center gap-2 shrink-0 group-hover:scale-105"
                                >
                                    Access Resource <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar (Optional Summary/Stats) */}
                <div className="w-80 border-l border-white/5 bg-[#0A0F1E] hidden xl:flex flex-col p-8 space-y-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-indigo-400" />
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Lesson Stats</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                <span className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Duration</span>
                                <span className="text-lg font-black font-mono">{lesson.duration_minutes || (lesson.duration_seconds ? Math.round(lesson.duration_seconds / 60) : 5)}m</span>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                <span className="block text-[10px] text-slate-500 font-bold uppercase mb-1">XP Value</span>
                                <span className="text-lg font-black text-indigo-400 font-mono">+25</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 relative">
                        <div className="absolute inset-0 bg-indigo-500/5 rounded-3xl blur-3xl opacity-20"></div>
                        <div className="relative h-48 border border-white/5 bg-white/[0.02] rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                                <Award className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-sm">Full Credit U Course</h4>
                                <p className="text-[10px] text-slate-500 font-medium uppercase mt-1 tracking-widest">Completion Bonus: 10 Credits</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
