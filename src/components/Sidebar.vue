<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '../stores/app'
import { useCategoryStore } from '../stores/category'
import { useTaskStore } from '../stores/task'
import CategoryModal from './CategoryModal.vue'

const appStore = useAppStore()
const categoryStore = useCategoryStore()
const taskStore = useTaskStore()

const showCategoryModal = ref(false)
const editingCategory = ref(null)

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

function addCategory() {
  editingCategory.value = null
  showCategoryModal.value = true
}

function editCategory(category) {
  editingCategory.value = category
  showCategoryModal.value = true
}

async function deleteCategory(category) {
  if (confirm(`确定要删除分类"${category.name}"吗？`)) {
    try {
      await categoryStore.deleteCategory(category.id)
    } catch (error) {
      alert(error.message)
    }
  }
}

function handleCategorySaved() {
  categoryStore.loadCategories()
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
          <button @click="addCategory" class="btn-icon btn-sm" title="添加分类">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
        <ul class="nav-list">
          <li v-for="category in categoryStore.categories" :key="category.id" class="category-item">
            <button
              @click="appStore.setCurrentCategory(category.id)"
              class="nav-item"
              :class="{ active: isCategoryActive(category.id) }"
            >
              <span class="nav-icon">{{ category.icon }}</span>
              <span class="nav-name">{{ category.name }}</span>
              <span class="nav-count">{{ getCategoryTaskCount(category.id) }}</span>
            </button>
            <div class="category-actions">
              <button @click.stop="editCategory(category)" class="btn-icon btn-xs" title="编辑">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button @click.stop="deleteCategory(category)" class="btn-icon btn-xs" title="删除">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
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

    <!-- Category Modal -->
    <CategoryModal
      :is-open="showCategoryModal"
      :category="editingCategory"
      @close="showCategoryModal = false"
      @save="handleCategorySaved"
    />
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

/* Category Actions */
.category-item {
  position: relative;
}

.category-actions {
  position: absolute;
  right: var(--spacing-2);
  top: 50%;
  transform: translateY(-50%);
  display: none;
  gap: var(--spacing-1);
  background-color: var(--bg-secondary);
  padding: var(--spacing-1);
  border-radius: var(--radius-md);
}

.category-item:hover .category-actions {
  display: flex;
}

.btn-xs {
  padding: var(--spacing-1);
}

.btn-xs svg {
  width: 14px;
  height: 14px;
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

  .category-actions {
    display: flex;
  }
}
</style>
