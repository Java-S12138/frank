import { createRouter, createWebHashHistory } from 'vue-router';

//@ts-ignore
const pageComps = import.meta.glob('../views/**/index.vue')
const routes:any[] = Object.entries(pageComps).map(component=>{
  const regex =/\/(\w+)\/\w+\.vue/
  const match = component[0].match(regex)
  const pathText = match?.[1]
  return {
    path:'/'+pathText,
    name:pathText,
    component:component[1]
  }
})

const router = createRouter({
  history: createWebHashHistory(''),
  routes:[{
    path: '/',
    redirect: '/home'
  }].concat(routes)
});

export default router;

