// Utility: Generate UUID
export function generateUUID() {
    return crypto.randomUUID()
}

// Utility: Format date
export function formatDate(date) {
    if (!date) return ''
    const d = new Date(date)
    return d.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    })
}

// Utility: Format relative time
export function formatRelativeTime(date) {
    if (!date) return ''

    const now = new Date()
    const target = new Date(date)
    const diffMs = target - now
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return '今天'
    if (diffDays === 1) return '明天'
    if (diffDays === -1) return '昨天'
    if (diffDays > 1 && diffDays < 7) return `${diffDays}天后`
    if (diffDays < -1 && diffDays > -7) return `${Math.abs(diffDays)}天前`

    return formatDate(date)
}

// Utility: Check if date is today
export function isToday(date) {
    if (!date) return false
    const today = new Date()
    const target = new Date(date)
    return (
        today.getFullYear() === target.getFullYear() &&
        today.getMonth() === target.getMonth() &&
        today.getDate() === target.getDate()
    )
}

// Utility: Check if date is overdue
export function isOverdue(date) {
    if (!date) return false
    return new Date(date) < new Date()
}

// Utility: Get start of day
export function getStartOfDay(date = new Date()) {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    return d
}

// Utility: Get end of day
export function getEndOfDay(date = new Date()) {
    const d = new Date(date)
    d.setHours(23, 59, 59, 999)
    return d
}
