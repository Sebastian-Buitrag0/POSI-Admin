<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from './stores/auth'
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'
import LoginView from './views/LoginView.vue'
import ToastContainer from './components/ToastContainer.vue'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isLoggedIn)
const sidebarOpen = ref(false)
</script>

<template>
  <div>
    <ToastContainer />
    <div v-if="isAuthenticated" class="flex h-screen bg-slate-50">
      <!-- Overlay mobile -->
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 z-30 bg-black-50 md:hidden"
        @click="sidebarOpen = false"
      />
      <Sidebar :open="sidebarOpen" @close="sidebarOpen = false" />
      <div class="flex flex-col flex-1 overflow-hidden">
        <Header @toggle-sidebar="sidebarOpen = !sidebarOpen" />
        <main class="flex-1 overflow-auto p-6">
          <router-view />
        </main>
      </div>
    </div>
    <LoginView v-else />
  </div>
</template>
