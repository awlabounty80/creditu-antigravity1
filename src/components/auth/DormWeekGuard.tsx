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
    const [forceBypass, setForceBypass] = useState(false);
    const location = useLocation();

    // --- DEVELOPMENT BYPASS ---
    // Only active in DEV + Localhost + Explicit Opt-in Signal
    useEffect(() => {
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const searchParams = new URLSearchParams(location.search);
        const hasBypassSignal = sessionStorage.getItem('auth_bypass') === 'enabled' || searchParams.get('bypass') === 'true';
        
        if (import.meta.env.DEV && isLocalhost && hasBypassSignal) {
            console.log("DormWeekGuard: DEV Bypass Active.");
            setForceBypass(true);
            setAccessAllowed(true);
            setCheckingStatus(false);
        }
    }, [location.search]);

    useEffect(() => {
        const checkAccess = async () => {
            if (stateLoading || forceBypass) return;

            // If siteState is missing, we can't perform strict checks, but we shouldn't hang.
            if (!siteState) {
                console.warn("DormWeekGuard: No site state found. Defaulting to restricted access.");
                setCheckingStatus(false);
                return;
            }

            try {
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
                    // If window IS open but no user, we ALLOW them to see the DormWeek registration page
                    setAccessAllowed(true);
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
            } catch (err) {
                console.error("DormWeekGuard: Error in checkAccess", err);
                // On error, let them through if it's dorm week period, or fallback to allowed anyway to avoid lockouts
                setAccessAllowed(true);
            } finally {
                setCheckingStatus(false);
            }
        };

        checkAccess();
    }, [siteState, stateLoading, forceBypass]);

    if (!forceBypass && (stateLoading || checkingStatus)) {
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
        // If logged in but denied Dorm Week access, keep them in the ecosystem
        // Access restricted - user status already verified in checkAccess useEffect
        return <Navigate to={errorMsg?.includes("closed") ? "/dashboard" : "/admissions"} state={{ from: location, message: errorMsg }} replace />;
    }

    return <>{children}</>;
};
