import { execSync } from 'child_process';

const timestamp = new Date().toLocaleString();
const msg = process.argv[2] || `Auto-update: ${timestamp}`;

console.log('🔄 Syncing with GitHub...');
console.log(`📝 Commit Message: "${msg}"`);

try {
    // Check for changes
    const status = execSync('git status --porcelain').toString();
    if (!status.trim()) {
        console.log('✨ No changes to commit.');
    } else {
        execSync('git add .', { stdio: 'inherit' });
        execSync(`git commit -m "${msg}"`, { stdio: 'inherit' });
    }

    // Push
    console.log('🚀 Pushing to origin/main...');
    execSync('git push origin main', { stdio: 'inherit' });
    console.log('✅ Success! Your code is backed up.');

} catch (error) {
    // If commit fails (e.g. nothing to commit) we might still want to push if ahead?
    // But status check handles empty commit.
    // If push fails, we log error.
    console.error('❌ Sync failed:', error.message);
    process.exit(1);
}
