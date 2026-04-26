import { defineStore } from 'pinia'
import { ref, shallowRef, computed } from 'vue'
import api from '@/api/axios'
import type { SuperAdminLoginResponse } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('posi_admin_token'))
  const refreshToken = ref<string | null>(localStorage.getItem('posi_admin_refresh_token'))
  const user = shallowRef<SuperAdminLoginResponse | null>(null)

  const isLoggedIn = computed(() => !!token.value)

  async function login(email: string, password: string): Promise<{ success: boolean; message?: string }> {
    try {
      const { data } = await api.post('/superadmin/login', { email, password })
      token.value = data.accessToken
      refreshToken.value = data.refreshToken
      user.value = data
      localStorage.setItem('posi_admin_token', data.accessToken)
      localStorage.setItem('posi_admin_refresh_token', data.refreshToken)
      return { success: true }
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || 'Login failed' }
    }
  }

  async function refresh(): Promise<boolean> {
    const rt = refreshToken.value
    if (!rt) return false
    try {
      const { data } = await api.post('/auth/refresh', { refreshToken: rt })
      token.value = data.accessToken
      refreshToken.value = data.refreshToken
      localStorage.setItem('posi_admin_token', data.accessToken)
      localStorage.setItem('posi_admin_refresh_token', data.refreshToken)
      return true
    } catch {
      logout()
      return false
    }
  }

  function logout() {
    token.value = null
    refreshToken.value = null
    user.value = null
    localStorage.removeItem('posi_admin_token')
    localStorage.removeItem('posi_admin_refresh_token')
    window.location.href = '/login'
  }

  return { token, refreshToken, user, isLoggedIn, login, refresh, logout }
})
