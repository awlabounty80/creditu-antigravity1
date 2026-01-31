# Credit U™ - Quick Reference Guide

## 🚀 Getting Started

### Development Server
```bash
npm run dev
# Access at http://localhost:5173
```

### Build for Production
```bash
npm run build
npm run preview
```

---

## 📍 Navigation Map

### Public Routes
- `/` - Landing page
- `/gate` - Admissions portal (Variant A)
- `/gate-b` - Admissions portal (Variant B)
- `/gate-c` - Admissions portal (Variant C)
- `/tour` - Campus tour
- `/login` - Authentication

### Student Dashboard Routes
- `/dashboard` - Command Center (main dashboard)
- `/dashboard/curriculum` - Course catalog
- `/dashboard/course/:id` - Video lesson player
- `/dashboard/knowledge` ⭐ - Knowledge Center (NEW)
- `/dashboard/quest` - Credit Quest game
- `/dashboard/credit-lab` - Financial tools hub
- `/dashboard/credit-lab/dispute` - Dispute letter wizard
- `/dashboard/credit-lab/simulator` - Score simulator
- `/dashboard/credit-lab/audit` - Report auditor
- `/dashboard/credit-lab/freeze` - Security freeze tool
- `/dashboard/vision` - Vision board
- `/dashboard/store` - Moo Store (rewards)
- `/dashboard/community` - Global campus
- `/dashboard/settings` - User settings

---

## 📚 Content Files

### Lessons & Curriculum
- `src/data/complete-100-lessons.ts` - Master 100-lesson file
- `src/data/lessons-11-25.ts` - Credit Reports & Bureaus
- `src/data/lessons-26-50.ts` - Credit Building
- `src/data/lessons-51-75.ts` - Debt Management
- `src/data/lessons-76-100.ts` - Advanced Strategy

### Knowledge Base
- `src/data/knowledge-base.ts` - Articles (FCRA, Credit Utilization)
- `src/data/quizzes.ts` - Interactive quizzes with grading
- `src/data/calculators.ts` - Educational calculators
- `src/data/glossary.ts` - Legal definitions

### Infrastructure
- `src/lib/media-factory.ts` - Content governance
- `src/lib/batch-processor.ts` - Lesson manufacturing
- `src/lib/knowledge-policy.ts` - Source authorization
- `src/lib/guide-persona.ts` - AI persona configuration

---

## 🎓 Key Features

### Knowledge Center (`/dashboard/knowledge`)
**Tabs**:
- Articles - Long-form educational content
- Quizzes - Interactive assessments
- Calculators - Financial planning tools
- Glossary - Searchable legal definitions

**Features**:
- Universal search
- Source citations
- Tabbed navigation
- Responsive design

### Course Player
**Features**:
- Video playback
- Field Notes (lesson annotations)
- Progress tracking
- Next lesson navigation

### Credit Lab
**Tools**:
- Dispute Wizard - FCRA-compliant letters
- Score Simulator - Credit impact calculator
- Report Auditor - Error identification
- Security Freeze - Bureau freeze management

### Gamification
**Systems**:
- Moo Points (reward currency)
- Credit Quest (scenario game)
- Progress tracking
- Achievement system

---

## 🔧 Configuration

### Environment Variables
Create `.env.local`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Supabase Tables
- `profiles` - User profiles
- `courses` - Course catalog
- `enrollments` - Student enrollments
- `progress` - Lesson completion tracking
- `rewards` - Moo Store items

---

## 📊 Content Manufacturing

### Generate Lessons
```typescript
import { process100Lessons } from '@/lib/process-100-lessons';
await process100Lessons();
```

### Execute Calculator
```typescript
import { executeCalculator } from '@/data/calculators';
const result = executeCalculator('CALC-001', {
  totalBalances: 3000,
  totalLimits: 10000
});
```

### Grade Quiz
```typescript
import { calculateQuizScore, QUIZZES } from '@/data/quizzes';
const result = calculateQuizScore(QUIZZES['QUIZ-001'], userAnswers);
```

---

## 🎨 Design System

### Colors
- **Primary**: Indigo (600, 500, 400)
- **Secondary**: Purple (600, 500, 400)
- **Accent**: Amber (500, 400, 300)
- **Background**: `#020412` (dark blue-black)
- **Surface**: `#0A0F1E` (elevated dark)

### Typography
- **Headings**: `font-heading` (custom font)
- **Body**: `font-sans` (system font stack)
- **Mono**: `font-mono` (for IDs, codes)

### Components
- All UI components from `shadcn/ui`
- Custom components in `src/components/`
- Layouts in `src/layouts/`

---

## 🔐 Authentication

### Login Flow
1. User enters email/password at `/login`
2. Supabase Auth validates credentials
3. Session stored in localStorage
4. Redirect to `/dashboard`

### Protected Routes
- All `/dashboard/*` routes require authentication
- `RequireAuth` component wraps protected content
- Automatic redirect to `/login` if unauthenticated

---

## 📈 Data Flow

### User Profile
```
Login → Supabase Auth → useProfile hook → Profile data
```

### Course Enrollment
```
Enroll → Supabase enrollments table → useCourse hook → Course data
```

### Progress Tracking
```
Complete lesson → Update progress table → Refresh dashboard stats
```

### Points System
```
Action → Award points → Update profile.moo_points → Display in header
```

---

## 🛠️ Common Tasks

### Add a New Lesson
1. Add to appropriate lessons file in `src/data/`
2. Follow `BatchLessonDefinition` interface
3. Include teaching objective and structure points
4. Verify sources

### Add a New Quiz
1. Add to `src/data/quizzes.ts`
2. Follow `Quiz` interface
3. Include questions with explanations
4. Cite sources

### Add a New Calculator
1. Add to `src/data/calculators.ts`
2. Define inputs and formula
3. Add interpretation logic
4. Include disclaimers

### Add a New Page
1. Create component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation item in `src/layouts/CampusLayout.tsx`
4. Test routing

---

## 📝 Content Standards

### Required for All Content
- ✅ 2+ source verification
- ✅ Legal accuracy (FCRA/FDCPA)
- ✅ Educational focus (not advice)
- ✅ Cultural compliance (HBCU excellence)
- ✅ No guarantees or promises

### Authorized Sources
1. Federal law (.gov)
2. Credit bureaus (Experian, Equifax, TransUnion)
3. FICO/myFICO educational materials
4. CFPB consumer education
5. Federal Reserve banking standards

---

## 🚨 Troubleshooting

### Videos Not Playing
- Check `/public/assets/` for video files
- Verify paths in `useCourse.ts`
- Check browser console for errors

### Supabase Connection Issues
- Verify `.env.local` variables
- Check Supabase project status
- Confirm API keys are correct

### Build Errors
- Run `npm install` to update dependencies
- Check for TypeScript errors
- Verify all imports are correct

---

## 📚 Documentation Files

- `README.md` - Project overview
- `BATCH_SYSTEM.md` - Content manufacturing guide
- `KNOWLEDGE_ECOSYSTEM.md` - Content inventory
- `DEPLOYMENT_SUMMARY.md` - System overview
- `PRODUCTION_CHECKLIST.md` - Launch readiness
- `QUICK_REFERENCE.md` - This file

---

## 🎯 Quick Commands

```bash
# Start development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check

# Lint
npm run lint
```

---

**Credit U™ v1.0.0**  
**Last Updated**: 2026-01-20  
**Status**: Production Ready  

🎓 **Built with institutional excellence** 🎓
