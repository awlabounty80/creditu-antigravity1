import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Printer, Flame, Trash2, ArrowLeft, Skull } from 'lucide-react';

export default function BurnRitualWorksheet() {
    const navigate = useNavigate();

    // State isn't strictly needed for a print form, but good for interaction
    const [fears, setFears] = useState(['', '', '']);
    const [regrets, setRegrets] = useState(['', '', '']);

    return (
        <div className="min-h-screen bg-neutral-900 text-white font-sans p-8 md:p-16 print:bg-white print:text-black">
            {/* --- HEADER --- */}
            <div className="flex justify-between items-start border-b-4 border-amber-500 pb-6 mb-8 print:border-black">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 text-amber-500 print:text-black">The Burn Ritual</h1>
                    <p className="text-sm font-bold uppercase tracking-widest text-neutral-400 print:text-gray-500">Psychological Reset Protocol // E-003</p>
                </div>
                <div className="text-right">
                    <div className="text-xs font-mono border border-amber-500 text-amber-500 px-2 py-1 inline-block mb-2 print:border-black print:text-black uppercase">
                        Confidential // Destroy After Use
                    </div>
                </div>
            </div>

            {/* Print Controls */}
            <div className="fixed top-4 left-4 print:hidden">
                <Button onClick={() => navigate('/dashboard/orientation')} variant="ghost" className="text-neutral-400 hover:text-white gap-2">
                    <ArrowLeft className="w-4 h-4" /> Return to Dashboard
                </Button>
            </div>

            <div className="fixed top-4 right-4 print:hidden">
                <Button onClick={() => window.print()} className="bg-amber-600 text-black hover:bg-amber-500 gap-2 shadow-xl font-bold">
                    <Printer className="w-4 h-4" /> Print for Destruction
                </Button>
            </div>

            <div className="grid gap-16 max-w-3xl mx-auto relative">
                {/* Background Watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 fixed print:opacity-10">
                    <Flame className="w-[500px] h-[500px]" />
                </div>

                {/* 1. THE FEAR INVENTORY */}
                <section className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-amber-500 text-black p-2 print:border print:border-black print:bg-transparent"><Skull className="w-6 h-6" /></div>
                        <h2 className="text-2xl font-black uppercase text-amber-100 print:text-black">1. The Fear Inventory</h2>
                    </div>
                    <p className="mb-6 text-sm font-light text-neutral-400 print:text-gray-600 max-w-xl">
                        Fear thrives in the dark. Naming it drags it into the light where it dies. What are you actually afraid of? (e.g., "Dying poor", "Being exposed as a fraud").
                    </p>

                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="group">
                                <label className="text-xs font-mono text-amber-500/50 uppercase mb-1 block print:text-black">Fear 0{i}</label>
                                <input
                                    className="w-full bg-transparent border-b border-neutral-700 text-xl py-2 focus:outline-none focus:border-amber-500 transition-colors print:border-black print:text-black"
                                    placeholder="I am afraid that..."
                                />
                            </div>
                        ))}
                    </div>
                </section>

                {/* 2. THE EMOTIONAL LEDGER */}
                <section className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-amber-500 text-black p-2 print:border print:border-black print:bg-transparent"><Trash2 className="w-6 h-6" /></div>
                        <h2 className="text-2xl font-black uppercase text-amber-100 print:text-black">2. The Shame Audit</h2>
                    </div>
                    <p className="mb-6 text-sm font-light text-neutral-400 print:text-gray-600 max-w-xl">
                        Shame is a memory that decided to stay. Evict it. List the specific financial memories that make you cringe.
                    </p>

                    <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="p-4 border border-neutral-800 rounded bg-neutral-900/50 print:border-black print:bg-transparent">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-neutral-500 uppercase">Memory</span>
                                    <span className="text-xs font-bold text-red-500 uppercase">Cost: Emotional Taxation</span>
                                </div>
                                <textarea
                                    className="w-full bg-transparent resize-none h-16 focus:outline-none text-lg print:text-black"
                                    placeholder="The time I..."
                                />
                            </div>
                        ))}
                    </div>
                </section>

                {/* 3. THE RELEASE CONTRACT */}
                <section className="relative z-10 rounded-xl border border-amber-500/30 p-8 bg-amber-950/20 print:border-black print:bg-transparent">
                    <h2 className="text-2xl font-black uppercase text-amber-500 mb-6 text-center print:text-black">The Contract of Release</h2>

                    <div className="text-center space-y-6 font-serif italic text-lg opacity-80 print:text-black print:not-italic print:font-sans">
                        <p>
                            "I hereby declare that these debts of shame are paid in full. They were purchased with experience, and I am keeping the lesson but destroying the receipt."
                        </p>
                        <p>
                            "I am not my past. I am my potential."
                        </p>
                    </div>

                    <div className="mt-12 pt-12 border-t border-dashed border-neutral-700 print:border-black grid grid-cols-2 gap-8">
                        <div>
                            <div className="h-12 border-b-2 border-amber-500/50 print:border-black mb-2"></div>
                            <p className="text-xs font-bold uppercase text-neutral-500 text-center">Signature of Architect</p>
                        </div>
                        <div>
                            <div className="h-12 border-b-2 border-neutral-700 print:border-black mb-2 flex items-end justify-center pb-2">
                                <span className="font-mono">{new Date().toLocaleDateString()}</span>
                            </div>
                            <p className="text-xs font-bold uppercase text-neutral-500 text-center">Date of Reset</p>
                        </div>
                    </div>
                </section>

                <div className="print:hidden flex flex-col items-center py-12 gap-6">
                    <p className="text-neutral-500 text-sm font-mono tracking-widest uppercase">After printing, shred or burn (safely) this document.</p>

                    <div className="flex items-center gap-4">
                        <Button
                            onClick={() => navigate(-1)}
                            variant="outline"
                            className="bg-transparent border-neutral-700 text-neutral-400 hover:text-white hover:border-white px-8 py-6 rounded-full font-bold tracking-widest"
                        >
                            GO BACK
                        </Button>

                        <Button
                            onClick={() => navigate('/dashboard/orientation')}
                            className="bg-amber-600 hover:bg-amber-700 text-black font-black py-6 px-12 rounded-full shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_50px_rgba(245,158,11,0.5)] transition-all transform hover:scale-105"
                        >
                            RITUAL COMPLETE
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
