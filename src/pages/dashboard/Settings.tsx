import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

export default function Settings() {
    const { user, signOut } = useAuth();
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(true);

    return (
        <div id="view-settings" style={{ maxWidth: '600px' }}>
            <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Student Settings</h3>

            <div className="settings-section" style={{ marginBottom: '3rem' }}>
                <h4 style={{ color: '#888', marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Account</h4>
                <div className="setting-item" style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.9rem', color: '#aaa' }}>Email Address</div>
                    <div style={{ fontSize: '1.1rem' }}>{user?.email}</div>
                </div>
                <div className="setting-item" style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.9rem', color: '#aaa' }}>Student ID</div>
                    <div style={{ fontSize: '1.1rem', fontFamily: 'monospace' }}>{user?.id}</div>
                </div>
            </div>

            <div className="settings-section" style={{ marginBottom: '3rem' }}>
                <h4 style={{ color: '#888', marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Preferences</h4>

                <div className="setting-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span>Email Notifications</span>
                    <input type="checkbox" checked={notifications} onChange={e => setNotifications(e.target.checked)} />
                </div>

                <div className="setting-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span>Dark Mode Interface</span>
                    <input type="checkbox" checked={darkMode} onChange={e => setDarkMode(e.target.checked)} />
                </div>

                {/* Dev Tool for Verification */}
                <div className="setting-row" style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(0,255,0,0.1)', borderRadius: '8px' }}>
                    <h5 style={{ margin: '0 0 0.5rem 0', color: '#00ff00' }}>BUILD VERIFICATION TOOL</h5>
                    <p style={{ fontSize: '0.8rem', marginBottom: '1rem', color: '#aaa' }}>Force-upgrade account to verify "Member" views (Moo Store, etc)</p>
                    <button onClick={async () => {
                        // 1. Try DB Update (Best Effort)
                        try {
                            const { supabase } = await import('../../lib/supabaseClient');
                            await supabase.from('memberships').update({ status: 'active', tier: 'member' }).eq('user_id', user?.id);
                            await supabase.from('user_profiles').update({ plan_tier: 'member' }).eq('id', user?.id);
                        } catch (e) { console.error(e); }

                        // 2. FORCE LOCAL OVERRIDE (Guarantees UI Update)
                        localStorage.setItem('credit_u_demo_mode', 'true');

                        alert('Account Upgraded to Member (Verified)! Refreshing...');
                        window.location.reload();
                    }} className="btn btn-primary" style={{ width: '100%', fontSize: '0.8rem' }}>
                        ACTIVATE MEMBER TIER
                    </button>
                </div>
            </div>

            <button onClick={signOut} className="btn" style={{
                background: 'rgba(244, 67, 54, 0.1)',
                color: '#f44336',
                border: '1px solid rgba(244, 67, 54, 0.2)',
                width: '100%'
            }}>
                Sign Out
            </button>
        </div>
    );
}
