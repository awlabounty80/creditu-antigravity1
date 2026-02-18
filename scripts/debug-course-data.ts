
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);

async function main() {
    console.log("🔍 Searching for courses...");

    // Search for anything looking like Freshman or Foundations
    const { data: courses, error } = await supabase
        .from('courses')
        .select('id, title, slug, level')
        .or('title.ilike.%Freshman%,title.ilike.%Foundation%');

    if (error) {
        console.error("Error:", error);
    } else {
        console.log("✅ Courses Found:", courses);
    }

    // Also check for the Welcome lesson specifically to see its ID and video_url
    console.log("\n🔍 Checking 'Welcome to the Wealth Game' lesson...");
    const { data: lessons } = await supabase
        .from('lessons')
        .select('id, title, video_url')
        .eq('title', 'Welcome to the Wealth Game');

    console.log("✅ Lessons Found:", lessons);
}

main();
