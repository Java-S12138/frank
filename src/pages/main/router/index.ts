import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/index',
    name: 'Index',
    component: () => import('../view/home/index.vue')
  },
  {
    path: '/queryMatch',
    name: 'QueryMatch',
    component: () => import('../view/queryMatch/index.vue')
  }
  ]

const router = createRouter({
  history: createWebHashHistory(''),
  routes,
});

export default router;
