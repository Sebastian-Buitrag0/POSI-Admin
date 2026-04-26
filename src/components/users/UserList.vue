<script setup lang="ts">
import type { GlobalUser } from '@/types'

interface Props {
  users: GlobalUser[]
  loading: boolean
}

defineProps<Props>()

const emit = defineEmits<{ delete: [id: string] }>()

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
            <th>Correo</th>
            <th>Rol</th>
            <th>Tenant</th>
            <th>Creado</th>
            <th class="text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in users" :key="u.id">
            <td class="font-medium">{{ u.firstName }} {{ u.lastName }}</td>
            <td>{{ u.email }}</td>
            <td><span class="badge badge-secondary">{{ u.role }}</span></td>
            <td class="text-slate-500">{{ u.tenantName || '—' }}</td>
            <td class="text-slate-500">{{ formatDate(u.createdAt) }}</td>
            <td class="text-right">
              <button class="btn btn-sm btn-danger" @click="emit('delete', u.id)">Eliminar</button>
            </td>
          </tr>
          <tr v-if="users.length === 0">
            <td colspan="6" class="text-center py-12">
              <div class="flex flex-col items-center gap-2 text-slate-400">
                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span class="text-sm">No hay usuarios registrados</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
