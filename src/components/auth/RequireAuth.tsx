import { Navigate, useLocation } from 'react-router-dom'
import { useProfile } from '@/hooks/useProfile'
import { Loader2 } from 'lucide-react'
import { hasAcademicAccess, hasPremiumAccess, hasToolAccess, AcademicLevel } from '@/lib/permissions'

export function RequireAuth({ 
    children, 
    allowedRoles,
    requiredLevels,
    requirePremium,
    requiredFlag,
    isCurriculum
}: { 
    children: JSX.Element, 
    allowedRoles?: string[],
    requiredLevels?: AcademicLevel[],
    requirePremium?: boolean,
    requiredFlag?: string,
    isCurriculum?: boolean
}) {
    const { profile, user, loading } = useProfile()
    const location = useLocation()

    // --- DEVELOPMENT BYPASS ---
    // Allow local testing without a session if email delivery is failing
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const searchParams = new URLSearchParams(location.search);
    const bypassAuth = import.meta.env.DEV && isLocalhost && (sessionStorage.getItem('auth_bypass') === 'enabled' || searchParams.get('bypass') === 'true');

    // 1. Initial Identity Check
    if (!loading && !user && !bypassAuth) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    // 2. Loading State Persistence
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
    if (allowedRoles || requiredLevels || requirePremium || requiredFlag) {
        if (loading) {
            return (
                <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-950">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                    <p className="mt-4 text-[10px] text-slate-500 uppercase tracking-widest">Verifying Authorization...</p>
                </div>
            )
        }

        if (!profile) {
            // Check if we actually have a user. If so, don't bounce to login, keep them on dashboard.
            if (user) {
                return <Navigate to="/dashboard" replace state={{ uiError: 'Network Synchronization: Profile data not yet established. Try refreshing.' }} />
            }
            return <Navigate to="/login" replace />
        }

        // Role Check
        if (allowedRoles && !allowedRoles.includes(profile.role)) {
            // Keep on dashboard if authenticated but wrong role for specific tool
            return <Navigate to="/dashboard" replace state={{ uiError: 'Restricted Access: Higher clearance required for this node.' }} />
        }

        // Academic Level Guard (Centralized)
        if (requiredLevels) {
            const isAllowed = requiredLevels.some(level => 
                hasAcademicAccess(profile.role, profile.academic_level, level, isCurriculum)
            );
            if (!isAllowed) {
                const required = requiredLevels[0]; // Primary requirement
                const label = required.charAt(0).toUpperCase() + required.slice(1);
                return <Navigate to="/dashboard" replace state={{ uiError: `Academic Restriction: ${label} Rank Required` }} />
            }
        }

        // Premium Content Guard (Centralized)
        if (requirePremium && !hasPremiumAccess(profile.role, profile.subscription_tier)) {
            return <Navigate to="/dashboard" replace state={{ uiError: 'Membership Restriction: Premium Access Required' }} />
        }

        // Feature Flag / Tool Support Guard
        if (requiredFlag) {
            const flags = JSON.parse(localStorage.getItem('creditu_feature_flags') || '{}');
            if (!hasToolAccess(profile.role, flags, requiredFlag)) {
                return <Navigate to="/dashboard" replace state={{ uiError: 'Access Denied: This tool is not active on your profile.' }} />
            }
        }
    }

    // 4. Default Success
    return children
}
