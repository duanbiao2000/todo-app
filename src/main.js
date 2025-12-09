import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './assets/styles/main.css'
import { initializeDefaultData } from './db'

// Create Vue app
const app = createApp(App)

// Create and use Pinia
const pinia = createPinia()
app.use(pinia)

// Initialize database with default data
initializeDefaultData().then(() => {
    console.log('Database initialized')
})

// Mount app
app.mount('#app')
