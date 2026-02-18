import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Send, Sparkles, Volume2, VolumeX, Minimize2 } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAmaraReEntry } from '@/lib/amara-reentry'
import { useAmaraPause } from '@/lib/amara-pause'
import { useAmaraPreferences } from '@/lib/amara-preferences'
import { amaraVoice } from '@/lib/amara-voice'
import { useAmaraOnboarding } from '@/lib/amara-onboarding'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useProfile } from '@/hooks/useProfile'
import { GUIDE_PERSONA } from '@/lib/guide-persona'
import { getAmaraGuidance, PageId, AllowedAction } from '@/lib/amara-knowledge-maps'
import { buildAmaraEmotionResponse } from '@/lib/amara-emotion-logic'
import { detectPageId } from '@/lib/amara-routes'
import { useAmaraTelemetry } from '@/lib/amara-telemetry'
import { getEmotionUiPolicy } from '@/lib/amara-ui-policy'
import { applyChoicePolicy, Choice } from '@/lib/amara-choice-policy'
import { shouldSoftCheckIn } from '@/lib/amara-check-in'
import { useGuidedEngine, getPlaybook, PageId as PlaybookPageId } from '@/lib/amara-playbook'
import { SpotlightOverlay, GuidedChecklist } from '@/components/ai/AmaraSpotlight'
import { decideSummon } from '@/lib/amara-summon'
import { CinematicSummonOverlay } from '@/components/ai/CinematicSummonOverlay'
import { PAGE_KNOWLEDGE_MAPS } from '@/lib/amara-knowledge-maps'
import { answerQuestion } from '@/lib/amara-answer-engine'
import { toast } from 'sonner'

interface Message {
    role: 'user' | 'assistant'
    content: string
}

interface GuideAgentProps {
    pageId?: PageId
    userName?: string
    pageLabel?: string
}

type DockState = 'CLOSED' | 'OPEN' | 'MINIMIZED'

export function GuideAgent({ pageId: overridePageId, userName, pageLabel }: GuideAgentProps = {}) {
    // State
    const [dockState, setDockState] = useState<DockState>('MINIMIZED')
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [isThinking, setIsThinking] = useState(false)
    const [isListening, setIsListening] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [interactionChoices, setInteractionChoices] = useState<Choice[] | null>(null) // Dynamic choices from QA
    const [activeAgent, setActiveAgent] = useState<'AMARA' | 'LEVERAGE'>('AMARA')

    // Onboarding Hooks (Step 9)
    const { profile, user } = useProfile() // Moved up to provide ID
    const navigate = useNavigate()
    const onboarding = useAmaraOnboarding(user?.id)
    const reEntry = useAmaraReEntry(user?.id)
    const pause = useAmaraPause(user?.id)
    const preferences = useAmaraPreferences(user?.id)

    // 4. Re-Entry Trigger (Step 10)
    useEffect(() => {
        if (reEntry.state.status === 'PENDING') {
            setDockState('OPEN')
            setActiveAgent('AMARA')
            const text = "Welcome back.\nNo explanations needed. You’re right where you left off."
            setMessages(prev => [...prev, { role: 'assistant', content: text }])
            speak(text, 'CALM')
            setInteractionChoices([
                { label: "Resume where I left off", action: "REENTRY_RESUME" },
                { label: "Show me what’s new", action: "REENTRY_SHOW_NEW" },
                { label: "I’ll explore on my own", action: "REENTRY_EXPLORE" }
            ])
        }
    }, [reEntry.state.status])

    // Summon State
    const [summonOpen, setSummonOpen] = useState(false)
    const [declinedRecently, setDeclinedRecently] = useState(false)
    const [userClickedGuideMe, setUserClickedGuideMe] = useState(false)

    // Hooks
    const location = useLocation()
    const scrollRef = useRef<HTMLDivElement>(null)
    const [audio] = useState(new Audio('/assets/ui/summon.mp3'))

    // Telemetry
    const telemetry = useAmaraTelemetry({
        rapidClickBurstThreshold: 5,
        rapidClickWindowMs: 1200,
        longPauseMs: 2500,
        hoverTrackEnabled: true
    })

    // Guided Engine
    const engine = useGuidedEngine()

    // Derived Context
    const resolvedPageId = overridePageId || detectPageId(location.pathname)
    const resolvedUserName = userName || profile?.first_name || 'Student'

    const contextConfig = useMemo(() => {
        if (resolvedPageId === 'home_dashboard') return { label: "Command Center", color: "from-indigo-500/20 to-purple-500/20", accent: "text-indigo-400" }
        if (resolvedPageId === 'credit_lab') return { label: "Credit Lab", color: "from-emerald-500/20 to-cyan-500/20", accent: "text-emerald-400" }
        if (resolvedPageId === 'courses_lessons') return { label: "Curriculum", color: "from-amber-500/20 to-orange-500/20", accent: "text-amber-400" }
        if (resolvedPageId === 'vending_machine') return { label: "Moo Store", color: "from-pink-500/20 to-rose-500/20", accent: "text-rose-400" }
        if (resolvedPageId === 'profile_settings') return { label: "Settings", color: "from-slate-500/20 to-gray-500/20", accent: "text-slate-400" }
        if (resolvedPageId === 'credit_tools') return { label: "Credit Tools", color: "from-blue-500/20 to-indigo-500/20", accent: "text-blue-400" }

        if (location.pathname.includes('vision')) return { label: "Vision Center", color: "from-fuchsia-500/20 to-pink-500/20", accent: "text-fuchsia-400" }
        return { label: "Amara U.", color: "from-amber-500/10 to-transparent", accent: "text-amber-500" }
    }, [resolvedPageId, location.pathname])

    // Guidance Brain
    const pageGuidance = useMemo(() => {
        return getAmaraGuidance({
            pageId: resolvedPageId,
            userName: resolvedUserName
        })
    }, [resolvedPageId, resolvedUserName])

    // Emotion Brain
    const emotion = useMemo(() => {
        return buildAmaraEmotionResponse({
            userName: resolvedUserName,
            pageLabel: pageLabel || contextConfig.label,
            signals: telemetry.signals
        })
    }, [resolvedUserName, pageLabel, contextConfig.label, telemetry.signals])

    // UI Policy
    const uiPolicy = useMemo(() => {
        return getEmotionUiPolicy(emotion.state)
    }, [emotion.state])

    // Filtered Choices (Updated to prefer interactionChoices)
    const filteredChoices = useMemo(() => {
        if (interactionChoices) return interactionChoices // Prioritize QA choices

        const rawChoices: Choice[] = pageGuidance.choices.map(c => ({
            label: c.label,
            action: (c.action as string)
        }))

        return applyChoicePolicy({
            choices: rawChoices,
            policy: uiPolicy
        })
    }, [pageGuidance, uiPolicy, interactionChoices])

    // Playbook Resolver (For "Do Next Best Step")
    const nextBestPlaybook = useMemo(() => {
        if (!pageGuidance.nextBestAction) return undefined
        return getPlaybook(resolvedPageId as any, pageGuidance.nextBestAction as any)
    }, [resolvedPageId, pageGuidance.nextBestAction])

    // Summon Decision Logic
    const summonDecision = useMemo(() => {
        return decideSummon({
            uiIntensity: uiPolicy.intensity,
            uiMode: uiPolicy.uiMode,
            rapidClickBurstCount: telemetry.signals.rapidClickBurstCount || 0,
            backAndForthNavCount: telemetry.signals.backAndForthNavCount || 0,
            pausesBeforeActionCount: telemetry.signals.pausesBeforeActionCount || 0,
            helpRequestsCount: telemetry.signals.helpRequestsCount || 0,
            silenceAfterGuidanceMs: telemetry.signals.silenceAfterGuidanceMs || 0,
            userClickedGuideMe,
            userDeclinedRecently: declinedRecently
        })
    }, [uiPolicy, telemetry.signals, userClickedGuideMe, declinedRecently])

    // Dynamic Avatar Logic (Step 8 + 10)
    const avatarUrl = useMemo(() => {
        if (activeAgent === 'LEVERAGE') return '/assets/dr-leverage-transmission.png'

        const mode = uiPolicy.uiMode
        // Mapped to real user-uploaded assets
        if (mode === 'ENERGIZE') return '/assets/amara/amara-focused.jpg'
        if (mode === 'STEADY') return '/assets/amara/amara-focused.jpg'

        // Default / Calm / Transparent / Soft use the Master Portrait
        return '/assets/amara/amara-master.png'
    }, [uiPolicy.uiMode, activeAgent])


    // --- ONBOARDING LOGIC (Step 9) ---

    // 1. Auto-Start on Dashboard (Force Open)
    useEffect(() => {
        if (resolvedPageId === 'home_dashboard' && onboarding.state.status === 'IDLE') {
            if (dockState !== 'OPEN') {
                setDockState('OPEN')
            } else {
                onboarding.start()
            }
        }
    }, [resolvedPageId, onboarding.state.status, dockState])

    // 2. Drive the Script based on Step
    useEffect(() => {
        if (onboarding.state.status !== 'ACTIVE') return

        const step = onboarding.state.currentStep
        let text = ""
        let choices: Choice[] = []

        if (step === 'WELCOME') {
            text = `Welcome to Credit U. I’m Guide Amara U.\nThis space is designed to help you move forward—without pressure.\nYou don’t need to do everything today.\nWould you like a short tour, or should I step back?`
            choices = [
                { label: "Take the tour", action: "ONBOARDING_START_TOUR" },
                { label: "I'll explore on my own", action: "ONBOARDING_SKIP" }
            ]
        }
        else if (step === 'TOUR') {
            text = `I’ll show you just the essentials.\nThis dashboard shows where you are, what’s available, and what’s next—nothing more.\n(I'm highlighting the Progress Area, Credit Lab, and Lessons).`
            choices = [
                { label: "Continue", action: "ONBOARDING_NEXT" },
                { label: "Pause tour", action: "ONBOARDING_PAUSE" }
            ]
        }
        else if (step === 'FIRST_WIN') {
            text = `This is a safe first step.\nIt doesn’t change your credit—it helps you understand it.\nReady to try one simple action together in the Credit Lab?`
            choices = [
                { label: "Yes, guide me", action: "ONBOARDING_GOTO_LAB" },
                { label: "Skip this step", action: "ONBOARDING_SKIP_STEP" }
            ]
        }
        else if (step === 'REWARD') {
            text = `You just completed your first Credit U action.\nThat matters.\nHere’s a small reward to celebrate movement forward.`
            choices = [
                { label: "Redeem now", action: "ONBOARDING_GOTO_STORE" },
                { label: "Save for later", action: "ONBOARDING_NEXT" }
            ]
        }
        else if (step === 'NEXT_STEPS') {
            text = `You’re officially started.\nYou can stop here—or take your next step when it feels right.\nHere are your options.`
            choices = [
                { label: "Continue learning", action: "ONBOARDING_GOTO_CURRICULUM" },
                { label: "Come back later", action: "ONBOARDING_FINISH" }
            ]
        }

        // Only update if message is new to avoid loops
        setMessages(prev => {
            if (prev.length > 0 && prev[prev.length - 1].content === text) return prev
            return [...prev, { role: 'assistant', content: text }]
        })

        setInteractionChoices(choices)
        speak(text, 'CALM') // Always calm for onboarding

    }, [onboarding.state.status, onboarding.state.currentStep])

    // 3. Listen for Cancellation Trigger
    useEffect(() => {
        const handleCancelTrigger = () => {
            if (pause.state.status === 'PAUSED') return // Already paused

            setDockState('OPEN')
            setActiveAgent('AMARA')
            const text = "I see you’re choosing to make a change. That’s okay. You’re always in control here."
            setMessages(prev => [...prev, { role: 'assistant', content: text }])
            speak(text, 'CALM')
            setInteractionChoices([
                { label: "Cancel membership", action: "CANCEL_CONFIRM_FLOW" },
                { label: "Pause membership", action: "CANCEL_PAUSE" },
                { label: "Switch to free access", action: "CANCEL_DOWNGRADE" },
                { label: "Go back", action: "CANCEL_GOBACK" }
            ])
        }
        window.addEventListener('AMARA_TRIGGER_CANCEL', handleCancelTrigger)
        return () => window.removeEventListener('AMARA_TRIGGER_CANCEL', handleCancelTrigger)
    }, [pause.state.status])

    // 5. Pause Mode: Confirmation Flow (Step 11)
    useEffect(() => {
        if (pause.state.status === 'PAUSING') {
            setDockState('OPEN')
            setActiveAgent('AMARA')
            const text = "Pause is a valid choice here.\nNothing will move forward unless you ask it to.\nWould you like to pause now?"
            setMessages(prev => [...prev, { role: 'assistant', content: text }])
            speak(text, 'CALM')
            setInteractionChoices([
                { label: "Yes, pause my membership", action: "PAUSE_CONFIRM" },
                { label: "Go back", action: "PAUSE_CANCEL" }
            ])
        }
    }, [pause.state.status])

    // 6. Pause Mode: Dashboard Greeting (Step 11)
    useEffect(() => {
        if (pause.state.status === 'PAUSED' && resolvedPageId === 'home_dashboard' && dockState === 'OPEN') {
            // Only warn if we are trying to interact
            const text = "You’re in Pause Mode.\nNothing is expected of you here.\nWould you like to resume, explore quietly, or rest?"
            setMessages(prev => [...prev, { role: 'assistant', content: text }])
            speak(text, 'CALM')
            setInteractionChoices([
                { label: "Resume membership", action: "PAUSE_RESUME" },
                { label: "Explore quietly", action: "MINIMIZED" },
                { label: "Rest (Close Amara)", action: "MINIMIZED" }
            ])
        }
    }, [pause.state.status, resolvedPageId, dockState])

    // --- EFFECTS ---

    // 1. Reset Telemetry on Page Change
    useEffect(() => {
        telemetry.reset()
    }, [location.pathname])

    // 2. Auto-Scroll Chat
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    // 3. Dock Open Behaviors (Sound, Initial Greeting)
    useEffect(() => {
        if (dockState === 'OPEN') {
            audio.volume = 0.5
            audio.play().catch(() => { })
            telemetry.markHelpRequest()
            telemetry.markGuidanceShown()

            if (messages.length === 0) {
                const prefix = emotion.state === 'OVERWHELMED' ? "Let's pause for a second. " : ""
                const greeting = prefix + pageGuidance.speak
                setMessages([{ role: 'assistant', content: greeting }])
                speak(greeting, uiPolicy.uiMode)
            }
        }
    }, [dockState])

    // 4. Soft Check-In Loop
    useEffect(() => {
        const checkInInterval = setInterval(() => {
            const shouldCheck = shouldSoftCheckIn({
                policy: uiPolicy,
                silenceAfterGuidanceMs: telemetry.signals.silenceAfterGuidanceMs || 0,
                dockState
            })

            if (shouldCheck && !isThinking && messages.length > 0 && messages[messages.length - 1].role === 'assistant') {
                const checkInMsg = "Are you doing okay? I can explain this differently."
                setMessages(prev => [...prev, { role: 'assistant', content: checkInMsg }])
                speak(checkInMsg, 'CALM')
                telemetry.markGuidanceShown()
            }
        }, 2000)

        return () => clearInterval(checkInInterval)
    }, [uiPolicy, telemetry.signals.silenceAfterGuidanceMs, dockState, isThinking, messages])

    // 5. Summon Auto-Trigger
    useEffect(() => {
        if (summonDecision.shouldSummon && !summonOpen && dockState !== 'OPEN') {
            setSummonOpen(true)
        }
        if (userClickedGuideMe && !summonOpen && dockState !== 'OPEN') {
            // Redundant backup if strict decision didn't catch it
            // setSummonOpen(true)
        }
        // Reset momentary click
        if (userClickedGuideMe) setUserClickedGuideMe(false)

        // Decline Cooldown
        if (declinedRecently) {
            const t = setTimeout(() => setDeclinedRecently(false), 180000)
            return () => clearTimeout(t)
        }
    }, [summonDecision, summonOpen, dockState, userClickedGuideMe, declinedRecently])


    // --- ACTIONS ---

    const speak = (text: string, mode: string = 'STEADY') => {
        if (isMuted) {
            amaraVoice.stop()
            return
        }
        amaraVoice.speak(text, activeAgent, mode as any)
    }

    const startListening = () => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            setIsListening(true)
            const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
            const recognition = new SpeechRecognition()
            recognition.continuous = false
            recognition.interimResults = false
            recognition.lang = 'en-US'

            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript
                setInput(transcript)
                handleSend(transcript)
                setIsListening(false)
            }
            recognition.onerror = () => setIsListening(false)
            recognition.onend = () => setIsListening(false)
            recognition.start()
        } else {
            toast.error("Voice input not supported in this browser.")
        }
    }

    const handleSend = async (overrideText?: string) => {
        const textToSend = overrideText || input
        if (!textToSend.trim()) return

        if (!overrideText) setInput('')

        setMessages(prev => [...prev, { role: 'user', content: textToSend }])
        setIsThinking(true)
        telemetry.markHelpRequest()

        const apiKey = localStorage.getItem('openai_api_key')

        // 1. LOCAL RULES ENGINE FALLBACK (If no API Key)
        if (!apiKey) {
            // Emulate slight delay for "thinking" feel
            await new Promise(r => setTimeout(r, 600))

            const map = PAGE_KNOWLEDGE_MAPS[resolvedPageId as PageId] || PAGE_KNOWLEDGE_MAPS.unknown

            const ans = answerQuestion({
                question: textToSend,
                ctx: {
                    pageId: resolvedPageId as any,
                    pageLabel: contextConfig.label,
                    userName: resolvedUserName,
                    emotionState: emotion.state,
                    uiMode: uiPolicy.uiMode,
                    map: map,
                    timeOnPageMs: telemetry.signals.timeOnPageMs
                }
            })

            setMessages(prev => [...prev, { role: 'assistant', content: ans.text }])

            // Map the engine choices to our Choice type
            const newChoices: Choice[] = ans.choices.map(c => ({
                label: c.label,
                action: c.action as string
            }))
            setInteractionChoices(newChoices)

            // Voice Mode Selection (Step 13)
            let voiceMode: string = uiPolicy.uiMode

            // Intent Overrides
            if (ans.intent === 'HOW_DO_I_USE_THIS' || ans.intent === 'TROUBLESHOOT' || ans.intent === 'WHAT_DO_I_DO_NEXT') {
                voiceMode = 'HELP_DESK'
            }

            // User Preference Overrides (Final Authority)
            if (preferences.preferences.voiceMode === 'ALWAYS_HELP_DESK') voiceMode = 'HELP_DESK';
            if (preferences.preferences.voiceMode === 'ALWAYS_COACH') voiceMode = 'ENERGIZE'; // or STEADY, but energize is more "Coach" like

            speak(ans.text, voiceMode)
            telemetry.markGuidanceShown()
            setIsThinking(false)
            return
        }

        // 2. OPENAI (If Key Exists)
        try {
            let systemPrompt = ""

            if (activeAgent === 'AMARA') {
                systemPrompt = `
                    ${GUIDE_PERSONA.identity}
                    Context:
                    - User: ${resolvedUserName}
                    - Location: ${contextConfig.label}
                    - Emotion: ${emotion.state}

                    Page Content (Visible to User):
                    ${(() => {
                        // 1. Content Block (e.g. Lesson)
                        const content = document.getElementById('amara-page-content')?.innerText.slice(0, 2000);

                        // 2. Data Vision (e.g. Scores, Points)
                        const visionTargets = Array.from(document.querySelectorAll('[data-amara-vision]')).map(el => {
                            const label = el.getAttribute('data-amara-vision');
                            return `${label}: ${el.textContent?.trim()}`;
                        });

                        const parts = [];
                        if (content) parts.push(`Main Text:\n${content}`);
                        if (visionTargets.length > 0) parts.push(`Key Values:\n${visionTargets.join('\n')}`);

                        return parts.length > 0 ? parts.join('\n\n') : "No specific content visible.";
                    })()}

                    Page Knowledge:
                    ${pageGuidance.speak}
                    
                    Mission:
                    ${GUIDE_PERSONA.instructions}
                `
            } else {
                // DR. LEVERAGE PERSONA
                systemPrompt = `
                    You are Dr. Leverage, the Professor of Credit Strategy at Credit University.
                    
                    IDENTITY:
                    - You are wise, structured, and focused on "WHY" things work.
                    - You explain credit laws, leverage, and financial logic.
                    - You use plain language but deep concepts.
                    - You never judge, but you are strict about facts.
                    
                    CONTEXT:
                    - User: ${resolvedUserName}
                    - Current Page: ${contextConfig.label}
                    
                    INSTRUCTIONS:
                     1. Explain the STRATEGY behind the current page's tools.
                     2. Keep it under 3 short paragraphs.
                     3. Always end by asking: "Would you like to go deeper into this concept, or return to Amara?"
                     4. Do NOT give UI navigation instructions (that is Amara's job).
                `
            }

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        ...messages.map(m => ({ role: m.role, content: m.content })),
                        { role: 'user', content: textToSend }
                    ],
                    max_tokens: 350
                })
            })

            const data = await response.json()
            const aiText = data.choices[0].message.content || "I missed that."

            setMessages(prev => [...prev, { role: 'assistant', content: aiText }])
            speak(aiText, activeAgent === 'AMARA' ? uiPolicy.uiMode : 'STEADY')
            telemetry.markGuidanceShown()

            if (activeAgent === 'LEVERAGE') {
                setInteractionChoices([
                    { label: "Go deeper", action: "LEVERAGE_DEEPER" },
                    { label: "Return to Amara", action: "HANDOFF_TO_AMARA" }
                ])
            } else {
                setInteractionChoices(null)
            }

        } catch (error) {
            console.error(error)
            toast.error("Connection failed")
        } finally {
            setIsThinking(false)
        }
    }


    const handleChoiceClick = (choice: Choice) => {

        // CHECK FOR PLAYBOOK
        const pb = getPlaybook(resolvedPageId as PlaybookPageId, choice.action as AllowedAction)
        if (pb) {
            engine.start(pb)
            speak("I'll walk you through it. Follow my lead.", 'EFFICIENT')
            return
        }

        // Intercept Onboarding Actions
        if (choice.action.startsWith('ONBOARDING_')) {
            if (choice.action === 'ONBOARDING_SKIP') {
                onboarding.skip()
                setInteractionChoices(null)
                handleSend("I'll explore on my own.")
                return
            }
            if (choice.action === 'ONBOARDING_START_TOUR') {
                onboarding.advance() // Go to TOUR
                return
            }
            if (choice.action === 'ONBOARDING_NEXT' || choice.action === 'ONBOARDING_SKIP_STEP') {
                onboarding.advance()
                return
            }
            if (choice.action === 'ONBOARDING_PAUSE') {
                onboarding.pause()
                setInteractionChoices(null)
                handleSend("I'll pause for now.")
                return
            }
            if (choice.action === 'ONBOARDING_GOTO_LAB') {
                // Navigate to Lab AND Advance
                navigate('/dashboard/credit-lab')
                onboarding.advance()
                return
            }
            if (choice.action === 'ONBOARDING_GOTO_STORE') {
                navigate('/dashboard/store')
                onboarding.advance()
                return
            }
            if (choice.action === 'ONBOARDING_GOTO_CURRICULUM') {
                navigate('/dashboard/curriculum')
                onboarding.complete()
                setInteractionChoices(null)
                return
            }
            if (choice.action === 'ONBOARDING_FINISH') {
                onboarding.complete()
                setInteractionChoices(null)
                handleSend("I'll come back later.")
                return
            }
            // Fallback
            onboarding.advance()
            return
        }

        // AGENT HANDOFFS
        if (choice.action === 'HANDOFF_TO_LEVERAGE') {
            setActiveAgent('LEVERAGE')
            const greeting = "Welcome. I’m Dr. Leverage.\nI’ll explain the strategy behind this so you can move with confidence.\nWhat concept is on your mind?"
            setMessages(prev => [...prev, { role: 'assistant', content: greeting }])
            speak(greeting, 'STEADY')
            setInteractionChoices(null) // Let them ask
            return
        }

        if (choice.action === 'HANDOFF_TO_AMARA') {
            setActiveAgent('AMARA')
            const greeting = "You’re back with me.\nReady to apply what you just learned, or would you like to pause?"
            setMessages(prev => [...prev, { role: 'assistant', content: greeting }])
            speak(greeting, uiPolicy.uiMode)
            setInteractionChoices(null)
            return
        }

        if (choice.action === 'LEVERAGE_DEEPER') {
            handleSend("Tell me more about the strategy.")
            return
        }

        // CANCELLATION FLOW
        if (choice.action === 'CANCEL_GOBACK') {
            setInteractionChoices(null)
            handleSend("I'll stay right here.")
            return
        }
        if (choice.action === 'CANCEL_PAUSE') {
            pause.startPauseFlow() // Switch to Pause Logic
            return
        }
        if (choice.action === 'PAUSE_CANCEL') {
            pause.cancelFlow()
            handleSend("I'll stay active.")
            return
        }
        if (choice.action === 'PAUSE_CONFIRM') {
            pause.confirmPause()
            const text = "Membership paused. Would you like a gentle check-in from time to time? (No promotions, just presence)."
            setMessages(prev => [...prev, { role: 'assistant', content: text }])
            speak(text, 'CALM')
            setInteractionChoices([
                { label: "Yes, occasional check-ins", action: "PAUSE_CHECKIN_YES" },
                { label: "No, complete quiet", action: "PAUSE_CHECKIN_NO" }
            ])
            return
        }
        if (choice.action === 'PAUSE_CHECKIN_YES') {
            pause.setCheckInPreference('OCCASIONAL')
            handleSend("I'll keep a quiet watch.")
            setDockState('MINIMIZED')
            setInteractionChoices(null)
            return
        }
        if (choice.action === 'PAUSE_CHECKIN_NO') {
            pause.setCheckInPreference('NONE')
            handleSend("Understood. Complete silence.")
            setDockState('MINIMIZED')
            setInteractionChoices(null)
            return
        }
        if (choice.action === 'PAUSE_RESUME') {
            pause.resume()
            const text = "Welcome back.\nWe’ll move at your pace.\nNo explanations needed."
            setMessages(prev => [...prev, { role: 'assistant', content: text }])
            speak(text, 'CALM')
            setInteractionChoices(null)
            return
        }

        if (choice.action === 'CANCEL_DOWNGRADE') {
            handleSend("I'd like to switch to the free plan.")
            return
        }
        if (choice.action === 'CANCEL_CONFIRM_FLOW') {
            const text = "Understood. Is there a specific reason? (You can skip this)."
            setMessages(prev => [...prev, { role: 'assistant', content: text }])
            speak(text, 'CALM')
            setInteractionChoices([
                { label: "Financial reasons", action: "CANCEL_EXECUTE" },
                { label: "Not using it enough", action: "CANCEL_EXECUTE" },
                { label: "Completed my goals", action: "CANCEL_EXECUTE" },
                { label: "Skip", action: "CANCEL_EXECUTE" }
            ])
            return
        }
        if (choice.action === 'CANCEL_EXECUTE') {
            // Execute simulated cancel
            const text = "Your membership has been canceled. Your progress is saved. You’re welcome back anytime."
            setMessages(prev => [...prev, { role: 'assistant', content: text }])
            speak(text, 'CALM')
            setInteractionChoices(null)

            // In a real app, calls API here.
            // toast.success("Membership Canceled")
            return
        }

        // RE-ENTRY ACTIONS
        if (choice.action === 'REENTRY_RESUME') {
            reEntry.complete()
            const text = "Restoring your last session... You're all set."
            setMessages(prev => [...prev, { role: 'assistant', content: text }])
            speak(text, 'EFFICIENT')
            setInteractionChoices(null)
            return
        }
        if (choice.action === 'REENTRY_SHOW_NEW') {
            reEntry.complete()
            handleSend("Show me what's new.") // Let standard QA/Tour handle it
            return
        }
        if (choice.action === 'REENTRY_EXPLORE') {
            reEntry.complete()
            setDockState('CLOSED')
            setInteractionChoices(null)
            return
        }


        if (choice.action === 'decline_help' || choice.action === 'MINIMIZED') {
            setDockState('MINIMIZED')
            telemetry.markQuickDecision()
        } else {
            telemetry.markPrimaryActionAttempt()
            const text = `I'd like to ${choice.label}`
            handleSend(text)
        }
    }

    if (dockState === 'CLOSED') return null

    return (
        <>
            {/* Cinematic Summon Overlay */}
            <CinematicSummonOverlay
                open={summonOpen}
                intensity={summonDecision.intensity}
                headline={summonDecision.reason === 'USER_REQUEST' ? "Guide Amara U. has arrived." : "I sense you might need a hand."}
                subtext={summonDecision.message}
                avatarUrl={avatarUrl}
                onClose={() => {
                    setSummonOpen(false)
                    setDockState('OPEN')
                    telemetry.markGuidanceShown()
                }}
                onDecline={() => {
                    setSummonOpen(false)
                    setDeclinedRecently(true)
                    telemetry.markQuickDecision()
                }}
            />

            {/* Guided Mode Overlays */}
            <AnimatePresence>
                {engine.state.isActive && engine.state.playbook && (
                    <>
                        <GuidedChecklist
                            playbook={engine.state.playbook}
                            currentStepIndex={engine.state.stepIndex}
                            onStepClick={engine.goToStep}
                            onExit={engine.exit}
                        />
                        <SpotlightOverlay
                            isActive={true}
                            targetSelector={engine.state.playbook.steps[engine.state.stepIndex]?.targetSelector}
                            helperText={engine.state.playbook.steps[engine.state.stepIndex]?.instruction}
                            onDismiss={engine.exit}
                        />
                    </>
                )}
            </AnimatePresence>

            {/* Minimized Trigger */}
            <AnimatePresence>
                {dockState === 'MINIMIZED' && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-[#0A0F1E] shadow-[0_0_30px_rgba(245,158,11,0.4)] flex items-center justify-center border-2 group hover:border-amber-400 transition-all overflow-hidden
                            ${uiPolicy.intensity === 'LOW' ? 'border-amber-500/30' : 'border-amber-500/80 animate-pulse'}
                        `}
                        onClick={() => {
                            telemetry.markHelpRequest()
                            telemetry.markGuidanceShown()
                            setUserClickedGuideMe(true)
                        }}
                    >
                        <div className="w-full h-full relative overflow-hidden">
                            <img src={avatarUrl} className="w-full h-full object-cover scale-[1.1] object-top opacity-90 group-hover:opacity-100 transition-opacity" alt="Amara U." />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        <Sparkles className={`absolute bottom-2 w-4 h-4 text-amber-400 ${uiPolicy.intensity === 'MEDIUM' ? 'animate-pulse' : ''}`} />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Open Dock */}
            <AnimatePresence>
                {dockState === 'OPEN' && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.95 }}
                        className="fixed bottom-6 right-6 z-50 w-[400px] md:w-[450px] bg-[#0A0F1E]/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] ring-1 ring-white/5"
                    >
                        <div className="relative h-56 bg-black group shrink-0 overflow-hidden">
                            <div className="w-full h-full relative overflow-hidden">
                                <img src={avatarUrl} className="w-full h-full object-cover scale-[1.1] object-top opacity-90 group-hover:opacity-100 transition-all duration-700" alt="Amara U." />
                            </div>
                            <div className={`absolute inset-0 bg-gradient-to-t ${contextConfig.color} mix-blend-overlay transition-colors duration-1000`}></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1E] via-transparent to-transparent"></div>
                            <div className="absolute top-4 right-4 flex gap-2">
                                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-black/40 text-white hover:bg-white/20 backdrop-blur-md" onClick={() => setIsMuted(!isMuted)}>
                                    {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                                </Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-black/40 text-white hover:bg-white/20 backdrop-blur-md" onClick={() => setDockState('MINIMIZED')}>
                                    <Minimize2 size={14} />
                                </Button>
                            </div>
                            <div className="absolute bottom-6 left-6 space-y-1">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${isThinking ? 'bg-amber-400 animate-bounce' : 'bg-emerald-500 animate-pulse'}`}></div>
                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${contextConfig.accent}`}>{contextConfig.label}</span>
                                    <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white/50">{uiPolicy.uiMode}</span>
                                </div>
                                <h3 className="font-heading font-black text-2xl text-white drop-shadow-lg">
                                    {isThinking ? "Thinking..." : isListening ? "Listening..." : "How can I help you?"}
                                </h3>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar" ref={scrollRef}>
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-4 text-sm leading-relaxed shadow-lg backdrop-blur-sm ${msg.role === 'user' ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white font-medium rounded-2xl rounded-tr-none' : 'bg-white/5 border border-white/10 text-slate-200 rounded-2xl rounded-tl-none'}`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}

                            {!isThinking && messages.length > 0 && messages[messages.length - 1].role === 'assistant' && (
                                <div className="grid gap-2 mt-4">
                                    {filteredChoices.map((choice, i) => (
                                        <motion.button
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-left text-sm text-slate-300 hover:text-white transition-colors flex items-center justify-between group"
                                            onClick={() => handleChoiceClick(choice)}
                                        >
                                            {choice.label}
                                            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-500">→</span>
                                        </motion.button>
                                    ))}

                                    {/* Explicit Action Button */}
                                    <motion.button
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="w-full p-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-left text-sm text-amber-400 hover:text-amber-300 font-bold transition-all flex items-center justify-between group"
                                        onClick={() => {
                                            telemetry.markPrimaryActionAttempt()

                                            if (nextBestPlaybook) {
                                                engine.start(nextBestPlaybook)
                                                setDockState('MINIMIZED') // Minimize dock so user can see the overlay
                                                toast("Starting Guided Mode...")
                                            } else {
                                                handleSend("What is the absolute best next step for me right now?")
                                            }
                                        }}
                                    >
                                        Do next best step
                                        <span className="opacity-100 transition-opacity text-amber-500">⚡</span>
                                    </motion.button>
                                </div>
                            )}

                            {isThinking && (
                                <div className="flex justify-start">
                                    <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none flex gap-1.5 items-center">
                                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce delay-100"></div>
                                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce delay-200"></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-white/5 bg-black/40 shrink-0 backdrop-blur-md">
                            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-3 relative">
                                <Button type="button" onClick={startListening} className={`shrink-0 rounded-full w-12 h-12 ${isListening ? 'bg-red-500 animate-pulse text-white' : 'bg-white/10 hover:bg-white/20 text-slate-300'}`}>
                                    <Mic size={20} />
                                </Button>
                                <div className="relative flex-1">
                                    <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder={isListening ? "Listening..." : "Type or ask Amara..."} className="h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 pr-12 rounded-full focus:ring-amber-500/50 transition-all focus:bg-white/10" />
                                    <Button type="submit" size="icon" className="absolute right-1 top-1 h-10 w-10 rounded-full bg-amber-500 text-black hover:bg-amber-400 hover:scale-105 transition-all" disabled={!input.trim()}>
                                        <Send size={18} />
                                    </Button>
                                </div>
                            </form>
                            <div className="mt-2 text-center">
                                <span className="text-[10px] text-slate-500 uppercase tracking-widest opacity-60">Ethics: No Pressure • No Guilt • Respect Silence</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
