# Credit U™ - Progressive Learning Architecture

## 🎓 Overview

Credit U™ implements a **6-level progressive learning system** where students advance based on **demonstrated mastery**, not time spent. Each level has specific learning goals, authorized sources, and advancement criteria.

---

## 📊 System Architecture

### Total Curriculum Capacity
- **6 Learning Levels**
- **515 Total Lessons** (estimated)
- **Mastery-Based Progression**
- **100% Source-Verified Content**

---

## 🎯 The 6 Levels

### Level 1: ORIENTATION / FOUNDATIONS
**Goal**: Literacy & awareness (no strategy)

**Focus**: What credit is, not how to manipulate it

**Authorized Sources**:
- Credit bureau education pages (Experian, Equifax, TransUnion)
- CFPB consumer basics
- Open educational resources (OER)

**Content Extraction Rules**:
- ✅ Extract definitions and vocabulary
- ✅ Extract credit report sections
- ❌ Ignore advice language
- ✅ Cross-check definitions across 2+ sources

**Prohibited Content**:
- Strategy or manipulation tactics
- Promises or guarantees
- Advice language
- Optimization techniques

**Activities**:
- "What is credit?" videos
- Glossary tools
- Entry-level quizzes
- Visual metaphors (credit file, timeline)

**Advancement Criteria**:
- ✅ Complete basic literacy quiz (70%+)
- ✅ Can identify credit report sections
- ✅ Demonstrates vocabulary understanding

**Estimated Lessons**: 15

---

### Level 2: FRESHMAN – UNDERSTANDING CREDIT
**Goal**: Structure & rules

**Focus**: Credit factors and reporting logic

**Authorized Sources**:
- Experian / Equifax / TransUnion education
- FICO education portals (myFICO.com)
- CFPB Q&A sections

**Content Extraction Rules**:
- ✅ Extract factor categories (payment history, utilization, etc.)
- ✅ Extract influence language ("most impactful")
- ❌ Avoid formulas or promises
- ✅ Focus on cause-and-effect relationships

**Prohibited Content**:
- Proprietary scoring formulas
- Guaranteed outcomes
- Specific score predictions
- Manipulation tactics

**Activities**:
- Factor-by-factor lessons
- Score range explainers
- Scenario quizzes ("what impacts scores?")
- Cause-and-effect simulations

**Advancement Criteria**:
- ✅ Pass factor comprehension quizzes (70%+)
- ✅ Understand cause-and-effect relationships
- ✅ Can explain all 5 FICO factors

**Estimated Lessons**: 100

---

### Level 3: SOPHOMORE – MANAGING CREDIT
**Goal**: Behavior & maintenance

**Focus**: Rights, responsibilities, and timelines

**Authorized Sources**:
- CFPB consumer protection
- FTC consumer education
- Federal Reserve consumer education
- NACHA (payment timing)

**Content Extraction Rules**:
- ✅ Extract dispute steps and processes
- ✅ Extract payment posting timing
- ✅ Extract consumer protections (FCRA, FDCPA)
- ✅ Translate into plain language

**Prohibited Content**:
- Legal advice
- Guaranteed dispute outcomes
- Loopholes or tricks
- Non-compliant tactics

**Activities**:
- Dispute education tools
- Payment timing explainers
- Rights-based quizzes
- Visual process walkthroughs

**Advancement Criteria**:
- ✅ Can explain dispute process (FCRA)
- ✅ Understands payment consequences
- ✅ Demonstrates rights awareness

**Estimated Lessons**: 100

---

### Level 4: JUNIOR – STRATEGIC CREDIT & MONEY
**Goal**: Planning & decision-making (educational)

**Focus**: Qualification frameworks and money flow

**Authorized Sources**:
- Federal Reserve
- HUD / Fannie Mae / Freddie Mac (education sections)
- IRS income definitions
- SBA education pages

**Content Extraction Rules**:
- ✅ Extract DTI concepts and thresholds
- ✅ Extract documentation categories
- ✅ Extract general planning frameworks
- ❌ Avoid approval language

**Prohibited Content**:
- Approval guarantees
- Specific lender recommendations
- Tax advice
- Business advice

**Activities**:
- Educational planners
- Budgeting frameworks
- Scenario simulations
- Strategy comparison quizzes

**Advancement Criteria**:
- ✅ Demonstrates planning literacy
- ✅ Can evaluate scenarios without guarantees
- ✅ Understands qualification frameworks

**Estimated Lessons**: 100

---

### Level 5: SENIOR – OPTIMIZATION & PREPARATION
**Goal**: Readiness & system thinking

**Focus**: Realistic context and preparation logic

**Authorized Sources**:
- CFPB homeownership education
- VA housing education
- BLS & Census (benchmarks)
- Federal Reserve economic data

**Content Extraction Rules**:
- ✅ Extract timelines and milestones
- ✅ Extract averages and benchmarks
- ✅ Extract readiness indicators
- ❌ No predictions or guarantees

**Prohibited Content**:
- Market predictions
- Investment advice
- Guaranteed timelines
- Specific recommendations

**Activities**:
- Readiness checklists
- Timeline planners
- Advanced scenario quizzes
- Visual systems maps

**Advancement Criteria**:
- ✅ Completes readiness assessments
- ✅ Understands risk vs preparation
- ✅ Demonstrates systems thinking

**Estimated Lessons**: 100

---

### Level 6: GRADUATE – APPLICATION & SIMULATION
**Goal**: Safe application without advice

**Focus**: Synthesis of all prior knowledge

**Authorized Sources**:
- All prior authorized sources (cross-verified)
- OER instructional design standards

**Content Extraction Rules**:
- ✅ Recombine existing verified knowledge
- ❌ No new facts introduced
- ✅ Synthesis and application only
- ✅ Cross-reference all prior levels

**Prohibited Content**:
- New unverified information
- Financial advice
- Guarantees or promises
- Individualized recommendations

**Activities**:
- Full simulations (educational)
- Capstone scenarios
- Decision-tree walkthroughs
- Mastery assessments

**Advancement Criteria**:
- ✅ Demonstrates mastery across all domains
- ✅ Ready for ongoing learning loops
- ✅ Can synthesize complex scenarios

**Estimated Lessons**: 100

---

## 🔐 Content Governance

### Universal Rules (All Levels)

**Always Required**:
- ✅ 2+ source verification
- ✅ Legal accuracy (FCRA, FDCPA, ECOA)
- ✅ Educational focus (not advice)
- ✅ HBCU cultural standards
- ✅ Institutional tone

**Always Prohibited**:
- ❌ Financial advice
- ❌ Guarantees or promises
- ❌ Proprietary information
- ❌ Manipulation tactics
- ❌ Influencer language

---

## 📈 Progression Model

### How Students Advance

1. **Complete Level Content**: Watch all lessons, read all articles
2. **Pass Assessments**: Score 70%+ on quizzes
3. **Meet Criteria**: Fulfill all advancement criteria
4. **Unlock Next Level**: Automatic progression upon completion

### No Time Requirements
- Advancement is **mastery-based**, not time-based
- Students can progress as fast as they can learn
- No artificial delays or waiting periods

### Repeatable Content
- Students can revisit any unlocked level
- Content remains accessible after completion
- Continuous learning encouraged

---

## 🛠️ Implementation

### Code Structure

**Core Files**:
- `src/lib/learning-levels.ts` - Level definitions and logic
- `src/pages/LearningPath.tsx` - Visual learning path UI
- `src/data/lessons-*.ts` - Lesson content by level

**Key Functions**:
```typescript
import { LEARNING_LEVELS, getLevelByNumber, getNextLevel } from '@/lib/learning-levels';

// Get level definition
const level = LEARNING_LEVELS['FRESHMAN'];

// Check advancement eligibility
const canAdvance = canAdvanceToNextLevel('FRESHMAN', studentProgress);

// Get curriculum summary
const summary = getCurriculumSummary();
```

---

## 📊 Content Distribution

| Level | Lessons | Focus Area |
|-------|---------|------------|
| **Orientation** | 15 | Literacy & vocabulary |
| **Freshman** | 100 | Credit factors & scoring |
| **Sophomore** | 100 | Rights & processes |
| **Junior** | 100 | Planning & strategy |
| **Senior** | 100 | Optimization & readiness |
| **Graduate** | 100 | Synthesis & application |
| **TOTAL** | **515** | **Complete mastery** |

---

## 🎯 Learning Outcomes

### By Level Completion

**Orientation Graduate**:
- Understands what credit is
- Can read a credit report
- Knows basic vocabulary

**Freshman Graduate**:
- Understands all 5 FICO factors
- Can explain cause-and-effect
- Knows score ranges

**Sophomore Graduate**:
- Knows consumer rights (FCRA, FDCPA)
- Understands dispute process
- Can manage credit responsibly

**Junior Graduate**:
- Understands qualification frameworks
- Can create financial plans
- Knows DTI and documentation

**Senior Graduate**:
- Demonstrates systems thinking
- Understands readiness indicators
- Can evaluate complex scenarios

**Graduate Graduate**:
- Synthesizes all knowledge
- Makes informed decisions
- Ready for ongoing learning

---

## ✅ Quality Standards

### Every Lesson Must

- ✅ Cite 2+ authoritative sources
- ✅ Follow level-specific extraction rules
- ✅ Avoid prohibited content
- ✅ Use institutional tone
- ✅ Include cultural compliance
- ✅ Provide educational value (not advice)

### Every Assessment Must

- ✅ Test level-specific knowledge
- ✅ Require 70%+ to pass
- ✅ Provide instant feedback
- ✅ Include explanations
- ✅ Cite sources

---

## 🚀 Future Expansion

### Planned Additions

**Vertical Tracks**:
- Kids curriculum (age-appropriate)
- Business credit vertical
- International credit systems

**Horizontal Expansion**:
- More lessons per level
- Additional quizzes
- More calculators
- Expanded glossary

**Advanced Features**:
- Adaptive learning paths
- Personalized recommendations
- Peer collaboration
- Certificate generation

---

## 📚 Documentation

**Related Files**:
- `BATCH_SYSTEM.md` - Content manufacturing
- `KNOWLEDGE_ECOSYSTEM.md` - Content inventory
- `FEATURE_CATALOG.md` - All features

**Code Files**:
- `src/lib/learning-levels.ts` - Core architecture
- `src/pages/LearningPath.tsx` - UI implementation
- `src/data/complete-100-lessons.ts` - Freshman content

---

**Credit U™ Progressive Learning Architecture**  
**Version**: 1.0.0  
**Last Updated**: January 21, 2026  

🎓 **Mastery-based learning at institutional scale** 🎓
