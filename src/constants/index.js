// Application Constants

// Task Constants
export const TASK_TITLE_MAX_LENGTH = 200
export const TASK_DESCRIPTION_MAX_LENGTH = 1000

// Category Constants
export const CATEGORY_NAME_MAX_LENGTH = 50

// Priority Levels
export const PRIORITY_LEVELS = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high'
}

// Animation Durations (ms)
export const ANIMATION_DURATION = {
    FAST: 150,
    BASE: 200,
    SLOW: 300
}

// Debounce Delays (ms)
export const DEBOUNCE_DELAY = {
    SEARCH: 300,
    INPUT: 500
}

// View Types
export const VIEW_TYPES = {
    ALL: 'all',
    TODAY: 'today',
    COMPLETED: 'completed',
    CATEGORY: 'category'
}

// Storage Keys
export const STORAGE_KEYS = {
    THEME: 'theme',
    LAST_SYNC: 'lastSync'
}

// Database Version
export const DB_VERSION = 1
export const DB_NAME = 'TodoAppDB'

// Error Messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: '网络连接失败，请检查网络设置',
    DATABASE_ERROR: '数据库操作失败，请刷新页面重试',
    VALIDATION_ERROR: '输入数据格式不正确',
    IMPORT_ERROR: '数据导入失败，请检查文件格式',
    EXPORT_ERROR: '数据导出失败，请重试'
}
