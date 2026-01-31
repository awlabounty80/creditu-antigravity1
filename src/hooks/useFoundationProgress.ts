
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useProfile } from './useProfile'

export function useFoundationProgress() {
    const { profile, refreshProfile } = useProfile()
    const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set())
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!profile) return
        fetchProgress()
    }, [profile?.id])

    const fetchProgress = async () => {
        try {
            const { data, error } = await supabase
                .from('lesson_progress')
                .select('lesson_id')
                .eq('user_id', profile?.id)

            if (error) throw error

            const completed = new Set(data.map(d => d.lesson_id))
            setCompletedLessons(completed)
        } catch (err) {
            console.error('Error fetching lesson progress:', err)
        } finally {
            setLoading(false)
        }
    }

    const completeLesson = async (lessonId: string, xpReward: number) => {
        if (!profile) return

        try {
            const { data, error } = await supabase
                .rpc('complete_lesson', {
                    lesson_id: lessonId,
                    points_reward: xpReward
                })

            if (error) throw error

            if (data.success) {
                // Update local state immediately
                setCompletedLessons(prev => new Set(prev).add(lessonId))

                // Refresh profile to show new points
                refreshProfile()
                console.log("Lesson Complete! Points awarded.")
            } else {
                console.warn("Lesson completion failed:", data.message)
            }
        } catch (err) {
            console.error('Error completing lesson:', err)
        }
    }

    return {
        completedLessons,
        completeLesson,
        loading
    }
}
