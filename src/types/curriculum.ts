// Credit U™ Curriculum Types
// Authority: Trillionaire Build Engineer

export type ContentType = 'video' | 'article' | 'quiz';

export interface Track {
    id: string;
    title: string;
    slug: string;
    description: string;
    cover_image?: string;
    order_index: number;
    is_published: boolean;
}

export interface Module {
    id: string;
    track_id: string;
    title: string;
    description: string;
    order_index: number;
    lessons?: Lesson[];
}

export interface Lesson {
    id: string;
    module_id: string;
    title: string;
    slug: string;
    summary?: string; // Added to match SQL
    content_type: ContentType;
    video_url?: string;
    reading_markdown?: string;
    duration_seconds: number; // SQL uses seconds
    order_index: number;
    is_published: boolean;
    source_verified: boolean; // SQL column name
    compliance_tags?: string[];
    key_takeaways?: string[]; // stored as text[] in SQL, mapped to string[]
    sources?: Record<string, any>[]; // stored as jsonb
}

export interface StudentProgress {
    id: string;
    user_id: string;
    lesson_id: string;
    status: 'not_started' | 'in_progress' | 'completed'; // Matches SQL check constraint
    completed_at?: string;
    last_seen_at: string; // Matches SQL
    progress_percent: number;
    xp_earned: number;
}

export interface LessonNote {
    id: string;
    user_id: string;
    lesson_id: string;
    content_markdown: string;
    updated_at: string;
}
export interface StudentStreak {
    user_id: string;
    current_streak: number;
    best_streak: number;
    last_active_date: string;
    updated_at: string;
}

export interface StudentWallet {
    user_id: string;
    xp_total: number;
    xp_lifetime: number;
    last_xp_awarded_at: string;
}

export interface Badge {
    id: string;
    slug: string;
    title: string;
    description: string;
    icon: string;
    xp_reward: number;
    is_published: boolean;
}

export interface StudentBadge {
    user_id: string;
    badge_id: string;
    earned_at: string;
    badge?: Badge; // Joined data
}
