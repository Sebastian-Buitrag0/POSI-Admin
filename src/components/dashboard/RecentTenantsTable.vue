<script setup lang="ts">
import type { TenantSummary } from '@/types'

interface Props {
  tenants: TenantSummary[]
}

defineProps<Props>()
</script>

<template>
  <div class="card">
    <div class="card-header">
      <h3 class="font-semibold text-slate-800">Recent Tenants</h3>
    </div>
    <div class="card-body">
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Plan</th>
              <th>Status</th>
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
            </tr>
            <tr v-if="tenants.length === 0">
              <td colspan="4" class="text-center text-slate-400 py-4">No recent tenants</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
