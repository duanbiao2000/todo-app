<script setup>
import { computed } from 'vue'
import { useTaskStore } from '../stores/task'
import { useAppStore } from '../stores/app'
import TaskItem from './TaskItem.vue'

const taskStore = useTaskStore()
const appStore = useAppStore()

const filteredTasks = computed(() => {
  let tasks = []

  // Filter by view
  switch (appStore.currentView) {
    case 'all':
      tasks = taskStore.activeTasks
      break
    case 'today':
      tasks = taskStore.todayTasks
      break
    case 'completed':
      tasks = taskStore.completedTasks
      break
    case 'category':
      if (appStore.currentCategory) {
        tasks = taskStore.tasksByCategory(appStore.currentCategory)
      }
      break
    default:
      tasks = taskStore.tasks
  }

  // Filter by search query
  if (appStore.searchQuery.trim()) {
    const query = appStore.searchQuery.toLowerCase()
    tasks = tasks.filter(task =>
      task.title.toLowerCase().includes(query) ||
      (task.description && task.description.toLowerCase().includes(query)) ||
      task.tags?.some(tag => tag.toLowerCase().includes(query))
    )
  }

  return tasks
})

const viewTitle = computed(() => {
  if (appStore.currentCategory) {
    const category = taskStore.tasks.find(t => t.category === appStore.currentCategory)
    return category ? `分类: ${category.category}` : '分类'
  }

  switch (appStore.currentView) {
    case 'all':
      return '全部任务'
    case 'today':
      return '今日任务'
    case 'completed':
      return '已完成'
    default:
      return '任务列表'
  }
})

const emptyMessage = computed(() => {
  if (appStore.searchQuery.trim()) {
    return '没有找到匹配的任务'
  }

  switch (appStore.currentView) {
    case 'all':
      return '还没有任务，添加一个开始吧！'
    case 'today':
      return '今天没有安排任务'
    case 'completed':
      return '还没有完成的任务'
    default:
      return '暂无任务'
  }
})
</script>

<template>
  <div class="task-list-container">
    <div class="list-header">
      <h2 class="list-title">{{ viewTitle }}</h2>
      <span class="task-count">{{ filteredTasks.length }}</span>
    </div>

    <div v-if="taskStore.loading" class="loading-state">
      <div class="spinner"></div>
      <p>加载中...</p>
    </div>

    <div v-else-if="filteredTasks.length === 0" class="empty-state">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M9 11l3 3L22 4"></path>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
      </svg>
      <p class="empty-message">{{ emptyMessage }}</p>
    </div>

    <TransitionGroup v-else name="list" tag="div" class="task-list">
      <TaskItem
        v-for="task in filteredTasks"
        :key="task.id"
        :task="task"
      />
    </TransitionGroup>
  </div>
</template>

<style scoped>
.task-list-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-3);
}

.list-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin: 0;
}

.task-count {
  padding: var(--spacing-2) var(--spacing-3);
  background-color: var(--bg-tertiary);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-12);
  gap: var(--spacing-4);
  color: var(--text-secondary);
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-12);
  gap: var(--spacing-4);
  color: var(--text-tertiary);
}

.empty-state svg {
  opacity: 0.3;
}

.empty-message {
  font-size: var(--font-size-lg);
  text-align: center;
}

/* List Animations */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.list-move {
  transition: transform 0.3s ease;
}
</style>
