<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useNotificationStore } from '@/stores/notifications'

const store = useNotificationStore()
const { toasts } = storeToRefs(store)

function toastConfig(type: string) {
  switch (type) {
    case 'success': return { bg: 'bg-emerald-600', icon: 'M5 13l4 4L19 7' }
    case 'error':   return { bg: 'bg-red-600',     icon: 'M6 18L18 6M6 6l12 12' }
    default:        return { bg: 'bg-slate-700',   icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
  }
}
</script>

<template>
  <div class="fixed top-4 right-4 z-50 flex flex-col gap-2" style="max-width:22rem">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :class="['flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white', toastConfig(toast.type).bg]"
    >
      <svg class="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" :d="toastConfig(toast.type).icon" />
      </svg>
      <span class="flex-1">{{ toast.message }}</span>
      <button class="opacity-70 hover:opacity-100 flex-shrink-0" @click="store.dismiss(toast.id)">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>
