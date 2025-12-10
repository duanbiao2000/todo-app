<script setup>
/**
 * 🎓 单个任务项组件 (TaskItem)
 * ============================================
 * 
 * 📚 组件职责:
 * - 展示单个任务的信息 (标题、截止日期、标签)
 * - 处理用户交互 (完成、编辑、删除)
 * - 不负责数据持久化 (交给 Store 处理)
 * 
 * 💡 设计原则:
 * - 单一职责: 只关心一个任务的展示和交互
 * - 数据向下流动: 通过 props 接收任务数据
 * - 事件向上传递: 修改操作通过 store 执行
 */
import { ref } from 'vue'
import { useTaskStore } from '../stores/task'
import { formatRelativeTime, isOverdue } from '../utils/date'

/**
 * 🎓 defineProps - 声明组件接收的属性
 * 
 * 理解 Props:
 * - Props 是父组件传递给子组件的数据
 * - 子组件不应直接修改 props (单向数据流)
 * - type 和 required 提供运行时验证
 */
const props = defineProps({
  task: {
    type: Object,
    required: true  // 🎓 必须传入任务对象，否则报警告
  }
})

// 🎓 获取 store 实例，用于修改任务状态
const taskStore = useTaskStore()

// ═══════════════════════════════════════════════════════════
// 📦 本地状态 (Local State)
// 🎓 这些状态只用于组件内部 UI 交互
// 与应用数据（任务列表）无关
// ═══════════════════════════════════════════════════════════

const isEditing = ref(false)           // 是否处于编辑模式
const editTitle = ref(props.task.title) // 编辑时的临时标题

// ═══════════════════════════════════════════════════════════
// ⚡ 事件处理函数
// 🎓 处理用户交互，调用 store 的 action 来修改数据
// ═══════════════════════════════════════════════════════════

/**
 * 🎓 切换任务完成状态
 * 注意: 这里是调用 store 的 action，而不是直接修改 props
 */
async function toggleComplete() {
  try {
    await taskStore.toggleTask(props.task.id)
  } catch (error) {
    // 🎓 错误处理: 即使失败也应该告知用户
    console.error('Failed to toggle task:', error)
  }
}

/**
 * 🎓 删除任务 - 带确认对话框
 * 
 * 用户体验提示:
 * - 删除是危险操作，应该要求确认
 * - 生产环境考虑用 Toast 或 Modal 替代 confirm
 */
async function handleDelete() {
  if (confirm('确定要删除这个任务吗？')) {
    try {
      await taskStore.deleteTask(props.task.id)
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }
}

/**
 * 🎓 保存编辑 - 验证后更新
 */
async function saveEdit() {
  // 🎓 防御性编程: 空标题不允许保存
  if (!editTitle.value.trim()) return
  
  try {
    await taskStore.updateTask(props.task.id, {
      title: editTitle.value.trim()
    })
    isEditing.value = false  // 关闭编辑模式
  } catch (error) {
    console.error('Failed to update task:', error)
  }
}

/**
 * 🎓 取消编辑 - 恢复原始值
 */
function cancelEdit() {
  editTitle.value = props.task.title  // 🎓 恢复到原始标题
  isEditing.value = false
}

/**
 * 🎓 辅助函数: 获取优先级对应的 CSS 类名
 * 这种模式可以将逻辑与模板分离，保持模板清洁
 */
function getPriorityClass() {
  return `priority-${props.task.priority}`
}
</script>

<template>
  <div class="task-item" :class="[getPriorityClass(), { completed: task.completed }]">
    <!-- Checkbox -->
    <button @click="toggleComplete" class="task-checkbox">
      <svg v-if="task.completed" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </button>

    <!-- Task Content -->
    <div class="task-content">
      <div v-if="!isEditing" class="task-title" :class="{ completed: task.completed }">
        {{ task.title }}
      </div>
      <input
        v-else
        v-model="editTitle"
        type="text"
        class="task-edit-input"
        @keydown.enter="saveEdit"
        @keydown.esc="cancelEdit"
        @blur="saveEdit"
        autofocus
      />

      <div v-if="task.dueDate || task.tags?.length" class="task-meta">
        <span v-if="task.dueDate" class="task-date" :class="{ overdue: isOverdue(task.dueDate) && !task.completed }">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          {{ formatRelativeTime(task.dueDate) }}
        </span>

        <div v-if="task.tags?.length" class="task-tags">
          <span v-for="tag in task.tags" :key="tag" class="task-tag">
            {{ tag }}
          </span>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="task-actions">
      <button
        v-if="!isEditing"
        @click="isEditing = true"
        class="btn-icon btn-sm"
        title="编辑"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
      </button>

      <button
        @click="handleDelete"
        class="btn-icon btn-sm btn-danger"
        title="删除"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.task-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-3);
  padding: var(--spacing-4);
  background-color: var(--bg-secondary);
  border-radius: var(--radius-md);
  border-left: 3px solid transparent;
  transition: all var(--transition-fast);
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.task-item:hover {
  background-color: var(--bg-hover);
  box-shadow: var(--shadow-sm);
}

.task-item.completed {
  opacity: 0.6;
}

.task-item.priority-high {
  border-left-color: var(--priority-high);
}

.task-item.priority-medium {
  border-left-color: var(--priority-medium);
}

.task-item.priority-low {
  border-left-color: var(--priority-low);
}

.task-checkbox {
  width: 24px;
  height: 24px;
  min-width: 24px;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-sm);
  background-color: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.task-checkbox:hover {
  border-color: var(--accent-primary);
}

.task-checkbox svg {
  color: var(--accent-primary);
}

.task-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  min-width: 0;
}

.task-title {
  font-size: var(--font-size-base);
  color: var(--text-primary);
  word-wrap: break-word;
}

.task-title.completed {
  text-decoration: line-through;
  color: var(--text-tertiary);
}

.task-edit-input {
  padding: var(--spacing-2);
  border: 2px solid var(--accent-primary);
  border-radius: var(--radius-sm);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-size: var(--font-size-base);
  outline: none;
}

.task-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  flex-wrap: wrap;
}

.task-date {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.task-date.overdue {
  color: var(--accent-danger);
  font-weight: var(--font-weight-medium);
}

.task-tags {
  display: flex;
  gap: var(--spacing-2);
  flex-wrap: wrap;
}

.task-tag {
  padding: var(--spacing-1) var(--spacing-2);
  background-color: var(--bg-tertiary);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.task-actions {
  display: flex;
  gap: var(--spacing-1);
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.task-item:hover .task-actions {
  opacity: 1;
}

.btn-danger:hover {
  color: var(--accent-danger);
}

@media (max-width: 768px) {
  .task-actions {
    opacity: 1;
  }
}
</style>
