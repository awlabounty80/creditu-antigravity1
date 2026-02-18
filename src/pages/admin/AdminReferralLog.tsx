import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Download, Filter, Users, TrendingUp, Award, Mail, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { CreditULogo } from '@/components/common/CreditULogo';

interface ReferralLog {
    id: string;
    referrer_id: string;
    referrer_email: string;
    referrer_name: string;
    referred_email: string;
    referral_code: string;
    status: string;
    points_awarded: number;
    created_at: string;
    signed_up_at: string | null;
    referral_type: string;
}

interface AdminStats {
    totalReferrals: number;
    pendingReferrals: number;
    completedReferrals: number;
    totalPointsAwarded: number;
    uniqueReferrers: number;
}

export default function AdminReferralLog() {
    const [referrals, setReferrals] = useState<ReferralLog[]>([]);
    const [filteredReferrals, setFilteredReferrals] = useState<ReferralLog[]>([]);
    const [stats, setStats] = useState<AdminStats>({
        totalReferrals: 0,
        pendingReferrals: 0,
        completedReferrals: 0,
        totalPointsAwarded: 0,
        uniqueReferrers: 0
    });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    useEffect(() => {
        fetchReferrals();
    }, []);

    useEffect(() => {
        filterReferrals();
    }, [searchTerm, statusFilter, referrals]);

    const fetchReferrals = async () => {
        try {
            // Fetch all referrals with user profile data
            const { data: referralsData, error } = await supabase
                .from('referrals')
                .select(`
                    *,
                    referrer:profiles!referrer_id (
                        email,
                        first_name,
                        last_name
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Transform data
            const transformedData = referralsData?.map(r => ({
                id: r.id,
                referrer_id: r.referrer_id,
                referrer_email: r.referrer?.email || 'Unknown',
                referrer_name: `${r.referrer?.first_name || ''} ${r.referrer?.last_name || ''}`.trim() || 'Unknown',
                referred_email: r.referred_email,
                referral_code: r.referral_code,
                status: r.status,
                points_awarded: r.points_awarded || 0,
                created_at: r.created_at,
                signed_up_at: r.signed_up_at,
                referral_type: r.referral_type
            })) || [];

            setReferrals(transformedData);

            // Calculate stats
            const totalReferrals = transformedData.length;
            const pendingReferrals = transformedData.filter(r => r.status === 'pending').length;
            const completedReferrals = transformedData.filter(r => r.status === 'signed_up').length;
            const totalPointsAwarded = transformedData.reduce((sum, r) => sum + r.points_awarded, 0);
            const uniqueReferrers = new Set(transformedData.map(r => r.referrer_id)).size;

            setStats({
                totalReferrals,
                pendingReferrals,
                completedReferrals,
                totalPointsAwarded,
                uniqueReferrers
            });

        } catch (error) {
            console.error('Error fetching referrals:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterReferrals = () => {
        let filtered = [...referrals];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(r =>
                r.referrer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.referrer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.referred_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.referral_code.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(r => r.status === statusFilter);
        }

        setFilteredReferrals(filtered);
    };

    const confirmReferral = async (referralId: string) => {
        if (!confirm('Manually confirm this referral? This will award 2600 Moo Points to the referrer.')) return;

        try {
            const { error } = await supabase
                .from('referrals')
                .update({ status: 'signed_up', signed_up_at: new Date().toISOString() })
                .eq('id', referralId);

            if (error) throw error;
            fetchReferrals(); // Refresh data
        } catch (error) {
            console.error('Error confirming referral:', error);
            alert('Failed to confirm referral.');
        }
    };

    const exportToCSV = () => {
        const headers = ['Referrer Name', 'Referrer Email', 'Referred Email', 'Referral Code', 'Status', 'Points Awarded', 'Created At', 'Signed Up At'];
        const csvData = filteredReferrals.map(r => [
            r.referrer_name,
            r.referrer_email,
            r.referred_email,
            r.referral_code,
            r.status,
            r.points_awarded,
            new Date(r.created_at).toLocaleString(),
            r.signed_up_at ? new Date(r.signed_up_at).toLocaleString() : 'N/A'
        ]);

        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `referrals_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'signed_up':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                        <CheckCircle className="w-3 h-3" />
                        Signed Up
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
                        <Clock className="w-3 h-3" />
                        Pending
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">
                        <XCircle className="w-3 h-3" />
                        {status}
                    </span>
                );
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between bg-white p-8 rounded-2xl border-2 border-slate-200 shadow-sm">
                    <div className="flex items-center gap-6">
                        <CreditULogo className="w-20 h-20" variant="navy" />
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 mb-1 tracking-tight">Referral Log</h1>
                            <p className="text-slate-500 font-medium tracking-wide flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                Admin Management & Monitoring Center
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={exportToCSV}
                        className="gap-2 bg-[#1a1f3a] hover:bg-[#2a3555] text-white font-bold px-6 py-6 rounded-xl shadow-lg transition-all hover:scale-105"
                    >
                        <Download className="w-5 h-5" />
                        Export Audit Log (CSV)
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border-2 border-blue-200 rounded-xl p-6 shadow-sm"
                    >
                        <Users className="w-8 h-8 text-blue-600 mb-3" />
                        <div className="text-3xl font-black text-slate-900 mb-1">{stats.totalReferrals}</div>
                        <div className="text-sm font-semibold text-slate-600">Total Referrals</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white border-2 border-amber-200 rounded-xl p-6 shadow-sm"
                    >
                        <Clock className="w-8 h-8 text-amber-600 mb-3" />
                        <div className="text-3xl font-black text-slate-900 mb-1">{stats.pendingReferrals}</div>
                        <div className="text-sm font-semibold text-slate-600">Pending</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white border-2 border-green-200 rounded-xl p-6 shadow-sm"
                    >
                        <CheckCircle className="w-8 h-8 text-green-600 mb-3" />
                        <div className="text-3xl font-black text-slate-900 mb-1">{stats.completedReferrals}</div>
                        <div className="text-sm font-semibold text-slate-600">Completed</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white border-2 border-purple-200 rounded-xl p-6 shadow-sm"
                    >
                        <Award className="w-8 h-8 text-purple-600 mb-3" />
                        <div className="text-3xl font-black text-slate-900 mb-1">{stats.totalPointsAwarded.toLocaleString()}</div>
                        <div className="text-sm font-semibold text-slate-600">Points Awarded</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white border-2 border-indigo-200 rounded-xl p-6 shadow-sm"
                    >
                        <TrendingUp className="w-8 h-8 text-indigo-600 mb-3" />
                        <div className="text-3xl font-black text-slate-900 mb-1">{stats.uniqueReferrers}</div>
                        <div className="text-sm font-semibold text-slate-600">Active Referrers</div>
                    </motion.div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl border-2 border-slate-200 p-6 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                            <Input
                                type="text"
                                placeholder="Search by name, email, or code..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={statusFilter === 'all' ? 'default' : 'outline'}
                                onClick={() => setStatusFilter('all')}
                                className="gap-2"
                            >
                                <Filter className="w-4 h-4" />
                                All
                            </Button>
                            <Button
                                variant={statusFilter === 'pending' ? 'default' : 'outline'}
                                onClick={() => setStatusFilter('pending')}
                            >
                                Pending
                            </Button>
                            <Button
                                variant={statusFilter === 'signed_up' ? 'default' : 'outline'}
                                onClick={() => setStatusFilter('signed_up')}
                            >
                                Signed Up
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Referrals Table */}
                <div className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b-2 border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Referrer</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Referred Email</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Code</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Points</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Created</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {filteredReferrals.map((referral) => (
                                    <tr key={referral.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-semibold text-slate-900">{referral.referrer_name}</div>
                                                <div className="text-sm text-slate-600">{referral.referrer_email}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-slate-400" />
                                                <span className="text-slate-900">{referral.referred_email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <code className="px-2 py-1 bg-slate-100 rounded text-sm font-mono">{referral.referral_code}</code>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="capitalize text-slate-700">{referral.referral_type}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(referral.status)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {referral.points_awarded > 0 ? (
                                                <span className="font-bold text-green-600">+{referral.points_awarded}</span>
                                            ) : (
                                                <span className="text-slate-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {new Date(referral.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {referral.status === 'pending' && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => confirmReferral(referral.id)}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                                                >
                                                    Confirm
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredReferrals.length === 0 && (
                        <div className="text-center py-12">
                            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-slate-600 mb-2">No referrals found</h3>
                            <p className="text-slate-500">Try adjusting your filters</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
