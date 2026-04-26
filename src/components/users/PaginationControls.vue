<script setup lang="ts">
interface Props {
  page: number
  hasMore: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  prev: []
  next: []
}>()
</script>

<template>
  <div class="flex items-center justify-between p-4 border-t">
    <button
      class="btn btn-secondary"
      :disabled="page <= 1"
      @click="emit('prev')"
    >
      &larr; Previous
    </button>
    <span class="text-sm text-slate-500">Page {{ page }}</span>
    <button
      class="btn btn-secondary"
      :disabled="!hasMore"
      @click="emit('next')"
    >
      Next &rarr;
    </button>
  </div>
</template>
