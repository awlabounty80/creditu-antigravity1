import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sdrkjbbiznbyiozeltgw.supabase.co'
const supabaseKey = 'sb_publishable_2QFtiDGtIGVtE36l5xshwg_XIPoeN5z'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
    console.log('Testing connection to:', supabaseUrl)
    const { data, error } = await supabase.from('user_profiles').select('count', { count: 'exact', head: true })

    if (error) {
        console.error('Connection Failed:', error.message)
        console.error('Code:', error.code)
        console.error('Details:', error.details)
    } else {
        console.log('Connection Successful!')
    }
}

testConnection()
