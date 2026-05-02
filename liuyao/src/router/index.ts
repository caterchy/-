import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory('/liuyao/'),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/result',
      name: 'result',
      component: () => import('../views/ResultView.vue'),
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('../views/HistoryView.vue'),
    },
    {
      path: '/library',
      name: 'library',
      component: () => import('../views/HexagramLibraryView.vue'),
    },
  ],
})

export default router
