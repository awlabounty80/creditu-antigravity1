import { useState, useMemo } from 'react';
import {
    FileText,
    Copy,
    Download,
    Search,
    FolderOpen,
    Star,
    Shield,
    Archive,
    Clock,
    Ghost,
    CreditCard,
    Gavel,
    Check,
    Eye
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { LETTER_TEMPLATES } from '@/data/letter-templates';

// ------------------------------------------------------------------
// CONFIGURATION
// ------------------------------------------------------------------
const CATEGORY_CONFIG = [
    { id: 'validation', name: 'Debt Validation', icon: Shield, color: 'text-amber-400' },
    { id: 'goodwill', name: 'Goodwill Adjustments', icon: Star, color: 'text-emerald-400' },
    { id: 'pfd', name: 'Pay For Delete', icon: CreditCard, color: 'text-indigo-400' },
    { id: 'inquiry', name: 'Inquiry Removal', icon: Eye, color: 'text-blue-400' },
    { id: 'medical', name: 'Medical Debt (HIPAA)', icon: Archive, color: 'text-red-400' },
    { id: 'id_theft', name: 'Identity Theft', icon: Shield, color: 'text-purple-400' },
    { id: 'bankruptcy', name: 'Bankruptcy', icon: Gavel, color: 'text-slate-400' },
    { id: 'late', name: 'Late Payments', icon: Clock, color: 'text-orange-400' },
    { id: 'collections', name: 'Zombie Debt', icon: Ghost, color: 'text-pink-400' },
];

export default function LetterLibrary() {
    const [activeCategory, setActiveCategory] = useState('validation');
    const [searchQuery, setSearchQuery] = useState('');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // Calculate Counts Dynamically
    const categoriesWithCount = useMemo(() => {
        return CATEGORY_CONFIG.map(cat => ({
            ...cat,
            count: LETTER_TEMPLATES.filter(t => t.category === cat.id).length
        }));
    }, []);

    // Filter Templates
    const filteredTemplates = useMemo(() => {
        let results = LETTER_TEMPLATES.filter(t => t.category === activeCategory);

        // Search Override (Search across ALL categories if query exists)
        if (searchQuery) {
            results = LETTER_TEMPLATES.filter(t =>
                t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.content.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        return results;
    }, [activeCategory, searchQuery]);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        toast.success("Template Copied to Clipboard");
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="min-h-screen bg-[#020412] text-white p-6 md:p-12 font-sans selection:bg-indigo-500/30">
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-900/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/10 pb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-white/10 rounded-xl border border-white/20">
                                <FileText className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-heading font-black bg-gradient-to-r from-slate-200 via-white to-slate-400 bg-clip-text text-transparent">
                                Letter Library
                            </h1>
                        </div>
                        <p className="text-slate-400 text-lg max-w-3xl">
                            The heavy artillery for credit repair. Access over 50+ attorney-drafted templates for debt validation, goodwill, and dispute resolution.
                        </p>
                    </div>
                </div>

                {/* Main Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar: Categories */}
                    <div className="space-y-4">
                        <div className="relative mb-6">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <Input
                                placeholder="Search all templates..."
                                className="pl-10 bg-white/5 border-white/10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1">
                            {categoriesWithCount.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => {
                                        setActiveCategory(cat.id);
                                        setSearchQuery(''); // Clear search on category click
                                    }}
                                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${activeCategory === cat.id && !searchQuery
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20'
                                            : 'bg-transparent text-slate-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <cat.icon className={`w-4 h-4 ${activeCategory === cat.id && !searchQuery ? 'text-white' : cat.color}`} />
                                        <span className="font-medium text-sm">{cat.name}</span>
                                    </div>
                                    {cat.count > 0 && (
                                        <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-white/70 min-w-[24px] text-center">
                                            {cat.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content: Templates */}
                    <div className="lg:col-span-3 space-y-6">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <FolderOpen className="w-6 h-6 text-indigo-400" />
                            {searchQuery ? `Search Results for "${searchQuery}"` : CATEGORY_CONFIG.find(c => c.id === activeCategory)?.name}
                        </h2>

                        <div className="grid gap-6 animate-in fade-in duration-500">
                            {filteredTemplates.map(template => (
                                <Card key={template.id} className="bg-[#0A0F1E] border-white/5 hover:border-indigo-500/20 transition-all group overflow-hidden">
                                    <div className="flex flex-col md:flex-row border-b border-white/5">
                                        <div className="p-6 flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors">
                                                    {template.title}
                                                </h3>
                                                <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-2 py-1 rounded border border-white/5">{template.id}</span>
                                            </div>
                                            <p className="text-sm text-slate-400 mb-4 leading-relaxed">{template.desc}</p>
                                        </div>
                                        <div className="border-t md:border-t-0 md:border-l border-white/5 p-4 flex md:flex-col gap-2 justify-center bg-black/20 shrink-0 min-w-[140px]">
                                            <Button
                                                size="sm"
                                                className={`w-full gap-2 border-none transition-all ${copiedId === template.id
                                                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                                    }`}
                                                onClick={() => handleCopy(template.content, template.id)}
                                            >
                                                {copiedId === template.id ? <Check size={14} /> : <Copy size={14} />}
                                                {copiedId === template.id ? 'Copied!' : 'Copy Text'}
                                            </Button>
                                            <Button size="sm" variant="ghost" className="w-full gap-2 text-slate-400 hover:text-white hover:bg-white/5">
                                                <Download size={14} /> Download
                                            </Button>
                                        </div>
                                    </div>
                                    <CardContent className="p-0 relative">
                                        <div className="bg-black/40 p-6 font-mono text-xs text-slate-400 whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto custom-scrollbar selection:bg-indigo-500/30 border-t border-white/5">
                                            {template.content}
                                        </div>
                                        {/* Gradient Fade for long content */}
                                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/80 to-transparent pointer-events-none md:hidden" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {filteredTemplates.length === 0 && (
                            <div className="text-center py-20 bg-white/5 rounded-xl border border-dashed border-white/10">
                                <Search className="w-12 h-12 mx-auto text-slate-600 mb-4" />
                                <h3 className="text-lg font-bold text-slate-400">No templates found</h3>
                                <p className="text-slate-500 text-sm">Try searching for "Validation" or "Goodwill"</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.02);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>
    );
}
