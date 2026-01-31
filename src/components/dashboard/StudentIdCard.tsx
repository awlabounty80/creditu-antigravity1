import { useProfile } from '@/hooks/useProfile'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CreditCard, Hash, Calendar, ShieldCheck } from 'lucide-react'

// Simulated "Clearance Level" Logic
const getClearanceLevel = (points: number) => {
    if (points > 5000) return { label: 'SOVEREIGN', color: 'bg-amber-500 text-black border-amber-400' }
    if (points > 2000) return { label: 'DEAN\'S LIST', color: 'bg-indigo-500 text-white border-indigo-400' }
    return { label: 'FRESHMAN', color: 'bg-slate-700 text-slate-300 border-slate-600' }
}

export function StudentIdCard() {
    const { profile, loading } = useProfile()

    if (loading || !profile) return <div className="h-full w-full bg-slate-900 rounded-xl animate-pulse"></div>

    const clearance = getClearanceLevel(profile.moo_points || 0)
    // @ts-ignore
    const enrollmentDate = new Date(profile.created_at || new Date()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    const studentId = profile.id.slice(0, 8).toUpperCase()

    return (
        <Card className="bg-[#0A0F1E] border-white/10 overflow-hidden relative group aspect-square h-auto">
            {/* Holographic Effect Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none"></div>

            <CardContent className="p-6 flex flex-col h-full justify-between relative z-10">

                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <CreditCard className="text-indigo-400" size={20} />
                        <span className="text-xs font-bold tracking-[0.2em] text-slate-500 uppercase">Universal ID</span>
                    </div>
                    <Badge variant="outline" className={`${clearance.color} font-mono font-bold tracking-widest px-3 py-1`}>
                        {clearance.label}
                    </Badge>
                </div>

                {/* Identity Info */}
                <div className="mt-8 mb-8 text-center space-y-4">
                    <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-indigo-500 to-slate-800 p-[2px] shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-3xl font-bold text-white">
                            {profile.first_name?.[0]}{profile.last_name?.[0]}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">{profile.first_name} {profile.last_name}</h2>
                        <p className="text-indigo-400 text-sm font-medium">{profile.email}</p>
                    </div>
                </div>

                {/* Footer Data */}
                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4 text-xs">
                    <div>
                        <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                            <Hash size={12} /> <span className="uppercase tracking-wider font-bold">Student ID</span>
                        </div>
                        <div className="font-mono text-slate-300">{studentId}</div>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-1.5 text-slate-500 mb-1 justify-end">
                            <Calendar size={12} /> <span className="uppercase tracking-wider font-bold">Enrolled</span>
                        </div>
                        <div className="font-mono text-slate-300">{enrollmentDate}</div>
                    </div>
                </div>

                {/* Security Watermark */}
                <ShieldCheck className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/5 w-32 h-32 -z-10" />

            </CardContent>
        </Card>
    )
}
