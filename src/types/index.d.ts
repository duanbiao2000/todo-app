/**
 * 🎓 TypeScript 类型定义文件
 * ============================================
 * 
 * 📚 目的:
 * - 为 JavaScript 项目添加类型定义
 * - 为未来的 TypeScript 迁移做准备
 * - 提供 IDE 智能提示和类型检查
 * 
 * 💡 使用方式:
 * 在 JS 文件顶部添加 JSDoc 注释引用这些类型:
 * @typedef {import('./types/index').Task} Task
 */

/**
 * 🎓 任务优先级类型
 * 使用联合类型限制可能的值
 */
export type Priority = 'low' | 'medium' | 'high'

/**
 * 🎓 任务对象类型定义
 * 
 * 注意:
 * - ? 表示可选字段
 * - | null 表示可以是 null
 */
export interface Task {
    id: string
    title: string
    description?: string
    completed: boolean
    priority: Priority
    category: string
    tags: string[]
    dueDate: string | null
    createdAt: number
    updatedAt: number
    order: number
}

/**
 * 🎓 分类对象类型定义
 */
export interface Category {
    id: string
    name: string
    icon: string
    color: string
    order: number
}

/**
 * 🎓 视图类型
 * 枚举应用中所有可能的视图
 */
export type ViewType = 'all' | 'today' | 'completed' | 'category'

/**
 * 🎓 主题类型
 */
export type Theme = 'light' | 'dark'

/**
 * 🎓 任务统计信息
 */
export interface TaskStats {
    total: number
    completed: number
    active: number
    overdue: number
    completionRate: number
}

/**
 * 🎓 应用状态类型
 * 描述 appStore 的状态结构
 */
export interface AppState {
    theme: Theme
    currentView: ViewType
    currentCategory: string | null
    searchQuery: string
    isOnline: boolean
    sidebarOpen: boolean
    showInstallPrompt: boolean
}

/**
 * 🎓 任务创建数据类型
 * Partial 表示所有字段都是可选的 (用于更新时)
 */
export type TaskCreateData = Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'order'>
export type TaskUpdateData = Partial<Omit<Task, 'id' | 'createdAt'>>

/**
 * 🎓 分类创建数据类型
 */
export type CategoryCreateData = Omit<Category, 'id'>
export type CategoryUpdateData = Partial<Omit<Category, 'id'>>
