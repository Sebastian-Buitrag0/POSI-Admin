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
  if (!await notify.confirm('Are you sure you want to delete this user?')) return
  const result = await store.deleteUser(id)
  if (result.success) notify.success('User deleted successfully')
  else notify.error(result.message || 'Failed to delete user')
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-slate-800">Users</h2>
    </div>

    <div v-if="loadingUsers" class="flex items-center justify-center py-12">
      <div class="spinner" />
    </div>

    <div v-else-if="error" class="p-4 rounded bg-danger text-white mb-4">
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
