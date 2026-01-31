import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Users, Settings, LogOut, ShieldAlert, Code2 } from 'lucide-react'
import { useDeveloperMode } from '@/hooks/useDeveloperMode'

const SidebarItem = ({ icon: Icon, label, path, isActive }: any) => (
    <Link
        to={path}
        className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group text-sm font-medium",
            isActive
                ? "bg-slate-800 text-white shadow-lg"
                : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
        )}
    >
        <Icon className={cn("w-4 h-4", isActive ? "text-emerald-400" : "text-slate-500 group-hover:text-white")} />
        <span>{label}</span>
    </Link>
)

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const { isDevMode } = useDeveloperMode()

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 flex font-sans">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-800 bg-slate-900 flex flex-col fixed h-full z-10">
                <div className="p-6 flex items-center gap-3 border-b border-slate-800">
                    <div className="w-8 h-8 bg-red-900 rounded-md flex items-center justify-center text-red-200 shadow-inner">
                        <ShieldAlert size={18} />
                    </div>
                    <div>
                        <span className="font-bold text-base text-white tracking-tight">OPS HQ</span>
                        <span className="block text-[10px] text-slate-500 uppercase tracking-widest">Admin Layer</span>
                    </div>
                </div>

                <div className="flex-1 px-3 space-y-1 mt-6">
                    <div className="px-4 text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Main</div>
                    <SidebarItem icon={LayoutDashboard} label="Overview" path="/admin" isActive={location.pathname === '/admin'} />
                    <SidebarItem icon={Users} label="User Management" path="/admin/users" isActive={location.pathname.startsWith('/admin/users')} />
                    <SidebarItem icon={LayoutDashboard} label="Knowledge Cockpit" path="/admin/cockpit" isActive={location.pathname === '/admin/cockpit'} />

                    <div className="px-4 text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 mt-6">System</div>
                    <SidebarItem icon={Settings} label="Global Config" path="/admin/config" isActive={location.pathname === '/admin/config'} />
                </div>

                <div className="p-4 border-t border-slate-800">
                    <Link to="/" className="flex items-center gap-3 px-4 py-3 w-full text-slate-500 hover:text-white transition-all text-sm">
                        <LogOut size={16} />
                        <span>Exit God Mode</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 flex flex-col min-h-screen bg-slate-950">
                <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-8">
                    <h1 className="font-bold text-lg text-white">
                        {location.pathname === '/admin' ? 'System Overview' : 'Access Control'}
                    </h1>
                    <div className="flex items-center gap-4">
                        {isDevMode && (
                            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 bg-amber-950/30 px-3 py-1 rounded-full border border-amber-900/50 animate-pulse">
                                <Code2 size={12} />
                                DEV MODE
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-xs font-mono text-emerald-500 bg-emerald-950/30 px-3 py-1 rounded-full border border-emerald-900/50">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            SYSTEM ONLINE
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
