/**
 * 🎓 分类状态管理 Store (Category Store)
 * ============================================
 * 
 * 📚 核心概念:
 * 这个 store 管理任务分类，与 task store 结构类似，
 * 展示了 Pinia store 的复用模式。
 * 
 * 💡 设计思路:
 * - 分类和任务是多对多关系（简化为多对一）
 * - 分类有固定顺序 (order 字段)
 * - 支持拖拽排序
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as categoryDb from '../db/categories'

export const useCategoryStore = defineStore('category', () => {
    // ═══════════════════════════════════════════════════════════
    // 📦 STATE - 响应式状态
    // 🎓 与 task store 结构相同，保持一致性
    // ═══════════════════════════════════════════════════════════

    const categories = ref([])   // 分类列表
    const loading = ref(false)   // 加载状态
    const error = ref(null)      // 错误信息

    // ═══════════════════════════════════════════════════════════
    // 🔍 GETTERS - 派生状态
    // ═══════════════════════════════════════════════════════════

    /**
     * 🎓 通过 ID 查找分类
     * 返回函数式 getter，支持参数化查询
     */
    const getCategoryById = computed(() => (id) =>
        categories.value.find(cat => cat.id === id)
    )

    /**
     * 🎓 简单 getter: 获取分类数量
     */
    const categoryCount = computed(() => categories.value.length)

    // ═══════════════════════════════════════════════════════════
    // ⚡ ACTIONS - 异步操作方法
    // 🎓 与 task store 采用相同的 loading/error 模式
    // ═══════════════════════════════════════════════════════════

    /**
     * 🎓 加载分类列表
     * 标准异步 Action 模式
     */
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
