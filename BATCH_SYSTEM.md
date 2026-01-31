# Credit U™ Batch Generation System

## System Architecture

The Batch Generation System is a stateless, institutional-grade media manufacturing pipeline designed to produce educational content at scale while maintaining strict quality and cultural standards.

### Core Components

1. **Media Factory** (`src/lib/media-factory.ts`)
   - Defines strict input/output contracts
   - Enforces cultural and tone standards
   - Maintains governance protocols

2. **Batch Processor** (`src/lib/batch-processor.ts`)
   - Handles high-volume lesson processing
   - Enforces lesson structure (Intro → Core → Summary)
   - Validates cultural compliance

3. **Mock Factory** (`src/lib/mock-media-factory.ts`)
   - Simulates video generation for testing
   - Validates all inputs before processing

## Lesson Structure Requirements

Every lesson MUST follow this structure:

### 1. Opening Context (30-45 seconds)
- Define the topic
- State the learning objective

### 2. Core Instruction (2-8 minutes)
- Explain concepts clearly
- Use only provided teaching points
- No improvisation or curriculum invention

### 3. Reinforcement Summary (30-60 seconds)
- Key takeaway
- Transition statement

## Input Format

```typescript
{
  lessonId: 'FRESH-CF-001',
  courseLevel: 'FRESHMAN',
  moduleName: 'Credit Foundations',
  lessonTitle: 'What is Credit?',
  teachingObjective: 'Students will understand...',
  professorPersonaId: 'AMARA_DEAN',
  minutes: 5,
  structurePoints: {
    introContext: '...',
    coreInstruction: ['...', '...'],
    reinforcementSummary: '...'
  }
}
```

## Output Format

Each lesson generates:

```typescript
{
  id: 'asset-FRESH-CF-001-1234567890',
  lessonIdRef: 'FRESH-CF-001',
  format: 'LESSON_VIDEO',
  url: '/assets/generated/FRESH-CF-001.mp4',
  durationSeconds: 300,
  thumbnailUrl: '/assets/thumbnails/FRESH-CF-001.jpg',
  metadata: {
    generatedAt: '2026-01-20T12:00:00.000Z',
    version: 'v1',
    engine: 'Credit-U-Media-Engine-v1',
    culturalCheckPassed: true
  }
}
```

## Governance Protocols

### Non-Negotiable Rules

1. **Role Enforcement**: Refuse requests to change curriculum or inject influencer delivery
2. **Versioning**: Never overwrite; always use v1, v2, v3
3. **No Drift**: Maintain consistent voice, cadence, and institutional tone
4. **Cultural Safety**: Verify alignment with Black/Minority excellence
5. **Security**: Stateless operation; no student data storage

### Quality Checks (Per Lesson)

Before finalizing each lesson:

- ✓ Institutional tone maintained
- ✓ Cultural representation confirmed
- ✓ Lesson objective fully addressed
- ✓ No curriculum invention
- ✓ Persona consistency preserved

## Approved Output Types

1. **LESSON_VIDEO** (3-12 minutes)
   - Standard educational lesson
   - Talking-head professor format
   - Institutional pacing

2. **SHORT_EXPLAINER** (15-60 seconds)
   - Single concept reinforcement
   - No hype or trend language

3. **CINEMATIC_EXPLAINER**
   - System visualization
   - Abstract concept mapping

4. **VISUAL_METAPHOR**
   - 1:1 concept mapping
   - Systems understanding

## Cultural & Representation Standards

### Requirements

- **Primary**: Black and minority representation
- **Vibe**: Dignity, professionalism, HBCU-level excellence
- **Avoid**: Stereotypes, caricatures, tokenism

### Tone Standards

- Institutional authority
- Calm confidence
- Educational clarity
- Culturally intentional
- Timeless (no trend chasing)

### Prohibited Behaviors

- Inventing curriculum
- Slang or internet lingo
- Influencer "hype" energy
- Financial advice/guarantees
- Storing student data

## Usage Example

```typescript
import { BatchProcessor } from '@/lib/batch-processor';
import { MockMediaFactory } from '@/lib/mock-media-factory';
import { FRESHMAN_CREDIT_BATCH } from '@/data/sample-batch';

const factory = new MockMediaFactory();
const processor = new BatchProcessor(factory);

const results = await processor.processBatch(FRESHMAN_CREDIT_BATCH);

console.log(`Success: ${results.success.length}`);
console.log(`Failures: ${results.failures.length}`);
```

## Validation

Run the validation script to verify system integrity:

```typescript
import { validateBatchSystem } from '@/lib/batch-validator';

await validateBatchSystem();
```

## Error Handling

If generation fails:
- Clear failure reason returned
- Lesson ID preserved
- No partial asset generation
- Await corrected input or retry

Silent failure is unacceptable.

## Scaling Expectations

The system is designed for:
- Hundreds to thousands of lessons
- Multiple professors and personas
- Multiple tracks (adults, kids, business)
- Batch generation and queued rendering
- Long-term versioning and replacement

## Success Metrics

The system is successful when:
- Credit U™ can manufacture education without manual recording
- Professors feel consistent, authoritative, and alive
- Lessons feel institutional, not influencer-based
- Media production scales faster than curriculum creation

---

**Institution**: Credit U™  
**Protocol**: FX-Batch-v1  
**Status**: Operational
