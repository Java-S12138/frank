import './style.css';
// @ts-ignore
import App from './main.vue';
import { createApp } from 'vue';
import { createPinia } from 'pinia';

createApp(App).use(createPinia()).mount('#app')
