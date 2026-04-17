# 🗺️ MASTER RELOCATION MAP
*Credit U Architecture Source of Truth — Post-Zoning Phase*

This document serves as the absolute blueprint for where the Credit U infrastructure currently lives and exactly how it connects. 

---

## 1. LIVE ACTIVE FILES
The core stabilized engines driving the platform.

*   `src/App.tsx`
    *   **Role**: Master router and route protector.
    *   **Route**: N/A (Handles all incoming URLs)
*   `src/pages/StudentDashboard.tsx`
    *   **Role**: The primary student UX, command center, and curriculum launcher.
    *   **Route**: `/dashboard`
*   `src/campus/registrar/dorm-week/DormWeekPreReg.tsx` **[CANONICAL DORM WEEK]**
    *   **Role**: The official Fall intake and Dorm Week enrollment onboarding.
    *   **Route**: `/orientation/dorm-week`
*   `src/campus/academic/labs/fns/FinancialNervousSystem.tsx`
    *   **Role**: Freshman Core Class; emotional reset and financial behavior regulation.
    *   **Route**: `/dashboard/labs/financial-nervous-system`
*   `src/pages/DreamArchitect.tsx`, `src/pages/NeuralNetwork.tsx`, `src/components/credit-lab/DisputeWizard.tsx`
    *   **Role**: High-value "Ghost Tools" waiting to be connected. 
    *   **Route**: Mapped internally, currently unreachable without manual URL.
*   `src/components/dashboard/AdvancedProfessorPlayer.tsx`
    *   **Role**: Stable HTML5 fallback dropping in securely to replace the heavy 3D WebGL engine.

---

## 2. ARCHIVED / RETIRED FILES
Siloed to prevent technical drift or duplicate confusion. **Zero active references exist to these files.**

*   `archive/AdvancedProfessorPlayer.tsx`
    *   **Former Role**: The original `three.js` volumetric 3D spline player that caused Vercel OOM crashes.
*   `archive/dorm-week/DormWeek.tsx`
    *   **Former Role**: Legacy dormant public page clone for onboarding.
*   `archive/dorm-week/DormWeekPreReg.tsx`
    *   **Former Role**: Duplicate pre-registration public page component. 
*   `archive/dorm-week/DormWeekFlowA.tsx`
    *   **Former Role**: Defunct secondary initiation sequence variant.
*   `archive/dorm-week/DormWeekHub.tsx`
    *   **Former Role**: Old unified component interface, replaced by segmented UI.

---

## 3. ROUTE MAP
The definitive and secure navigation paths established in `App.tsx`.

| Physical Route String | Component Rendered | Aliases & Redirects |
| :--- | :--- | :--- |
| `/` | `CreditUniversityLanding` | None |
| `/login` | `Login` | Auth check |
| `/dashboard` | `StudentDashboard` | `RequireAuth` protected |
| `/dashboard/labs/financial-nervous-system` | `FinancialNervousSystem` | Redirects from `/dashboard/financial-nervous-system` |
| `/orientation/dorm-week` | `DormWeekPreReg` | Redirects from `/admissions`, `/apply`, `/accepted`, `/gate`, `/dorm-week` |
| `/dorm-week/protocol` | `Orientation` | Requires `<DormWeekGuard>` Auth | 
| `/dashboard/curriculum` | `Curriculum` | Redirects from `/curriculum` |
| `/onboarding` | `OnboardingVault` | `RequireAuth` protected |

*(Note: Wildcard `*` routes currently fall back to `/admissions` which natively forces a secondary bounce redirect to `/orientation/dorm-week`)*

---

## 4. DASHBOARD / CURRICULUM MAP
The visual grouping elements inside the Student Command Center (`/dashboard`).

| Card / Module | Source UI Target | Route Destination | Student Placement |
| :--- | :--- | :--- | :--- |
| **Financial Nervous System™** | `StudentDashboard.tsx` Inline UI | `/dashboard/labs/financial-nervous-system` | Freshman Core Class |
| **Personal Credit Track** | `<FoundationSyllabi>` (via LearnHub) | `/learn/personal-credit` | All Tracks |
| **Business Credit Track** | `<FoundationSyllabi>` (via LearnHub) | `/learn/business-credit` | All Tracks |
| **Dean's Honor Roll** | `StudentDashboard.tsx` Side-Column | `/dashboard/honor-roll` | Leaderboard Qualifier |
| **Funding Visibility Lab** | `StudentDashboard.tsx` Side-Column | `/dashboard/lab` | Deep Research Status |
| **Voice Command Lab** | `StudentDashboard.tsx` Side-Column | `/dashboard/voice-training` | Deep Research Status |
| **Active Mission Timer** | `StudentDashboard.tsx` Hero Element | Driven by User Profile Data | Global Gamification |

---

## 📍 EXACT LOCATION DIRECTORY

*   **Canonical Dorm Week Directory:** 
    `src/campus/registrar/dorm-week/`
*   **Archived Dorm Week Silo:** 
    `archive/dorm-week/`
*   **39 Cinematic Media Assets:** 
    `public/assets/cinematic/`
*   **Active Audit Markdown Documents:**
    *   `docs/audits/ARCHITECTURE_MAP.md`
    *   `docs/audits/CAMPUS_BLUEPRINT.md`
    *   `docs/audits/CAMPUS_MAP.md`
    *   `docs/audits/CLEANUP_PRIORITY_1.md`
    *   `docs/audits/LAB_INVENTORY.md`
    *   `docs/audits/PASS_1_REPORT.md`
    *   `docs/audits/PASS_2_REPORT.md`
    *   `docs/audits/PRODUCTION_AUDIT.md`
