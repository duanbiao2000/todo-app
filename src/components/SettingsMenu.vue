<script setup>
import { ref } from 'vue'
import { exportData, importData } from '../utils/export'
import { useTaskStore } from '../stores/task'
import { useCategoryStore } from '../stores/category'

const emit = defineEmits(['close'])

const taskStore = useTaskStore()
const categoryStore = useCategoryStore()
const fileInput = ref(null)
const isExporting = ref(false)
const isImporting = ref(false)

async function handleExport() {
  isExporting.value = true
  try {
    await exportData()
    alert('数据导出成功！')
  } catch (error) {
    alert(error.message)
  } finally {
    isExporting.value = false
  }
}

function handleImportClick() {
  fileInput.value.click()
}

async function onFileSelected(event) {
  const file = event.target.files[0]
  if (!file) return

  if (confirm('导入数据将覆盖现有数据，确定继续吗？')) {
    isImporting.value = true
    try {
      await importData(file)
      alert('数据导入成功！页面将刷新...')
      // Reload data
      await Promise.all([
        taskStore.loadTasks(),
        categoryStore.loadCategories()
      ])
      emit('close')
    } catch (error) {
      alert(error.message)
    } finally {
      isImporting.value = false
      event.target.value = ''
    }
  }
}
</script>

<template>
  <div class="settings-menu">
    <h3>数据管理</h3>

    <div class="menu-section">
      <button
        @click="handleExport"
        :disabled="isExporting"
        class="btn btn-secondary btn-block"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        <span>{{ isExporting ? '导出中...' : '导出数据' }}</span>
      </button>

      <button
        @click="handleImportClick"
        :disabled="isImporting"
        class="btn btn-secondary btn-block"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
        <span>{{ isImporting ? '导入中...' : '导入数据' }}</span>
      </button>

      <input
        ref="fileInput"
        type="file"
        accept=".json"
        style="display: none"
        @change="onFileSelected"
      />
    </div>

    <div class="menu-info">
      <p><small>💡 导出数据将保存为 JSON 文件，可用于备份或迁移</small></p>
      <p><small>⚠️ 导入数据会覆盖当前所有数据，请谨慎操作</small></p>
    </div>
  </div>
</template>

<style scoped>
.settings-menu {
  padding: var(--spacing-6);
}

.settings-menu h3 {
  margin: 0 0 var(--spacing-4) 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
}

.menu-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-4);
}

.btn-block {
  width: 100%;
  justify-content: center;
}

.btn svg {
  flex-shrink: 0;
}

.menu-info {
  padding: var(--spacing-4);
  background-color: var(--bg-tertiary);
  border-radius: var(--radius-md);
}

.menu-info p {
  margin: var(--spacing-2) 0;
}

.menu-info small {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}
</style>
