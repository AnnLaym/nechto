import PrimeVue from 'primevue/config'
import 'vite/modulepreload-polyfill'
import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

const app = createApp(App)
app.use(PrimeVue)
app.mount('#app')
