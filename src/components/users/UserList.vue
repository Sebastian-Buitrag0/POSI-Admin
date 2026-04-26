<script setup lang="ts">
import type { GlobalUser } from '@/types'

interface Props {
  users: GlobalUser[]
  loading: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  delete: [id: string]
}>()
</script>

<template>
  <div class="card">
    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Tenant</th>
            <th>Created</th>
            <th class="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in users" :key="u.id">
            <td class="font-medium">{{ u.firstName }} {{ u.lastName }}</td>
            <td>{{ u.email }}</td>
            <td>
              <span class="badge badge-secondary">{{ u.role }}</span>
            </td>
            <td>{{ u.tenantName || '-' }}</td>
            <td>{{ new Date(u.createdAt).toLocaleDateString() }}</td>
            <td class="text-right">
              <button class="btn btn-sm btn-danger" @click="emit('delete', u.id)">Delete</button>
            </td>
          </tr>
          <tr v-if="users.length === 0">
            <td colspan="6" class="text-center text-slate-400 py-8">No users found</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
