<script setup lang="ts">
defineProps<{
  title: string
  value: string | number
  subtitle?: string
}>()
</script>

<template>
  <div class="card p-6">
    <p class="text-sm text-slate-500 mb-1">{{ title }}</p>
    <p class="text-2xl font-bold text-slate-800">{{ value }}</p>
    <p v-if="subtitle" class="text-xs text-slate-400 mt-1">{{ subtitle }}</p>
  </div>
</template>
