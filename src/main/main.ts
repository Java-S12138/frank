import './style.css';
import App from './Main.vue';
import router from '../router';
import { createApp } from 'vue';
import { createPinia } from 'pinia';

createApp(App).use(router).use(createPinia()).mount('#app')

// cube.utils.getPrimaryDisplay().then((value) => {
//   if (value.size.width >= 1920){
//     cube.windows.getCurrentWindow().then((win) => {
//       cube.windows.setPosition(win.id,1600,180)
//     })
//   }
// })

