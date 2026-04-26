<script setup lang="ts">
import type { TenantUserSummary } from '@/types'

interface Props {
  users: TenantUserSummary[]
}

defineProps<Props>()
</script>

<template>
  <div class="card">
    <div class="card-header">
      <h3 class="font-semibold">Users</h3>
    </div>
    <div class="card-body">
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in users" :key="u.id">
              <td class="font-medium">{{ u.firstName }} {{ u.lastName }}</td>
              <td>{{ u.email }}</td>
              <td>
                <span class="badge badge-secondary">{{ u.role }}</span>
              </td>
              <td>{{ new Date(u.createdAt).toLocaleDateString() }}</td>
            </tr>
            <tr v-if="users.length === 0">
              <td colspan="4" class="text-center text-slate-400 py-4">No users</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
