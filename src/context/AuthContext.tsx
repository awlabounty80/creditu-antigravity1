import React, { createContext, useContext } from 'react'
import { useProfile, ProfileProvider } from './ProfileContext'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
    user: any
    profile: any
    loading: boolean
    refreshProfile: () => Promise<void>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { user, profile, loading, refreshProfile } = useProfile()

    const signOut = async () => {
        await supabase.auth.signOut()
    }

    const value = {
        user,
        profile,
        loading,
        refreshProfile,
        signOut
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        // Fallback: If not within AuthProvider but within ProfileProvider, try to map directly
        try {
            const { user, profile, loading, refreshProfile } = useProfile()
            return {
                user,
                profile,
                loading,
                refreshProfile,
                signOut: async () => { await supabase.auth.signOut() }
            }
        } catch (e) {
            throw new Error('useAuth must be used within an AuthProvider or ProfileProvider')
        }
    }
    return context
}
