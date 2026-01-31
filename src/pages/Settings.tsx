import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Layout, Settings as SettingsIcon, Shield, CreditCard, Loader2, Sparkles, RefreshCw } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useProfile } from '@/hooks/useProfile'
import { toast } from 'sonner'
import { useAmaraOnboarding } from '@/lib/amara-onboarding'
import { useAmaraPause } from '@/lib/amara-pause'
import { useAmaraPreferences, VoicePreference } from '@/lib/amara-preferences'

export default function Settings() {
    const { profile, loading: profileLoading } = useProfile()
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)

    // Amara Hooks
    const onboarding = useAmaraOnboarding()
    const pause = useAmaraPause()
    const preferences = useAmaraPreferences(profile?.id)

    // API Key State
    const [apiKey, setApiKey] = useState(localStorage.getItem('openai_key') || '')
    const [verifying, setVerifying] = useState(false)

    useEffect(() => {
        if (profile) {
            setFirstName(profile.first_name || '')
            setLastName(profile.last_name || '')
        }
        async function fetchUser() {
            const { data } = await supabase.auth.getUser()
            if (data.user) setEmail(data.user.email || '')
        }
        fetchUser()
    }, [profile])


    const handleSave = async () => {
        if (!profile) return
        setLoading(true)
        try {
            const { error } = await supabase.from('profiles').update({
                first_name: firstName,
                last_name: lastName
            }).eq('id', profile.id)

            if (error) throw error
            toast.success("Profile updated successfully")
        } catch (error) {
            console.error('Error updating profile:', error)
            toast.error("Failed to update profile")
        } finally {
            setLoading(false)
        }
    }

    const verifyKey = async () => {
        if (!apiKey) {
            toast.error("Please enter an API Key first")
            return
        }
        setVerifying(true)
        try {
            const res = await fetch('https://api.openai.com/v1/models', {
                headers: { 'Authorization': `Bearer ${apiKey}` }
            })
            const data = await res.json()

            if (data.error) throw new Error(data.error.message)

            toast.success("Connection Verified!", {
                description: `Successfully authenticated. Access to ${data.data.length} models confirmed.`
            })
        } catch (e: any) {
            console.error(e)
            toast.error("Authentication Failed", { description: e.message })
        } finally {
            setVerifying(false)
        }
    }

    const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setApiKey(val)
        localStorage.setItem('openai_key', val)
    }

    if (profileLoading) return <div className="text-white p-8">Loading profile...</div>

    return (
        <div className="min-h-screen bg-[#020412] text-white p-6 md:p-12 relative overflow-x-hidden">
            {/* Atmosphere */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-5xl mx-auto relative z-10 space-y-10">

                {/* Header */}
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                        <SettingsIcon className="w-8 h-8 text-slate-200" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-heading font-bold text-white">System Settings</h1>
                        <p className="text-slate-400">Configure your personal command center.</p>
                    </div>
                </div>

                <Tabs defaultValue="experience" className="w-full">
                    <TabsList className="bg-white/5 border border-white/10 p-1 w-full md:w-auto h-auto rounded-xl grid grid-cols-2 md:inline-flex mb-8 gap-1">
                        <TabsTrigger value="experience" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white h-10 rounded-lg flex items-center gap-2"><Sparkles size={14} /> Rituals</TabsTrigger>
                        <TabsTrigger value="profile" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white h-10 rounded-lg flex items-center gap-2"><User size={14} /> Profile</TabsTrigger>
                        <TabsTrigger value="billing" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white h-10 rounded-lg flex items-center gap-2"><CreditCard size={14} /> Billing</TabsTrigger>
                        <TabsTrigger value="security" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white h-10 rounded-lg flex items-center gap-2"><Shield size={14} /> Security</TabsTrigger>
                        <TabsTrigger value="integrations" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white h-10 rounded-lg flex items-center gap-2"><Layout size={14} /> Integrations</TabsTrigger>
                    </TabsList>

                    <TabsContent value="experience" className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Card className="bg-slate-900/50 border-white/10 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2"><Sparkles size={18} className="text-amber-400" /> Rituals & Preferences</CardTitle>
                                <CardDescription className="text-slate-400">Customize how Guide Amara U. interacts with you.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8">

                                {/* Onboarding */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-sm font-bold text-white">Day-One Tour</h4>
                                        <p className="text-xs text-slate-400">Reset the introductory tour to see it again.</p>
                                    </div>
                                    <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5 text-slate-300" onClick={() => {
                                        onboarding.reset()
                                        toast.success("Onboarding Reset. Go to Dashboard to start.")
                                    }}>
                                        <RefreshCw size={14} className="mr-2" /> Reset Tour
                                    </Button>
                                </div>

                                {/* Re-Entry */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-sm font-bold text-white">Guided Welcome</h4>
                                        <p className="text-xs text-slate-400">Receive a warm welcome back after time away (Re-Entry).</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-emerald-400 font-medium">Always Active</span>
                                    </div>
                                </div>

                                {/* Pause Mode Check-ins */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-sm font-bold text-white">Pause Mode Check-ins</h4>
                                        <p className="text-xs text-slate-400">Allow gentle check-ins if you pause your membership.</p>
                                    </div>
                                    <div className="flex items-center gap-2 bg-black/40 p-1 rounded-lg border border-white/10">
                                        <button
                                            onClick={() => {
                                                pause.setCheckInPreference('OCCASIONAL')
                                                toast.success("Check-ins Enabled")
                                            }}
                                            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${pause.state.checkInPreference === 'OCCASIONAL' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                                        >
                                            On
                                        </button>
                                        <button
                                            onClick={() => {
                                                pause.setCheckInPreference('NONE')
                                                toast.success("Check-ins Disabled")
                                            }}
                                            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${pause.state.checkInPreference === 'NONE' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                                        >
                                            Off
                                        </button>
                                    </div>
                                </div>

                                {/* Voice Preference */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-sm font-bold text-white">Agent Voice Mode</h4>
                                        <p className="text-xs text-slate-400">Override Amara's adaptive personality.</p>
                                    </div>
                                    <div className="flex items-center gap-2 bg-black/40 p-1 rounded-lg border border-white/10">
                                        {(['AUTO', 'ALWAYS_HELP_DESK', 'ALWAYS_COACH'] as VoicePreference[]).map((mode) => (
                                            <button
                                                key={mode}
                                                onClick={() => {
                                                    preferences.updatePreference('voiceMode', mode)
                                                    toast.success(`Voice set to: ${mode.replace(/_/g, ' ')}`)
                                                }}
                                                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${preferences.preferences.voiceMode === mode ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                                            >
                                                {mode === 'AUTO' ? 'Adaptive' : mode === 'ALWAYS_HELP_DESK' ? 'Help Desk' : 'Coach'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="profile" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <Card className="lg:col-span-2 bg-slate-900/50 border-white/10 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-2"><Layout size={18} className="text-indigo-400" /> Personal Details</CardTitle>
                                    <CardDescription className="text-slate-400">How you appear on the Global Campus.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs uppercase font-bold text-slate-500">First Name</Label>
                                            <Input className="bg-black/50 border-white/10 text-white" value={firstName} onChange={e => setFirstName(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs uppercase font-bold text-slate-500">Last Name</Label>
                                            <Input className="bg-black/50 border-white/10 text-white" value={lastName} onChange={e => setLastName(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase font-bold text-slate-500">Email Address</Label>
                                        <Input className="bg-white/5 border-white/5 text-slate-500 cursor-not-allowed" value={email} readOnly />
                                        <p className="text-[10px] text-slate-600">Contact High Table support to change email.</p>
                                    </div>
                                    <div className="pt-4">
                                        <Button onClick={handleSave} disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 font-bold min-w-[150px]">
                                            {loading ? 'Saving...' : 'Update Identity'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-slate-900/50 border-white/10 backdrop-blur-sm h-fit">
                                <CardHeader>
                                    <CardTitle className="text-white text-sm uppercase tracking-widest">Avatar</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center text-center">
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-amber-500 p-1 mb-4">
                                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                                            <span className="text-4xl font-bold text-white">
                                                {firstName?.[0]}{lastName?.[0]}
                                            </span>
                                        </div>
                                    </div>
                                    <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 text-xs">Change Avatar</Button>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="billing" className="mt-6">
                        <Card className="bg-slate-900/50 border-white/10">
                            <CardHeader>
                                <CardTitle className="text-white">Subscription Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Shield className="text-emerald-400" />
                                        <div>
                                            <h4 className="font-bold text-emerald-400">Founder's Access Active</h4>
                                            <p className="text-xs text-emerald-200/70">Next billing date: Jan 12, 2027</p>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="ghost" className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/20">Manage</Button>
                                </div>

                                <div className="border-t border-white/5 pt-6">
                                    <h4 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-4">Danger Zone</h4>
                                    <div className="flex items-center justify-between p-4 bg-red-950/20 border border-red-900/30 rounded-lg">
                                        <div>
                                            <h5 className="font-bold text-white text-sm">Cancel Membership</h5>
                                            <p className="text-xs text-slate-400">End your subscription. You can rejoin anytime.</p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            className="text-red-400 hover:text-red-300 hover:bg-red-900/30"
                                            onClick={() => {
                                                window.dispatchEvent(new CustomEvent('AMARA_TRIGGER_CANCEL'))
                                            }}
                                        >
                                            Cancel Membership
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="security" className="mt-6">
                        <Card className="bg-slate-900/50 border-white/10">
                            <CardHeader>
                                <CardTitle className="text-white">Security & Privacy</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5">
                                    <div>
                                        <h4 className="font-bold text-white text-sm">Two-Factor Authentication</h4>
                                        <p className="text-xs text-slate-400">Add an extra layer of security.</p>
                                    </div>
                                    <div className="h-6 w-11 bg-slate-700 rounded-full relative cursor-pointer opacity-50">
                                        <div className="absolute left-1 top-1 h-4 w-4 bg-slate-400 rounded-full"></div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="integrations" className="mt-6">
                        <Card className="bg-slate-900/50 border-white/10 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">🧠 AI Configuration</CardTitle>
                                <CardDescription className="text-slate-400">Connect external intelligence providers for the Dispute Wizard.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase font-bold text-indigo-400">OpenAI API Key</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                type="password"
                                                className="bg-black/50 border-white/10 text-white font-mono"
                                                placeholder="sk-..."
                                                value={apiKey}
                                                onChange={handleKeyChange}
                                            />
                                            <Button
                                                onClick={verifyKey}
                                                disabled={verifying || !apiKey}
                                                variant="outline"
                                                className="border-white/10 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 min-w-[120px]"
                                            >
                                                {verifying ? <Loader2 className="animate-spin w-4 h-4" /> : 'Test Connection'}
                                            </Button>
                                        </div>
                                        <p className="text-[10px] text-slate-500">
                                            Keys are stored locally on your device and never sent to our servers.
                                            Required for: <strong>AI Dispute Letters</strong>, <strong>Credit Cow Chat</strong>.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div >
    )
}
