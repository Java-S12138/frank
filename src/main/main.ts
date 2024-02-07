import './style.css';
// @ts-ignore
import App from './main.vue';
import router from './router';
import { createApp } from 'vue';
import { createPinia } from 'pinia';

createApp(App).use(router).use(createPinia()).mount('#app')
