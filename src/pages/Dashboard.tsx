import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, BookOpen, Trophy, TrendingUp, Crown, Brain } from 'lucide-react'
import { useProfile } from '@/hooks/useProfile'
import { useGamification } from '@/hooks/useGamification'
import { supabase } from '@/lib/supabase'
import { useNavigate } from 'react-router-dom'
import { FundingUnlock } from '@/components/dashboard/FundingUnlock'
import { DeansWelcome } from '@/components/dashboard/DeansWelcome'
import { StudentIdCard } from '@/components/dashboard/StudentIdCard'
import { FoundationCoreClass } from '@/components/dashboard/FoundationCoreClass'
import { SystemGaugeGrid } from '@/components/dashboard/SystemGaugeGrid'
import { ActiveMissionCard } from '@/components/dashboard/ActiveMissionCard'

export default function Dashboard() {
    const { profile, loading } = useProfile()
    const { points } = useGamification()
    const navigate = useNavigate()
    const [creditsEarned, setCreditsEarned] = useState(0)

    useEffect(() => {
        if (!profile) return
        async function fetchEnrollments() {
            const { data } = await supabase
                .from('enrollments')
                .select(`course_id, progress_percent, courses (title, slug, credits_value)`)
                .eq('user_id', profile?.id)

            if (data) {
                const earned = data.reduce((acc: number, curr: any) => curr.progress_percent >= 100 ? acc + curr.courses.credits_value : acc, 0)
                setCreditsEarned(earned)
            }
        }
        fetchEnrollments()
    }, [profile])


    if (loading) return <div className="p-12 text-center text-indigo-400 animate-pulse font-mono tracking-widest">INITIALIZING DASHBOARD...</div>

    const gpa = Math.min(4.0, (points / 2000) * 4.0).toFixed(2)

    return (
        <div className="space-y-10 animate-in fade-in duration-700 min-h-screen">
            {/* LOCKED DASHBOARD LAYOUT - ONLY ADDITIONS PERMITTED */}

            {/* LOCKED: DASHBOARD HERO HEADER (Classmates Video) */}
            {/* Welcome Hero - Classmates Transmission */}
            <div className="relative rounded-3xl overflow-hidden bg-black border border-white/5 shadow-2xl group">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-100"
                >
                    <source src="/assets/hero-background.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-[#020412] via-transparent to-transparent"></div>

                <div className="relative z-10 p-8 md:p-12">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
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
                <Card className="bg-[#0A0F1E] border-white/5 relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
                    <div className="absolute top-0 right-0 p-16 bg-indigo-500/5 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-indigo-500/10 transition-colors"></div>
                    <CardContent className="p-6 relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Academic GPA</h3>
                            <Trophy className="w-5 h-5 text-amber-400" />
                        </div>
                        <div className="text-5xl font-heading font-bold text-white mb-1">{gpa}</div>
                        <div className="flex items-center gap-2 text-xs font-medium">
                            <span className="text-emerald-400 flex items-center gap-1"><TrendingUp size={10} /> Top 10%</span>
                            <span className="text-slate-500">Based on performance</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#0A0F1E] border-white/5 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
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
                    className="bg-[#0A0F1E] border-white/5 relative overflow-hidden group hover:border-blue-500/30 transition-colors cursor-pointer"
                    onClick={() => navigate('/dashboard/quest')}
                >
                    <div className="absolute top-0 right-0 p-16 bg-blue-500/5 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-blue-500/10 transition-colors"></div>
                    <CardContent className="p-6 relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Credit Quest</h3>
                            <Brain className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="text-5xl font-heading font-bold text-white mb-1">Play</div>
                        <div className="flex items-center gap-2 text-xs font-medium">
                            <span className="text-blue-400 flex items-center gap-1">Start Simulation <ArrowRight size={10} /></span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Active Courses / Foundation Core */}
                    <div className="space-y-6">
                        <FoundationCoreClass />
                        <SystemGaugeGrid />
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-8">
                    <DeansWelcome />

                    <StudentIdCard />
                    <ActiveMissionCard />
                    <FundingUnlock />

                    <div
                        className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 cursor-pointer hover:border-indigo-500/40 transition-all group"
                        onClick={() => navigate('/dashboard/knowledge')}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <BookOpen className="text-indigo-400 group-hover:text-indigo-300 transition-colors" size={20} />
                            <h4 className="font-bold text-indigo-100">Knowledge Center</h4>
                        </div>
                        <p className="text-sm text-indigo-200/70 mb-4">
                            Access 100+ lessons, quizzes, calculators, and source-verified educational content.
                        </p>
                        <div className="flex items-center gap-2 text-xs font-medium text-indigo-300">
                            <span>Explore Now</span>
                            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>

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
    )
}
