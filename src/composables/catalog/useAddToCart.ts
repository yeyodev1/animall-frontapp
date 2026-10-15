import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'
import { site } from '@/config/site'
import type { Product, Variant } from '@/types'

export function useAddToCart() {
  const cart = useCartStore()
  const toast = useToastStore()

  /**
   * `notify` muestra el toast. La tarjeta no lo usa (su botón ya cambia a
   * "Agregado") y tampoco cuando se abre el carrito: el toast taparía su botón.
   */
  function add(product: Product, variant: Variant | undefined, qty = 1, notify = false) {
    if (!variant) return false
    cart.add(product, variant, qty)
    if (notify) toast.success(`${site.catalog.added}: ${product.name} (${variant.size})`)
    return true
  }

  return { add }
}
