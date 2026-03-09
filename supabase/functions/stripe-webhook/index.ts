import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@12.18.0"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
    httpClient: Stripe.createFetchHttpClient(),
})

const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

serve(async (req) => {
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
        return new Response('No signature', { status: 400 })
    }

    try {
        const body = await req.text()
        let event

        try {
            event = stripe.webhooks.constructEvent(body, signature, endpointSecret!)
        } catch (err) {
            console.error(`Webhook signature verification failed.`, err.message)
            return new Response(`Webhook Error: ${err.message}`, { status: 400 })
        }

        // Initialize Supabase Admin Client
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Handle the event
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object
            const customerEmail = session.customer_details?.email
            const offerId = session.metadata?.offer_id

            console.log(`Payment successful for ${customerEmail} - Offer: ${offerId}`)

            // --- BUSINESS LOGIC ---
            // 1. Find profile by email
            const { data: profile, error: profileError } = await supabaseAdmin
                .from('profiles')
                .select('id')
                .eq('email', customerEmail)
                .single()

            if (profileError || !profile) {
                console.error(`Profile not found for email: ${customerEmail}`)
                // In a real app, you might create a placeholder or send an alert
            } else {
                // 2. Register the purchase / Unlock the module
                // For this example, we'll log it in a 'purchases' table
                const { error: insertError } = await supabaseAdmin
                    .from('user_purchases')
                    .insert({
                        user_id: profile.id,
                        offer_id: offerId,
                        status: 'completed',
                        amount: session.amount_total / 100
                    })

                if (insertError) {
                    console.error(`Failed to record purchase: ${insertError.message}`)
                } else {
                    console.log(`Purchase recorded successfully for ${profile.id}`)
                }
            }
        }

        return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        })
    }
})
