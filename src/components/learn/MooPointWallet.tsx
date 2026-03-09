import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, Trophy, Star, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface MooPointWalletProps {
    userId: string;
}

export const MooPointWallet: React.FC<MooPointWalletProps> = ({ userId }) => {
    const [points, setPoints] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;

        const fetchPoints = async () => {
            const { data, error } = await supabase
                .from('student_moo_points')
                .select('total_points')
                .eq('user_id', userId)
                .single();

            if (!error && data) {
                setPoints(data.total_points);
            }
            setLoading(false);
        };

        fetchPoints();

        // Subscribe to real-time updates for the wallet
        const channel = supabase
            .channel(`public:student_moo_points:user_id=eq.${userId}`)
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'student_moo_points',
                filter: `user_id=eq.${userId}`
            }, (payload) => {
                setPoints(payload.new.total_points);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId]);

    return (
        <Card className="bg-[#0A0F1E] border-white/5 relative overflow-hidden group hover:border-yellow-500/30 transition-all duration-500 shadow-2xl">
            <div className="absolute top-0 right-0 p-24 bg-yellow-500/5 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-yellow-500/10 transition-colors" />

            <CardContent className="p-8 relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <div className="space-y-1">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Moo Point Balance</h3>
                        <p className="text-slate-400 text-xs font-medium">Accumulated Rewards</p>
                    </div>
                    <div className="p-3 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 group-hover:scale-110 transition-transform duration-500">
                        <Zap className="w-6 h-6 text-yellow-500" />
                    </div>
                </div>

                <div className="flex items-baseline gap-3">
                    <div className="text-6xl font-black text-white tracking-tighter tabular-nums drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                        {loading ? '---' : points.toLocaleString()}
                    </div>
                    <div className="text-sm font-bold text-yellow-500/60 uppercase tracking-widest">MOO</div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-6 h-6 rounded-full bg-slate-800 border-2 border-[#0A0F1E] flex items-center justify-center">
                                    <Star className="w-3 h-3 text-yellow-500" />
                                </div>
                            ))}
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Active Scholar</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                        <TrendingUp className="w-4 h-4" />
                        <span>+150 This Week</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
