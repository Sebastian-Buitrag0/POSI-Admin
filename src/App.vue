<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from './stores/auth'
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'
import LoginView from './views/LoginView.vue'
import ToastContainer from './components/ToastContainer.vue'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isLoggedIn)
</script>

<template>
  <div>
    <ToastContainer />
    <div v-if="isAuthenticated" class="flex h-screen bg-slate-50">
      <Sidebar />
      <div class="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main class="flex-1 overflow-auto p-6">
          <router-view />
        </main>
      </div>
    </div>
    <LoginView v-else />
  </div>
</template>
