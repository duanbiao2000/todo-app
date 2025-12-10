/**
 * 🎓 应用状态管理 Store (App Store)
 * ============================================
 * 
 * 📚 职责说明:
 * 这个 store 管理应用级别的全局状态，包括:
 * - 主题设置 (深色/浅色模式)
 * - 当前视图和分类
 * - 搜索查询
 * - 网络连接状态
 * - 侧边栏状态
 * - PWA 安装提示
 * 
 * 💡 设计原则:
 * - 与业务数据(tasks/categories)分离
 * - 持久化到 IndexedDB (主题设置)
 * - 响应系统事件 (online/offline)
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import db from '../db'

export const useAppStore = defineStore('app', () => {
    // ═══════════════════════════════════════════════════════════
    // 📦 STATE - UI 状态
    // 🎓 这些状态控制应用的外观和交互行为
    // ═══════════════════════════════════════════════════════════

    const theme = ref('light')              // 主题: 'light' | 'dark'
    const currentView = ref('all')          // 视图: 'all' | 'today' | 'completed'
    const currentCategory = ref(null)       // 当前选中的分类 ID
    const searchQuery = ref('')             // 搜索关键词
    const isOnline = ref(navigator.onLine)  // 🎓 初始化时读取浏览器状态
    const sidebarOpen = ref(true)           // 侧边栏展开状态
    const showInstallPrompt = ref(false)    // 是否显示 PWA 安装提示
    const deferredPrompt = ref(null)        // 🎓 保存 PWA 安装事件，供后续触发

    // ═══════════════════════════════════════════════════════════
    // 🔍 GETTERS
    // ═══════════════════════════════════════════════════════════

    /**
     * 🎓 布尔值派生: 将字符串状态转为布尔值，方便模板使用
     * 示例: v-if="appStore.isDarkMode" 比 v-if="appStore.theme === 'dark'" 更简洁
     */
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

    // ═══════════════════════════════════════════════════════════
    // 🎧 事件监听器管理
    // 🎓 重要: 事件监听器必须在组件卸载时清理，否则会导致内存泄漏
    // 这里保存了监听器的引用，以便后续移除
    // ═══════════════════════════════════════════════════════════

    // 🎓 保存监听器引用，用于清理
    let onlineHandler = null
    let offlineHandler = null
    let beforeInstallHandler = null
    let appInstalledHandler = null

    /**
     * 🎓 初始化网络状态监听器
     * 
     * 最佳实践:
     * - 将处理函数存储在变量中
     * - 这样可以在 cleanup 时精确移除
     */
    function initializeOnlineListeners() {
        // 🎓 保存引用以便后续清理
        onlineHandler = () => setOnlineStatus(true)
        offlineHandler = () => setOnlineStatus(false)

        window.addEventListener('online', onlineHandler)
        window.addEventListener('offline', offlineHandler)
    }

    /**
     * 🎓 初始化 PWA 安装提示监听器
     */
    function initializePWAListeners() {
        beforeInstallHandler = (e) => {
            e.preventDefault()
            setInstallPrompt(e)
        }

        appInstalledHandler = () => {
            setInstallPrompt(null)
        }

        window.addEventListener('beforeinstallprompt', beforeInstallHandler)
        window.addEventListener('appinstalled', appInstalledHandler)
    }

    /**
     * 🎓 清理所有事件监听器
     * 
     * 何时调用:
     * - App.vue 的 onUnmounted 钩子中
     * - 页面卸载前
     * 
     * 为什么重要:
     * - 防止内存泄漏
     * - 避免重复注册监听器
     * - SPA 应用中尤其重要（页面不会真正刷新）
     */
    function cleanupListeners() {
        if (onlineHandler) {
            window.removeEventListener('online', onlineHandler)
            onlineHandler = null
        }
        if (offlineHandler) {
            window.removeEventListener('offline', offlineHandler)
            offlineHandler = null
        }
        if (beforeInstallHandler) {
            window.removeEventListener('beforeinstallprompt', beforeInstallHandler)
            beforeInstallHandler = null
        }
        if (appInstalledHandler) {
            window.removeEventListener('appinstalled', appInstalledHandler)
            appInstalledHandler = null
        }
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
        initializePWAListeners,
        cleanupListeners  // 🎓 新增: 清理函数，在 App.vue 卸载时调用
    }
})
