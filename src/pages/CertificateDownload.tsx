import { DownloadableCertificate } from '@/components/DownloadableCertificate';
import { SocialShare } from '@/components/SocialShare';
import { DailyReferral } from '@/components/DailyReferral';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { motion } from 'framer-motion';
import DormWeekCertificate from '@/components/DormWeekCertificate';

export default function CertificateDownloadPage() {
    const navigate = useNavigate();
    const { profile } = useProfile();

    const fullName = profile?.first_name && profile?.last_name
        ? `${profile.first_name} ${profile.last_name}`
        : "Credit Architect";

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] py-12 px-4 overflow-x-hidden">
            {/* Back Button */}
            <div className="max-w-6xl mx-auto mb-8 relative z-50">
                <Button
                    onClick={() => navigate('/dashboard/orientation')}
                    variant="ghost"
                    className="text-white hover:text-amber-400 gap-2 hover:bg-white/10"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Button>
            </div>

            {/* Header */}
            <div className="text-center mb-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold tracking-[0.2em] uppercase mb-4"
                >
                    Milestone Achieved
                </motion.div>
                <h1 className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter bg-gradient-to-r from-white via-amber-200 to-white bg-clip-text text-transparent">
                    GRADUATION DAY
                </h1>
                <p className="text-xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
                    Congratulations, <span className="text-amber-400 font-bold">{fullName}</span>.
                    You have successfully navigated the Credit U Dorm Week™ Reset Sequence.
                </p>
            </div>

            {/* HIGH POLISH PREVIEW */}
            <div className="mb-20 transform scale-[0.8] md:scale-100 origin-top">
                <DormWeekCertificate
                    firstName={profile?.first_name || undefined}
                    lastName={profile?.last_name || undefined}
                />
            </div>

            {/* Share & Download Section */}
            <div className="max-w-4xl mx-auto space-y-12 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl">
                    <div className="text-center md:text-left flex-1">
                        <h3 className="text-2xl font-bold text-white mb-2">Share Your Success</h3>
                        <p className="text-slate-400">Broadcast your achievement to the network and earn bonus points.</p>
                    </div>
                    <SocialShare
                        certificateUrl={window.location.href}
                        studentName={fullName}
                    />
                </div>

                <div className="bg-white rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-4 border-amber-500/20">
                    <div className="bg-slate-900 p-6 text-center border-b border-white/10">
                        <h3 className="text-xl font-bold text-amber-400 uppercase tracking-widest">Official Print-Ready Document</h3>
                        <p className="text-slate-400 text-sm mt-1">High-resolution 8x10 PDF configuration</p>
                    </div>
                    <div className="p-4 md:p-12 overflow-x-auto bg-[#F8F9FA]">
                        <div className="transform scale-[0.5] md:scale-[0.8] lg:scale-100 origin-top h-[550px] md:h-auto overflow-hidden md:overflow-visible">
                            <DownloadableCertificate
                                studentName={fullName}
                                completionDate={new Date().toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            />
                        </div>
                    </div>
                </div>

                {/* Daily Referral Section */}
                <DailyReferral />
            </div>

            {/* Additional Info */}
            <div className="max-w-4xl mx-auto mt-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">📜 Certificate Details</h3>
                <div className="space-y-3 text-slate-300">
                    <p>✅ <strong>Format:</strong> High-quality PDF (8x10 inches)</p>
                    <p>✅ <strong>Resolution:</strong> Print-ready at 300 DPI</p>
                    <p>✅ <strong>Paper Recommendation:</strong> Premium cardstock or certificate paper</p>
                    <p>✅ <strong>Frame Size:</strong> Standard 8x10 inch frame</p>
                    <p>✅ <strong>Authenticity:</strong> Includes unique certificate ID for verification</p>
                </div>
            </div>
        </div>
    );
}
