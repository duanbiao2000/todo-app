// IndexedDB Database Setup using Dexie.js
import Dexie from 'dexie'
import { logger } from '../utils/logger'
import { DB_NAME, DB_VERSION } from '../constants'

// Create database instance
export const db = new Dexie(DB_NAME)

// Define database schema
db.version(DB_VERSION).stores({
    tasks: 'id, category, completed, dueDate, priority, createdAt',
    categories: 'id, order',
    settings: 'key'
})

// Task model class
export class Task {
    constructor(data = {}) {
        this.id = data.id || crypto.randomUUID()
        this.title = data.title || ''
        this.description = data.description || ''
        this.completed = data.completed || false
        this.priority = data.priority || 'medium' // low | medium | high
        this.category = data.category || 'personal'
        this.tags = data.tags || []
        this.dueDate = data.dueDate || null
        this.createdAt = data.createdAt || Date.now()
        this.updatedAt = data.updatedAt || Date.now()
        this.order = data.order || 0
    }
}

// Category model class
export class Category {
    constructor(data = {}) {
        this.id = data.id || crypto.randomUUID()
        this.name = data.name || ''
        this.icon = data.icon || '📋'
        this.color = data.color || '#3b82f6'
        this.order = data.order || 0
    }
}

// Initialize default data
export async function initializeDefaultData() {
    try {
        // Check if categories exist
        const categoriesCount = await db.categories.count()

        if (categoriesCount === 0) {
            // Add default categories
            const defaultCategories = [
                new Category({ id: 'personal', name: '个人', icon: '👤', color: '#3b82f6', order: 0 }),
                new Category({ id: 'work', name: '工作', icon: '💼', color: '#8b5cf6', order: 1 }),
                new Category({ id: 'study', name: '学习', icon: '📚', color: '#10b981', order: 2 }),
                new Category({ id: 'health', name: '健康', icon: '💪', color: '#f59e0b', order: 3 })
            ]

            await db.categories.bulkAdd(defaultCategories)
            logger.info('Default categories initialized')
        }

        // Initialize default settings
        const themeExists = await db.settings.get('theme')
        if (!themeExists) {
            await db.settings.add({ key: 'theme', value: 'light' })
        }

        logger.success('Database initialized successfully')
    } catch (error) {
        logger.error('Failed to initialize database:', error)
        throw error
    }
}

// Export database instance
export default db
