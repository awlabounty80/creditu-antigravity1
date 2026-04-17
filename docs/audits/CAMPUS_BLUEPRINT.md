# 🏛️ CAMPUS BLUEPRINT & ZONING MAP
**Objective:** Physical Layout, Hidden Labs, and Dependency Topography.

*This document segments the Credit U repository into 4 operational zones:*
- 💎 **The Vault:** (Waiting/Orphaned assets requiring a player or trigger)
- 👻 **The Lab:** (Engineered but unlinked endpoints requiring UI connections)
- ⚠️ **The Dorm:** (Redundant "Rush" vs "Evergreen" code needing merging)
- 🧱 **The Boiler Room:** (Heavy infrastructure dependencies destroying deployment)

---

## 🏗️ 1. The Physical Layout (File Tree)
*A map of the Core Engines (`/src/nodes`) vs the Legacy Pages (`/src/pages`).*

```text
src/
├── nodes/                           ✅ ACTIVE
│   ├── DormWeekPreReg/              ✅ Active: DormWeekPreReg.tsx
│   ├── DormWeekHub/                 ✅ Active: DormWeekHub.tsx
│   └── DisputeLab/                  👻 The Lab: DisputeLab.tsx (Unlinked)
└── pages/
    ├── public/                      ⚠️ THE DORM (REDUNDANT DUPLICATION)
    │   ├── CreditUniversityLanding.tsx  ✅ Active
    │   ├── DormWeek.tsx                 ⚠️ Redundant Ghost
    │   ├── DormWeek_CINEMATIC_BACKUP.tsx⚠️ Redundant Ghost
    │   ├── DormWeek_TAKEOVER_BACKUP.tsx ⚠️ Redundant Ghost
    │   └── Tuition_Legacy_3Tier.tsx     ⚠️ Redundant Ghost
    ├── credit-lab/                  👻 THE LAB (OLDER GENERATION)
    │   ├── DisputePage.tsx          👻 Redundant (Replaced by Tools Hub)
    │   ├── SimulatorPage.tsx        👻 Redundant (Replaced by Tools Hub)
    │   └── ReportAuditor.tsx        👻 Redundant (Replaced by Tools Hub)
    └── campus/
        └── StudentLocker.tsx        💎 The Vault (Built but unlinked)
```

---

## 🧭 2. The UI Navigation Map (Router Inventory)
*Listing the 60+ endpoints found in `App.tsx` and mapping their Entry Points.*

| Endpoint URL | Component Target | UI Button Connection? | Status |
| :--- | :--- | :--- | :--- |
| `/` | `CreditUniversityLanding` | External Native | ✅ Active |
| `/login` | `Login` | External Native | ✅ Active |
| `/admissions` | `DormWeekPreReg` | From Landing | ✅ Active |
| `/learn/*` | `LearnHub` / `CoursePlayer` | Command Center -> Track | ✅ Active |
| `/dashboard` | `StudentDashboard` | Login Redirect | ✅ Active |
| `/dashboard/tools` | `ToolsHub` | Command Center Grid | ✅ Active |
| `/dashboard/tools/*` | Over 6 Calculator Tools | Inside Tools Hub | ✅ Active |
| `/dashboard/curriculum` | `Curriculum` | Command Center Grid | ✅ Active |
| `/dashboard/honor-roll` | `HonorRoll` | Top Navbar Link | ✅ Active |
| `/dashboard/vision` | `VisionBoard` | Settings Dropdown | ✅ Active |
| `/dashboard/settings` | `UserSettings` | Top Navbar Link | ✅ Active |
| `/dashboard/course/:id` | `CoursePlayer` (Old) | None | ⚠️ Broken |
| `/locker` | `StudentLocker` | None (Dashboard says "Coming Soon") | 💎 Vault |
| `/dashboard/dream-architect` | `DreamArchitect` | None (Dashboard says "Coming Soon") | 👻 Lab |
| `/dashboard/financial-nervous-system` | `FinancialNervousSystem` | None | 👻 Lab |
| `/dashboard/neural-network` | `NeuralNetwork` | None | 👻 Lab |
| `/dashboard/vault` | `TheVault` | None | 💎 Vault |
| `/dashboard/lecture-hall` | `LectureHall` | None | 💎 Vault |
| `/dashboard/community` | `GlobalCampus` | None | 👻 Lab |
| `/dashboard/credit-lab/*` | Over 6 Legacy Tools | None (Orphaned Layouts) | 👻 Lab |

---

## 🎬 3. The Cinematic Catalog (The Vault)
*The 39 massive `.png` assets in `/public/assets/cinematic/` matched to their backend logic.*

**Freshman Foundations (`getClientCourse()` mapping)**
- 💎 `freshman_intro_gates.png` (Lesson 1.1)
- 💎 `sovereign_student.png` (Lesson 1.1)
- 💎 `800_gauge.png` (Lesson 1.1)
- 💎 `success_pillar.png` (Lesson 1.1)
- 💎 `algorithm_matrix_blueprint.png` (Lesson 1.2)
- 💎 `data_matrix_flow.png` (Lesson 1.2)
- 💎 `five_pillars_gold.png` (Lesson 1.3)
- 💎 `hand_pillar_method.png` (Lesson 1.3)
- 💎 `leverage_scale_navy.png` (Lesson 1.4)
- 💎 `toxic_debt_vortex.png` (Lesson 1.4)

**Sophomore Audit Track (Unreachable Assets)**
*Assigned to `FRESH-CF-051` logic which has no UI hooks yet.*
- 💎 `sophomore_audit_command_elite.png`, `sophomore_audit_magnifier.png`, `sophomore_bureau_deepdive_elite.png`, `sophomore_bureau_sanctum.png`, `sophomore_fdcpa_shield.png`, `sophomore_identity_restoration_elite.png`, `sophomore_identity_shield.png`, `sophomore_judgment_hammer.png`, `sophomore_legal_arsenal_elite.png`, `sophomore_legal_scroll.png`, `sophomore_settlement.png`, `sophomore_strategic_dispute_elite.png`, `sophomore_validation_seal.png`, `sophomore_zombie_debt.png`

**Junior CFPB Command (Unreachable Assets)**
*Assigned to `FRESH-CF-080+` logic which has no UI hooks yet.*
- 💎 `junior_cfpb_command_center.png`, `junior_bureau_vault.png`, `junior_dispute_engine.png`, `junior_fcra_sanctum.png`, `junior_identity_shield.png`, `junior_metro2.png`, `junior_negotiation.png`

**Floating/Unassigned Assets**
- 💎 `sovereign_hoodie_avatar.png`, `trust_scoreboard_digital.png`, `wealth_shield_blueprint.png`, `hbcu_homecoming.png`, `hbcu_innovation.png`, `hbcu_matrix.png`, `hbcu_mentor.png`

---

## 🧪 4. The Hidden Lab Index
*The high-concept components sitting active in memory but completely dark on the UI.*

### 👻 The `DreamArchitect`
- **Location:** `src/pages/DreamArchitect.tsx`
- **Missing Front Door:** The Dashboard has a Card labeled "Dream Architect", but its `onClick` handler routes nowhere or displays a "Coming Soon" toast, instead of executing `navigate('/dashboard/dream-architect')`.

### 👻 The `FinancialNervousSystem`
- **Location:** `src/pages/FinancialNervousSystem.tsx`
- **Missing Front Door:** There is absolutely no button or `<Link>` in the entire `StudentDashboard.tsx` or `CampusLayout.tsx` pointing to `/dashboard/financial-nervous-system`. Unless manually typed in the URL bar, it does not exist.

### 👻 The `NeuralNetwork`
- **Location:** `src/pages/NeuralNetwork.tsx`
- **Missing Front Door:** Completely unlinked from any navigation array.

### 👻 The `DisputeWizard`
- **Location:** `src/components/credit-lab/DisputeWizard.tsx` (and `DisputeLab.tsx`).
- **Missing Front Door:** Was visually replaced by the non-wizard legacy cards inside the Tools Hub menu. The Wizard form is incredibly intricate but is floating entirely unmounted.

---

## 🧱 5. Dependency Weight Report (The Boiler Room)
*The 5 heaviest packages in `package.json` bringing down the Vercel architecture during Build Phase, and exactly where they are imported.*

| Heavy Dependency | Vercel Risk Level | Exact Files Importing It |
| :--- | :--- | :--- |
| `@mkkellogg/gaussian-splats-3d` | 🟥 FATAL (WebGL Timeout) | `src/components/dashboard/AdvancedProfessorPlayer.tsx` |
| `three` (and `@types/three`) | 🟥 FATAL (Memory Limit) | `src/components/dashboard/AdvancedProfessorPlayer.tsx` |
| `pdfjs-dist` | 🟧 HIGH (Large Canvas Buffer) | `src/lib/credit-parser.ts` |
| `html2pdf.js` | 🟨 MEDIUM (Client-side block) | `DisputeWizard.tsx`, `StudentLocker.tsx`, `DormResetCertificate.tsx`, `DownloadableCertificate.tsx`, `MooStore.tsx` |
| `@deepgram/sdk` | 🟨 MEDIUM | `src/lib/deepgram.ts` |
