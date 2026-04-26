<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useSuperAdminStore } from '../stores/superadmin'
import { useNotificationStore } from '../stores/notifications'
import TenantList from '@/components/tenants/TenantList.vue'
import TenantCreateModal from '@/components/tenants/TenantCreateModal.vue'
import TenantEditModal from '@/components/tenants/TenantEditModal.vue'
import PaginationControls from '@/components/users/PaginationControls.vue'
import type { TenantSummary } from '@/types'

const router = useRouter()
const store = useSuperAdminStore()
const notify = useNotificationStore()
const { tenants, loadingTenants, error } = storeToRefs(store)

const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingTenant = ref<TenantSummary | null>(null)
const page = ref(1)
const pageSize = ref(50)

onMounted(() => store.fetchTenants(page.value, pageSize.value))

const handleView = (id: string) => router.push(`/tenants/${id}`)

const handleEdit = (tenant: TenantSummary) => {
  editingTenant.value = tenant
  showEditModal.value = true
}

const handleDelete = async (id: string) => {
  if (!await notify.confirm('¿Estás seguro de que quieres eliminar este tenant? Esta acción no se puede deshacer.')) return
  const result = await store.deleteTenant(id)
  if (result.success) notify.success('Tenant eliminado correctamente')
  else notify.error(result.message || 'Error al eliminar el tenant')
}

const handleCreateSubmit = async (formData: { name: string; adminEmail: string; adminFirstName: string; adminLastName: string; adminPassword: string }) => {
  const result = await store.createTenant(formData)
  if (result.success) {
    showCreateModal.value = false
    notify.success('Tenant creado correctamente')
  } else {
    notify.error(result.message || 'Error al crear el tenant')
  }
}

const handleEditSubmit = async (formData: { id: string; plan: string; isActive: boolean }) => {
  const result = await store.updateTenant(formData.id, { plan: formData.plan, isActive: formData.isActive })
  if (result.success) {
    showEditModal.value = false
    notify.success('Tenant actualizado correctamente')
  } else {
    notify.error(result.message || 'Error al actualizar el tenant')
  }
}

const prevPage = () => { if (page.value > 1) { page.value--; store.fetchTenants(page.value, pageSize.value) } }
const nextPage = () => { page.value++; store.fetchTenants(page.value, pageSize.value) }
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-slate-800">Tenants</h2>
      <button class="btn btn-primary" @click="showCreateModal = true">
        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Crear Tenant
      </button>
    </div>

    <div v-if="loadingTenants" class="flex items-center justify-center py-16">
      <div class="spinner" />
    </div>

    <div v-else-if="error" class="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center gap-3 mb-4">
      <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {{ error }}
    </div>

    <TenantList
      v-else
      :tenants="tenants"
      :loading="loadingTenants"
      @view="handleView"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <PaginationControls
      :page="page"
      :has-more="tenants.length >= pageSize"
      @prev="prevPage"
      @next="nextPage"
    />

    <TenantCreateModal
      :visible="showCreateModal"
      @submit="handleCreateSubmit"
      @cancel="showCreateModal = false"
    />

    <TenantEditModal
      :visible="showEditModal"
      :tenant="editingTenant"
      @submit="handleEditSubmit"
      @cancel="showEditModal = false"
    />
  </div>
</template>
