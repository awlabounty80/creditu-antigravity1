
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
if (!env.VITE_SUPABASE_URL || !env.VITE_SUPABASE_ANON_KEY) {
    console.error("Missing .env variables.");
    process.exit(1);
}

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

const DEV_EMAIL = 'dev.access@gmail.com';
const PASSWORD = 'dev-password-123';

async function createDevUser() {
    console.log(`Creating Dev Admin User: ${DEV_EMAIL}...`);

    // 1. Sign Up
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: DEV_EMAIL,
        password: PASSWORD,
    });

    if (authError) {
        console.log("Auth Note:", authError.message);
    }

    let userId = authData.user?.id;

    if (!userId) {
        console.log("Attempting login to get ID...");
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email: DEV_EMAIL,
            password: PASSWORD
        });

        if (loginError) {
            console.error("CRITICAL: Login failed. The user likely exists with a DIFFERENT password.", loginError.message);
            console.error("Please change the DEV_EMAIL in this script to something unique (e.g. dev2@credit-u.ai) and try again.");
            return;
        }
        userId = loginData.user?.id;
    }

    if (!userId) {
        console.error("Critical: No User ID found.");
        return;
    }

    console.log(`User ID: ${userId}`);

    // 2. Update Profile to 'admin'
    const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
            id: userId,
            email: DEV_EMAIL,
            role: 'admin',
            first_name: 'Dev',
            last_name: 'Admin',
            academic_level: 'graduate'
        });

    if (profileError) {
        console.error("Profile Update Failed (RLS blocking?):", profileError.message);
        console.log("You might need to manually set role to 'admin' in Supabase Dashboard -> Table Editor -> profiles");
    } else {
        console.log("SUCCESS! Dev Admin configured.");
        console.log(`Login at: http://localhost:5173/login`);
        console.log(`Email: ${DEV_EMAIL}`);
        console.log(`Password: ${PASSWORD}`);
    }
}

createDevUser();
