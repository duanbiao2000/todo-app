// Data Export/Import Utilities
import db from '../db'
import { validateImportData } from './validation'
import { logger } from './logger'
import { ERROR_MESSAGES } from '../constants'

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
        logger.error('Export failed:', error)
        throw new Error(ERROR_MESSAGES.EXPORT_ERROR)
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
                const rawData = JSON.parse(e.target.result)

                // Validate and clean data
                const data = validateImportData(rawData)

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
                logger.error('Import failed:', error)
                reject(new Error(ERROR_MESSAGES.IMPORT_ERROR + ': ' + error.message))
            }
        }

        reader.onerror = () => {
            logger.error('Failed to read file')
            reject(new Error('无法读取文件'))
        }

        reader.readAsText(file)
    })
}
