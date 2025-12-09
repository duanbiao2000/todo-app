<script setup>
import { ref } from 'vue'
import { useAppStore } from '../stores/app'
import SettingsMenu from './SettingsMenu.vue'

const appStore = useAppStore()
const showSettings = ref(false)
</script>

<template>
  <header class="header">
    <div class="header-content">
      <div class="header-left">
        <button @click="appStore.toggleSidebar()" class="btn-icon menu-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        
        <h1 class="app-title">
          <span class="title-icon">✓</span>
          <span>极简 Todo</span>
        </h1>
      </div>

      <div class="header-right">
        <!-- Search -->
        <div class="search-box">
          <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            placeholder="搜索任务..."
            class="search-input"
            :value="appStore.searchQuery"
            @input="appStore.setSearchQuery($event.target.value)"
          />
        </div>

        <!-- Theme Toggle -->
        <button @click="appStore.toggleTheme()" class="btn-icon theme-toggle" title="切换主题">
          <svg v-if="appStore.isDarkMode" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>

        <!-- Settings Button -->
        <div class="settings-dropdown">
          <button @click="showSettings = !showSettings" class="btn-icon" title="设置">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 1v6m0 6v6"></path>
              <path d="m4.93 4.93 4.24 4.24m5.66 5.66 4.24 4.24"></path>
              <path d="M1 12h6m6 0h6"></path>
              <path d="m4.93 19.07 4.24-4.24m5.66-5.66 4.24-4.24"></path>
            </svg>
          </button>

          <Transition name="dropdown">
            <div v-if="showSettings" class="dropdown-menu">
              <SettingsMenu @close="showSettings = false" />
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-4) var(--spacing-6);
  max-width: 1400px;
  margin: 0 auto;
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.menu-btn {
  display: none;
}

.app-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  margin: 0;
}

.title-icon {
  font-size: var(--font-size-2xl);
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: var(--spacing-3);
  color: var(--text-tertiary);
  pointer-events: none;
}

.search-input {
  padding: var(--spacing-2) var(--spacing-3) var(--spacing-2) var(--spacing-10);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-full);
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  width: 250px;
  transition: all var(--transition-fast);
  outline: none;
}

.search-input:focus {
  width: 300px;
  border-color: var(--accent-primary);
  background-color: var(--bg-primary);
}

.search-input::placeholder {
  color: var(--text-tertiary);
}

.theme-toggle {
  color: var(--text-secondary);
}

.theme-toggle:hover {
  color: var(--accent-primary);
}

.settings-dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + var(--spacing-2));
  right: 0;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  min-width: 300px;
  z-index: var(--z-dropdown);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all var(--transition-fast);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 768px) {
  .header-content {
    padding: var(--spacing-3) var(--spacing-4);
  }

  .menu-btn {
    display: flex;
  }

  .search-input {
    width: 150px;
  }

  .search-input:focus {
    width: 200px;
  }

  .app-title {
    font-size: var(--font-size-lg);
  }

  .dropdown-menu {
    right: auto;
    left: 0;
  }
}
</style>
