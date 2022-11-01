import {createRouter, createWebHashHistory} from 'vue-router'


const routes = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/index',
    name: 'Index',
    component: () => import('@/render/components/home')
  },
  {
    path: '/assist',
    name: 'Assist',
    component: () => import('@/render/components/assist/assistWindow.vue')
  },
  {
    path: '/matchHistory',
    name: 'MatchHistory',
    component: () => import('@/render/components/matchHistory/index.vue')
  },
  {
    path: '/queryMatch',
    name: 'QueryMatch',
    component: () => import('@/render/components/queryMatch/index.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
