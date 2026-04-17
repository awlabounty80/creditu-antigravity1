# 🔐 ACCESS CONTROL & PERMISSIONS AUDIT
*Master Security & Access Review for Credit U*

Based on my analysis of the `creditu-antigravity1` repository, the authentication layer is securely verifying identities via Supabase. However, your **authorization and curriculum gating logic is structurally vulnerable**. 

Currently, your access control is "All or Nothing." If a student gets inside the Dashboard, they have the keys to the entire campus if they know the URLs.

Here is the deep-dive report on your permission models.

---

### 1. CURRENT PERMISSION MODEL
Your existing model heavily relies on Identity checks (`user`) rather than Tier checks (`profile`). 
*   **The Gates**: You use `<RequireAuth>` inside `App.tsx` to wrap the `/dashboard` and `/onboarding` paths.
*   **Admins**: You employ `<RequireAuth allowedRoles={['admin', 'dean']}>` effectively to guard the `/admin` path.
*   **Dorm Week Guard**: You use `<DormWeekGuard>` specifically to ensure students have a `dorm_key` and limit registration periods based on global time-windows.
*   **Level System**: Your database `profiles` schema natively supports `academic_level` (`foundation`, `freshman`, `sophomore`, etc.) and `role` (`student`, `professor`, `admin`, `dean`), but these fields are not being enforced at the routing level for the main curriculum.

### 2. WEAK POINTS & BYPASS RISKS
**UI vs. Logic Vulnerability**
You restrict elements in the UI (e.g., hiding a button or rendering a card as disabled/locked), but you do not protect the *actual URL route*. 
*   If a Foundation-level student guesses or bookmarks `/dashboard/labs/financial-nervous-system` or `/learn/business-credit`, they can bypass all UI gating and consume the class immediately. 
*   Similarly, all Laboratory tools (Credit Simulator, Voice Training, Dispute Generator) are globally accessible to any user who simply adds the right string to the end of your root domain.

**Guest Bypass Logic**
In `CoursePlayer.tsx`, there is existing logic allowing a fallback to track gamification points via `localStorage` if an Admissions Email is present. This is designed for prospective students, but creates a loophole where critical core payload data could be accessed via local storage spoofing. 

### 3. EXACT FILES CONTROLLING ACCESS
*   **`src/components/auth/RequireAuth.tsx`**: The master gatekeeper.
*   **`src/components/auth/DormWeekGuard.tsx`**: Specialized protocol logic for Dorm Week.
*   **`src/App.tsx`**: Where the Guard wrappers are physically mounted to the DOM tree.
*   **`src/context/ProfileContext.tsx`**: The source of truth for the active `academic_level` and `role`.
*   **`src/pages/learn/TrackView.tsx` & `CoursePlayer.tsx`**: The exact files currently rendering tracks *without* verifying the student's `academic_level` against the `track.level`.

### 4. RECOMMENDED CENTRALIZED PERMISSION STRUCTURE
We need to upgrade the existing `<RequireAuth>` wrapper to support a `requiredLevel` property alongside the existing `allowedRoles` property.

*   **Freshman Gates**: `<RequireAuth requiredLevel={['freshman', 'sophomore', 'junior', 'senior', 'graduate']}>`
*   **Free vs Premium**: Add an `is_premium` or `subscription_tier` flag to the `Profile` context so you can lock high-tier tools (Dispute Lab) behind payment walls securely.
*   **Route Redirects**: Any student hitting an unauthorized protected route should be immediately bounced back to `/dashboard` with a toast alert: "Access Denied: You have not reached this academic level yet."

### 5. SAFEST IMPLEMENTATION SEQUENCE
Do not attempt to do this all in one file. Follow this sequence:

1.  **Phase 1**: Update `ProfileContext.tsx` to ensure `academic_level` and `subscription_tier` drop into the app context securely upon login.
2.  **Phase 2**: Refactor `RequireAuth.tsx` to intercept `requiredLevel` props. If the user hits a route above their paygrade, intercept and bounce them. 
3.  **Phase 3**: Wrap the high-level routes inside `App.tsx` natively with the upgraded `<RequireAuth>` container (e.g., gating `/learn/business-credit`, FNS, and the Dispute Lab).
4.  **Phase 4**: Add local visual enforcement inside `TrackView.tsx` where tracks are dynamically rendered over Supabase.

### 6. CURRENTLY VULNERABLE ROUTES
Right now, the following high-value routes are completely open to any authenticated user (Free/Foundation) regardless of academic progress:
*   `/dashboard/labs/financial-nervous-system`
*   `/dashboard/labs/visibility`
*   `/dashboard/labs/budget-paydown`
*   `/tools/score-simulator`
*   `/tools/dispute-generator`
*   `/learn/:trackSlug` (Every curriculum tier is open)
