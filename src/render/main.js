import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import animated  from'animate.css'
import { createApp } from 'vue'
import Directive from './directives'
import echarts from '../utils/render/echarts'

createApp(App)
  .use(router)
  .use(animated)
  .use(Directive)
  .use(createPinia())
  .use(echarts)
  .mount('#app')
