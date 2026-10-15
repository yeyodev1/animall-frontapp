import { nextTick, onMounted, ref } from 'vue'
import { productService } from '@/services/product.service'
import type { Product } from '@/types'
import { ScrollTrigger } from './useMotion'

/**
 * Productos destacados del home. Si el API falla o no hay destacados, la
 * sección simplemente no se muestra: no es crítica para comprar.
 */
export function useFeatured() {
  const products = ref<Product[]>([])
  const loading = ref(true)

  onMounted(async () => {
    try {
      products.value = await productService.featured()
    } catch {
      products.value = []
    } finally {
      loading.value = false
      // La sección cambia de alto: los ScrollTrigger de abajo deben recalcular.
      await nextTick()
      ScrollTrigger.refresh()
    }
  })

  return { products, loading }
}
