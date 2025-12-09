// App Store - Global Application State
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import db from '../db'

export const useAppStore = defineStore('app', () => {
    // State
    const theme = ref('light')
    const currentView = ref('all') // all | today | completed
    const currentCategory = ref(null)
    const searchQuery = ref('')
    const isOnline = ref(navigator.onLine)
    const sidebarOpen = ref(true)
    const showInstallPrompt = ref(false)
    const deferredPrompt = ref(null)

    // Getters
    const isDarkMode = computed(() => theme.value === 'dark')

    // Actions
    function setTheme(newTheme) {
        theme.value = newTheme
        document.documentElement.setAttribute('data-theme', newTheme)
        // Save to IndexedDB
        db.settings.put({ key: 'theme', value: newTheme })
    }

    function toggleTheme() {
        setTheme(theme.value === 'light' ? 'dark' : 'light')
    }

    async function loadTheme() {
        try {
            const savedTheme = await db.settings.get('theme')
            if (savedTheme) {
                setTheme(savedTheme.value)
            } else {
                // Check system preference
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
                setTheme(prefersDark ? 'dark' : 'light')
            }
        } catch (error) {
            console.error('Failed to load theme:', error)
        }
    }

    function setCurrentView(view) {
        currentView.value = view
        currentCategory.value = null
    }

    function setCurrentCategory(categoryId) {
        currentCategory.value = categoryId
        currentView.value = 'category'
    }

    function setSearchQuery(query) {
        searchQuery.value = query
    }

    function setOnlineStatus(status) {
        isOnline.value = status
    }

    function toggleSidebar() {
        sidebarOpen.value = !sidebarOpen.value
    }

    function setInstallPrompt(prompt) {
        deferredPrompt.value = prompt
        showInstallPrompt.value = !!prompt
    }

    async function installPWA() {
        if (!deferredPrompt.value) return false

        deferredPrompt.value.prompt()
        const { outcome } = await deferredPrompt.value.userChoice

        if (outcome === 'accepted') {
            deferredPrompt.value = null
            showInstallPrompt.value = false
            return true
        }
        return false
    }

    // Initialize online/offline listeners
    function initializeOnlineListeners() {
        window.addEventListener('online', () => setOnlineStatus(true))
        window.addEventListener('offline', () => setOnlineStatus(false))
    }

    // Initialize PWA install prompt listener
    function initializePWAListeners() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault()
            setInstallPrompt(e)
        })

        window.addEventListener('appinstalled', () => {
            setInstallPrompt(null)
        })
    }

    return {
        // State
        theme,
        currentView,
        currentCategory,
        searchQuery,
        isOnline,
        sidebarOpen,
        showInstallPrompt,
        // Getters
        isDarkMode,
        // Actions
        setTheme,
        toggleTheme,
        loadTheme,
        setCurrentView,
        setCurrentCategory,
        setSearchQuery,
        setOnlineStatus,
        toggleSidebar,
        setInstallPrompt,
        installPWA,
        initializeOnlineListeners,
        initializePWAListeners
    }
})
