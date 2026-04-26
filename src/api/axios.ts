import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor: attach access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('posi_admin_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor: auto-refresh on 401
let isRefreshing = false
let refreshSubscribers: Array<(token: string) => void> = []

function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback)
}

function onTokenRefreshed(newToken: string) {
  refreshSubscribers.forEach((cb) => cb(newToken))
  refreshSubscribers = []
}

function isAuthEndpoint(url?: string): boolean {
  if (!url) return false
  return url.includes('/superadmin/login') || url.includes('/auth/refresh')
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status

    // Don't intercept 401 on auth endpoints (login/refresh)
    if (status === 401 && isAuthEndpoint(originalRequest?.url)) {
      return Promise.reject(error)
    }

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            resolve(api(originalRequest))
          })
        })
      }
      isRefreshing = true
      const refreshToken = localStorage.getItem('posi_admin_refresh_token')
      if (!refreshToken) {
        localStorage.removeItem('posi_admin_token')
        localStorage.removeItem('posi_admin_refresh_token')
        window.location.href = '/login'
        return Promise.reject(error)
      }
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/refresh`,
          { refreshToken }
        )
        localStorage.setItem('posi_admin_token', data.accessToken)
        localStorage.setItem('posi_admin_refresh_token', data.refreshToken)
        api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`
        onTokenRefreshed(data.accessToken)
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
        return api(originalRequest)
      } catch {
        localStorage.removeItem('posi_admin_token')
        localStorage.removeItem('posi_admin_refresh_token')
        window.location.href = '/login'
        return Promise.reject(error)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  }
)

export default api
