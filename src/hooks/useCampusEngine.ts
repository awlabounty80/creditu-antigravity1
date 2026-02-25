import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export const useCampusEngine = (userId: string) => {
    const [points, setPoints] = useState(0);

    useEffect(() => {
        if (!userId) return;

        // 1. Initial Fetch
        const fetchPoints = async () => {
            // Using user_profiles as established in supabase_moo_trigger.sql
            const { data } = await supabase.from('user_profiles').select('moo_points').eq('user_id', userId).single();
            setPoints(data?.moo_points || 0);
        };
        fetchPoints();

        // 2. Real-time Subscription (The Antigravity Pulse)
        const channel = supabase
            .channel('points-live')
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'user_profiles',
                filter: `user_id=eq.${userId}`
            }, (payload) => {
                setPoints(payload.new.moo_points);
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [userId]);

    return { points };
};
