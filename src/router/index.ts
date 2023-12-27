import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/index',
    name: 'Index',
    component: () => import('../main/pages/assist/index.vue')
  }
  ]

const router = createRouter({
  history: createWebHashHistory(''),
  routes,
});

export default router;

