// Category Store - Pinia
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as categoryDb from '../db/categories'

export const useCategoryStore = defineStore('category', () => {
    // State
    const categories = ref([])
    const loading = ref(false)
    const error = ref(null)

    // Getters
    const getCategoryById = computed(() => (id) =>
        categories.value.find(cat => cat.id === id)
    )

    const categoryCount = computed(() => categories.value.length)

    // Actions
    async function loadCategories() {
        loading.value = true
        error.value = null
        try {
            categories.value = await categoryDb.getAllCategories()
        } catch (err) {
            error.value = err.message
            console.error('Failed to load categories:', err)
        } finally {
            loading.value = false
        }
    }

    async function addCategory(categoryData) {
        loading.value = true
        error.value = null
        try {
            const newCategory = await categoryDb.addCategory(categoryData)
            categories.value.push(newCategory)
            return newCategory
        } catch (err) {
            error.value = err.message
            console.error('Failed to add category:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    async function updateCategory(id, updates) {
        loading.value = true
        error.value = null
        try {
            const updatedCategory = await categoryDb.updateCategory(id, updates)
            const index = categories.value.findIndex(c => c.id === id)
            if (index !== -1) {
                categories.value[index] = updatedCategory
            }
            return updatedCategory
        } catch (err) {
            error.value = err.message
            console.error('Failed to update category:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    async function deleteCategory(id) {
        loading.value = true
        error.value = null
        try {
            await categoryDb.deleteCategory(id)
            categories.value = categories.value.filter(c => c.id !== id)
        } catch (err) {
            error.value = err.message
            console.error('Failed to delete category:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    async function reorderCategories(categoryIds) {
        try {
            await categoryDb.reorderCategories(categoryIds)
            // Update local state
            const reordered = categoryIds.map(id =>
                categories.value.find(c => c.id === id)
            ).filter(Boolean)
            categories.value = reordered
        } catch (err) {
            error.value = err.message
            console.error('Failed to reorder categories:', err)
            throw err
        }
    }

    return {
        // State
        categories,
        loading,
        error,
        // Getters
        getCategoryById,
        categoryCount,
        // Actions
        loadCategories,
        addCategory,
        updateCategory,
        deleteCategory,
        reorderCategories
    }
})
