
### **STEP 1: DATABASE ACTIVATION (REQUIRED)**
You must run the generated SQL script to activate the new Knowledge OS, Gamification, and Points engines in your database.

1.  Open your **Supabase Dashboard**.
2.  Go to the **SQL Editor**.
3.  Click **New Query**.
4.  Copy and Paste the **ENTIRE** content of the file:
    `supabase/EXECUTE_ALL.sql`
5.  Click **Run**.
6.  *Verify:* check that you see "Success" messages in the results.

### **STEP 2: VERIFY UI**
Once the database is updated, restart your development server (Ctrl+C, then `npm run dev`) and navigate to:
*   **Knowledge Library:** `/dashboard/library`
*   **Gamification Check:** Try completing a lesson in `/dashboard/curriculum` (if you are enrolled) or verify the Store at `/dashboard/store`.

### **STEP 3: NEXT**
The "Credit Cow" AI functionality (RAG) requires `pgvector` to be enabled (included in script) and a backend function to generate embeddings. Proceed to Phase 3 when ready.
