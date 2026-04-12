# ANTIGRAVITY: THE CREDIT U ECOSYSTEM
**Technical & Operational Manual | Version 1.0**

## 1. EXECUTIVE IDENTITY
**Concept**: A sovereign academic economy where intellectual labor generates liquidity.
- **Currency**: **$CU (Credit U)**. A digital asset pegged to academic performance.
- **Aesthetic**: **Trillionaire Tech**.
    - **Obsidian (#050505)**: The void canvas.
    - **Neon Accents**: Cyan (Intellect), Emerald (Wealth), Gold (Prestige).
    - **Glassmorphism**: High-end transparency for a premium feel.

## 2. ECONOMIC ENGINE (The Source)
The system that converts "The Grind" into digital capital.
- **Trigger**: `on_lesson_completed` (Postgres Trigger).
- **Automation**:
    1.  User finishes a lesson in the LMS.
    2.  `lesson_progress` table updates status to `'completed'`.
    3.  Database trigger runs `grant_moo_points_on_completion()`.
    4.  **RESULT**: User profile is credited **+50 $CU** instantly.

## 3. THE EXCHANGE (Moo Store)
A real-time asset market preventing inflation and double-spending.
- **Inventory Table**: `moo_store_items` (Managed via Admin).
- **Rarity Tiers**:
    - **Common** (Cyan): Productivity tools (Scripts, Templates).
    - **Rare** (Emerald): Financial instruments (Grant Blueprints).
    - **Legendary** (Gold): Access capital (Mentorships).
- **Transaction Logic (RPC)**:
    - Function: `purchase_moo_item(item_id, user_id)`
    - **Security**: Runs as `SECURITY DEFINER` (Admin privilege) to bypass RLS, ensuring strictly controlled point deduction.
    - **Validation**: Checks balance >= price *before* deduction to prevent negative balances.

## 4. ADMINISTRATIVE GOVERNANCE
Scalable management for the platform operators.
- **Access Route**: `/admin` (Protected).
- **Permissions**: Requires current user's `user_profiles.role` to be `'admin'`.
- **Capability**:
    - **Asset Deployment**: Admins can use the "Exchange Manager" to inject new assets into the economy without code deployments.
    - **Real-time**: Updates propagate to all students immediately.

## 5. DEPLOYMENT MANIFEST
**Critical Infrastructure**

### A. Supabase Storage
- **Bucket Name**: `academic-assets`
- **Access Policy**: Public Read (allowing generic PDF downloads).
- **Content**: Must contain files matching the Asset IDs (e.g., `quantum-ai.pdf`).

### B. Environment Variables
- `VITE_SUPABASE_URL`: API Endpoint.
- `VITE_SUPABASE_ANON_KEY`: Public Client Key.

### C. Database Schema
- **Tables**: `user_profiles`, `moo_store_items`, `moo_purchases`, `lesson_progress`.
- **Security**: RLS enabled on all tables.

---
*System built by Antigravity.*
