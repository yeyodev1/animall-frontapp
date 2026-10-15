import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import { adminCopy } from '@/components/admin/adminCopy'
import { orderAsText, statusLabel } from './adminFormat'
import { useAdminStats } from './useAdminStats'
import type { ApiError, Order, OrderStatus } from '@/types'

export const ORDER_STATUSES: OrderStatus[] = ['nueva', 'confirmada', 'entregada', 'cancelada']

function readStatus(value: unknown): OrderStatus | '' {
  return ORDER_STATUSES.includes(value as OrderStatus) ? (value as OrderStatus) : ''
}

export function useAdminOrders() {
  const route = useRoute()
  const router = useRouter()
  const toast = useToastStore()
  const { stats, refresh: refreshStats } = useAdminStats()
  const copy = adminCopy.orders

  const status = ref<OrderStatus | ''>(readStatus(route.query.estado))
  const page = ref(1)
  const pages = ref(1)
  const items = ref<Order[]>([])
  const loading = ref(true)
  const error = ref('')
  const expanded = ref<string | null>(typeof route.query.open === 'string' ? route.query.open : null)
  const updating = reactive<Record<string, boolean>>({})

  const tabs = computed(() => {
    const counts = stats.value?.orders ?? {}
    const all = ORDER_STATUSES.reduce((sum, s) => sum + (counts[s] ?? 0), 0)
    return [
      { value: '' as const, label: copy.all, count: all },
      ...ORDER_STATUSES.map((s) => ({ value: s, label: statusLabel(s), count: counts[s] ?? 0 })),
    ]
  })

  let requestId = 0
  async function load() {
    const id = ++requestId
    loading.value = true
    error.value = ''
    try {
      const data = await adminService.orders(status.value, page.value)
      if (id !== requestId) return
      items.value = data.items
      pages.value = data.pages
    } catch (e) {
      if (id === requestId) error.value = (e as ApiError).message
    } finally {
      if (id === requestId) loading.value = false
    }
  }

  watch(status, (value) => {
    page.value = 1
    router.replace({ query: value ? { estado: value } : {} })
    load()
  })

  function goTo(p: number) {
    page.value = p
    load()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function toggleExpanded(id: string) {
    expanded.value = expanded.value === id ? null : id
  }

  async function setStatus(order: Order, next: OrderStatus) {
    if (updating[order._id] || order.status === next) return
    updating[order._id] = true
    try {
      const updated = await adminService.setOrderStatus(order._id, next)
      order.status = updated.status
      toast.success(copy.statusChanged[updated.status] ?? statusLabel(updated.status))
      refreshStats()
      // En una pestaña filtrada el pedido ya no pertenece a la lista.
      if (status.value && status.value !== updated.status) {
        items.value = items.value.filter((o) => o._id !== order._id)
      }
    } catch (e) {
      toast.error((e as ApiError).message)
    } finally {
      updating[order._id] = false
    }
  }

  async function copyOrder(order: Order) {
    try {
      await navigator.clipboard.writeText(orderAsText(order))
      toast.success(copy.copied)
    } catch {
      toast.error(copy.copyFailed)
    }
  }

  onMounted(() => {
    load()
    refreshStats()
  })

  return { status, tabs, page, pages, items, loading, error, expanded, updating, load, goTo, toggleExpanded, setStatus, copyOrder }
}
