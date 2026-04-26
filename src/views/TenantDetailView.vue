<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useSuperAdminStore } from '../stores/superadmin'
import { useNotificationStore } from '../stores/notifications'
import StatCard from '../components/StatCard.vue'
import type { TenantStats, DailyGlobalSales } from '@/types'

const route = useRoute()
const router = useRouter()
const store = useSuperAdminStore()
const notify = useNotificationStore()
const { currentTenant, loadingTenant, error } = storeToRefs(store)

const tenantId = computed(() => route.params.id as string)
const stats = ref<TenantStats | null>(null)
const editing = ref(false)
const saving = ref(false)
const editPlan = ref('')
const editIsActive = ref(true)

onMounted(async () => {
  await store.fetchTenant(tenantId.value)
  if (currentTenant.value) {
    editPlan.value = currentTenant.value.plan
    editIsActive.value = currentTenant.value.isActive
  }
  const result = await store.fetchTenantStats(tenantId.value)
  if (result.success && result.stats) stats.value = result.stats
})

const tenant = computed(() => currentTenant.value)

const statCards = computed(() => {
  const s = stats.value
  return [
    { title: 'Usuarios',   value: s?.totalUsers ?? 0,         icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', color: '#8B5CF6' },
    { title: 'Productos',  value: s?.totalProducts ?? 0,      icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', color: '#3B82F6' },
    { title: 'Ventas',     value: s?.totalSales ?? 0,         icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', color: '#F59E0B' },
    { title: 'Ingresos',   value: formatCurrency(s?.totalRevenue), icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 6v1m0 4v1', color: '#10B981' },
  ]
})

const salesByDay = computed(() => stats.value?.salesByDay || [] as DailyGlobalSales[])
const maxDaySales = computed(() => Math.max(...salesByDay.value.map((d) => d.revenue || 0), 1))
const topProducts = computed(() => stats.value?.topProducts || [])
const tenantUsers = computed(() => currentTenant.value?.users || [])

function formatCurrency(val: number | undefined | null) {
  if (val == null) return '$0'
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val)
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function startEditing() {
  if (!tenant.value) return
  editPlan.value = tenant.value.plan
  editIsActive.value = tenant.value.isActive
  editing.value = true
}

async function saveChanges() {
  if (!tenant.value) return
  saving.value = true
  const result = await store.updateTenant(tenant.value.id, { plan: editPlan.value, isActive: editIsActive.value })
  saving.value = false
  if (result.success) {
    editing.value = false
    notify.success('Cambios guardados correctamente')
  } else {
    notify.error(result.message || 'Error al guardar los cambios')
  }
}
</script>

<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <button class="btn btn-secondary flex items-center gap-1.5" @click="router.push('/tenants')">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Volver
      </button>
      <h2 class="text-2xl font-bold text-slate-800">Detalle del Tenant</h2>
    </div>

    <div v-if="loadingTenant" class="flex items-center justify-center py-16">
      <div class="spinner" />
    </div>

    <div v-else-if="error" class="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center gap-3">
      <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {{ error }}
    </div>

    <div v-else-if="tenant">
      <!-- Info card -->
      <div class="card mb-6">
        <div class="card-body">
          <div class="flex items-start justify-between mb-4 gap-4">
            <div>
              <h3 class="text-xl font-bold text-slate-800">{{ tenant.name }}</h3>
              <p class="text-slate-500 text-sm mt-0.5">{{ tenant.slug }}</p>
              <div class="flex items-center gap-2 mt-2">
                <span class="badge badge-secondary">{{ tenant.plan }}</span>
                <span :class="['badge', tenant.isActive ? 'badge-success' : 'badge-danger']">
                  {{ tenant.isActive ? 'Activo' : 'Inactivo' }}
                </span>
              </div>
            </div>
            <div class="flex-shrink-0">
              <button v-if="!editing" class="btn btn-primary" @click="startEditing">
                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar
              </button>
              <div v-else class="flex gap-2">
                <button class="btn btn-secondary" :disabled="saving" @click="editing = false">Cancelar</button>
                <button class="btn btn-success" :disabled="saving" @click="saveChanges">
                  <span v-if="saving" class="spinner mr-1.5" style="width:.9rem;height:.9rem;border-width:2px" />
                  {{ saving ? 'Guardando...' : 'Guardar' }}
                </button>
              </div>
            </div>
          </div>

          <div v-if="editing" class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div class="form-group mb-0">
              <label class="form-label">Plan</label>
              <select v-model="editPlan" class="form-input">
                <option value="basic">Basic</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
            <div class="form-group mb-0">
              <label class="form-label">Estado</label>
              <label class="flex items-center gap-2 mt-2 cursor-pointer">
                <input v-model="editIsActive" type="checkbox" />
                <span class="text-sm">{{ editIsActive ? 'Activo' : 'Inactivo' }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          v-for="card in statCards"
          :key="card.title"
          :title="card.title"
          :value="card.value"
          :icon="card.icon"
          :color="card.color"
        />
      </div>

      <!-- Charts -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="card">
          <div class="card-header">
            <h3 class="font-semibold text-slate-800">Ventas por día</h3>
          </div>
          <div class="card-body">
            <div v-if="salesByDay.length" class="bar-chart">
              <div
                v-for="day in salesByDay"
                :key="day.date"
                class="bar"
                :style="{ height: `${(day.revenue / maxDaySales) * 100}%` }"
                :title="`${day.date}: ${formatCurrency(day.revenue)}`"
              />
            </div>
            <p v-else class="text-slate-400 text-center py-4 text-sm">Sin datos de ventas</p>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="font-semibold text-slate-800">Productos más vendidos</h3>
          </div>
          <div class="card-body">
            <div v-if="topProducts.length" class="flex flex-col gap-3">
              <div v-for="p in topProducts" :key="p.name" class="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <div class="min-w-0 mr-3">
                  <p class="font-medium text-sm truncate">{{ p.name }}</p>
                  <p class="text-xs text-slate-400">{{ p.quantity }} ventas</p>
                </div>
                <span class="font-semibold text-sm flex-shrink-0">{{ formatCurrency(p.revenue) }}</span>
              </div>
            </div>
            <p v-else class="text-slate-400 text-center py-4 text-sm">Sin datos de productos</p>
          </div>
        </div>
      </div>

      <!-- Users table -->
      <div class="card">
        <div class="card-header">
          <h3 class="font-semibold text-slate-800">Usuarios del tenant</h3>
        </div>
        <div class="card-body p-0">
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Creado</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="u in tenantUsers" :key="u.id">
                  <td class="font-medium">{{ u.firstName }} {{ u.lastName }}</td>
                  <td>{{ u.email }}</td>
                  <td><span class="badge badge-secondary">{{ u.role }}</span></td>
                  <td>{{ formatDate(u.createdAt) }}</td>
                </tr>
                <tr v-if="tenantUsers.length === 0">
                  <td colspan="4" class="text-center text-slate-400 py-8 text-sm">Sin usuarios registrados</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
