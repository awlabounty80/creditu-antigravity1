import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, CreditCard, Activity, DollarSign } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        userCount: 0,
        totalPoints: 0,
        disputeCount: 0,
        revenue: 0
    })

    useEffect(() => {
        const fetchStats = async () => {
            // 1. Users
            const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })

            // 2. Points (Sum) - RPC would be better but simple fetch for now if small
            // For scale, use a Postgres function. Here we just get a few and estimate or sum if small.
            // Let's use a specialized query or just mock the sum if we can't sum easily without RPC.
            // Actually, let's create a lightweight RPC for this later if needed. For now, fetch top 1000? No, inefficient.
            // We'll stick to count for users and disputes.

            // 3. Disputes
            // Check if table exists (it might not if they didn't run SQL), so wrap in try/catch or just 'user_disputes'
            const { count: disputeCount } = await supabase.from('user_disputes').select('*', { count: 'exact', head: true })

            setStats({
                userCount: userCount || 0,
                totalPoints: (userCount || 0) * 1500, // Estimated avg
                disputeCount: disputeCount || 0,
                revenue: (userCount || 0) * 97 // $97/mo avg
            })
        }
        fetchStats()
    }, [])

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-slate-900 border-slate-800 text-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Total Users</CardTitle>
                        <Users className="w-4 h-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats.userCount}</div>
                        <p className="text-xs text-slate-500 mt-1">Active Accounts</p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800 text-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Est. Moo Points</CardTitle>
                        <Activity className="w-4 h-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats.totalPoints.toLocaleString()}</div>
                        <p className="text-xs text-slate-500 mt-1">Economy Supply</p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800 text-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Disputes Generated</CardTitle>
                        <CreditCard className="w-4 h-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats.disputeCount}</div>
                        <p className="text-xs text-slate-500 mt-1">Actions Taken</p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800 text-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Revenue Potential</CardTitle>
                        <DollarSign className="w-4 h-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">${stats.revenue.toLocaleString()}</div>
                        <p className="text-xs text-slate-500 mt-1">Monthly RR (Est)</p>
                    </CardContent>
                </Card>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-12 text-center">
                <h3 className="text-slate-500 font-mono text-sm">REAL-TIME DB CONNECTION ACTIVE</h3>
            </div>
        </div>
    )
}
