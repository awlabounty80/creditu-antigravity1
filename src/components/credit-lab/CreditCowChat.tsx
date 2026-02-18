
import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, ExternalLink, Sparkles, BookOpen, Bot } from 'lucide-react'
import { toast } from 'sonner'
import { searchKnowledgeBase, generateCowResponse, SearchResult } from '@/lib/knowledge-search'
import { Link } from 'react-router-dom'

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    sources?: SearchResult[]
}

export function CreditCowChat() {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'assistant', content: "Moo! I'm Credit Cow. I have access to the entire Credit University library. What do you need to know?" }
    ])
    const [input, setInput] = useState('')
    const [status, setStatus] = useState<'idle' | 'searching' | 'thinking'>('idle')
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, status])

    const handleSend = async () => {
        if (!input.trim()) return

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input }
        setMessages(prev => [...prev, userMsg])
        const currentInput = input;
        setInput('')
        setStatus('searching')

        try {
            // 1. RAG STEP: Search Knowledge Base
            const sources = await searchKnowledgeBase(currentInput)

            setStatus('thinking')

            // 2. GENERATION STEP: Call LLM (or Simulator)
            const apiKey = localStorage.getItem('openai_key')
            let aiContent = "";

            if (apiKey) {
                // REAL AI MODE
                const contextBlock = sources.map(s => `Title: ${s.title}\nContent: ${s.content}`).join('\n\n')

                const res = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
                    body: JSON.stringify({
                        model: 'gpt-4o-mini',
                        messages: [
                            { role: 'system', content: `You are Credit Cow, the AI mascot of Credit University. Answer the user based on the following CONTEXT from our knowledge base. If the answer isn't in the context, say so, but offer general advice. \n\nCONTEXT:\n${contextBlock}` },
                            ...messages.slice(-5).map(m => ({ role: m.role, content: m.content })),
                            { role: 'user', content: currentInput }
                        ],
                        temperature: 0.5
                    })
                })
                const data = await res.json()
                if (data.error) throw new Error(data.error.message)
                aiContent = data.choices[0].message.content
            } else {
                // SIMULATOR MODE (No Key)
                aiContent = await generateCowResponse(currentInput, sources)
            }

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: aiContent,
                sources: sources
            }
            setMessages(prev => [...prev, aiMsg])

        } catch (e: any) {
            console.error(e)
            toast.error("Brain Freeze!", { description: e.message })
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: `⚠️ Brain Freeze: ${e.message}.` }])
        } finally {
            setStatus('idle')
        }
    }

    return (
        <div className="flex flex-col h-[600px] w-full bg-[#0A0F1E] rounded-xl border border-white/10 overflow-hidden relative">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-indigo-900 to-slate-900 border-b border-white/10 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                        <span className="text-2xl">🐮</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-white">Credit Cow AI</h3>
                        <p className="text-xs text-indigo-300 flex items-center gap-1">
                            <Sparkles size={10} /> Knowledge Base Linked
                        </p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-6" ref={scrollRef}>
                {messages.map(m => (
                    <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[85%] p-4 rounded-2xl ${m.role === 'user'
                            ? 'bg-indigo-600 text-white rounded-tr-none'
                            : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'
                            }`}>

                            {/* Message Content */}
                            <div className="prose prose-invert prose-sm max-w-none leading-relaxed whitespace-pre-wrap">
                                {m.content}
                            </div>

                            {/* Citations / Sources */}
                            {m.sources && m.sources.length > 0 && (
                                <div className="mt-4 pt-3 border-t border-white/10">
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                                        <BookOpen className="w-3 h-3" /> Sources Consulted
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {m.sources.map(source => (
                                            <Link
                                                key={source.id}
                                                to={`/dashboard/library/article/${source.slug}`}
                                                className="block"
                                            >
                                                <div className="px-3 py-1.5 rounded bg-black/40 border border-white/5 hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all flex items-center gap-2 cursor-pointer group">
                                                    <span className="text-xs text-indigo-300 truncate max-w-[150px] group-hover:text-indigo-200">{source.title}</span>
                                                    <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-indigo-400" />
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {/* Status Indicator */}
                {status !== 'idle' && (
                    <div className="flex justify-start">
                        <div className="bg-white/5 text-slate-400 p-3 rounded-2xl rounded-tl-none text-xs flex items-center gap-2 animate-pulse">
                            <Bot className="w-3 h-3" />
                            {status === 'searching' ? "Scanning Archives..." : "Synthesizing Answer..."}
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-black/40 backdrop-blur-sm shrink-0">
                <div className="flex gap-2">
                    <Input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                        placeholder="Ask about dispute letters, laws, or credit factors..."
                        className="bg-white/5 border-white/10 text-white focus-visible:ring-indigo-500 h-11"
                        autoFocus
                    />
                    <Button onClick={handleSend} disabled={status !== 'idle' || !input.trim()} className="bg-indigo-600 hover:bg-indigo-500 h-11 w-11 p-0">
                        <Send size={18} />
                    </Button>
                </div>
            </div>
        </div>
    )
}
