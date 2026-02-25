
import { supabase } from './supabaseClient';
import { Badge } from '../types/curriculum';

export const GamificationService = {
    /**
     * Award XP to a user via RPC
     */
    awardXP: async (userId: string, amount: number) => {
        const { error } = await supabase.rpc('award_xp', {
            p_user_id: userId,
            p_amount: amount
        });
        if (error) console.error("Error awarding XP:", error);
        return !error;
    },

    /**
     * Update/Increment User Streak
     */
    updateStreak: async (userId: string) => {
        const { data, error } = await supabase.rpc('update_streak', {
            p_user_id: userId
        });
        if (error) console.error("Error updating streak:", error);
        return data; // { streak: number, updated: boolean }
    },

    /**
     * Check if user should earn a badge based on events
     * (Simple client-side evaluator for Phase 1B)
     */
    checkBadges: async (userId: string, event: 'lesson_complete' | 'streak_update') => {
        // Fetch current stats
        const { count: lessonCount } = await supabase
            .from('student_progress')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('status', 'completed');

        const { data: streakData } = await supabase
            .from('student_streaks')
            .select('current_streak')
            .eq('user_id', userId)
            .single();

        const currentStreak = streakData?.current_streak || 0;
        const count = lessonCount || 0;

        const newBadges: Badge[] = [];

        // 1. Freshman Initiated (First Lesson)
        if (count >= 1) {
            await tryAwardBadge(userId, 'freshman_initiated', newBadges);
        }

        // 2. Hat Trick (3 Day Streak)
        if (currentStreak >= 3) {
            await tryAwardBadge(userId, 'consistency_3', newBadges);
        }

        // 3. Consistency 7 (7 Day Streak) - if defined in seed
        if (currentStreak >= 7) {
            await tryAwardBadge(userId, 'consistency_7', newBadges);
        }

        return newBadges;
    }
};

// Helper to safely award badge if not already owned
async function tryAwardBadge(userId: string, slug: string, badgeList: Badge[]) {
    // 1. Get Badge ID
    const { data: badge } = await supabase.from('badges').select('*').eq('slug', slug).single();
    if (!badge) return;

    // 2. Check if already owned
    const { data: existing } = await supabase
        .from('student_badges')
        .select('*')
        .eq('user_id', userId)
        .eq('badge_id', badge.id)
        .single();

    if (!existing) {
        // 3. Award Badge
        const { error } = await supabase.from('student_badges').insert({
            user_id: userId,
            badge_id: badge.id
        });

        if (!error) {
            // 4. Award XP for Badge
            await GamificationService.awardXP(userId, badge.xp_reward);
            badgeList.push(badge);
        }
    }
}
