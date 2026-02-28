import { Navigate, useLocation } from 'react-router-dom'
import { useProfile } from '@/hooks/useProfile'
import { Loader2 } from 'lucide-react'

export function RequireAuth({ children, allowedRoles }: { children: JSX.Element, allowedRoles?: string[] }) {
    const { profile, user, loading } = useProfile()
    const location = useLocation()

    // --- DEVELOPMENT BYPASS ---
    // Allow local testing without a session if email delivery is failing
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const searchParams = new URLSearchParams(location.search);
    const bypassAuth = isLocalhost && (sessionStorage.getItem('auth_bypass') === 'enabled' || searchParams.get('bypass') === 'true');

    // 1. Initial Identity Check
    if (!loading && !user && !bypassAuth) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    // 2. Loading State Persistence
    // If we have a user but are just waiting on the profile, we can be more subtle.
    // Only show full-screen loader if it's the VERY FIRST load.
    if (loading && !user) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-950 text-credit-royal-400">
                <div className="relative">
                    <Loader2 className="w-12 h-12 animate-spin mb-4" />
                    <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse"></div>
                </div>
                <p className="text-slate-400 text-sm animate-pulse tracking-widest uppercase">Verifying Network...</p>
            </div>
        )
    }

    // 3. Authenticated but Profile Loading
    // If we have the user but the profile is still fetching, we'll let the children render
    // UNLESS a specific role is required.
    if (allowedRoles) {
        if (loading) {
            return (
                <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-950">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                    <p className="mt-4 text-[10px] text-slate-500 uppercase tracking-widest">Verifying Authorization...</p>
                </div>
            )
        }

        if (!profile || !allowedRoles.includes(profile.role)) {
            // Redirect unauthorized users to orientation
            return <Navigate to="/dashboard/orientation" replace />
        }
    }

    // 4. Default Success
    return children
}
