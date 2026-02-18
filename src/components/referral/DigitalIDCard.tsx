import { motion } from 'framer-motion';
import { Shield, GraduationCap, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DigitalIDCardProps {
    firstName: string;
    lastName: string;
    level: string;
    mission: string;
    idCode: string;
    onClose?: () => void;
}

export function DigitalIDCard({ firstName, lastName, level, mission, idCode, onClose }: DigitalIDCardProps) {
    return (
        <div className="relative w-full max-w-[500px] group">
            {/* Background Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-amber-500 to-indigo-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition duration-1000" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                className="relative bg-[#050a1f] border-2 border-white/10 rounded-2xl overflow-hidden shadow-2xl aspect-[1.586/1]"
            >
                {/* Holographic Strip */}
                <div className="absolute top-0 bottom-0 left-12 w-12 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 z-0" />

                {/* Content */}
                <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center border border-white/20">
                                <GraduationCap className="w-6 h-6 text-black" />
                            </div>
                            <div>
                                <h3 className="font-black text-lg text-white tracking-widest leading-none">CREDIT U</h3>
                                <p className="font-mono text-[8px] text-amber-500 uppercase tracking-widest mt-1">Authorized Student ID</p>
                            </div>
                        </div>
                        {onClose && (
                            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/10">
                                <X className="w-4 h-4" />
                            </Button>
                        )}
                    </div>

                    {/* Body */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[8px] uppercase text-slate-500 tracking-widest mb-1">Student Name</p>
                            <p className="text-sm font-bold text-white uppercase truncate">{firstName} {lastName}</p>
                        </div>
                        <div>
                            <p className="text-[8px] uppercase text-slate-500 tracking-widest mb-1">Rank / Level</p>
                            <p className="text-xs font-bold text-amber-400 uppercase tracking-widest">{level}</p>
                        </div>
                        <div className="col-span-1">
                            <p className="text-[8px] uppercase text-slate-500 tracking-widest mb-1">Status</p>
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest">Active</span>
                            </div>
                        </div>
                        <div className="col-span-2">
                            <p className="text-[8px] uppercase text-slate-500 tracking-widest mb-1">Mission Protocol</p>
                            <p className="text-[10px] font-medium text-blue-300 uppercase">{mission}</p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-end border-t border-white/5 pt-4">
                        <div className="flex flex-col gap-2">
                            {onClose && (
                                <button
                                    onClick={onClose}
                                    className="flex items-center gap-1.5 text-[8px] font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors mb-1 group"
                                >
                                    <X className="w-2 h-2" /> Back to Dashboard
                                </button>
                            )}
                            <div>
                                <p className="text-[8px] uppercase text-slate-500 tracking-widest mb-0.5">ID Number</p>
                                <p className="font-mono text-sm text-amber-500 tracking-widest">{idCode}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-1.5 justify-end">
                                <Shield className="w-3 h-3 text-blue-400" />
                                <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Secure Access</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Micro-texture */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
            </motion.div>
        </div>
    );
}
