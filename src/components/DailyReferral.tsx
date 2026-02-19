import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Send, Check, Sparkles, Users, Copy, ExternalLink, MessageCircle, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useProfile } from '@/hooks/useProfile';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export interface DailyReferralProps {
    variant?: 'default' | 'compact';
}

export function DailyReferral({ variant = 'default' }: DailyReferralProps) {
    const { profile } = useProfile();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [todayReferrals, setTodayReferrals] = useState(0);
    const [copied, setCopied] = useState(false);
    const [showEmailForm, setShowEmailForm] = useState(false);

    const isCompact = variant === 'compact';

    useEffect(() => {
        const fetchTodayCount = async () => {
            if (!profile?.id) return;
            const today = new Date().toISOString().split('T')[0];
            const { count } = await supabase
                .from('referrals')
                .select('*', { count: 'exact', head: true })
                .eq('referrer_id', profile.id)
                .gte('created_at', today);

            setTodayReferrals(count || 0);
        };
        fetchTodayCount();
    }, [profile?.id]);

    const defaultMessage = `Hey! I've been learning about credit optimization at Credit U Academy and thought you might be interested. They have an amazing program that teaches you how to master your credit profile using consumer protection laws and proven strategies. Check it out!`;

    const handleSendReferral = async () => {
        if (!email) {
            setError('Target email is required');
            return;
        }

        if (!profile?.id) {
            setError('Account required for automated referral sequence. Use manual options below for guest transmissions.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new Error('Please enter a valid email address');
            }

            // Generate unique referral code
            const referralCode = `CRU-${profile.id.substring(0, 8)}-${Date.now().toString(36)}`.toUpperCase();

            // Create referral record
            const { data: referralData, error: referralError } = await supabase
                .from('referrals')
                .insert({
                    referrer_id: profile.id,
                    referred_email: email,
                    referral_code: referralCode,
                    referral_type: 'email',
                    status: 'pending',
                    metadata: {
                        message: message || defaultMessage,
                        sent_at: new Date().toISOString()
                    }
                })
                .select()
                .single();

            if (referralError) throw referralError;

            // Award points and log task completion
            // Using the award_points RPC for atomicity and reliability
            try {
                const today = new Date().toISOString().split('T')[0];

                // Check if already completed today
                const { data: existingTask } = await supabase
                    .from('daily_tasks')
                    .select('*')
                    .eq('user_id', profile.id)
                    .eq('task_date', today)
                    .eq('task_type', 'email_share')
                    .single();

                if (!existingTask) {
                    // Use RPC to award points (safer than manual updates)
                    const { error: rpcError } = await supabase.rpc('award_points', {
                        p_user_id: profile.id,
                        p_points: 100,
                        p_transaction_type: 'email_referral',
                        p_description: `Daily email referral to ${email}`,
                        p_reference_id: referralData.id
                    });

                    if (rpcError) throw rpcError;

                    // Create task record
                    await supabase.from('daily_tasks').insert({
                        user_id: profile.id,
                        task_date: today,
                        task_type: 'email_share',
                        completed: true,
                        points_awarded: 100,
                        metadata: { referral_id: referralData.id }
                    });
                }
            } catch (pointsErr) {
                console.error('Failed to award points, but referral was created:', pointsErr);
                // We don't throw here because the referral was successfully created
            }

            // Call Supabase Edge Function to send email
            const { error: funcError } = await supabase.functions.invoke('send-referral-email', {
                body: {
                    referrerName: profile.first_name || 'A friend',
                    referredEmail: email,
                    referralCode: referralCode,
                    referralCodeLink: `${window.location.origin}/signup?code=${referralCode}`, // Ensure link is passed if needed by edge function
                    customMessage: message || defaultMessage
                }
            });

            if (funcError) {
                console.warn('Edge function failed, providing manual fallback:', funcError);
                // If edge function fails, we still consider the referral "initiated" 
                // but we warn the user and maybe provide a link
                setError('Automated email failed. Please use valid personal email or copy link.');
            }

            setSuccess(true);
            setTodayReferrals(prev => prev + 1);
            setEmail('');
            setMessage('');
            setTimeout(() => setSuccess(false), 5000);

        } catch (err: any) {
            setError(err.message || 'Failed to initialize protocol');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleManualSend = () => {
        if (!email) return;
        const subject = encodeURIComponent(`${profile?.first_name || 'A friend'} invited you to Credit U`);
        const body = encodeURIComponent(message || defaultMessage);

        // Use a hidden anchor to trigger reliably
        const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;
        const a = document.createElement('a');
        a.href = mailtoUrl;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        toast.success("Opening local email application...");

        // Show sequence success for UX
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
    };

    const copyReferralLink = () => {
        const referralCode = `CRU-${profile?.id?.substring(0, 8) || 'GUEST'}-${Date.now().toString(36)}`.toUpperCase();
        const link = `${window.location.origin}/signup?code=${referralCode}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        toast.success("Referral link secured to clipboard.");

        // Show sequence success for UX
        setSuccess(true);
        setTimeout(() => {
            setCopied(false);
            setSuccess(false);
        }, 5000);
    };

    const handleSocialShare = (platform: 'whatsapp' | 'telegram') => {
        const referralCode = `CRU-${profile?.id?.substring(0, 8) || 'GUEST'}-${Date.now().toString(36)}`.toUpperCase();
        const link = `${window.location.origin}/signup?code=${referralCode}`;
        const text = encodeURIComponent(`Hey! Join me at Credit U Academy! Use my code ${referralCode} to get started: ${link}`);

        if (platform === 'whatsapp') {
            window.open(`https://wa.me/?text=${text}`, '_blank');
        } else {
            window.open(`https://t.me/share/url?url=${link}&text=${text}`, '_blank');
        }

        toast.success(`Opening ${platform} protocol...`);

        // Show sequence success for UX
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
    };

    return (
        <div className={cn("bg-[#0A0F1E] rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group transition-all", isCompact ? "p-4" : "p-6")}>
            {/* Ambient Glow - Hidden in compact mode to save visual noise */}
            {!isCompact && <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700" />}

            {/* Header */}
            <div className={cn("flex items-start justify-between relative z-10", isCompact ? "mb-4" : "mb-6")}>
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className={cn("bg-blue-500/10 rounded-lg border border-blue-500/20", isCompact ? "p-1.5" : "p-2")}>
                            <Mail className={cn("text-blue-400", isCompact ? "w-4 h-4" : "w-5 h-5")} />
                        </div>
                        <h3 className={cn("font-black text-white uppercase tracking-wider", isCompact ? "text-sm" : "text-xl")}>
                            {isCompact ? "Invite & Earn" : "Protocol: Sharing"}
                        </h3>
                    </div>
                    {!isCompact && (
                        <p className="text-xs text-slate-400 font-medium">
                            Initialize referral sequence and secure{' '}
                            <span className="text-amber-400 font-bold">100 Moo Points</span>
                        </p>
                    )}
                </div>
                {!isCompact && (
                    <div className="bg-black/40 rounded-full px-3 py-1.5 border border-white/10 backdrop-blur-md">
                        <div className="flex items-center gap-2">
                            <Users className="w-3 h-3 text-blue-400" />
                            <span className="text-[10px] font-black text-white tracking-widest uppercase">
                                {todayReferrals} ENVOYS
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4 relative z-10">
                <Button
                    onClick={copyReferralLink}
                    variant="outline"
                    className={cn("border-white/10 font-bold text-slate-400 uppercase tracking-widest hover:bg-white/5", isCompact ? "text-[9px] h-9" : "text-[10px] h-10 rounded-xl")}
                >
                    {copied ? <Check className="w-3 h-3 mr-2 text-emerald-500" /> : <Copy className="w-3 h-3 mr-2" />}
                    {copied ? "COPIED" : "COPY LINK"}
                </Button>
                <Button
                    onClick={() => handleSocialShare('whatsapp')}
                    variant="outline"
                    className={cn("border-white/10 font-bold text-slate-400 uppercase tracking-widest hover:bg-white/5", isCompact ? "text-[9px] h-9" : "text-[10px] h-10 rounded-xl")}
                >
                    <MessageCircle className="w-3 h-3 mr-2 text-emerald-500" /> WHATSAPP
                </Button>
            </div>

            {/* Conditional Form Rendering for Compact Mode */}
            {isCompact && !showEmailForm ? (
                <Button
                    onClick={() => setShowEmailForm(true)}
                    className="w-full text-[10px] font-black uppercase tracking-widest h-9 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400"
                >
                    <Mail className="w-3 h-3 mr-2" /> Open Email Protocol
                </Button>
            ) : (
                <div className="space-y-4 relative z-10 animate-in slide-in-from-top-2 duration-300">
                    <div>
                        {!isCompact && (
                            <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2 ml-1">
                                Target Email
                            </label>
                        )}
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="RECIPIENT@GMAIL.COM"
                            className={cn("bg-black/50 border-white/10 focus:border-blue-500/50 text-white transition-all font-mono text-sm", isCompact ? "h-10 text-xs" : "h-12")}
                            disabled={isSubmitting}
                        />
                    </div>

                    {!isCompact && (
                        <div>
                            <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2 ml-1">
                                Encrypted Message
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder={defaultMessage}
                                rows={3}
                                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:border-blue-500/50 outline-none resize-none text-white text-xs font-medium leading-relaxed"
                                disabled={isSubmitting}
                            />
                        </div>
                    )}

                    {!profile?.id && (
                        <div className="bg-blue-500/5 border border-blue-500/10 text-blue-300 px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                            <span className="text-amber-400">Note:</span> Enrollment is required to secure automated referral rewards. Use the personal options below to share as a guest.
                        </div>
                    )}

                    {error && (
                        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest">
                            ERROR: {error}
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        {!profile?.id ? (
                            <Link to="/apply" className="w-full">
                                <Button
                                    className={cn("w-full relative group overflow-hidden bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black uppercase tracking-[0.2em] transition-all shadow-xl", isCompact ? "h-10 text-[10px]" : "h-14 text-xs rounded-xl")}
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        <Lock className="w-4 h-4" />
                                        ENROLL TO UNLOCK
                                    </span>
                                </Button>
                            </Link>
                        ) : (
                            <Button
                                onClick={handleSendReferral}
                                disabled={!email || isSubmitting || success}
                                className={cn(
                                    "w-full relative group overflow-hidden text-white font-black uppercase tracking-[0.2em] transition-all shadow-xl",
                                    "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500",
                                    isCompact ? "h-10 text-[10px]" : "h-14 text-xs rounded-xl"
                                )}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {success ? (
                                        <>
                                            <Check className="w-4 h-4" />
                                            SENT
                                        </>
                                    ) : isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            SENDING...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            SEND INVITE
                                        </>
                                    )}
                                </span>
                                <div className="absolute inset-0 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
                            </Button>
                        )}

                        <Button
                            onClick={handleManualSend}
                            variant="outline"
                            disabled={!email}
                            className={cn("w-full border-white/10 font-bold text-slate-400 uppercase tracking-widest hover:bg-white/5", isCompact ? "h-8 text-[9px]" : "h-10 text-[10px] rounded-xl")}
                        >
                            <ExternalLink className="w-3 h-3 mr-2" /> SEND VIA MAILTO
                        </Button>

                        {error && error.includes('Automated') && (
                            <div className="text-[10px] text-amber-500 font-bold uppercase tracking-[0.2em] text-center mt-2 p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg animate-pulse">
                                Delivery Blocked: Use Manual Options Above
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Bonus Info - Hidden in compact mode or shown simplified? Hidden to save space as requested. */}
            {!isCompact && (
                <div className="mt-6 bg-amber-500/5 border border-amber-500/10 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Incentive Protocol</h4>
                            <ul className="text-[10px] text-slate-400 space-y-1 font-medium">
                                <li>• <span className="text-blue-400">ACTIVE STATUS REQUIRED:</span> YOU MUST BE ENROLLED TO CLAIM REWARDS.</li>
                                <li>• <span className="text-emerald-400">2,600 POINTS</span> SECURED UPON REFERRAL ENROLLMENT.</li>
                                <li>• TRACK ALL TRANSMISSIONS IN YOUR DASHBOARD.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
