// Category Database Operations
import db, { Category } from './index'
import { logger } from '../utils/logger'
import { ERROR_MESSAGES } from '../constants'

// Get all categories
export async function getAllCategories() {
    try {
        return await db.categories.orderBy('order').toArray()
    } catch (error) {
        logger.error('Failed to get categories:', error)
        throw new Error(ERROR_MESSAGES.DATABASE_ERROR)
    }
}

// Get category by ID
export async function getCategoryById(id) {
    try {
        return await db.categories.get(id)
    } catch (error) {
        logger.error('Failed to get category:', error)
        return null
    }
}

// Add a new category
export async function addCategory(categoryData) {
    try {
        const category = new Category(categoryData)
        await db.categories.add(category)
        return category
    } catch (error) {
        logger.error('Failed to add category:', error)
        throw error
    }
}

// Update a category
export async function updateCategory(id, updates) {
    try {
        await db.categories.update(id, updates)
        return await db.categories.get(id)
    } catch (error) {
        logger.error('Failed to update category:', error)
        throw error
    }
}

// Delete a category
export async function deleteCategory(id) {
    try {
        // Check if there are tasks using this category
        const tasksCount = await db.tasks.where('category').equals(id).count()

        if (tasksCount > 0) {
            throw new Error('Cannot delete category with existing tasks')
        }

        await db.categories.delete(id)
        return true
    } catch (error) {
        logger.error('Failed to delete category:', error)
        throw error
    }
}

// Reorder categories
export async function reorderCategories(categoryIds) {
    try {
        const updates = categoryIds.map((id, index) => ({
            key: id,
            changes: { order: index }
        }))

        await db.categories.bulkUpdate(updates)
        return true
    } catch (error) {
        logger.error('Failed to reorder categories:', error)
        throw error
    }
}
