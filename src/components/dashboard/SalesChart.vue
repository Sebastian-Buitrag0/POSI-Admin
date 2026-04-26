<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  data: { label: string; value: number }[]
}

const props = defineProps<Props>()

const maxValue = computed(() => Math.max(...props.data.map((d) => d.value), 1))
</script>

<template>
  <div class="card">
    <div class="card-header">
      <h3 class="font-semibold text-slate-800">Sales Last 7 Days</h3>
    </div>
    <div class="card-body">
      <div class="bar-chart">
        <div
          v-for="bar in data"
          :key="bar.label"
          class="bar"
          :style="{ height: `${(bar.value / maxValue) * 100}%` }"
          :title="`${bar.label}: ${bar.value}`"
        >
          <span class="absolute -top-5 left-1/2 -translate-x-1/2 text-xs text-slate-500">{{ bar.value }}</span>
        </div>
      </div>
      <div class="flex justify-between mt-2">
        <span v-for="bar in data" :key="bar.label" class="text-xs text-slate-400 flex-1 text-center">
          {{ bar.label }}
        </span>
      </div>
    </div>
  </div>
</template>
