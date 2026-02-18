import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
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

interface ProfileContextType {
    profile: Profile | null
    user: User | null
    loading: boolean
    error: Error | null
    refreshProfile: () => Promise<void>
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export function ProfileProvider({ children }: { children: React.ReactNode }) {
    const [profile, setProfile] = useState<Profile | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    // Synchronization Refs
    const currentUserIdRef = useRef<string | null>(null)
    const isInitialLoadRef = useRef(true)

    const fetchProfile = async (targetId: string) => {
        try {
            // Admin Impersonation Logic
            const impersonateId = typeof window !== 'undefined' ? sessionStorage.getItem('impersonate_id') : null
            const finalId = impersonateId || targetId

            const { data, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', finalId)
                .single()

            if (profileError) {
                console.warn("Profile fetch warning:", profileError.message)
                setProfile(null)
            } else if (data) {
                setProfile(data as Profile)
            }
        } catch (e) {
            console.error("Profile exception:", e)
            setError(e instanceof Error ? e : new Error('Unknown profile error'))
        } finally {
            setLoading(false)
            isInitialLoadRef.current = false
        }
    }

    useEffect(() => {
        let mounted = true

        // Single Listener Strategy
        // onAuthStateChange handles both initial session and subsequent changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (!mounted) return

            const newUser = session?.user ?? null
            const newId = newUser?.id ?? null

            // Log event for debugging if needed (remove in production)
            // console.log("Auth Event:", event, "User:", newId)

            // Only act if the identity actually changed
            if (newId !== currentUserIdRef.current) {
                currentUserIdRef.current = newId
                setUser(newUser)

                if (newId) {
                    // Start loading only for new users
                    setLoading(true)
                    await fetchProfile(newId)
                } else {
                    setProfile(null)
                    setLoading(false)
                    isInitialLoadRef.current = false
                }
            } else {
                // Same user, but maybe we were still in initial loading state
                if (isInitialLoadRef.current) {
                    if (newId) await fetchProfile(newId)
                    else {
                        setLoading(false)
                        isInitialLoadRef.current = false
                    }
                }
            }
        })

        return () => {
            mounted = false
            subscription.unsubscribe()
        }
    }, [])

    // Dedicated listener for profile updates (Postgres Changes)
    useEffect(() => {
        if (!user) return

        const channel = supabase
            .channel(`public:profiles:id=eq.${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'profiles',
                    filter: `id=eq.${user.id}`
                },
                (payload) => {
                    setProfile(payload.new as Profile)
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [user?.id])

    const value = {
        profile,
        user,
        loading,
        error,
        refreshProfile: async () => {
            if (currentUserIdRef.current) await fetchProfile(currentUserIdRef.current)
        }
    }

    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    )
}

export function useProfile() {
    const context = useContext(ProfileContext)
    if (context === undefined) {
        throw new Error('useProfile must be used within a ProfileProvider')
    }
    return context
}
