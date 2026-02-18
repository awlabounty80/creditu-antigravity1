import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Lock, Clock, Calendar, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { AdvancedProfessorPlayer } from '@/components/dashboard/AdvancedProfessorPlayer';
import { useGamification } from '@/hooks/useGamification';
import { cn } from '@/lib/utils';

export interface EBookMetadata {
    title: string;
    program: string;
    series: string;
    attribution: string;
    readTime: string;
    reward: number;
    status: string;
    date: string;
}

export type EBookBlock =
    | { type: 'hero'; id: string }
    | { type: 'section'; id: string; title: string; content: string; checkpoint?: string }
    | { type: 'video'; id: string; voiceScript: string; visualDesc?: string }
    | { type: 'table'; id: string; title: string; headers: string[]; rows: string[][]; checkpoint?: string }
    | { type: 'process'; id: string; title: string; steps: string[]; checkpoint?: string }
    | { type: 'action_items'; id: string; items: string[] };

interface InteractiveEBookProps {
    metadata: EBookMetadata;
    blocks: EBookBlock[];
    onComplete?: () => void;
}

export function InteractiveEBook({ metadata, blocks, onComplete }: InteractiveEBookProps) {
    const { awardPoints } = useGamification();
    const [completedCheckpoints, setCompletedCheckpoints] = useState<Set<string>>(new Set());
    const [visibleBlocks, setVisibleBlocks] = useState<number>(1);
    const [isFullyCompleted, setIsFullyCompleted] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Progression Logic: Check if the current block's checkpoint is met to show the next
    useEffect(() => {
        const lastVisibleBlock = blocks[visibleBlocks - 1];
        if (!lastVisibleBlock) return;

        let isGated = false;

        // If the current block has a checkpoint OR IS a checkpoint-type logic
        if ('checkpoint' in lastVisibleBlock && lastVisibleBlock.checkpoint) {
            if (!completedCheckpoints.has(lastVisibleBlock.id)) {
                isGated = true;
            }
        }

        if (lastVisibleBlock.type === 'action_items') {
            // Completion is handled by the final button
            isGated = true;
        }

        if (!isGated && visibleBlocks < blocks.length) {
            // Auto-advance if not gated
            const timeout = setTimeout(() => {
                setVisibleBlocks(prev => prev + 1);
            }, 300);
            return () => clearTimeout(timeout);
        }
    }, [completedCheckpoints, visibleBlocks, blocks]);

    const handleCheckpoint = (blockId: string) => {
        setCompletedCheckpoints(prev => {
            const next = new Set(prev);
            next.add(blockId);
            return next;
        });
    };

    const handleFinalCompletion = () => {
        if (isFullyCompleted) return;
        setIsFullyCompleted(true);
        awardPoints(metadata.reward, `Completed eBook: ${metadata.title}`);
        if (onComplete) onComplete();
    };

    return (
        <div className="space-y-12 pb-32 max-w-4xl mx-auto scroll-smooth" ref={scrollRef}>
            {blocks.slice(0, visibleBlocks).map((block) => (
                <motion.div
                    key={block.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {renderBlock(block, metadata, completedCheckpoints, handleCheckpoint, handleFinalCompletion, isFullyCompleted)}
                </motion.div>
            ))}

            {/* Gated Indicator */}
            {visibleBlocks < blocks.length && (
                <div className="flex flex-col items-center py-10 opacity-50">
                    <Lock className="w-8 h-8 text-slate-700 mb-2" />
                    <p className="text-xs font-mono text-slate-600 uppercase tracking-widest">Complete checkpoint above to unlock more knowledge</p>
                </div>
            )}
        </div>
    );
}

function renderBlock(
    block: EBookBlock,
    metadata: EBookMetadata,
    completedCheckpoints: Set<string>,
    onCheckpoint: (id: string) => void,
    onFinalComplete: () => void,
    isFullyCompleted: boolean
) {
    switch (block.type) {
        case 'hero':
            return (
                <div className="mb-16 border-b border-white/5 pb-12">
                    <div className="flex gap-4 mb-8">
                        <Badge variant="outline" className="text-indigo-400 border-indigo-500/30 uppercase tracking-[0.2em] text-[10px] px-3 py-1">
                            {metadata.program}
                        </Badge>
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                            <Clock className="w-3 h-3" /> {metadata.readTime}
                        </div>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-heading font-black text-white mb-8 leading-[0.9] tracking-tighter">
                        {metadata.title}
                    </h1>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center font-bold text-indigo-400">
                                {metadata.attribution.charAt(0)}
                            </div>
                            <div>
                                <div className="text-sm font-bold text-white">{metadata.attribution}</div>
                                <div className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                                    <Calendar className="w-3 h-3" /> {metadata.date}
                                </div>
                            </div>
                        </div>
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 uppercase tracking-widest text-[10px]">
                            {metadata.status}
                        </Badge>
                    </div>
                </div>
            );

        case 'section':
            return (
                <div className="space-y-6">
                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-white flex items-center gap-3">
                        <div className="w-1.5 h-8 bg-indigo-500 rounded-full" />
                        {block.title}
                    </h2>
                    <div className="prose prose-invert prose-lg max-w-none text-slate-300 leading-relaxed font-sans font-light">
                        {block.content.split('\n').map((para, i) => para.trim() ? <p key={i}>{para}</p> : null)}
                    </div>
                    {block.checkpoint && (
                        <Checkpoint
                            id={block.id}
                            text={block.checkpoint}
                            isCompleted={completedCheckpoints.has(block.id)}
                            onComplete={() => onCheckpoint(block.id)}
                        />
                    )}
                </div>
            );

        case 'video':
            return (
                <div className="my-16 group">
                    <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-3xl bg-black aspect-video">
                        <AdvancedProfessorPlayer
                            transcript={block.voiceScript}
                        />
                    </div>
                    {block.visualDesc && (
                        <p className="mt-4 text-[10px] text-slate-600 font-mono uppercase tracking-widest text-center">Visual Uplink: {block.visualDesc}</p>
                    )}
                </div>
            );

        case 'table':
            return (
                <div className="space-y-6 my-12">
                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-white">{block.title}</h2>
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                        <table className="w-full text-left">
                            <thead className="bg-white/10 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <tr>
                                    {block.headers.map((h, i) => <th key={i} className="px-6 py-4">{h}</th>)}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm text-slate-300">
                                {block.rows.map((row, ri) => (
                                    <tr key={ri} className="hover:bg-white/5 transition-colors">
                                        {row.map((cell, ci) => <td key={ci} className="px-6 py-4 font-medium">{cell}</td>)}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {block.checkpoint && (
                        <Checkpoint
                            id={block.id}
                            text={block.checkpoint}
                            isCompleted={completedCheckpoints.has(block.id)}
                            onComplete={() => onCheckpoint(block.id)}
                        />
                    )}
                </div>
            );

        case 'process':
            return (
                <div className="space-y-8 my-16">
                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-white">{block.title}</h2>
                    <div className="relative space-y-4">
                        <div className="absolute left-6 top-4 bottom-4 w-px bg-indigo-500/20" />
                        {block.steps.map((step, i) => (
                            <div key={i} className="flex gap-6 relative">
                                <div className="w-12 h-12 rounded-full bg-slate-900 border border-indigo-500/30 flex items-center justify-center font-bold text-white text-sm shrink-0 z-10 shadow-lg shadow-indigo-500/10">
                                    {i + 1}
                                </div>
                                <div className="pt-3 text-lg text-slate-300 font-medium">
                                    {step}
                                </div>
                            </div>
                        ))}
                    </div>
                    {block.checkpoint && (
                        <Checkpoint
                            id={block.id}
                            text={block.checkpoint}
                            isCompleted={completedCheckpoints.has(block.id)}
                            onComplete={() => onCheckpoint(block.id)}
                        />
                    )}
                </div>
            );

        case 'action_items':
            return (
                <div className="mt-24 p-10 bg-[#0A0F1E] border border-indigo-500/30 rounded-[2.5rem] shadow-[0_0_100px_rgba(79,70,229,0.1)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-24 bg-indigo-500/5 rounded-full blur-3xl -mr-12 -mt-12" />

                    <div className="relative z-10 space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-500 rounded-2xl shadow-lg shadow-indigo-500/40">
                                <CheckSquare className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">Credit U Action Items</h3>
                                <p className="text-sm text-slate-500">Execute the protocol to finalize transmission</p>
                            </div>
                        </div>

                        <div className="space-y-4 bg-black/40 p-6 rounded-2xl border border-white/5">
                            {block.items.map((item, i) => (
                                <div key={i} className="flex items-center gap-4 text-slate-300">
                                    <Checkbox id={`check-${i}`} className="border-indigo-500/50 data-[state=checked]:bg-indigo-600" />
                                    <label htmlFor={`check-${i}`} className="text-sm font-medium cursor-pointer">{item}</label>
                                </div>
                            ))}
                        </div>

                        {!isFullyCompleted ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-slate-500">
                                    <span>Reward Tier</span>
                                    <span className="text-amber-500">+{metadata.reward} Moo Points</span>
                                </div>
                                <Button
                                    onClick={onFinalComplete}
                                    className="w-full h-16 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xl tracking-tight rounded-2xl shadow-xl shadow-emerald-900/20"
                                >
                                    MARK AS COMPLETED
                                </Button>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center gap-4 text-emerald-400"
                            >
                                <CheckCircle2 className="w-8 h-8" />
                                <div>
                                    <div className="text-lg font-black uppercase tracking-tighter leading-none">Protocol Successfully Mastered</div>
                                    <div className="text-xs font-mono opacity-80 mt-1">Foundations Module: Complete • Moo Points Synchronized</div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            );

        default:
            return null;
    }
}

interface CheckpointProps {
    id: string;
    text: string;
    isCompleted: boolean;
    onComplete: () => void;
}

function Checkpoint({ text, isCompleted, onComplete }: CheckpointProps) {
    return (
        <div
            className={cn(
                "p-6 rounded-2xl border transition-all duration-500 flex items-center justify-between group",
                isCompleted
                    ? "bg-indigo-500/10 border-indigo-500/30"
                    : "bg-white/5 border-white/10 hover:border-indigo-500/30 cursor-pointer"
            )}
            onClick={() => !isCompleted && onCheckpointInternal()}
        >
            <div className="flex items-center gap-4">
                <div className={cn(
                    "w-6 h-6 rounded-md border flex items-center justify-center transition-all",
                    isCompleted ? "bg-indigo-600 border-indigo-400 text-white" : "border-slate-700 group-hover:border-indigo-400"
                )}>
                    {isCompleted && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><CheckCircle2 className="w-4 h-4" /></motion.div>}
                </div>
                <span className={cn("text-sm font-bold tracking-tight", isCompleted ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200")}>
                    {text}
                </span>
            </div>

            {!isCompleted && (
                <div className="text-[10px] font-mono font-black text-indigo-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    Verify Signal
                </div>
            )}
        </div>
    );

    function onCheckpointInternal() {
        onComplete();
    }
}
