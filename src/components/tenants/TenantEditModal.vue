<script setup lang="ts">
import { ref, watch } from 'vue'
import type { TenantSummary } from '@/types'

const props = defineProps<{ visible: boolean; tenant: TenantSummary | null }>()

const emit = defineEmits<{
  submit: [formData: { id: string; plan: string; isActive: boolean }]
  cancel: []
}>()

const form = ref({ plan: 'basic', isActive: true })
const loading = ref(false)

watch(() => props.visible, (visible) => {
  if (visible && props.tenant) {
    form.value = { plan: props.tenant.plan, isActive: props.tenant.isActive }
  }
  if (!visible) loading.value = false
})

function handleSubmit() {
  if (!props.tenant) return
  loading.value = true
  emit('submit', { id: props.tenant.id, ...form.value })
}
</script>

<template>
  <div v-if="visible" class="modal-overlay" @click.self="emit('cancel')">
    <div class="modal" style="max-width: 420px">
      <div class="modal-header">
        <div>
          <h3 class="font-semibold text-slate-800">Editar Tenant</h3>
          <p class="text-sm text-slate-500 mt-0.5">{{ tenant?.name }}</p>
        </div>
        <button class="text-slate-400 hover:text-slate-600 text-xl leading-none" @click="emit('cancel')">&times;</button>
      </div>
      <div class="modal-body">
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
            <span class="text-sm font-medium">Tenant activo</span>
          </label>
          <p class="text-xs text-slate-400 mt-1 ml-5">Desactivar impedirá el acceso a los usuarios del tenant</p>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" :disabled="loading" @click="emit('cancel')">Cancelar</button>
        <button class="btn btn-primary" :disabled="loading" @click="handleSubmit">
          <span v-if="loading" class="spinner mr-1.5" style="width:.9rem;height:.9rem;border-width:2px" />
          {{ loading ? 'Guardando...' : 'Guardar cambios' }}
        </button>
      </div>
    </div>
  </div>
</template>
