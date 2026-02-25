import React, { useEffect, useState } from 'react';
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
    Zap, FileText, Trophy, CreditCard, Wallet, Users, Lock, Crown,
    Flame, Award, Table, Book, PieChart, Headphones, Sun, Clock, Ticket, Shield, Cpu, Activity
} from "lucide-react";
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';

// --- TYPES ---

interface StoreItem {
    id: string;
    title: string;
    description: string;
    section: string;
    cost: number;
    icon_slug: string;
    is_owned?: boolean;
}

// --- ICON MAPPING ---

const IconMap: Record<string, any> = {
    Zap, FileText, Trophy, CreditCard, Wallet, Users, Lock, Crown,
    Flame, Award, Table, Book, PieChart, Headphones, Sun, Clock, Ticket, Shield, Cpu, Activity
};

const SectionColors: Record<string, string> = {
    'CREDIT_POWER_TOOLS': 'text-cyan-400 border-cyan-500/30 bg-cyan-950/20',
    'ACCESS_AND_AUTHORITY': 'text-purple-400 border-purple-500/30 bg-purple-950/20',
    'IDENTITY_AND_STATUS': 'text-amber-400 border-amber-500/30 bg-amber-950/20',
    'DIGITAL_GOODS': 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20',
    'SPIRITUAL_AND_MINDSET': 'text-rose-400 border-rose-500/30 bg-rose-950/20',
    'REAL_WORLD': 'text-blue-400 border-blue-500/30 bg-blue-950/20',
};

// --- COMPONENT ---

export const CreditUExchange = () => {
    const { user, profile, refreshProfile } = useAuth();
    const [items, setItems] = useState<StoreItem[]>([]);
    const [inventory, setInventory] = useState<Set<string>>(new Set());
    const [purchasing, setPurchasing] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const mooBalance = profile?.moo_points || 0;

    useEffect(() => {
        if (user) {
            loadStore();
            loadInventory();
        }
    }, [user]);

    async function loadStore() {
        const { data } = await supabase.from('moo_store_items').select('*').eq('is_published', true).order('cost', { ascending: true });
        if (data) setItems(data);
        setLoading(false);
    }

    async function loadInventory() {
        if (!user) return;
        const { data } = await supabase.from('student_inventory').select('item_id').eq('user_id', user.id);
        if (data) {
            setInventory(new Set(data.map(i => i.item_id)));
        }
    }

    const handlePurchase = async (item: StoreItem) => {
        if (mooBalance < item.cost) {
            alert("Insufficient Moo Points. Discipline required.");
            return;
        }

        setPurchasing(item.id);

        try {
            const { data, error } = await supabase.rpc('purchase_moo_item', { p_item_id: item.id });

            if (error) throw error;

            if (data && data.success) {
                // Calm Celebration
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#ffffff', '#10b981', '#fbbf24'],
                    ticks: 200,
                    gravity: 0.8,
                    scalar: 0.8
                });

                await refreshProfile(); // Update balance
                await loadInventory(); // Mark as owned
            } else {
                alert(data?.message || "Transaction failed.");
            }

        } catch (err) {
            console.error(err);
            alert("Error processing transaction.");
        } finally {
            setPurchasing(null);
        }
    };

    // Group items by section
    const groupedItems = items.reduce((acc, item) => {
        if (!acc[item.section]) acc[item.section] = [];
        acc[item.section].push(item);
        return acc;
    }, {} as Record<string, StoreItem[]>);

    const sectionsOrder = [
        'CREDIT_POWER_TOOLS',
        'ACCESS_AND_AUTHORITY',
        'IDENTITY_AND_STATUS',
        'DIGITAL_GOODS',
        'SPIRITUAL_AND_MINDSET',
        'REAL_WORLD'
    ];

    if (loading) return <div className="p-20 text-center text-gray-500">Initializing Exchange...</div>;

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans pb-20">
            <div className="container py-12 max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16 border-b border-white/5 pb-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-[10px] font-bold tracking-[0.25em] uppercase">
                            <CreditCard className="h-3 w-3 fill-current" /> The Moo Store™
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter text-white">
                            Sovereign <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Exchange</span>
                        </h1>
                        <p className="text-gray-400 max-w-xl text-lg font-light">
                            Convert discipline into access. Moo Points are not money—they are proof of alignment.
                        </p>
                    </div>

                    <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl flex items-center gap-6 min-w-[280px]">
                        <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
                            <Wallet className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1">Current Alignment</div>
                            <div className="text-4xl font-black text-white tracking-tight leading-none">
                                {mooBalance.toLocaleString()} <span className="text-sm font-bold text-emerald-500 align-top">MP</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sections */}
                <div className="space-y-20">
                    {sectionsOrder.map((sectionKey) => {
                        const sectionItems = groupedItems[sectionKey] || [];
                        if (sectionItems.length === 0) return null;

                        const colorClass = SectionColors[sectionKey] || 'text-white border-white/20';
                        const displayTitle = sectionKey.replace(/_/g, ' ');

                        return (
                            <div key={sectionKey} className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-2xl font-bold tracking-tight text-gray-200 uppercase">{displayTitle}</h2>
                                    <div className="h-px bg-white/10 flex-1"></div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {sectionItems.map((item) => {
                                        const Icon = IconMap[item.icon_slug] || Zap;
                                        const isOwned = inventory.has(item.id);
                                        const canAfford = mooBalance >= item.cost;

                                        return (
                                            <motion.div
                                                key={item.id}
                                                whileHover={{ y: -4 }}
                                                className={`relative group bg-zinc-900/40 border border-zinc-800 rounded-xl overflow-hidden backdrop-blur-sm transition-all
                                                    ${isOwned ? 'opacity-70 grayscale-[0.5]' : ''}
                                                `}
                                            >
                                                <div className="p-6 space-y-4">
                                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center border bg-opacity-20 ${colorClass}`}>
                                                        <Icon className="h-6 w-6" />
                                                    </div>

                                                    <div>
                                                        <h3 className="text-lg font-bold text-gray-100 group-hover:text-emerald-400 transition-colors">{item.title}</h3>
                                                        <p className="text-sm text-gray-500 leading-relaxed mt-2 min-h-[40px]">{item.description}</p>
                                                    </div>

                                                    <div className="pt-4 flex items-center justify-between border-t border-white/5">
                                                        <div className="text-sm font-bold text-gray-300">
                                                            {item.cost === 0 ? 'FREE' : `${item.cost.toLocaleString()} MP`}
                                                        </div>

                                                        {isOwned ? (
                                                            <Button size="sm" variant="ghost" className="text-emerald-500 font-bold hover:text-emerald-400 hover:bg-emerald-950/30" disabled>
                                                                Acquired
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                size="sm"
                                                                className={`font-bold transition-all ${canAfford ? 'bg-white text-black hover:bg-emerald-400' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}`}
                                                                onClick={() => handlePurchase(item)}
                                                                disabled={!canAfford || purchasing === item.id}
                                                            >
                                                                {purchasing === item.id ? "Processing..." : canAfford ? "Exchange" : "Locked"}
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                                {/* Hover Glow */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
};
