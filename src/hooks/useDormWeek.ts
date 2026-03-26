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

// --- ANTIGRAVITY ROTATION POOLS (Center Spin) ---
const TACTICAL_POOL_FOUNDATION: Reward[] = [
    { id: 'FND-01', type: 'resource', title: 'The 24-Hour Inquiry Blitz', content: 'Pure Adrenaline: The "Rapid-Scrub" script to remove hard inquiries over the phone in minutes.' },
    { id: 'FND-02', type: 'resource', title: 'The Legacy ID Ledger', content: 'Biometric Security: A "Clean Sweep" form to wipe old addresses/names that confuse AI scanners.' },
    { id: 'FND-03', type: 'resource', title: 'The Subscription Audit Log', content: 'Cash Finder: Kills $50–$100 in unused apps to fund your first credit-builder account.' }
];

const TACTICAL_POOL_OFFENSIVE: Reward[] = [
    { id: 'OFF-01', type: 'resource', title: 'The Dispute Playbook', content: 'Game-Day Intensity: Pre-identifies "Red Zone" items and generates exact legal challenge language.' },
    { id: 'OFF-02', type: 'resource', title: 'The CLI "Power-Up" Script', content: 'Buying Power: Word-for-word script to double credit limits without a hard credit pull.' },
    { id: 'OFF-03', type: 'resource', title: 'The "Goodwill" Letter', content: 'The Hail Mary: A high-success template for removing late payments for an instant 30-50 point jump.' }
];

const TACTICAL_POOL_ALPHA: Reward[] = [
    { id: 'ALP-01', type: 'resource', title: 'The AU "Piggyback" Agreement', content: 'The Velocity Tool: Contract to link a "Thin File" student to a mentor’s 10-year seasoned account.' },
    { id: 'ALP-02', type: 'resource', title: 'The 800 Score Syllabus', content: 'The Roadmap: The master checklist to move from "fixing" credit to mastering the entire system.' },
    { id: 'ALP-03', type: 'resource', title: 'The Alpha Utilization Shield', content: 'Total Protection: Automated calculator that hides spending from bureaus by timing payments.' }
];

// --- ALPHA INTEL ROTATION POOL (Slot 1 Spin) ---
const ALPHA_INTEL_POOL: Reward[] = [
    { id: 'INTEL-01', type: 'tip', title: 'The Statement Date Snipe', content: 'Sniper Precision: Pay before your statement date to "ghost" the bureaus.' },
    { id: 'INTEL-02', type: 'tip', title: 'The LexisNexis Ghost Protocol', content: 'Stealth Mode: Freeze secondary bureaus so big banks can\'t see your old "Red Zone" data.' },
    { id: 'INTEL-03', type: 'tip', title: 'The 2% Sweet Spot', content: 'Financial Flex: 0% utilization looks "dead". Keep 2% to show the algorithm you’re alive.' },
    { id: 'INTEL-04', type: 'tip', title: 'The Address Scrub Logic', content: 'Clean Slate: A single misspelled address on your report can cause an automatic dispute rejection.' },
    { id: 'INTEL-05', type: 'tip', title: 'The "No-Fly" Inquiry Limit', content: 'Border Control: More than 2 inquiries in 6 months triggers "Automatic Denial" for top-tier cards.' },
    { id: 'INTEL-06', type: 'tip', title: 'The Bureau Sync Secret', content: 'Total Synergy: Disputing with TransUnion first often triggers a "domino effect" across Equifax and Experian.' },
    { id: 'INTEL-07', type: 'tip', title: 'The Age Accelerator', content: 'Time Travel: Use a family member\'s oldest card to "inject" 20 years of history into a 1-year-old file.' },
    { id: 'INTEL-08', type: 'tip', title: 'The Credit Mix Multiplier', content: 'Variety Pack: The "3-Card Rule" - 3 revolving accounts and 1 installment loan to hit the 800-score ceiling.' },
    { id: 'INTEL-09', type: 'tip', title: 'The Hard Pull Buffer', content: 'Safety First: Wait 91 days between applications to reset the bank\'s internal "Risk Clock."' },
    { id: 'INTEL-10', type: 'tip', title: 'The Moo Point Multiplier', content: 'Viral Growth: Rapidly multiply massive stacks of wealth and bypass wait times.' }
];

const MANDATORY_REWARDS = {
    SPIN_3: { id: 'ACC-01', type: 'acceptance', title: 'Official Admission', content: 'You are officially accepted to Credit University. Welcome to the Campus.' } as Reward
};

export function useDormWeek() {
    const [siteState, setSiteState] = useState<SiteState | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchState = async () => {
            try {
                const { data, error } = await supabase.from('dormweek_site_state').select('*').single();
                if (error) {
                    console.warn("useDormWeek: Site state error (expected if table missing):", error.message);
                    throw error;
                }
                if (data) {
                    setSiteState(data);
                } else {
                    // Default fallback if table is empty
                    setSiteState({
                        mode: 'dormweek',
                        dorm_week_start: '2026-03-01',
                        dorm_week_end: '2026-12-31',
                        apply_redirect_mode: 'redirect_to_dormweek'
                    });
                }
            } catch (e) {
                console.warn("useDormWeek: Site state recovery protocol active.");
                // Fallback on error
                setSiteState({
                    mode: 'dormweek',
                    dorm_week_start: '2026-03-01',
                    dorm_week_end: '2026-12-31',
                    apply_redirect_mode: 'redirect_to_dormweek'
                });
            } finally {
                setLoading(false);
            }
        };
        fetchState();
    }, []);

    const captureLead = useCallback(async (name: string, email: string, data: { password?: string; phone?: string; dob?: string; city?: string; state?: string }) => {
        console.log("useDormWeek: [SECURITY] Checking entry status for", email);

        // 1. Check if already admitted
        const { data: existingStatus } = await supabase
            .from('dormweek_student_status')
            .select('acceptance_status')
            .eq('email', email)
            .maybeSingle();

        if (existingStatus?.acceptance_status === 'accepted') {
            console.log("useDormWeek: [SECURITY] Student already accepted. Bypassing machine.");
            return { success: true, alreadyAccepted: true };
        }

        // 2. Handle Authentication Account Creation
        if (data.password) {
            console.log("useDormWeek: [AUTH] Initializing student account for", email);
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password: data.password,
                options: {
                    data: {
                        full_name: name,
                        display_name: name.split(' ')[0]
                    }
                }
            });

            if (authError) {
                // If user already exists, we attempt to sign in or just proceed with lead capture
                // In a production environment, we'd handle this more gracefully (e.g. redirect to login)
                console.warn("useDormWeek: [AUTH] Account initialization warning:", authError.message);
                
                // If it's a "User already registered" error, we can still proceed to lead capture
                // so the admin has the record, but we don't block the UI.
            } else {
                console.log("useDormWeek: [AUTH] Student account created successfully.");
            }
        }

        // 3. Force Reset local session
        const freshSession: AdmissionsSession = {
            email,
            spin_count: 0,
            rewards_won: [],
            is_accepted: false,
            current_step: 'spin',
            admissions_complete: false
        };
        localStorage.setItem(`cu_session_${email}`, JSON.stringify(freshSession));

        // 4. Synchronous Reset in DB
        try {
            const { data: existingLead } = await supabase.from('dormweek_leads').select('id').eq('email', email).maybeSingle();
            const leadPayload = { 
                name, 
                email, 
                phone: data.phone, 
                dob: data.dob,
                city: data.city,
                state: data.state,
                source: 'apply' 
            };

            if (!existingLead) {
                await supabase.from('dormweek_leads').insert(leadPayload);
            } else {
                await supabase.from('dormweek_leads').update(leadPayload).eq('email', email);
            }
            
            await supabase.from('dormweek_admissions_sessions').upsert({ 
                email, 
                spin_count: 0, 
                rewards_won: [], 
                is_accepted: false,
                current_step: 'spin', 
                admissions_complete: false 
            }, { onConflict: 'email' });
            
            await supabase.from('dormweek_student_locker').delete().eq('email', email);
            
            console.log("useDormWeek: Engine Primed.");
        } catch (e) {
            console.warn("useDormWeek: Background reset warning.", e);
        }

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
                        // we prioritize the LOCAL reset state to allow the new test run.
                        if (localSession.spin_count === 0 && data.spin_count > 0) {
                            console.log("useDormWeek: Local reset detected. Overwriting remote state with fresh start.");
                            await supabase.from('dormweek_admissions_sessions').upsert(localSession);
                            return;
                        }
                        
                        // If the local session is ahead of remote (e.g. they just spun but db is slow),
                        // PROTECT LOCAL and force remote to catch up.
                        if (localSession.spin_count > data.spin_count || localSession.admissions_complete && !data.admissions_complete) {
                            console.log("useDormWeek: Local is AHEAD of remote. Protecting Local and syncing up.");
                            await supabase.from('dormweek_admissions_sessions').upsert(localSession);
                            return;
                        }
                        
                        // If remote is at least equal or ahead, and local is not a fresh reset, sync remote to local
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
            // STRICT CINEMATIC SEQUENCE WITH TACTICAL MIDDLE SLOT
            if (nextSpin === 1) {
                // The Alpha Intel Rotation (Slot 1)
                const randomIndex = Math.floor(Math.random() * ALPHA_INTEL_POOL.length);
                reward = ALPHA_INTEL_POOL[randomIndex];
                reels = [0, 0, 0]; 
            } else if (nextSpin === 2) {
                // The Antigravity Rotation (Simulate global machine rotation phase 1-30)
                const globalMachineSpin = Math.floor(Math.random() * 30) + 1;
                let tacticalPool;
                
                if (globalMachineSpin <= 10) {
                    tacticalPool = TACTICAL_POOL_FOUNDATION;
                } else if (globalMachineSpin <= 20) {
                    tacticalPool = TACTICAL_POOL_OFFENSIVE;
                } else {
                    tacticalPool = TACTICAL_POOL_ALPHA;
                }

                // Pick a specific tactical variable from the current phase pool
                const randomIndex = Math.floor(Math.random() * tacticalPool.length);
                reward = tacticalPool[randomIndex];
                reels = [1, 1, 1]; 
            } else {
                // Mandatory Win 3
                reward = MANDATORY_REWARDS.SPIN_3;
                reels = [2, 2, 2]; 
            }
        } catch (e) {
            reward = ALPHA_INTEL_POOL[0];
        }

        const updatedSession = { 
            ...session, 
            spin_count: nextSpin, 
            rewards_won: [...session.rewards_won, reward!.id], 
            is_accepted: session.is_accepted || reward!.type === 'acceptance', 
            current_step: nextSpin === 3 ? 'complete' : 'spin' 
        };
        
        localStorage.setItem(`cu_session_${email}`, JSON.stringify(updatedSession));

        (async () => {
            try {
                // Upsert session
                await supabase.from('dormweek_admissions_sessions').upsert(updatedSession);
                
                // ADD TO LOCKER immediately for persistent access
                await supabase.from('dormweek_student_locker').upsert({ 
                    email, 
                    reward_id: reward!.id 
                }, { onConflict: 'email,reward_id' });
            } catch (e) {
                console.warn("useDormWeek: Background sync warning.", e);
            }
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
                // 1. Complete Session Status
                await supabase.from('dormweek_admissions_sessions').update({ admissions_complete: true, current_step: 'complete' }).eq('email', email);
                await supabase.from('dormweek_student_status').upsert({ user_id: userId, email, acceptance_status: 'accepted', dorm_key: true, last_spin_at: new Date().toISOString() }, { onConflict: 'email' });
                
                // 2. Identify and Update Official Profile
                let profileId = userId;
                if (!profileId) {
                    const { data: userData } = await supabase.auth.getUser();
                    profileId = userData.user?.id;
                }

                if (profileId) {
                    console.log("useDormWeek: [SYNC] Updating official student profile for", profileId);
                    
                    // Update academic level to freshman upon admission
                    await supabase
                        .from('profiles')
                        .update({ 
                            academic_level: 'freshman',
                            updated_at: new Date().toISOString()
                        })
                        .eq('id', profileId);

                    // 3. Award 500 MOO POINTS Windfall
                    console.log("useDormWeek: [GAMIFICATION] Awarding 500 Moo Points to", profileId);
                    
                    const { data: currentPointsData } = await supabase
                        .from('student_moo_points')
                        .select('total_points')
                        .eq('user_id', profileId)
                        .maybeSingle();

                    const currentPoints = currentPointsData?.total_points || 0;
                    
                    await supabase.from('student_moo_points').upsert({ 
                        user_id: profileId, 
                        total_points: currentPoints + 500 
                    }, { onConflict: 'user_id' });
                } else {
                    console.warn("useDormWeek: [SYNC] Identity missing. Postponing Profile and Moo Points update.");
                }

            } catch (e) { 
                console.error("useDormWeek: Admissions completion logic failed.", e);
            }
        })();
        return { success: true };
    }, []);

    return { siteState, loading, captureLead, getAdmissionsSession, getSpinResult, completeAdmissions };
}
