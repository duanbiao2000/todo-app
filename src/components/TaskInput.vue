<script setup>
import { ref } from 'vue'
import { useTaskStore } from '../stores/task'
import { useCategoryStore } from '../stores/category'
import { useAppStore } from '../stores/app'
import { validateTaskTitle } from '../utils/validation'
import { logger } from '../utils/logger'

const taskStore = useTaskStore()
const categoryStore = useCategoryStore()
const appStore = useAppStore()

const taskTitle = ref('')
const showAdvanced = ref(false)
const selectedPriority = ref('medium')
const selectedCategory = ref('personal')
const selectedDate = ref('')
const errorMessage = ref('')

const priorities = [
  { value: 'low', label: '低', color: 'var(--priority-low)' },
  { value: 'medium', label: '中', color: 'var(--priority-medium)' },
  { value: 'high', label: '高', color: 'var(--priority-high)' }
]

async function handleSubmit() {
  // 清除之前的错误信息
  errorMessage.value = ''

  // 验证输入
  const validationError = validateTaskTitle(taskTitle.value)
  if (validationError) {
    errorMessage.value = validationError
    return
  }

  try {
    await taskStore.addTask({
      title: taskTitle.value.trim(),
      priority: selectedPriority.value,
      category: selectedCategory.value,
      dueDate: selectedDate.value || null
    })

    // Reset form
    taskTitle.value = ''
    selectedPriority.value = 'medium'
    selectedCategory.value = appStore.currentCategory || 'personal'
    selectedDate.value = ''
    showAdvanced.value = false
  } catch (error) {
    logger.error('Failed to add task:', error)
    errorMessage.value = '添加任务失败，请重试'
  }
}

function handleKeydown(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSubmit()
  }
}
</script>

<template>
  <div class="task-input-container">
    <div class="input-wrapper">
      <input
        v-model="taskTitle"
        type="text"
        placeholder="添加新任务..."
        class="task-input"
        :class="{ error: errorMessage }"
        @keydown="handleKeydown"
        @input="errorMessage = ''"
      />
      
      <div class="input-actions">
        <button
          @click="showAdvanced = !showAdvanced"
          class="btn-icon"
          :class="{ active: showAdvanced }"
          title="更多选项"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M12 1v6m0 6v6"></path>
            <path d="m4.93 4.93 4.24 4.24m5.66 5.66 4.24 4.24"></path>
            <path d="M1 12h6m6 0h6"></path>
            <path d="m4.93 19.07 4.24-4.24m5.66-5.66 4.24-4.24"></path>
          </svg>
        </button>
        
        <button
          @click="handleSubmit"
          class="btn btn-primary"
          :disabled="!taskTitle.trim()"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>添加</span>
        </button>
      </div>
    </div>

    <!-- Error Message -->
    <Transition name="fade">
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </Transition>

    <!-- Advanced Options -->
    <Transition name="slide">
      <div v-if="showAdvanced" class="advanced-options">
        <!-- Priority -->
        <div class="option-group">
          <label class="option-label">优先级</label>
          <div class="priority-buttons">
            <button
              v-for="priority in priorities"
              :key="priority.value"
              @click="selectedPriority = priority.value"
              class="priority-btn"
              :class="{ active: selectedPriority === priority.value }"
              :style="{ '--priority-color': priority.color }"
            >
              {{ priority.label }}
            </button>
          </div>
        </div>

        <!-- Category -->
        <div class="option-group">
          <label class="option-label">分类</label>
          <select v-model="selectedCategory" class="category-select">
            <option
              v-for="category in categoryStore.categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.icon }} {{ category.name }}
            </option>
          </select>
        </div>

        <!-- Due Date -->
        <div class="option-group">
          <label class="option-label">截止日期</label>
          <input
            v-model="selectedDate"
            type="date"
            class="date-input"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.task-input-container {
  background-color: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-4);
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--spacing-6);
}

.input-wrapper {
  display: flex;
  gap: var(--spacing-3);
  align-items: center;
}

.task-input {
  flex: 1;
  padding: var(--spacing-3) var(--spacing-4);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-size: var(--font-size-base);
  transition: all var(--transition-fast);
  outline: none;
}

.task-input:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.task-input::placeholder {
  color: var(--text-tertiary);
}

.task-input.error {
  border-color: var(--accent-danger);
}

.error-message {
  margin-top: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-3);
  background-color: rgba(239, 68, 68, 0.1);
  border-left: 3px solid var(--accent-danger);
  border-radius: var(--radius-sm);
  color: var(--accent-danger);
  font-size: var(--font-size-sm);
}

.input-actions {
  display: flex;
  gap: var(--spacing-2);
}

.btn-icon.active {
  background-color: var(--accent-primary);
  color: white;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Advanced Options */
.advanced-options {
  margin-top: var(--spacing-4);
  padding-top: var(--spacing-4);
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.option-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.option-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
}

.priority-buttons {
  display: flex;
  gap: var(--spacing-2);
}

.priority-btn {
  flex: 1;
  padding: var(--spacing-2) var(--spacing-3);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-fast);
  cursor: pointer;
}

.priority-btn:hover {
  border-color: var(--priority-color);
}

.priority-btn.active {
  border-color: var(--priority-color);
  background-color: var(--priority-color);
  color: white;
}

.category-select,
.date-input {
  padding: var(--spacing-2) var(--spacing-3);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
  outline: none;
}

.category-select:focus,
.date-input:focus {
  border-color: var(--accent-primary);
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-fast);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all var(--transition-base);
  max-height: 300px;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}

@media (max-width: 768px) {
  .input-wrapper {
    flex-direction: column;
  }

  .input-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
