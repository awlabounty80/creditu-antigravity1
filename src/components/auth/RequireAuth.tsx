import { Navigate, useLocation } from 'react-router-dom'
import { useProfile } from '@/hooks/useProfile'
import { Loader2 } from 'lucide-react'

export function RequireAuth({ children }: { children: JSX.Element }) {
    const { profile, loading } = useProfile()
    const location = useLocation()

    if (loading) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-950 text-credit-royal-400">
                <Loader2 className="w-12 h-12 animate-spin mb-4" />
                <p className="text-slate-400 text-sm animate-pulse">Verifying Credentials...</p>
            </div>
        )
    }

    if (!profile) {
        // Redirect to login, adding the current location as state so we can redirect back
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return children
}
