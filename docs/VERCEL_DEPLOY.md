# Vercel Deployment Guide (CLI Method)

Since you do not have Git installed/configured, the fastest way to deploy to Vercel is using their Command Line Interface (CLI).

We have confirmed `npx vercel` works on your system via Command Prompt.

## 1. Login to Vercel
Run the following command in your terminal. It will open your browser to authenticate.
```powershell
cmd /c "npx vercel login"
```
*Select "Continue with Email" or your preferred method.*

## 2. Deploy
Once logged in, run the deployment command:
```powershell
cmd /c "npx vercel"
```

**Follow the interactive prompts:**
1.  **Set up and deploy?** [Y]
2.  **Which scope?** [Select your account]
3.  **Link to existing project?** [N]
4.  **Project Name?** `credit-u-platform` (or press Enter)
5.  **In which directory?** `./` (Press Enter)
6.  **Want to modify settings?** [N] (It should auto-detect Vite)

## 3. Environment Variables (CRITICAL)
Your production deployment will fail or look broken without the backend keys.

After the first deploy starts (or via the Vercel Dashboard):
1.  Go to your Project Settings on Vercel.com.
2.  Find **Environment Variables**.
3.  Add the contents of your `.env` file:
    *   `VITE_SUPABASE_URL`: `https://sdrkjbbiznbyiozeltgw.supabase.co`
    *   `VITE_SUPABASE_ANON_KEY`: `your_anon_key`
4.  **Redeploy** (if needed) for changes to take effect.
    *   Command: `cmd /c "npx vercel --prod"`

## 4. Final Verification
Your site will be available at a `*.vercel.app` URL provided in the terminal output.
