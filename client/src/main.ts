import './assets/main.css'
import 'element-plus/dist/index.css'
import Element from './plugins/element-plus';
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)
app.use(Element)

app.mount('#app')
