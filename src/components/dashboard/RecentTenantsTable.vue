<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { TenantSummary } from '@/types'

defineProps<{ tenants: TenantSummary[] }>()
const router = useRouter()
</script>

<template>
  <div class="card">
    <div class="card-header">
      <h3 class="font-semibold text-slate-800">Tenants recientes</h3>
    </div>
    <div class="card-body p-0">
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Plan</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="t in tenants"
              :key="t.id"
              class="cursor-pointer hover:bg-slate-50"
              @click="router.push(`/tenants/${t.id}`)"
            >
              <td class="font-medium">{{ t.name }}</td>
              <td><span class="badge badge-secondary">{{ t.plan }}</span></td>
              <td>
                <span :class="['badge', t.isActive ? 'badge-success' : 'badge-danger']">
                  {{ t.isActive ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
            </tr>
            <tr v-if="tenants.length === 0">
              <td colspan="3" class="text-center text-slate-400 py-6 text-sm">Sin tenants recientes</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
