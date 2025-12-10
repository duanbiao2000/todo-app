/**
 * 🎓 输入验证工具函数
 * ============================================
 * 
 * 📚 验证的重要性:
 * - 安全性: 防止恶意输入 (XSS, SQL注入等)
 * - 用户体验: 即时反馈输入错误
 * - 数据一致性: 确保存储的数据符合预期格式
 * 
 * 💡 验证函数设计模式:
 * - 返回错误信息字符串表示验证失败
 * - 返回 null 表示验证通过
 * - 这种模式方便链式调用和错误处理
 */

/**
 * 🎓 验证任务标题
 * 
 * 验证规则:
 * 1. 非空检查 (必填)
 * 2. 类型检查 (必须是字符串)
 * 3. 去空格后非空 (不能只有空格)
 * 4. 长度限制 (最大200字符)
 * 
 * @param {string} title - 任务标题
 * @returns {string|null} 错误信息，null 表示验证通过
 */
export function validateTaskTitle(title) {
    // 🎓 Guard Clause 模式: 先检查失败条件，快速返回
    // 这样代码更容易阅读，避免嵌套
    if (!title || typeof title !== 'string') {
        return '任务标题不能为空'
    }

    const trimmed = title.trim()

    if (trimmed.length === 0) {
        return '任务标题不能为空'
    }

    if (trimmed.length > 200) {
        return '任务标题不能超过200个字符'
    }

    // 🎓 所有检查通过，返回 null
    return null
}

/**
 * 验证任务描述
 * @param {string} description - 任务描述
 * @returns {string|null} 错误信息，null 表示验证通过
 */
export function validateTaskDescription(description) {
    if (!description) {
        return null // 描述可以为空
    }

    if (typeof description !== 'string') {
        return '任务描述格式不正确'
    }

    if (description.length > 1000) {
        return '任务描述不能超过1000个字符'
    }

    return null
}

/**
 * 验证分类名称
 * @param {string} name - 分类名称
 * @returns {string|null} 错误信息，null 表示验证通过
 */
export function validateCategoryName(name) {
    if (!name || typeof name !== 'string') {
        return '分类名称不能为空'
    }

    const trimmed = name.trim()

    if (trimmed.length === 0) {
        return '分类名称不能为空'
    }

    if (trimmed.length > 50) {
        return '分类名称不能超过50个字符'
    }

    return null
}

/**
 * 验证优先级
 * @param {string} priority - 优先级
 * @returns {boolean} 是否有效
 */
export function validatePriority(priority) {
    const validPriorities = ['low', 'medium', 'high']
    return validPriorities.includes(priority)
}

/**
 * 验证日期
 * @param {string|Date} date - 日期
 * @returns {string|null} 错误信息，null 表示验证通过
 */
export function validateDate(date) {
    if (!date) {
        return null // 日期可以为空
    }

    const dateObj = new Date(date)

    if (isNaN(dateObj.getTime())) {
        return '日期格式不正确'
    }

    return null
}

/**
 * 清理和验证导入的数据
 * @param {Object} data - 导入的数据
 * @returns {Object} 清理后的数据
 * @throws {Error} 数据格式错误时抛出异常
 */
export function validateImportData(data) {
    // 验证数据结构
    if (!data || typeof data !== 'object') {
        throw new Error('数据格式不正确')
    }

    if (!data.version || typeof data.version !== 'number') {
        throw new Error('数据版本信息缺失或格式不正确')
    }

    // 验证任务数据
    if (!Array.isArray(data.tasks)) {
        throw new Error('任务数据格式不正确')
    }

    // 验证分类数据
    if (!Array.isArray(data.categories)) {
        throw new Error('分类数据格式不正确')
    }

    // 清理和验证每个任务
    const cleanedTasks = data.tasks.map(task => {
        if (!task || typeof task !== 'object') {
            throw new Error('任务数据格式不正确')
        }

        if (!task.id || !task.title) {
            throw new Error('任务缺少必要字段')
        }

        // 清理潜在的危险字段
        const cleaned = { ...task }
        delete cleaned.__proto__
        delete cleaned.constructor
        delete cleaned.prototype

        return cleaned
    })

    // 清理和验证每个分类
    const cleanedCategories = data.categories.map(category => {
        if (!category || typeof category !== 'object') {
            throw new Error('分类数据格式不正确')
        }

        if (!category.id || !category.name) {
            throw new Error('分类缺少必要字段')
        }

        // 清理潜在的危险字段
        const cleaned = { ...category }
        delete cleaned.__proto__
        delete cleaned.constructor
        delete cleaned.prototype

        return cleaned
    })

    return {
        ...data,
        tasks: cleanedTasks,
        categories: cleanedCategories
    }
}
