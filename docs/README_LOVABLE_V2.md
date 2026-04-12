# Credit U: Lovable V2 Integration Manual

## System Overview
This document represents the final state of the **Credit U Platform** after the successful ingestion of the "Lovable" prototype logic. The system has been upgraded to a "Sovereign" aesthetic (Deep Blue/Gold) and features a robust parallel architecture.

## 1. New Core Modules

### A. The Student Dashboard (V2)
**Route:** `/dashboard/v2`
- **Features:**
  - **Holographic ID Card:** Dynamically displays Student ID, Clearance Level, and Moo Points.
  - **Quick Actions FAB:** Floating action button for rapid access to Disputes and Support.
  - **Logic Engine:** `FoundationCoreClass` tracks lesson progress and awards confetti bursts.

### B. The Credit Lab (Hub)
**Route:** `/dashboard/credit-lab`
- **Deep Links:**
  - **Dispute Wizard:** `/dashboard/credit-lab/dispute` (AI-powered letter generation)
  - **FICO Simulator:** `/dashboard/credit-lab/simulator` (Placeholder)
  - **Report Auditor:** `/dashboard/credit-lab/audit` (Placeholder)
- **Status:** All tools are linked and routing is corrected.

### C. The Curriculum (LMS)
**Route:** `/dashboard/curriculum`
- **Content:**
  - Credit 101: The Rules of the Game
  - Dispute Tactics: Legal Jiu-Jitsu
  - Business Funding: Bag Security
  - Real Estate Leverage (Locked)
- **Data Source:** Synced with Supabase `courses` table.

## 2. Authentication Logic
- **Magic Link Behavior:** 
  - New users are **blocked** from signup (Invite Only).
  - Existing users are redirected **immediately** to `/dashboard/v2` upon clicking the email link.
  - A fail-safe on the Landing Page (`/`) auto-forwards authenticated users to the dashboard.

## 3. Database Schema (Supabase)
To ensure full functionality, the following SQL scripts must be applied (if not already):
1.  `supabase/lms_schema.sql` (Curriculum & Progress)
2.  `supabase/lesson_progress.sql` (RPC functions for XP)
3.  `supabase/moo_store_v2.sql` (Rewards System)

## 4. Verification Checklist
- [x] Login via Magic Link -> Redirects to Dashboard.
- [x] Dashboard V2 loads without errors.
- [x] ID Card shows correct user initials/data.
- [x] "Resume Training" button links to Curriculum.
- [x] Credit Lab Hub displays all tools.
- [x] "Dispute Wizard" link opens the Wizard page (not the Hub).
- [x] Curriculum shows the 4 core courses.

## 5. Developer Notes
- **Dependencies:** `html2pdf.js` is required for the Dispute Wizard.
- **Styling:** All new components use `tailwind-merge` and `lucide-react`.
- **State:** `useGamification` and `useProfile` are the primary hooks for global state.

**Status:** ALL SYSTEMS OPERATIONAL.
