import { useState, useEffect } from 'react'

export function useDeveloperMode() {
    const [isDevMode, setIsDevMode] = useState(false)

    useEffect(() => {
        // Check local storage on mount
        const stored = localStorage.getItem('credit_u_dev_mode')
        if (stored === 'true') setIsDevMode(true)

        // Keyboard listener for toggle: Ctrl + Shift + D
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                toggleDevMode()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    const toggleDevMode = () => {
        setIsDevMode(prev => {
            const newValue = !prev
            localStorage.setItem('credit_u_dev_mode', String(newValue))
            if (newValue) {
                console.log("👨‍💻 Developer Mode ACTIVATED: Injecting Mock Data")
            } else {
                console.log("👨‍💻 Developer Mode DEACTIVATED: Returning to Real Data")
            }
            // Force reload to apply changes effectively across components that might only read once
            window.location.reload()
            return newValue
        })
    }

    return { isDevMode, toggleDevMode }
}
