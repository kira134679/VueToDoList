import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'todolist',
      component: () => import('../views/TodoListPage.vue')
    },
		{
      path: '/signup',
      component: () => import('../views/SignUpPage.vue')
    },
		{
      path: '/login',
			component: () => import('../views/LoginPage.vue')
    },
		{
			path: '/:pathMatch(.*)*',
			component: () => import('../views/NotFoundPage.vue')
		}
  ]
})

export default router
