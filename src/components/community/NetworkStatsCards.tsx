import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Users, CheckCircle, TrendingUp, Activity } from "lucide-react";
import { motion } from "framer-motion";

interface NetworkStats {
    total_users: number;
    total_points: number;
    total_lessons: number;
}

export const NetworkStatsCards = () => {
    const [stats, setStats] = useState<NetworkStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const { data, error } = await supabase.rpc('get_network_stats');
            if (error) throw error;
            if (data) setStats(data as NetworkStats);
        } catch (err) {
            console.error("Stats error:", err);
        } finally {
            setLoading(false);
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    const StatCard = ({ title, value, icon: Icon, color, delay }: any) => (
        <motion.div
            variants={item}
            className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 backdrop-blur-md hover:border-white/10 transition-colors group"
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${color} bg-opacity-10 group-hover:bg-opacity-20 transition-all`}>
                    <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
                </div>
                <Activity className="h-4 w-4 text-zinc-700 group-hover:text-zinc-500" />
            </div>
            <div className="space-y-1">
                <h3 className="text-zinc-500 text-sm font-medium tracking-wide uppercase">{title}</h3>
                <div className="text-3xl font-black text-white tracking-tight">
                    {loading ? "..." : value.toLocaleString()}
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-emerald-500" />
                <h2 className="text-xl font-bold tracking-tight text-white">NETWORK INTELLIGENCE</h2>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
                <StatCard
                    title="Active Students"
                    value={stats?.total_users || 0}
                    icon={Users}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Liquidity Generated ($CU)"
                    value={stats?.total_points || 0}
                    icon={TrendingUp}
                    color="bg-emerald-500"
                />
                <StatCard
                    title="Modules Completed"
                    value={stats?.total_lessons || 0}
                    icon={CheckCircle}
                    color="bg-purple-500"
                />
            </motion.div>
        </div>
    );
};
