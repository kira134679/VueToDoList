import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/SignUpPage.vue')
    },
		{
      path: '/login',
      component: () => import('../views/LoginPage.vue')
    },
		{
      path: '/todolist',
      component: () => import('../views/TodoListPage.vue')
    },
  ]
})

export default router
