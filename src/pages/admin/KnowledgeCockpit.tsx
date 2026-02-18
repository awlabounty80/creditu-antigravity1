
import { useState, useEffect } from 'react'
import { Save, Plus, Edit, Trash2, CheckCircle, XCircle, Sparkles, Layout, Bot, ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ReactMarkdown from 'react-markdown'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function KnowledgeCockpit() {
    const [articles, setArticles] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const [editorMode, setEditorMode] = useState(false)
    const [currentArticle, setCurrentArticle] = useState<any>({})

    // Editor State
    const [title, setTitle] = useState('')
    const [slug, setSlug] = useState('')
    const [pillar, setPillar] = useState('Foundations')
    const [difficulty, setDifficulty] = useState('Freshman')
    const [summary, setSummary] = useState('')
    const [content, setContent] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [aiThinking, setAiThinking] = useState(false)

    useEffect(() => {
        fetchInventory()
    }, [])

    async function fetchInventory() {
        setLoading(true)
        const { data } = await supabase
            .from('knowledge_articles')
            .select('*')
            .order('created_at', { ascending: false })
        setArticles(data || [])
        setLoading(false)
    }

    function handleEdit(article: any) {
        setCurrentArticle(article)
        setTitle(article.title)
        setSlug(article.slug)
        setPillar(article.pillar)
        setDifficulty(article.difficulty)
        setSummary(article.summary)
        setContent(article.content || '')
        setEditorMode(true)
    }

    function handleNew() {
        setCurrentArticle({})
        setTitle('')
        setSlug('')
        setPillar('Foundations')
        setDifficulty('Freshman')
        setSummary('')
        setContent('')
        setEditorMode(true)
    }

    async function handleSave() {
        setIsSaving(true)
        const payload = {
            title,
            slug: slug || title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
            pillar,
            difficulty,
            summary,
            content,
            updated_at: new Date()
        }

        let error;
        if (currentArticle.id) {
            const res = await supabase.from('knowledge_articles').update(payload).eq('id', currentArticle.id)
            error = res.error
        } else {
            const res = await supabase.from('knowledge_articles').insert([payload])
            error = res.error
        }

        setIsSaving(false)

        if (error) {
            alert('Error saving: ' + error.message)
        } else {
            setEditorMode(false)
            fetchInventory()
        }
    }

    async function togglePublish(id: string, currentStatus: boolean) {
        await supabase.from('knowledge_articles').update({ is_published: !currentStatus }).eq('id', id)
        // Optimistic update
        setArticles(prev => prev.map(a => a.id === id ? { ...a, is_published: !currentStatus } : a))
    }

    async function generateOutline() {
        if (!title) return alert("Please enter a title first.")
        setAiThinking(true)
        // Mock AI generation for now - would connect to edge function later
        setTimeout(() => {
            const outline = `
## Introduction
Start with a hook about ${title}.

## The Core Concept
Explain what this is in simple terms.

## Why It Matters
- Benefit 1
- Benefit 2
- Risk of ignoring this

## The Strategy
1. Step One
2. Step Two
3. Step Three

## Common Pitfalls
What to avoid.

## Conclusion
Wrap it up with an action item.
            `
            setContent(prev => prev ? prev + "\n" + outline : outline)
            setAiThinking(false)
        }, 1500)
    }

    if (editorMode) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 max-w-[1600px] mx-auto text-white h-[calc(100vh-80px)] overflow-hidden flex flex-col"
            >
                <div className="flex justify-between items-center mb-6 shrink-0">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => setEditorMode(false)} className="text-slate-400 hover:text-white">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <h2 className="text-2xl font-bold font-heading">{currentArticle.id ? 'Edit Module' : 'New Knowledge Module'}</h2>
                        {currentArticle.id && <Badge variant="outline" className="font-mono text-xs">{currentArticle.id}</Badge>}
                    </div>
                    <div className="flex gap-2">
                        <div className="flex items-center gap-2 mr-4 text-xs text-slate-500">
                            {isSaving && <span className="animate-pulse text-indigo-400">Saving to Cloud...</span>}
                        </div>
                        <Button variant="outline" onClick={() => setEditorMode(false)} className="border-white/10">Discard</Button>
                        <Button onClick={handleSave} disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-500 min-w-[140px]">
                            {isSaving ? <Sparkles className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            Save Article
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-6 h-full overflow-hidden">
                    {/* Metadata Column (Left) */}
                    <div className="col-span-3 space-y-6 overflow-y-auto pr-2 pb-20">
                        <Card className="bg-[#0A0F1E] border-white/10">
                            <CardContent className="p-4 space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Title</label>
                                    <Input
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        className="bg-black/40 border-white/10 font-bold"
                                        placeholder="Enter article title..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Slug (URL)</label>
                                    <Input
                                        value={slug}
                                        onChange={e => setSlug(e.target.value)}
                                        className="bg-black/40 border-white/10 font-mono text-[10px] text-indigo-300"
                                        placeholder="auto-generated-slug"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Pillar</label>
                                        <select value={pillar} onChange={e => setPillar(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-md p-2 text-xs text-white focus:outline-none focus:border-indigo-500">
                                            <option className="bg-slate-900 text-white">Foundations</option>
                                            <option className="bg-slate-900 text-white">Restoration</option>
                                            <option className="bg-slate-900 text-white">Business</option>
                                            <option className="bg-slate-900 text-white">Strategy</option>
                                            <option className="bg-slate-900 text-white">Mindset</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Level</label>
                                        <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-md p-2 text-xs text-white focus:outline-none focus:border-indigo-500">
                                            <option className="bg-slate-900 text-white">Freshman</option>
                                            <option className="bg-slate-900 text-white">Sophomore</option>
                                            <option className="bg-slate-900 text-white">Junior</option>
                                            <option className="bg-slate-900 text-white">Senior</option>
                                            <option className="bg-slate-900 text-white">Graduate</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Summary (Meta Description)</label>
                                    <Textarea
                                        value={summary}
                                        onChange={e => setSummary(e.target.value)}
                                        className="bg-black/40 border-white/10 h-32 text-xs leading-relaxed resize-none"
                                        placeholder="Brief summary for search results..."
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* AI Helper Card */}
                        <Card className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-indigo-500/20">
                            <CardContent className="p-4 space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Bot className="w-4 h-4 text-indigo-400" />
                                    <span className="text-xs font-bold text-indigo-200">Credit Cow Assistant</span>
                                </div>
                                <Button
                                    onClick={generateOutline}
                                    disabled={aiThinking}
                                    variant="secondary"
                                    className="w-full text-xs h-8 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20"
                                >
                                    {aiThinking ? <Sparkles className="w-3 h-3 animate-spin mr-2" /> : <Layout className="w-3 h-3 mr-2" />}
                                    Generate Outline
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Editor Column (Center/Right) */}
                    <div className="col-span-9 h-[calc(100vh-140px)]">
                        <Tabs defaultValue="writemode" className="h-full flex flex-col">
                            <div className="flex justify-between items-center mb-4 shrink-0">
                                <TabsList className="bg-white/5 border border-white/10">
                                    <TabsTrigger value="writemode" className="data-[state=active]:bg-indigo-600">Write (Markdown)</TabsTrigger>
                                    <TabsTrigger value="previewmode">Live Preview</TabsTrigger>
                                </TabsList>
                                <span className="text-[10px] text-slate-500 font-mono">Markdown Supported</span>
                            </div>

                            <TabsContent value="writemode" className="flex-1 mt-0 relative group">
                                <Textarea
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                    className="bg-[#050b14] border-white/10 font-mono text-sm h-full p-8 leading-relaxed resize-none focus:ring-0 focus:border-indigo-500/50 transition-colors"
                                    placeholder="# Write your masterpiece..."
                                />
                                {/* Floating Toolbar Hint */}
                                <div className="absolute bottom-4 right-4 text-[10px] text-slate-600 bg-black/40 px-2 py-1 rounded border border-white/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                                    Cmd+S to Save
                                </div>
                            </TabsContent>

                            <TabsContent value="previewmode" className="flex-1 mt-0 bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                                <div className="h-full overflow-y-auto p-12 prose prose-invert max-w-none prose-headings:font-heading prose-headings:font-bold prose-p:text-slate-300 prose-blockquote:border-l-indigo-500 prose-blockquote:bg-white/5 prose-blockquote:p-4 prose-blockquote:not-italic w-full">
                                    <ReactMarkdown>{content}</ReactMarkdown>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </motion.div>
        )
    }

    return (
        <div className="p-8 text-white min-h-screen bg-[#020412]">
            <div className="flex justify-between items-end mb-10 border-b border-white/5 pb-8">
                <div>
                    <h1 className="text-4xl font-black font-heading tracking-tight mb-2">Knowledge Cockpit</h1>
                    <p className="text-slate-400">Manage the flow of information to the student body.</p>
                </div>
                <Button onClick={handleNew} size="lg" className="bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-900/20">
                    <Plus className="w-5 h-5 mr-2" /> New Module
                </Button>
            </div>

            {loading ? (
                <div className="grid gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-white/5 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid gap-4">
                    {articles.length === 0 && (
                        <div className="text-center py-20 bg-white/5 rounded-xl border border-dashed border-white/10">
                            <p className="text-slate-500">No knowledge modules found.</p>
                            <Button variant="link" onClick={handleNew}>Create the first one</Button>
                        </div>
                    )}

                    <AnimatePresence>
                        {articles.map(article => (
                            <motion.div
                                key={article.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <Card className="bg-[#0A0F1E] border-white/5 hover:border-indigo-500/30 transition-all group shadow-sm hover:shadow-lg hover:shadow-indigo-500/5">
                                    <CardContent className="p-5 flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <div className={cn(
                                                "w-1 h-12 rounded-full transition-all duration-500",
                                                article.is_published
                                                    ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                                    : "bg-slate-700"
                                            )} />
                                            <div>
                                                <h3 className="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors">{article.title}</h3>
                                                <div className="flex gap-2 mt-1.5 items-center">
                                                    <Badge variant="outline" className="text-[10px] border-white/10 text-slate-400">{article.pillar}</Badge>
                                                    <div className="w-1 h-1 rounded-full bg-slate-700" />
                                                    <span className="text-xs text-slate-500 font-mono">
                                                        /{article.slug}
                                                    </span>
                                                    <div className="w-1 h-1 rounded-full bg-slate-700" />
                                                    <span className="text-[10px] text-slate-600 uppercase tracking-wider">
                                                        {new Date(article.updated_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className={cn(
                                                    "transition-colors",
                                                    article.is_published
                                                        ? "text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20"
                                                        : "text-amber-500 bg-amber-500/10 hover:bg-amber-500/20"
                                                )}
                                                onClick={() => togglePublish(article.id, article.is_published)}
                                            >
                                                {article.is_published ? <CheckCircle className="w-4 h-4 mr-2" /> : <XCircle className="w-4 h-4 mr-2" />}
                                                {article.is_published ? "Live" : "Draft"}
                                            </Button>
                                            <Button size="icon" variant="outline" className="border-white/10 hover:bg-white/5" onClick={() => handleEdit(article)}>
                                                <Edit className="w-4 h-4 text-slate-300" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="text-red-400/50 hover:text-red-400 hover:bg-red-900/20" onClick={async () => {
                                                if (confirm('Delete this article? This cannot be undone.')) {
                                                    await supabase.from('knowledge_articles').delete().eq('id', article.id)
                                                    fetchInventory()
                                                }
                                            }}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    )
}
