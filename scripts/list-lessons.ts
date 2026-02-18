
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);

async function main() {
    console.log("🔍 Listing modules for course_foundation...");

    // Get modules
    const { data: modules, error } = await supabase
        .from('modules')
        .select(`
            id, title,
            lessons (id, title, video_url)
        `)
        .eq('course_id', 'course_foundation');

    if (error) {
        console.error("❌ Error fetching modules:", error);
        return;
    }

    if (!modules || modules.length === 0) {
        console.log("⚠️ No modules found for 'course_foundation'. Checking raw courses table...");
        const { data: courses } = await supabase.from('courses').select('*');
        console.log("Available courses:", courses?.map(c => ({ id: c.id, title: c.title })));
        return;
    }

    console.log(`✅ Found ${modules.length} modules.`);
    modules.forEach(m => {
        console.log(`\n📦 Module: ${m.title} (${m.id})`);
        m.lessons.forEach((l: any) => {
            console.log(`   - Lesson: [${l.title}] (ID: ${l.id})`);
            console.log(`     Video: ${l.video_url || 'NONE'}`);
        });
    });
}

main();
