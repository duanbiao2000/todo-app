// Task Database Operations
import db, { Task } from './index'
import { logger } from '../utils/logger'
import { ERROR_MESSAGES } from '../constants'

// Get all tasks
export async function getAllTasks() {
    try {
        return await db.tasks.toArray()
    } catch (error) {
        logger.error('Failed to get tasks:', error)
        throw new Error(ERROR_MESSAGES.DATABASE_ERROR)
    }
}

// Get tasks by category
export async function getTasksByCategory(categoryId) {
    try {
        return await db.tasks.where('category').equals(categoryId).toArray()
    } catch (error) {
        logger.error('Failed to get tasks by category:', error)
        throw new Error(ERROR_MESSAGES.DATABASE_ERROR)
    }
}

// Get tasks by completion status
export async function getTasksByStatus(completed) {
    try {
        return await db.tasks.where('completed').equals(completed).toArray()
    } catch (error) {
        logger.error('Failed to get tasks by status:', error)
        throw new Error(ERROR_MESSAGES.DATABASE_ERROR)
    }
}

// Get today's tasks
export async function getTodayTasks() {
    try {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        return await db.tasks
            .where('dueDate')
            .between(today.toISOString(), tomorrow.toISOString(), true, false)
            .toArray()
    } catch (error) {
        logger.error('Failed to get today tasks:', error)
        throw new Error(ERROR_MESSAGES.DATABASE_ERROR)
    }
}

// Add a new task
export async function addTask(taskData) {
    try {
        const task = new Task(taskData)
        await db.tasks.add(task)
        return task
    } catch (error) {
        logger.error('Failed to add task:', error)
        throw error
    }
}

// Update a task
export async function updateTask(id, updates) {
    try {
        updates.updatedAt = Date.now()
        await db.tasks.update(id, updates)
        return await db.tasks.get(id)
    } catch (error) {
        logger.error('Failed to update task:', error)
        throw error
    }
}

// Delete a task
export async function deleteTask(id) {
    try {
        await db.tasks.delete(id)
        return true
    } catch (error) {
        logger.error('Failed to delete task:', error)
        throw error
    }
}

// Toggle task completion
export async function toggleTaskCompletion(id) {
    try {
        const task = await db.tasks.get(id)
        if (task) {
            await updateTask(id, { completed: !task.completed })
            return !task.completed
        }
        return false
    } catch (error) {
        logger.error('Failed to toggle task completion:', error)
        throw error
    }
}

// Search tasks
export async function searchTasks(query) {
    try {
        const allTasks = await db.tasks.toArray()
        const lowerQuery = query.toLowerCase()

        return allTasks.filter(task =>
            task.title.toLowerCase().includes(lowerQuery) ||
            (task.description && task.description.toLowerCase().includes(lowerQuery)) ||
            task.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        )
    } catch (error) {
        logger.error('Failed to search tasks:', error)
        throw new Error(ERROR_MESSAGES.DATABASE_ERROR)
    }
}

// Get overdue tasks
export async function getOverdueTasks() {
    try {
        const now = new Date().toISOString()
        return await db.tasks
            .where('dueDate')
            .below(now)
            .and(task => !task.completed)
            .toArray()
    } catch (error) {
        logger.error('Failed to get overdue tasks:', error)
        throw new Error(ERROR_MESSAGES.DATABASE_ERROR)
    }
}
