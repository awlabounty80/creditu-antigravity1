
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Helper to read .env
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

const COURSES = [
    {
        title: "Credit 101: The Rules of the Game",
        slug: "credit-101",
        description: "Stop playing blind. Learn the 5 pillars of the FICO algorithm and how the banking system actually works.",
        level: "freshman",
        credits_value: 30,
        thumbnail_url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=2000",
        is_published: true,
        modules: [
            {
                title: "The Algorithm Decoded",
                lessons: [
                    { title: "Welcome to the Matrix", duration: 5, type: "video", video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ" }, // Placeholder video
                    { title: "Payment History (35%)", duration: 12, type: "video" },
                    { title: "Utilization (30%)", duration: 15, type: "text" },
                    { title: "Credit Age & Mix", duration: 8, type: "text" }
                ]
            },
            {
                title: "Bureaucracy Hacking",
                lessons: [
                    { title: "Freezing Secondary Bureaus", duration: 10, type: "text" },
                    { title: "Opting Out of LexisNexis", duration: 20, type: "text" }
                ]
            }
        ]
    },
    {
        title: "Dispute Tactics: Legal Jiu-Jitsu",
        slug: "dispute-tactics",
        description: "Don't beg for deletions—demand them. Learn to leverage the FCRA, FDCPA, and Metro 2 compliance standards.",
        level: "sophomore",
        credits_value: 45,
        thumbnail_url: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=2000",
        is_published: true,
        modules: [
            {
                title: "Consumer Law Foundations",
                lessons: [
                    { title: "The 609 Loophole", duration: 15, type: "video" },
                    { title: "Metro 2 Compliance", duration: 25, type: "text" }
                ]
            }
        ]
    },
    {
        title: "Business Funding: Bag Security",
        slug: "business-funding",
        description: "Transition from consumer to owner. How to structure your LLC, build a Paydex score, and access 0% interest capital.",
        level: "junior",
        credits_value: 60,
        thumbnail_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2000",
        is_published: true,
        modules: [
            {
                title: "Entity Structure",
                lessons: [
                    { title: "LLC vs Corp", duration: 10, type: "text" },
                    { title: "Ein & DUNS Setup", duration: 30, type: "text" }
                ]
            }
        ]
    },
    {
        title: "Real Estate Leverage",
        slug: "real-estate-leverage",
        description: "Using your personal credit to acquire cash-flowing assets without your own capital.",
        level: "senior",
        credits_value: 100,
        thumbnail_url: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=2071",
        is_published: true,
        modules: [
            {
                title: "Acquisition Strategies",
                lessons: [
                    { title: "Subject To Deals", duration: 40, type: "video" },
                    { title: "BRRRR Method Explained", duration: 20, type: "text" }
                ]
            }
        ]
    },
    {
        title: "Luxury Travel Hacking",
        slug: "travel-hacking",
        description: "Fly First Class for free. Master the art of point transfers, airline alliances, and status matching.",
        level: "graduate",
        credits_value: 150,
        thumbnail_url: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=2000",
        is_published: true,
        modules: [
            {
                title: "Point Ecosystems",
                lessons: [
                    { title: "Transfer Partners 101", duration: 15, type: "video" },
                    { title: "The Chase Trifecta", duration: 20, type: "text" },
                    { title: "Amex Membership Rewards", duration: 20, type: "text" }
                ]
            },
            {
                title: "Redemption Sweet Spots",
                lessons: [
                    { title: "Booking Emirates First Class", duration: 25, type: "video" },
                    { title: "Hyatt All-Inclusive Hacks", duration: 15, type: "text" }
                ]
            }
        ]
    }
];

async function seed() {
    console.log("🌱 Seeding Curriculum...");

    for (const c of COURSES) {
        console.log(`Processing Course: ${c.title}...`);

        // Check if exists
        const { data: existing } = await supabase.from('courses').select('id').eq('slug', c.slug).single();

        let courseId;
        if (existing) {
            console.log(`  -> Exists (${existing.id}). Cleaning old modules...`);
            courseId = existing.id;
            // Clear existing modules to re-seed (clean slate)
            await supabase.from('modules').delete().eq('course_id', courseId);
        } else {
            // Remove thumbnail_url as it seems missing in DB schema
            const { data: newCourse, error } = await supabase.from('courses').insert({
                title: c.title,
                slug: c.slug,
                description: c.description,
                level: c.level,
                credits_value: c.credits_value,
                // thumbnail_url: c.thumbnail_url, // REMOVED due to schema mismatch
                is_published: c.is_published
            }).select().single();

            if (error) {
                console.error("  -> Error creating course:", error.message);
                continue;
            }
            courseId = newCourse.id;
            console.log(`  -> Created (${courseId})`);
        }

        // Insert Modules
        let moduleOrder = 0;
        for (const m of c.modules) {
            moduleOrder++;
            // Remove description from modules insert
            const { data: moduleData, error: modError } = await supabase.from('modules').insert({
                course_id: courseId,
                title: m.title,
                order_index: moduleOrder,
                // description: `Module ${moduleOrder} of ${c.title}` // REMOVED due to schema mismatch
            }).select().single();

            if (modError) {
                console.error("  -> Error creating module:", modError.message);
                continue;
            }

            // Insert Lessons
            let lessonOrder = 0;
            const lessonInserts = m.lessons.map(l => {
                lessonOrder++;
                return {
                    module_id: moduleData.id,
                    title: l.title,
                    duration_minutes: l.duration,
                    order_index: lessonOrder,
                    is_free_preview: lessonOrder === 1, // First lesson free
                    video_url: l.video_url || null,
                    content_markdown: `## ${l.title}\n\nThis is a placeholder for the lesson content. In a real application, this would contain rich educational material, diagrams, and interactive elements.\n\n### Key Takeaways\n\n1. Concept One\n2. Concept Two\n3. Actionable Step\n\n> "Knowledge is power, but execution is wealth."`
                };
            });

            const { error: lessonError } = await supabase.from('lessons').insert(lessonInserts);
            if (lessonError) console.error("  -> Error inserting lessons:", lessonError.message);
        }
    }
    console.log("✅ Curriculum Seed Complete.");
}

seed();
