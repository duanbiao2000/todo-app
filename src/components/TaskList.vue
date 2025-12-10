<script setup>
/**
 * 🎓 任务列表组件 (TaskList)
 * ============================================
 * 
 * 📚 组件职责:
 * - 根据当前视图/分类过滤任务
 * - 支持搜索过滤
 * - 支持拖拽排序
 * - 显示加载和空状态
 * 
 * 💡 设计模式:
 * - 派生数据: 使用 computed 缓存过滤结果
 * - v-model 双向绑定: vuedraggable 的排序状态
 * - 条件渲染: loading → empty → list
 */
import { computed } from 'vue'
import { useTaskStore } from '../stores/task'
import { useAppStore } from '../stores/app'
import TaskItem from './TaskItem.vue'
import draggable from 'vuedraggable'

// 🎓 获取 store 实例
const taskStore = useTaskStore()
const appStore = useAppStore()

// ═══════════════════════════════════════════════════════════
// 🔍 核心 computed: 过滤任务列表
// 🎓 这是本组件最重要的逻辑 - 根据多个条件过滤任务
// ═══════════════════════════════════════════════════════════

/**
 * 🎓 过滤任务列表
 * 
 * 过滤流程:
 * 1. 根据当前视图选择基础数据集
 * 2. 如果有搜索词，进一步过滤
 * 
 * 性能考虑:
 * - computed 会缓存结果
 * - 只有依赖变化时才重新计算
 */
const filteredTasks = computed(() => {
  let tasks = []

  // 🎓 第一步: 根据视图选择任务子集
  // switch 语句处理多种视图类型
  switch (appStore.currentView) {
    case 'all':
      tasks = taskStore.activeTasks  // 未完成的任务
      break
    case 'today':
      tasks = taskStore.todayTasks   // 今日到期的任务
      break
    case 'completed':
      tasks = taskStore.completedTasks  // 已完成的任务
      break
    case 'category':
      // 🎓 分类视图需要传入分类 ID
      if (appStore.currentCategory) {
        tasks = taskStore.tasksByCategory(appStore.currentCategory)
      }
      break
    default:
      tasks = taskStore.tasks
  }

  // 🎓 第二步: 搜索过滤 (如果有搜索词)
  if (appStore.searchQuery.trim()) {
    const query = appStore.searchQuery.toLowerCase()
    // 多字段搜索: 标题、描述、标签
    tasks = tasks.filter(task =>
      task.title.toLowerCase().includes(query) ||
      (task.description && task.description.toLowerCase().includes(query)) ||
      task.tags?.some(tag => tag.toLowerCase().includes(query))
    )
  }

  return tasks
})

/**
 * 🎓 拖拽排序的 v-model 实现
 * 
 * vuedraggable 需要一个可写的 computed:
 * - get: 返回当前列表
 * - set: 处理排序变化，更新数据库中的 order 字段
 */
const draggableTasks = computed({
  get: () => filteredTasks.value,
  set: async (newOrder) => {
    // 🎓 遍历更新每个任务的顺序
    for (let i = 0; i < newOrder.length; i++) {
      if (newOrder[i].order !== i) {
        await taskStore.updateTask(newOrder[i].id, { order: i })
      }
    }
  }
})

/**
 * 🎓 视图标题 - 根据当前状态动态生成
 */
const viewTitle = computed(() => {
  if (appStore.currentCategory) {
    const category = taskStore.tasks.find(t => t.category === appStore.currentCategory)
    return category ? `分类: ${category.category}` : '分类'
  }

  // 🎓 使用对象映射代替多个 if-else 也是好选择
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

/**
 * 🎓 空状态提示 - 根据上下文给出有意义的提示
 */
const emptyMessage = computed(() => {
  // 🎓 搜索无结果与列表为空是不同的场景
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

    <draggable
      v-else
      v-model="draggableTasks"
      item-key="id"
      class="task-list"
      :animation="200"
      ghost-class="ghost"
    >
      <template #item="{ element }">
        <TaskItem :task="element" />
      </template>
    </draggable>
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

/* Drag and Drop */
.ghost {
  opacity: 0.5;
  background-color: var(--accent-primary);
}
</style>
