<script setup>
import { onMounted } from 'vue'
import { useAppStore } from './stores/app'
import { useTaskStore } from './stores/task'
import { useCategoryStore } from './stores/category'
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'
import TaskInput from './components/TaskInput.vue'
import TaskList from './components/TaskList.vue'

const appStore = useAppStore()
const taskStore = useTaskStore()
const categoryStore = useCategoryStore()

onMounted(async () => {
  // Load theme
  await appStore.loadTheme()
  
  // Load data
  await Promise.all([
    taskStore.loadTasks(),
    categoryStore.loadCategories()
  ])
  
  // Initialize listeners
  appStore.initializeOnlineListeners()
  appStore.initializePWAListeners()
})
</script>

<template>
  <div id="app" class="app-container">
    <Header />
    
    <div class="main-layout">
      <Sidebar />
      
      <main class="main-content">
        <div class="content-wrapper">
          <TaskInput />
          <TaskList />
        </div>
      </main>
    </div>

    <!-- Offline Indicator -->
    <Transition name="slide-up">
      <div v-if="!appStore.isOnline" class="offline-banner">
        <span>📡</span>
        <span>离线模式</span>
      </div>
    </Transition>

    <!-- Install PWA Prompt -->
    <Transition name="slide-up">
      <div v-if="appStore.showInstallPrompt" class="install-prompt">
        <div class="install-content">
          <span>📱</span>
          <span>安装应用到主屏幕</span>
        </div>
        <div class="install-actions">
          <button @click="appStore.installPWA()" class="btn btn-primary btn-sm">
            安装
          </button>
          <button @click="appStore.setInstallPrompt(null)" class="btn-icon">
            ✕
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
}

.main-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-6);
}

.content-wrapper {
  max-width: 800px;
  margin: 0 auto;
}

/* Offline Banner */
.offline-banner {
  position: fixed;
  bottom: var(--spacing-4);
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--accent-warning);
  color: white;
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  font-weight: var(--font-weight-medium);
  z-index: var(--z-toast);
}

/* Install Prompt */
.install-prompt {
  position: fixed;
  bottom: var(--spacing-4);
  right: var(--spacing-4);
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  padding: var(--spacing-4);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  z-index: var(--z-toast);
}

.install-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  font-weight: var(--font-weight-medium);
}

.install-actions {
  display: flex;
  gap: var(--spacing-2);
}

.btn-sm {
  padding: var(--spacing-2) var(--spacing-3);
  font-size: var(--font-size-sm);
}

/* Animations */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all var(--transition-base);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Responsive */
@media (max-width: 768px) {
  .main-content {
    padding: var(--spacing-4);
  }
  
  .install-prompt {
    left: var(--spacing-4);
    right: var(--spacing-4);
    bottom: var(--spacing-4);
  }
}
</style>
