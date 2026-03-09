import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export type DormWeekMode = 'prereg' | 'dormweek' | 'closed';
export type AcceptanceStatus = 'accepted' | 'almost' | 'scholarship' | 'founders' | 'pending';

export interface SiteState {
    mode: DormWeekMode;
    dorm_week_start: string | null;
    dorm_week_end: string | null;
    apply_redirect_mode: 'redirect_to_dormweek' | 'daily_spin';
}

export interface StudentStatus {
    acceptance_status: AcceptanceStatus;
    dorm_key: boolean;
    member_override: boolean;
    admin_override: boolean;
    last_spin_at: string | null;
}

export interface Reward {
    id: string;
    type: 'tip' | 'resource' | 'acceptance' | 'bonus';
    title: string;
    content?: string;
    icon?: string;
    download_url?: string;
    moo_points_value?: number;
}

export interface AdmissionsSession {
    email: string;
    spin_count: number;
    rewards_won: string[];
    is_accepted: boolean;
    current_step: 'register' | 'spin' | 'complete';
    admissions_complete: boolean;
}

// --- LOCAL REWARD POOL FALLBACK ---
const LOCAL_REWARD_POOL: Reward[] = [
    { id: 'TIP-01', type: 'tip', title: 'The AZEO Method', content: 'All Zero Except One. To maximize your score, leave one small balance (1-5%) on a single revolving account while paying others to zero before the statement date.', icon: 'ShieldCheck' },
    { id: 'TIP-02', type: 'tip', title: 'Statement Date vs Due Date', content: 'The balance reported to bureaus is usually from your statement closing date, not your due date. Pay your cards 3 days before the statement date.', icon: 'CreditCard' },
    { id: 'TIP-03', type: 'tip', title: 'Secondary Bureau Freeze', content: 'Freeze LexisNexis, SageStream, and Innovis to prevent debt buyers from easily validating old public records or bankruptcies.', icon: 'Shield' },
    { id: 'TIP-04', type: 'tip', title: 'The 5% Rule', content: 'FICO loves utilization under 10%, but 5% is the sweet spot. Anything over 30% causes a significant Score Penalty.', icon: 'TrendingUp' },
    { id: 'RES-01', type: 'resource', title: 'Credit Report Review Checklist', content: 'The official Credit U checklist for auditing your bureau files for Metro 2 errors.', icon: 'ClipboardCheck', download_url: '/credit-audit-checklist.pdf' },
    { id: 'RES-02', type: 'resource', title: 'Strategic Dispute Planner', content: 'Map your 90-day dispute sequence and track bureau responses with surgical precision.', icon: 'Map', download_url: '/resources/dispute-planner.pdf' },
    { id: 'ACC-01', type: 'acceptance', title: 'Official Admission', content: 'You are officially accepted to Credit University. Welcome to the Campus.', icon: 'GraduationCap' }
];

export function useDormWeek() {
    const [siteState, setSiteState] = useState<SiteState | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchState = async () => {
            try {
                const { data } = await supabase.from('dormweek_site_state').select('*').single();
                if (data) setSiteState(data);
            } catch (e) {
                console.warn("useDormWeek: Site state error bypass.");
            }
            setLoading(false);
        };
        fetchState();
    }, []);

    const captureLead = useCallback(async (name: string, email: string, phone?: string) => {
        console.log("useDormWeek: [ZERO-LATENCY] Initializing for", email);

        // 1. Force Reset local session to allow multiple tests/re-entry
        const freshSession: AdmissionsSession = {
            email,
            spin_count: 0,
            rewards_won: [],
            is_accepted: false,
            current_step: 'spin',
            admissions_complete: false
        };
        localStorage.setItem(`cu_session_${email}`, JSON.stringify(freshSession));

        // 2. Non-blocking Background Sync
        (async () => {
            try {
                const { data: lead } = await supabase.from('dormweek_leads').select('id').eq('email', email).single();
                if (!lead) {
                    await supabase.from('dormweek_leads').insert({ name, email, phone, source: 'apply' });
                }
                await supabase.from('dormweek_admissions_sessions').upsert({ email, current_step: 'spin' }, { onConflict: 'email' });
            } catch (e) { }
        })();

        return { success: true };
    }, []);

    const getAdmissionsSession = useCallback(async (email: string): Promise<AdmissionsSession | null> => {
        const localSessionStr = localStorage.getItem(`cu_session_${email}`);
        if (!localSessionStr) return null;

        const localSession = JSON.parse(localSessionStr) as AdmissionsSession;

        if (email) {
            (async () => {
                try {
                    const { data } = await supabase.from('dormweek_admissions_sessions').select('*').eq('email', email).single();
                    if (data) {
                        // CRITICAL: If the local session was just reset (spin_count 0) and the remote is complete,
                        // we do NOT overwrite yet to allow the user to experience the spins.
                        if (localSession.spin_count === 0 && data.admissions_complete) {
                            console.log("useDormWeek: Remote session is complete but local is fresh. Bypassing overwrite for testing.");
                            return;
                        }
                        localStorage.setItem(`cu_session_${email}`, JSON.stringify(data));
                    }
                } catch (e) { }
            })();
        }
        return localSession;
    }, []);

    const getSpinResult = useCallback(async (email: string) => {
        let session = await getAdmissionsSession(email);
        if (!session) {
            session = { email, spin_count: 0, rewards_won: [], is_accepted: false, current_step: 'spin', admissions_complete: false };
        }

        if (session.spin_count >= 3) throw new Error("Spins exhausted.");

        const nextSpin = session.spin_count + 1;
        let reward: Reward | null = null;
        let reels = [0, 0, 0];

        try {
            if (nextSpin === 1) reward = LOCAL_REWARD_POOL[0];
            else if (nextSpin === 2) reward = LOCAL_REWARD_POOL[4];
            else reward = LOCAL_REWARD_POOL[6];
            reels = [nextSpin - 1, nextSpin - 1, nextSpin - 1];
        } catch (e) {
            reward = LOCAL_REWARD_POOL[0];
        }

        const updatedSession = { ...session, spin_count: nextSpin, rewards_won: [...session.rewards_won, reward!.id], is_accepted: session.is_accepted || reward!.type === 'acceptance', current_step: nextSpin === 3 ? 'complete' : 'spin' };
        localStorage.setItem(`cu_session_${email}`, JSON.stringify(updatedSession));

        (async () => {
            try {
                await supabase.from('dormweek_admissions_sessions').upsert(updatedSession);
                await supabase.from('dormweek_student_locker').upsert({ email, reward_id: reward!.id });
            } catch (e) { }
        })();

        return { reward: reward!, reels, spinCount: nextSpin, isAccepted: updatedSession.is_accepted };
    }, [getAdmissionsSession]);

    const completeAdmissions = useCallback(async (email: string, userId?: string) => {
        // Update local session first
        const localSess = localStorage.getItem(`cu_session_${email}`);
        if (localSess) {
            const sess = JSON.parse(localSess);
            sess.admissions_complete = true;
            sess.current_step = 'complete';
            localStorage.setItem(`cu_session_${email}`, JSON.stringify(sess));
        }

        (async () => {
            try {
                await supabase.from('dormweek_admissions_sessions').update({ admissions_complete: true, current_step: 'complete' }).eq('email', email);
                await supabase.from('dormweek_student_status').upsert({ user_id: userId, email, acceptance_status: 'accepted', dorm_key: true, last_spin_at: new Date().toISOString() }, { onConflict: 'email' });
            } catch (e) { }
        })();
        return { success: true };
    }, []);

    return { siteState, loading, captureLead, getAdmissionsSession, getSpinResult, completeAdmissions };
}
