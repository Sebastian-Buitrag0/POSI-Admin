<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSuperAdminStore } from '../stores/superadmin'
import StatCard from '../components/StatCard.vue'
import RecentTenantsTable from '@/components/dashboard/RecentTenantsTable.vue'
import SalesChart from '@/components/dashboard/SalesChart.vue'

const store = useSuperAdminStore()
const { dashboard, loadingDashboard, error } = storeToRefs(store)

onMounted(() => {
  store.fetchDashboard()
})

const stats = computed(() => {
  const d = dashboard.value
  return [
    { title: 'Total Tenants', value: d?.totalTenants ?? 0, subtitle: 'All registered tenants' },
    { title: 'Active Tenants', value: d?.activeTenants ?? 0, subtitle: 'Currently active' },
    { title: 'Total Users', value: d?.totalUsers ?? 0, subtitle: 'Across all tenants' },
    { title: 'Total Sales', value: d?.totalSales ?? 0, subtitle: 'Lifetime orders' },
    { title: 'Total Revenue', value: formatCurrency(d?.totalRevenue), subtitle: 'Lifetime' },
    { title: 'This Month', value: formatCurrency(d?.revenueThisMonth), subtitle: 'Current month' },
  ]
})

const salesChartData = computed(() =>
  (dashboard.value?.salesByDay || []).map((s) => ({
    label: s.date,
    value: s.revenue,
  }))
)

function formatCurrency(val: number | undefined | null) {
  if (val == null) return '$0'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val)
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-slate-800 mb-6">Dashboard</h2>

    <div v-if="loadingDashboard" class="flex items-center justify-center py-12">
      <div class="spinner" />
    </div>

    <div v-else-if="error" class="p-4 rounded bg-danger text-white">
      {{ error }}
    </div>

    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          v-for="stat in stats"
          :key="stat.title"
          :title="stat.title"
          :value="stat.value"
          :subtitle="stat.subtitle"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentTenantsTable :tenants="dashboard?.recentTenants || []" />
        <SalesChart :data="salesChartData" />
      </div>
    </div>
  </div>
</template>
