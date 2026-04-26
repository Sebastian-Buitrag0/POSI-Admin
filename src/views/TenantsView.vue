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
  if (!await notify.confirm('Are you sure you want to delete this tenant?')) return
  const result = await store.deleteTenant(id)
  if (result.success) notify.success('Tenant deleted successfully')
  else notify.error(result.message || 'Failed to delete tenant')
}

const handleCreateSubmit = async (formData: { name: string; adminEmail: string; adminFirstName: string; adminLastName: string; adminPassword: string }) => {
  const result = await store.createTenant(formData)
  if (result.success) {
    showCreateModal.value = false
    notify.success('Tenant created successfully')
  } else {
    notify.error(result.message || 'Failed to create tenant')
  }
}

const handleEditSubmit = async (formData: { id: string; plan: string; isActive: boolean }) => {
  const result = await store.updateTenant(formData.id, { plan: formData.plan, isActive: formData.isActive })
  if (result.success) {
    showEditModal.value = false
    notify.success('Tenant updated successfully')
  } else {
    notify.error(result.message || 'Failed to update tenant')
  }
}

const prevPage = () => { if (page.value > 1) { page.value--; store.fetchTenants(page.value, pageSize.value) } }
const nextPage = () => { page.value++; store.fetchTenants(page.value, pageSize.value) }
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-slate-800">Tenants</h2>
      <button class="btn btn-primary" @click="showCreateModal = true">+ Create Tenant</button>
    </div>

    <div v-if="loadingTenants" class="flex items-center justify-center py-12">
      <div class="spinner" />
    </div>

    <div v-else-if="error" class="p-4 rounded bg-danger text-white mb-4">
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
