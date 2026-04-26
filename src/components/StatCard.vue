<script setup lang="ts">
defineProps<{
  title: string
  value: string | number
  subtitle?: string
  icon?: string
  color?: string
}>()
</script>

<template>
  <div class="card p-5">
    <div class="flex items-start gap-3">
      <div
        v-if="icon"
        class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        :style="{ background: (color || '#3B82F6') + '20' }"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" :style="{ color: color || '#3B82F6' }">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="icon" />
        </svg>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">{{ title }}</p>
        <p class="text-2xl font-bold text-slate-800 truncate">{{ value }}</p>
        <p v-if="subtitle" class="text-xs text-slate-400 mt-1">{{ subtitle }}</p>
      </div>
    </div>
  </div>
</template>
