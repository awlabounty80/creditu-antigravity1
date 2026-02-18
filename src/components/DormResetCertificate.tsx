import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Download, Loader2 } from 'lucide-react';
import { CreditULogo } from './common/CreditULogo';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/hooks/useProfile';
// @ts-ignore
import html2pdf from 'html2pdf.js';

interface DormResetCertificateProps {
    studentName?: string;
    onDownload?: () => void;
}

export function DormResetCertificate({ studentName: propName, onDownload }: DormResetCertificateProps) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const certRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const { profile } = useProfile();

    // Determine the student name: prop > profile > default
    const studentName = propName || (profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : "Credit Architect");

    const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePosition({ x, y });
    };

    const rotateX = useTransform(useMotionValue(mousePosition.y), [0, 1], [3, -3]);
    const rotateY = useTransform(useMotionValue(mousePosition.x), [0, 1], [-3, 3]);

    const handleDownload = async () => {
        if (!certRef.current) return;
        setIsGenerating(true);

        const element = certRef.current;
        const opt = {
            margin: 0,
            filename: `CreditU_Certificate_${studentName.replace(/\s+/g, '_')}.pdf`,
            image: { type: 'jpeg' as const, quality: 1.0 },
            html2canvas: {
                scale: 4,
                useCORS: true,
                letterRendering: true,
                logging: false,
                backgroundColor: '#ffffff'
            },
            jsPDF: { unit: 'in', format: [10, 8] as [number, number], orientation: 'landscape' as const }
        };

        try {
            await html2pdf().set(opt).from(element).save();
            if (onDownload) onDownload();
        } catch (error) {
            console.error("PDF Generation failed", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto py-12 px-4 flex flex-col items-center">
            {/* Download Action Bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-6 mb-12 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl print:hidden shadow-2xl"
            >
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-amber-500 font-bold">Credential Ready</span>
                    <span className="text-sm text-slate-300 font-medium">{studentName}'s Official Export</span>
                </div>
                <Button
                    onClick={handleDownload}
                    disabled={isGenerating}
                    className="gap-3 bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-white font-black py-6 px-10 rounded-xl shadow-[0_10px_20px_-5px_rgba(245,158,11,0.4)] transition-all hover:scale-105 active:scale-95 group"
                >
                    {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5 group-hover:animate-bounce" />}
                    {isGenerating ? "MINTING PDF..." : "DOWNLOAD CERTIFICATE"}
                </Button>
            </motion.div>

            {/* Certificate Stage */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ perspective: 2000 }}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className="w-full"
            >
                <motion.div
                    style={{
                        rotateX: isHovering ? rotateX : 0,
                        rotateY: isHovering ? rotateY : 0,
                        transformStyle: 'preserve-3d',
                    }}
                    transition={{ type: "spring", stiffness: 150, damping: 20 }}
                    className="relative cursor-default"
                >
                    {/* Atmospheric Glow */}
                    <div className="absolute -inset-10 bg-amber-500/10 blur-[100px] rounded-full opacity-30 pointer-events-none" />

                    {/* Main Certificate Content */}
                    <div
                        ref={certRef}
                        className="relative w-full aspect-[10/8] bg-[#fdfcf7] text-slate-900 rounded-sm shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col items-center justify-between p-1 border border-slate-200"
                    >
                        {/* Parchment Texture */}
                        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z'/%3E%3C/svg%3E")` }} />

                        {/* ORNATE BORDER SYSTEM */}
                        <div className="absolute inset-0 z-10 pointer-events-none p-1">
                            <div className="absolute inset-8 border-[12px] border-[#d4af37]" />
                            <div className="absolute inset-[44px] border-2 border-white/40" />
                            <div className="absolute inset-[52px] border border-[#d4af37]/40" />

                            {/* Corner Flourishes */}
                            {[
                                'top-6 left-6',
                                'top-6 right-6 rotate-90',
                                'bottom-6 left-6 -rotate-90',
                                'bottom-6 right-6 rotate-180'
                            ].map((pos, i) => (
                                <div key={i} className={`absolute ${pos} w-32 h-32 text-[#b8860b]`}>
                                    <svg viewBox="0 0 100 100" className="w-full h-full">
                                        <path d="M5,5 L95,5 L95,8 L8,8 L8,95 L5,95 Z" fill="currentColor" />
                                        <circle cx="15" cy="15" r="3" fill="currentColor" />
                                    </svg>
                                </div>
                            ))}
                        </div>

                        {/* CONTENT LAYER */}
                        <div className="relative z-20 w-full h-full flex flex-col items-center justify-between py-16 px-32 text-center">

                            {/* Header Section */}
                            <div className="w-full flex flex-col items-center">
                                <div className="mb-6">
                                    <CreditULogo className="w-24 h-24" variant="gold" showShield={false} />
                                </div>
                                <div className="flex items-center gap-6 mb-2">
                                    <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#d4af37]" />
                                    <span className="text-sm font-serif font-bold tracking-[0.6em] text-[#8b6508] uppercase">Credit U Academy</span>
                                    <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#d4af37]" />
                                </div>
                                <span className="text-[10px] tracking-[0.4em] text-[#d4af37] font-semibold uppercase">Excellence in Financial Architecture</span>
                            </div>

                            {/* Main Title Section */}
                            <div className="flex flex-col items-center space-y-1">
                                <h1 className="text-6xl font-serif font-black text-slate-900 tracking-tighter uppercase leading-none">
                                    Certificate
                                </h1>
                                <h2 className="text-2xl font-serif font-medium text-slate-700 tracking-[0.3em] uppercase">
                                    of Completion
                                </h2>
                                <div className="w-48 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mt-4" />
                            </div>

                            {/* Recipient Section */}
                            <div className="w-full">
                                <p className="text-base font-serif italic text-slate-500 mb-6 tracking-wide">
                                    This certifies that the Board of Trustees has conferred upon
                                </p>
                                <div className="relative inline-block px-16 border-b-2 border-slate-900 pb-2">
                                    <h2 className="text-7xl font-serif font-bold text-slate-900 tracking-tight leading-tight">
                                        {studentName}
                                    </h2>
                                </div>
                                <p className="text-base font-serif italic text-slate-500 mt-6 tracking-wide">
                                    the distinction of high-fidelity achievement in the intensive
                                </p>
                            </div>

                            {/* Distinction / Course Section */}
                            <div className="w-full">
                                <h3 className="text-xl font-serif font-bold text-slate-800 tracking-[0.2em] uppercase mb-2">
                                    Dorm Week Reset Sequence™
                                </h3>
                                <div className="flex justify-center gap-6 text-[10px] uppercase font-extrabold tracking-[0.3em] text-[#d4af37]">
                                    <span>Identity Reframe</span>
                                    <span className="text-slate-300">•</span>
                                    <span>Credit Architecture</span>
                                    <span className="text-slate-300">•</span>
                                    <span>System Automation</span>
                                </div>
                            </div>

                            {/* Validation & Footer Section */}
                            <div className="w-full grid grid-cols-3 gap-12 items-end pt-4">
                                {/* Date Section */}
                                <div className="flex flex-col items-center pb-2">
                                    <div className="w-full h-px bg-slate-300 mb-4" />
                                    <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Conferred On</span>
                                    <span className="text-base font-serif font-bold text-slate-700">{today}</span>
                                </div>

                                {/* Seal Section */}
                                <div className="relative flex justify-center -mb-8">
                                    <div className="relative w-32 h-32 flex items-center justify-center">
                                        {/* Ribbons - Using SVG for better PDF rendering support */}
                                        <div className="absolute -bottom-10 -left-1 w-12 h-24 z-0">
                                            <svg viewBox="0 0 50 100" className="w-full h-full text-red-800 fill-current drop-shadow-lg">
                                                <path d="M0,0 L50,0 L50,100 L25,85 L0,100 Z" />
                                            </svg>
                                        </div>
                                        <div className="absolute -bottom-12 right-1 w-12 h-24 z-0">
                                            <svg viewBox="0 0 50 100" className="w-full h-full text-red-700 fill-current drop-shadow-lg">
                                                <path d="M0,0 L50,0 L50,100 L25,85 L0,100 Z" />
                                            </svg>
                                        </div>

                                        <div className="absolute inset-0 bg-[#d4af37] rounded-full shadow-2xl border-4 border-[#ffec8b]" />
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#ffd700] via-[#d4af37] to-[#b8860b] shadow-inner flex items-center justify-center border-4 border-[#ffec8b] z-10">
                                            <CreditULogo className="w-14 h-14" variant="white" showShield={false} />
                                        </div>
                                    </div>
                                </div>

                                {/* Signature Section */}
                                <div className="flex flex-col items-center pb-2">
                                    <div className="relative w-full mb-4 flex justify-center pb-2">
                                        <svg className="w-32 h-12 absolute -top-10 text-[#1a1f3a]" viewBox="0 0 200 60">
                                            <path d="M20,40 Q50,10 80,45 T140,20 Q170,10 180,50" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                        </svg>
                                        <div className="w-full h-px bg-slate-300" />
                                    </div>
                                    <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Authorized Official</span>
                                    <span className="text-base font-serif font-bold text-slate-700 italic">Dr. Leverage, Dean</span>
                                </div>
                            </div>

                            {/* Metadata Footer */}
                            <div className="w-full flex justify-between items-center opacity-30 text-[8px] font-mono tracking-widest border-t border-slate-100 pt-4 mt-8">
                                <span>CERTIFICATE ID: CRU-{new Date().getFullYear()}-RESET-{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                                <span>CREDENTIAL VERIFIED // IMMUTABLE RECORD</span>
                            </div>
                        </div>
                    </div>

                    {/* Perspective Depth Effect (only on web) */}
                    <div className="absolute inset-0 -z-10 translate-y-10 scale-[0.98] blur-3xl bg-black/40 rounded-sm pointer-events-none" />
                </motion.div>
            </motion.div>
        </div>
    );
}
