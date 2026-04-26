<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{ visible: boolean }>()

const emit = defineEmits<{
  submit: [data: { name: string; adminEmail: string; adminFirstName: string; adminLastName: string; adminPassword: string }]
  cancel: []
}>()

const form = ref({ name: '', adminEmail: '', adminFirstName: '', adminLastName: '', adminPassword: '' })
const loading = ref(false)

function reset() {
  form.value = { name: '', adminEmail: '', adminFirstName: '', adminLastName: '', adminPassword: '' }
  loading.value = false
}

watch(() => props.visible, (v) => { if (v) reset() })

async function handleSubmit() {
  loading.value = true
  emit('submit', { ...form.value })
  // loading se resetea al cerrar el modal
}
</script>

<template>
  <div v-if="visible" class="modal-overlay" @click.self="emit('cancel')">
    <div class="modal" style="max-width: 500px">
      <div class="modal-header">
        <h3 class="font-semibold text-slate-800">Crear Tenant</h3>
        <button class="text-slate-400 hover:text-slate-600 text-xl leading-none" @click="emit('cancel')">&times;</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Nombre del negocio <span class="text-danger">*</span></label>
          <input v-model="form.name" class="form-input" placeholder="Mi empresa S.A.S" required />
        </div>
        <div class="form-group">
          <label class="form-label">Correo del admin <span class="text-danger">*</span></label>
          <input v-model="form.adminEmail" type="email" class="form-input" placeholder="admin@miempresa.com" required />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div class="form-group">
            <label class="form-label">Nombre <span class="text-danger">*</span></label>
            <input v-model="form.adminFirstName" class="form-input" placeholder="Juan" required />
          </div>
          <div class="form-group">
            <label class="form-label">Apellido <span class="text-danger">*</span></label>
            <input v-model="form.adminLastName" class="form-input" placeholder="Pérez" required />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Contraseña del admin <span class="text-danger">*</span></label>
          <input v-model="form.adminPassword" type="password" class="form-input" placeholder="Mínimo 6 caracteres" minlength="6" required />
          <p class="text-xs text-slate-400 mt-1">El admin podrá cambiarla después de iniciar sesión</p>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" :disabled="loading" @click="emit('cancel')">Cancelar</button>
        <button class="btn btn-primary" :disabled="loading" @click="handleSubmit">
          <span v-if="loading" class="spinner mr-1.5" style="width:.9rem;height:.9rem;border-width:2px" />
          {{ loading ? 'Creando...' : 'Crear Tenant' }}
        </button>
      </div>
    </div>
  </div>
</template>
