
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

async function check() {
    console.log("Checking database status...");

    // Check Knowledge Articles
    const { error: error1 } = await supabase.from('knowledge_articles').select('id').limit(1);
    if (error1) {
        console.log("X Knowledge Articles Table: MISSING or RLS Restricted (" + error1.message + ")");
    } else {
        console.log("✓ Knowledge Articles Table: FOUND");
    }

    // Check Rewards
    const { error: error2 } = await supabase.from('rewards').select('id').limit(1);
    if (error2) {
        console.log("X Rewards Table: MISSING or RLS Restricted (" + error2.message + ")");
    } else {
        console.log("✓ Rewards Table: FOUND");
    }
}

check();
