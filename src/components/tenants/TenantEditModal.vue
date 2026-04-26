<script setup lang="ts">
import { ref, watch } from 'vue'
import type { TenantSummary } from '@/types'

const props = defineProps<{
  visible: boolean
  tenant: TenantSummary | null
}>()

const emit = defineEmits<{
  submit: [formData: { id: string; plan: string; isActive: boolean }]
  cancel: []
}>()

const form = ref({ plan: 'basic', isActive: true })

watch(() => props.visible, (visible) => {
  if (visible && props.tenant) {
    form.value = { plan: props.tenant.plan, isActive: props.tenant.isActive }
  }
})

function handleSubmit() {
  if (!props.tenant) return
  emit('submit', { id: props.tenant.id, ...form.value })
}
</script>

<template>
  <div v-if="visible" class="modal-overlay" @click.self="emit('cancel')">
    <div class="modal" style="max-width: 420px;">
      <div class="modal-header">
        <h3 class="font-semibold">Edit Tenant</h3>
        <button class="text-slate-400 hover:text-slate-600" @click="emit('cancel')">&times;</button>
      </div>
      <div class="modal-body">
        <p class="text-sm text-slate-500 mb-4">{{ tenant?.name }}</p>
        <div class="form-group">
          <label class="form-label">Plan</label>
          <select v-model="form.plan" class="form-input">
            <option value="basic">Basic</option>
            <option value="pro">Pro</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>
        <div class="form-group">
          <label class="flex items-center gap-2 cursor-pointer">
            <input v-model="form.isActive" type="checkbox" />
            <span class="text-sm">Active</span>
          </label>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="emit('cancel')">Cancel</button>
        <button class="btn btn-primary" @click="handleSubmit">Save</button>
      </div>
    </div>
  </div>
</template>
