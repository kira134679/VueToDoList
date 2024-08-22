import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/LoginPage.vue')
    },
		{
      path: '/todolist',
      name: 'todolist',
      component: () => import('../views/TodoListPage.vue')
    },
  ]
})

export default router
