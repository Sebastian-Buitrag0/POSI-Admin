<script setup lang="ts">
import type { TenantDetail } from '@/types'

interface Props {
  tenant: TenantDetail | null
  editing: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  edit: []
  cancel: []
  save: []
}>()
</script>

<template>
  <div v-if="tenant" class="card mb-6">
    <div class="card-body">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-xl font-bold">{{ tenant.name }}</h3>
          <p class="text-slate-500">{{ tenant.slug }}</p>
        </div>
        <div v-if="!editing">
          <button class="btn btn-primary" @click="emit('edit')">Edit</button>
        </div>
        <div v-else class="flex gap-2">
          <button class="btn btn-secondary" @click="emit('cancel')">Cancel</button>
          <button class="btn btn-success" @click="emit('save')">Save</button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="form-group">
          <label class="form-label">Plan</label>
          <select v-model="tenant.plan" class="form-input" :disabled="!editing">
            <option value="basic">Basic</option>
            <option value="pro">Pro</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Status</label>
          <div class="flex items-center gap-2 mt-2">
            <input v-model="tenant.isActive" type="checkbox" :disabled="!editing" />
            <span :class="['badge', tenant.isActive ? 'badge-success' : 'badge-danger']">
              {{ tenant.isActive ? 'Active' : 'Inactive' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
