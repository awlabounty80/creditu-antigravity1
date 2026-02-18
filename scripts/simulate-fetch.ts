
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);

const COURSE_ID = 'course_foundation';

async function main() {
    console.log(`🔍 Simulating fetch for course ID: "${COURSE_ID}"...`);

    // 1. Fetch Course
    const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', COURSE_ID)
        .single();

    if (courseError) {
        console.error("❌ Course Fetch Error:", courseError);
        return;
    }
    console.log("✅ Course fetched:", course.title);

    // 2. Fetch Modules & Lessons (Exact query from useCourse.ts)
    const { data: modules, error: modulesError } = await supabase
        .from('modules')
        .select(`
            id, title, description, order_index,
            lessons (
                id, title, duration_minutes, order_index, content, type
            )
        `)
        .eq('course_id', COURSE_ID)
        .order('order_index', { ascending: true });

    if (modulesError) {
        console.error("❌ Modules Fetch Error:", modulesError);
        return;
    }
    console.log(`✅ Modules fetched: ${modules.length}`);

    if (modules.length > 0) {
        const firstLesson = modules[0].lessons[0];
        console.log("📝 First Lesson Content Preview:", firstLesson?.content?.slice(0, 50));

        // Test Regex
        const match = firstLesson?.content?.match(/VIDEO_URL:\s*([^\s\n]+)/);
        console.log("🎯 Regex Match Result:", match ? match[1] : "NO MATCH");
    }
}

main();
