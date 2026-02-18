
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, BookOpen, Sparkles, Filter, FileText, Download, X } from 'lucide-react'
import { ArticleCard } from '@/components/library/ArticleCard'
import { supabase } from '@/lib/supabase'
import { CreditCowChat } from '@/components/credit-lab/CreditCowChat'

// Fallback Data
const MOCK_ARTICLES = [
    {
        id: "fcra-protocol",
        title: "Understanding the FCRA (Protocol)",
        slug: "understanding-fcra-protocol",
        summary: "An interactive knowledge protocol detailing your rights under the Fair Credit Reporting Act.",
        pillar: "Foundations",
        readTime: 10,
        difficulty: "Freshman",
        author: "Credit U Faculty",
        isNew: true
    },
    {
        id: "1",
        title: "The 5 FICO Factors: Decoding the Algorithm",
        slug: "fico-5-factors",
        summary: "The specific breakdown of how payment history, utilization, age, mix, and inquiries impact your score.",
        pillar: "Foundations",
        readTime: 7,
        difficulty: "Freshman",
        author: "Dean Sterling",
        isNew: true
    },
    {
        id: "2",
        title: "The Metaphysics of a 609 Letter",
        slug: "609-reality",
        summary: "Why demanding 'physical verification' of debt works legally and psychologically against bureaus.",
        pillar: "Restoration",
        readTime: 12,
        difficulty: "Junior",
        author: "Nivla West"
    },
    {
        id: "3",
        title: "LLC Structuring for High-Net-Worth Protection",
        slug: "corporate-veil",
        summary: "How to organize your holding companies and operating entities to prevent piercing the corporate veil.",
        pillar: "Business",
        readTime: 15,
        difficulty: "Senior",
        author: "Corporate Counsel"
    },
    {
        id: "4",
        title: "The Psychology of Debt: Breaking the Chains",
        slug: "psychology-collection",
        summary: "Understanding the emotional triggers that keep you in the cycle of consumerism.",
        pillar: "Mindset",
        readTime: 6,
        difficulty: "Freshman",
        author: "Dr. Finance"
    },
    {
        id: "5",
        title: "Metro 2 Compliance: The Language of Bureaus",
        slug: "metro-2-compliance",
        summary: "Credit bureaus don't read English, they read Metro 2. Learn to spot data formatting errors.",
        pillar: "Foundations",
        readTime: 15,
        difficulty: "Senior",
        author: "Data Auditor"
    },
    {
        id: "6",
        title: "The 15/3 Payment Rule",
        slug: "15-3-rule",
        summary: "Manipulate your utilization reporting date to legally boost your score by 20-50 points in 30 days.",
        pillar: "Strategy",
        readTime: 5,
        difficulty: "Freshman",
        author: "Credit Hacker"
    },
    {
        id: "7",
        title: "FDCPA Mastery: Cease & Desist",
        slug: "fdcpa-cease-desist",
        summary: "How to stop collector harassment instantly using 15 U.S.C. § 1692c(c).",
        pillar: "Restoration",
        readTime: 8,
        difficulty: "Sophomore",
        author: "Legal Eagle"
    },
    {
        id: "8",
        title: "ChexSystems Removal Strategy",
        slug: "chexsystems-removal",
        summary: "Denied a checking account? Learn how to clean your banking report and re-enter the system.",
        pillar: "Restoration",
        readTime: 9,
        difficulty: "Junior",
        author: "Bank Insider"
    }
]

export default function LibraryHome({ initialTab = 'All' }: { initialTab?: string }) {
    const [searchQuery, setSearchQuery] = useState('')
    const [activeTab, setActiveTab] = useState(initialTab)
    const [articles, setArticles] = useState(MOCK_ARTICLES)
    const [showChat, setShowChat] = useState(false)

    useEffect(() => {
        // In the future, this will fetch directly from 'knowledge_articles'
        async function fetchLibrary() {
            const { data } = await supabase
                .from('knowledge_articles')
                .select('*')
                .eq('is_published', true)

            if (data && data.length > 0) {
                // Map DB schema to UI schema if needed
                const mapped = data.map(a => ({
                    id: a.id,
                    title: a.title,
                    slug: a.slug,
                    summary: a.summary || "",
                    pillar: a.pillar,
                    readTime: a.reading_time_minutes || 5,
                    difficulty: a.difficulty || "Freshman",
                    author: "CU Staff", // Placeholder until join
                    isNew: false
                }))
                setArticles(prev => {
                    // Dedup logic could go here, but simple merge for now
                    return [...MOCK_ARTICLES, ...mapped]
                })
            }
        }
        fetchLibrary()
    }, [])

    const filteredArticles = articles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.summary.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesTab = activeTab === 'All' || article.pillar === activeTab
        return matchesSearch && matchesTab
    })

    return (
        <div className="min-h-screen bg-[#020412] text-white p-6 md:p-12 relative">
            {/* Header / Search Area */}
            <div className="max-w-4xl mx-auto text-center mb-16 space-y-6">
                {/* ... header content ... */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/30 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-widest"
                >
                    <BookOpen className="w-3 h-3" /> The Great Library
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-6xl font-heading font-black tracking-tight"
                >
                    What do you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">know</span> today?
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative max-w-2xl mx-auto"
                >
                    <Search className="absolute left-4 top-4 w-5 h-5 text-slate-500" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for 'Inquiries', 'Funding', or 'Laws'..."
                        className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl text-lg placeholder:text-slate-600 focus:bg-white/10 transition-all shadow-[0_0_30px_rgba(79,70,229,0.1)] focus:shadow-[0_0_30px_rgba(79,70,229,0.2)]"
                    />
                    {/* Floating Particles (Decorative) */}
                    <div className="absolute -top-10 -right-10 w-20 h-20 bg-indigo-500/20 blur-xl rounded-full animate-pulse" />
                </motion.div>
            </div>

            {/* Featured Resource - Playbook */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="max-w-5xl mx-auto mb-16 relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950 border border-white/10 group cursor-pointer shadow-2xl"
            >
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="p-8 md:p-12 z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest mb-6">
                            <Sparkles className="w-3 h-3" /> Exclusive Resource
                        </div>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4 leading-tight">
                            The Credit U Playbook: <br />
                            <span className="text-slate-400">Blueprint to Sovereignty</span>
                        </h2>
                        <p className="text-slate-300 mb-8 leading-relaxed">
                            Unlock the foundational strategies used by the top 1% to leverage credit into capital. This essential guide covers structure, compliance, and funding velocity.
                        </p>
                        <Button className="bg-white text-slate-900 hover:bg-amber-400 hover:text-slate-900 font-bold px-8 h-12 rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                            Download Guide
                        </Button>
                    </div>
                    <div className="relative h-full min-h-[300px] md:min-h-[400px] bg-slate-800/50">
                        <div className="absolute inset-0 bg-indigo-500/20 mix-blend-color z-10 group-hover:bg-transparent transition-colors duration-500"></div>
                        <img
                            src="/assets/credit-playbook.png"
                            alt="Credit Playbook Cover"
                            className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-20"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-transparent z-20"></div>
                    </div>
                </div>
            </motion.div>

            {/* Navigation Pillars */}
            <div className="max-w-7xl mx-auto mb-16">
                <Tabs defaultValue="All" className="w-full" onValueChange={setActiveTab}>
                    {/* ... tabs content ... */}
                    <div className="flex justify-center mb-8">
                        <TabsList className="bg-white/5 border border-white/10 p-1 rounded-full h-auto flex-wrap justify-center">
                            {['All', 'Foundations', 'Restoration', 'Business', 'Mindset', 'Strategy', 'Templates'].map(tab => (
                                <TabsTrigger
                                    key={tab}
                                    value={tab}
                                    className="rounded-full px-6 py-2 text-sm font-medium data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all"
                                >
                                    {tab}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    <TabsContent value={activeTab} className="mt-0">
                        {activeTab === 'Templates' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
                                {[
                                    { title: "609 Dispute Letter Template", type: "DOCX", desc: "The standard verification demand letter." },
                                    { title: "Inquiry Removal Script", type: "PDF", desc: "Phone script for removing unauthorized inquiries." },
                                    { title: "Debt Validation Request", type: "DOCX", desc: "Force collectors to prove they own the debt." },
                                    { title: "Personal Financial Statement", type: "XLS", desc: "Excel template for banking applications." },
                                    { title: "ChexSystems Removal Letter", type: "PDF", desc: "Clear your banking history report." },
                                    { title: "Goodwill Adjustment Letter", type: "DOCX", desc: "Request late payment removal courteously." }
                                ].map((template, i) => (
                                    <div key={i} className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 hover:bg-white/10 transition-all cursor-pointer">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <span className="text-[10px] font-bold px-2 py-1 rounded bg-black/20 text-slate-400">{template.type}</span>
                                        </div>
                                        <h3 className="font-bold text-white text-lg mb-2">{template.title}</h3>
                                        <p className="text-slate-400 text-sm mb-4">{template.desc}</p>
                                        <Button variant="outline" className="w-full border-white/10 hover:bg-indigo-500 hover:text-white hover:border-indigo-500 group-hover:shadow-lg transition-all">
                                            <Download className="w-4 h-4 mr-2" /> Download Asset
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredArticles.map((article) => (
                                    <ArticleCard key={article.id} {...article} />
                                ))}
                            </div>
                        )}

                        {filteredArticles.length === 0 && activeTab !== 'Templates' && (
                            <div className="text-center py-20 opacity-50">
                                <Filter className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                                <p>No records found in the archives.</p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            {/* AI Call to Action */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="max-w-5xl mx-auto mt-20 p-8 rounded-3xl bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 text-center relative overflow-hidden"
            >
                <div className="relative z-10">
                    <div className="w-16 h-16 bg-indigo-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Can't find what you're looking for?</h2>
                    <p className="text-slate-300 max-w-xl mx-auto mb-8">
                        Our AI Research Assistant "Credit Cow" scans the entire 4,000-page federal code database to find specific answers.
                    </p>
                    <Button
                        onClick={() => setShowChat(true)}
                        className="bg-white text-indigo-900 hover:bg-slate-200 font-bold px-8 py-6 rounded-xl text-lg shadow-xl"
                    >
                        Ask Credit Cow
                    </Button>
                </div>
                {/* Background Glow */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.2),transparent_70%)] pointer-events-none" />
            </motion.div>

            {/* Chat Modal */}
            {showChat && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-2xl relative animate-in zoom-in-95 duration-200">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute -top-12 right-0 text-white hover:bg-white/10 rounded-full"
                            onClick={() => setShowChat(false)}
                        >
                            <X size={24} />
                        </Button>
                        <CreditCowChat />
                    </div>
                </div>
            )}
        </div>
    )
}
