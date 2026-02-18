import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useProfile } from '@/hooks/useProfile'
import { LayoutDashboard, GraduationCap, CreditCard, Users, Settings, LogOut, Sparkles, Menu, X, BookOpen, ShoppingBag, Brain, Wrench, Shield, Target, Vault, Network, MonitorPlay } from 'lucide-react'
import { CreditULogo } from '@/components/common/CreditULogo'
import { GuideAgent } from '@/components/ai/GuideAgent'
import { useGamification } from '@/hooks/useGamification'
import { LevelUpOverlay } from '@/components/gamification/LevelUpOverlay'
import { HexMatrixBackground } from '@/components/layout/HexMatrixBackground'

function UserHeader() {
    const { profile, loading } = useProfile()

    if (loading) {
        return <div className="h-8 w-32 bg-white/5 rounded-full animate-pulse"></div>
    }

    const displayName = profile?.first_name || "Student"
    const displayLast = profile?.last_name?.[0] || ""
    const mooPoints = profile?.moo_points || 0

    return (
        <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">{mooPoints.toLocaleString()} PTS</span>
            </div>
            <div className="flex items-center gap-3 pl-3 border-l border-white/10">
                <div className="text-right hidden md:block">
                    <div className="text-sm font-bold text-white leading-none">{displayName} {displayLast}.</div>
                    <div className="text-[10px] text-indigo-400 font-medium uppercase tracking-wider">{profile?.academic_level || "Freshman"}</div>
                </div>
                <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px] shadow-[0_0_10px_rgba(79,70,229,0.4)]">
                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-white text-xs font-bold">
                            {displayName[0]}{displayLast}
                        </div>
                    </div>
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-black rounded-full"></div>
                </div>
            </div>
        </div>
    )
}

const SidebarItem = ({ icon: Icon, label, path, isActive, onClick }: any) => (
    <Link
        to={path}
        onClick={onClick}
        className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
            isActive
                ? "bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                : "text-slate-400 hover:text-white hover:bg-white/5"
        )}
    >
        {isActive && <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20"></div>}
        <Icon className={cn("w-5 h-5 relative z-10", isActive ? "text-white" : "text-slate-500 group-hover:text-amber-400 transition-colors")} />
        <span className={cn("font-medium relative z-10 text-sm", isActive ? "font-bold" : "")}>{label}</span>
        {isActive && <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></div>}
    </Link>
)

export default function CampusLayout({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { showLevelUp, newLevel, dismissLevelUp } = useGamification()
    const { profile } = useProfile()

    // Close mobile menu on route change
    React.useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    const navItems = [
        { icon: LayoutDashboard, label: "Command Center", path: "/dashboard", match: "/dashboard" },
        { icon: Target, label: "Dream Architect", path: "/dashboard/dream-architect", match: "/dashboard/dream-architect" },
        { icon: Shield, label: "Neural Protocol", path: "/dashboard/financial-nervous-system", match: "/dashboard/financial-nervous-system" },
        { icon: Network, label: "Neural Network", path: "/dashboard/neural-network", match: "/dashboard/neural-network" },
        { icon: GraduationCap, label: "Curriculum", path: "/dashboard/curriculum", match: "/dashboard/curriculum" },
        { icon: BookOpen, label: "Knowledge Center", path: "/dashboard/knowledge", match: "/dashboard/knowledge" },
        { icon: Wrench, label: "Tools Hub", path: "/dashboard/tools", match: "/dashboard/tools" },
        { icon: Vault, label: "The Vault", path: "/dashboard/vault", match: "/dashboard/vault" },
        { icon: Brain, label: "Credit Quest", path: "/dashboard/credit-quest", match: "/dashboard/credit-quest" },
        { icon: MonitorPlay, label: "Lecture Hall", path: "/dashboard/lecture-hall", match: "/dashboard/lecture-hall" },
        { icon: CreditCard, label: "Credit Lab", path: "/dashboard/credit-lab", match: "/dashboard/credit-lab" },
        { icon: Users, label: "Global Campus", path: "/dashboard/community", match: "/dashboard/community" },
        { icon: Sparkles, label: "Vision Board", path: "/dashboard/vision", match: "/dashboard/vision" },
        { icon: ShoppingBag, label: "Moo Emporium", path: "/dashboard/store", match: "/dashboard/store" },
        { icon: Settings, label: "Settings", path: "/dashboard/settings", match: "/dashboard/settings" },
    ];

    return (
        <div className="min-h-screen bg-transparent text-white flex font-sans selection:bg-indigo-500/30 relative">
            <HexMatrixBackground />

            {/* Mobile Header */}
            <header className="md:hidden fixed top-0 w-full z-40 bg-[#020412]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 h-16">
                <div className="flex items-center gap-2">
                    <div className="bg-indigo-950 p-1 rounded-lg border border-white/10 overflow-hidden">
                        <CreditULogo className="w-8 h-8" variant="white" showShield={false} iconClassName="w-7 h-7" />
                    </div>
                    <span className="font-heading font-black tracking-tight text-lg">CREDIT U</span>
                </div>
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-300">
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </header>

            {/* Sidebar Desktop & Mobile */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-30 w-72 bg-[#050B1D] border-r border-white/5 flex flex-col transition-transform duration-300 md:translate-x-0",
                mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Logo Area */}
                <div className="h-24 flex items-center px-8 border-b border-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/20 to-transparent"></div>
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg shadow-indigo-500/20 border border-white/10">
                            <CreditULogo className="w-full h-full" showShield={false} iconClassName="w-11 h-11" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-heading font-black text-xl tracking-tight text-white leading-none">CREDIT U</span>
                            <span className="text-[10px] text-indigo-400 font-bold tracking-[0.2em] uppercase mt-1">University</span>
                        </div>
                    </div>
                </div>

                {/* Nav Items */}
                <div className="flex-1 px-4 py-8 space-y-1 overflow-y-auto custom-scrollbar">
                    <div className="px-4 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-600">Main Module</div>
                    {navItems.map((item) => (
                        <SidebarItem
                            key={item.path}
                            {...item}
                            isActive={item.path === "/dashboard" ? location.pathname === "/dashboard" : location.pathname.startsWith(item.match)}
                        />
                    ))}
                </div>

                {/* Bottom Area */}
                <div className="p-4 border-t border-white/5 bg-black/20">
                    <SidebarItem icon={Settings} label="System Settings" path="/dashboard/settings" isActive={location.pathname === '/dashboard/settings'} />
                    <button className="flex items-center gap-3 px-4 py-3 w-full text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all mt-2 group">
                        <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium text-sm">Disconnect</span>
                    </button>

                    <div className="mt-6 text-center text-[10px] text-slate-700 font-mono">
                        v2.0.4 • HIGH TABLE
                    </div>

                    {profile?.role === 'admin' && (
                        <Link to="/admin" className="mt-4 block px-4 py-2 bg-slate-900 rounded-lg border border-slate-800 text-center text-xs font-bold text-slate-400 hover:text-white hover:border-indigo-500/50 transition-all">
                            ADMIN PORTAL ACCESS
                        </Link>
                    )}
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 md:ml-72 flex flex-col min-h-screen relative z-0">
                {/* Impersonation Banner */}
                {typeof window !== 'undefined' && sessionStorage.getItem('impersonate_id') && (
                    <div className="bg-red-900/90 text-white px-4 py-2 flex items-center justify-between shadow-lg backdrop-blur-md sticky top-0 z-50">
                        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
                            <Users size={16} /> Viewing as Student
                        </div>
                        <button
                            onClick={() => {
                                sessionStorage.removeItem('impersonate_id')
                                window.location.reload()
                            }}
                            className="bg-white text-red-900 px-3 py-1 rounded-md text-xs font-bold hover:bg-slate-200 transition-colors"
                        >
                            Exit View
                        </button>
                    </div>
                )}

                {/* Desktop Header */}
                <header className="h-20 hidden md:flex items-center justify-between px-8 border-b border-white/5 bg-[#020412]/80 backdrop-blur-xl sticky top-0 z-20">
                    <div className="flex flex-col">
                        <h1 className="font-heading font-bold text-xl text-white tracking-tight">
                            {(() => {
                                const active = navItems.find(i => userPathMatch(location.pathname, i.match))
                                return active ? active.label : "System Dashboard"
                            })()}
                        </h1>
                        <p className="text-xs text-slate-500 font-medium flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Secure Connection Established
                        </p>
                    </div>
                    <UserHeader />
                </header>

                <main className="flex-1 overflow-x-hidden pt-16 md:pt-0">
                    {children}
                </main>
            </div>

            <GuideAgent />
            {showLevelUp && (
                <LevelUpOverlay
                    newLevel={newLevel}
                    onDismiss={dismissLevelUp}
                />
            )}
        </div>
    )
}

function userPathMatch(current: string, target: string) {
    if (target === '/dashboard') return current === '/dashboard'
    return current.startsWith(target)
}
