import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './assets/styles/main.css'
import { initializeDefaultData } from './db'
import { logger } from './utils/logger'

// Create Vue app
const app = createApp(App)

// Create and use Pinia
const pinia = createPinia()
app.use(pinia)

// Initialize database with default data
initializeDefaultData().then(() => {
    logger.success('Database initialized successfully')
}).catch((error) => {
    logger.error('Failed to initialize database:', error)
})

// Mount app
app.mount('#app')
