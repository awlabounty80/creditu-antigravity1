import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const CreditLabEntryScreen = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleEnter = () => {
        if (user) {
            navigate('/dashboard');
        } else {
            navigate('/auth');
        }
    };

    // Parallax logic (Mouse tracking)
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [5, -5]);
    const rotateY = useTransform(x, [-100, 100], [-5, 5]);

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set(event.clientX - centerX);
        y.set(event.clientY - centerY);
    };

    return (
        <div
            className="min-h-screen bg-[#0a0f2c] overflow-hidden relative flex items-center justify-center font-sans selection:bg-amber-500 selection:text-white"
            onMouseMove={handleMouseMove}
        >
            {/* Background Atmosphere */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/30 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-indigo-900/20 blur-[100px] rounded-full" />
                <div className="absolute top-[40%] left-[30%] w-[60%] h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent rotate-12" />
            </div>

            {/* Main Container */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto px-6 w-full items-center">

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="space-y-8"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-900/10 text-amber-500 text-xs font-bold tracking-widest uppercase">
                        <ShieldCheck className="w-3 h-3" />
                        The Credit University AI™
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight">
                        Welcome to <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 drop-shadow-sm">
                            The Credit Lab
                        </span>
                    </h1>

                    <p className="text-blue-200/80 text-lg md:text-xl leading-relaxed max-w-lg">
                        Your private command center for personal credit governance.
                        Guided by sovereign intelligence. Zero data retention.
                    </p>

                    <div className="flex items-center gap-4 pt-4">
                        <button
                            onClick={handleEnter}
                            className="group relative px-8 py-4 bg-white text-[#0a0f2c] font-bold text-lg rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                ENTER CREDIT LAB <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-100 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </div>
                </motion.div>

                {/* Professor Image (2.5D Parallax) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.2 }}
                    style={{ rotateX, rotateY, perspective: 1000 }}
                    className="relative hidden lg:block"
                >
                    {/* Glowing Backplate */}
                    <div className="absolute inset-4 bg-gradient-to-tr from-blue-600 to-indigo-800 rounded-3xl blur-2xl opacity-40 -z-10" />

                    <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#0f1535]">
                        <img
                            src="/assets/professor/professor-creditlab.png"
                            alt="The Professor"
                            className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity duration-700"
                        />

                        {/* Overlay Gradient for seamless bottom blend */}
                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0f2c] to-transparent" />

                        {/* Jacket Embroidery Spec (Visual Only) */}
                        <div className="absolute bottom-20 right-6 text-right">
                            <div className="text-[10px] text-amber-500/80 font-serif tracking-widest uppercase opacity-60">
                                The Credit University AI™
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
