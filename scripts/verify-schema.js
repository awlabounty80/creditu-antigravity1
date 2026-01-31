
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

async function checkSchema() {
    console.log("Verifying Database Schema...");

    // Try to select the new columns
    const { data, error } = await supabase
        .from('modules')
        .select('id, title, order_index, description')
        .limit(1);

    if (error) {
        console.log("❌ Schema Check Failed:", error.message);
        console.log("It seems the SQL script hasn't been run yet.");
        console.log("Please run the content of 'supabase/REPAIR_SCHEMA_AND_SEED.sql' in your Supabase SQL Editor.");
    } else {
        console.log("✅ Schema Verification Passed!");
        console.log("Columns 'order_index' and 'description' found in 'modules'.");
        console.log("The Curriculum Preview should now be fully functional.");
    }
}

checkSchema();
