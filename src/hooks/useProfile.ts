import { useProfile as useProfileFromContext } from '../context/ProfileContext'

/**
 * Legacy hook wrapper that consumes the Shared Profile Context.
 * Using a context provider prevents redundant Supabase listeners and state-sync flickering.
 */
export function useProfile() {
    return useProfileFromContext()
}

export type { Profile } from '../context/ProfileContext'
