import { onMounted, ref } from 'vue'
import { adminService } from '@/services/admin.service'
import { useAdminStats } from './useAdminStats'
import type { ApiError, Order } from '@/types'

export function useDashboard() {
  const { stats, loading: statsLoading, error: statsError, refresh } = useAdminStats()
  const recent = ref<Order[]>([])
  const recentLoading = ref(true)
  const recentError = ref('')

  async function loadRecent() {
    recentLoading.value = true
    recentError.value = ''
    try {
      // El API ordena del más nuevo al más viejo: la primera página alcanza.
      const page = await adminService.orders('', 1)
      recent.value = page.items.slice(0, 5)
    } catch (e) {
      recentError.value = (e as ApiError).message
    } finally {
      recentLoading.value = false
    }
  }

  function reload() {
    refresh()
    loadRecent()
  }

  onMounted(reload)

  return { stats, statsLoading, statsError, recent, recentLoading, recentError, reload }
}
