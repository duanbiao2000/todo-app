// Logger Utility
// 环境感知的日志工具，生产环境不输出日志

const isDev = import.meta.env.DEV

class Logger {
    info(message, ...args) {
        if (isDev) {
            console.log(`[INFO] ${message}`, ...args)
        }
    }

    warn(message, ...args) {
        if (isDev) {
            console.warn(`[WARN] ${message}`, ...args)
        }
    }

    error(message, ...args) {
        // 错误日志在生产环境也输出
        console.error(`[ERROR] ${message}`, ...args)
    }

    debug(message, ...args) {
        if (isDev) {
            console.debug(`[DEBUG] ${message}`, ...args)
        }
    }

    success(message, ...args) {
        if (isDev) {
            console.log(`[SUCCESS] ✅ ${message}`, ...args)
        }
    }
}

export const logger = new Logger()
export default logger
