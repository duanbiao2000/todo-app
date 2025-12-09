# Todo 应用扩展功能开发计划

## 概述

本文档详细规划了 Todo PWA 应用的 7 个扩展功能的实施方案，按优先级分为高、中、低三个等级，建议分阶段实施。

---

## 优先级分级

### 🔴 高优先级（建议优先实施）
1. PWA 图标优化
2. ESLint + Prettier 配置
3. 分类管理功能

### 🟡 中优先级（核心功能增强）
4. 任务标签功能完善
5. 数据导出/导入

### 🟢 低优先级（高级功能）
6. 任务拖拽排序
7. 子任务功能

---

## 功能 1: PWA 图标优化 🔴

### 需求分析
当前图标尺寸为 1024x1024px，不符合 PWA 标准。需要生成标准尺寸的图标以确保在所有设备上正常显示和安装。

### 技术方案
- 生成多尺寸图标：72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512
- 使用在线工具或本地工具处理
- 更新 `vite.config.js` 中的图标配置

### 实施步骤

#### 步骤 1: 准备图标源文件
```bash
# 使用在线工具生成多尺寸图标
# 推荐工具：
# - https://realfavicongenerator.net/
# - https://www.pwabuilder.com/imageGenerator
```

#### 步骤 2: 组织图标文件
```
public/
├── icon-72x72.png
├── icon-96x96.png
├── icon-128x128.png
├── icon-144x144.png
├── icon-152x152.png
├── icon-192x192.png
├── icon-384x384.png
├── icon-512x512.png
└── favicon.ico
```

#### 步骤 3: 更新 vite.config.js
```javascript
manifest: {
  icons: [
    { src: '/icon-72x72.png', sizes: '72x72', type: 'image/png' },
    { src: '/icon-96x96.png', sizes: '96x96', type: 'image/png' },
    { src: '/icon-128x128.png', sizes: '128x128', type: 'image/png' },
    { src: '/icon-144x144.png', sizes: '144x144', type: 'image/png' },
    { src: '/icon-152x152.png', sizes: '152x152', type: 'image/png' },
    { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
    { src: '/icon-384x384.png', sizes: '384x384', type: 'image/png' },
    { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
  ]
}
```

### 验证计划
- [ ] 检查开发者工具中的 Manifest 配置
- [ ] 测试 PWA 安装功能
- [ ] 验证图标在不同设备上的显示效果

### 预计工时
**30 分钟**

---

## 功能 2: ESLint + Prettier 配置 🔴

### 需求分析
配置代码规范工具，确保代码质量和一致性，提高团队协作效率。

### 技术方案
- ESLint: 代码质量检查
- Prettier: 代码格式化
- 集成到 VS Code 和 Git hooks

### 实施步骤

#### 步骤 1: 安装依赖
```bash
npm install -D eslint prettier eslint-plugin-vue eslint-config-prettier @vue/eslint-config-prettier
```

#### 步骤 2: 创建 .eslintrc.cjs
```javascript
module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2022: true
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/eslint-config-prettier'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'vue/multi-word-component-names': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}
```

#### 步骤 3: 创建 .prettierrc
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "none",
  "printWidth": 100,
  "arrowParens": "always"
}
```

#### 步骤 4: 添加 npm scripts
```json
{
  "scripts": {
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs --fix --ignore-path .gitignore",
    "format": "prettier --write src/"
  }
}
```

#### 步骤 5: 配置 VS Code
创建 `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### 验证计划
- [ ] 运行 `npm run lint` 检查代码
- [ ] 运行 `npm run format` 格式化代码
- [ ] 测试保存时自动格式化

### 预计工时
**45 分钟**

---

## 功能 3: 分类管理功能 🔴

### 需求分析
允许用户自定义添加、编辑、删除任务分类，提供更灵活的任务组织方式。

### 技术方案
- 创建 `CategoryManager.vue` 组件
- 扩展 category store 的 CRUD 操作
- 添加分类编辑对话框

### 实施步骤

#### 步骤 1: 创建 CategoryModal 组件
```vue
<!-- src/components/CategoryModal.vue -->
<script setup>
import { ref } from 'vue'
import { useCategoryStore } from '../stores/category'

const props = defineProps({
  category: Object,
  isOpen: Boolean
})

const emit = defineEmits(['close', 'save'])

const categoryStore = useCategoryStore()
const form = ref({
  name: props.category?.name || '',
  icon: props.category?.icon || '📋',
  color: props.category?.color || '#3b82f6'
})

async function handleSave() {
  if (props.category) {
    await categoryStore.updateCategory(props.category.id, form.value)
  } else {
    await categoryStore.addCategory(form.value)
  }
  emit('save')
  emit('close')
}
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <h3>{{ category ? '编辑分类' : '添加分类' }}</h3>
      
      <div class="form-group">
        <label>分类名称</label>
        <input v-model="form.name" type="text" placeholder="输入分类名称" />
      </div>

      <div class="form-group">
        <label>图标</label>
        <input v-model="form.icon" type="text" placeholder="选择图标 emoji" />
      </div>

      <div class="form-group">
        <label>颜色</label>
        <input v-model="form.color" type="color" />
      </div>

      <div class="modal-actions">
        <button @click="$emit('close')" class="btn btn-secondary">取消</button>
        <button @click="handleSave" class="btn btn-primary">保存</button>
      </div>
    </div>
  </div>
</template>
```

#### 步骤 2: 更新 Sidebar 组件
在 Sidebar.vue 中添加分类管理按钮和模态框：
```vue
<script setup>
import { ref } from 'vue'
import CategoryModal from './CategoryModal.vue'

const showCategoryModal = ref(false)
const editingCategory = ref(null)

function addCategory() {
  editingCategory.value = null
  showCategoryModal.value = true
}

function editCategory(category) {
  editingCategory.value = category
  showCategoryModal.value = true
}
</script>

<template>
  <!-- 在分类列表中添加编辑和删除按钮 -->
  <CategoryModal
    :is-open="showCategoryModal"
    :category="editingCategory"
    @close="showCategoryModal = false"
    @save="categoryStore.loadCategories()"
  />
</template>
```

#### 步骤 3: 添加删除确认
```javascript
async function deleteCategory(category) {
  if (confirm(`确定要删除分类"${category.name}"吗？`)) {
    try {
      await categoryStore.deleteCategory(category.id)
    } catch (error) {
      alert(error.message)
    }
  }
}
```

### 验证计划
- [ ] 测试添加新分类
- [ ] 测试编辑分类
- [ ] 测试删除分类（有任务时应提示错误）
- [ ] 验证分类数据持久化

### 预计工时
**2 小时**

---

## 功能 4: 任务标签功能完善 🟡

### 需求分析
完善任务标签功能，支持创建、编辑、删除标签，以及按标签筛选任务。

### 技术方案
- 创建标签管理组件
- 在 TaskInput 中添加标签选择器
- 在 TaskItem 中显示标签
- 添加按标签筛选功能

### 实施步骤

#### 步骤 1: 扩展数据模型
在 `db/index.js` 中添加 tags store:
```javascript
db.version(2).stores({
  tasks: 'id, category, completed, dueDate, priority, createdAt',
  categories: 'id, order',
  settings: 'key',
  tags: 'id, name' // 新增
})
```

#### 步骤 2: 创建 TagInput 组件
```vue
<!-- src/components/TagInput.vue -->
<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: Array
})

const emit = defineEmits(['update:modelValue'])

const inputValue = ref('')
const tags = computed({
  get: () => props.modelValue || [],
  set: (val) => emit('update:modelValue', val)
})

function addTag() {
  if (inputValue.value.trim() && !tags.value.includes(inputValue.value.trim())) {
    tags.value = [...tags.value, inputValue.value.trim()]
    inputValue.value = ''
  }
}

function removeTag(tag) {
  tags.value = tags.value.filter(t => t !== tag)
}
</script>

<template>
  <div class="tag-input">
    <div class="tags-list">
      <span v-for="tag in tags" :key="tag" class="tag">
        {{ tag }}
        <button @click="removeTag(tag)" class="tag-remove">×</button>
      </span>
    </div>
    <input
      v-model="inputValue"
      type="text"
      placeholder="添加标签..."
      @keydown.enter.prevent="addTag"
    />
  </div>
</template>
```

#### 步骤 3: 集成到 TaskInput
在 TaskInput.vue 的高级选项中添加标签输入。

#### 步骤 4: 添加标签筛选
在 Sidebar 中添加"按标签筛选"视图。

### 验证计划
- [ ] 测试添加标签
- [ ] 测试删除标签
- [ ] 测试标签筛选
- [ ] 验证标签数据持久化

### 预计工时
**3 小时**

---

## 功能 5: 数据导出/导入 🟡

### 需求分析
允许用户导出所有任务数据为 JSON 文件，以及从 JSON 文件导入数据，方便备份和迁移。

### 技术方案
- 导出：将 IndexedDB 数据序列化为 JSON
- 导入：解析 JSON 并写入 IndexedDB
- 添加导出/导入按钮到设置菜单

### 实施步骤

#### 步骤 1: 创建导出功能
```javascript
// src/utils/export.js
import db from '../db'

export async function exportData() {
  const tasks = await db.tasks.toArray()
  const categories = await db.categories.toArray()
  const settings = await db.settings.toArray()

  const data = {
    version: 1,
    exportDate: new Date().toISOString(),
    tasks,
    categories,
    settings
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json'
  })
  
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `todo-backup-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}
```

#### 步骤 2: 创建导入功能
```javascript
export async function importData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target.result)
        
        // 验证数据格式
        if (!data.version || !data.tasks || !data.categories) {
          throw new Error('Invalid backup file format')
        }

        // 清空现有数据
        await db.tasks.clear()
        await db.categories.clear()
        
        // 导入新数据
        await db.tasks.bulkAdd(data.tasks)
        await db.categories.bulkAdd(data.categories)
        
        if (data.settings) {
          await db.settings.bulkPut(data.settings)
        }

        resolve()
      } catch (error) {
        reject(error)
      }
    }
    
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}
```

#### 步骤 3: 创建设置菜单组件
```vue
<!-- src/components/SettingsMenu.vue -->
<script setup>
import { ref } from 'vue'
import { exportData, importData } from '../utils/export'

const fileInput = ref(null)

async function handleExport() {
  try {
    await exportData()
    alert('数据导出成功！')
  } catch (error) {
    alert('导出失败：' + error.message)
  }
}

async function handleImport() {
  fileInput.value.click()
}

async function onFileSelected(event) {
  const file = event.target.files[0]
  if (!file) return

  if (confirm('导入数据将覆盖现有数据，确定继续吗？')) {
    try {
      await importData(file)
      alert('数据导入成功！')
      location.reload()
    } catch (error) {
      alert('导入失败：' + error.message)
    }
  }
}
</script>

<template>
  <div class="settings-menu">
    <button @click="handleExport" class="btn btn-secondary">
      📥 导出数据
    </button>
    <button @click="handleImport" class="btn btn-secondary">
      📤 导入数据
    </button>
    <input
      ref="fileInput"
      type="file"
      accept=".json"
      style="display: none"
      @change="onFileSelected"
    />
  </div>
</template>
```

#### 步骤 4: 集成到 Header
在 Header 组件中添加设置按钮和菜单。

### 验证计划
- [ ] 测试导出功能
- [ ] 测试导入功能
- [ ] 验证数据完整性
- [ ] 测试错误处理

### 预计工时
**2 小时**

---

## 功能 6: 任务拖拽排序 🟢

### 需求分析
允许用户通过拖拽调整任务顺序，提供更直观的任务管理体验。

### 技术方案
- 使用 VueDraggable 库
- 更新任务的 order 字段
- 保存排序到 IndexedDB

### 实施步骤

#### 步骤 1: 安装依赖
```bash
npm install vuedraggable@next
```

#### 步骤 2: 更新 TaskList 组件
```vue
<script setup>
import draggable from 'vuedraggable'
import { computed } from 'vue'
import { useTaskStore } from '../stores/task'

const taskStore = useTaskStore()

const draggableTasks = computed({
  get: () => filteredTasks.value,
  set: async (newOrder) => {
    // 更新任务顺序
    for (let i = 0; i < newOrder.length; i++) {
      await taskStore.updateTask(newOrder[i].id, { order: i })
    }
  }
})
</script>

<template>
  <draggable
    v-model="draggableTasks"
    item-key="id"
    class="task-list"
    :animation="200"
    handle=".drag-handle"
  >
    <template #item="{ element }">
      <TaskItem :task="element" />
    </template>
  </draggable>
</template>
```

#### 步骤 3: 添加拖拽手柄
在 TaskItem 组件中添加拖拽图标。

### 验证计划
- [ ] 测试拖拽功能
- [ ] 验证排序持久化
- [ ] 测试不同视图下的拖拽

### 预计工时
**1.5 小时**

---

## 功能 7: 子任务功能 🟢

### 需求分析
支持为任务添加子任务，形成任务层级结构，更好地分解复杂任务。

### 技术方案
- 扩展 Task 数据模型，添加 parentId 字段
- 创建 SubTaskList 组件
- 支持子任务的 CRUD 操作

### 实施步骤

#### 步骤 1: 更新数据模型
```javascript
// db/index.js
export class Task {
  constructor(data = {}) {
    // ... 现有字段
    this.parentId = data.parentId || null // 新增
    this.subtasks = data.subtasks || [] // 新增
  }
}
```

#### 步骤 2: 创建 SubTaskInput 组件
```vue
<!-- src/components/SubTaskInput.vue -->
<script setup>
import { ref } from 'vue'
import { useTaskStore } from '../stores/task'

const props = defineProps({
  parentId: String
})

const taskStore = useTaskStore()
const subtaskTitle = ref('')

async function addSubtask() {
  if (!subtaskTitle.value.trim()) return

  await taskStore.addTask({
    title: subtaskTitle.value.trim(),
    parentId: props.parentId,
    category: 'personal',
    priority: 'medium'
  })

  subtaskTitle.value = ''
}
</script>

<template>
  <div class="subtask-input">
    <input
      v-model="subtaskTitle"
      type="text"
      placeholder="添加子任务..."
      @keydown.enter="addSubtask"
    />
  </div>
</template>
```

#### 步骤 3: 更新 TaskItem 显示子任务
在 TaskItem 中添加展开/折叠功能，显示子任务列表。

#### 步骤 4: 添加子任务统计
计算并显示子任务完成进度。

### 验证计划
- [ ] 测试添加子任务
- [ ] 测试子任务完成状态
- [ ] 验证父任务删除时子任务处理
- [ ] 测试子任务统计

### 预计工时
**4 小时**

---

## 实施建议

### 阶段 1: 基础优化（1-2 天）
1. PWA 图标优化
2. ESLint + Prettier 配置
3. 分类管理功能

### 阶段 2: 功能增强（2-3 天）
4. 任务标签功能完善
5. 数据导出/导入

### 阶段 3: 高级功能（3-4 天）
6. 任务拖拽排序
7. 子任务功能

### 总预计工时
**约 13.5 小时**（分 3 个阶段实施）

---

## 注意事项

1. **数据库版本管理**: 添加新功能时注意更新 IndexedDB 版本号
2. **向后兼容**: 确保新功能不影响现有数据
3. **错误处理**: 每个功能都要有完善的错误处理
4. **用户体验**: 添加加载状态和操作反馈
5. **测试**: 每个功能完成后进行充分测试

---

## 下一步行动

建议按照以下顺序开始实施：

1. ✅ 先完成 PWA 图标优化（快速见效）
2. ✅ 配置 ESLint + Prettier（提升代码质量）
3. ✅ 实现分类管理功能（用户需求高）
4. 根据实际需求选择其他功能

每完成一个功能后，建议进行代码审查和用户测试，确保质量后再继续下一个功能。
