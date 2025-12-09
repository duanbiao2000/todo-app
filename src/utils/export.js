// Data Export/Import Utilities
import db from '../db'

/**
 * Export all data to JSON file
 */
export async function exportData() {
    try {
        const tasks = await db.tasks.toArray()
        const categories = await db.categories.toArray()
        const settings = await db.settings.toArray()

        const data = {
            version: 1,
            exportDate: new Date().toISOString(),
            tasks,
            categories,
            settings
        }

        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json'
        })

        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `todo-backup-${Date.now()}.json`
        a.click()
        URL.revokeObjectURL(url)

        return true
    } catch (error) {
        console.error('Export failed:', error)
        throw new Error('导出失败：' + error.message)
    }
}

/**
 * Import data from JSON file
 */
export async function importData(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = async (e) => {
            try {
                const data = JSON.parse(e.target.result)

                // Validate data format
                if (!data.version || !data.tasks || !data.categories) {
                    throw new Error('Invalid backup file format')
                }

                // Clear existing data
                await db.tasks.clear()
                await db.categories.clear()

                // Import new data
                await db.tasks.bulkAdd(data.tasks)
                await db.categories.bulkAdd(data.categories)

                if (data.settings) {
                    await db.settings.bulkPut(data.settings)
                }

                resolve(data)
            } catch (error) {
                reject(new Error('导入失败：' + error.message))
            }
        }

        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsText(file)
    })
}
