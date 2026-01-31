import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { LogOut, User, Shield, Trophy, Home } from 'lucide-react'
import { HeaderSyncStatus } from './HeaderSyncStatus'

interface StudentHeaderProps {
    userEmail?: string
    isAdmin?: boolean
}

export function StudentHeader({ userEmail, isAdmin }: StudentHeaderProps) {
    const navigate = useNavigate()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        navigate('/login')
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#020412]/80 backdrop-blur-md supports-[backdrop-filter]:bg-[#020412]/60">
            <div className="container mx-auto px-4 md:px-6 flex h-16 items-center justify-between">

                {/* Identity / Sync Area */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="p-1 rounded-full bg-indigo-500/10 text-indigo-400">
                            <User className="h-4 w-4" />
                        </div>
                        <span className="text-sm text-slate-400 hidden md:block">{userEmail || "Student"}</span>
                    </div>
                    <div className="hidden md:block h-4 w-px bg-white/10" />
                    <HeaderSyncStatus />
                </div>

                {/* Navigation Actions */}
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-white hover:bg-white/5">
                        <Home className="h-4 w-4 md:mr-2" />
                        <span className="hidden md:inline">Home</span>
                    </Button>

                    <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/profile')} className="text-slate-400 hover:text-white hover:bg-white/5">
                        <User className="h-4 w-4 md:mr-2" />
                        <span className="hidden md:inline">Profile</span>
                    </Button>

                    <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/honor-roll')} className="text-slate-400 hover:text-amber-400 hover:bg-amber-500/10">
                        <Trophy className="h-4 w-4 md:mr-2" />
                        <span className="hidden md:inline">Honor Roll</span>
                    </Button>

                    {isAdmin && (
                        <Button variant="ghost" size="sm" onClick={() => navigate('/admin')} className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10">
                            <Shield className="h-4 w-4 md:mr-2" />
                            <span className="hidden md:inline">Admin</span>
                        </Button>
                    )}

                    <div className="h-4 w-px bg-white/10 mx-1" />

                    <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-red-400/70 hover:text-red-400 hover:bg-red-500/10">
                        <LogOut className="h-4 w-4 md:mr-2" />
                        <span className="hidden md:inline">Sign Out</span>
                    </Button>
                </div>
            </div>
        </header>
    )
}
