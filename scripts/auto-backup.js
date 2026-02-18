import { execSync } from 'child_process';

const INTERVAL_MINUTES = 30;
const INTERVAL_MS = INTERVAL_MINUTES * 60 * 1000;

console.log(`⏰ Auto-Backup System Active`);
console.log(`🔄 Syncing every ${INTERVAL_MINUTES} minutes...`);
console.log(`(Keep this terminal open to maintain the schedule)`);

// Initial run
runSync();

// Schedule
setInterval(runSync, INTERVAL_MS);

function runSync() {
    try {
        const timestamp = new Date().toLocaleString();
        console.log(`\n[${timestamp}] Checking for changes...`);

        // Simple check before running full sync script to avoid noise
        const status = execSync('git status --porcelain').toString();
        if (status.trim()) {
            console.log('📦 Changes detected. Backing up...');
            execSync('npm run sync', { stdio: 'inherit' });
        } else {
            console.log('✨ No changes found. Sleeping.');
        }
    } catch (e) {
        console.error('⚠️ Backup check failed:', e.message);
    }
}
