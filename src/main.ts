import {createApp} from 'vue';
import App from './App.vue';
import Directive from './directives';
import router from './router';
import { createPinia } from 'pinia';

createApp(App)
    .use(Directive)
    .use(router)
    .use(createPinia())
    .mount('#app');
