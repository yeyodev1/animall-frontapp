import { ref } from 'vue'
import { productService } from '@/services/product.service'
import type { ProductFilters } from '@/types'

// Estado de módulo: las facetas cambian poco y se piden una vez por visita.
const filters = ref<ProductFilters | null>(null)
let pending: Promise<void> | null = null

export function useCatalogFilters() {
  function load() {
    if (filters.value || pending) return pending
    pending = productService
      .filters()
      .then((data) => {
        filters.value = data
      })
      .catch(() => {
        // Sin facetas el catálogo sigue funcionando con búsqueda y orden.
      })
      .finally(() => {
        pending = null
      })
    return pending
  }

  return { filters, load }
}
