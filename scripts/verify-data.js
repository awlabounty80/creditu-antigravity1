
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

function getEnvVars() {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        const envFile = fs.readFileSync(envPath, 'utf8');
        const vars = {};
        envFile.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
                vars[key.trim()] = value.trim();
            }
        });
        return vars;
    } catch (e) {
        return {};
    }
}

const env = getEnvVars();
const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function checkData() {
    console.log("Verifying Curriculum Data...");

    // Check Courses
    const { data: courses, error: cError } = await supabase.from('courses').select('id, title, slug');
    if (cError) { console.error("Error fetching courses:", cError.message); return; }
    console.log(`Found ${courses.length} Courses.`);

    for (const c of courses) {
        // Check Modules for this course
        const { data: modules, error: mError } = await supabase.from('modules').select('id').eq('course_id', c.id);
        if (mError) { console.error(`Error fetching modules for ${c.slug}:`, mError.message); continue; }

        let lessonCount = 0;
        for (const m of modules) {
            const { count } = await supabase.from('lessons').select('*', { count: 'exact', head: true }).eq('module_id', m.id);
            lessonCount += count;
        }

        console.log(`  - ${c.title}: ${modules.length} Modules, ${lessonCount} Lessons.`);
    }

    console.log("\nIf you see modules and lessons above, the preview player will work.");
}

checkData();
