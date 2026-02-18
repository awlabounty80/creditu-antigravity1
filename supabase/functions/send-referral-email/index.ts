import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
    try {
        const { referrerName, referredEmail, referralCode } = await req.json()

        if (!referredEmail || !referralCode) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 })
        }

        const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #1a1f3a; padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px; letter-spacing: 0.1em;">CREDIT U</h1>
        </div>
        <div style="padding: 40px; color: #1e293b; line-height: 1.6;">
          <h2 style="font-size: 20px; margin-top: 0;">You've been invited to join Credit U!</h2>
          <p>Hi there,</p>
          <p><strong>${referrerName}</strong> thinks you'd be a great fit for the Credit U community. They're already on their way to financial freedom and want you to join the journey.</p>
          <div style="background-color: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
            <p style="margin: 0; font-size: 14px; color: #64748b; text-transform: uppercase; font-weight: bold; letter-spacing: 0.05em;">Your Invitation Code</p>
            <p style="margin: 10px 0 0; font-size: 32px; font-weight: 900; color: #1e293b; font-family: monospace;">${referralCode}</p>
          </div>
          <p>Use this code when you sign up to unlock exclusive rewards and help <strong>${referrerName}</strong> earn extra credits!</p>
          <a href="https://creditu.app/signup?code=${referralCode}" style="display: block; background-color: #4f46e5; color: white; text-align: center; padding: 16px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 30px;">Initialize Your Enrollment</a>
        </div>
        <div style="background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b;">
          © 2026 Credit University. All rights reserved.<br>
          Empowering chaotic good financial strategies.
        </div>
      </div>
    `

        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: 'Credit U <referrals@creditu.app>',
                to: [referredEmail],
                subject: `${referrerName} invited you to Credit U`,
                html: emailHtml,
            }),
        })

        const data = await res.json()
        return new Response(JSON.stringify(data), { status: 200 })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }
})
