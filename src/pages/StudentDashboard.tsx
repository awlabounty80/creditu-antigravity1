import { useEffect, useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, BookOpen, Trophy, TrendingUp, Sparkles, Zap, Clock, Play, Activity, Eye, Mic } from 'lucide-react'
import { CreditULogo } from '@/components/common/CreditULogo'
import { useProfile } from '@/hooks/useProfile'
import { useGamification } from '@/hooks/useGamification'
import { supabase } from '@/lib/supabase'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FundingUnlock } from '@/components/dashboard/FundingUnlock'
import { AnnouncementBanner } from '@/components/dashboard/AnnouncementBanner'
import { StudentHeader } from '@/components/dashboard/StudentHeader'
import { QuickActionsFAB } from '@/components/dashboard/QuickActionsFAB'
import { StudentIdCard } from '@/components/dashboard/StudentIdCard'
import { FoundationCoreClass } from '@/components/dashboard/FoundationCoreClass'
// import { ProfessorGenerative } from '@/components/dashboard/ProfessorGenerative'

import { JulesTerminal } from '@/components/dashboard/JulesTerminal'

import { DashboardResetMode } from '@/components/dashboard/DashboardResetMode'
import { EXTERNAL_RESOURCES } from '@/data/external-resources'
import { MISSIONS } from '@/data/missions'
import { useSound } from '@/hooks/useSound'


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
    const { profile, user, loading } = useProfile()
    const { points } = useGamification()
    const { playHover, playClick } = useSound()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    // 🔬 DEVELOPMENT BYPASS HOOK
    if (searchParams.get('bypass') === 'true') {
        sessionStorage.setItem('auth_bypass', 'enabled');
    }

    const [enrollments, setEnrollments] = useState<EnrolledCourse[]>([])
    const [creditsEarned, setCreditsEarned] = useState(0)

    const resourceOfTheWeek = useMemo(() => {
        if (!EXTERNAL_RESOURCES || EXTERNAL_RESOURCES.length === 0) {
            return {
                title: "Resource Hub",
                description: "Explore the Knowledge Center for verified tools.",
                url: "/dashboard/knowledge",
                category: "General",
                tags: []
            };
        }
        const day = new Date().getDate();
        const index = day % EXTERNAL_RESOURCES.length;
        return EXTERNAL_RESOURCES[index] || EXTERNAL_RESOURCES[0];
    }, []);

    useEffect(() => {
        if (!profile) return
        async function fetchEnrollments() {
            const { data } = await supabase
                .from('enrollments')
                .select(`course_id, progress_percent, courses (title, slug, credits_value, track)`)
                .eq('user_id', profile?.id)

            if (data) {
                // @ts-ignore
                setEnrollments(data || [])
                const earned = (data || []).reduce((acc: number, curr: any) => curr.progress_percent >= 100 ? acc + curr.courses.credits_value : acc, 0)
                setCreditsEarned(earned)
            }
        }
        fetchEnrollments()
    }, [profile])


    // CHECK FOR RESET MODE (Day 1 Complete)
    // FORCE RELEASE: Always bypass rest mode for now to ensure site access
    const [isRestMode, setIsRestMode] = useState(false);

    // Only show full-page loading if we have no profile AND no cached session
    if (loading && !profile && !user) return <div className="p-12 text-center text-indigo-400 animate-pulse font-mono tracking-widest">INITIALIZING V2 SYSTEM...</div>

    /* Original Logic Preserved for Reference:
    const [isRestMode, setIsRestMode] = useState(() => {
        const resetState = localStorage.getItem('credit_u_reset_state');
        if (resetState) {
            try {
                const parsed = JSON.parse(resetState);
                return parsed.completedDayOne && !parsed.unlockedDayTwo;
            } catch (e) {
                return false;
            }
        }
        return false;
    });
    */

    if (isRestMode) {
        return <DashboardResetMode onBypass={() => setIsRestMode(false)} />;
    }

    const gpa = Math.min(4.0, (points / 2000) * 4.0).toFixed(2)



    const defaultMission = {
        title: "Awaiting Assignment",
        description: "Complete your profile to unlock new missions.",
        xp: 0,
        status: 'locked',
        actionLabel: "View Profile",
        actionPath: "/dashboard/profile",
        deadline: ""
    };
    const activeMission = (MISSIONS && MISSIONS.length > 0)
        ? (MISSIONS.find(m => m.status === 'active') || MISSIONS[0])
        : defaultMission;


    return (
        <div className="min-h-screen bg-[#020412]">
            {/* INGESTED COMPONENT: Header */}
            <StudentHeader userEmail={profile?.email} isAdmin={false} />
            <JulesTerminal />


            <div className="p-6 md:p-8 space-y-10 animate-in fade-in duration-700">


                {/* Welcome Hero - Dean's Transmission */}
                <div className="relative rounded-[2.5rem] overflow-hidden bg-black border border-white/5 shadow-3xl group w-full min-h-[400px] border-b-indigo-500/30">
                    <div className="absolute inset-0 z-0">
                        <video
                            src="/assets/hero-background.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover opacity-60"
                        />
                    </div>
                    {/* ... (keep existing Dean content inside if any) ... */}

                    <div className="absolute inset-0 bg-gradient-to-t from-[#020412] via-[#020412]/40 to-transparent z-10"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_50%)] z-15"></div>

                    <div className="relative z-20 p-8 md:p-12 h-full flex flex-col justify-end min-h-[400px]">
                        <div className="flex flex-col md:flex-row justify-between items-end gap-10">
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] shadow-lg backdrop-blur-md">
                                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                    Infinite Level Authorized
                                </div>
                                <h2 className="text-5xl md:text-7xl font-heading font-black text-white leading-[0.9] tracking-tighter">
                                    ELITE <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">SOVEREIGNTY</span>
                                </h2>
                                <p className="text-slate-400 max-w-lg text-xl font-medium leading-relaxed">
                                    Welcome back, {profile?.first_name || "Initiate"}. Your <span className="text-white font-bold">{points} Knowledge Points</span> are ready for deployment.
                                </p>
                            </div>
                            <div className="flex flex-col gap-4 w-full md:w-auto">
                                <Button
                                    className="bg-white text-black hover:bg-indigo-500 hover:text-white font-black h-16 px-10 rounded-2xl shadow-2xl transition-all hover:scale-105 active:scale-95 text-lg uppercase tracking-tighter"
                                    onClick={() => { playClick(); navigate('/dashboard/curriculum'); }}
                                    onMouseEnter={() => playHover()}
                                >
                                    Resume Mission <ArrowRight className="ml-2 w-6 h-6" />
                                </Button>
                                <div className="flex gap-2">
                                    <div className="flex-1 p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md text-center">
                                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Rank</div>
                                        <div className="text-white font-bold">Architect</div>
                                    </div>
                                    <div className="flex-1 p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md text-center">
                                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">System</div>
                                        <div className="text-emerald-400 font-bold">Online</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ORIENTATION CTA SECTION - "BIG DEAL" */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/40 to-black border border-indigo-500/30 p-8 md:p-12 shadow-[0_0_50px_rgba(79,70,229,0.15)] group hover:border-indigo-500/50 transition-all cursor-pointer mb-10" onClick={() => navigate('/dashboard/orientation')}>
                    <div className="absolute top-0 right-0 p-48 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="space-y-4 max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                                <Activity className="w-3 h-3 text-indigo-400" /> Required Step
                            </div>
                            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white leading-tight">
                                Initialize Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">Financial Nervous System</span>
                            </h2>
                            <p className="text-slate-300 text-lg leading-relaxed">
                                Before you can effectively command your credit, you must calibrate your system sensors. Complete the system orientation to unlock the 5-Day Challenge.
                            </p>
                        </div>

                        <Button size="lg" className="h-16 px-8 text-lg bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/25 shrink-0 w-full md:w-auto hover:scale-105 transition-transform">
                            Open Orientation <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card
                        onClick={() => { playClick(); navigate('/dashboard/curriculum'); }}
                        onMouseEnter={() => playHover()}
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
                        onClick={() => { playClick(); navigate('/dashboard/curriculum'); }}
                        onMouseEnter={() => playHover()}
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
                        onClick={() => { playClick(); navigate('/dashboard/tools/score-simulator'); }}
                        onMouseEnter={() => playHover()}
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
                                        onClick={() => { playClick(); navigate(`/dashboard/course/${enr.course_id}`); }}
                                        onMouseEnter={() => playHover()}
                                    >
                                        <div className="w-full md:w-32 h-20 rounded-xl bg-gradient-to-br from-indigo-900 to-slate-900 flex items-center justify-center shrink-0 shadow-inner">
                                            <span className="font-heading font-bold text-2xl text-white/20 group-hover:text-white/40 transition-colors">
                                                {enr.courses?.slug?.slice(0, 3).toUpperCase() || 'CRS'}
                                            </span>
                                        </div>
                                        <div className="flex-1 w-full text-center md:text-left">
                                            <h4 className="font-bold text-lg text-white mb-2 group-hover:text-indigo-400 transition-colors">{enr.courses?.title || 'Untitled Course'}</h4>
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
                        {/* PROFESSOR GENERATIVE EXPERIENCE - REPLACES BROKEN VIDEO */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center px-2">
                                <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.5em]">Neural Link Status</h4>
                                <span className="text-[10px] font-mono text-emerald-500">SYNCHRONIZED</span>
                            </div>
                            {/* PROFESSOR GENERATIVE DISABLED FOR DEBUGGING
                            <ProfessorGenerative
                                transcript="Welcome to the Wealth Game. I’m your professor, Dr. Leverage. Most people are taught that credit is a trap, a way to keep you in debt. That is the old way, the 'Consumer Mindset.' Here at Credit U, we build Architects. We view credit as a tool for Leverage. In the Wealth Game, cash is for spending, but Credit is for building. Your credit report isn't a judgment of your worth; it's a scoreboard of your discipline. A high score tells the world, 'I keep my promises.' Cash takes years to save. Credit allows you to access capital today to buy assets that pay you tomorrow. You are not here to fix a number; you are here to build a legacy. Let's begin."
                                guidance={amaraGuidance || undefined}
                            /> 
                            */}
                            {/* PROFESSOR GENERATIVE: SAFE MODE (Static Fallback) */}
                            <div className="relative w-full aspect-video rounded-[2rem] overflow-hidden border border-white/10 bg-black group shadow-3xl">
                                <img
                                    src="/assets/dr-leverage-transmission.png"
                                    className="w-full h-full object-cover opacity-80"
                                    alt="Dr. Leverage"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                                <div className="absolute bottom-6 left-6 right-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-[0.2em]">Transmission Ready</span>
                                    </div>
                                    <h3 className="text-white text-2xl font-heading font-black uppercase italic tracking-tighter mb-1">
                                        Wealth Game <span className="text-indigo-400">part I</span>
                                    </h3>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors cursor-pointer" onClick={() => navigate('/dashboard/curriculum')}>
                                    <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                                        <Play className="w-6 h-6 text-white fill-current translate-x-1" />
                                    </div>
                                </div>
                            </div>


                            {/* Resource of the Week Card */}
                            <div className="rounded-2xl bg-indigo-900/10 border border-indigo-500/20 p-4 relative overflow-hidden group hover:border-indigo-500/40 transition-all">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl -mr-10 -mt-10"></div>

                                <div className="flex justify-between items-start mb-3 relative z-10">
                                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-wider border border-indigo-500/20">
                                        <Sparkles className="w-3 h-3" />
                                        Intel Drop
                                    </div>
                                    <Clock className="w-4 h-4 text-slate-500" />
                                </div>

                                <h3 className="font-bold text-white text-lg leading-tight mb-2 group-hover:text-indigo-300 transition-colors">
                                    {resourceOfTheWeek.title}
                                </h3>
                                <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                                    {resourceOfTheWeek.description}
                                </p>

                                <Button
                                    className="w-full bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 transition-all font-bold"
                                    onClick={() => window.open(resourceOfTheWeek.url, '_blank')}
                                >
                                    Access Resource <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </div>

                        {/* INGESTED COMPONENT: Identity */}
                        <div className="h-[400px]">
                            <StudentIdCard />
                        </div>

                        <AnnouncementBanner />

                        {/* INGESTED COMPONENT: Mission Timer (Now Dynamic) */}
                        <div
                            className="p-6 rounded-2xl bg-[#0F1629] border border-white/5 relative overflow-hidden group hover:border-red-500/30 transition-all cursor-pointer"
                            onClick={() => navigate(activeMission.actionPath)}
                        >
                            <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 blur-xl rounded-full"></div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                        <h4 className="text-xs font-bold text-red-400 uppercase tracking-widest">Active Mission</h4>
                                    </div>
                                    <Clock className="w-4 h-4 text-slate-500" />
                                </div>
                                <h3 className="font-bold text-white text-lg mb-1">{activeMission.title}</h3>
                                <p className="text-xs text-slate-400 mb-4 line-clamp-2">{activeMission.description}</p>

                                <div className="flex justify-between items-end">
                                    <div className="text-center">
                                        <div className="text-2xl font-mono mobile-font font-bold text-white">{activeMission.xp}</div>
                                        <div className="text-[10px] text-slate-500 uppercase">XP Reward</div>
                                    </div>

                                    <div className="text-right">
                                        <div className="text-2xl font-mono mobile-font font-bold text-white">{activeMission.deadline || "None"}</div>
                                        <div className="text-[10px] text-slate-500 uppercase">Deadline</div>
                                    </div>
                                </div>
                                <div className="w-full bg-white/5 h-1 rounded-full mt-4 overflow-hidden">
                                    <div className="bg-red-500 h-full w-[33%] shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                                </div>
                                <div className="mt-2 text-[10px] text-red-400 text-right uppercase font-bold tracking-widest">{activeMission.actionLabel} &rarr;</div>
                            </div>
                        </div>

                        <FundingUnlock />

                        <div
                            className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 cursor-pointer hover:border-amber-500/40 transition-all group"
                            onClick={() => { playClick(); navigate('/dashboard/honor-roll'); }}
                            onMouseEnter={() => playHover()}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <CreditULogo className="w-8 h-8" variant="gold" showShield={false} iconClassName="w-6 h-6" />
                                <h4 className="font-bold text-amber-100">Dean's Honor Roll</h4>
                            </div>
                            <p className="text-sm text-amber-200/70 mb-4">
                                Apply for honors status and view the campus leaderboard.
                            </p>
                            <div className="flex items-center gap-2 text-xs font-medium text-amber-300">
                                <span>View Standings</span>
                                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>

                        <div
                            className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 cursor-pointer hover:border-emerald-500/40 transition-all group mt-6"
                            onClick={() => { playClick(); navigate('/dashboard/lab'); }}
                            onMouseEnter={() => playHover()}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <Eye className="text-emerald-400 group-hover:text-emerald-300 transition-colors" size={20} />
                                <h4 className="font-bold text-emerald-100">Visibility Lab</h4>
                            </div>
                            <p className="text-sm text-emerald-200/70 mb-4">
                                Learn to read your money clearly with guided interpretation.
                            </p>
                            <div className="flex items-center gap-2 text-xs font-medium text-emerald-300">
                                <span>Enter Lab</span>
                                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>

                        <div
                            className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20 cursor-pointer hover:border-indigo-500/40 transition-all group mt-6"
                            onClick={() => { playClick(); navigate('/dashboard/voice-training'); }}
                            onMouseEnter={() => playHover()}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <Mic className="text-indigo-400 group-hover:text-indigo-300 transition-colors" size={20} />
                                <h4 className="font-bold text-indigo-100">Voice Command Lab</h4>
                            </div>
                            <p className="text-sm text-indigo-200/70 mb-4">
                                Train your articulation and intent with AI-powered speech analysis.
                            </p>
                            <div className="flex items-center gap-2 text-xs font-medium text-indigo-300">
                                <span>Start Training</span>
                                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* INGESTED COMPONENT: FAB */}
            <QuickActionsFAB />
        </div >
    )
}
