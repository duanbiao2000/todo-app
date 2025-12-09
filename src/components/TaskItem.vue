<script setup>
import { ref } from 'vue'
import { useTaskStore } from '../stores/task'
import { formatRelativeTime, isOverdue } from '../utils/date'

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const taskStore = useTaskStore()
const isEditing = ref(false)
const editTitle = ref(props.task.title)

async function toggleComplete() {
  try {
    await taskStore.toggleTask(props.task.id)
  } catch (error) {
    console.error('Failed to toggle task:', error)
  }
}

async function handleDelete() {
  if (confirm('确定要删除这个任务吗？')) {
    try {
      await taskStore.deleteTask(props.task.id)
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }
}

async function saveEdit() {
  if (!editTitle.value.trim()) return
  
  try {
    await taskStore.updateTask(props.task.id, {
      title: editTitle.value.trim()
    })
    isEditing.value = false
  } catch (error) {
    console.error('Failed to update task:', error)
  }
}

function cancelEdit() {
  editTitle.value = props.task.title
  isEditing.value = false
}

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
