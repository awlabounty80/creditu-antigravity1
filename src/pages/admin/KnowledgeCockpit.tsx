import { useState, useEffect } from 'react'
import { Save, Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ReactMarkdown from 'react-markdown'

export default function KnowledgeCockpit() {
    const [articles, setArticles] = useState<any[]>([])

    const [editorMode, setEditorMode] = useState(false)
    const [currentArticle, setCurrentArticle] = useState<any>({})

    // Editor State
    const [title, setTitle] = useState('')
    const [slug, setSlug] = useState('')
    const [pillar, setPillar] = useState('Foundations')
    const [difficulty, setDifficulty] = useState('Freshman')
    const [summary, setSummary] = useState('')
    const [content, setContent] = useState('')
    // const [tags, setTags] = useState('')

    useEffect(() => {
        fetchInventory()
    }, [])

    async function fetchInventory() {
        // setLoading(true)
        const { data } = await supabase
            .from('knowledge_articles')
            .select('*')
            .order('created_at', { ascending: false })
        setArticles(data || [])
        // setLoading(false)
    }

    function handleEdit(article: any) {
        setCurrentArticle(article)
        setTitle(article.title)
        setSlug(article.slug)
        setPillar(article.pillar)
        setDifficulty(article.difficulty)
        setSummary(article.summary)
        setContent(article.content)
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

        if (error) {
            alert('Error saving: ' + error.message)
        } else {
            setEditorMode(false)
            fetchInventory()
        }
    }

    async function togglePublish(id: string, currentStatus: boolean) {
        await supabase.from('knowledge_articles').update({ is_published: !currentStatus }).eq('id', id)
        fetchInventory()
    }

    if (editorMode) {
        return (
            <div className="p-8 max-w-6xl mx-auto text-white">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold">{currentArticle.id ? 'Edit Module' : 'New Knowledge Module'}</h2>
                    <div className="flex gap-2">
                        <Button variant="ghost" onClick={() => setEditorMode(false)}>Cancel</Button>
                        <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-500"><Save className="w-4 h-4 mr-2" /> Save Article</Button>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-8">
                    {/* Metadata Column */}
                    <div className="col-span-1 space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-slate-500">Title</label>
                            <Input value={title} onChange={e => setTitle(e.target.value)} className="bg-white/5 border-white/10" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-slate-500">Slug (URL)</label>
                            <Input value={slug} onChange={e => setSlug(e.target.value)} className="bg-white/5 border-white/10 font-mono text-xs" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-slate-500">Pillar</label>
                                <select value={pillar} onChange={e => setPillar(e.target.value)} className="w-full bg-black border border-white/10 rounded-md p-2 text-sm">
                                    <option>Foundations</option>
                                    <option>Restoration</option>
                                    <option>Business</option>
                                    <option>Strategy</option>
                                    <option>Mindset</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-slate-500">Level</label>
                                <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="w-full bg-black border border-white/10 rounded-md p-2 text-sm">
                                    <option>Freshman</option>
                                    <option>Sophomore</option>
                                    <option>Junior</option>
                                    <option>Senior</option>
                                    <option>Graduate</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-slate-500">Summary (Meta)</label>
                            <Textarea value={summary} onChange={e => setSummary(e.target.value)} className="bg-white/5 border-white/10 h-32" />
                        </div>
                    </div>

                    {/* Content Column */}
                    <div className="col-span-2">
                        <Tabs defaultValue="writemode">
                            <TabsList className="bg-white/5 border-white/10 mb-4">
                                <TabsTrigger value="writemode">Write (Markdown)</TabsTrigger>
                                <TabsTrigger value="previewmode">Preview</TabsTrigger>
                            </TabsList>
                            <TabsContent value="writemode">
                                <Textarea
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                    className="bg-black/50 border-white/10 font-mono text-sm h-[600px] p-6 leading-relaxed"
                                    placeholder="# Write your masterpiece..."
                                />
                            </TabsContent>
                            <TabsContent value="previewmode">
                                <div className="h-[600px] overflow-y-auto bg-white/5 rounded-lg p-8 border border-white/10 prose prose-invert max-w-none">
                                    <ReactMarkdown>{content}</ReactMarkdown>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-8 text-white">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold font-heading">Knowledge Cockpit</h1>
                    <p className="text-slate-400">Manage the flow of information to the student body.</p>
                </div>
                <Button onClick={handleNew} className="bg-emerald-600 hover:bg-emerald-500">
                    <Plus className="w-4 h-4 mr-2" /> New Module
                </Button>
            </div>

            <div className="grid gap-4">
                {articles.map(article => (
                    <Card key={article.id} className="bg-[#0A0F1E] border-white/5 hover:border-indigo-500/30 transition-all">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`w-2 h-12 rounded-full ${article.is_published ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
                                <div>
                                    <h3 className="font-bold text-lg">{article.title}</h3>
                                    <div className="flex gap-2 mt-1">
                                        <Badge variant="outline" className="text-[10px]">{article.pillar}</Badge>
                                        <Badge variant="secondary" className="text-[10px]">{article.difficulty}</Badge>
                                        <span className="text-xs text-slate-500 flex items-center gap-1 ml-2">
                                            {article.slug}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className={article.is_published ? "text-emerald-400" : "text-slate-500"}
                                    onClick={() => togglePublish(article.id, article.is_published)}
                                >
                                    {article.is_published ? <CheckCircle className="w-4 h-4 mr-1" /> : <XCircle className="w-4 h-4 mr-1" />}
                                    {article.is_published ? "Published" : "Draft"}
                                </Button>
                                <Button size="icon" variant="outline" className="border-white/10" onClick={() => handleEdit(article)}>
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button size="icon" variant="destructive" onClick={async () => {
                                    if (confirm('Delete this article?')) {
                                        await supabase.from('knowledge_articles').delete().eq('id', article.id)
                                        fetchInventory()
                                    }
                                }}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
