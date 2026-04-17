// CACHE_BUST_OMEGA_2026_0306_0255
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, User, Phone, Sparkles, ArrowRight, Zap, Trophy, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RegistrationFormProps {
    onSubmit: (data: { name: string; email: string; password?: string; phone?: string; dob?: string; city?: string; state?: string }) => void;
    isLoading: boolean;
    error: string | null;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit, isLoading, error }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        dob: '',
        city: '',
        state: ''
    });

    useEffect(() => {
        console.log("RegistrationForm: COMPONENT MOUNTED. Version: 2.1 (No Shadcn Button)");
    }, []);

    const handleAction = () => {
        console.log("RegistrationForm: handleAction Triggered", formData);
        if (!formData.name || !formData.email) {
            console.warn("RegistrationForm: Name or email missing");
            return;
        }
        onSubmit(formData);
    };

    return (
        <div className="w-full flex flex-col items-center gap-12 max-w-2xl mx-auto">
            {/* Campus Energy Bar */}
            <div className="w-full px-6 py-4 bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl">
                <div className="flex justify-between items-end mb-2">
                    <div className="flex items-center gap-2">
                        <Zap className="w-3 h-3 text-amber-500 fill-current" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Campus Energy</span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">92% // High</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden p-[2px] border border-white/10">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "92%" }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                    />
                </div>
                <p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-500 mt-2 text-center">Dorm Week Opening Soon</p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full bg-[#0a0f2d]/80 backdrop-blur-3xl border border-white/10 p-10 md:p-12 rounded-[3rem] shadow-[0_0_100px_rgba(37,99,235,0.1)] relative"
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-500" />

                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-6">
                        <Sparkles className="w-3 h-3 animate-pulse" />
                        DORM WEEK RUSH PROTOCOL // IDENTITY RECONSTRUCTION
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-4">Enter The Yard</h2>
                    <p className="text-slate-400 text-base max-w-sm mx-auto">Identify yourself to initialize the admissions sequence and unlock the machine.</p>
                </div>

                <div className="space-y-6 max-w-md mx-auto">
                    <div className="space-y-2 text-left">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</Label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <Input
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. ASHLEY"
                                className="bg-black/40 border-white/10 pl-12 h-16 rounded-2xl focus:border-indigo-500 transition-all text-white font-bold uppercase text-lg"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 text-left">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</Label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <Input
                                required
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="john@example.com"
                                className="bg-black/40 border-white/10 pl-12 h-16 rounded-2xl focus:border-indigo-500 transition-all text-white font-bold text-lg"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 text-left">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Create Password (Returning Access)</Label>
                        <div className="relative">
                            <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <Input
                                required
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••••"
                                className="bg-black/40 border-white/10 pl-12 h-16 rounded-2xl focus:border-indigo-500 transition-all text-white font-bold text-lg"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 text-left">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Phone (Optional)</Label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <Input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="(555) 000-0000"
                                className="bg-black/40 border-white/10 pl-12 h-16 rounded-2xl focus:border-indigo-500 transition-all text-white font-bold text-lg"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 text-left">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">DOB</Label>
                            <Input
                                required
                                type="date"
                                value={formData.dob}
                                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                className="bg-black/40 border-white/10 h-16 rounded-2xl focus:border-indigo-500 transition-all text-white font-bold [color-scheme:dark]"
                            />
                        </div>
                        <div className="space-y-2 text-left">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">City</Label>
                            <Input
                                required
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                placeholder="City"
                                className="bg-black/40 border-white/10 h-16 rounded-2xl focus:border-indigo-500 transition-all text-white font-bold"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 text-left">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">State</Label>
                        <Input
                            required
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            placeholder="State (e.g. CA)"
                            className="bg-black/40 border-white/10 h-16 rounded-2xl focus:border-indigo-500 transition-all text-white font-bold"
                        />
                    </div>

                    {error && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-black text-center uppercase tracking-tighter flex items-center justify-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <button
                        type="button"
                        disabled={isLoading}
                        onClick={handleAction}
                        className="group relative w-full h-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-600 hover:from-blue-500 hover:to-amber-500 text-white font-black uppercase tracking-[0.2em] rounded-3xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_20px_60px_-15px_rgba(37,99,235,0.5)] overflow-hidden text-2xl flex items-center justify-center"
                    >
                        <span className="relative z-10 flex flex-col items-center justify-center gap-1">
                            {isLoading ? (
                                <>
                                    < Zap className="w-5 h-5 animate-spin text-amber-500" />
                                    <span className="text-sm">Initializing Sequence...</span>
                                </>
                            ) : (
                                <>
                                    <span>Initialize Admissions</span>
                                    <span className="text-[10px] opacity-60 tracking-[0.4em] font-medium">- Unlock Machine -</span>
                                </>
                            )}
                        </span>
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </button>
                </div>

                <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-center gap-6 opacity-30">
                    <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-amber-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Jackpot Active</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-blue-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">System: Optimized</span>
                    </div>
                </div>
            </motion.div>

            {/* Force Proceed Debug Link */}
            <button
                onClick={() => onSubmit({ name: formData.name || 'ASHLEY', email: formData.email || 'awlabounty80@gmail.com' })}
                className="text-[8px] text-white/5 uppercase tracking-[0.5em] hover:text-amber-500/50 transition-colors"
            >
                Protocol Force Start
            </button>
        </div>
    );
};
