import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, ExternalLink, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
}

export function CreditCowChat() {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'assistant', content: "Moo! I'm Credit Cow. How can I help you improve your score today?" }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSend = async () => {
        if (!input.trim()) return

        const apiKey = localStorage.getItem('openai_key')
        if (!apiKey) {
            toast.error("Missing Intelligence Key", { description: "Please add your OpenAI Key in Settings > Integrations." })
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: "⚠️ ERROR: I need an OpenAI API Key to think! Please go to Settings > Integrations to add one." }])
            return
        }

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        setLoading(true)

        try {
            const res = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo', // Downgraded for compatibility
                    messages: [
                        { role: 'system', content: 'You are Credit Cow, the AI mascot of Credit University. You are helpful, encouraging, and knowledgeable about FICO scores, credit repair (FCRA/FDCPA), and financial literacy. You use cow puns occasionally but keep it professional.' },
                        ...messages.map(m => ({ role: m.role, content: m.content })),
                        { role: 'user', content: input }
                    ],
                    temperature: 0.7
                })
            })

            const data = await res.json()
            if (data.error) throw new Error(data.error.message)

            const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: data.choices[0].message.content }
            setMessages(prev => [...prev, aiMsg])

        } catch (e: any) {
            console.error(e)
            toast.error("Brain Freeze!", { description: e.message })
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: `⚠️ Brain Freeze: ${e.message}. Check your API Key.` }])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto bg-[#0A0F1E] rounded-xl border border-white/10 overflow-hidden">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-indigo-900 to-slate-900 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-indigo-500">
                        <span className="text-2xl">🐮</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-white">Credit Cow AI</h3>
                        <p className="text-xs text-indigo-300 flex items-center gap-1">
                            <Sparkles size={10} /> Online & Ready
                        </p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-white/10 text-slate-300 hover:text-white"
                    onClick={() => window.open('https://chatgpt.com/g/g-haPPWpLhT-credit-cow', '_blank')}
                >
                    Open Full GPT <ExternalLink size={12} />
                </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto" ref={scrollRef}>
                <div className="space-y-4">
                    {messages.map(m => (
                        <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-2xl ${m.role === 'user'
                                ? 'bg-indigo-600 text-white rounded-tr-none'
                                : 'bg-white/10 text-slate-200 rounded-tl-none'
                                }`}>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-white/5 text-slate-400 p-3 rounded-2xl rounded-tl-none text-xs animate-pulse">
                                Thinking... 🐮
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-black/20">
                <div className="flex gap-2">
                    <Input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                        placeholder="Ask me anything about credit..."
                        className="bg-white/5 border-white/10 text-white focus-visible:ring-indigo-500"
                    />
                    <Button onClick={handleSend} disabled={loading || !input.trim()} className="bg-indigo-600 hover:bg-indigo-500">
                        <Send size={18} />
                    </Button>
                </div>
                <p className="text-[10px] text-center text-slate-600 mt-2">
                    AI can make mistakes. Verify important financial details.
                </p>
            </div>
        </div>
    )
}
