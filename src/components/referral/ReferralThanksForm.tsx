import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Send, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useProfile } from '@/hooks/useProfile';

interface ReferralThanksFormProps {
    referrerName: string;
    referrerId: string;
    onComplete?: () => void;
}

export function ReferralThanksForm({ referrerName, referrerId, onComplete }: ReferralThanksFormProps) {
    const { profile } = useProfile();
    const [message, setMessage] = useState('');
    const [isAccountabilityPartner, setIsAccountabilityPartner] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile?.id) return;

        setIsSubmitting(true);

        try {
            // 1. Log the thank you message/response
            const { error: responseError } = await supabase
                .from('referral_responses')
                .insert({
                    referrer_id: referrerId,
                    referred_id: profile.id,
                    message: message,
                    is_accountability_partner: isAccountabilityPartner,
                    sent_at: new Date().toISOString()
                });

            if (responseError) throw responseError;

            // 2. If accountability partner is selected, create a connection
            if (isAccountabilityPartner) {
                await supabase
                    .from('accountability_partners')
                    .insert({
                        student_a: referrerId,
                        student_b: profile.id,
                        status: 'active',
                        created_at: new Date().toISOString()
                    });

                toast.success("Accountability Partnership Initialized!");
            }

            // 3. Award 50 bonus points for completing the follow-up
            await supabase
                .from('points_transactions')
                .insert({
                    user_id: profile.id,
                    points: 50,
                    transaction_type: 'referral_followup',
                    description: `Thanked ${referrerName} for the referral`
                });

            await supabase
                .from('profiles')
                .update({
                    moo_points: (profile.moo_points || 0) + 50
                })
                .eq('id', profile.id);

            setIsSuccess(true);
            toast.success("Message sent to your referrer!");

            if (onComplete) {
                setTimeout(onComplete, 3000);
            }
        } catch (err: any) {
            console.error('Error sending response:', err);
            toast.error("Failed to send response.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/95 backdrop-blur shadow-2xl rounded-3xl p-8 border-2 border-emerald-200 text-center max-w-md mx-auto"
            >
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Gratitude Sent!</h3>
                <p className="text-slate-600 mb-6 font-medium">
                    {referrerName} will be notified of your message. Welcome to the Tribe.
                </p>
                <div className="bg-emerald-50 text-emerald-700 py-2 px-4 rounded-full inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest border border-emerald-100">
                    <Sparkles className="w-4 h-4" /> +50 Moo Points Earned
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-w-md mx-auto"
        >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                    <Heart className="w-6 h-6 text-rose-300" />
                    <h3 className="text-xl font-black uppercase tracking-tight">Say Thank You</h3>
                </div>
                <p className="text-blue-100 text-sm font-medium">
                    You were referred to Credit U by <span className="font-bold text-white">{referrerName}</span>. Send them a quick note!
                </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                    <Label htmlFor="message" className="text-xs font-bold uppercase text-slate-500 mb-2 block tracking-widest">
                        Your Message (Optional)
                    </Label>
                    <Textarea
                        id="message"
                        placeholder={`Hey ${referrerName}, thanks for getting me into Credit U! Let's crush our goals.`}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="min-h-[100px] border-2 border-slate-100 focus:border-blue-500 rounded-xl resize-none"
                    />
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-indigo-100 p-2 rounded-lg">
                                <Users className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm">Accountability Partner</h4>
                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Team up for progress</p>
                            </div>
                        </div>
                        <Switch
                            checked={isAccountabilityPartner}
                            onCheckedChange={setIsAccountabilityPartner}
                        />
                    </div>
                    <p className="mt-3 text-[11px] text-slate-600 leading-relaxed font-medium">
                        By becoming partners, you can see each other's progress and keep each other on track to graduating from the Academy.
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-6 rounded-xl uppercase tracking-widest gap-2 shadow-xl"
                    >
                        {isSubmitting ? "Sending..." : (
                            <>
                                <Send className="w-4 h-4" /> Send Message
                            </>
                        )}
                    </Button>
                    <div className="flex items-center justify-center gap-2 text-slate-400">
                        <ShieldCheck className="w-3 h-3" />
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Secure Transmission</span>
                    </div>
                </div>
            </form>
        </motion.div>
    );
}
