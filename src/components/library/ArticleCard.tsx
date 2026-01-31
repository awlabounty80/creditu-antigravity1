
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface ArticleCardProps {
    id: string
    title: string
    summary: string
    slug: string
    pillar: string
    author?: string
    readTime: number
    difficulty: string // Keep strictly for type compatibility if needed, but it was unused. actually let's keep it in interface but mark optional or just ignore if it's passed but unused?
    // safely removing form interface might break parent usage if they pass it.
    // Parent LibraryHome.tsx passes {...article} which has these fields.
    // So keeping in interface is fine, just unused in component.
    // But wait, the error is 'declared but never read'.
    // If I keep it in interface but don't destructure it in function signature, it won't be "declared" in the function scope.
    // So I don't need to change the interface necessarily, just the destructuring.
    isNew?: boolean
}

export function ArticleCard({ title, summary, slug, pillar, author, readTime, isNew }: ArticleCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="group"
        >
            <Link to={`/dashboard/library/${slug}`}>
                <Card className="h-full bg-slate-900/40 border-white/5 hover:border-indigo-500/30 overflow-hidden backdrop-blur-sm transition-all duration-300">
                    <div className="p-6 flex flex-col h-full">
                        {/* Meta Header */}
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex gap-2">
                                <Badge variant="outline" className={cn(
                                    "text-[10px] uppercase tracking-wider border-opacity-30",
                                    pillar === 'Foundations' && "text-blue-400 border-blue-400",
                                    pillar === 'Strategy' && "text-purple-400 border-purple-400",
                                    pillar === 'Business' && "text-emerald-400 border-emerald-400",
                                    pillar === 'Restoration' && "text-amber-400 border-amber-400",
                                    pillar === 'Mindset' && "text-rose-400 border-rose-400",
                                )}>
                                    {pillar}
                                </Badge>
                                {isNew && (
                                    <Badge className="bg-indigo-600 text-[10px] uppercase">New</Badge>
                                )}
                            </div>
                            <div className="text-slate-500 text-xs flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {readTime} min
                            </div>
                        </div>

                        {/* Content */}
                        <h3 className="text-xl font-heading font-bold text-slate-100 mb-2 group-hover:text-indigo-300 transition-colors leading-tight">
                            {title}
                        </h3>
                        <p className="text-slate-400 text-sm line-clamp-3 mb-6 flex-1">
                            {summary}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <div className="w-5 h-5 rounded-full bg-indigo-900/50 flex items-center justify-center text-[9px] font-bold text-indigo-300">
                                    {(author || "CU").charAt(0)}
                                </div>
                                {author || "Credit U Faculty"}
                            </div>
                            <div className="text-indigo-400 group-hover:translate-x-1 transition-transform">
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </Card>
            </Link>
        </motion.div>
    )
}
