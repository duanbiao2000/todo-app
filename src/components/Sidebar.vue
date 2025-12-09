<script setup>
import { computed } from 'vue'
import { useAppStore } from '../stores/app'
import { useCategoryStore } from '../stores/category'
import { useTaskStore } from '../stores/task'

const appStore = useAppStore()
const categoryStore = useCategoryStore()
const taskStore = useTaskStore()

const views = [
  { id: 'all', name: '全部任务', icon: '📋' },
  { id: 'today', name: '今日任务', icon: '📅' },
  { id: 'completed', name: '已完成', icon: '✅' }
]

const isViewActive = (viewId) => {
  return appStore.currentView === viewId && !appStore.currentCategory
}

const isCategoryActive = (categoryId) => {
  return appStore.currentCategory === categoryId
}

const getTaskCount = (viewId) => {
  switch (viewId) {
    case 'all':
      return taskStore.activeTasks.length
    case 'today':
      return taskStore.todayTasks.length
    case 'completed':
      return taskStore.completedTasks.length
    default:
      return 0
  }
}

const getCategoryTaskCount = (categoryId) => {
  return taskStore.tasksByCategory(categoryId).filter(t => !t.completed).length
}
</script>

<template>
  <aside class="sidebar" :class="{ 'sidebar-open': appStore.sidebarOpen }">
    <div class="sidebar-content">
      <!-- Views Section -->
      <nav class="sidebar-section">
        <div class="section-title">视图</div>
        <ul class="nav-list">
          <li v-for="view in views" :key="view.id">
            <button
              @click="appStore.setCurrentView(view.id)"
              class="nav-item"
              :class="{ active: isViewActive(view.id) }"
            >
              <span class="nav-icon">{{ view.icon }}</span>
              <span class="nav-name">{{ view.name }}</span>
              <span class="nav-count">{{ getTaskCount(view.id) }}</span>
            </button>
          </li>
        </ul>
      </nav>

      <!-- Categories Section -->
      <nav class="sidebar-section">
        <div class="section-header">
          <div class="section-title">分类</div>
          <button class="btn-icon btn-sm" title="添加分类">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
        <ul class="nav-list">
          <li v-for="category in categoryStore.categories" :key="category.id">
            <button
              @click="appStore.setCurrentCategory(category.id)"
              class="nav-item"
              :class="{ active: isCategoryActive(category.id) }"
            >
              <span class="nav-icon">{{ category.icon }}</span>
              <span class="nav-name">{{ category.name }}</span>
              <span class="nav-count">{{ getCategoryTaskCount(category.id) }}</span>
            </button>
          </li>
        </ul>
      </nav>

      <!-- Stats Section -->
      <div class="sidebar-section stats-section">
        <div class="stat-card">
          <div class="stat-label">完成率</div>
          <div class="stat-value">{{ taskStore.taskStats.completionRate }}%</div>
        </div>
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: taskStore.taskStats.completionRate + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 280px;
  background-color: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  transition: transform var(--transition-base);
}

.sidebar-content {
  padding: var(--spacing-4);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

.sidebar-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-title {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0 var(--spacing-2);
}

.nav-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3) var(--spacing-3);
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-fast);
  cursor: pointer;
  border: none;
  width: 100%;
  text-align: left;
}

.nav-item:hover {
  background-color: var(--bg-hover);
  color: var(--text-primary);
}

.nav-item.active {
  background-color: var(--accent-primary);
  color: white;
}

.nav-icon {
  font-size: var(--font-size-lg);
  flex-shrink: 0;
}

.nav-name {
  flex: 1;
}

.nav-count {
  font-size: var(--font-size-sm);
  padding: var(--spacing-1) var(--spacing-2);
  background-color: var(--bg-tertiary);
  border-radius: var(--radius-full);
  min-width: 24px;
  text-align: center;
}

.nav-item.active .nav-count {
  background-color: rgba(255, 255, 255, 0.2);
}

/* Stats Section */
.stats-section {
  margin-top: auto;
  padding: var(--spacing-4);
  background-color: var(--bg-tertiary);
  border-radius: var(--radius-lg);
}

.stat-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-2);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.stat-value {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--accent-primary);
}

.progress-bar {
  height: 6px;
  background-color: var(--bg-hover);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-primary), var(--accent-success));
  border-radius: var(--radius-full);
  transition: width var(--transition-slow);
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 60px;
    bottom: 0;
    z-index: 50;
    transform: translateX(-100%);
  }

  .sidebar-open {
    transform: translateX(0);
  }
}
</style>
