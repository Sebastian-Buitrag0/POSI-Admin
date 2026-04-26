<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'

defineEmits<{ toggleSidebar: [] }>()

const authStore = useAuthStore()
const user = computed(() => authStore.user)
const displayName = computed(() => {
  if (user.value?.firstName) return `${user.value.firstName} ${user.value.lastName || ''}`.trim()
  return user.value?.email || 'Super Admin'
})
const initials = computed(() => {
  if (user.value?.firstName) {
    return `${user.value.firstName[0]}${user.value.lastName?.[0] || ''}`.toUpperCase()
  }
  return (user.value?.email?.[0] || 'S').toUpperCase()
})
</script>

<template>
  <header class="flex items-center justify-between h-16 px-4 md:px-6 bg-white border-b shadow-sm flex-shrink-0">
    <div class="flex items-center gap-3">
      <!-- Botón hamburguesa mobile -->
      <button
        class="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600"
        @click="$emit('toggleSidebar')"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <h1 class="text-base font-semibold text-slate-800 hidden md:block">Panel de Administración</h1>
    </div>

    <div class="flex items-center gap-3">
      <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100">
        <div class="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
          {{ initials }}
        </div>
        <span class="text-sm text-slate-700 font-medium hidden sm:block">{{ displayName }}</span>
      </div>
    </div>
  </header>
</template>
