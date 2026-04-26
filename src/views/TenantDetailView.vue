<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useSuperAdminStore } from '../stores/superadmin'
import StatCard from '../components/StatCard.vue'
import type { TenantStats, DailyGlobalSales, TenantUserSummary } from '@/types'

const route = useRoute()
const router = useRouter()
const store = useSuperAdminStore()
const { currentTenant, loadingTenant, error } = storeToRefs(store)

const tenantId = computed(() => route.params.id as string)
const stats = ref<TenantStats | null>(null)
const editing = ref(false)

onMounted(async () => {
  await store.fetchTenant(tenantId.value)
  const result = await store.fetchTenantStats(tenantId.value)
  if (result.success && result.stats) {
    stats.value = result.stats
  }
})

const tenant = computed(() => currentTenant.value)

const statCards = computed(() => {
  const s = stats.value
  return [
    { title: 'Total Users', value: s?.totalUsers ?? 0 },
    { title: 'Total Products', value: s?.totalProducts ?? 0 },
    { title: 'Total Sales', value: s?.totalSales ?? 0 },
    { title: 'Revenue', value: formatCurrency(s?.totalRevenue) },
  ]
})

const salesByDay = computed(() => {
  return stats.value?.salesByDay || [] as DailyGlobalSales[]
})

const maxDaySales = computed(() => {
  return Math.max(...salesByDay.value.map((d) => d.revenue || 0), 1)
})

const topProducts = computed(() => {
  return stats.value?.topProducts || []
})

const users = computed(() => {
  return (stats.value as any)?.users || [] as TenantUserSummary[]
})

function formatCurrency(val: number | undefined | null) {
  if (val == null) return '$0'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val)
}

async function saveChanges() {
  if (!tenant.value) return
  const result = await store.updateTenant(tenant.value.id, {
    plan: tenant.value.plan,
    isActive: tenant.value.isActive,
  })
  if (result.success) {
    editing.value = false
  } else {
    alert(result.message)
  }
}
</script>

<template>
  <div>
    <div class="flex items-center gap-4 mb-6">
      <button class="btn btn-secondary" @click="router.push('/tenants')">&larr; Back</button>
      <h2 class="text-2xl font-bold text-slate-800">Tenant Details</h2>
    </div>

    <div v-if="loadingTenant" class="flex items-center justify-center py-12">
      <div class="spinner" />
    </div>

    <div v-else-if="error" class="p-4 rounded bg-danger text-white">
      {{ error }}
    </div>

    <div v-else-if="tenant">
      <div class="card mb-6">
        <div class="card-body">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-xl font-bold">{{ tenant.name }}</h3>
              <p class="text-slate-500">{{ tenant.slug }}</p>
            </div>
            <button v-if="!editing" class="btn btn-primary" @click="editing = true">Edit</button>
            <div v-else class="flex gap-2">
              <button class="btn btn-secondary" @click="editing = false">Cancel</button>
              <button class="btn btn-success" @click="saveChanges">Save</button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-group">
              <label class="form-label">Plan</label>
              <select v-model="tenant.plan" class="form-input" :disabled="!editing">
                <option value="basic">Basic</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Status</label>
              <div class="flex items-center gap-2 mt-2">
                <input v-model="tenant.isActive" type="checkbox" :disabled="!editing" />
                <span :class="['badge', tenant.isActive ? 'badge-success' : 'badge-danger']">
                  {{ tenant.isActive ? 'Active' : 'Inactive' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          v-for="card in statCards"
          :key="card.title"
          :title="card.title"
          :value="card.value"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="card">
          <div class="card-header">
            <h3 class="font-semibold">Sales by Day</h3>
          </div>
          <div class="card-body">
            <div v-if="salesByDay.length" class="bar-chart">
              <div
                v-for="day in salesByDay"
                :key="day.date"
                class="bar"
                :style="{ height: `${(day.revenue / maxDaySales) * 100}%` }"
                :title="`${day.date}: ${day.revenue}`"
              >
                <span class="absolute -top-5 left-1/2 -translate-x-1/2 text-xs text-slate-500">{{ day.revenue }}</span>
              </div>
            </div>
            <p v-else class="text-slate-400 text-center py-4">No sales data</p>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="font-semibold">Top Products</h3>
          </div>
          <div class="card-body">
            <div v-if="topProducts.length" class="flex flex-col gap-3">
              <div v-for="p in topProducts" :key="p.name" class="flex items-center justify-between p-3 rounded bg-slate-50">
                <div>
                  <p class="font-medium">{{ p.name }}</p>
                  <p class="text-xs text-slate-400">{{ p.quantity }} sales</p>
                </div>
                <span class="font-semibold">{{ formatCurrency(p.revenue) }}</span>
              </div>
            </div>
            <p v-else class="text-slate-400 text-center py-4">No product data</p>
          </div>
        </div>
      </div>

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
    </div>
  </div>
</template>
