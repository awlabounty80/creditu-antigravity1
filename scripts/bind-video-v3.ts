
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);

const TARGET_TITLE_PARTIAL = "Wealth Game";
const VIDEO_URL = "https://sdrkjbbiznbyiozeltgw.supabase.co/storage/v1/object/public/campus-assets/uploads/23p2cn109t4_1770152872193.mp4";

async function main() {
    console.log(`🔍 Searching for lesson matching: "${TARGET_TITLE_PARTIAL}"...`);

    const { data: lessons, error } = await supabase
        .from('lessons')
        .select('id, title, content')
        .ilike('title', `%${TARGET_TITLE_PARTIAL}%`);

    if (error || !lessons || lessons.length === 0) {
        console.error("❌ Lesson not found:", error);
        return;
    }

    console.log(`✅ Found ${lessons.length} lessons:`, lessons.map(l => l.title));

    for (const l of lessons) {
        console.log(`Updating content for lesson: ${l.id} (${l.title})...`);

        let newContent = l.content || "";
        // Remove existing VIDEO_URL tag if present
        newContent = newContent.replace(/VIDEO_URL:.*(\n|$)/g, '');
        // Prepend new tag
        newContent = `VIDEO_URL: ${VIDEO_URL}\n\n${newContent}`;

        const { error: updateError } = await supabase
            .from('lessons')
            .update({ content: newContent })
            .eq('id', l.id);

        if (updateError) {
            console.error(`   ❌ Failed to update content:`, updateError);
        } else {
            console.log(`   ✨ VIDEO BOUND SUCCESS (Soft Schema): ${l.title}`);
        }
    }
}

main();
