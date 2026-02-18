import { motion, useMotionValue, useTransform } from 'framer-motion';
import { CreditULogo } from './common/CreditULogo';
import { useState } from 'react';
import { useProfile } from '@/hooks/useProfile';

interface CertificateProps {
    firstName?: string;
    lastName?: string;
    completionDate?: string;
}

export default function DormWeekCertificate({ firstName: propFirst, lastName: propLast, completionDate }: CertificateProps) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const { profile } = useProfile();

    // Determine the student name: props > profile > default
    const first = propFirst || profile?.first_name || "Credit";
    const last = propLast || profile?.last_name || "Architect";
    const studentName = `${first} ${last}`.trim();

    const today = completionDate || new Date().toLocaleDateString('en-US', {
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

    return (
        <div className="w-full flex items-center justify-center p-4">
            <motion.div
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                style={{ perspective: 1500 }}
                className="w-full max-w-5xl"
            >
                <motion.div
                    style={{
                        rotateX: isHovering ? rotateX : 0,
                        rotateY: isHovering ? rotateY : 0,
                        transformStyle: 'preserve-3d',
                    }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="relative w-full aspect-[10/8] bg-[#fdfcf7] rounded-sm shadow-2xl overflow-hidden border border-slate-200"
                >
                    {/* Parchment Texture */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z'/%3E%3C/svg%3E")` }} />

                    {/* Ornate Gold Borders */}
                    <div className="absolute inset-0 z-10 pointer-events-none p-1">
                        <div className="absolute inset-6 border-[8px] border-[#d4af37]/80" />
                        <div className="absolute inset-[30px] border border-[#d4af37]/20" />

                        {/* Corner Flourishes */}
                        {[
                            'top-4 left-4',
                            'top-4 right-4 rotate-90',
                            'bottom-4 left-4 -rotate-90',
                            'bottom-4 right-4 rotate-180'
                        ].map((pos, i) => (
                            <div key={i} className={`absolute ${pos} w-24 h-24 text-[#b8860b] opacity-80`}>
                                <svg viewBox="0 0 100 100" fill="currentColor">
                                    <path d="M0,0 L100,0 L100,5 L5,5 L5,100 L0,100 Z" />
                                    <circle cx="15" cy="15" r="4" />
                                </svg>
                            </div>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="relative z-20 w-full h-full flex flex-col items-center justify-between py-12 px-20 text-center">
                        <div className="flex flex-col items-center">
                            <CreditULogo className="w-20 h-20 mb-4" variant="gold" showShield={false} />
                            <span className="text-sm font-serif font-bold tracking-[0.5em] text-[#8b6508] uppercase leading-none">Credit U Academy</span>
                        </div>

                        <div className="flex flex-col items-center gap-1">
                            <h1 className="text-5xl font-serif font-black text-slate-900 tracking-tighter uppercase leading-none">Certificate</h1>
                            <h2 className="text-xl font-serif font-medium text-slate-700 tracking-[0.3em] uppercase leading-none">of Completion</h2>
                            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mt-2" />
                        </div>

                        <div className="w-full text-center">
                            <p className="text-xs font-serif italic text-slate-500 mb-4">This certifies that the Board of Trustees has conferred upon</p>
                            <div className="relative inline-block px-12 pb-1 mx-auto">
                                <h2 className="text-5xl font-serif font-bold text-slate-900 tracking-tight leading-none mb-1">
                                    {studentName}
                                </h2>
                                <div className="w-full h-0.5 bg-slate-900" />
                            </div>
                        </div>

                        <div className="w-full text-center">
                            <h3 className="text-lg font-serif font-bold text-slate-800 tracking-widest uppercase mb-1 leading-none">Dorm Week Reset Sequence™</h3>
                            <div className="flex justify-center gap-4 text-[9px] uppercase font-bold tracking-widest text-[#d4af37]">
                                <span>Identity Reframe</span>
                                <span className="text-slate-300">•</span>
                                <span>Credit Architecture</span>
                                <span className="text-slate-200">•</span>
                                <span>System Automation</span>
                            </div>
                        </div>

                        <div className="w-full grid grid-cols-3 gap-12 items-end">
                            <div className="flex flex-col items-center border-t border-slate-300 pt-2">
                                <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-1">Date</span>
                                <span className="text-sm font-serif font-bold text-slate-700">{today}</span>
                            </div>

                            {/* Seal */}
                            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8860b] shadow-xl flex items-center justify-center -mb-4 border-4 border-[#ffec8b]">
                                <CreditULogo className="w-12 h-12" variant="white" showShield={false} />
                                {/* Red Ribbon SVGs */}
                                <div className="absolute -bottom-6 -left-2 w-8 h-12 bg-red-800" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)', zIndex: -1 }} />
                                <div className="absolute -bottom-8 right-2 w-8 h-12 bg-red-700" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)', zIndex: -1 }} />
                            </div>

                            <div className="flex flex-col items-center border-t border-slate-300 pt-2">
                                <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-1">Authorized</span>
                                <span className="text-sm font-serif font-bold text-slate-700 italic">Dr. Leverage, Dean</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
