import { computed, ref, watch, type ComputedRef } from 'vue'
import { productService } from '@/services/product.service'
import type { ApiError, Product, ProductQuery } from '@/types'

const PAGE_SIZE = 24

/**
 * Última lista cargada, a nivel de módulo: al volver desde una ficha con
 * "atrás" se recuperan las páginas ya vistas y el scroll guardado sigue
 * teniendo sentido.
 */
let cache: { key: string; items: Product[]; page: number; pages: number; total: number } | null = null

export function useCatalogProducts(query: ComputedRef<ProductQuery>, key: ComputedRef<string>) {
  const items = ref<Product[]>([])
  const total = ref(0)
  const page = ref(1)
  const pages = ref(1)
  const loading = ref(false)
  const loadingMore = ref(false)
  const error = ref('')
  let request = 0

  const hasMore = computed(() => page.value < pages.value)

  function save() {
    cache = { key: key.value, items: items.value, page: page.value, pages: pages.value, total: total.value }
  }

  async function fetchFirst() {
    if (cache && cache.key === key.value) {
      items.value = cache.items
      page.value = cache.page
      pages.value = cache.pages
      total.value = cache.total
      return
    }
    const id = ++request
    loading.value = true
    error.value = ''
    try {
      const data = await productService.list({ ...query.value, page: 1, limit: PAGE_SIZE })
      if (id !== request) return
      items.value = data.items
      total.value = data.total
      page.value = data.page
      pages.value = data.pages
      save()
    } catch (e) {
      if (id === request) error.value = (e as ApiError).message || 'Error'
    } finally {
      if (id === request) loading.value = false
    }
  }

  async function loadMore() {
    if (!hasMore.value || loading.value || loadingMore.value) return
    const id = request
    loadingMore.value = true
    try {
      const data = await productService.list({ ...query.value, page: page.value + 1, limit: PAGE_SIZE })
      if (id !== request) return
      // Un producto puede repetirse entre páginas si el orden empata: se filtra.
      const seen = new Set(items.value.map((p) => p._id))
      items.value = [...items.value, ...data.items.filter((p) => !seen.has(p._id))]
      page.value = data.page
      pages.value = data.pages
      total.value = data.total
      save()
    } catch (e) {
      error.value = (e as ApiError).message || 'Error'
    } finally {
      loadingMore.value = false
    }
  }

  watch(key, fetchFirst, { immediate: true })

  function retry() {
    cache = null
    fetchFirst()
  }

  return { items, total, loading, loadingMore, error, hasMore, loadMore, retry }
}
