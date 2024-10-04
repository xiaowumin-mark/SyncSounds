import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        showBar: true,
      }
    },
    {
      path: '/music',
      name: 'music',
      component: () => import('../views/music.vue'),
      meta: {
        showBar: true,
      }
    },
    {
      path: '/me',
      name: 'account',
      component: () => import('../views/account.vue'),
      meta: {
        showBar: true,
      }
    }, {
      path: '/music/:id',
      name: 'oMusic',
      component: () => import('../views/music/online.vue'),
      meta: {
        showBar: false,
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login.vue'),
      meta: {
        showBar: false,
      }
    }
  ]
})

export default router
