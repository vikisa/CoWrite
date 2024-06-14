import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)

import './assets/main.scss'

import { store } from './store';
app.use(store);

import Element from './plugins/element-plus';
app.use(Element);

import router from './router';
app.use(router)

import dayjs from './plugins/day.js';
app.use(dayjs);

/*import { socket } from './plugins/socket';
app.config.globalProperties.$socket = socket;*/

app.mount('#app')
