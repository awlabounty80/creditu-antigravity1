import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Trophy, Medal, Crown } from "lucide-react";

interface HonorStudent {
    username: string;
    moo_points: number;
    tier: string;
}

export const LeaderboardTable = () => {
    const [students, setStudents] = useState<HonorStudent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const { data, error } = await supabase.rpc('get_honor_roll');
            if (error) throw error;
            if (data) setStudents(data);
        } catch (err) {
            console.error("Leaderboard error:", err);
        } finally {
            setLoading(false);
        }
    };

    const getRankIcon = (index: number) => {
        if (index === 0) return <Crown className="h-5 w-5 text-yellow-500" />;
        if (index === 1) return <Medal className="h-5 w-5 text-gray-400" />;
        if (index === 2) return <Medal className="h-5 w-5 text-amber-700" />;
        return <span className="text-gray-500 font-mono">#{index + 1}</span>;
    };

    return (
        <div className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
            <div className="p-6 border-b border-white/5 flex items-center gap-3">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <h3 className="text-lg font-bold tracking-wide text-white">TOP STUDENTS</h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-white/5 text-gray-200 uppercase tracking-wider text-xs">
                        <tr>
                            <th className="px-6 py-4 font-bold">Rank</th>
                            <th className="px-6 py-4 font-bold">Student</th>
                            <th className="px-6 py-4 font-bold">Tier</th>
                            <th className="px-6 py-4 font-bold text-right">Liquidity ($CU)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500 animate-pulse">
                                    Calculating rankings...
                                </td>
                            </tr>
                        ) : students.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                    No active students yet. Be the first!
                                </td>
                            </tr>
                        ) : (
                            students.map((student, index) => (
                                <tr key={index} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">
                                        {getRankIcon(index)}
                                    </td>
                                    <td className="px-6 py-4 text-white font-medium">
                                        {student.username || "Anonymous"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${student.tier === 'Legend' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                                                student.tier === 'Scholar' ? 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20' :
                                                    'bg-zinc-800 text-zinc-400'
                                            }`}>
                                            {student.tier}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono text-emerald-400">
                                        {student.moo_points.toLocaleString()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
