# Credit U Platform - Deployment Guide

This guide describes how to deploy the **Credit U Platform** to production. The application is built with **React, Vite, and Tailwind CSS**, and uses **Supabase** for the backend.

## 1. Prerequisites

Before deploying, ensure you have the following:

-   **Supabase Project:** You must have a live Supabase project.
-   **Environment Variables:** You need the `SUPABASE_URL` and `SUPABASE_ANON_KEY`.

## 2. Production Build

We have already verified the build locally. The optimized production files are located in the `dist/` folder.

To rebuild manually:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

## 3. Database Migration (Supabase)

You need to ensure your live Supabase database has the correct schema.
We have created SQL migration files in the `supabase/` directory.

**Required Tables:**
1.  `profiles` (Managed by Supabase Auth, but usually needs a trigger for auto-fill)
2.  `courses` (Content catalog)
3.  `enrollments` (Student progress)
4.  `user_disputes` (Generated letters)
5.  `credit_reports` (File uploads)
6.  `forum_threads` (Community)

**Migration Steps:**
1.  Go to your Supabase Dashboard > SQL Editor.
2.  Copy the contents of `supabase/user_disputes.sql` and `supabase/credit_reports.sql` and run them.
3.  Ensure RLS (Row Level Security) policies are enabled as defined in the scripts.

## 4. Hosting Options

### Option A: Vercel (Recommended)
1.  Push this code to a GitHub repository.
2.  Import the project into Vercel.
3.  Vercel will detect `Vite`.
4.  **Crucial:** Add your Environment Variables in the Vercel Dashboard settings.
    *   `VITE_SUPABASE_URL`
    *   `VITE_SUPABASE_ANON_KEY`
5.  Deploy.

### Option B: Netlify
1.  Drag and drop the `dist/` folder into the Netlify Dashboard manually.
2.  OR connect via Git similar to Vercel.
3.  Ensure a `_redirects` file exists in `public/` if you encounter 404s on refresh (React Router uses client-side routing).
    *   Create `public/_redirects` with content: `/*  /index.html  200`

### Option C: Manual / Static Hosting
1.  Upload the contents of `dist/` to any static file server (S3, Apache, Nginx).
2.  Configure the server to rewrite all 404s to `index.html` (SPA fallback).

## 5. Post-Deployment Checklist

-   [ ] **Test Login:** Ensure the Magic Link email is sent from your Supabase domain.
-   [ ] **Test Navigation:** Refresh the page on `/dashboard` to ensure routing works.
-   [ ] **Test Storage:** Try uploading a dummy file in the Credit Lab to verify Storage buckets are public/private as needed.
