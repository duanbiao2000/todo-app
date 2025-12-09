// Composable: Theme Management
import { watch } from 'vue'
import { useAppStore } from '../stores/app'

export function useTheme() {
    const appStore = useAppStore()

    // Watch for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleThemeChange = (e) => {
        if (!localStorage.getItem('user-theme-preference')) {
            appStore.setTheme(e.matches ? 'dark' : 'light')
        }
    }

    mediaQuery.addEventListener('change', handleThemeChange)

    // Save user preference
    watch(() => appStore.theme, (newTheme) => {
        localStorage.setItem('user-theme-preference', newTheme)
    })

    return {
        theme: () => appStore.theme,
        isDarkMode: () => appStore.isDarkMode,
        toggleTheme: () => appStore.toggleTheme(),
        setTheme: (theme) => appStore.setTheme(theme)
    }
}
