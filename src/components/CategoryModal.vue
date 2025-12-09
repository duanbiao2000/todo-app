<script setup>
import { ref, watch } from 'vue'
import { useCategoryStore } from '../stores/category'

const props = defineProps({
  category: {
    type: Object,
    default: null
  },
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'save'])

const categoryStore = useCategoryStore()

const form = ref({
  name: '',
  icon: '📋',
  color: '#3b82f6'
})

// 当 category prop 变化时更新表单
watch(() => props.category, (newCategory) => {
  if (newCategory) {
    form.value = {
      name: newCategory.name,
      icon: newCategory.icon,
      color: newCategory.color
    }
  } else {
    form.value = {
      name: '',
      icon: '📋',
      color: '#3b82f6'
    }
  }
}, { immediate: true })

async function handleSave() {
  if (!form.value.name.trim()) {
    alert('请输入分类名称')
    return
  }

  try {
    if (props.category) {
      await categoryStore.updateCategory(props.category.id, form.value)
    } else {
      await categoryStore.addCategory(form.value)
    }
    emit('save')
    emit('close')
  } catch (error) {
    alert('保存失败：' + error.message)
  }
}

function handleClose() {
  emit('close')
}
</script>

<template>
  <Transition name="modal">
    <div v-if="isOpen" class="modal-overlay" @click="handleClose">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ category ? '编辑分类' : '添加分类' }}</h3>
          <button @click="handleClose" class="btn-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label>分类名称</label>
            <input
              v-model="form.name"
              type="text"
              class="input"
              placeholder="输入分类名称"
              autofocus
            />
          </div>

          <div class="form-group">
            <label>图标 Emoji</label>
            <input
              v-model="form.icon"
              type="text"
              class="input"
              placeholder="选择一个 emoji"
              maxlength="2"
            />
            <small>常用：📋 💼 📚 💪 🏠 🎯 ❤️ 🎨</small>
          </div>

          <div class="form-group">
            <label>颜色</label>
            <div class="color-picker">
              <input
                v-model="form.color"
                type="color"
                class="color-input"
              />
              <input
                v-model="form.color"
                type="text"
                class="input"
                placeholder="#3b82f6"
              />
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="handleClose" class="btn btn-secondary">
            取消
          </button>
          <button @click="handleSave" class="btn btn-primary">
            保存
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  backdrop-filter: blur(4px);
}

.modal-content {
  background-color: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-6);
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
}

.modal-body {
  padding: var(--spacing-6);
  overflow-y: auto;
  flex: 1;
}

.form-group {
  margin-bottom: var(--spacing-5);
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: var(--spacing-2);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
}

.form-group small {
  display: block;
  margin-top: var(--spacing-2);
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}

.color-picker {
  display: flex;
  gap: var(--spacing-3);
  align-items: center;
}

.color-input {
  width: 60px;
  height: 40px;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
}

.color-input::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-input::-webkit-color-swatch {
  border: none;
  border-radius: var(--radius-sm);
}

.modal-footer {
  display: flex;
  gap: var(--spacing-3);
  justify-content: flex-end;
  padding: var(--spacing-6);
  border-top: 1px solid var(--border-color);
}

/* Modal Transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity var(--transition-base);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform var(--transition-base);
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.95);
}
</style>
