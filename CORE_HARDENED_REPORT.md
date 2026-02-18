# Credit U Infrastructure Report
## Phase 1: Core Hardening Status

### A) Build Encryption & State
*   **Baseline Manifest**: Generated at `/creditu_core_manifest.json`.
*   **Dependency Lockdown**: `package.json` has been updated with exact version pinning (removed all `^` and `~` prefixes).
*   **Build Integrity**: The dependency tree is now deterministic.

### B) Security Persistence
*   **RBAC Enforcement**: All new nodes are wrapped in the `RequireAuth` component with explicit roles defined in the `NodeRegistry`.
*   **RLS (Row Level Security)**: Supabase RLS remains the source of truth for all data transactions.
*   **Least Privilege**: Adaptive nodes are scoped to `student` or `admin` roles specifically.

---

## Phase 2: Node Expansion (Modular Architecture)
The following nodes have been initialized and are ready for implementation in isolated directory structures (`/src/nodes/`).

### Node List (Current Capacity: 6)
1.  **Innovation Labs Hub (`/dashboard/labs`)**
    *   **Purpose**: Central entry point for all experimental features.
    *   **Flag**: `NODE_LABS` (default: OFF).
2.  **Dorm Week Hub**
    *   **Purpose**: Post-orientation protocol management.
    *   **Flag**: `NODE_DORM_HUB`.
3.  **Funding Visibility Lab** (Replaces EdIntel)
    *   **Purpose**: Analysis of digital funding footprint.
    *   **Flag**: `NODE_VISIBILITY_LAB`.
4.  **Student Loan Beast**
    *   **Purpose**: Debt mitigation strategies.
    *   **Flag**: `NODE_LOAN_BEAST`.
5.  **Credit Monitoring Explainer**
    *   **Purpose**: Personalized report analysis.
    *   **Flag**: `NODE_MONITORING_GUIDE`.
6.  **Dispute Lab (Advanced)**
    *   **Purpose**: Next-gen letter generation.
    *   **Flag**: `NODE_DISPUTE_LAB`.
7.  **Budget + Paydown Accelerator**
    *   **Purpose**: Income-based payoff logic.
    *   **Flag**: `NODE_BUDGET_PAYDOWN`.

---

## Phase 3: Integrated Router (Zero-Touch Core)
*   **NodeRegistry (`/src/nodes/NodeRegistry.tsx`)**: The singleton source of truth for all available modules.
*   **NodeRouter (`/src/nodes/NodeRouter.tsx`)**: A bridge that injects these routes into `App.tsx` via a single function call, keeping the core code clean.
*   **Node Switchboard (`/admin/switchboard`)**: Admin-only UI to toggle any node in real-time.

---

## Testing & Rollback Plan
1.  **Isolation**: Since nodes are lazy-loaded, a failure in a specific node will not crash the main application bundle.
2.  **Emergency Rollback**: To revert all changes, simply remove `{NodeRoutes()}` and `{AdminNodeRoutes()}` from `App.tsx`.
3.  **Visual Diff**: All core pages (Login, Dashboard) remain pixel-identical to their pre-hardened state.
