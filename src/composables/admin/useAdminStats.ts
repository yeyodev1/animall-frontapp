import { computed, ref } from 'vue'
import { adminService } from '@/services/admin.service'
import type { AdminStats, ApiError } from '@/types'

// Estado de módulo: el marco (insignia de pedidos nuevos), el panel y la
// vista de pedidos leen las mismas cifras sin pedirlas tres veces.
const stats = ref<AdminStats | null>(null)
const loading = ref(false)
const error = ref('')
let inflight: Promise<void> | null = null

async function refresh() {
  if (inflight) return inflight
  loading.value = true
  error.value = ''
  inflight = adminService
    .stats()
    .then((data) => {
      stats.value = data
    })
    .catch((e: ApiError) => {
      error.value = e.message
    })
    .finally(() => {
      loading.value = false
      inflight = null
    })
  return inflight
}

export function useAdminStats() {
  const newOrders = computed(() => stats.value?.orders.nueva ?? 0)
  return { stats, loading, error, newOrders, refresh }
}
