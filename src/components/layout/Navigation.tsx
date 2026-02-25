import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, CreditCard, Trophy, Globe, LogOut, Settings, BookOpen, Library, Map, Target } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Navigation() {
    const { signOut } = useAuth();
    const location = useLocation();

    const navItems = [
        { label: 'Command', path: '/dashboard', icon: LayoutDashboard }, // Home
        { label: 'Classes', path: '/learn', icon: BookOpen },            // Course Player (New Hub)
        { label: 'Library', path: '/library', icon: Library },           // Knowledge Center
        { label: 'Quest', path: '/quest', icon: Map },                   // Gamification
        { label: 'Vision', path: '/vision', icon: Target },              // Vision Board
        { label: 'Exchange', path: '/exchange', icon: CreditCard },      // Store
        { label: 'Honor Roll', path: '/honor-roll', icon: Trophy },      // Leaderboard
        { label: 'Network', path: '/community', icon: Globe },           // Community
        { label: 'Credit Lab', path: '/credit-lab', icon: BookOpen },    // Professor/Guidance (Entry)
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0a0a0a] border-r border-white/10 flex flex-col z-50">
            <div className="p-6 border-b border-white/5">
                <Link to="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center">
                        <span className="font-black text-black text-xl">C</span>
                    </div>
                    <span className="font-bold text-white text-lg tracking-tight">Credit U</span>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-white text-black font-bold shadow-lg shadow-white/5"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <item.icon className={cn("h-5 w-5", isActive ? "text-black" : "text-gray-400 group-hover:text-white")} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}

                <div className="my-4 border-t border-white/5 mx-2"></div>

                <Link
                    to="/dashboard/settings"
                    className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                        location.pathname === '/dashboard/settings'
                            ? "bg-white/10 text-white"
                            : "text-gray-500 hover:text-white hover:bg-white/5"
                    )}
                >
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                </Link>
            </nav>

            <div className="p-4 border-t border-white/5">
                <button
                    onClick={signOut}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
