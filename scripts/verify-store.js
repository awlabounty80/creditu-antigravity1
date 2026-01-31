
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

async function verify() {
    console.log("Verifying Moo Store Inventory...");
    const { data, error } = await supabase.from('rewards').select('*');

    if (error) {
        console.error("Error:", error.message);
    } else {
        console.log(`Success! Found ${data.length} items in the store.`);
        data.forEach(item => {
            console.log(`- [${item.cost} pts] ${item.title}`);
        });
    }

    console.log("\nVerifying Knowledge Base...");
    const { data: articles, error: artError } = await supabase.from('knowledge_articles').select('*');
    if (artError) {
        console.error("Error:", artError.message);
    } else {
        console.log(`Knowledge Base Status: ${articles.length} articles found.`);
        if (articles.length === 0) {
            console.log("(This is expected. The table is created but empty. We need to seed it.)");
        }
    }
}

verify();
