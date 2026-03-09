import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, PlayCircle, Lock, CheckCircle, Zap, BookOpen, Clock, GraduationCap } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { getClientCourse } from '../../lib/client-curriculum';
import { supabase } from '../../lib/supabaseClient';
import { cn } from '../../lib/utils';

export default function TrackView() {
    const { trackSlug } = useParams();
    const [track, setTrack] = useState<any | null>(null);
    const [modules, setModules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Gamification State
    const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set());
    const [trackProgress, setTrackProgress] = useState(0);

    useEffect(() => {
        async function loadCurriculum() {
            if (!trackSlug) return;

            try {
                // 1. Try Client-Side First (High Fidelity 100 Lessons)
                const clientCourse = getClientCourse(trackSlug);

                if (clientCourse) {
                    setTrack(clientCourse);
                    setModules(clientCourse.modules);

                    // Fetch Progress
                    const { data: { user } } = await supabase.auth.getUser();
                    if (user) {
                        const { data: progressData } = await supabase
                            .from('student_progress')
                            .select('lesson_id')
                            .eq('user_id', user.id)
                            .eq('completed', true);

                        if (progressData) {
                            const completedSet = new Set<string>(progressData.map((p: any) => p.lesson_id as string));
                            setCompletedLessonIds(completedSet);

                            // Calculate Progress
                            let totalLessons = 0;
                            clientCourse.modules.forEach((m: any) => {
                                totalLessons += m.lessons.length;
                            });

                            if (totalLessons > 0) {
                                setTrackProgress(Math.round((completedSet.size / totalLessons) * 100));
                            }
                        }
                    }
                    setLoading(false);
                    return;
                }

                // 2. Fallback to Supabase
                const { data: trackData, error: trackError } = await supabase
                    .from('tracks')
                    .select('*')
                    .eq('slug', trackSlug)
                    .single();

                if (trackError) throw trackError;
                setTrack(trackData);

                const { data: modulesData, error: modulesError } = await supabase
                    .from('modules')
                    .select(`
                        *,
                        lessons (*)
                    `)
                    .eq('track_id', trackData.id)
                    .eq('is_published', true)
                    .order('order_index', { ascending: true });

                if (modulesError) throw modulesError;

                const modulesWithSortedLessons = modulesData?.map((m: any) => ({
                    ...m,
                    lessons: m.lessons?.sort((a: any, b: any) => a.order_index - b.order_index)
                })) || [];

                setModules(modulesWithSortedLessons);

            } catch (e) {
                console.error("Error loading curriculum:", e);
            } finally {
                setLoading(false);
            }
        }
        loadCurriculum();
    }, [trackSlug]);

    // Expanded Modules State
    const [expandedModuleIds, setExpandedModuleIds] = useState<Set<string>>(new Set());

    const toggleModule = (moduleId: string) => {
        setExpandedModuleIds(prev => {
            const next = new Set(prev);
            if (next.has(moduleId)) {
                next.delete(moduleId);
            } else {
                next.add(moduleId);
            }
            return next;
        });
    };

    // Auto-expand first incomplete module
    useEffect(() => {
        if (modules.length > 0 && expandedModuleIds.size === 0) {
            const firstIncomplete = modules.find(m =>
                m.lessons.some((l: any) => !completedLessonIds.has(l.id))
            );
            if (firstIncomplete) {
                setExpandedModuleIds(new Set([firstIncomplete.id]));
            } else {
                setExpandedModuleIds(new Set([modules[0].id]));
            }
        }
    }, [modules, completedLessonIds]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#020412]">
            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
            <p className="text-indigo-300 font-mono text-xs tracking-widest">LOADING CURRICULUM DATA...</p>
        </div>
    );

    if (!track) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#020412] p-8 text-center">
            <Lock className="w-16 h-16 text-red-500/50 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
            <p className="text-slate-400 max-w-md mb-6">The requested curriculum track is either restricted or has not been declassified yet.</p>
            <Link to="/learn/hub">
                <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
                    Return to Yard
                </Button>
            </Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020412] text-white p-6 md:p-12">
            <div className="max-w-5xl mx-auto space-y-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                    <div className="space-y-4">
                        <Link to="/learn" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 uppercase tracking-widest">
                            <ChevronRight className="w-3 h-3 rotate-180" /> Back to Yard
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-[10px] font-black text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded uppercase">
                                    {track.level || 'FRESHMAN'}
                                </span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    Sovereign Track 01
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">{track.title}</h1>
                        </div>
                        <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
                            {track.description}
                        </p>
                    </div>

                    <div className="w-full md:w-auto min-w-[280px] bg-white/5 border border-white/5 p-6 rounded-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 bg-indigo-500/10 rounded-full blur-2xl -mr-4 -mt-4 group-hover:bg-indigo-500/20 transition-colors" />
                        <div className="relative z-10 space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Track Progress</span>
                                <span className="text-indigo-400 font-black">{trackProgress}%</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-600 to-purple-500 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.5)] transition-all duration-1000"
                                    style={{ width: `${trackProgress}%` }}
                                />
                            </div>
                            <p className="text-[10px] text-slate-500 font-medium">COMPLETE ALL MODULES FOR 10 CREDITS</p>
                        </div>
                    </div>
                </div>

                {/* Modules List */}
                <div className="space-y-6">
                    {modules.map((module, idx) => {
                        const isExpanded = expandedModuleIds.has(module.id);
                        const completedCount = module.lessons.filter((l: any) => completedLessonIds.has(l.id)).length;
                        const totalCount = module.lessons.length;
                        const percent = Math.round((completedCount / totalCount) * 100);

                        return (
                            <div key={module.id} className="space-y-4">
                                <button
                                    onClick={() => toggleModule(module.id)}
                                    className={cn(
                                        "w-full flex items-center gap-4 px-6 py-4 rounded-3xl border transition-all duration-500 group",
                                        isExpanded
                                            ? "bg-white/5 border-indigo-500/30"
                                            : "bg-[#0A0F1E] border-white/5 hover:border-white/20"
                                    )}
                                >
                                    <div className="flex flex-col items-start gap-1 flex-1 text-left">
                                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                                            PHASE 0{idx + 1}
                                        </h3>
                                        <h2 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors uppercase">
                                            {module.title}
                                        </h2>
                                        <div className="flex items-center gap-3 w-48 mt-2">
                                            <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-indigo-500 transition-all duration-700"
                                                    style={{ width: `${percent}%` }}
                                                />
                                            </div>
                                            <span className="text-[8px] font-black text-indigo-400">
                                                {percent}%
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Status</p>
                                            <p className={cn(
                                                "text-xs font-bold uppercase",
                                                percent === 100 ? "text-emerald-500" : "text-indigo-400"
                                            )}>
                                                {percent === 100 ? "Mastered" : `${completedCount}/${totalCount} Lessons`}
                                            </p>
                                        </div>
                                        <div className={cn(
                                            "w-10 h-10 rounded-2xl flex items-center justify-center border transition-all duration-500",
                                            isExpanded ? "bg-indigo-500 text-white border-indigo-400" : "bg-white/5 text-slate-500 border-white/5"
                                        )}>
                                            <ChevronRight className={cn("w-5 h-5 transition-transform duration-500", isExpanded ? "rotate-90" : "")} />
                                        </div>
                                    </div>
                                </button>

                                {isExpanded && (
                                    <div className="grid grid-cols-1 gap-3 animate-in slide-in-from-top-4 duration-500">
                                        {module.lessons?.map((lesson: any) => {
                                            const isCompleted = completedLessonIds.has(lesson.id);
                                            const isLocked = false;

                                            return (
                                                <Link
                                                    key={lesson.id}
                                                    to={isLocked ? '#' : `/learn/${trackSlug}/${lesson.id}`}
                                                    className={`group block bg-[#0A0F1E] border border-white/5 hover:border-indigo-500/30 rounded-2xl p-4 transition-all duration-300 ${isLocked ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:translate-x-1'}`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-all
                                                                ${isCompleted
                                                                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                                                    : 'bg-white/5 text-slate-500 border border-white/5 group-hover:border-indigo-500/40 group-hover:text-indigo-400'
                                                                }`}>
                                                                {isCompleted ? <CheckCircle className="w-5 h-5" /> : `0${lesson.order_index + 1}`}
                                                            </div>

                                                            <div className="space-y-1">
                                                                <h4 className={`font-bold transition-colors ${isCompleted ? 'text-slate-300' : 'text-white group-hover:text-indigo-400'}`}>
                                                                    {lesson.title}
                                                                </h4>
                                                                <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                                                    <span className="flex items-center gap-1.5"><PlayCircle className="w-3.5 h-3.5" /> {lesson.type || 'VIDEO'}</span>
                                                                    <span className="w-1 h-1 bg-slate-700 rounded-full" />
                                                                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {lesson.duration_minutes || lesson.duration_seconds / 60}m</span>
                                                                    {isCompleted && (
                                                                        <>
                                                                            <span className="w-1 h-1 bg-slate-700 rounded-full" />
                                                                            <span className="text-emerald-500">Mastered</span>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-3">
                                                            {!isCompleted && !isLocked && (
                                                                <div className="px-2 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded text-[9px] font-black text-yellow-500 flex items-center gap-1 group-hover:scale-105 transition-transform">
                                                                    <Zap className="w-3 h-3" /> +25 MOO POINTS
                                                                </div>
                                                            )}
                                                            <ChevronRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${isCompleted ? 'text-emerald-500/50' : 'text-slate-700'}`} />
                                                        </div>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
