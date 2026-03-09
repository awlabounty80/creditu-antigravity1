import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDormWeek, SiteState } from '@/hooks/useDormWeek';
import { supabase } from '@/lib/supabase';
import { Loader2, Lock } from 'lucide-react';

interface DormWeekGuardProps {
    children: React.ReactNode;
}

export const DormWeekGuard: React.FC<DormWeekGuardProps> = ({ children }) => {
    const { siteState, loading: stateLoading } = useDormWeek();
    const [accessAllowed, setAccessAllowed] = useState<boolean | null>(null);
    const [checkingStatus, setCheckingStatus] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const location = useLocation();

    useEffect(() => {
        const checkAccess = async () => {
            if (stateLoading || !siteState) return;

            const now = new Date();
            const startDate = siteState.dorm_week_start ? new Date(siteState.dorm_week_start) : null;
            const endDate = siteState.dorm_week_end ? new Date(siteState.dorm_week_end) : null;

            // 1. Check Global Time Gate
            const isWindowOpen = startDate && endDate && now >= startDate && now <= endDate;

            // 2. Check User Status
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                // If not logged in and window isn't open, redirect to apply
                if (!isWindowOpen) {
                    setAccessAllowed(false);
                    setCheckingStatus(false);
                    return;
                }
                // If window IS open but no user, they need a key
                setAccessAllowed(false);
                setCheckingStatus(false);
                return;
            }

            // Check dormweek_student_status
            const { data: status } = await supabase
                .from('dormweek_student_status')
                .select('*')
                .eq('user_id', user.id)
                .single();

            const hasAccess =
                status?.admin_override ||
                status?.member_override ||
                (isWindowOpen && (status?.dorm_key || ['accepted', 'scholarship', 'founders'].includes(status?.acceptance_status)));

            if (hasAccess) {
                setAccessAllowed(true);
            } else {
                setErrorMsg(!isWindowOpen ? "Dorm Week is currently closed." : "Dorm Key Required.");
                setAccessAllowed(false);
            }
            setCheckingStatus(false);
        };

        checkAccess();
    }, [siteState, stateLoading]);

    if (stateLoading || checkingStatus) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-[#020412]">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
                <div className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest animate-pulse">
                    Authenticating Dorm Key...
                </div>
            </div>
        );
    }

    if (!accessAllowed) {
        return <Navigate to="/admissions" state={{ from: location, message: errorMsg }} replace />;
    }

    return <>{children}</>;
};
