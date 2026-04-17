# 🔍 ROOT ARCHITECTURE MAP & SYSTEMS AUDIT
**Objective**: Comprehensive technical blueprint, drift reporting, and prioritized remediation strategy.
**Environment**: Local (Windows / PowerShell)

---

## 📂 1. Directory Map
*Top-level & key architectural folders representing the structural division of the application.*

```text
src/
├── components/          // Core UI primitives & shared fragments.
│   ├── auth/            // Security guards (RequireAuth.tsx, DormWeekGuard.tsx)
│   ├── dashboard/       // Command Center widgets
│   ├── professor/       // Interactive AI Professor logic (Some heavily orphaned)
│   └── ui/              // Generic UI components (shadcn/radix implementations)
├── lib/                 // Core business logic & API services
│   ├── client-curriculum.ts  // The master map connecting Slugs to Cinematic renders
│   └── supabase.ts      // The master database hook
├── nodes/               // The "Next Generation" feature architecture
│   ├── DormWeekPreReg/  // Active admission funnel
│   └── DisputeLab/      // Built but isolated logic for generating legal letters
├── pages/               // The View Layer
│   ├── admin/           // Back-office tools (AdminDashboard, UserManager)
│   ├── credit-lab/      // The Old Platform Generation (ReportAuditor, SecurityFreeze)
│   ├── public/          // Unprotected marketing & landing pages
│   └── tools/           // The New Platform Generation (Calculators, Interactive quizzes)
```
*Exact commands used: In-memory AST analysis combined with Native System Context (`list_dir` equivalent).*

---

## 🚦 2. Router Map (`src/App.tsx`)
*All declared routes mapped to their component targets.*

| Route Path | Target Component | Status | Source Line |
| :--- | :--- | :--- | :--- |
| `/` | `CreditUniversityLanding` | ✅ REACHABLE | `App.tsx:L97` |
| `/admissions/*` | `DormWeekPreReg` | ✅ REACHABLE | `App.tsx:L100` |
| `/learn/:trackSlug/:lessonSlug` | `CoursePlayer` | ✅ REACHABLE | `App.tsx:L105` |
| `/dashboard` | `StudentDashboard` | ✅ REACHABLE | `App.tsx:L138` |
| `/dashboard/tools` | `ToolsHub` | ✅ REACHABLE | `App.tsx:L146` |
| `/dashboard/course/:id` | `CoursePlayer` | ⚠️ BROKEN (Missing Slugs) | `App.tsx:L143` |
| `/dashboard/dream-architect` | `DreamArchitect` | 👻 GHOST (Unlinked) | `App.tsx:L139` |
| `/dashboard/financial-nervous-system` | `FinancialNervousSystem` | 👻 GHOST (Unlinked) | `App.tsx:L140` |
| `/dashboard/vault` | `TheVault` | 👻 GHOST (Unlinked) | `App.tsx:L153` |
| `/dashboard/community` | `GlobalCampus` | 👻 GHOST (Unlinked) | `App.tsx:L165` |

---

## 🧭 3. Navigation Map
*What links exist in the UI vs. what routes are available.*

**Sidebar (`CampusLayout.tsx` & `StudentHeader.tsx`)**
- 🔘 **Active:** Home, Profile, Honor Roll, Public View.
- 🔴 **Missing:** No direct links to Vault, Global Campus, or Dream Architect.

**Command Center Main Grid (`StudentDashboard.tsx`)**
- 🔘 **Active:** Curriculum, Tools Hub, Moo Store.
- 🔴 **Ghost Linked:** "Student Locker" and "Dream Architect" render empty "Coming Soon" states rather than navigating to their existing `/locker` and `/dashboard/dream-architect` routes.

---

## 🔐 4. Access-Control Map
*How auth is checked locally and remotely.*

- **Provider:** Supabase Auth (`@supabase/supabase-js: 2.39.3`)
- **Guard Wrapper:** `RequireAuth.tsx` (`src/components/auth/RequireAuth.tsx:L15`)
- **Role/Tier Checks:** Supports role checks (`['admin', 'dean', 'student']`) but **does NOT enforce subscription tiers** (Free vs. Elite). Academic progress is tracked as `academic_level` in `ProfileContext.tsx` but is entirely soft-gated on the UI.
- **The "Skeleton Key" Bypass:** 
  - `RequireAuth.tsx:L13` allows `?bypass=true` on localhost to circumvent authentication loops ENTIRELY, functioning as an active local God Mode.

---

## 📦 5. Dependency Risk Map
*Factors threatening build times, cold start performance, and remote deployment.*

**Critical Build Risks (`package.json`)**
1. **WebGL / 3D Engines:** `@mkkellogg/gaussian-splats-3d`, `three`, `@types/three`. These dependencies are massive, and while they power the `AdvancedProfessorPlayer.tsx` logic, because the component is globally accessible, Vite attempts to chunk the 3D libraries causing Vercel's standard tier to Time Out out or fail memory limits outright.
2. **Heavy Legacy Parsers:** `pdfjs-dist` and `html2pdf.js` are known bundle-bloaters.
3. **Audio AI:** `@deepgram/sdk` is installed but underutilized.

---

## 👻 6. Orphan Map
*Valid code that is rotting off the main branch.*

- **The `public` Clones:** `DormWeek.tsx`, `DormWeek_TAKEOVER_BACKUP.tsx`, `DormWeek_CINEMATIC_BACKUP.tsx`. These are fully styled, 1500+ line documents sitting in `src/pages/public/` entirely eclipsed by the new `src/nodes/DormWeekPreReg` branch.
- **`AdvancedProfessorPlayer.tsx`:** The most technically heavy component in the codebase. It has Gaussian Splat rendering logic for a 3D professor AI, but is commented out/never imported.

---

## ⚙️ 7. Pipeline Map

- **GitHub Actions (`.github/workflows`):** 🔴 **MISSING ENTIRELY**. The repository has zero Continuous Integration (CI). No automated linting or testing runs on push.
- **Vercel Deployments:** Fails downstream due to Vite memory chunking limits and native dependencies (WebGL). Because there is no GitHub action filtering bad commits, broken code goes straight to Vercel and crashes the environment.

---

## 💾 8. Backend Contract Map
*Supabase integrations actively called by the frontend.*

**Expected Tables (From Context Checks)**
- `profiles`
- `student_progress`
- `student_moo_points`
- `student_streaks`
- `lessons`

**Expected RPCs (`supabase.rpc`)**
- `upsert_lesson_completion(p_lesson_id, p_module_id, p_phase_id, p_points_reward)`: Called by `CoursePlayer.tsx:L158`. If this function is missing in the live Supabase SQL editor, the entire Gamification loop fails silently and falls back to LocalStorage caching.

---

## ⚠️ 9. Drift Report
**Claimed Architecture vs. Actual Reality**

- **Claimed:** "Phased Academic Unlocks (Freshman vs Senior) with heavy Gamification."
- **Actual:** The system is an open playground. The `CoursePlayer` handles gamification natively without restricting URLs. A user could manually type `/learn/senior-foundations/some-lesson` and bypass the Freshman curriculum entirely because the router lacks Hard State verification.
- **Claimed:** "Dispute Wizard Automation via nodes."
- **Actual:** The Dispute Lab is built, but the Dashboard pushes users to the old `List` views rather than the Interactive Node flows.

---

## 🛠️ 10. Prioritized Remediation List

### P0 (Critical - System Integrity)
- **Action:** Delete/De-link heavy WebGL dependencies (`gaussian-splats-3d`, `three`) causing Vercel build failures.
- **Effort:** Low (Remove from `package.json`, delete `AdvancedProfessorPlayer.tsx`).
- **Blast Radius:** High (Restores ability to deploy live).

### P1 (High - User Experience & Routing)
- **Action:** Clean up "Dorm Week" duplicates in `src/pages/public/` and formally solidify the `nodes/DormWeekPreReg` structure to eliminate developer confusion and CSS leaking.
- **Effort:** Low-Medium.
- **Blast Radius:** Medium.

### P2 (Medium - Feature Restoration)
- **Action:** Link existing "Ghost Features" (Dream Architect, Vault, Dispute Wizard, Neural Network) directly to the `COMMAND_CENTER_APPS` grid in `StudentDashboard.tsx` to utilize already-written code.
- **Effort:** Very Low (Changing router strings in `data` arrays).
- **Blast Radius:** Low.

### P3 (Infrastructure Debt)
- **Action:** Implement a `.github/workflows/main.yml` to run `npm run lint` and `npm run build` locally before pushing to Vercel. 
- **Effort:** Low.
- **Blast Radius:** Systemically stabilizing.
