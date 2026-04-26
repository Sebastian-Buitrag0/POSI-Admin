<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useNotificationStore } from '@/stores/notifications'

const store = useNotificationStore()
const { toasts } = storeToRefs(store)

function toastClass(type: string) {
  switch (type) {
    case 'success': return 'bg-success text-white'
    case 'error': return 'bg-danger text-white'
    default: return 'bg-slate-700 text-white'
  }
}
</script>

<template>
  <div class="fixed top-4 right-4 z-50 flex flex-col gap-2">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :class="['px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all', toastClass(toast.type)]"
    >
      {{ toast.message }}
    </div>
  </div>
</template>
