<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSuperAdminStore } from '../stores/superadmin'
import StatCard from '../components/StatCard.vue'
import RecentTenantsTable from '@/components/dashboard/RecentTenantsTable.vue'
import SalesChart from '@/components/dashboard/SalesChart.vue'

const store = useSuperAdminStore()
const { dashboard, loadingDashboard, error } = storeToRefs(store)

onMounted(() => store.fetchDashboard())

const stats = computed(() => {
  const d = dashboard.value
  return [
    { title: 'Tenants totales',   value: d?.totalTenants ?? 0,               subtitle: 'Todos los registrados',     icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', color: '#3B82F6' },
    { title: 'Tenants activos',   value: d?.activeTenants ?? 0,              subtitle: 'Con suscripción activa',    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: '#22C55E' },
    { title: 'Usuarios totales',  value: d?.totalUsers ?? 0,                 subtitle: 'En todos los tenants',      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', color: '#8B5CF6' },
    { title: 'Ventas totales',    value: d?.totalSales ?? 0,                 subtitle: 'Transacciones de por vida', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', color: '#F59E0B' },
    { title: 'Ingresos totales',  value: formatCurrency(d?.totalRevenue),    subtitle: 'Acumulado histórico',       icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 6v1m0 4v1m-3-6H7m2 0h6', color: '#10B981' },
    { title: 'Ingresos este mes', value: formatCurrency(d?.revenueThisMonth), subtitle: 'Mes en curso',             icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', color: '#EC4899' },
  ]
})

const salesChartData = computed(() =>
  (dashboard.value?.salesByDay || []).map((s) => ({ label: s.date, value: s.revenue }))
)

function formatCurrency(val: number | undefined | null) {
  if (val == null) return '$0'
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val)
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-slate-800 mb-6">Dashboard</h2>

    <div v-if="loadingDashboard" class="flex items-center justify-center py-16">
      <div class="spinner" />
    </div>

    <div v-else-if="error" class="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center gap-3 mb-4">
      <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {{ error }}
    </div>

    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard
          v-for="stat in stats"
          :key="stat.title"
          :title="stat.title"
          :value="stat.value"
          :subtitle="stat.subtitle"
          :icon="stat.icon"
          :color="stat.color"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentTenantsTable :tenants="dashboard?.recentTenants || []" />
        <SalesChart :data="salesChartData" />
      </div>
    </div>
  </div>
</template>
