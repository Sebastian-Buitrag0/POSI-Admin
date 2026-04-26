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

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
</script>

<template>
  <div class="card">
    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Slug</th>
            <th>Plan</th>
            <th>Estado</th>
            <th>Usuarios</th>
            <th>Productos</th>
            <th>Ventas</th>
            <th>Creado</th>
            <th class="text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in tenants" :key="t.id" class="cursor-pointer hover:bg-slate-50" @click="emit('view', t.id)">
            <td class="font-medium">{{ t.name }}</td>
            <td class="text-slate-500">{{ t.slug }}</td>
            <td>
              <span class="badge badge-secondary">{{ t.plan }}</span>
            </td>
            <td>
              <span :class="['badge', t.isActive ? 'badge-success' : 'badge-danger']">
                {{ t.isActive ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td>{{ t.userCount ?? 0 }}</td>
            <td>{{ t.productCount ?? 0 }}</td>
            <td>{{ t.saleCount ?? 0 }}</td>
            <td class="text-slate-500">{{ formatDate(t.createdAt) }}</td>
            <td class="text-right" @click.stop>
              <div class="flex items-center justify-end gap-2">
                <button class="btn btn-sm btn-secondary" @click="emit('view', t.id)">Ver</button>
                <button class="btn btn-sm btn-primary" @click="emit('edit', t)">Editar</button>
                <button class="btn btn-sm btn-danger" @click="emit('delete', t.id)">Eliminar</button>
              </div>
            </td>
          </tr>
          <tr v-if="tenants.length === 0">
            <td colspan="9" class="text-center py-12">
              <div class="flex flex-col items-center gap-2 text-slate-400">
                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                </svg>
                <span class="text-sm">No hay tenants registrados</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
