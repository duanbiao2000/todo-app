// Composable: Online Status Detection
import { onMounted, onUnmounted } from 'vue'
import { useAppStore } from '../stores/app'

export function useOnline() {
    const appStore = useAppStore()

    const updateOnlineStatus = () => {
        appStore.setOnlineStatus(navigator.onLine)
    }

    onMounted(() => {
        window.addEventListener('online', updateOnlineStatus)
        window.addEventListener('offline', updateOnlineStatus)
    })

    onUnmounted(() => {
        window.removeEventListener('online', updateOnlineStatus)
        window.removeEventListener('offline', updateOnlineStatus)
    })

    return {
        isOnline: () => appStore.isOnline
    }
}
