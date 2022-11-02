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
  },
  {
    path: '/assist',
    name: 'Assist',
    component: () => import('../view/assist/index.vue')
  },
  {
    path: '/matchHistory',
    name: 'MatchHistory',
    component: () => import('@/render/components/matchHistory/index.vue')
  },
  ]

const router = createRouter({
  history: createWebHashHistory(''),
  routes,
});

export default router;
