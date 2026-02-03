import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, BookOpen, Trophy, TrendingUp, Sparkles, Crown, Zap, Clock } from 'lucide-react'
import { useProfile } from '@/hooks/useProfile'
import { useGamification } from '@/hooks/useGamification'
import { supabase } from '@/lib/supabase'
import { useNavigate } from 'react-router-dom'
import { FundingUnlock } from '@/components/dashboard/FundingUnlock'
import { AnnouncementBanner } from '@/components/dashboard/AnnouncementBanner'
import { StudentHeader } from '@/components/dashboard/StudentHeader'
import { QuickActionsFAB } from '@/components/dashboard/QuickActionsFAB'
import { StudentIdCard } from '@/components/dashboard/StudentIdCard'
import { FoundationCoreClass } from '@/components/dashboard/FoundationCoreClass'

interface EnrolledCourse {
    course_id: string
    progress_percent: number
    courses: {
        title: string
        slug: string
        credits_value: number
        track?: string
    }
}

export default function StudentDashboard() {
    const { profile, loading } = useProfile()
    const { points } = useGamification()
    const navigate = useNavigate()
    const [enrollments, setEnrollments] = useState<EnrolledCourse[]>([])
    const [creditsEarned, setCreditsEarned] = useState(0)

    useEffect(() => {
        if (!profile) return
        async function fetchEnrollments() {
            const { data } = await supabase
                .from('enrollments')
                .select(`course_id, progress_percent, courses (title, slug, credits_value, track)`)
                .eq('user_id', profile?.id)

            if (data) {
                // @ts-expect-error: Type mismatch in Supabase response
                setEnrollments(data)
                const earned = data.reduce((acc: number, curr: any) => curr.progress_percent >= 100 ? acc + curr.courses.credits_value : acc, 0)
                setCreditsEarned(earned)
            }
        }
        fetchEnrollments()
    }, [profile])


    if (loading) return <div className="p-12 text-center text-indigo-400 animate-pulse font-mono tracking-widest">INITIALIZING V2 SYSTEM...</div>

    const gpa = Math.min(4.0, (points / 2000) * 4.0).toFixed(2)

    return (
        <div className="min-h-screen bg-[#020412]">
            {/* INGESTED COMPONENT: Header */}
            <StudentHeader userEmail={profile?.email} isAdmin={false} />

            <div className="p-6 md:p-8 space-y-10 animate-in fade-in duration-700">

                {/* Welcome Hero - Dean's Transmission */}
                <div className="relative rounded-3xl overflow-hidden bg-black border border-white/5 shadow-2xl group w-full h-[300px] mx-auto">
                    <video
                        src="/assets/hero-background.mp4"
                        poster="/assets/amara-guide.jpg"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020412] via-transparent to-transparent"></div>

                    <div className="relative z-10 p-8 h-full flex flex-col justify-end">
                        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/90 border border-amber-500/20 text-black text-xs font-bold uppercase tracking-wider mb-4 shadow-lg backdrop-blur-sm">
                                    <Crown size={12} /> Elite Student Status
                                </div>
                                <h2 className="text-4xl md:text-5xl font-heading font-black text-white mb-4">
                                    Welcome back, {profile?.first_name || "Initiate"}.
                                </h2>
                                <p className="text-slate-300 max-w-xl text-lg font-light leading-relaxed">
                                    Your journey to financial sovereignty continues. You've accumulated <span className="text-emerald-400 font-bold">{points} Knowledge Points</span> this semester.
                                </p>
                            </div>
                            <Button
                                className="bg-white text-black hover:bg-slate-200 font-bold h-12 px-8 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:scale-105"
                                onClick={() => navigate('/dashboard/curriculum')}
                            >
                                Resume Training <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card
                        onClick={() => navigate('/dashboard/curriculum')}
                        className="bg-[#0A0F1E] border-white/5 relative overflow-hidden group hover:border-indigo-500/30 transition-colors cursor-pointer"
                    >
                        <div className="absolute top-0 right-0 p-16 bg-indigo-500/5 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-indigo-500/10 transition-colors"></div>
                        <CardContent className="p-6 relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Academic GPA</h3>
                                <Trophy className="w-5 h-5 text-amber-400" />
                            </div>
                            <div className="text-5xl font-heading font-bold text-white mb-1 blur-md group-hover:blur-0 transition-all duration-300 select-none">{gpa}</div>
                            <div className="flex items-center gap-2 text-xs font-medium">
                                <span className="text-emerald-400 flex items-center gap-1"><TrendingUp size={10} /> Top 10%</span>
                                <span className="text-slate-500">Based on performance</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        onClick={() => navigate('/dashboard/curriculum')}
                        className="bg-[#0A0F1E] border-white/5 relative overflow-hidden group hover:border-emerald-500/30 transition-colors cursor-pointer"
                    >
                        <div className="absolute top-0 right-0 p-16 bg-emerald-500/5 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-emerald-500/10 transition-colors"></div>
                        <CardContent className="p-6 relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Credits</h3>
                                <BookOpen className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div className="text-5xl font-heading font-bold text-white mb-1">{creditsEarned}</div>
                            <div className="w-full bg-white/5 h-1.5 rounded-full mt-2 overflow-hidden">
                                <div className="bg-emerald-500 h-full w-[15%]"></div>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-2 text-right">120 Required for Graduation</p>
                        </CardContent>
                    </Card>

                    <Card
                        onClick={() => navigate('/dashboard/tools/score-simulator')}
                        className="bg-[#0A0F1E] border-white/5 relative overflow-hidden group hover:border-blue-500/30 transition-colors cursor-pointer"
                    >
                        <div className="absolute top-0 right-0 p-16 bg-blue-500/5 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-blue-500/10 transition-colors"></div>
                        <CardContent className="p-6 relative z-10">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Simulation</h3>
                                <Zap className="w-5 h-5 text-blue-400" />
                            </div>

                            {/* Gauge Visual */}
                            <div className="relative h-24 w-full flex items-end justify-center mb-1">
                                <div className="absolute bottom-0 w-32 h-16 bg-slate-800 rounded-t-full overflow-hidden">
                                    <div className="w-full h-full bg-[conic-gradient(from_180deg,transparent_0deg,transparent_50deg,#ef4444_50deg,#ef4444_90deg,#eab308_90deg,#eab308_130deg,#22c55e_130deg,#22c55e_180deg,transparent_180deg)] opacity-20"></div>
                                </div>
                                <div className="absolute bottom-0 w-32 h-16 rounded-t-full overflow-hidden">
                                    {/* Dynamic Needle Rotation based on 720 (range 300-850) */}
                                    <div
                                        className="w-full h-full origin-bottom transition-transform duration-1000 ease-out"
                                        style={{ transform: 'rotate(120deg)' }}
                                    >
                                        <div className="w-1 h-full bg-white mx-auto mt-2"></div>
                                    </div>
                                </div>
                                <div className="text-4xl font-heading font-black text-white relative z-10 mb-[-5px] blur-md group-hover:blur-0 transition-all duration-300 select-none">720</div>
                            </div>

                            <div className="flex items-center justify-center gap-2 text-xs font-medium border-t border-white/5 pt-3 mt-2">
                                <span className="text-blue-400">+42 Pts</span>
                                <span className="text-slate-500">Since last check</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Column */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* INGESTED COMPONENT: Progression Logic */}
                        <FoundationCoreClass />

                        {/* Track Progress Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                "Personal Credit Track",
                                "Business Credit Track",
                                "Credit Rebuild & Recovery Track",
                                "Emotional + Financial Healing Track"
                            ].map(trackName => {
                                // Calculate simple progress for track based on enrollments
                                // In real app, we'd need total courses per track. 
                                // For now, we show completed courses / generic bucket size (e.g. 5)
                                const trackEnrollments = enrollments.filter(e => e.courses.track === trackName)
                                const completedCount = trackEnrollments.filter(e => e.progress_percent >= 100).length
                                const progress = Math.min(100, (completedCount / 5) * 100) // Assuming 5 courses per track for visual

                                return (
                                    <div key={trackName} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-colors">
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="font-bold text-sm text-slate-200">{trackName.replace(" Track", "")}</h4>
                                            <span className="text-xs font-mono text-indigo-400">{progress}%</span>
                                        </div>
                                        <div className="w-full bg-black h-1.5 rounded-full overflow-hidden">
                                            <div
                                                className="bg-indigo-500 h-full rounded-full transition-all duration-1000"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        {/* Active Courses */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-heading text-xl font-bold text-white">Active Modules</h3>
                                <Button variant="link" className="text-indigo-400" onClick={() => navigate('/dashboard/curriculum')}>View All</Button>
                            </div>

                            <div className="space-y-4">
                                {enrollments.length === 0 && (
                                    <div className="text-center p-12 border border-dashed border-white/10 rounded-2xl bg-white/5">
                                        <Sparkles className="w-8 h-8 text-slate-600 mx-auto mb-4" />
                                        <p className="text-slate-400 mb-4">No active missions initialized.</p>
                                        <Button onClick={() => navigate('/dashboard/curriculum')} className="bg-white/10 hover:bg-white/20 text-white">Browse Curriculum</Button>
                                    </div>
                                )}
                                {enrollments.map((enr, i) => (
                                    <div
                                        key={i}
                                        className="group flex flex-col md:flex-row items-center gap-6 p-4 bg-[#0F1629] border border-white/5 rounded-2xl hover:border-indigo-500/30 transition-all cursor-pointer"
                                        onClick={() => navigate(`/dashboard/course/${enr.course_id}`)}
                                    >
                                        <div className="w-full md:w-32 h-20 rounded-xl bg-gradient-to-br from-indigo-900 to-slate-900 flex items-center justify-center shrink-0 shadow-inner">
                                            <span className="font-heading font-bold text-2xl text-white/20 group-hover:text-white/40 transition-colors">
                                                {enr.courses.slug.slice(0, 3).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex-1 w-full text-center md:text-left">
                                            <h4 className="font-bold text-lg text-white mb-2 group-hover:text-indigo-400 transition-colors">{enr.courses.title}</h4>
                                            <div className="w-full bg-black h-2 rounded-full overflow-hidden border border-white/5">
                                                <div
                                                    className="bg-indigo-500 h-full transition-all duration-1000 relative"
                                                    style={{ width: `${enr.progress_percent}%` }}
                                                >
                                                    <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 blur-[2px]"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <span className="text-2xl font-bold text-white font-mono">{enr.progress_percent}%</span>
                                            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Complete</div>
                                        </div>
                                        <div className="rounded-full p-2 bg-white/5 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                                            <ArrowRight size={16} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Column */}
                    <div className="space-y-8">
                        {/* RE-INSERTED: Dean's Transmission (Perfect Box) */}
                        <div className="rounded-2xl overflow-hidden bg-black border border-white/5 shadow-2xl group relative aspect-square w-full">
                            <video
                                src="/assets/dean-welcome.mp4"
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="absolute inset-0 w-full h-full object-cover opacity-100"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#020412] via-transparent to-transparent"></div>
                            <div className="relative z-10 p-6 h-full flex flex-col justify-end">
                                <h3 className="font-heading font-bold text-xl text-white mb-1">DEAN MESSAGE</h3>
                                <p className="text-xs text-slate-300">WELCOME TO THE CREDIT UNIVERSITY AI</p>
                            </div>
                        </div>

                        {/* INGESTED COMPONENT: Identity */}
                        <div className="h-[400px]">
                            <StudentIdCard />
                        </div>

                        <AnnouncementBanner />

                        {/* INGESTED COMPONENT: Mission Timer */}
                        <div className="p-6 rounded-2xl bg-[#0F1629] border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 blur-xl rounded-full"></div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                        <h4 className="text-xs font-bold text-red-400 uppercase tracking-widest">Active Mission</h4>
                                    </div>
                                    <Clock className="w-4 h-4 text-slate-500" />
                                </div>
                                <h3 className="font-bold text-white text-lg mb-4">90-Day Reconstruction</h3>
                                <div className="flex justify-between items-end">
                                    <div className="text-center">
                                        <div className="text-2xl font-mono mobile-font font-bold text-white">42</div>
                                        <div className="text-[10px] text-slate-500 uppercase">Days</div>
                                    </div>
                                    <div className="mb-2 text-slate-600">:</div>
                                    <div className="text-center">
                                        <div className="text-2xl font-mono mobile-font font-bold text-white">12</div>
                                        <div className="text-[10px] text-slate-500 uppercase">Hrs</div>
                                    </div>
                                    <div className="mb-2 text-slate-600">:</div>
                                    <div className="text-center">
                                        <div className="text-2xl font-mono mobile-font font-bold text-white">05</div>
                                        <div className="text-[10px] text-slate-500 uppercase">Mins</div>
                                    </div>
                                </div>
                                <div className="w-full bg-white/5 h-1 rounded-full mt-4 overflow-hidden">
                                    <div className="bg-red-500 h-full w-[53%] shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                                </div>
                            </div>
                        </div>

                        <FundingUnlock />

                        <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20">
                            <div className="flex items-center gap-3 mb-4">
                                <Crown className="text-amber-400" size={20} />
                                <h4 className="font-bold text-amber-100">Legacy Status</h4>
                            </div>
                            <p className="text-sm text-amber-200/70 mb-4">
                                You are 1,200 points away from unlocking "Dean's List" status.
                            </p>
                            <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden mb-2">
                                <div className="bg-amber-400 h-full w-[65%]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* INGESTED COMPONENT: FAB */}
            <QuickActionsFAB />
        </div>
    )
}
