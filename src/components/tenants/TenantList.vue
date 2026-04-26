<script setup lang="ts">
import type { TenantSummary } from '@/types'

interface Props {
  tenants: TenantSummary[]
  loading: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  view: [id: string]
  edit: [tenant: TenantSummary]
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
            <th>Slug</th>
            <th>Plan</th>
            <th>Status</th>
            <th>Users</th>
            <th>Products</th>
            <th>Sales</th>
            <th>Created</th>
            <th class="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in tenants" :key="t.id">
            <td class="font-medium">{{ t.name }}</td>
            <td>{{ t.slug }}</td>
            <td>
              <span class="badge badge-secondary">{{ t.plan }}</span>
            </td>
            <td>
              <span :class="['badge', t.isActive ? 'badge-success' : 'badge-danger']">
                {{ t.isActive ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td>{{ t.userCount ?? 0 }}</td>
            <td>{{ t.productCount ?? 0 }}</td>
            <td>{{ t.saleCount ?? 0 }}</td>
            <td>{{ new Date(t.createdAt).toLocaleDateString() }}</td>
            <td class="text-right">
              <div class="flex items-center justify-end gap-2">
                <button class="btn btn-sm btn-secondary" @click="emit('view', t.id)">View</button>
                <button class="btn btn-sm btn-primary" @click="emit('edit', t)">Edit</button>
                <button class="btn btn-sm btn-danger" @click="emit('delete', t.id)">Delete</button>
              </div>
            </td>
          </tr>
          <tr v-if="tenants.length === 0">
            <td colspan="9" class="text-center text-slate-400 py-8">No tenants found</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
