import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import { adminCopy } from '@/components/admin/adminCopy'
import { useAdminStats } from './useAdminStats'
import type { ApiError, Product, ProductQuery } from '@/types'

export type Visibility = '' | 'published' | 'hidden'
type ToggleField = 'isPublished' | 'isFeatured'

const PAGE_SIZE = 24
// El API admin no filtra por visibilidad: con ese filtro se trae la página más
// grande que permite y se filtra acá. Ver reporte: falta `published` en el back.
const WIDE_PAGE = 96

export function useAdminProducts() {
  const toast = useToastStore()
  const { refresh: refreshStats } = useAdminStats()

  const filters = reactive({ search: '', species: '', type: '', visibility: '' as Visibility })
  const page = ref(1)
  const items = ref<Product[]>([])
  const total = ref(0)
  const pages = ref(1)
  const loading = ref(true)
  const error = ref('')
  const busy = reactive<Record<string, boolean>>({})

  const hasFilters = computed(() => Boolean(filters.search || filters.species || filters.type || filters.visibility))

  const visible = computed(() => {
    if (filters.visibility === 'published') return items.value.filter((p) => p.isPublished)
    if (filters.visibility === 'hidden') return items.value.filter((p) => !p.isPublished)
    return items.value
  })

  let requestId = 0
  async function load() {
    const id = ++requestId
    loading.value = true
    error.value = ''
    const query: ProductQuery = {
      search: filters.search.trim() || undefined,
      species: filters.species || undefined,
      type: filters.type || undefined,
      sort: 'nombre',
      page: page.value,
      limit: filters.visibility ? WIDE_PAGE : PAGE_SIZE,
    }
    try {
      const data = await adminService.products(query)
      // Una respuesta vieja que llega tarde no pisa a la búsqueda actual.
      if (id !== requestId) return
      items.value = data.items
      total.value = data.total
      pages.value = data.pages
    } catch (e) {
      if (id === requestId) error.value = (e as ApiError).message
    } finally {
      if (id === requestId) loading.value = false
    }
  }

  let debounce: ReturnType<typeof setTimeout> | undefined
  watch(
    () => filters.search,
    () => {
      clearTimeout(debounce)
      debounce = setTimeout(() => {
        page.value = 1
        load()
      }, 320)
    },
  )
  watch(
    () => [filters.species, filters.type, filters.visibility],
    () => {
      page.value = 1
      load()
    },
  )

  function goTo(p: number) {
    page.value = p
    load()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function clearFilters() {
    Object.assign(filters, { search: '', species: '', type: '', visibility: '' })
  }

  /** Cambia el switch al instante; si el API falla, lo devuelve como estaba. */
  async function toggle(product: Product, field: ToggleField) {
    const key = `${product._id}:${field}`
    if (busy[key]) return
    const previous = product[field]
    product[field] = !previous
    busy[key] = true
    try {
      const updated = await adminService.updateProduct(product._id, { [field]: !previous })
      product[field] = updated[field]
      if (field === 'isPublished') refreshStats()
    } catch (e) {
      product[field] = previous
      toast.error((e as ApiError).message)
    } finally {
      busy[key] = false
    }
  }

  async function remove(product: Product): Promise<boolean> {
    try {
      await adminService.deleteProduct(product._id)
      items.value = items.value.filter((p) => p._id !== product._id)
      total.value = Math.max(0, total.value - 1)
      toast.success(adminCopy.products.deleted)
      refreshStats()
      return true
    } catch (e) {
      toast.error((e as ApiError).message)
      return false
    }
  }

  /** Lo que devuelve el editor reemplaza la fila, o entra arriba si es nuevo. */
  function upsert(product: Product) {
    const index = items.value.findIndex((p) => p._id === product._id)
    if (index === -1) {
      items.value = [product, ...items.value]
      total.value += 1
    } else {
      items.value.splice(index, 1, product)
    }
    refreshStats()
  }

  onMounted(load)
  onUnmounted(() => clearTimeout(debounce))

  return { filters, page, pages, total, items: visible, loading, error, busy, hasFilters, load, goTo, clearFilters, toggle, remove, upsert }
}
