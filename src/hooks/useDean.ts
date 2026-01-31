import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useProfile } from './useProfile'
import { useGamification } from './useGamification'

export interface DeanMessage {
    id: string
    text: string
    type: 'greeting' | 'tip' | 'alert' | 'celebration'
    actionLabel?: string
    actionLink?: string
}

export function useDean() {
    const location = useLocation()
    const { profile, loading: profileLoading } = useProfile()
    const { level, points } = useGamification()
    const [message, setMessage] = useState<DeanMessage | null>(null)
    const [isOpen, setIsOpen] = useState(false)

    // Heuristic Engine
    useEffect(() => {
        if (profileLoading) return

        const path = location.pathname

        // 1. Context Awareness: Where is the user?
        if (path === '/dashboard/curriculum') {
            setMessage({
                id: 'curr-1',
                text: "Knowledge is leverage. Master 'Credit 101' to unlock advanced dispute strategies.",
                type: 'tip',
                actionLabel: "Access Module",
                actionLink: "/dashboard/course/c001"
            })
        } else if (path === '/dashboard/credit-lab') {
            setMessage({
                id: 'lab-1',
                text: "Precision matters here. Ensure all dispute letters are factual, verified, and professional.",
                type: 'alert'
            })
        } else if (path === '/dashboard/community') {
            setMessage({
                id: 'comm-1',
                text: "Iron sharpens iron. Share your wins and learn from the network.",
                type: 'greeting'
            })
        } else if (path === '/dashboard/quest') { // New Quest Route
            setMessage({
                id: 'quest-1',
                text: "Theory is good. Practice is better. Test your instincts in the simulation.",
                type: 'challenge' as any // minor cast for new type
            })
        } else {
            // Default Dashboard / Home Logic
            if (points > 0) {
                setMessage({
                    id: 'gen-1',
                    text: `Status Report: You are operating at the ${level} level. Consistency builds momentum.`,
                    type: 'celebration'
                })
            } else {
                setMessage({
                    id: 'welcome-1',
                    text: "I am The Dean. I exist to guide your strategy. Let's establish your baseline.",
                    type: 'greeting'
                })
            }
        }

        // Auto-open on route change (for demo effect)
        setIsOpen(true)

        // Auto-close after 8 seconds
        const timer = setTimeout(() => setIsOpen(false), 8000)
        return () => clearTimeout(timer)

    }, [location.pathname, profile, points, level])

    return {
        message,
        isOpen,
        setIsOpen
    }
}
