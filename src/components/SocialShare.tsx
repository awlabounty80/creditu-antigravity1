import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Facebook, Twitter, Linkedin, Mail, Copy, Check, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useProfile } from '@/hooks/useProfile';
import { motion, AnimatePresence } from 'framer-motion';

interface SocialShareProps {
    certificateUrl?: string;
    studentName?: string;
}

export function SocialShare({ certificateUrl, studentName = "Credit Architect" }: SocialShareProps) {
    const { profile } = useProfile();
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [sharedPlatforms, setSharedPlatforms] = useState<string[]>([]);
    const [totalPointsEarned, setTotalPointsEarned] = useState(0);

    const shareUrl = certificateUrl || window.location.href;
    const shareText = `🎓 I just completed the Credit U Dorm Week Reset Sequence! Join me in mastering credit optimization and financial freedom. #CreditU #FinancialFreedom`;

    const handleShare = async (platform: string, url: string) => {
        // Open share window
        window.open(url, '_blank', 'width=600,height=400');

        // Record the share and award points
        if (profile?.id && !sharedPlatforms.includes(platform)) {
            try {
                // Record social share
                const { data: shareData, error: shareError } = await supabase
                    .from('social_shares')
                    .insert({
                        user_id: profile.id,
                        platform: platform,
                        share_type: 'certificate',
                        points_awarded: 1000,
                        metadata: {
                            share_url: shareUrl,
                            student_name: studentName
                        }
                    })
                    .select()
                    .single();

                if (shareError) throw shareError;

                // Award points
                const { error: pointsError } = await supabase
                    .from('points_transactions')
                    .insert({
                        user_id: profile.id,
                        points: 1000,
                        transaction_type: 'social_share',
                        description: `Shared certificate on ${platform}`,
                        reference_id: shareData.id
                    });

                if (pointsError) throw pointsError;

                // Update profile points
                const { error: updateError } = await supabase
                    .from('profiles')
                    .update({
                        moo_points: (profile.moo_points || 0) + 1000
                    })
                    .eq('id', profile.id);

                if (updateError) throw updateError;

                // Update UI
                setSharedPlatforms([...sharedPlatforms, platform]);
                setTotalPointsEarned(totalPointsEarned + 1000);

            } catch (error) {
                console.error('Error recording share:', error);
            }
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    const socialPlatforms = [
        {
            name: 'Facebook',
            icon: Facebook,
            color: 'bg-blue-600 hover:bg-blue-700',
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`
        },
        {
            name: 'Twitter',
            icon: Twitter,
            color: 'bg-sky-500 hover:bg-sky-600',
            url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
        },
        {
            name: 'LinkedIn',
            icon: Linkedin,
            color: 'bg-blue-700 hover:bg-blue-800',
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
        },
        {
            name: 'Email',
            icon: Mail,
            color: 'bg-slate-600 hover:bg-slate-700',
            url: `mailto:?subject=${encodeURIComponent('Check out my Credit U Achievement!')}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`
        }
    ];

    return (
        <div className="relative">
            {/* Share Button */}
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold shadow-lg"
            >
                <Share2 className="w-5 h-5" />
                Share & Earn 1000 Points
                {totalPointsEarned > 0 && (
                    <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                        +{totalPointsEarned} pts earned!
                    </span>
                )}
            </Button>

            {/* Share Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute top-full mt-4 right-0 z-50 bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 w-96"
                    >
                        {/* Header */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-5 h-5 text-amber-500" />
                                <h3 className="text-xl font-bold text-slate-900">Share Your Achievement</h3>
                            </div>
                            <p className="text-sm text-slate-600">
                                Earn <span className="font-bold text-amber-600">1,000 points</span> for each platform you share on!
                            </p>
                        </div>

                        {/* Social Platforms */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {socialPlatforms.map((platform) => {
                                const isShared = sharedPlatforms.includes(platform.name.toLowerCase());
                                return (
                                    <Button
                                        key={platform.name}
                                        onClick={() => handleShare(platform.name.toLowerCase(), platform.url)}
                                        className={`${platform.color} text-white font-semibold gap-2 relative overflow-hidden`}
                                        disabled={isShared}
                                    >
                                        {isShared && (
                                            <div className="absolute inset-0 bg-green-500 flex items-center justify-center">
                                                <Check className="w-5 h-5" />
                                            </div>
                                        )}
                                        <platform.icon className="w-4 h-4" />
                                        {platform.name}
                                        {isShared && (
                                            <span className="ml-auto text-xs">+1000</span>
                                        )}
                                    </Button>
                                );
                            })}
                        </div>

                        {/* Copy Link */}
                        <div className="border-t border-slate-200 pt-4">
                            <p className="text-xs text-slate-600 mb-2 font-semibold">Or copy link:</p>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={shareUrl}
                                    readOnly
                                    className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg bg-slate-50 text-slate-700"
                                />
                                <Button
                                    onClick={copyToClipboard}
                                    variant="outline"
                                    className="gap-2"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="w-4 h-4 text-green-600" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4" />
                                            Copy
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Points Summary */}
                        {totalPointsEarned > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 bg-gradient-to-r from-amber-50 to-green-50 border border-amber-200 rounded-lg p-4"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-slate-700">Points Earned:</span>
                                    <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-green-600">
                                        +{totalPointsEarned}
                                    </span>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
