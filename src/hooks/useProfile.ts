import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

export interface Profile {
    id: string
    email: string
    first_name: string | null
    last_name: string | null
    student_id_number: string | null
    avatar_url: string | null
    role: 'student' | 'professor' | 'admin' | 'dean'
    academic_level: 'foundation' | 'freshman' | 'sophomore' | 'junior' | 'senior' | 'graduate'
    gpa: number
    credits_earned: number
    moo_points: number
    current_streak: number
}

export function useProfile() {
    const [profile, setProfile] = useState<Profile | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        let mounted = true

        // 1. Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (mounted && session?.user) {
                setUser(session.user)
            } else if (mounted) {
                setLoading(false)
            }
        })

        // 2. Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (mounted) {
                setUser(session?.user ?? null)
                if (!session?.user) {
                    setProfile(null)
                    setLoading(false)
                }
            }
        })

        return () => {
            mounted = false
            subscription.unsubscribe()
        }
    }, [])

    const fetchProfile = async () => {
        if (!user) return

        try {
            // Admin Impersonation Logic
            const impersonateId = typeof window !== 'undefined' ? sessionStorage.getItem('impersonate_id') : null
            const targetId = impersonateId || user.id

            const { data, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', targetId)
                .single()

            if (profileError) throw profileError

            if (data) {
                setProfile(data as Profile)
            }
        } catch (e) {
            console.error("Error fetching profile", e)
            setError(e instanceof Error ? e : new Error('Unknown error'))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        let mounted = true

        if (user) {
            setLoading(true)
            fetchProfile()
        }

        const channel = user ? supabase
            .channel(`profile:${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'profiles',
                    filter: `id=eq.${user?.id}`
                },
                (payload) => {
                    if (mounted) setProfile(payload.new as Profile)
                }
            )
            .subscribe() : null

        return () => {
            mounted = false
            if (channel) supabase.removeChannel(channel)
        }
    }, [user])

    return { profile, user, loading, error, refreshProfile: fetchProfile }
}
