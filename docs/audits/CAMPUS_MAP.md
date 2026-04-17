# 🗺️ CAMPUS MAP: CREDIT U STRUCTURAL BLUEPRINT
**Status:** Visual Sitemap & Component Mapping Document
**Environment:** localhost:5173 (v2.1.0 TAKEOVER)

---

## 1. 🗂️ THE FILE TREE (THE INFRASTRUCTURE)

Below is the simplified structure of your application, highlighting active logic versus duplicate/abandoned folders.

```text
src/
├── components/          ✅ Core UI elements.
│   ├── auth/            ✅ RequireAuth checks (Role-based gating).
│   ├── cinematic/       ✅ Cinematic video and briefing loaders.
│   ├── dashboard/       ✅ Main components (MooPointWallet, BureauSyncStatus).
│   └── professor/       👻 Unmounted logic (AdvancedProfessorPlayer.tsx uses heavy 3D WebGL).
├── nodes/               ✅ The "New Gen" logic architecture.
│   ├── DormWeekPreReg/  ✅ ACTIVE Dorm Week Routing and Registration.
│   ├── DormWeekHub/     ✅ ACTIVE Acceptance/Protocol logic.
│   └── DisputeLab/      👻 Dispute execution waiting to be integrated.
├── pages/               
│   ├── admin/           ✅ Back-office tools.
│   ├── credit-lab/      👻 OLD Ghost features (DisputePage.tsx, SimulatorPage.tsx). These have been culturally replaced by 'ToolsHub' and 'tools/' folder.
│   ├── public/          ⚠️ DUPLICATE CITY
│   │   ├── DormWeek.tsx                 👻 Abandoned (Replaced by 'nodes' framework).
│   │   ├── DormWeek_TAKEOVER_BACKUP.tsx 👻 Orphaned backup file.
│   │   ├── DormWeek_CINEMATIC_BACKUP.tsx👻 Orphaned backup file.
│   │   ├── Tuition_Legacy_3Tier.tsx     👻 Orphaned pricing page.
│   │   └── CreditUniversityLanding.tsx  ✅ Active Front Door.
│   └── tools/           ✅ Highly active interactive calculators and wizards.
```

---

## 2. 🖥️ THE UI LAYOUT MAP (THE STUDENT VIEW)
*Mapping what is actually requested and what is actively rendered on the Student Dashboard (`/dashboard`).*

| Section | Active Component | Missing / Ghost Link 👻 |
| :--- | :--- | :--- |
| **Top Navigation** | `StudentHeader.tsx` + `HeaderSyncStatus.tsx` | No visible Sub-tiering indicator (Freshman vs Senior is hidden). |
| **Left Sidebar** | System native `CampusLayout` router | Links to Dream Architect & Settings exist, but no internal tracking map. |
| **Right Sidebar** | `CreditUTV.tsx` (Dr. Leverage Video) | `AdvancedProfessorPlayer.tsx` ⚠️ (The 3D professor engine is completely detached from the UI). |
| **Top Stats Row** | `MooPointWallet`, `BureauSyncStatus` | `TruthLens` component or logic completely missing from repo. |
| **Main Grid** | `COMMAND_CENTER_APPS` Map (Data Array) | `StudentLocker`, `DreamArchitect` cards exist but say "Coming Soon". |
| **Middle Feed** | `FoundationCoreClass` (Syllabus Grid) | `FinancialNervousSystem.tsx` 👻 (Built but unlinked). |
| **Lower Level** | `AchievementGallery` | `DisputeWizard.tsx` 👻 (Exists in components folder but unlinked on dashboard). |

---

## 3. 🎬 THE CINEMATIC ASSET INVENTORY
*Found in `/public/assets/cinematic/`. These heavy assets are wired into `/src/lib/client-curriculum.ts` but are invisible unless the exact course slug is hit.*

| Status | Asset Filenames | Assigned Location / Trigger |
| :--- | :--- | :--- |
| ✅ | `freshman_intro_gates.png`, `sovereign_student.png`, `800_gauge.png`, `success_pillar.png` | **"Welcome to the Wealth Game"** (Lesson 1) |
| ✅ | `algorithm_matrix_blueprint.png`, `data_matrix_flow.png` | **"The Matrix"** (Lesson 1.2) |
| ✅ | `five_pillars_gold.png`, `hand_pillar_method.png` | **"The 5 Pillars"** (Lesson 1.3) |
| ✅ | `leverage_scale_navy.png`, `toxic_debt_vortex.png` | **"Debt vs Leverage"** (Lesson 1.4) |
| 👻 | `junior_cfpb_command_center.png`, `junior_bureau_vault.png`, `junior_dispute_engine.png`, `junior_fcra_sanctum.png`, `junior_identity_shield.png`, `junior_metro2.png`, `junior_negotiation.png` | **Junior CFPB Module Reel** (Assigned in code, but user physically cannot access Junior Phase yet) |
| 👻 | `sophomore_audit_command_elite.png`, `sophomore_audit_magnifier.png`, `sophomore_bureau_deepdive_elite.png`, `sophomore_bureau_sanctum.png`, `sophomore_fdcpa_shield.png`, `sophomore_identity_restoration_elite.png`, `sophomore_identity_shield.png`, `sophomore_judgment_hammer.png`, `sophomore_legal_arsenal_elite.png`, `sophomore_legal_scroll.png`, `sophomore_settlement.png`, `sophomore_strategic_dispute_elite.png`, `sophomore_validation_seal.png`, `sophomore_zombie_debt.png` | **Sophomore Audit Reel** (14 Massive Assets! Hardcoded into `FRESH-CF-051` to `100` tracks which are currently impossible to reach on UI). |
| 👻 | `sovereign_hoodie_avatar.png`, `trust_scoreboard_digital.png`, `wealth_shield_blueprint.png` | **Floating Legacy Reels** (Used as fallbacks or attached to inaccessible modules). |

---

## 4. 🔗 THE "GHOST ROUTE" REGISTRY
*Listed from your `App.tsx` router configuration. Look at how many endpoints your system is carrying that lead to nowhere!*

### The Main Application Core
- ✅ `[LIVE]` `/` (CreditUniversityLanding)
- ✅ `[LIVE]` `/login` (Login Page)
- ✅ `[LIVE]` `/admissions` (Dorm Week Nodes)
- ✅ `[LIVE]` `/dashboard` (The Command Center)
- ✅ `[LIVE]` `/dashboard/tools` (Tools Hub - The primary replacement for older modules)
- ✅ `[LIVE]` `/learn/:trackSlug` (The modern curriculum learning paths)

### The Ghost Routes (Abandoned or Underdeveloped)
- 👻 `[GHOST]` `/dashboard/dream-architect` (Endpoint active, but leads to blank/placeholder UI)
- 👻 `[GHOST]` `/dashboard/financial-nervous-system` (Endpoint active, but unlinked from Dashboard)
- 👻 `[GHOST]` `/dashboard/neural-network` (Endpoint active, but unlinked from Dashboard)
- 👻 `[GHOST]` `/dashboard/vault` (The Vault code exists but unlinked)
- 👻 `[GHOST]` `/dashboard/lecture-hall` (Lecture Hall code exists but unlinked)
- 👻 `[GHOST]` `/dashboard/community` (Global Campus exists but unlinked)
- 👻 `[GHOST]` `/locker` (StudentLocker route exists outside of dashboard layout inexplicably)
  
### The Orphaned "Lab" URLs (Superceded Code)
*These URLs exist and have logic inside `src/pages/credit-lab/`, but you've replaced them all visually with the new `ToolsHub` cards, stranding them.*
- 👻 `[ORPHANED]` `/dashboard/credit-lab`
- 👻 `[ORPHANED]` `/dashboard/credit-lab/dispute`
- 👻 `[ORPHANED]` `/dashboard/credit-lab/simulator`
- 👻 `[ORPHANED]` `/dashboard/credit-lab/audit`
- 👻 `[ORPHANED]` `/dashboard/credit-lab/audit-checklist`
- 👻 `[ORPHANED]` `/dashboard/credit-lab/freeze`
- 👻 `[ORPHANED]` `/dashboard/credit-lab/identity-theft`
- 👻 `[ORPHANED]` `Legacy Aliases`: `/dashboard/lab`, `/dashboard/voice`, `/dashboard/consumer-law`

### Broken / Crashing Endpoints
- ⚠️ `[BROKEN]` `/dashboard/course/:id` (Legacy link format that currently spins indefinitely because it lacks the `trackSlug` syntax needed for the new Course Player architecture. I patched the dashboard buttons to avoid this, but the route itself is dead weight). 
- ⚠️ `[BROKEN]` All references to `@mkkellogg/gaussian-splats-3d` are destroying Vercel deployments.
