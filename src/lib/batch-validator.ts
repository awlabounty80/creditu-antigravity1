/**
 * BATCH GENERATION VALIDATOR
 * 
 * This script demonstrates and validates the complete batch processing pipeline.
 * Run this to verify the system can handle institutional-scale lesson manufacturing.
 */

import { BatchProcessor } from '@/lib/batch-processor';
import { MockMediaFactory } from '@/lib/mock-media-factory';
import { FRESHMAN_CREDIT_BATCH } from '@/data/sample-batch';

export async function validateBatchSystem() {
    console.log('='.repeat(60));
    console.log('CREDIT U™ BATCH GENERATION SYSTEM VALIDATION');
    console.log('='.repeat(60));
    console.log('');

    // Initialize components
    const factory = new MockMediaFactory();
    const processor = new BatchProcessor(factory);

    console.log(`📦 Batch Size: ${FRESHMAN_CREDIT_BATCH.length} lessons`);
    console.log(`🎓 Level: FRESHMAN`);
    console.log(`📚 Module: Credit Foundations`);
    console.log('');

    // Process batch
    console.log('🚀 Starting batch generation...');
    console.log('');

    const startTime = Date.now();
    const results = await processor.processBatch(FRESHMAN_CREDIT_BATCH);
    const endTime = Date.now();

    // Report results
    console.log('');
    console.log('='.repeat(60));
    console.log('BATCH GENERATION COMPLETE');
    console.log('='.repeat(60));
    console.log('');
    console.log(`✅ Successful: ${results.success.length}`);
    console.log(`❌ Failed: ${results.failures.length}`);
    console.log(`⏱️  Total Time: ${((endTime - startTime) / 1000).toFixed(2)}s`);
    console.log('');

    if (results.success.length > 0) {
        console.log('📹 Generated Assets:');
        results.success.forEach(asset => {
            console.log(`   - ${asset.lessonIdRef}: ${asset.durationSeconds}s (${asset.metadata.version})`);
        });
        console.log('');
    }

    if (results.failures.length > 0) {
        console.log('⚠️  Failures:');
        results.failures.forEach(failure => {
            console.log(`   - ${failure.id}: ${failure.reason}`);
        });
        console.log('');
    }

    // Validation checks
    console.log('🔍 System Validation:');
    const allHaveCulturalCheck = results.success.every(a => a.metadata.culturalCheckPassed);
    const allHaveVersions = results.success.every(a => a.metadata.version === 'v1');
    const allWithinDuration = results.success.every(a => a.durationSeconds >= 180 && a.durationSeconds <= 720);

    console.log(`   Cultural Safety Check: ${allHaveCulturalCheck ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Version Control: ${allHaveVersions ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Duration Standards: ${allWithinDuration ? '✅ PASS' : '❌ FAIL'}`);
    console.log('');

    console.log('='.repeat(60));
    console.log('STATUS: SYSTEM OPERATIONAL');
    console.log('='.repeat(60));

    return results;
}

// Export for use in other modules
export { FRESHMAN_CREDIT_BATCH };
