import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/login', name: 'Login', component: () => import('@/views/LoginView.vue') },
  { path: '/', name: 'Dashboard', component: () => import('@/views/DashboardView.vue'), meta: { requiresAuth: true } },
  { path: '/tenants', name: 'Tenants', component: () => import('@/views/TenantsView.vue'), meta: { requiresAuth: true } },
  { path: '/tenants/:id', name: 'TenantDetail', component: () => import('@/views/TenantDetailView.vue'), meta: { requiresAuth: true } },
  { path: '/users', name: 'Users', component: () => import('@/views/UsersView.vue'), meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/login')
  } else if (to.path === '/login' && authStore.isLoggedIn) {
    next('/')
  } else {
    next()
  }
})

export default router
