
import { supabase } from '@/lib/supabase'

export interface SearchResult {
    id: string
    title: string
    slug: string
    summary: string
    similarity?: number
    type: 'article' | 'template' | 'video'
}

/**
 * Searches the Knowledge Base using simple text search (Phase 1)
 * Will be upgraded to Vector Search in Phase 3.
 */
export async function searchKnowledgeBase(query: string): Promise<SearchResult[]> {
    if (!query) return []

    // 1. Perform Title/Summary Search
    const { data, error } = await supabase
        .from('knowledge_articles')
        .select('id, title, slug, summary')
        .or(`title.ilike.%${query}%,summary.ilike.%${query}%`)
        .eq('is_published', true)
        .limit(5)

    if (error) {
        console.error('Search failed:', error)
        return []
    }

    return data.map(item => ({
        ...item,
        type: 'article'
    }))
}

/**
 * Fetches recent or featured articles
 */
export async function getRecommendedContent() {
    const { data } = await supabase
        .from('knowledge_articles')
        .select('id, title, slug, summary, pillar, reading_time_minutes, difficulty')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(6)

    return data || []
}
