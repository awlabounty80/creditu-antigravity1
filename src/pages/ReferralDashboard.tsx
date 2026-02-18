import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/lib/supabase';
import { Users, TrendingUp, Mail, CheckCircle, Clock, Award, Sparkles, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { CreditULogo } from '@/components/common/CreditULogo';

interface Referral {
    id: string;
    referred_email: string;
    referral_code: string;
    status: string;
    points_awarded: number;
    created_at: string;
    signed_up_at: string | null;
    referral_type: string;
    message?: string;
    is_accountability_partner?: boolean;
}

interface ReferralStats {
    totalReferrals: number;
    pendingReferrals: number;
    signedUpReferrals: number;
    totalPointsEarned: number;
}

export default function ReferralDashboard() {
    const navigate = useNavigate();
    const { profile } = useProfile();
    const [referrals, setReferrals] = useState<Referral[]>([]);
    const [stats, setStats] = useState<ReferralStats>({
        totalReferrals: 0,
        pendingReferrals: 0,
        signedUpReferrals: 0,
        totalPointsEarned: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (profile?.id) {
            fetchReferrals();
        }
    }, [profile?.id]);

    const fetchReferrals = async () => {
        if (!profile?.id) return;

        try {
            // Fetch all referrals
            const { data: referralsData, error } = await supabase
                .from('referrals')
                .select('*, referral_responses(message, is_accountability_partner)')
                .eq('referrer_id', profile.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setReferrals(referralsData || []);

            // Calculate stats
            const totalReferrals = referralsData?.length || 0;
            const pendingReferrals = referralsData?.filter(r => r.status === 'pending').length || 0;
            const signedUpReferrals = referralsData?.filter(r => r.status === 'signed_up').length || 0;
            const totalPointsEarned = referralsData?.reduce((sum, r) => sum + (r.points_awarded || 0), 0) || 0;

            setStats({
                totalReferrals,
                pendingReferrals,
                signedUpReferrals,
                totalPointsEarned
            });

        } catch (error) {
            console.error('Error fetching referrals:', error);
        } finally {
            setLoading(false);
        }
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
                        {status}
                    </span>
                );
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-6 mb-8">
                <CreditULogo className="w-20 h-20" variant="gold" />
                <div>
                    <h1 className="text-4xl font-black text-slate-900 mb-2">Referral Dashboard</h1>
                    <p className="text-slate-600">Track your referrals and earnings</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <Users className="w-8 h-8 text-blue-600" />
                        <span className="text-3xl font-black text-blue-900">{stats.totalReferrals}</span>
                    </div>
                    <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wide">Total Referrals</h3>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 rounded-2xl p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <Clock className="w-8 h-8 text-amber-600" />
                        <span className="text-3xl font-black text-amber-900">{stats.pendingReferrals}</span>
                    </div>
                    <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wide">Pending</h3>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-2xl p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                        <span className="text-3xl font-black text-green-900">{stats.signedUpReferrals}</span>
                    </div>
                    <h3 className="text-sm font-bold text-green-900 uppercase tracking-wide">Signed Up</h3>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-2xl p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <Award className="w-8 h-8 text-purple-600" />
                        <span className="text-3xl font-black text-purple-900">{stats.totalPointsEarned}</span>
                    </div>
                    <h3 className="text-sm font-bold text-purple-900 uppercase tracking-wide">Points Earned</h3>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 rounded-2xl p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <Sparkles className="w-8 h-8 text-amber-600" />
                        <span className="text-3xl font-black text-amber-900">{profile?.moo_points || 0}</span>
                    </div>
                    <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wide">Moo Points Balance</h3>
                </motion.div>
            </div>

            {/* Referrals List */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-lg">
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 border-b-2 border-slate-200 px-6 py-4">
                    <h2 className="text-xl font-black text-slate-900">Your Referrals</h2>
                </div>

                {referrals.length === 0 ? (
                    <div className="text-center py-12">
                        <Mail className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-600 mb-2">No referrals yet</h3>
                        <p className="text-slate-500">Start sharing Credit U to earn points!</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-200">
                        {referrals.map((referral, index) => (
                            <motion.div
                                key={referral.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="px-6 py-4 hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Mail className="w-5 h-5 text-slate-400" />
                                            <span className="font-semibold text-slate-900">{referral.referred_email}</span>
                                            {getStatusBadge(referral.status)}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-slate-600">
                                            <span>Code: <span className="font-mono font-bold">{referral.referral_code}</span></span>
                                            <span>•</span>
                                            <span>Sent: {new Date(referral.created_at).toLocaleDateString()}</span>
                                            {referral.signed_up_at && (
                                                <>
                                                    <span>•</span>
                                                    <span className="text-green-600 font-semibold">
                                                        Joined: {new Date(referral.signed_up_at).toLocaleDateString()}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                        {((referral as any).referral_responses?.[0]?.message || (referral as any).referral_responses?.[0]?.is_accountability_partner) && (
                                            <div className="mt-4 p-4 rounded-xl bg-indigo-50 border border-indigo-100 relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-150 transition-transform duration-700">
                                                    <Heart className="w-12 h-12 text-rose-500" />
                                                </div>
                                                <div className="relative z-10">
                                                    {(referral as any).referral_responses[0].message && (
                                                        <p className="text-sm text-indigo-900 font-medium italic italic mb-3">
                                                            "{(referral as any).referral_responses[0].message}"
                                                        </p>
                                                    )}
                                                    {(referral as any).referral_responses[0].is_accountability_partner && (
                                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-200 text-indigo-800 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-300">
                                                            <Users className="w-3 h-3" /> Accountability Partner
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {referral.points_awarded > 0 && (
                                        <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-green-50 border border-amber-200 rounded-full px-4 py-2">
                                            <Sparkles className="w-4 h-4 text-amber-600" />
                                            <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-green-600">
                                                +{referral.points_awarded}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Rewards Info */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                    <TrendingUp className="w-8 h-8 text-purple-600 flex-shrink-0" />
                    <div className="flex-1">
                        <h3 className="text-xl font-black text-slate-900 mb-3">Referral Rewards</h3>
                        <ul className="space-y-2 text-slate-700 mb-6">
                            <li className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-600 rounded-full" />
                                <span><span className="font-bold">100 points</span> for each email referral sent</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-600 rounded-full" />
                                <span><span className="font-bold text-green-600">2,600 points</span> when your referral signs up!</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-purple-600 rounded-full" />
                                <span><span className="font-bold">1,000 points</span> for sharing on social media</span>
                            </li>
                        </ul>
                        <Button
                            onClick={() => navigate('/dashboard/store')}
                            className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-6 rounded-xl shadow-lg transition-all hover:scale-105"
                        >
                            <Sparkles className="w-5 h-5 mr-2" />
                            Spend Your Points in Moo Store
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
