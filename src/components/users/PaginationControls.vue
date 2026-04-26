<script setup lang="ts">
defineProps<{ page: number; hasMore: boolean }>()
const emit = defineEmits<{ prev: []; next: [] }>()
</script>

<template>
  <div class="flex items-center justify-between p-4 border-t">
    <button class="btn btn-secondary" :disabled="page <= 1" @click="emit('prev')">
      <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Anterior
    </button>
    <span class="text-sm text-slate-500">Página {{ page }}</span>
    <button class="btn btn-secondary" :disabled="!hasMore" @click="emit('next')">
      Siguiente
      <svg class="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</template>
