/**
 * 🎓 IndexedDB 数据库设置 (使用 Dexie.js)
 * ============================================
 * 
 * 📚 为什么使用 IndexedDB?
 * - 离线存储: PWA 核心功能，无网络也能使用
 * - 大容量: 比 localStorage (5MB) 大得多
 * - 结构化: 支持索引和查询
 * 
 * 📚 为什么使用 Dexie.js?
 * - 原生 IndexedDB API 非常繁琐
 * - Dexie 提供 Promise 风格 API
 * - 简化 Schema 版本管理
 * 
 * 💡 最佳实践:
 * - 数据库名称和版本定义在常量文件中
 * - 使用类来定义数据模型，确保一致性
 * - 初始化函数处理默认数据
 */
import Dexie from 'dexie'
import { logger } from '../utils/logger'
import { DB_NAME, DB_VERSION } from '../constants'

// ═══════════════════════════════════════════════════════════
// 🗄️ 数据库实例创建
// 🎓 Dexie 是对 IndexedDB 的封装，提供更友好的 API
// ═══════════════════════════════════════════════════════════
export const db = new Dexie(DB_NAME)

/**
 * 🎓 定义数据库 Schema
 * 
 * 版本控制说明:
 * - 每次修改表结构都需要增加版本号
 * - Dexie 会自动处理数据迁移
 * 
 * 索引语法:
 * - 'id': 主键
 * - 'category, completed': 普通索引 (可加速 where 查询)
 * - '++id': 自增主键 (这里我们用 UUID 所以没使用)
 * - '*tags': 多值索引 (用于数组字段)
 */
db.version(DB_VERSION).stores({
    // 🎓 tasks 表: id 是主键，其他字段用于索引加速查询
    tasks: 'id, category, completed, dueDate, priority, createdAt',
    // 🎓 categories 表: id 主键，order 用于自定义排序
    categories: 'id, order',
    // 🎓 settings 表: key-value 存储，key 是主键
    settings: 'key'
})

// ═══════════════════════════════════════════════════════════
// 📋 数据模型类
// 🎓 使用类定义确保创建任务/分类时字段完整且有默认值
// 这比直接使用对象字面量更安全，也方便 IDE 提示
// ═══════════════════════════════════════════════════════════

/**
 * 🎓 Task 模型类
 * 
 * 设计说明:
 * - id: 使用 crypto.randomUUID() 生成唯一标识
 * - priority: 枚举值，限制为 low/medium/high
 * - timestamps: createdAt/updatedAt 用于排序和同步
 */
export class Task {
    constructor(data = {}) {
        this.id = data.id || crypto.randomUUID()
        this.title = data.title || ''
        this.description = data.description || ''
        this.completed = data.completed || false
        this.priority = data.priority || 'medium' // 🎓 合理的默认值
        this.category = data.category || 'personal'
        this.tags = data.tags || []
        this.dueDate = data.dueDate || null
        this.createdAt = data.createdAt || Date.now()
        this.updatedAt = data.updatedAt || Date.now()
        this.order = data.order || 0
    }
}

/**
 * 🎓 Category 模型类 - 分类/标签管理
 */
export class Category {
    constructor(data = {}) {
        this.id = data.id || crypto.randomUUID()
        this.name = data.name || ''
        this.icon = data.icon || '📋'           // 默认图标
        this.color = data.color || '#3b82f6'    // 默认蓝色
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
