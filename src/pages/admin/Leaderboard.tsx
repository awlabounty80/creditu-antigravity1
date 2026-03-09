import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { Trophy, User, Zap, ArrowLeft, Search, MoreVertical, Edit2, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LeaderboardEntry {
    user_id: string;
    total_points: number;
    profiles: {
        first_name: string;
        last_name: string;
        email: string;
    };
}

export default function AdminLeaderboard() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('student_moo_points')
            .select(`
                user_id,
                total_points,
                profiles:user_id (
                    first_name,
                    last_name,
                    email
                )
            `)
            .order('total_points', { ascending: false });

        if (!error && data) {
            setLeaderboard(data as any);
        }
        setLoading(false);
    };

    const handleAdjustPoints = async (userId: string, currentPoints: number) => {
        const adjustment = prompt(`How many points to add/subtract? (Current: ${currentPoints})`, "0");
        if (adjustment === null || isNaN(parseInt(adjustment))) return;

        const newTotal = currentPoints + parseInt(adjustment);
        const { error } = await supabase
            .from('student_moo_points')
            .update({ total_points: newTotal })
            .eq('user_id', userId);

        if (!error) {
            fetchLeaderboard();
        }
    };

    const handleResetLessons = async (userId: string) => {
        if (!confirm('Are you sure you want to PERMANENTLY RESET ALL lesson progress for this student? (Moo Points will NOT be affected)')) return;

        const { error } = await supabase
            .from('student_progress')
            .delete()
            .eq('user_id', userId);

        if (!error) {
            alert('Lesson progress reset successfully.');
            fetchLeaderboard();
        }
    };

    const handleResetPoints = async (userId: string) => {
        if (!confirm('Are you sure you want to reset this student\'s points to 0?')) return;

        const { error } = await supabase
            .from('student_moo_points')
            .update({ total_points: 0 })
            .eq('user_id', userId);

        if (!error) {
            fetchLeaderboard();
        }
    };

    const filteredLeaderboard = leaderboard.filter(entry =>
        `${entry.profiles?.first_name} ${entry.profiles?.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.profiles?.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen bg-gray-50/50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <Link to="/admin" className="text-xs font-bold text-indigo-600 flex items-center gap-1 uppercase tracking-widest hover:text-indigo-700 transition-colors mb-2">
                        <ArrowLeft className="w-3 h-3" /> Back to Terminal
                    </Link>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase flex items-center gap-3">
                        <Trophy className="w-8 h-8 text-yellow-500" />
                        University Leaderboard
                    </h1>
                    <p className="text-gray-500 font-medium">Global student rankings and Moo Point distribution.</p>
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search students..."
                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-indigo-600 border-none shadow-xl shadow-indigo-200">
                    <CardContent className="p-6 text-white space-y-2">
                        <div className="p-2 bg-white/10 w-fit rounded-lg">
                            <User className="w-5 h-5" />
                        </div>
                        <div className="text-3xl font-black">{leaderboard.length}</div>
                        <div className="text-xs font-bold uppercase tracking-widest opacity-80">Total Scholars</div>
                    </CardContent>
                </Card>
                <Card className="bg-yellow-500 border-none shadow-xl shadow-yellow-100">
                    <CardContent className="p-6 text-white space-y-2">
                        <div className="p-2 bg-white/10 w-fit rounded-lg">
                            <Zap className="w-5 h-5" />
                        </div>
                        <div className="text-3xl font-black">
                            {leaderboard.reduce((acc, curr) => acc + curr.total_points, 0).toLocaleString()}
                        </div>
                        <div className="text-xs font-bold uppercase tracking-widest opacity-80">Total Moo Points Minted</div>
                    </CardContent>
                </Card>
                <Card className="bg-white border-none shadow-xl">
                    <CardContent className="p-6 space-y-2">
                        <div className="p-2 bg-gray-50 w-fit rounded-lg">
                            <Trophy className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="text-3xl font-black text-gray-900">
                            {leaderboard[0]?.total_points.toLocaleString() || 0}
                        </div>
                        <div className="text-xs font-bold uppercase tracking-widest text-gray-400">Current Peak Reward</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-xl overflow-hidden">
                <CardContent className="p-0">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Rank</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Student</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Moo Points</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={4} className="px-6 py-8 h-16 bg-gray-50/50" />
                                    </tr>
                                ))
                            ) : filteredLeaderboard.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-20 text-center text-gray-400 italic">No scholars found.</td>
                                </tr>
                            ) : filteredLeaderboard.map((entry, idx) => (
                                <tr key={entry.user_id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm
                                            ${idx === 0 ? 'bg-yellow-500 text-white' :
                                                idx === 1 ? 'bg-gray-400 text-white' :
                                                    idx === 2 ? 'bg-amber-600 text-white' :
                                                        'bg-gray-100 text-gray-500'}`}>
                                            {idx + 1}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-900">{entry.profiles?.first_name} {entry.profiles?.last_name}</span>
                                            <span className="text-xs text-gray-500 font-medium">{entry.profiles?.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="px-3 py-1 bg-yellow-500/10 text-yellow-600 rounded-full font-black text-xs flex items-center gap-1.5 border border-yellow-500/20">
                                                <Zap className="w-3 h-3" /> {entry.total_points.toLocaleString()}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 hover:bg-yellow-50 hover:text-yellow-600"
                                                onClick={() => handleAdjustPoints(entry.user_id, entry.total_points)}
                                                title="Adjust Moo Points"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                                                onClick={() => handleResetLessons(entry.user_id)}
                                                title="Reset Lesson Progress"
                                            >
                                                <RotateCcw className="w-4 h-4 text-red-400" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-700"
                                                onClick={() => handleResetPoints(entry.user_id)}
                                                title="Reset Points to Zero"
                                            >
                                                <RotateCcw className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
