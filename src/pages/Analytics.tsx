import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Users, BookOpen, Trophy, Target, Clock, Award, Zap, ShieldAlert } from 'lucide-react';

export default function Analytics() {
    // ------------------------------------------------------------------
    // DYNAMIC DATA LOADER (UPDATED FROM DISPUTE WIZARD)
    // ------------------------------------------------------------------
    const [reportData, setReportData] = useState<any>(null);

    useEffect(() => {
        const stored = localStorage.getItem('credit_report_data');
        if (stored) {
            try {
                setReportData(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to load report data", e);
            }
        }
    }, []);

    // Calculate dynamic stats or fallback to mocks
    const dynamicStats = reportData ? {
        metric1: {
            value: reportData.accounts.filter((a: any) =>
                ['late', 'collection', 'charge', 'past due', 'repossession', 'foreclosure', 'bankruptcy'].some((k: string) => a.status.toLowerCase().includes(k))
            ).length,
            label: 'Negative Items Detected',
            change: '+2 Identified',
            icon: ShieldAlert,
            color: 'text-red-400',
            bg: 'bg-red-500/10',
            border: 'border-red-500/20'
        },
        metric2: {
            value: reportData.score || "N/A",
            label: 'Current Credit Score',
            change: 'Synced just now',
            icon: Trophy,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20'
        },
        metric3: {
            value: reportData.accounts.length,
            label: 'Total Accounts Monitored',
            change: 'Active Tracking',
            icon: BookOpen,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20'
        },
        metric4: {
            value: (125340 + (reportData.accounts.length * 100)).toLocaleString(), // Bonus points for data
            label: 'Moo Points',
            change: '+Sync Bonus',
            icon: Award,
            color: 'text-purple-400',
            bg: 'bg-purple-500/10',
            border: 'border-purple-500/20'
        }
    } : null;

    // Fallback Mock Data (Platform Stats)
    const stats = {
        totalStudents: 1247,
        activeToday: 342,
        coursesCompleted: 856,
        avgCompletionRate: 78,
        totalLessonsWatched: 12453,
        avgWatchTime: 8.5,
        quizzesTaken: 2341,
        avgQuizScore: 82,
        toolsUsed: 5678,
        mooPointsAwarded: 125340
    };

    const recentActivity = [
        { user: 'Student A.', action: 'Completed', item: 'Lesson 25: Credit Bureaus', time: '2 min ago' },
        { user: 'Student B.', action: 'Passed', item: 'FCRA Rights Quiz', time: '5 min ago' },
        { user: 'Student C.', action: 'Used', item: 'Credit Score Simulator', time: '8 min ago' },
        { user: 'Student D.', action: 'Completed', item: 'Lesson 10: Payment History', time: '12 min ago' },
        { user: 'Student E.', action: 'Generated', item: 'FCRA Dispute Letter', time: '15 min ago' }
    ];

    const topLessons = [
        { title: 'Lesson 1: Welcome to Credit U', views: 1247, completion: 98 },
        { title: 'Lesson 5: Understanding FICO', views: 1156, completion: 92 },
        { title: 'Lesson 10: Payment History', views: 1089, completion: 88 },
        { title: 'Lesson 15: Credit Utilization', views: 987, completion: 85 },
        { title: 'Lesson 20: Dispute Process', views: 876, completion: 82 }
    ];

    const toolUsage = [
        { name: 'Credit Score Simulator', uses: 1234, trend: '+12%' },
        { name: 'Dispute Letter Generator', uses: 987, trend: '+8%' },
        { name: 'Interactive Quizzes', uses: 856, trend: '+15%' },
        { name: 'Utilization Calculator', uses: 745, trend: '+5%' },
        { name: 'DTI Calculator', uses: 623, trend: '+10%' }
    ];

    return (
        <div className="min-h-screen bg-[#020412] text-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-heading font-bold mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        {reportData ? "My Credit Diagnostics" : "Platform Analytics"}
                    </h1>
                    <p className="text-slate-400">
                        {reportData ? "Real-time analysis of your uploaded credit profile metrics." : "Real-time insights into student engagement and platform performance."}
                    </p>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* CARD 1 */}
                    <Card className={`${dynamicStats ? dynamicStats.metric1.bg + ' ' + dynamicStats.metric1.border : 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20'}`}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                {dynamicStats ? <dynamicStats.metric1.icon className={`w-8 h-8 ${dynamicStats.metric1.color}`} /> : <Users className="w-8 h-8 text-indigo-400" />}
                                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded">{dynamicStats ? dynamicStats.metric1.change : '+12%'}</span>
                            </div>
                            <div className="text-3xl font-bold mb-1">{dynamicStats ? dynamicStats.metric1.value : stats.totalStudents.toLocaleString()}</div>
                            <div className="text-sm text-slate-400">{dynamicStats ? dynamicStats.metric1.label : 'Total Students'}</div>
                        </CardContent>
                    </Card>

                    {/* CARD 2 */}
                    <Card className={`${dynamicStats ? dynamicStats.metric2.bg + ' ' + dynamicStats.metric2.border : 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20'}`}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                {dynamicStats ? <dynamicStats.metric2.icon className={`w-8 h-8 ${dynamicStats.metric2.color}`} /> : <Trophy className="w-8 h-8 text-emerald-400" />}
                                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded">{dynamicStats ? dynamicStats.metric2.change : '+8%'}</span>
                            </div>
                            <div className="text-3xl font-bold mb-1">{dynamicStats ? dynamicStats.metric2.value : stats.coursesCompleted}</div>
                            <div className="text-sm text-slate-400">{dynamicStats ? dynamicStats.metric2.label : 'Courses Completed'}</div>
                        </CardContent>
                    </Card>

                    {/* CARD 3 */}
                    <Card className={`${dynamicStats ? dynamicStats.metric3.bg + ' ' + dynamicStats.metric3.border : 'bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20'}`}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                {dynamicStats ? <dynamicStats.metric3.icon className={`w-8 h-8 ${dynamicStats.metric3.color}`} /> : <BookOpen className="w-8 h-8 text-amber-400" />}
                                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded">{dynamicStats ? dynamicStats.metric3.change : '+15%'}</span>
                            </div>
                            <div className="text-3xl font-bold mb-1">{dynamicStats ? dynamicStats.metric3.value : stats.totalLessonsWatched.toLocaleString()}</div>
                            <div className="text-sm text-slate-400">{dynamicStats ? dynamicStats.metric3.label : 'Lessons Watched'}</div>
                        </CardContent>
                    </Card>

                    {/* CARD 4 */}
                    <Card className={`${dynamicStats ? dynamicStats.metric4.bg + ' ' + dynamicStats.metric4.border : 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20'}`}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                {dynamicStats ? <dynamicStats.metric4.icon className={`w-8 h-8 ${dynamicStats.metric4.color}`} /> : <Award className="w-8 h-8 text-purple-400" />}
                                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded">{dynamicStats ? dynamicStats.metric4.change : '+20%'}</span>
                            </div>
                            <div className="text-3xl font-bold mb-1">{dynamicStats ? dynamicStats.metric4.value : stats.mooPointsAwarded.toLocaleString()}</div>
                            <div className="text-sm text-slate-400">{dynamicStats ? dynamicStats.metric4.label : 'Moo Points Awarded'}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    {/* Recent Activity */}
                    <Card className="bg-white/5 border-white/10">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <Zap className="w-5 h-5 text-indigo-400" />
                                <h2 className="text-xl font-bold">Recent Activity</h2>
                            </div>
                            <div className="space-y-4">
                                {recentActivity.map((activity, idx) => (
                                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                        <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2" />
                                        <div className="flex-1">
                                            <div className="text-sm">
                                                <span className="font-medium text-white">{activity.user}</span>
                                                <span className="text-slate-400"> {activity.action} </span>
                                                <span className="text-indigo-400">{activity.item}</span>
                                            </div>
                                            <div className="text-xs text-slate-500 mt-1">{activity.time}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Lessons */}
                    <Card className="bg-white/5 border-white/10">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <TrendingUp className="w-5 h-5 text-emerald-400" />
                                <h2 className="text-xl font-bold">Top Performing Lessons</h2>
                            </div>
                            <div className="space-y-4">
                                {topLessons.map((lesson, idx) => (
                                    <div key={idx} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm font-medium text-white">{lesson.title}</div>
                                            <div className="text-xs text-slate-500">{lesson.views} views</div>
                                        </div>
                                        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all"
                                                style={{ width: `${lesson.completion}%` }}
                                            />
                                        </div>
                                        <div className="text-xs text-emerald-400">{lesson.completion}% completion rate</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tool Usage */}
                <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Target className="w-5 h-5 text-amber-400" />
                            <h2 className="text-xl font-bold">Tool Usage Statistics</h2>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                            {toolUsage.map((tool, idx) => (
                                <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div className="text-2xl font-bold mb-1">{tool.uses}</div>
                                    <div className="text-sm text-slate-400 mb-2">{tool.name}</div>
                                    <div className="flex items-center gap-1 text-xs text-emerald-400">
                                        <TrendingUp className="w-3 h-3" />
                                        {tool.trend}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Performance Indicators */}
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                    <Card className="bg-white/5 border-white/10">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Clock className="w-5 h-5 text-blue-400" />
                                <h3 className="font-bold">Avg Session Time</h3>
                            </div>
                            <div className="text-3xl font-bold mb-2">24.5 min</div>
                            <div className="text-sm text-slate-400">Per student visit</div>
                            <div className="mt-4 text-xs text-blue-400">+5% from last week</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/5 border-white/10">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Trophy className="w-5 h-5 text-amber-400" />
                                <h3 className="font-bold">Quiz Pass Rate</h3>
                            </div>
                            <div className="text-3xl font-bold mb-2">{stats.avgQuizScore}%</div>
                            <div className="text-sm text-slate-400">Average score</div>
                            <div className="mt-4 text-xs text-emerald-400">Above 70% target</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/5 border-white/10">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Users className="w-5 h-5 text-purple-400" />
                                <h3 className="font-bold">Return Rate</h3>
                            </div>
                            <div className="text-3xl font-bold mb-2">68%</div>
                            <div className="text-sm text-slate-400">Weekly active users</div>
                            <div className="mt-4 text-xs text-purple-400">Strong engagement</div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
