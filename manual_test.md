# Manual Test Steps for React Migration

## 1. Public Pages
1.  **Home (`/`)**: Verify "Credit University AI" header, Value Strip, and wider "Platform" layout (no box borders).
2.  **Admissions (`/admissions`)**: Verify Path Cards and "Create Student ID" button.
3.  **How It Works (`/how-it-works`)**: Verify steps grid.
3.  **Pricing (`/pricing`)**: Verify cards.
4.  **Navigation**: Check links between these pages.

## 2. Authentication
1.  Click **Log In** -> Should go to `/auth?mode=login`.
2.  Click **"DEV: Skip Login"**.
3.  **Result**: Should redirect to `/campus` (Dashboard).
    -   *Note*: If you are redirected to `/orientation`, the dev user might handle that correctly now as we set `is_orientation_complete: true`.

## 3. Dashboard (Campus)
1.  **Overview (`/campus`)**: Check GPA Gauge and Semester Progress.
2.  **Classes (`/campus/classes`)**:
    -   Verify list of classes.
    -   **Access Control**:
        -   As default dev user (Member tier): All classes should be "Start Class".
        -   **Test Freshman Trial**: 
            -   Update `AuthContext` devLogin to `plan_tier: 'freshman_trial'` and `freshman_trial_ends_at: future_date`. 
            -   Classes should be unlocked. 
            -   Set `freshman_trial_ends_at` to past_date -> Classes should be locked.
    -   Search "Investing" -> Should filter list.
3.  **Moo Store (`/moo-store`)**:
    -   Verify items list (Mock data or real).
    -   **Access Control**:
        -   As Member: See all 5 items (including "Premium Hoodie").
        -   As Free User: See only "Credit U Sticker" and "Planner". "Premium Hoodie" should be hidden.
    -   **Purchasing**:
        -   Free Item: Click "Get" -> Should alert "Unlocked".
        -   Premium Item: Click "Unlock" -> Should redirect to `/pricing`.
4.  **Simulator (`/campus/simulator`)**:
    -   Move slider -> Check Score updates.
    -   Toggle "New Card" -> Check Score drops.
4.  **Routing**: Click Sidebar links (Report, Alerts) -> Should show "Coming soon" placeholders.

## 4. Guards
1.  Log Out (Sidebar bottom).
2.  Try to visit `/campus` directly.
3.  **Result**: Should redirect to `/auth?mode=login`.
