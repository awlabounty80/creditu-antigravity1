
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlayCircle, CheckCircle, FileText, ChevronLeft, Save, Zap, Flame } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Lesson, StudentWallet, StudentStreak, Badge } from '../../types/curriculum';
import { supabase } from '../../lib/supabaseClient';
import { GamificationService } from '../../lib/gamification';

export default function CoursePlayerLogic() {
    const { trackSlug, lessonSlug } = useParams();
    const navigate = useNavigate();

    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [notes, setNotes] = useState("");
    const [completed, setCompleted] = useState(false);
    const [loading, setLoading] = useState(true);

    // Gamification State
    const [wallet, setWallet] = useState<StudentWallet | null>(null);
    const [streak, setStreak] = useState<StudentStreak | null>(null);
    const [rewardMessage, setRewardMessage] = useState<string | null>(null);

    useEffect(() => {
        async function loadLesson() {
            if (!lessonSlug) return;
            try {
                // Fetch Lesson
                const { data: lessonData, error: lessonError } = await supabase
                    .from('lessons')
                    .select('*')
                    .eq('slug', lessonSlug)
                    .single();

                if (lessonError) throw lessonError;

                if (lessonData) {
                    setLesson(lessonData as Lesson);

                    // Fetch User Params
                    const { data: { user } } = await supabase.auth.getUser();
                    if (!user) return;

                    // Fetch Notes
                    const { data: noteData } = await supabase
                        .from('lesson_notes')
                        .select('note')
                        .eq('lesson_id', lessonData.id)
                        .eq('user_id', user.id)
                        .single();

                    if (noteData) setNotes(noteData.note);

                    // Fetch Progress
                    const { data: progressData } = await supabase
                        .from('student_progress')
                        .select('status')
                        .eq('lesson_id', lessonData.id)
                        .eq('user_id', user.id)
                        .single();

                    if (progressData?.status === 'completed') setCompleted(true);

                    // Fetch Gamification Stats
                    const { data: walletData } = await supabase
                        .from('student_wallets')
                        .select('*')
                        .eq('user_id', user.id)
                        .single();
                    setWallet(walletData);

                    const { data: streakData } = await supabase
                        .from('student_streaks')
                        .select('*')
                        .eq('user_id', user.id)
                        .single();
                    setStreak(streakData);
                }
            } catch (e) {
                console.error("Error loading lesson:", e);
            } finally {
                setLoading(false);
            }
        }
        loadLesson();
    }, [lessonSlug]);

    const handleSaveNotes = async () => {
        if (!lesson) return;
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { error } = await supabase
                .from('lesson_notes')
                .upsert({
                    user_id: user.id,
                    lesson_id: lesson.id,
                    note: notes
                }, { onConflict: 'user_id, lesson_id' });

            if (error) throw error;

            // First time note bonus? (Simplification: Just award 10 XP if successful for now)
            await GamificationService.awardXP(user.id, 10);
            refreshWallet(user.id);
            alert("Field Notes Saved! (+10 XP)");
        } catch (e) {
            console.error("Error saving notes:", e);
            alert("Failed to save notes.");
        }
    };

    const refreshWallet = async (userId: string) => {
        const { data } = await supabase.from('student_wallets').select('*').eq('user_id', userId).single();
        if (data) setWallet(data);
    };

    const handleComplete = async () => {
        if (!lesson || completed) return;
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { error } = await supabase
                .from('student_progress')
                .upsert({
                    user_id: user.id,
                    lesson_id: lesson.id,
                    status: 'completed',
                    completed_at: new Date().toISOString(),
                    progress_percent: 100
                }, { onConflict: 'user_id, lesson_id' });

            if (error) throw error;
            setCompleted(true);

            // --- GAMIFICATION TRIGGER ---
            // 1. Award XP (25 Standard)
            await GamificationService.awardXP(user.id, 25);

            // 2. Update Streak
            const streakRes = await GamificationService.updateStreak(user.id);

            // 3. Check Badges
            const newBadges = await GamificationService.checkBadges(user.id, 'lesson_complete');

            // 4. Update UI
            await refreshWallet(user.id);
            const { data: newStreak } = await supabase.from('student_streaks').select('*').eq('user_id', user.id).single();
            setStreak(newStreak);

            // 5. User Feedback
            let msg = "+25 XP Earned!";
            if (streakRes?.updated) msg = `Streak Extended! +25 XP`;
            if (newBadges.length > 0) msg = `${newBadges.length} Badge(s) Unlocked! +25 XP`;

            setRewardMessage(msg);
            setTimeout(() => setRewardMessage(null), 5000);

        } catch (e) {
            console.error("Error marking complete:", e);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading Class...</div>;
    if (!lesson) return <div className="p-8 text-center text-red-500">Lesson not found.</div>;

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)]">
            {/* Top Bar */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" className="text-sm" onClick={() => navigate(`/learn/${trackSlug}`)}>
                        <ChevronLeft className="h-4 w-4 mr-1" /> Back to Track
                    </Button>
                    <div className="h-6 w-px bg-gray-200" />
                    <h1 className="font-bold text-lg text-blue-900">{lesson.title}</h1>
                </div>

                {/* Gamification Stats */}
                <div className="flex items-center gap-6">
                    {rewardMessage && (
                        <div className="text-sm font-bold text-yellow-600 animate-pulse bg-yellow-50 px-3 py-1 rounded-full">
                            {rewardMessage}
                        </div>
                    )}

                    <div className="flex items-center gap-1 text-gray-600" title="Current Streak">
                        <Flame className={`h-5 w-5 ${streak?.current_streak ? 'text-orange-500 fill-orange-500' : 'text-gray-300'}`} />
                        <span className="font-bold font-mono">{streak?.current_streak || 0}</span>
                    </div>

                    <div className="flex items-center gap-1 text-gray-600" title="Moo Points (XP)">
                        <Zap className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        <span className="font-bold font-mono">{wallet?.xp_total || 0}</span>
                    </div>

                    <div className="h-6 w-px bg-gray-200" />

                    <div className="flex items-center gap-3">
                        {completed ? (
                            <span className="flex items-center gap-2 text-green-600 font-bold text-sm bg-green-50 px-3 py-1 rounded-full">
                                <CheckCircle className="h-4 w-4" /> Completed
                            </span>
                        ) : (
                            <Button onClick={handleComplete} className="bg-yellow-400 text-black font-bold hover:bg-yellow-500">
                                Mark Complete (+25 XP)
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Main Content (Left) */}
                <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
                    <div className="max-w-3xl mx-auto space-y-8">
                        {/* Video Player or Markdown */}
                        {lesson.content_type === 'video' ? (
                            <div className="aspect-video bg-black rounded-xl shadow-lg flex items-center justify-center">
                                {lesson.video_url ? (
                                    <iframe
                                        src={lesson.video_url}
                                        className="w-full h-full rounded-xl"
                                        allowFullScreen
                                        title={lesson.title}
                                    />
                                ) : (
                                    <div className="text-center text-white">
                                        <PlayCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                                        <p>Video Source Not Connected</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Card className="shadow-sm border-none">
                                <CardContent className="p-8 prose max-w-none">
                                    <div className="whitespace-pre-line">{lesson.reading_markdown}</div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Key Takeaways */}
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                            <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                                <CheckCircle className="h-5 w-5" /> Key Takeaways
                            </h3>
                            <ul className="space-y-2">
                                {lesson.key_takeaways?.map((t, i) => (
                                    <li key={i} className="flex gap-2 text-blue-800 text-sm">
                                        <span className="font-bold">•</span> {t}
                                    </li>
                                ))}
                                {(!lesson.key_takeaways || lesson.key_takeaways.length === 0) && (
                                    <li className="text-gray-500 italic text-sm">No specific takeaways for this lesson.</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Right Rail (Field Notes) */}
                <div className="w-96 border-l border-gray-200 bg-white flex flex-col hidden lg:flex">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <span className="font-bold text-sm flex items-center gap-2">
                            <FileText className="h-4 w-4" /> Field Notes
                        </span>
                        <Button size="sm" variant="ghost" onClick={handleSaveNotes}>
                            <Save className="h-4 w-4 text-gray-500" />
                        </Button>
                    </div>
                    <textarea
                        className="flex-1 p-4 resize-none focus:outline-none text-sm leading-relaxed"
                        placeholder="Type your notes here... they autosave to your private notebook."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}
