import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)

import './assets/main.scss'
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

import { store } from './store';
app.use(store);

import Element from './plugins/element-plus';
app.use(Element);

import router from './router'
app.use(router)

import dayjs from './plugins/day.js';
app.use(dayjs);

app.mount('#app')
