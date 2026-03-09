import { useState, useEffect } from 'react'
import { useProfile } from './useProfile'
import { supabase } from '@/lib/supabase'
import { useDeveloperMode } from './useDeveloperMode'

export function useGamification() {
    const { profile, loading, refreshProfile } = useProfile()
    const { isDevMode } = useDeveloperMode()
    const [awarding, setAwarding] = useState(false)
    const [points, setPoints] = useState(0);

    useEffect(() => {
        if (!profile) return;
        async function fetchPoints() {
            const { data } = await supabase
                .from('student_moo_points')
                .select('total_points')
                .eq('user_id', profile.id)
                .single();
            if (data) setPoints(data.total_points);
        }
        fetchPoints();
    }, [profile]);

    // Calculate level based on points
    // 0-1000: Freshman
    // 1000-2500: Sophomore
    // 2500-5000: Junior
    // 5000+: Senior
    // 10000+: Graduate
    const getLevel = (points: number) => {
        if (points >= 10000) return 'Graduate'
        if (points >= 5000) return 'Senior'
        if (points >= 2500) return 'Junior'
        if (points >= 1000) return 'Sophomore'
        return 'Freshman'
    }

    const awardPoints = async (amount: number, reason: string) => {
        if (isDevMode) {
            console.log(`[DEV MODE] Awarded ${amount} points for: ${reason}`)
            return
        }

        if (!profile) return

        setAwarding(true)
        try {
            const { data, error } = await supabase
                .from('student_moo_points')
                .upsert({
                    user_id: profile.id,
                    total_points: points + amount
                }, { onConflict: 'user_id' })
                .select('total_points')
                .single();

            if (error) throw error
            if (data) setPoints(data.total_points);

            // Trigger a refresh of the profile to update UI if needed
            refreshProfile()

            console.log(`Awarded ${amount} points for: ${reason}`)
        } catch (err) {
            console.error('Error awarding points:', err)
        } finally {
            setAwarding(false)
        }
    }

    const [showLevelUp, setShowLevelUp] = useState(false)
    const [currentLevelName, setCurrentLevelName] = useState("")

    // MOCK DATA FOR DEV MODE
    const effectivePoints = isDevMode ? 650 : (profile?.moo_points || 0)
    const currentLevel = getLevel(effectivePoints)

    // Check for level up
    // In a real app, we'd store the "last seen level" in the DB or local storage to detect changes
    // For this demo, let's just use local state and a simple effect
    useEffect(() => {
        if (loading) return

        const lastKnown = localStorage.getItem('credit_u_last_level')
        if (lastKnown && lastKnown !== currentLevel) {
            setShowLevelUp(true)
            setCurrentLevelName(currentLevel)
        }

        localStorage.setItem('credit_u_last_level', currentLevel)
    }, [currentLevel, loading])

    return {
        points: effectivePoints,
        level: currentLevel,
        awardPoints,
        awarding,
        loading: isDevMode ? false : loading,
        showLevelUp,
        newLevel: currentLevelName,
        dismissLevelUp: () => setShowLevelUp(false)
    }
}
