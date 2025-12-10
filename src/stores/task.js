/**
 * 🎓 任务状态管理 Store (Task Store)
 * ============================================
 * 
 * 📚 核心概念:
 * - Pinia 是 Vue 3 官方推荐的状态管理库，替代 Vuex
 * - Store 是一个保存全局状态的容器，可以在任何组件中访问
 * 
 * 🏗️ Store 三要素:
 * 1. State (状态): 存储原始数据，如任务列表
 * 2. Getters (派生状态): 基于 state 计算的值，类似 Vue computed
 * 3. Actions (操作): 修改 state 的方法，可以是同步或异步
 * 
 * 💡 为什么使用 Composition API 风格?
 * - 更好的 TypeScript 支持
 * - 更灵活的代码组织
 * - 与 Vue 3 <script setup> 风格一致
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as taskDb from '../db/tasks'

/**
 * 🎓 defineStore 参数说明:
 * - 第一个参数 'task': Store 的唯一标识符，用于 DevTools 调试
 * - 第二个参数: Setup 函数，返回需要暴露的 state、getters 和 actions
 */
export const useTaskStore = defineStore('task', () => {
    // ═══════════════════════════════════════════════════════════
    // 📦 STATE - 响应式状态定义
    // 🎓 使用 ref() 包装基础值，使其成为响应式数据
    // 当这些值变化时，所有使用它们的组件会自动更新
    // ═══════════════════════════════════════════════════════════

    const tasks = ref([])       // 任务列表 - 核心数据源
    const loading = ref(false)  // 加载状态 - 用于显示 loading UI
    const error = ref(null)     // 错误信息 - 用于错误提示

    // ═══════════════════════════════════════════════════════════
    // 🔍 GETTERS - 派生状态 (使用 computed)
    // 🎓 computed 会缓存计算结果，只有依赖变化时才重新计算
    // 这比在组件中重复过滤数组性能更好
    // ═══════════════════════════════════════════════════════════

    /**
     * 🎓 简单 Getter: 直接过滤返回子集
     * 当 tasks.value 变化时，自动重新计算
     */
    const completedTasks = computed(() =>
        tasks.value.filter(task => task.completed)
    )

    const activeTasks = computed(() =>
        tasks.value.filter(task => !task.completed)
    )

    /**
     * 🎓 参数化 Getter: 返回一个函数，允许传入参数
     * 使用方式: taskStore.tasksByCategory('work')
     * 注意: 这种写法每次调用都会重新执行，不会缓存结果
     */
    const tasksByCategory = computed(() => (categoryId) =>
        tasks.value.filter(task => task.category === categoryId)
    )

    const tasksByPriority = computed(() => (priority) =>
        tasks.value.filter(task => task.priority === priority)
    )

    /**
     * 🎓 复杂 Getter: 涉及日期计算
     * 💡 技巧: 先计算边界值，减少循环内计算
     */
    const todayTasks = computed(() => {
        // 获取今日 00:00:00
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        // 获取明日 00:00:00
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        return tasks.value.filter(task => {
            if (!task.dueDate) return false  // 没有截止日期的跳过
            const dueDate = new Date(task.dueDate)
            return dueDate >= today && dueDate < tomorrow
        })
    })

    const overdueTasks = computed(() => {
        const now = new Date()
        return tasks.value.filter(task =>
            task.dueDate &&
            new Date(task.dueDate) < now &&
            !task.completed  // 只统计未完成的过期任务
        )
    })

    /**
     * 🎓 聚合 Getter: 组合多个 getter 生成统计数据
     * 💡 技巧: 复用其他 computed 值避免重复计算
     */
    const taskStats = computed(() => ({
        total: tasks.value.length,
        completed: completedTasks.value.length,
        active: activeTasks.value.length,
        overdue: overdueTasks.value.length,
        // 🎓 三元运算符防止除零错误
        completionRate: tasks.value.length > 0
            ? Math.round((completedTasks.value.length / tasks.value.length) * 100)
            : 0
    }))

    // ═══════════════════════════════════════════════════════════
    // ⚡ ACTIONS - 异步操作方法
    // 🎓 Actions 用于执行异步操作和修改 state
    // 最佳实践: loading/error/try-catch-finally 模式
    // ═══════════════════════════════════════════════════════════

    /**
     * 🎓 加载任务列表
     * 标准异步 Action 模式 - 三个阶段:
     * 1. 开始: 设置 loading=true, 清除旧错误
     * 2. 执行: 调用数据库API获取数据
     * 3. 结束: finally 中确保 loading=false (无论成功失败)
     */
    async function loadTasks() {
        loading.value = true
        error.value = null
        try {
            tasks.value = await taskDb.getAllTasks()
        } catch (err) {
            error.value = err.message
            console.error('Failed to load tasks:', err)
        } finally {
            // 🎓 finally 总会执行，确保状态正确恢复
            loading.value = false
        }
    }

    /**
     * 🎓 添加新任务 - 乐观更新模式
     * 成功后直接 push 到本地数组，无需重新加载全部数据
     * 注意: 这里重新 throw err 让调用方也能处理错误
     */
    async function addTask(taskData) {
        loading.value = true
        error.value = null
        try {
            const newTask = await taskDb.addTask(taskData)
            tasks.value.push(newTask)  // 🎓 本地状态立即更新
            return newTask
        } catch (err) {
            error.value = err.message
            console.error('Failed to add task:', err)
            throw err  // 🎓 重新抛出，让组件层也能处理
        } finally {
            loading.value = false
        }
    }

    /**
     * 🎓 更新任务 - 精确更新模式
     * 使用 findIndex + 索引更新，而非重新加载或 filter
     * 这样能保持数组引用稳定，性能更好
     */
    async function updateTask(id, updates) {
        loading.value = true
        error.value = null
        try {
            const updatedTask = await taskDb.updateTask(id, updates)
            // 🎓 找到索引后直接替换，保持响应式
            const index = tasks.value.findIndex(t => t.id === id)
            if (index !== -1) {
                tasks.value[index] = updatedTask
            }
            return updatedTask
        } catch (err) {
            error.value = err.message
            console.error('Failed to update task:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    /**
     * 🎓 删除任务 - 过滤移除模式
     * 使用 filter 创建新数组，不含被删除项
     * 这种写法更符合函数式编程风格
     */
    async function deleteTask(id) {
        loading.value = true
        error.value = null
        try {
            await taskDb.deleteTask(id)
            // 🎓 filter 返回新数组，自动触发响应式更新
            tasks.value = tasks.value.filter(t => t.id !== id)
        } catch (err) {
            error.value = err.message
            console.error('Failed to delete task:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    /**
     * 🎓 切换任务完成状态 - 轻量级操作
     * 不需要设置 loading（UI 响应要快）
     * 直接修改对象属性，Vue 会自动追踪响应
     */
    async function toggleTask(id) {
        try {
            const completed = await taskDb.toggleTaskCompletion(id)
            // 🎓 find 返回的是引用，直接修改会触发响应式
            const task = tasks.value.find(t => t.id === id)
            if (task) {
                task.completed = completed
                task.updatedAt = Date.now()
            }
        } catch (err) {
            error.value = err.message
            console.error('Failed to toggle task:', err)
            throw err
        }
    }

    /**
     * 🎓 搜索任务 - 带短路优化
     * 空查询直接返回本地数据，避免不必要的数据库调用
     */
    async function searchTasks(query) {
        // 🎓 短路返回: 空查询不需要调用数据库
        if (!query.trim()) {
            return tasks.value
        }
        try {
            return await taskDb.searchTasks(query)
        } catch (err) {
            error.value = err.message
            console.error('Failed to search tasks:', err)
            return []
        }
    }

    return {
        // State
        tasks,
        loading,
        error,
        // Getters
        completedTasks,
        activeTasks,
        tasksByCategory,
        tasksByPriority,
        todayTasks,
        overdueTasks,
        taskStats,
        // Actions
        loadTasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTask,
        searchTasks
    }
})
