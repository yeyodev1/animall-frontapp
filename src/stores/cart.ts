import { defineStore } from 'pinia'
import type { CartItem, Product, Variant } from '@/types'

const STORAGE_KEY = 'animall_cart'

function load(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CartItem[]) : []
  } catch {
    return []
  }
}

/**
 * Carrito local. Los precios guardados son solo para mostrar: el backend los
 * vuelve a leer de la base al crear el pedido.
 */
export const useCartStore = defineStore('cart', {
  state: () => ({
    items: load() as CartItem[],
    isOpen: false,
  }),

  getters: {
    count: (s) => s.items.reduce((n, i) => n + i.qty, 0),
    total: (s) => s.items.reduce((n, i) => n + i.pvc * i.qty, 0),
    totalPvp: (s) => s.items.reduce((n, i) => n + i.pvp * i.qty, 0),
    savings(): number {
      return Math.max(0, this.totalPvp - this.total)
    },
  },

  actions: {
    persist() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items))
      } catch {
        // Sin almacenamiento el carrito dura lo que la pestaña.
      }
    },

    add(product: Product, variant: Variant, qty = 1) {
      const found = this.items.find((i) => i.slug === product.slug && i.size === variant.size)
      if (found) {
        found.qty = Math.min(99, found.qty + qty)
      } else {
        this.items.push({
          slug: product.slug,
          name: product.name,
          image: product.image?.url ?? '',
          size: variant.size,
          pvp: variant.pvp,
          pvc: variant.pvc,
          promo: variant.promo,
          qty,
        })
      }
      this.persist()
    },

    setQty(slug: string, size: string, qty: number) {
      const item = this.items.find((i) => i.slug === slug && i.size === size)
      if (!item) return
      if (qty <= 0) {
        this.remove(slug, size)
        return
      }
      item.qty = Math.min(99, qty)
      this.persist()
    },

    remove(slug: string, size: string) {
      this.items = this.items.filter((i) => !(i.slug === slug && i.size === size))
      this.persist()
    },

    clear() {
      this.items = []
      this.persist()
    },

    open() {
      this.isOpen = true
    },

    close() {
      this.isOpen = false
    },
  },
})
