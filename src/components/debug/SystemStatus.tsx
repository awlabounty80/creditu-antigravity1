import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CheckCircle, XCircle, Loader2, Database, Wifi } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function SystemStatus() {
    const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error'>('checking')
    const [envStatus, setEnvStatus] = useState<'checking' | 'connected' | 'error'>('checking')
    const [authStatus, setAuthStatus] = useState<'checking' | 'connected' | 'error'>('checking')
    const [storageStatus, setStorageStatus] = useState<'checking' | 'connected' | 'error'>('checking')
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    useEffect(() => {
        // 1. Check Environment Variables
        const url = import.meta.env.VITE_SUPABASE_URL
        const key = import.meta.env.VITE_SUPABASE_ANON_KEY

        if (!key || key.length < 50 || !key.startsWith('eyJ')) {
            setEnvStatus('error')
            setErrorMessage("Critical: Invalid Anon Key. It must start with 'eyJ' and be long.")
            return
        }

        if (url && key && url.includes('supabase.co')) {
            setEnvStatus('connected')
        } else {
            setEnvStatus('error')
            setErrorMessage("Invalid Supabase URL.")
        }

        async function checkServices() {
            setErrorMessage(null) // Reset

            // 2. Database (Courses)
            try {
                const { error, status } = await supabase.from('courses').select('id').limit(1)
                if (!error && (status === 200 || status === 201)) setDbStatus('connected')
                else {
                    console.error("DB Check Error:", error)
                    setDbStatus('error')
                    if (error) setErrorMessage(`DB Error: ${error.message}`)
                }
            } catch (e: any) {
                console.error("DB Check Exception:", e)
                setDbStatus('error')
                setErrorMessage(`DB Exception: ${e.message}`)
            }

            // 3. Auth Service (Ping Session)
            try {
                const { error: authError } = await supabase.auth.getSession()
                if (!authError) {
                    setAuthStatus('connected')
                } else {
                    console.error("Auth Check Error:", authError)
                    setAuthStatus('error')
                    if (!errorMessage) setErrorMessage(`Auth Error: ${authError.message}`)
                }
            } catch (e: any) {
                setAuthStatus('error')
            }

            // 4. Storage Service (List Buckets)
            try {
                const { error: storageError } = await supabase.storage.listBuckets()
                if (!storageError) {
                    setStorageStatus('connected')
                } else {
                    console.error("Storage Check Error:", storageError)
                    setStorageStatus('error')
                }
            } catch (e) {
                setStorageStatus('error')
            }
        }
        checkServices()
    }, [])

    if (envStatus === 'connected' && dbStatus === 'connected' && authStatus === 'connected' && storageStatus === 'connected') return null

    return (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-10 fade-in duration-1000">
            <Card className="bg-black/90 border-white/10 backdrop-blur-md shadow-2xl w-80">
                <CardContent className="p-4 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-white/10 pb-2 mb-2">
                        System Diagnostic
                    </h4>

                    {/* Env Check */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Wifi className="w-4 h-4 text-slate-400" />
                            <span className="text-sm font-medium text-slate-300">Environment Keys</span>
                        </div>
                        {envStatus === 'checking' && <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />}
                        {envStatus === 'connected' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                        {envStatus === 'error' && <XCircle className="w-4 h-4 text-red-500" />}
                    </div>

                    {/* DB Check */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Database className="w-4 h-4 text-slate-400" />
                            <span className="text-sm font-medium text-slate-300">Database</span>
                        </div>
                        {dbStatus === 'checking' && <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />}
                        {dbStatus === 'connected' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                        {dbStatus === 'error' && <XCircle className="w-4 h-4 text-red-500" />}
                    </div>

                    {/* Auth Check */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Database className="w-4 h-4 text-slate-400" />
                            <span className="text-sm font-medium text-slate-300">Auth Service</span>
                        </div>
                        {authStatus === 'checking' && <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />}
                        {authStatus === 'connected' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                        {authStatus === 'error' && <XCircle className="w-4 h-4 text-red-500" />}
                    </div>

                    {/* Storage Check */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Database className="w-4 h-4 text-slate-400" />
                            <span className="text-sm font-medium text-slate-300">Storage Buckets</span>
                        </div>
                        {storageStatus === 'checking' && <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />}
                        {storageStatus === 'connected' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                        {storageStatus === 'error' && <XCircle className="w-4 h-4 text-red-500" />}
                    </div>

                    {(envStatus === 'error' || dbStatus === 'error') && (
                        <div className="text-[10px] text-red-400 mt-2 bg-red-900/10 p-2 rounded break-all tracking-tight font-mono">
                            {errorMessage || "Connection Failed. Check Console."}
                        </div>
                    )}

                    {dbStatus === 'connected' && envStatus === 'connected' && (
                        <p className="text-[10px] text-emerald-400 mt-2 bg-emerald-900/10 p-2 rounded">
                            Systems Nominal. Ready for Launch.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
