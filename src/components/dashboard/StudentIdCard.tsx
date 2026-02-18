import { useProfile } from '@/hooks/useProfile'
import { CreditCard, ShieldCheck } from 'lucide-react'

export function StudentIdCard() {
    const { profile, loading } = useProfile()

    if (loading || !profile) return <div className="h-full w-full bg-slate-900 rounded-xl animate-pulse"></div>

    return (
        <div className="w-full max-w-md mx-auto font-sans shadow-2xl rounded-xl overflow-hidden bg-white text-slate-900 border border-slate-200">
            {/* Header */}
            <div className="bg-[#0f172a] p-6 flex justify-between items-center relative overflow-hidden">
                <div className="relative z-10 flex items-start gap-4">
                    <div className="mt-1">
                        <CreditCard className="text-amber-500" size={32} strokeWidth={1.5} />
                    </div>
                    <div>
                        <div className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase mb-0.5">Freshman Admission</div>
                        <div className="text-xl font-bold text-white tracking-wide font-heading">CREDIT UNIVERSITY</div>
                    </div>
                </div>
                <div className="text-right relative z-10">
                    <div className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase mb-0.5">Semester</div>
                    <div className="text-lg font-bold text-amber-400">FALL '26</div>
                </div>

                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -translate-y-10 translate-x-10 pointer-events-none"></div>
            </div>

            {/* Body */}
            <div className="p-8 relative bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-4 mb-8">
                    {/* Name */}
                    <div>
                        <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">Student Name</div>
                        <div className="text-2xl font-bold text-black uppercase tracking-tight">
                            {profile.first_name || 'Guest'} {profile.last_name || 'Student'}
                        </div>
                    </div>

                    {/* Student ID */}
                    <div className="md:text-right">
                        <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">Student ID</div>
                        <div className="text-lg font-bold text-indigo-600 font-mono tracking-wider">
                            CU-2026-{profile.id.slice(0, 4).toUpperCase()}
                        </div>
                    </div>

                    {/* Plan Level */}
                    <div>
                        <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">Plan Level</div>
                        <div className="text-sm font-bold text-black uppercase">
                            Full Semester
                        </div>
                    </div>

                    {/* Status */}
                    <div className="md:text-right">
                        <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">Status</div>
                        <div className="text-sm font-bold text-emerald-600 uppercase flex items-center justify-end gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Active
                        </div>
                    </div>
                </div>

                {/* Footer / Barcode Area */}
                <div className="flex justify-between items-end border-t border-dashed border-slate-200 pt-6 mt-4">
                    {/* Fake Barcode */}
                    <div className="h-8 flex items-end gap-[2px] opacity-40">
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className={`bg-black w-[${Math.random() > 0.5 ? '2px' : '4px'}] h-full`}></div>
                        ))}
                    </div>

                    <ShieldCheck className="text-slate-200" size={32} />
                </div>
            </div>
        </div>
    )
}
