<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useSuperAdminStore } from '../stores/superadmin'
import { useNotificationStore } from '../stores/notifications'
import UserList from '@/components/users/UserList.vue'
import PaginationControls from '@/components/users/PaginationControls.vue'

const store = useSuperAdminStore()
const notify = useNotificationStore()
const { users, loadingUsers, error } = storeToRefs(store)

const page = ref(1)
const pageSize = ref(50)

onMounted(() => loadUsers())

const loadUsers = () => store.fetchUsers(page.value, pageSize.value)

const prevPage = () => { if (page.value > 1) { page.value--; loadUsers() } }
const nextPage = () => { page.value++; loadUsers() }

const handleDelete = async (id: string) => {
  if (!await notify.confirm('¿Estás seguro de que quieres eliminar este usuario?')) return
  const result = await store.deleteUser(id)
  if (result.success) notify.success('Usuario eliminado correctamente')
  else notify.error(result.message || 'Error al eliminar el usuario')
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-slate-800">Usuarios</h2>
    </div>

    <div v-if="loadingUsers" class="flex items-center justify-center py-16">
      <div class="spinner" />
    </div>

    <div v-else-if="error" class="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center gap-3 mb-4">
      <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {{ error }}
    </div>

    <UserList v-else :users="users" :loading="loadingUsers" @delete="handleDelete" />

    <PaginationControls
      :page="page"
      :has-more="users.length >= pageSize"
      @prev="prevPage"
      @next="nextPage"
    />
  </div>
</template>
