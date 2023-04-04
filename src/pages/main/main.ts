import '../../style.css';
import App from './Main.vue';
import router from './router';
import { createApp } from 'vue';
import { createPinia } from 'pinia';

if (localStorage.getItem('theme') === 'light') {
  import('../../styleLight.css')
}else {
  import('../../styleDark.css')
}

createApp(App).use(router).use(createPinia()).mount('#app')
