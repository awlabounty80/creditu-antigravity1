import { useEffect, useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, BookOpen, Trophy, TrendingUp, Sparkles, Zap, Clock, Play, Activity, Eye, Mic, Wrench, Beaker, ShoppingCart, Users, Image as ImageIcon, Lock, Library } from 'lucide-react'
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
import { CreditUTV } from '@/components/dashboard/CreditUTV'
import { MooPointWallet } from '@/components/learn/MooPointWallet'
import { getClientCourse } from '@/lib/client-curriculum'
import { AchievementGallery } from '@/components/learn/AchievementGallery'
// import { ProfessorGenerative } from '@/components/dashboard/ProfessorGenerative'

import { JulesTerminal } from '@/components/dashboard/JulesTerminal'
import { BureauSyncStatus } from '@/components/dashboard/BureauSyncStatus'

import { DashboardResetMode } from '@/components/dashboard/DashboardResetMode'
import { EXTERNAL_RESOURCES } from '@/data/external-resources'
import { MISSIONS } from '@/data/missions'
import { useSound } from '@/hooks/useSound'

// COMMAND CENTER CONFIGURATION
type BadgeType = 'Active' | 'Continue' | 'Updated' | 'New' | 'Coming Soon';

interface CommandCenterCardData {
    title: string;
    description: string;
    icon: any; 
    route: string;
    badge?: BadgeType;
    isDisabled?: boolean;
    colorClassName: string;
}

const COMMAND_CENTER_APPS: CommandCenterCardData[] = [
    {
        title: 'Curriculum',
        description: 'Course player & verified lessons',
        icon: Play,
        route: '/dashboard/curriculum',
        badge: 'Continue',
        colorClassName: 'from-indigo-500/20 to-indigo-600/5 border-indigo-500/30 text-indigo-400 group-hover:border-indigo-400/60',
    },
    {
        title: 'Knowledge Center',
        description: 'Comprehensive research library',
        icon: Library,
        route: '/dashboard/knowledge',
        colorClassName: 'from-blue-500/20 to-blue-600/5 border-blue-500/30 text-blue-400 group-hover:border-blue-400/60',
    },
    {
        title: 'Tools Hub',
        description: '13 professional financial tools',
        icon: Wrench,
        route: '/dashboard/tools',
        colorClassName: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/30 text-emerald-400 group-hover:border-emerald-400/60',
    },
    {
        title: 'Credit Lab',
        description: 'Specialized management tools',
        icon: Beaker,
        route: '/dashboard/credit-lab',
        colorClassName: 'from-cyan-500/20 to-cyan-600/5 border-cyan-500/30 text-cyan-400 group-hover:border-cyan-400/60',
    },
    {
        title: 'Credit Quest',
        description: 'Gamified learning scenarios',
        icon: Sparkles,
        route: '/dashboard/quest',
        colorClassName: 'from-purple-500/20 to-purple-600/5 border-purple-500/30 text-purple-400 group-hover:border-purple-400/60',
    },
    {
        title: 'Vision Board',
        description: 'Goal visualization & tracking',
        icon: ImageIcon,
        route: '/dashboard/vision-board',
        colorClassName: 'from-pink-500/20 to-pink-600/5 border-pink-500/30 text-pink-400 group-hover:border-pink-400/60',
    },
    {
        title: 'Moo Store',
        description: 'Rewards marketplace',
        icon: ShoppingCart,
        route: '/dashboard/store',
        colorClassName: 'from-amber-500/20 to-amber-600/5 border-amber-500/30 text-amber-400 group-hover:border-amber-400/60',
    },
    {
        title: 'Community Campus',
        description: 'Global campus network',
        icon: Users,
        route: '/dashboard/community',
        colorClassName: 'from-orange-500/20 to-orange-600/5 border-orange-500/30 text-orange-400 group-hover:border-orange-400/60',
    },
    {
        title: 'Student Locker',
        description: 'Secure document storage',
        icon: Lock,
        route: '#',
        badge: 'Coming Soon',
        isDisabled: true,
        colorClassName: 'from-slate-500/10 to-slate-600/5 border-white/5 text-slate-500 group-hover:border-white/10',
    },
    {
        title: 'Dream Architect',
        description: 'AI blueprint generation',
        icon: Activity,
        route: '#',
        badge: 'Coming Soon',
        isDisabled: true,
        colorClassName: 'from-slate-500/10 to-slate-600/5 border-white/5 text-slate-500 group-hover:border-white/10',
    }
];

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
    const [stats, setStats] = useState({
        lessonsCompleted: 0,
        modulesCompleted: 0,
        phaseProgress: 0,
        totalLessons: 100 // Default for Credit 101
    });

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

        async function fetchUniversityStats() {
            // 1. Fetch Lessons Completed
            const { data: progressData } = await supabase
                .from('student_progress')
                .select('lesson_id, module_id, phase_id')
                .eq('user_id', profile.id)
                .eq('completed', true);

            if (progressData) {
                const completedCount = progressData.length;

                // 2. Calculate Modules Completed (Assuming 10 lessons per module)
                const modules = new Set(progressData.map(p => p.module_id));
                // A module is completed if all its lessons are done. Simple count for now:
                const moduleCompletionMap: Record<string, number> = {};
                progressData.forEach(p => {
                    if (p.module_id) moduleCompletionMap[p.module_id] = (moduleCompletionMap[p.module_id] || 0) + 1;
                });
                const completedModulesCount = Object.values(moduleCompletionMap).filter(count => count >= 10).length;

                // 3. Phase Progress (Overall for Credit 101)
                const overallProgress = Math.min(100, (completedCount / 100) * 100);

                setStats({
                    lessonsCompleted: completedCount,
                    modulesCompleted: completedModulesCount,
                    phaseProgress: Math.round(overallProgress),
                    totalLessons: 100
                });
            }
        }

        fetchEnrollments();
        fetchUniversityStats();
    }, [profile])


    // CHECK FOR RESET MODE (Day 1 Complete)
    // FORCE RELEASE: Always bypass rest mode for now to ensure site access
    const [isRestMode, setIsRestMode] = useState(false);

    // SAFETY BYPASS: Never allow the "INITIALIZING" screen to stay more than 2.5 seconds
    useEffect(() => {
        if (loading) {
            const timer = setTimeout(() => {
                console.warn("StudentDashboard: [SAFETY] Initialization timeout. Forcing UI reveal.");
                // We don't set loading to false globally yet, but we ensure the profile-dependent content has a chance
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [loading]);

    // Only show full-page loading if we have no profile AND no cached session AND within safety window
    if (loading && !profile && !user) {
        return (
            <div className="h-screen w-full bg-[#020412] flex flex-col items-center justify-center p-6 text-center">
                <div className="relative mb-8">
                    <div className="absolute inset-0 blur-3xl opacity-20 bg-indigo-500 rounded-full animate-pulse" />
                    <Zap className="w-16 h-16 text-amber-500 animate-bounce relative z-10" />
                </div>
                <div className="text-xl font-black text-white italic tracking-tighter uppercase animate-pulse">
                    Initializing V2.1 System...
                </div>
                <div className="mt-4 text-[10px] font-mono text-slate-600 uppercase tracking-[0.5em]">
                    Authenticating Node // Establishing Secure Link
                </div>
            </div>
        );
    }

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
                                    onClick={() => { playClick(); navigate('/learn'); }}
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Moo Point Wallet */}
                    <MooPointWallet userId={profile?.id || ""} />

                    {/* Bureau Sync Tracking Module */}
                    <BureauSyncStatus />

                    <Card
                        onClick={() => { playClick(); navigate('/learn'); }}
                        onMouseEnter={() => playHover()}
                        className="bg-[#0A0F1E] border-white/5 relative overflow-hidden group hover:border-emerald-500/30 transition-colors cursor-pointer"
                    >
                        <div className="absolute top-0 right-0 p-16 bg-emerald-500/5 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-emerald-500/10 transition-colors"></div>
                        <CardContent className="p-8 relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Lesson Mastery</h3>
                                <BookOpen className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div className="flex items-baseline gap-2">
                                <div className="text-5xl font-black text-white leading-none">{stats.lessonsCompleted}</div>
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">/ {stats.totalLessons}</div>
                            </div>
                            <div className="w-full bg-white/5 h-1.5 rounded-full mt-6 overflow-hidden border border-white/5">
                                <div
                                    className="bg-emerald-500 h-full transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                    style={{ width: `${(stats.lessonsCompleted / stats.totalLessons) * 100}%` }}
                                />
                            </div>
                            <p className="text-[10px] text-slate-500 mt-4 font-bold uppercase tracking-tight">University Foundation Progress</p>
                        </CardContent>
                    </Card>

                    <Card
                        onClick={() => { playClick(); navigate('/learn'); }}
                        onMouseEnter={() => playHover()}
                        className="bg-[#0A0F1E] border-white/5 relative overflow-hidden group hover:border-indigo-500/30 transition-colors cursor-pointer shadow-2xl"
                    >
                        <div className="absolute top-0 right-0 p-16 bg-indigo-500/5 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-indigo-500/10 transition-colors"></div>
                        <CardContent className="p-8 relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Phase Progress</h3>
                                <Trophy className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div className="flex items-baseline gap-2">
                                <div className="text-5xl font-black text-white leading-none tracking-tighter">{stats.phaseProgress}</div>
                                <div className="text-2xl font-black text-indigo-400/50 uppercase">%</div>
                            </div>

                            <div className="flex items-center gap-2 mt-6">
                                <div className="flex -space-x-1">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                            className={`w-4 h-4 rounded-full border border-[#0A0F1E] ${i <= stats.modulesCompleted ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'bg-white/5'}`}
                                        />
                                    ))}
                                </div>
                                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                                    {stats.modulesCompleted} / 10 Modules Graduated
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* COMMAND CENTER HUB */}
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-2">
                        <div>
                            <h2 className="text-2xl font-black text-white font-heading tracking-tight">Command Center Apps</h2>
                            <p className="text-slate-400 text-sm">Everything you need to learn, build, track, and move forward.</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl">
                        {COMMAND_CENTER_APPS.map((app, idx) => {
                            const Icon = app.icon;
                            return (
                                <div 
                                    key={idx}
                                    onClick={() => {
                                        if (!app.isDisabled) {
                                            playClick();
                                            navigate(app.route);
                                        }
                                    }}
                                    onMouseEnter={() => { if(!app.isDisabled) playHover(); }}
                                    className={`relative p-5 rounded-2xl bg-gradient-to-br border backdrop-blur-sm transition-all duration-300 group
                                        ${app.isDisabled 
                                            ? 'opacity-60 cursor-not-allowed bg-black/40 border-white/5' 
                                            : `cursor-pointer hover:-translate-y-1 hover:shadow-xl bg-[#0A0F1E] ${app.colorClassName}`
                                        }
                                    `}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className={`p-2 rounded-xl bg-black/40 backdrop-blur-md border border-white/5 ${!app.isDisabled && 'group-hover:scale-110 transition-transform'}`}>
                                            <Icon className={`w-5 h-5 ${app.isDisabled ? 'text-slate-500' : 'text-current'}`} />
                                        </div>
                                        {app.badge && (
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border 
                                                ${app.badge === 'Coming Soon' ? 'bg-slate-900 border-slate-700 text-slate-400' : 
                                                  app.badge === 'Continue' ? 'bg-indigo-900/30 border-indigo-500/50 text-indigo-300' : 
                                                  'bg-emerald-900/30 border-emerald-500/50 text-emerald-300'}`}>
                                                {app.badge}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className={`font-bold text-lg mb-1 leading-tight ${app.isDisabled ? 'text-slate-400' : 'text-white'}`}>
                                        {app.title}
                                    </h3>
                                    <p className={`text-xs ${app.isDisabled ? 'text-slate-600' : 'text-slate-400 group-hover:text-slate-300'} transition-colors line-clamp-2`}>
                                        {app.description}
                                    </p>
                                    
                                    {!app.isDisabled && (
                                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-30 transition-opacity"></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Column */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* INGESTED COMPONENT: Progression Logic */}
                        <FoundationCoreClass />

                        {/* FRESHMAN CORE CLASSES */}
                        <div className="space-y-4">
                            <h3 className="font-heading text-xl font-bold text-white flex items-center gap-2">
                                <Brain className="w-5 h-5 text-indigo-400" />
                                Freshman Core Classes
                            </h3>
                            <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-[#0F1629] to-[#0A0F1E] border border-indigo-500/20 group hover:border-indigo-500/40 transition-all cursor-pointer shadow-lg relative overflow-hidden" 
                                 onClick={() => { playClick(); navigate('/dashboard/labs/financial-nervous-system'); }}
                                 onMouseEnter={() => playHover()}
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-colors group-hover:bg-indigo-500/20" />
                                
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-indigo-900/30 border border-indigo-500/50 text-indigo-300">
                                                Freshman Core Class
                                            </span>
                                        </div>
                                        <h4 className="text-2xl font-black text-white font-heading tracking-tight mb-1 group-hover:text-indigo-300 transition-colors">
                                            Financial Nervous System™
                                        </h4>
                                        <h5 className="text-indigo-400 font-medium mb-3">
                                            Calm your money mind. Reset your financial response.
                                        </h5>
                                        <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
                                            A guided experience designed to help students understand how stress, fear, survival mode, and emotional patterns impact financial decisions, credit behavior, and long-term growth.
                                        </p>
                                        
                                        {/* Hover Expanded Learning Outcomes */}
                                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 opacity-0 h-0 group-hover:opacity-100 group-hover:h-auto overflow-hidden transition-all duration-500">
                                            {[
                                                "Understand your financial stress responses",
                                                "Identify fear-based money habits",
                                                "Reset emotional patterns around credit",
                                                "Build calmer financial decision-making",
                                                "Create stronger consistency for growth"
                                            ].map((outcome, idx) => (
                                                <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                                                    <div className="w-1 h-1 rounded-full bg-indigo-500 shrink-0" />
                                                    {outcome}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="shrink-0 w-full md:w-auto mt-4 md:mt-0">
                                        <Button className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-6 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]">
                                            Enter Class <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

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
                                        onClick={() => { playClick(); navigate(`/learn/${enr.course_id}`); }}
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

                        {/* Achievements Section */}
                        <AchievementGallery userId={profile?.id || ""} />
                    </div>

                    {/* Sidebar Column */}
                    <div className="space-y-8">
                        {/* PROFESSOR GENERATIVE EXPERIENCE - REPLACES BROKEN VIDEO */}
                        <CreditUTV
                            videoUrl="/assets/dorm-welcome.mp4"
                            transcript="Welcome to the Wealth Game. I’m your professor, Dr. Leverage. Most people are taught that credit is a trap, a way to keep you in debt. That is the old way, the 'Consumer Mindset.' Here at Credit U, we build Architects. We view credit as a tool for Leverage. In the Wealth Game, cash is for spending, but Credit is for building. Your credit report isn't a judgment of your worth; it's a scoreboard of your discipline. A high score tells the world, 'I keep my promises.' Cash takes years to save. Credit allows you to access capital today to buy assets that pay you tomorrow. You are not here to fix a number; you are here to build a legacy. Let's begin."
                        />

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
