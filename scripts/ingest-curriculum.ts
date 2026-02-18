
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env from parent dir
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface Lesson {
    title: string;
    level_id: string; // Foundation, Freshman, etc
    module_id: string; // 1.1, 1.2
    content: string;
    objectives: string[];
    core_teaching: string[];
    knowledge_check: { question: string; answer: string }[];
}

const CURRICULUM_FILE = path.resolve(__dirname, '../CREDIT_U_CURRICULUM_MASTER.md');

async function main() {
    console.log("🎓 Starting Curriculum Ingestion...");

    if (!fs.existsSync(CURRICULUM_FILE)) {
        console.error("❌ Master Curriculum File Not Found!");
        return;
    }

    const rawContent = fs.readFileSync(CURRICULUM_FILE, 'utf-8');
    const sections = parseMarkdown(rawContent);

    console.log(`\n📚 Found ${sections.length} Lessons. Uploading to Database...`);

    for (const lesson of sections) {
        // 1. Ensure Course Exists (Upsert based on slug/id)
        const slug = `lesson-${lesson.module_id.replace('.', '-')}`;

        // This is a simplified insertion. In a real app we might link to specific tracks.
        const { data: course, error: courseError } = await supabase
            .from('courses')
            .upsert({
                title: lesson.title,
                slug: slug,
                description: lesson.content.substring(0, 150) + "...", // preview
                content: lesson.content, // full markdown
                level: lesson.level_id,
                credits_value: 3, // Each lesson worth 3 credits
                track: "Personal Credit Track",
                published: true,
                order_index: parseFloat(lesson.module_id)
            }, { onConflict: 'slug' })
            .select()
            .single();

        if (courseError) {
            console.error(`❌ Failed to upload ${lesson.title}:`, courseError.message);
        } else {
            console.log(`✅ Uploaded: [${lesson.module_id}] ${lesson.title}`);
        }
    }

    console.log("\n✨ Ingestion Complete!");
}

function parseMarkdown(md: string): Lesson[] {
    const lines = md.split('\n');
    let currentLevel = "Unknown";
    const lessons: Lesson[] = [];
    let currentLesson: Partial<Lesson> | null = null;
    let captureContent = false;
    let contentBuffer: string[] = [];

    for (const line of lines) {
        // Detect Level
        if (line.startsWith('## 🏛️ LEVEL') || line.startsWith('## 🎒 LEVEL') || line.startsWith('## 📒 LEVEL') || line.startsWith('## 📘 LEVEL') || line.startsWith('## 📙 LEVEL') || line.startsWith('## 🎓 LEVEL')) {
            currentLevel = line.replace(/## . LEVEL \d+: /, '').replace(/\(.*\)/, '').trim();
            // Map to simplified DB levels
            if (line.includes("LEVEL 1")) currentLevel = "Foundation";
            if (line.includes("LEVEL 2")) currentLevel = "Freshman";
            if (line.includes("LEVEL 3")) currentLevel = "Sophomore";
            if (line.includes("LEVEL 4")) currentLevel = "Junior";
            if (line.includes("LEVEL 5")) currentLevel = "Senior";
            if (line.includes("LEVEL 6")) currentLevel = "Graduate";
            continue;
        }

        // Detect Lesson Start
        if (line.trim().startsWith('### 📚 Lesson')) {
            // Save previous lesson
            if (currentLesson) {
                currentLesson.content = contentBuffer.join('\n');
                lessons.push(currentLesson as Lesson);
            }

            // Start new lesson
            const match = line.match(/Lesson (\d+\.\d+): (.*)/);
            if (match) {
                currentLesson = {
                    level_id: currentLevel,
                    module_id: match[1],
                    title: match[2],
                    objectives: [],
                    core_teaching: [],
                    knowledge_check: []
                };
                contentBuffer = [line]; // Keep the header in content
                captureContent = true;
            }
            continue;
        }

        if (captureContent) {
            contentBuffer.push(line);
        }
    }

    // Push final lesson
    if (currentLesson) {
        currentLesson.content = contentBuffer.join('\n');
        lessons.push(currentLesson as Lesson);
    }

    return lessons;
}

main().catch(console.error);
