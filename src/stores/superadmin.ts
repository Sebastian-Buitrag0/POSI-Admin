import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'
import api from '@/api/axios'
import type {
  SuperAdminDashboard,
  TenantSummary,
  TenantDetail,
  GlobalUser,
  TenantStats,
} from '@/types'

export const useSuperAdminStore = defineStore('superadmin', () => {
  const dashboard = shallowRef<SuperAdminDashboard | null>(null)
  const tenants = shallowRef<TenantSummary[]>([])
  const users = shallowRef<GlobalUser[]>([])
  const currentTenant = shallowRef<TenantDetail | null>(null)

  const loadingDashboard = ref(false)
  const loadingTenants = ref(false)
  const loadingUsers = ref(false)
  const loadingTenant = ref(false)
  const loadingCreate = ref(false)
  const loadingUpdate = ref(false)
  const loadingDelete = ref(false)

  const error = ref<string | undefined>(undefined)

  async function fetchDashboard() {
    loadingDashboard.value = true; error.value = undefined
    try {
      const { data } = await api.get('/superadmin/dashboard')
      dashboard.value = data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load dashboard'
    } finally { loadingDashboard.value = false }
  }

  async function fetchTenants(page = 1, pageSize = 50) {
    loadingTenants.value = true; error.value = undefined
    try {
      const { data } = await api.get('/superadmin/tenants', { params: { page, pageSize } })
      tenants.value = data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load tenants'
    } finally { loadingTenants.value = false }
  }

  async function fetchTenant(id: string) {
    loadingTenant.value = true; error.value = undefined
    try {
      const { data } = await api.get(`/superadmin/tenants/${id}`)
      currentTenant.value = data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load tenant'
    } finally { loadingTenant.value = false }
  }

  async function createTenant(payload: Record<string, unknown>): Promise<{ success: boolean; tenant?: TenantSummary; message?: string }> {
    loadingCreate.value = true; error.value = undefined
    try {
      const { data: tenant } = await api.post('/superadmin/tenants', payload)
      tenants.value = [...tenants.value, tenant]
      return { success: true, tenant }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create tenant'
      return { success: false, message: error.value }
    } finally { loadingCreate.value = false }
  }

  async function updateTenant(id: string, payload: Record<string, unknown>): Promise<{ success: boolean; message?: string }> {
    loadingUpdate.value = true; error.value = undefined
    try {
      await api.put(`/superadmin/tenants/${id}`, payload)
      const idx = tenants.value.findIndex((t) => t.id === id)
      if (idx !== -1) {
        const updated = [...tenants.value]
        updated[idx] = { ...updated[idx], ...payload } as TenantSummary
        tenants.value = updated
      }
      if (currentTenant.value?.id === id) {
        currentTenant.value = { ...currentTenant.value, ...payload } as TenantDetail
      }
      return { success: true }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update tenant'
      return { success: false, message: error.value }
    } finally { loadingUpdate.value = false }
  }

  async function deleteTenant(id: string): Promise<{ success: boolean; message?: string }> {
    loadingDelete.value = true; error.value = undefined
    try {
      await api.delete(`/superadmin/tenants/${id}`)
      tenants.value = tenants.value.filter((t) => t.id !== id)
      return { success: true }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete tenant'
      return { success: false, message: error.value }
    } finally { loadingDelete.value = false }
  }

  async function fetchUsers(page = 1, pageSize = 50) {
    loadingUsers.value = true; error.value = undefined
    try {
      const { data } = await api.get('/superadmin/users', { params: { page, pageSize } })
      users.value = data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load users'
    } finally { loadingUsers.value = false }
  }

  async function deleteUser(id: string): Promise<{ success: boolean; message?: string }> {
    loadingUsers.value = true; error.value = undefined
    try {
      await api.delete(`/superadmin/users/${id}`)
      users.value = users.value.filter((u) => u.id !== id)
      return { success: true }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete user'
      return { success: false, message: error.value }
    } finally { loadingUsers.value = false }
  }

  async function fetchTenantStats(id: string): Promise<{ success: boolean; stats?: TenantStats; message?: string }> {
    loadingTenant.value = true; error.value = undefined
    try {
      const { data } = await api.get(`/superadmin/tenants/${id}/stats`)
      return { success: true, stats: data }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load tenant stats'
      return { success: false, message: error.value }
    } finally { loadingTenant.value = false }
  }

  return {
    dashboard, tenants, users, currentTenant,
    loadingDashboard, loadingTenants, loadingUsers, loadingTenant, loadingCreate, loadingUpdate, loadingDelete,
    error,
    fetchDashboard, fetchTenants, fetchTenant,
    createTenant, updateTenant, deleteTenant,
    fetchUsers, deleteUser, fetchTenantStats,
  }
})
