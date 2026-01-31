
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

const ADMIN_EMAIL = 'awlabounty@icloud.com';
const PASSWORD = 'admin-password-123';

async function createAdmin() {
    console.log(`Creating Admin User: ${ADMIN_EMAIL}...`);

    // 1. Sign Up (creates auth user)
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: ADMIN_EMAIL,
        password: PASSWORD,
    });

    if (authError) {
        console.log("Auth Note:", authError.message);
        // If user already exists, we just need to update their profile role
    }

    // 2. Get the User ID (either from new signup or existing fetch)
    // We can't query auth.users directly with client key usually, but if sign up succeeded we have it.
    // If sign up failed because exists, we can try to signIn to get ID.

    let userId = authData.user?.id;

    if (!userId) {
        console.log("Attempting login to get ID...");
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email: ADMIN_EMAIL,
            password: PASSWORD
        });

        if (loginError) {
            console.error("Could not verify user ID. Admin setup failed.", loginError.message);
            return;
        }
        userId = loginData.user?.id;
    }

    if (!userId) {
        console.error("Critical: No User ID found.");
        return;
    }

    console.log(`User ID: ${userId}`);

    // 3. Update Profile to 'admin' role
    // This calls the profiles table. RLS might block this if we are not careful, 
    // but the 'users can update own profile' policy might save us if we are logged in as them (which we are via sign in).

    // HOWEVER: Changing 'role' usually requires admin privilege or service_role key.
    // Since we are using ANON key here, this might rely on the profile triggers or unrestricted creation.
    // Let's try to update. If it fails, we output instructions.

    const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
            id: userId,
            email: ADMIN_EMAIL,
            role: 'admin',
            first_name: 'The',
            last_name: 'Dean',
            academic_level: 'graduate'
        });

    if (profileError) {
        console.error("Profile Update Failed (RLS likely blocking role change):", profileError.message);
        console.log("\n*** MANUAL ACTION REQUIRED ***");
        console.log("Go to Supabase Table Editor > 'profiles' table.");
        console.log(`Find user ${ADMIN_EMAIL} and manually change 'role' to 'admin'.`);
    } else {
        console.log("SUCCESS! Admin profile configured.");
        console.log(`Login at: http://localhost:5173/login`);
        console.log(`Email: ${ADMIN_EMAIL}`);
        console.log(`Password: ${PASSWORD}`);
    }
}

createAdmin();
