<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  data: { label: string; value: number }[]
}

const props = defineProps<Props>()
const maxValue = computed(() => Math.max(...props.data.map((d) => d.value), 1))

function formatShort(val: number) {
  if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`
  return `$${val}`
}
</script>

<template>
  <div class="card">
    <div class="card-header">
      <h3 class="font-semibold text-slate-800">Ventas últimos 7 días</h3>
    </div>
    <div class="card-body">
      <div v-if="data.length && data.some(d => d.value > 0)">
        <div class="bar-chart" style="height:9rem">
          <div
            v-for="bar in data"
            :key="bar.label"
            class="bar relative"
            :style="{ height: `${(bar.value / maxValue) * 100}%` }"
            :title="`${bar.label}: ${formatShort(bar.value)}`"
          >
            <span
              v-if="bar.value > 0"
              class="absolute -top-5 left-1/2 -translate-x-1/2 text-xs text-slate-500 whitespace-nowrap"
            >
              {{ formatShort(bar.value) }}
            </span>
          </div>
        </div>
        <div class="flex justify-between mt-2">
          <span v-for="bar in data" :key="bar.label" class="text-xs text-slate-400 flex-1 text-center truncate">
            {{ bar.label }}
          </span>
        </div>
      </div>
      <div v-else class="flex flex-col items-center justify-center py-8 text-slate-400 gap-2">
        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <span class="text-sm">Sin ventas en los últimos 7 días</span>
      </div>
    </div>
  </div>
</template>
