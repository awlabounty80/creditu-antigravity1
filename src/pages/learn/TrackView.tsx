import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, PlayCircle, Lock, CheckCircle, Zap } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Track, Module, Lesson } from '../../types/curriculum';
import { supabase } from '../../lib/supabaseClient';

export default function TrackView() {
    const { trackSlug } = useParams();
    const [track, setTrack] = useState<Track | null>(null);
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);

    // Gamification State
    const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set());
    const [trackProgress, setTrackProgress] = useState(0);

    useEffect(() => {
        async function loadCurriculum() {
            if (!trackSlug) return;

            try {
                // 1. Get Track
                const { data: trackData, error: trackError } = await supabase
                    .from('tracks')
                    .select('*')
                    .eq('slug', trackSlug)
                    .single();

                if (trackError) throw trackError;
                setTrack(trackData as Track);

                // 2. Get Modules & Lessons
                const { data: modulesData, error: modulesError } = await supabase
                    .from('modules')
                    .select(`
                        *,
                        lessons (
                            *
                        )
                    `)
                    .eq('track_id', trackData.id)
                    .eq('is_published', true)
                    .order('order_index', { ascending: true });

                if (modulesError) throw modulesError;

                // Sort lessons manually
                const modulesWithSortedLessons = modulesData?.map((m: any) => ({
                    ...m,
                    lessons: m.lessons?.sort((a: Lesson, b: Lesson) => a.order_index - b.order_index)
                }));

                setModules(modulesWithSortedLessons as Module[]);

                // 3. Get User Progress
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data: progressData } = await supabase
                        .from('student_progress')
                        .select('lesson_id')
                        .eq('user_id', user.id)
                        .eq('status', 'completed');

                    if (progressData) {
                        const completedSet = new Set<string>(progressData.map((p: any) => p.lesson_id as string));
                        setCompletedLessonIds(completedSet);

                        // Calculate Track Progress
                        let totalLessons = 0;
                        modulesWithSortedLessons.forEach((m: Module) => {
                            totalLessons += m.lessons?.length || 0;
                        });

                        if (totalLessons > 0) {
                            setTrackProgress(Math.round((completedSet.size / totalLessons) * 100));
                        }
                    }
                }

            } catch (e) {
                console.error("Error loading curriculum:", e);
            } finally {
                setLoading(false);
            }
        }
        loadCurriculum();
    }, [trackSlug]);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Curriculum...</div>;
    if (!track) return <div className="p-8 text-center text-red-500">Track not found.</div>;

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
            {/* Header Area with Progress */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex flex-col items-start gap-2">
                    <div className="text-sm font-bold text-yellow-600 uppercase tracking-widest">Track 0{track.order_index}</div>
                    <h1 className="text-4xl font-black text-blue-900 tracking-tight">{track.title}</h1>
                    <p className="text-gray-600 text-lg max-w-2xl">{track.description}</p>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 min-w-[240px]">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-blue-900 text-sm">Track Progress</span>
                        <span className="font-bold text-blue-600">{trackProgress}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-600 rounded-full transition-all duration-500"
                            style={{ width: `${trackProgress}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {modules.map((module) => (
                    <Card key={module.id} className="border-l-4 border-l-blue-900 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="bg-gray-50 border-b border-gray-100 py-4">
                            <CardTitle className="text-lg text-blue-900 flex items-center gap-2">
                                {module.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-gray-100">
                                {module.lessons?.map((lesson) => {
                                    const isCompleted = completedLessonIds.has(lesson.id);
                                    // Future: Check prerequisites here to determine isLocked
                                    const isLocked = false;

                                    return (
                                        <Link
                                            key={lesson.id}
                                            to={isLocked ? '#' : `/learn/${track.slug}/${lesson.slug}`}
                                            className={`block transition-colors ${isLocked ? 'cursor-not-allowed opacity-60 bg-gray-50' : 'hover:bg-blue-50'}`}
                                        >
                                            <div className="p-4 flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    {/* Status Icon */}
                                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm border-2 
                                                        ${isCompleted
                                                            ? 'bg-green-100 border-green-200 text-green-600'
                                                            : isLocked
                                                                ? 'bg-gray-100 border-gray-200 text-gray-400'
                                                                : 'bg-white border-blue-100 text-blue-600'
                                                        }`}
                                                    >
                                                        {isCompleted ? <CheckCircle className="h-4 w-4" /> : isLocked ? <Lock className="h-3 w-3" /> : lesson.order_index}
                                                    </div>

                                                    <div>
                                                        <div className={`font-bold ${isCompleted ? 'text-blue-900' : 'text-gray-900'}`}>{lesson.title}</div>
                                                        <div className="text-xs text-gray-500 uppercase flex items-center gap-2">
                                                            <span className="flex items-center gap-1"><PlayCircle className="h-3 w-3" /> {lesson.content_type}</span>
                                                            <span>•</span>
                                                            <span>{Math.round(lesson.duration_seconds / 60)} min</span>
                                                            {isCompleted && <span className="text-green-600 font-bold ml-2">• Completed</span>}
                                                        </div>
                                                    </div>
                                                </div>

                                                {!isLocked && (
                                                    <div className="flex items-center gap-4">
                                                        {!isCompleted && <div className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded flex items-center gap-1">
                                                            <Zap className="h-3 w-3" /> 25 XP
                                                        </div>}
                                                        <ChevronRight className={`h-5 w-5 ${isCompleted ? 'text-green-400' : 'text-gray-300'}`} />
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    );
                                })}
                                {(!module.lessons || module.lessons.length === 0) && (
                                    <div className="p-4 text-gray-400 text-sm italic">No lessons available yet.</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
