<script setup lang="ts">
import type { TopProductGlobal } from '@/types'

interface Props {
  products: TopProductGlobal[]
}

defineProps<Props>()

function formatCurrency(val: number | undefined | null) {
  if (val == null) return '$0'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val)
}
</script>

<template>
  <div class="card">
    <div class="card-header">
      <h3 class="font-semibold">Top Products</h3>
    </div>
    <div class="card-body">
      <div v-if="products.length" class="flex flex-col gap-3">
        <div v-for="p in products" :key="p.name" class="flex items-center justify-between p-3 rounded bg-slate-50">
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
</template>
