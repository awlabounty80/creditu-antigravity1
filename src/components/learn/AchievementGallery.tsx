import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, CheckCircle, Lock, Star, Trophy, Zap } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Achievement {
    slug: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
}

const MILESTONES: Achievement[] = [
    {
        slug: 'first-lesson',
        title: 'Initiate',
        description: 'Completed your first university lesson.',
        icon: <CheckCircle className="w-6 h-6" />,
        color: 'text-emerald-400'
    },
    {
        slug: '100-points',
        title: 'Centurion',
        description: 'Earned your first 100 Moo Points.',
        icon: <Zap className="w-6 h-6" />,
        color: 'text-yellow-500'
    },
    {
        slug: 'module-master',
        title: 'Module Master',
        description: 'Graduated from an entire course module.',
        icon: <Award className="w-6 h-6" />,
        color: 'text-indigo-400'
    },
    {
        slug: 'phase-graduate',
        title: 'Phase Graduate',
        description: 'Completed the Freshman Foundation phase.',
        icon: <Trophy className="w-6 h-6" />,
        color: 'text-purple-400'
    },
    {
        slug: 'perfect-payment',
        title: 'Payment Pro',
        description: 'Mastered the 35% Payment Rule lesson.',
        icon: <Star className="w-6 h-6" />,
        color: 'text-amber-500'
    }
];

export const AchievementGallery: React.FC<{ userId: string }> = ({ userId }) => {
    const [earnedSlugs, setEarnedSlugs] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;
        const fetchAchievements = async () => {
            const { data } = await supabase
                .from('student_achievements')
                .select('achievement_slug')
                .eq('user_id', userId);

            if (data) {
                setEarnedSlugs(new Set(data.map(a => a.achievement_slug)));
            }
            setLoading(false);
        };
        fetchAchievements();
    }, [userId]);

    return (
        <Card className="bg-[#0A0F1E] border-white/5 shadow-2xl overflow-hidden group">
            <CardHeader className="border-b border-white/5 bg-white/[0.02] p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-black text-white uppercase tracking-tighter">Achievement Gallery</CardTitle>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">University Milestones & Honors</p>
                    </div>
                    <div className="text-indigo-400 font-black text-xl">
                        {earnedSlugs.size} / {MILESTONES.length}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {MILESTONES.map((achievement) => {
                        const isEarned = earnedSlugs.has(achievement.slug);
                        return (
                            <div
                                key={achievement.slug}
                                className={`flex flex-col items-center text-center p-4 rounded-2xl border transition-all duration-500 group/item relative overflow-hidden
                                    ${isEarned
                                        ? 'bg-white/5 border-white/10 hover:border-indigo-500/30'
                                        : 'bg-black/20 border-white/5 grayscale opacity-40'
                                    }`}
                            >
                                {isEarned && (
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
                                )}
                                <div className={`p-3 rounded-xl mb-3 transition-transform group-hover/item:scale-110 
                                    ${isEarned ? 'bg-indigo-500/10 border border-indigo-500/20' : 'bg-white/5'}`}>
                                    {isEarned ? achievement.icon : <Lock className="w-6 h-6 text-slate-700" />}
                                </div>
                                <h4 className={`text-[10px] font-black uppercase tracking-tighter mb-1 ${isEarned ? 'text-white' : 'text-slate-600'}`}>
                                    {achievement.title}
                                </h4>
                                <p className="text-[8px] text-slate-500 font-bold leading-tight line-clamp-2">
                                    {achievement.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
};
