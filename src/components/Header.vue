<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const userEmail = computed(() => authStore.user?.email || 'Super Admin')
</script>

<template>
  <header class="flex items-center justify-between h-16 px-6 bg-white border-b shadow">
    <div class="flex items-center">
      <h1 class="text-lg font-semibold text-slate-800">POSI Super Admin</h1>
    </div>
    <div class="flex items-center gap-3">
      <div class="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100">
        <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-semibold">
          {{ userEmail.charAt(0).toUpperCase() }}
        </div>
        <span class="text-sm text-slate-600">{{ userEmail }}</span>
      </div>
    </div>
  </header>
</template>
