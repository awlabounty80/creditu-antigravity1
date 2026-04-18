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
    Circle,
    ArrowRight,
    Lock
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { getClientCourse } from '../../lib/client-curriculum';
import { supabase } from '../../lib/supabaseClient';
import { GamificationService } from '../../lib/gamification';
import { cn } from '../../lib/utils';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { useProfile } from '@/hooks/useProfile';
import { hasAcademicAccess, AcademicLevel } from '@/lib/permissions';

import { CinematicBriefing } from '../../components/cinematic/CinematicBriefing';

export default function CoursePlayer() {

    const { trackSlug, lessonSlug } = useParams();
    const navigate = useNavigate();
    const { profile } = useProfile();

    const [lesson, setLesson] = useState<any | null>(null);
    const [notes, setNotes] = useState("");
    const [completed, setCompleted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeAsset, setActiveAsset] = useState<'lecture' | 'explainer' | 'short' | 'infographic' | 'cinematic'>('lecture');

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
                    } else {
                        // ADMISSIONS / GUEST FALLBACK
                        const email = localStorage.getItem('cu_admissions_email');
                        if (email) {
                            // Load local gamification
                            const localMooStr = localStorage.getItem(`cu_moo_points_${email}`);
                            // Start them at 500 if they don't have any locally yet (from admissions windfall)
                            const localMoo = localMooStr ? parseInt(localMooStr) : 500;
                            setWallet({ total_points: localMoo });

                            const localCompleteStr = localStorage.getItem(`cu_completed_lessons_${email}`) || "[]";
                            try {
                                const localComplete = JSON.parse(localCompleteStr);
                                if (Array.isArray(localComplete) && localComplete.includes(clientLesson.id)) {
                                    setCompleted(true);
                                }
                            } catch(e) {}
                        }
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
            
            // ADMISSIONS / GUEST COMPLETION
            if (!user) {
                const email = localStorage.getItem('cu_admissions_email');
                if (email) {
                    console.log("CoursePlayer: Recording mastery for unauthenticated student:", email);
                    const localMooStr = localStorage.getItem(`cu_moo_points_${email}`) || "500";
                    const newMoo = parseInt(localMooStr) + 25;
                    localStorage.setItem(`cu_moo_points_${email}`, newMoo.toString());
                    
                    const localCompleteStr = localStorage.getItem(`cu_completed_lessons_${email}`) || "[]";
                    try {
                        const localComplete = JSON.parse(localCompleteStr);
                        if (!localComplete.includes(lesson.id)) {
                            localComplete.push(lesson.id);
                            localStorage.setItem(`cu_completed_lessons_${email}`, JSON.stringify(localComplete));
                        }
                    } catch(e){}
                    
                    setCompleted(true);
                    setRewardMessage("MOO! +25 Moo Points Earned! (Local)");
                    setWallet((prev: any) => ({ ...prev, total_points: newMoo }));
                    setTimeout(() => setRewardMessage(null), 5000);
                    return;
                } else {
                    alert("You must be registered or signed in to save progress.");
                    return;
                }
            }

            // AUTHENTICATED DB COMPLETION
            // Find module_id if possible (logic from loadLesson)
            const clientCourse = getClientCourse(trackSlug || "");
            const parentModule = clientCourse?.modules.find(m => m.lessons.some(l => l.id === lesson.id));

            const { data, error } = await supabase.rpc('upsert_lesson_completion', {
                p_lesson_id: lesson.id,
                p_module_id: parentModule?.id || "unknown_module",
                p_phase_id: trackSlug || "unknown_phase",
                p_points_reward: 25
            });

            if (error) {
                console.warn("RPC Failed - Using local completion fallback:", error);
                // Fallback for missing infrastructure: Just mark complete locally
                setCompleted(true);
                setRewardMessage("Mastery Recorded Locally (Backend Restoration Required)");
                setTimeout(() => setRewardMessage(null), 5000);
                return;
            }

            if (data.success) {
                setCompleted(true);
                setRewardMessage("MOO! +25 Moo Points Earned!");

                // Update local wallet total
                setWallet((prev: any) => ({
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
            // Emergency Fallback
            setCompleted(true);
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

    const getVideoSource = (): string | null => {
        if (!lesson) return null;
        const assets = lesson.video_object?.video_assets;
        if (assets && assets[activeAsset]) {
            const asset = assets[activeAsset];
            return Array.isArray(asset) ? asset[0] : (asset as string);
        }
        // Fallback to primary video_url if the specific asset isn't available
        return lesson.video_url;
    };

    const isLocalAsset = (url: any) => {
        if (!url) return false;
        const checkUrl = Array.isArray(url) ? url[0] : url;
        if (typeof checkUrl !== 'string') return false;
        return checkUrl.startsWith('/') || checkUrl.startsWith('file://') || checkUrl.endsWith('.mp4');
    };

    const assetLabels = {
        lecture: "Main Lecture",
        explainer: "Animated Explainer",
        short: "Tactical Short",
        infographic: "Data Breakdown",
        cinematic: "Cinematic Visual"
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

    const clientCourse = trackSlug ? getClientCourse(trackSlug) : null;
    const isAuthorized = clientCourse && profile
        ? hasAcademicAccess(profile.role, profile.academic_level, (clientCourse.level?.toLowerCase() || 'freshman') as AcademicLevel, true)
        : true;


    if (!isAuthorized) return (
        <div className="flex flex-col items-center justify-center h-screen bg-[#020412] text-white p-8 text-center">
            <Lock className="w-16 h-16 text-amber-500/50 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Secure Clearance Required</h2>
            <p className="text-slate-400 max-w-md mb-6">
                This track requires <span className="text-amber-500 font-bold uppercase">{clientCourse?.level || 'FRESHMAN'}</span> clearance. 
                Your current standing is <span className="text-indigo-400 font-bold uppercase">{profile?.academic_level || 'FOUNDATION'}</span>.
            </p>
            <Button onClick={() => navigate('/learn')}>Return to Campus</Button>
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
                            Sovereign Education // Lesson {lesson.id.replace('less_', '').replace('FRESH-CF-', '')}
                        </div>
                        <h1 className="font-bold text-lg leading-none tracking-tight">{lesson.title}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {rewardMessage && (
                        <motion.div 
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-xs font-black text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20"
                        >
                            {rewardMessage}
                        </motion.div>
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
                            Authorize Mission (+25 XP)
                        </Button>
                    )}
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden">
                {/* Content Area */}
                <div className="flex-1 overflow-y-auto bg-[#020412] custom-scrollbar">
                    <div className="max-w-4xl mx-auto p-8 lg:p-12 space-y-12 pb-32">
                        {/* Multi-Asset Selector */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {(['lecture', 'explainer', 'short', 'infographic', 'cinematic'] as const).map((type) => {
                                const isAvailable = type === 'lecture' || !!lesson?.video_object?.video_assets?.[type];
                                if (!isAvailable) return null;

                                return (
                                    <Button
                                        key={type}
                                        variant="ghost"
                                        onClick={() => setActiveAsset(type)}
                                        className={cn(
                                            "h-10 px-4 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all",
                                            activeAsset === type
                                                ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]"
                                                : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                                        )}
                                    >
                                        {assetLabels[type]}
                                    </Button>
                                );
                            })}
                        </div>

                        {/* Video Section */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                            <div className="relative aspect-video bg-[#0A0F1E] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                                {getVideoSource() ? (
                                    isLocalAsset(getVideoSource()) ? (
                                        // PRIORITIZE CINEMATIC REEL FOR ANY ASSET IN THE REEL SLURP
                                        (activeAsset === 'cinematic' || getVideoSource()!.match(/\.(png|jpg|jpeg|webp)$/i)) ? (
                                            <CinematicBriefing 
                                                assets={Array.isArray(lesson.video_object.video_assets?.cinematic) 
                                                    ? lesson.video_object.video_assets.cinematic 
                                                    : [getVideoSource()!]}
                                                text={lesson.content_markdown || lesson.reading_markdown || ""}
                                                id={lesson.id}
                                                accentColor="indigo"
                                            />
                                        ) : (
                                            <video
                                                key={getVideoSource()!}
                                                src={getVideoSource()!}
                                                className="w-full h-full object-cover"
                                                controls
                                                playsInline
                                                poster={lesson.thumbnail_url}
                                            >
                                                Your browser does not support the video tag.
                                            </video>
                                        )
                                    ) : (
                                        <iframe
                                            src={getPrivacySafeEmbedUrl(getVideoSource()!)!}
                                            className="w-full h-full"
                                            allowFullScreen
                                            title={lesson.title}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        />
                                    )
                                ) : (
                                    <div className="flex flex-col items-center justify-center w-full h-full bg-slate-900/50 backdrop-blur-sm border border-white/5 relative">
                                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px] opacity-20" />
                                        <div className="p-4 bg-indigo-500/10 rounded-full mb-4 animate-pulse">
                                            <PlayCircle className="w-16 h-16 text-indigo-400/50" />
                                        </div>
                                        <h3 className="text-xl font-black text-white uppercase tracking-widest">Signal Pending</h3>
                                        <p className="text-indigo-300/60 font-mono text-[10px] mt-2 tracking-[0.2em]">{assetLabels[activeAsset]} COMING SOON</p>
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

                        {/* FINAL BRIEFING SCRIPT VIEW */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                                    <FileText className="w-4 h-4 text-indigo-400" />
                                </div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-indigo-300">Complete Briefing Script</h3>
                            </div>
                            <div className="bg-[#0A0F1E] border border-white/5 rounded-3xl p-8 font-mono text-sm text-slate-400 leading-relaxed max-h-60 overflow-y-auto custom-scrollbar">
                                {lesson.content_markdown || lesson.reading_markdown}
                            </div>
                        </div>

                        {/* Action Area (MISSION OBJECTIVE) */}
                        <div className="flex flex-col gap-6 p-8 bg-[#0a0f2d] border border-indigo-500/20 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <GraduationCap className="w-24 h-24" />
                            </div>
                            
                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                                <div className="space-y-2">
                                    <h3 className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.4em] mb-1 flex items-center gap-2">
                                        <Zap className="w-3 h-3 fill-current" /> Critical Mission Step
                                    </h3>
                                    <p className="text-xl font-bold text-white max-w-lg leading-tight italic">
                                        "{lesson.action_step || "Master this module to strengthen your financial avatar."}"
                                    </p>
                                </div>
                                
                                <Button
                                    size="lg"
                                    className={cn(
                                        "min-w-[240px] h-16 font-black tracking-widest transition-all text-xs uppercase rounded-2xl",
                                        completed
                                            ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                                            : "bg-white text-indigo-900 hover:bg-indigo-50 shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
                                    )}
                                    onClick={handleComplete}
                                    disabled={completed}
                                >
                                    {completed ? (
                                        <>MISSION ACCOMPLISHED <CheckCircle className="ml-2 w-5 h-5" /></>
                                    ) : (
                                        <>COMPLETE OBJECTIVE (+25 XP) <ArrowRight className="ml-2 w-5 h-5" /></>
                                    )}
                                </Button>
                            </div>
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
