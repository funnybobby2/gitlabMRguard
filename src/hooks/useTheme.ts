import { useEffect, useState } from 'react'

export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'mr-guard-theme'

export function useTheme() {
    const [theme, setTheme] = useState<Theme>(() => {
        const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
        const resolved = stored ?? 'dark'
        document.documentElement.setAttribute('data-theme', resolved)
        return resolved
    })

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem(STORAGE_KEY, theme)
    }, [theme])

    return { theme, setTheme }
}
