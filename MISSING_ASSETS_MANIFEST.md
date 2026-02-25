# Canonical Missing Assets Manifest
**Status**: AUDIT COMPLETE
**Date**: 2026-01-28

## I. CRITICAL UI INFRASTRUCTURE (The "Classrooms")
*These components are visually missing from the platform.*

### 1. Educational Core
*   [ ] **Course Player (`/src/pages/CoursePlayer.tsx`)**:
    *   Video Player Container
    *   "Field Notes" Sidebar (Markdown renderer)
    *   Progress Tracker UI
*   [ ] **Knowledge Center (`/src/pages/KnowledgeCenter.tsx`)**:
    *   Searchable Library Interface
    *   Category Filters (Freshman, Sophomore, etc.)
    *   Article Reader View

### 2. Gamification & Vision
*   [ ] **Credit Quest (`/src/pages/CreditQuest.tsx`)**:
    *   Quest Map (Visual dependency graph)
    *   XP / "Moo Point" Animation Handling
*   [ ] **Vision Board (`/src/pages/VisionBoard.tsx`)**:
    *   Drag-and-drop Goal Setting Canvas
    *   Dynamic "Credit Future" Visualization

### 3. Professional Tools (The "Credit Lab")
*   *Current Tools exist (`UploadReport`, `LetterGenerator`), but canonical "4 Professional Tools" implies 2 are missing or undefined.*
*   [ ] **Dispute Tracker Dashboard**: Status view of generated letters.
*   [ ] **Bureau Scanner**: Visualizer for the uploaded report data (Graphs/Charts).

## II. EDUCATIONAL CONTENT (The "Curriculum")
*The system is currently 0% populated.*

### 1. Freshman Core (Foundations)
*   [ ] `freshman_01_bureaucracy.json` (Script + Quiz)
*   [ ] `freshman_02_scoring_factors.json`
*   [ ] ... (98 additional scripts)

### 2. Sophomore Strategy (Active Defense)
*   [ ] `sophomore_01_disputes.json`
*   [ ] `sophomore_02_validation.json`

### 3. Static Assets
*   [ ] **Glossary Database**: `glossary.json` (Terms & Definitions)
*   [ ] **Calculator Logic**: `DebtToIncomeCalculator.ts`, `UtilizationSimulator.ts`

## III. MANUFACTURING LOGIC
*   [ ] **Ingestion Scripts**: `ingest_csv.ts` (To handle bulk curriculum upload)
*   [ ] **Cultural Linter**: `CulturalCompliance.ts` (Full implementation needed, currently scaffolded)

## IV. DATA ORCHESTRATION
*   [ ] **Supabase Tables**:
    *   `curriculum` (Table missing)
    *   `student_progress` (Table missing)
    *   `vision_board_items` (Table missing)
