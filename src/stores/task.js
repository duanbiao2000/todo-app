// Task Store - Pinia
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as taskDb from '../db/tasks'

export const useTaskStore = defineStore('task', () => {
    // State
    const tasks = ref([])
    const loading = ref(false)
    const error = ref(null)

    // Getters
    const completedTasks = computed(() =>
        tasks.value.filter(task => task.completed)
    )

    const activeTasks = computed(() =>
        tasks.value.filter(task => !task.completed)
    )

    const tasksByCategory = computed(() => (categoryId) =>
        tasks.value.filter(task => task.category === categoryId)
    )

    const tasksByPriority = computed(() => (priority) =>
        tasks.value.filter(task => task.priority === priority)
    )

    const todayTasks = computed(() => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        return tasks.value.filter(task => {
            if (!task.dueDate) return false
            const dueDate = new Date(task.dueDate)
            return dueDate >= today && dueDate < tomorrow
        })
    })

    const overdueTasks = computed(() => {
        const now = new Date()
        return tasks.value.filter(task =>
            task.dueDate &&
            new Date(task.dueDate) < now &&
            !task.completed
        )
    })

    const taskStats = computed(() => ({
        total: tasks.value.length,
        completed: completedTasks.value.length,
        active: activeTasks.value.length,
        overdue: overdueTasks.value.length,
        completionRate: tasks.value.length > 0
            ? Math.round((completedTasks.value.length / tasks.value.length) * 100)
            : 0
    }))

    // Actions
    async function loadTasks() {
        loading.value = true
        error.value = null
        try {
            tasks.value = await taskDb.getAllTasks()
        } catch (err) {
            error.value = err.message
            console.error('Failed to load tasks:', err)
        } finally {
            loading.value = false
        }
    }

    async function addTask(taskData) {
        loading.value = true
        error.value = null
        try {
            const newTask = await taskDb.addTask(taskData)
            tasks.value.push(newTask)
            return newTask
        } catch (err) {
            error.value = err.message
            console.error('Failed to add task:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    async function updateTask(id, updates) {
        loading.value = true
        error.value = null
        try {
            const updatedTask = await taskDb.updateTask(id, updates)
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

    async function deleteTask(id) {
        loading.value = true
        error.value = null
        try {
            await taskDb.deleteTask(id)
            tasks.value = tasks.value.filter(t => t.id !== id)
        } catch (err) {
            error.value = err.message
            console.error('Failed to delete task:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    async function toggleTask(id) {
        try {
            const completed = await taskDb.toggleTaskCompletion(id)
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

    async function searchTasks(query) {
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
