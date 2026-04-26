<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  error.value = ''
  loading.value = true
  const result = await authStore.login(email.value, password.value)
  loading.value = false
  if (!result.success) {
    error.value = result.message || 'Login failed'
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-slate-900">
    <div class="w-full max-w-md p-8 rounded-xl bg-white shadow-lg">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-slate-800">POSI Super Admin</h1>
        <p class="text-sm text-slate-500 mt-1">Sign in to your account</p>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label class="form-label">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="form-input"
            placeholder="admin@posi.com"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Password</label>
          <input
            v-model="password"
            type="password"
            required
            class="form-input"
            placeholder="••••••••"
          />
        </div>

        <div v-if="error" class="mb-4 p-3 rounded bg-danger text-white text-sm">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="btn btn-primary w-full"
        >
          <span v-if="loading" class="spinner mr-2" />
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>
    </div>
  </div>
</template>
