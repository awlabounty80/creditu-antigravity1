
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);

const TARGET_TITLE_PARTIAL = "Wealth Game"; // Use partial to be safe
const VIDEO_URL = "https://sdrkjbbiznbyiozeltgw.supabase.co/storage/v1/object/public/campus-assets/uploads/23p2cn109t4_1770152872193.mp4";

async function main() {
    console.log(`🔍 Searching for lesson matching: "${TARGET_TITLE_PARTIAL}"...`);

    // 1. Find Lesson
    const { data: lessons, error } = await supabase
        .from('lessons')
        .select('id, title')
        .ilike('title', `%${TARGET_TITLE_PARTIAL}%`);

    if (error || !lessons || lessons.length === 0) {
        console.error("❌ Lesson not found:", error);
        return;
    }

    console.log(`✅ Found ${lessons.length} lessons:`, lessons.map(l => l.title));

    // 2. Insert into lesson_videos
    for (const l of lessons) {
        console.log(`Checking lesson_videos for lesson: ${l.id}...`);

        const { error: upsertError } = await supabase
            .from('lesson_videos')
            .upsert({
                lesson_id: l.id,
                title: l.title,
                video_url: VIDEO_URL,
                video_type: 'ai_professor', // Or 'external_reference' to denote uploaded? 'ai_professor' is fine as default
                playback_status: 'ready',
                sort_order: 1
            }, { onConflict: 'lesson_id, sort_order' });

        if (upsertError) {
            console.error(`   ❌ Failed to bind video:`, upsertError);
        } else {
            console.log(`   ✨ VIDEO BOUND SUCCESS: ${l.title}`);
        }
    }
}

main();
