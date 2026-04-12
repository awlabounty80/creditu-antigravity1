# The Credit University AI™ (Credit U™) - Knowledge OS Master Plan

**Status**: PROPOSED
**Version**: 1.0.0
**Architect**: Antigravity + Gemini

---

## 1. Executive Summary
This upgrade transforms "Credit U" from a course platform into an infinite "Knowledge Operating System." It introduces a database-backed Content Engine, an "Ivy League" Library Interface, and the "Credit Cow" AI RAG system.

## 2. Architecture & Data Schema

### 2.1 Database Schema (Supabase)
We will add 4 new tables to `public` schema. **No existing tables will be touched.**

```sql
-- 1. Knowledge Articles (The Core Content)
CREATE TABLE public.knowledge_articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    summary TEXT,
    content TEXT, -- Markdown content
    pillar TEXT NOT NULL, -- 'Foundations', 'Strategy', 'Business', 'Restoration', 'Mindset'
    author_id UUID REFERENCES auth.users(id),
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    difficulty TEXT DEFAULT 'Freshman', -- 'Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'
    reading_time_minutes INTEGER DEFAULT 5,
    embedding vector(1536), -- For RAG (if pgvector enabled)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tags (Taxonomy)
CREATE TABLE public.knowledge_tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE
);

-- 3. Article Tags (Many-to-Many)
CREATE TABLE public.article_tags (
    article_id UUID REFERENCES public.knowledge_articles(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES public.knowledge_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, tag_id)
);

-- 4. User Bookmarks (Saved Items)
CREATE TABLE public.user_bookmarks (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    article_id UUID REFERENCES public.knowledge_articles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, article_id)
);
```

### 2.2 Project Structure Expansion
We will add new files *alongside* existing ones.

```text
src/
├── pages/
│   ├── library/             <-- NEW FOLDER
│   │   ├── LibraryHome.tsx
│   │   ├── ArticleView.tsx
│   │   └── SearchResults.tsx
│   └── admin/
│       └── KnowledgeCockpit.tsx <-- NEW PAGE
├── components/
│   ├── library/             <-- NEW FOLDER
│   │   ├── ArticleCard.tsx
│   │   └── SearchBar.tsx
│   └── admin/
│       └── ArticleEditor.tsx
├── api/
│   └── knowledge-search.ts  <-- NEW FUNCTION
```

## 3. UI/UX Wireflow

### A. The "Campus Library" (Student View)
*   **Location**: Sidebar Item > "Knowledge Library"
*   **Vibe**: "Modern Alexandria". Glass shelves, infinite scroll, "Quiet Please" ambient aesthetics.
*   **Features**:
    *   **Hero Search**: Large, centered search bar "What do you need to know today?"
    *   **The 5 Pillars**: Quick filter tabs (Foundations, Business, etc.)
    *   **Recommended**: "Trending on Campus"

### B. The Article View (Reading Mode)
*   Distraction-free reading.
*   "Credit U Action Items" at the bottom (interactive checkboxes).
*   "Related Courses" sidebar integration (Cross-sell).

### C. The Knowledge Cockpit (Admin View)
*   WYSIWYG Markdown Editor.
*   Publish/Unpublish toggle.
*   Tag Manager.

## 4. AI Strategy ("Ask Credit Cow")
*   **Ingestion**: When an article is saved, we generate an embedding (using OpenAI `text-embedding-3-small` or similar) and store it in the `embedding` column.
*   **Retrieval**: When user asks a question, we embed the query and search `knowledge_articles` by cosine similarity.
*   **Generation**: We pass the top 3 relevant text chunks to the LLM with the prompt: *"You are Credit Cow. Answer based ONLY on the context below."*

## 5. Implementation Plan (Phases)

### Phase 1: The Foundation (Immediate Execution)
1.  Run SQL migration to create tables.
2.  Seed the database with 30 "Billionaire-grade" articles.
3.  Create `Library.tsx` and `ArticleView.tsx`.
4.  Add "Library" link to `CampusLayout.tsx`.

### Phase 2: The Administration
1.  Create `KnowledgeCockpit.tsx` for real-time editing.
2.  Implement "Tags" management.

### Phase 3: The Intelligence
1.  Enable `pgvector` on Supabase.
2.  Connect "Ask Credit Cow" chat to the Knowledge Base.

## 6. Seed Content Preview (Sample Titles)
*   *Foundations*: "The 5 FICO Factors: Decoding the Algorithm"
*   *Restoration*: "The Metaphysics of a 609 Letter"
*   *Business*: "LLC Structuring for High-Net-Worth Protection"
*   *Mindset*: "The Psychology of Debt: Breaking the Chains"

---

**Waiting for User Approval.**
Type "APPROVE" to begin Phase 1 immediately.
