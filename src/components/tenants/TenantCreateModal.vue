<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{ visible: boolean }>()

const emit = defineEmits<{
  submit: [data: { name: string; adminEmail: string; adminFirstName: string; adminLastName: string; adminPassword: string }]
  cancel: []
}>()

const form = ref({
  name: '',
  adminEmail: '',
  adminFirstName: '',
  adminLastName: '',
  adminPassword: '',
})

function reset() {
  form.value = { name: '', adminEmail: '', adminFirstName: '', adminLastName: '', adminPassword: '' }
}

watch(() => props.visible, (v) => { if (v) reset() })
</script>

<template>
  <div v-if="visible" class="modal-overlay" @click.self="emit('cancel')">
    <div class="modal" style="max-width: 480px;">
      <div class="modal-header">
        <h3 class="font-semibold">Create Tenant</h3>
        <button class="text-slate-400 hover:text-slate-600" @click="emit('cancel')">&times;</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Business Name</label>
          <input v-model="form.name" class="form-input" placeholder="Acme Corp" required />
        </div>
        <div class="form-group">
          <label class="form-label">Admin Email</label>
          <input v-model="form.adminEmail" type="email" class="form-input" placeholder="admin@acme.com" required />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div class="form-group">
            <label class="form-label">Admin First Name</label>
            <input v-model="form.adminFirstName" class="form-input" required />
          </div>
          <div class="form-group">
            <label class="form-label">Admin Last Name</label>
            <input v-model="form.adminLastName" class="form-input" required />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Admin Password</label>
          <input v-model="form.adminPassword" type="password" class="form-input" placeholder="Min 6 characters" minlength="6" required />
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="emit('cancel')">Cancel</button>
        <button class="btn btn-primary" @click="emit('submit', form)">Create</button>
      </div>
    </div>
  </div>
</template>
