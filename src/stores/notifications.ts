import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

export const useNotificationStore = defineStore('notifications', () => {
  const toasts = ref<Toast[]>([])
  let nextId = 0

  function add(message: string, type: Toast['type'] = 'info') {
    const id = nextId++
    toasts.value.push({ id, message, type })
    setTimeout(() => remove(id), 4000)
  }

  function remove(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  function success(message: string) { add(message, 'success') }
  function error(message: string) { add(message, 'error') }
  function info(message: string) { add(message, 'info') }

  function confirm(message: string): Promise<boolean> {
    return new Promise((resolve) => {
      const confirmed = window.confirm(message)
      resolve(confirmed)
    })
  }

  const dismiss = remove

  return { toasts, add, remove, dismiss, success, error, info, confirm }
})
