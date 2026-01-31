import { createClient } from '@supabase/supabase-js'

export const config = {
    runtime: 'edge',
}

export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 })
    }

    try {
        const supabaseUrl = process.env.VITE_SUPABASE_URL
        const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseKey) {
            return new Response(JSON.stringify({ error: 'Server Configuration Error' }), { status: 500 })
        }

        const supabase = createClient(supabaseUrl, supabaseKey)

        // Verify Auth Token
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
            return new Response(JSON.stringify({ error: 'Missing Authorization Header' }), { status: 401 })
        }

        const token = authHeader.replace('Bearer ', '')
        const { data: { user }, error: authError } = await supabase.auth.getUser(token)

        if (authError || !user) {
            return new Response(JSON.stringify({ error: 'Unauthorized: Invalid Token' }), { status: 401 })
        }

        // Parse Body
        const body = await req.json()
        const { userId, message } = body

        // THE REQUESTED SECURITY CHECK
        if (userId && userId !== user.id) {
            return new Response(JSON.stringify({ error: 'Unauthorized: User ID Mismatch' }), { status: 401 })
        }

        // Mock AI Response (Since we don't have OpenAI keys set up yet)
        // In a real app, call OpenAI here with process.env.OPENAI_API_KEY
        const aiResponse = {
            message: `The Dean acknowledges: "${message}". Data verified for Student ${user.id.slice(0, 5)}...`,
            timestamp: new Date().toISOString()
        }

        return new Response(JSON.stringify(aiResponse), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        })

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }
}
