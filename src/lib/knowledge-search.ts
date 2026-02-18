
import { FULL_ARTICLES } from '@/data/full-articles';
import { LETTER_TEMPLATES } from '@/data/letter-templates';

export interface SearchResult {
    id: string
    title: string
    slug: string
    content: string
    type: 'article' | 'template' // Added type discrimination
    similarity: number // Mocked for now
}

/**
 * HYBRID SEARCH ENGINE
 * 1. Checks local "Infinite Knowledge" database (FULL_ARTICLES).
 * 2. Checks local "Letter Library" (LETTER_TEMPLATES).
 */
export async function searchKnowledgeBase(query: string): Promise<SearchResult[]> {
    console.log("Credit Cow is thinking about...", query)

    const lowerQuery = query.toLowerCase();
    const terms = lowerQuery.split(' ').filter(t => t.length > 2); // Filter small words

    // 1. Search Articles
    const articleResults: SearchResult[] = Object.values(FULL_ARTICLES)
        .filter(article => {
            const contentMatch = article.content.toLowerCase().includes(lowerQuery);
            const titleMatch = article.title.toLowerCase().includes(lowerQuery);
            // Or match any specific term in title
            const termMatch = terms.some(t => article.title.toLowerCase().includes(t));
            return titleMatch || (termMatch && contentMatch);
        })
        .map(article => ({
            id: article.id,
            title: article.title,
            slug: article.id,
            content: article.content.replace(/<[^>]*>?/gm, ''), // Strip HTML
            type: 'article',
            similarity: 0.9
        }));

    // 2. Search Templates (The Heavy Artillery)
    const templateResults: SearchResult[] = LETTER_TEMPLATES
        .filter(template => {
            const titleMatch = template.title.toLowerCase().includes(lowerQuery);
            const contentMatch = template.content.toLowerCase().includes(lowerQuery);
            const catMatch = template.category.toLowerCase().includes(lowerQuery);

            // Or allow broad searching
            const termMatch = terms.some(t =>
                template.title.toLowerCase().includes(t) ||
                template.content.toLowerCase().includes(t)
            );

            return titleMatch || contentMatch || catMatch || termMatch;
        })
        .map(template => ({
            id: template.id,
            title: `Template: ${template.title}`,
            slug: template.id, // Letters use ID
            content: `[LETTER TEMPLATE - ${template.category.toUpperCase()}]\n\n${template.desc}\n\n${template.content}`,
            type: 'template',
            similarity: 0.85
        }));

    // Combine and Sort
    const combined = [...articleResults, ...templateResults]
        .sort((a, b) => {
            // Priority to exact title matches
            const aTitle = a.title.toLowerCase();
            const bTitle = b.title.toLowerCase();
            if (aTitle.includes(lowerQuery) && !bTitle.includes(lowerQuery)) return -1;
            if (bTitle.includes(lowerQuery) && !aTitle.includes(lowerQuery)) return 1;
            return 0;
        })
        .slice(0, 5); // Return Top 5

    return combined;
}

/**
 * GENERATE ANSWER (Mock LLM)
 * Takes the search results and synthesizes an answer.
 */
export async function generateCowResponse(query: string, context: SearchResult[]): Promise<string> {

    // Simulate network delay for "thinking" feel
    await new Promise(resolve => setTimeout(resolve, 800));

    if (context.length === 0) {
        // Fallback response
        return "Moo? I scanned my entire library but couldn't find a specific article or template for that. Try asking about 'Dispute Letters', 'Inquiries', or 'Goodwill'.\n\nI'm still learning every day!";
    }

    const topMatch = context[0];
    const isTemplate = topMatch.type === 'template';

    // Simple template-based response using the found content
    const snippet = topMatch.content.substring(0, 300);

    if (isTemplate) {
        return `I found a perfect letter template for you: **${topMatch.title}**.\n\nDescription: ${snippet}...\n\nYou can find this full template in the Letter Library!`;
    }

    return `Here is what I found in the Knowledge Center regarding **${topMatch.title}**:\n\n"${snippet}..."\n\nYou should read the full article for the step-by-step guide.`;
}
