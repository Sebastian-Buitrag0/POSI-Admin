<script setup lang="ts">
import { computed } from 'vue'
import StatCard from '@/components/StatCard.vue'
import type { TenantStats } from '@/types'

interface Props {
  stats: TenantStats | null
}

const props = defineProps<Props>()

const cards = computed(() => {
  const s = props.stats
  return [
    { title: 'Total Users', value: s?.totalUsers ?? 0 },
    { title: 'Total Products', value: s?.totalProducts ?? 0 },
    { title: 'Total Sales', value: s?.totalSales ?? 0 },
    { title: 'Revenue', value: formatCurrency(s?.totalRevenue) },
  ]
})

function formatCurrency(val: number | undefined | null) {
  if (val == null) return '$0'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val)
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    <StatCard
      v-for="card in cards"
      :key="card.title"
      :title="card.title"
      :value="card.value"
    />
  </div>
</template>
