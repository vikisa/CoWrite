import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'list',
      component: () => import('@/views/List.vue')
    },
    {
      path: '/material',
      name: 'material',
      component: () => import('@/views/material/Index.vue')
    }
  ]
})

export default router
