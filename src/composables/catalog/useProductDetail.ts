import { ref, watch, type Ref } from 'vue'
import { productService } from '@/services/product.service'
import { site } from '@/config/site'
import type { ApiError, Product } from '@/types'

export function useProductDetail(slug: Ref<string>) {
  const product = ref<Product | null>(null)
  const related = ref<Product[]>([])
  const loading = ref(true)
  const notFound = ref(false)
  const error = ref('')
  let request = 0

  async function load() {
    const id = ++request
    loading.value = true
    notFound.value = false
    error.value = ''
    try {
      const data = await productService.bySlug(slug.value)
      if (id !== request) return
      product.value = data.product
      related.value = data.related ?? []
      document.title = `${data.product.name} — ${site.name}`
    } catch (e) {
      if (id !== request) return
      product.value = null
      const err = e as ApiError
      if (err.status === 404) notFound.value = true
      else error.value = err.message || 'Error'
    } finally {
      if (id === request) loading.value = false
    }
  }

  watch(slug, load, { immediate: true })

  return { product, related, loading, notFound, error, reload: load }
}
