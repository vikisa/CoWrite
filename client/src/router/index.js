import { createRouter, createWebHistory } from 'vue-router';
import { store } from '@/store';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: {
        notRequiresAuth: true,
        title: 'Вход',
      },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/Register.vue'),
      meta: {
        notRequiresAuth: true,
        title: 'Регистрация',
      },
    },

    {
      path: '/',
      name: 'list',
      component: () => import('@/views/List.vue')
    },
    {
      path: '/list',
      name: 'list',
      component: () => import('@/views/List.vue')
    },
    {
      path: '/material',
      name: 'material',
      component: () => import('@/views/material/Index.vue'),
      children: [
        {
          path: 'new',
          name: 'new-material',
          component: () => import('@/views/material/Index.vue'),
        },
      ]
    },
  ]
})

router.beforeEach(async (to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated;

  if (to.matched.some((record) => record.meta.notRequiresAuth)) {
    next();
  } else if (isAuthenticated) {
    next();
  } else {
    next({ name: 'login' });
  }
});

export default router
