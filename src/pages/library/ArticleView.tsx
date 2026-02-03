
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Clock, Calendar, Share2, Printer, CheckSquare, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { useGamification } from '@/hooks/useGamification'
import { KNOWLEDGE_BASE_ARTICLES } from '@/data/knowledge-base'

// Types
interface Article {
    id: string
    title: string
    summary: string
    content: string
    pillar: string
    author: string
    readTime: number
    date: string
}

// Mock Content for Fallback
// Mock Content Dictionary
const CONTENT_MAP: Record<string, string> = {
    'fico-5-factors': `
## The Anatomy of the Algorithm

Most people think their credit score is a random number assigned by a mean judge. It's not. It's a math problem. And like any math problem, if you know the formula, you can solve for X.

### The 5 Factors

1. **Payment History (35%)**: Only 35%. You can have perfect payment history and still have bad credit.
2. **Utilization (30%)**: This is the "hidden killer." If you have a $1,000 limit and spend $900, you look risky. Ideally, keep this under 10%, or better yet, under 3% (AZEO method).
3. **Length of History (15%)**: Don't close old accounts. They are your anchors.
4. **Credit Mix (10%)**: Do you only have credit cards? Banks want to see you can handle a car loan or mortgage too.
5. **New Credit (10%)**: Stop applying for everything you see. Hard inquiries hurt.

> "The rich don't use debit cards. They use credit cards like debit cards." - *Dean Sterling*
`,
    '609-reality': `
## The Misconception
The "609 Dispute Letter" is not a magic wand. Section 609 of the FCRA deals with your **Right to Information** (Title to Disclosure). It does NOT require the bureau to produce the "original signed contract."

### The Real Strategy using Section 611
When you send a 609-style letter, you are actually triggering **Section 611** (Procedure in Case of Disputed Accuracy). You are demanding that the bureau **verify** the accuracy of the data.

### Why It Works
Credit bureaus use e-OSCAR, a computerized system, to "verify" debts with 2-digit codes. By demanding **physical verification** (like the original application or payment history), you disrupt this automated flow. If they cannot verify it *properly* within 30 days, they must delete it.
`,
    'corporate-veil': `
## Piercing the Corporate Veil
An LLC separates your personal assets from business liabilities. But this protection is fragile. A judge can "pierce" it if you:
1. **Commingle Funds**: Buying groceries with the business card.
2. **Lack an Operating Agreement**: No written rules for the business.
3. **Undercapitalize**: Starting with $0 and 100% debt.

To build Tier 1 Corporate Credit, you must act like a real corporation. Get a DUNS number, a 411 listing, and never mix funds.
`,
    'psychology-collection': `
## Psychological Warfare
Collectors are trained to trigger your **Amygdala** (Fear Center). They use shame, urgency, and threats.
- "We are reviewing your file for legal recommendation."
- "This offer expires today."

### The Counter-Move: Gray Rock
Be boring. Be comprised. Be a "Gray Rock."
- **Collector:** "We will garnish you!"
- **You:** "I understand. Please mail me proof of the debt."
- **Collector:** "We can't mail it."
- **You:** "I only communicate in writing."
`,
    'metro-2-compliance': `
## The Secret Language of Credit
Credit bureaus do not read English; they read **Metro 2®**. This is a 426-character alphanumeric string that contains every detail of your account.

### Common Errors
1. **Date of Last Activity (DOLA)**: Collectors re-age this to keep debt on your report longer.
2. **Account Status**: Reporting "Current" payment history on a "Charged Off" account is a data conflict.
3. **Bankruptcy**: If included in BK, the balance MUST be zero.

Dispute the **data format**, not just the story.
`,
    '15-3-rule': `
## The 15/3 Payment Hack
Most people pay on the **Due Date**. By then, the high balance has already been reported to the bureaus.
**The Fix:** Make two payments.
1. **15 Days before Statement Date**: Pay half.
2. **3 Days before Statement Date**: Pay the rest (leave 1%).

This ensures the **Statement Balance** (which is reported) is near $0, maximizing your score.
`,
    'fdcpa-cease-desist': `
## Stopping the Calls (FDCPA § 1692c(c))
You have the right to tell a 3rd-party collector to STOP contacting you.
Send a letter via Certified Mail:
> "Pursuant to 15 U.S.C. § 1692c(c), I am notifying you to cease and desist all communication with me regarding this debt."

Once received, they can only contact you one last time to say they are suing you or closing the file. Use with caution on large recent debts.
`,
    'chexsystems-removal': `
## The Banking Blacklist
ChexSystems tracks bounced checks and "account abuse." If you are blacklisted, you can't open a bank account.
**Strategy:**
1. **Dispute**: Challenge "Account Abuse" flags (often just overdraft fees).
2. **Second Chance Banking**: Use Chime, Varo, or local Credit Unions while you fight the report.
`
}

const DEFAULT_CONTENT = "Content currently under peer review. Please check back shortly."

export default function ArticleView() {
    const { slug } = useParams()
    const [article, setArticle] = useState<Article | null>(null)
    const [loading, setLoading] = useState(true)
    const [isCompleted, setIsCompleted] = useState(false)
    const [markingComplete, setMarkingComplete] = useState(false)
    const { awardPoints } = useGamification() // Assumes hook exists

    async function handleCompleteArticle() {
        if (!article) return
        setMarkingComplete(true)

        try {
            // Check if user is logged in
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                // Local fallback for guest
                localStorage.setItem(`article_completed_${article.id}`, 'true')
                setIsCompleted(true)
                awardPoints(50, `Read Article: ${article.title}`)
            } else {
                // Call RPC
                const { error } = await supabase.rpc('complete_article', { article_uuid: article.id })

                if (error) throw error

                setIsCompleted(true)
                // awardPoints(50) handled by RPC, but we might want local toast?
            }
        } catch (e) {
            console.error("Completion failed", e)
            alert("Could not save progress. You may already have credit for this.")
        } finally {
            setMarkingComplete(false)
        }
    }

    useEffect(() => {
        async function fetchArticle() {
            try {
                // 1. Check Local Knowledge Base (Primary Source of Truth)
                const localArticle = Object.values(KNOWLEDGE_BASE_ARTICLES).find(a => a.id === slug)

                if (localArticle) {
                    setArticle({
                        id: localArticle.id,
                        title: localArticle.title,
                        summary: localArticle.category,
                        content: localArticle.content,
                        pillar: "Foundations",
                        author: "Credit U Faculty",
                        readTime: 5,
                        date: localArticle.lastUpdated
                    })
                    setLoading(false)
                    return
                }

                // 2. Try Supabase (for dynamic updates)
                const { data } = await supabase
                    .from('knowledge_articles')
                    .select('*')
                    .eq('slug', slug)
                    .single()

                if (data) {
                    setArticle({
                        id: data.id,
                        title: data.title,
                        summary: data.summary,
                        content: data.content || "No content available.",
                        pillar: data.pillar,
                        author: "Credit U Faculty",
                        readTime: data.reading_time_minutes || 5,
                        date: new Date(data.created_at).toLocaleDateString()
                    })
                } else {
                    // 3. Fallback Mock Logic (Legacy)
                    const content = CONTENT_MAP[slug || ''] || DEFAULT_CONTENT
                    const fallbackTitles: Record<string, string> = {
                        'fico-5-factors': "The 5 FICO Factors: Decoding the Algorithm",
                        '609-reality': "The Metaphysics of a 609 Letter",
                        'corporate-veil': "LLC Structuring for High-Net-Worth Protection",
                        'psychology-collection': "The Psychology of Debt: Breaking the Chains",
                        'metro-2-compliance': "Metro 2® Compliance Strategy",
                        '15-3-rule': "The 15/3 Payment Rule",
                        'fdcpa-cease-desist': "FDCPA Mastery: Cease & Desist",
                        'chexsystems-removal': "ChexSystems Removal Strategy"
                    }

                    setArticle({
                        id: slug || "mock-1",
                        title: fallbackTitles[slug || ''] || "Knowledge Article",
                        summary: "Overview of this critical financial topic.",
                        content: content,
                        pillar: "Foundations",
                        author: "Dean Sterling",
                        readTime: 5,
                        date: "Oct 12, 2025"
                    })
                }
            } catch (e) {
                console.error(e)
                // Fallback catch
            } finally {
                setLoading(false)
            }
        }
        fetchArticle()
    }, [slug])

    if (loading) {
        return <div className="min-h-screen bg-[#020412] flex items-center justify-center text-white">Loading Intelligence...</div>
    }

    if (!article) return <div>Not Found</div>

    return (
        <div className="min-h-screen bg-[#020412] text-slate-200 font-sans selection:bg-indigo-500/30">
            {/* Progress Bar (Reading Indicator) */}
            <motion.div
                className="fixed top-0 left-0 h-1 bg-indigo-500 z-50"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.5 }}
            />

            <div className="max-w-4xl mx-auto p-6 md:p-12">
                {/* Header */}
                <div className="mb-8">
                    <Link to="/dashboard/library">
                        <Button variant="ghost" className="pl-0 text-slate-500 hover:text-white mb-6">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Library
                        </Button>
                    </Link>

                    <div className="flex gap-4 mb-6">
                        <Badge variant="outline" className="text-indigo-300 border-indigo-500/30 uppercase tracking-widest text-[10px]">
                            {article.pillar} Protocol
                        </Badge>
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                            <Clock className="w-3 h-3" /> {article.readTime} MIN READ
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-heading font-black text-white mb-6 leading-tight">
                        {article.title}
                    </h1>

                    <div className="flex items-center justify-between border-y border-white/5 py-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-indigo-400 border border-white/10">
                                {article.author.charAt(0)}
                            </div>
                            <div>
                                <div className="text-sm font-bold text-white">{article.author}</div>
                                <div className="text-xs text-slate-500 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> {article.date}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button size="icon" variant="ghost" className="text-slate-500 hover:text-white rounded-full">
                                <Share2 className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="text-slate-500 hover:text-white rounded-full">
                                <Printer className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <article className="prose prose-invert prose-lg max-w-none prose-headings:font-heading prose-headings:font-bold prose-p:text-slate-300 prose-blockquote:border-l-indigo-500 prose-blockquote:bg-white/5 prose-blockquote:p-4 prose-blockquote:not-italic prose-li:text-slate-300">
                    <ReactMarkdown>{article.content}</ReactMarkdown>
                </article>

                {/* Footer / Action Items */}
                <div className="mt-16 p-8 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 rounded-3xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-indigo-500 rounded-lg">
                            <CheckSquare className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Credit U Action Items</h3>
                    </div>

                    {!isCompleted ? (
                        <div className="space-y-4">
                            <p className="text-slate-400 text-sm mb-4">Complete this module to earn <span className="text-amber-400 font-bold">50 Moo Points</span> and track your progress.</p>
                            <Button
                                onClick={handleCompleteArticle}
                                disabled={markingComplete}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 font-bold h-12"
                            >
                                {markingComplete ? "Verifying..." : "Mark as Completed"}
                            </Button>
                        </div>
                    ) : (
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
                            <CheckCircle className="w-6 h-6 text-emerald-500" />
                            <div>
                                <h4 className="font-bold text-emerald-400">Target Achieved</h4>
                                <p className="text-xs text-emerald-300">You have mastered this update.</p>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}
