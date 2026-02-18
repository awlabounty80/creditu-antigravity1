
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env
dotenv.config({ path: resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const TARGET_TITLE = "Welcome to the Wealth Game";
const VIDEO_URL = "https://sdrkjbbiznbyiozeltgw.supabase.co/storage/v1/object/public/campus-assets/uploads/23p2cn109t4_1770152872193.mp4";

async function main() {
    console.log(`🔍 Searching for lesson: "${TARGET_TITLE}"...`);

    // 1. Try 'courses' table (from ingestion script)
    const { data: courses, error: courseError } = await supabase
        .from('courses')
        .select('id, title, slug')
        .ilike('title', TARGET_TITLE);

    if (courses && courses.length > 0) {
        console.log(`✅ Found ${courses.length} match(es) in 'courses'. Updating...`);
        for (const c of courses) {
            const { error } = await supabase
                .from('courses')
                .update({ video_url: VIDEO_URL })
                .eq('id', c.id);

            if (error) console.error(`   ❌ Failed to update course ${c.id}:`, error.message);
            else console.log(`   ✨ Updated course: ${c.slug}`);
        }
    } else {
        console.log("⚠️ No matches in 'courses' table.");
    }

    // 2. Try 'lessons' table (standard schema)
    const { data: lessons, error: lessonError } = await supabase
        .from('lessons')
        .select('id, title')
        .ilike('title', TARGET_TITLE);

    if (lessons && lessons.length > 0) {
        console.log(`✅ Found ${lessons.length} match(es) in 'lessons'. Updating...`);
        for (const l of lessons) {
            // Update lesson direct
            await supabase.from('lessons').update({ video_url: VIDEO_URL }).eq('id', l.id);

            // Also try lesson_videos table
            const { error: videoError } = await supabase
                .from('lesson_videos')
                .upsert({
                    lesson_id: l.id,
                    title: l.title,
                    video_url: VIDEO_URL,
                    video_type: 'ai_professor',
                    playback_status: 'ready',
                    sort_order: 1
                }, { onConflict: 'lesson_id, sort_order' });

            if (videoError) console.error(`   ❌ Failed to bind video record for ${l.id}:`, videoError.message);
            else console.log(`   ✨ Bound video record to lesson: ${l.id}`);
        }
    } else {
        console.log("⚠️ No matches in 'lessons' table.");
    }
}

main();
