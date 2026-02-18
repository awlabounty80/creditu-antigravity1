import { useRef, useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CreditULogo } from './common/CreditULogo';
import { useProfile } from '@/hooks/useProfile';
// @ts-ignore
import html2pdf from 'html2pdf.js';

interface DownloadableCertificateProps {
    studentName?: string;
    completionDate?: string;
}

export function DownloadableCertificate({ studentName: propName, completionDate }: DownloadableCertificateProps) {
    const certRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const { profile } = useProfile();

    // Determine the student name: prop > profile > default
    const studentName = propName || (profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : "Credit Architect");

    const today = completionDate || new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const handleDownload = async () => {
        if (!certRef.current) return;
        setIsGenerating(true);

        const element = certRef.current;
        const opt = {
            margin: 0,
            filename: `CreditU_Official_Certificate_${studentName.replace(/\s+/g, '_')}.pdf`,
            image: { type: 'jpeg' as const, quality: 1.0 },
            html2canvas: {
                scale: 4,
                useCORS: true,
                letterRendering: true,
                backgroundColor: '#ffffff',
                logging: false
            },
            jsPDF: {
                unit: 'in',
                format: [10, 8] as [number, number],
                orientation: 'landscape' as const
            }
        };

        try {
            await html2pdf().set(opt).from(element).save();
        } catch (error) {
            console.error("PDF Generation failed", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="w-full flex flex-col items-center">
            {/* Download Button */}
            <div className="print:hidden mb-12">
                <Button
                    onClick={handleDownload}
                    disabled={isGenerating}
                    className="gap-3 bg-gradient-to-r from-[#b8860b] to-[#d4af37] hover:from-[#996515] hover:to-[#b8860b] text-white font-black py-8 px-12 rounded-2xl shadow-[0_20px_40px_-15px_rgba(184,134,11,0.5)] transition-all hover:scale-105 active:scale-95 text-lg"
                >
                    {isGenerating ? <Loader2 className="w-8 h-8 animate-spin" /> : <Download className="w-8 h-8" />}
                    {isGenerating ? "MINTING PDF..." : "DOWNLOAD OFFICIAL 8x10"}
                </Button>
            </div>

            {/* The Certificate - 10:8 Aspect Ratio */}
            <div
                ref={certRef}
                className="relative w-full aspect-[10/8] bg-[#fdfcf7] rounded-sm shadow-[0_60px_100px_-20px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col items-center justify-between p-0 border border-slate-200"
                style={{ minWidth: '1000px' }} // Ensure consistent rendering
            >
                {/* Parchment Texture with multiple layers */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z'/%3E%3C/svg%3E")` }} />
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-900/5 via-transparent to-amber-900/5 pointer-events-none" />

                {/* ORNATE BORDER SYSTEM */}
                <div className="absolute inset-0 z-10 pointer-events-none p-1">
                    {/* Gold Outer Frame */}
                    <div className="absolute inset-8 border-[12px] border-[#d4af37] shadow-[inset_0_0_20px_rgba(0,0,0,0.2)]" />
                    {/* Inner White Pinstripe */}
                    <div className="absolute inset-[44px] border-2 border-white/40" />
                    {/* Inner Gold Pinstripe */}
                    <div className="absolute inset-[52px] border border-[#d4af37]/40" />

                    {/* SVG Corner Flourishes for perfect PDF rendering */}
                    {[
                        'top-6 left-6',
                        'top-6 right-6 rotate-90',
                        'bottom-6 left-6 -rotate-90',
                        'bottom-6 right-6 rotate-180'
                    ].map((pos, i) => (
                        <div key={i} className={`absolute ${pos} w-40 h-40 text-[#b8860b]`}>
                            <svg viewBox="0 0 100 100" className="w-full h-full">
                                <path d="M5,5 L95,5 L95,8 L8,8 L8,95 L5,95 Z" fill="currentColor" />
                                <circle cx="15" cy="15" r="3" fill="currentColor" />
                                <path d="M25,5 L25,20 L10,20" fill="none" stroke="currentColor" strokeWidth="1" />
                                <path d="M40,5 C40,25 25,40 5,40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                            </svg>
                        </div>
                    ))}
                </div>

                {/* CONTENT LAYER */}
                <div className="relative z-20 flex flex-col items-center justify-between h-full w-full py-16 px-32 text-center">

                    {/* Header: Institution & Brand */}
                    <div className="flex flex-col items-center">
                        <div className="mb-6 relative">
                            <div className="absolute -inset-4 bg-amber-500/10 blur-xl rounded-full" />
                            <CreditULogo className="w-32 h-32 relative z-10" variant="gold" showShield={false} />
                        </div>
                        <div className="flex items-center gap-6 mb-2">
                            <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#d4af37]" />
                            <span className="text-lg font-serif font-bold tracking-[0.6em] text-[#8b6508] uppercase">Credit U Academy</span>
                            <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#d4af37]" />
                        </div>
                        <span className="text-xs tracking-[0.4em] text-[#d4af37]/80 font-bold uppercase">Excellence in Financial Architecture</span>
                    </div>

                    {/* Main Title: Balanced Spacing to avoid overlap */}
                    <div className="flex flex-col items-center space-y-2">
                        <h1 className="text-7xl font-serif font-black text-slate-900 tracking-tighter uppercase leading-[0.8]">
                            Certificate
                        </h1>
                        <h2 className="text-3xl font-serif font-medium text-slate-600 tracking-[0.3em] uppercase">
                            of Completion
                        </h2>
                        <div className="w-64 h-1.5 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mt-6" />
                    </div>

                    {/* Recipient Section */}
                    <div className="w-full text-center space-y-8">
                        <p className="text-lg font-serif italic text-slate-500 tracking-wide">
                            This certifies that the Board of Trustees has conferred upon
                        </p>
                        <div className="relative inline-block px-20">
                            <h2 className="text-8xl font-serif font-bold text-slate-900 tracking-tight leading-none">
                                {studentName}
                            </h2>
                            <div className="w-full h-1 bg-slate-900 mt-4" />
                        </div>
                        <p className="text-lg font-serif italic text-slate-500 tracking-wide">
                            the distinction of high-fidelity achievement in the intensive
                        </p>
                    </div>

                    {/* Course / Achievement Section */}
                    <div className="w-full text-center">
                        <h3 className="text-2xl font-serif font-bold text-slate-800 tracking-[0.2em] uppercase mb-3">
                            Dorm Week Reset Sequence™
                        </h3>
                        <div className="flex justify-center gap-6 text-xs uppercase font-extrabold tracking-[0.3em] text-[#8b6508]">
                            <span>Identity Reframe</span>
                            <span className="text-slate-300">•</span>
                            <span>Credit Architecture</span>
                            <span className="text-slate-300">•</span>
                            <span>System Automation</span>
                        </div>
                    </div>

                    {/* Validation Footer: Signature, Date, Seal */}
                    <div className="w-full grid grid-cols-3 gap-16 items-end pt-8">
                        {/* Conferred Date */}
                        <div className="flex flex-col items-center pb-2">
                            <div className="w-full h-px bg-slate-300 mb-4" />
                            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-black mb-1">Conferred On</span>
                            <span className="text-lg font-serif font-bold text-slate-700">{today}</span>
                        </div>

                        {/* Official Gold Seal with Robust SVG Ribbons */}
                        <div className="relative flex justify-center -mb-4">
                            <div className="relative w-40 h-40 flex items-center justify-center">
                                {/* Ribbons using border shapes for better PDF rendering than clip-path */}
                                <div className="absolute -bottom-12 -left-2 w-16 h-24 bg-[#991b1b] shadow-xl"
                                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)' }} />
                                <div className="absolute -bottom-14 right-2 w-16 h-24 bg-[#7f1d1d] shadow-xl"
                                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)' }} />

                                {/* Seal Background (Radial) */}
                                <div className="absolute inset-0 bg-[#d4af37] rounded-full shadow-2xl border-4 border-[#ffec8b]" />

                                {/* Inner Seal */}
                                <div className="absolute inset-3 rounded-full border-2 border-dashed border-[#ffec8b]/40 animate-none" />

                                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#ffd700] via-[#d4af37] to-[#b8860b] shadow-inner flex items-center justify-center border-4 border-[#ffec8b] z-10">
                                    <div className="w-24 h-24 rounded-full border border-[#ffec8b]/50 flex items-center justify-center">
                                        <CreditULogo className="w-16 h-16" variant="white" showShield={false} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Authorized Signature */}
                        <div className="flex flex-col items-center pb-2">
                            <div className="relative w-full mb-4 flex justify-center">
                                <svg className="w-48 h-16 absolute -top-12 text-[#1e293b]" viewBox="0 0 200 60">
                                    <path
                                        d="M20,40 C40,20 60,10 80,30 C100,50 120,40 140,20 C160,0 180,30 190,45"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                    />
                                    <path
                                        d="M30,45 Q60,35 90,45 T150,45"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1"
                                        strokeOpacity="0.5"
                                    />
                                </svg>
                                <div className="w-full h-px bg-slate-300" />
                            </div>
                            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-black mb-1">Authorized Official</span>
                            <span className="text-lg font-serif font-bold text-slate-700 italic">Dr. Leverage, Dean</span>
                        </div>
                    </div>

                    {/* Anti-Forgery Metadata */}
                    <div className="w-full flex justify-between items-center opacity-40 text-[9px] font-mono tracking-[0.2em] border-t border-slate-200 mt-12 pt-6">
                        <span>CERTIFICATE ID: CRU-{new Date().getFullYear()}-RESET-{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span>IMMUTABLE RECORD // BLOCKCHAIN VERIFIED</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
