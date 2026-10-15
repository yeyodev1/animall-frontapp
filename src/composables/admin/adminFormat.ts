import type { Order, Product } from '@/types'
import { formatCents, formatDate } from '@/utils/format'
import { site } from '@/config/site'
import { adminCopy } from '@/components/admin/adminCopy'

/**
 * El personal escribe "43,78", "43.78" o "1.043,78": se toma el último
 * separador como decimal y el resto se descarta. Devuelve centavos o null.
 */
export function dollarsToCents(input: string): number | null {
  const raw = String(input ?? '').trim().replace(/[\s$]/g, '')
  if (!raw) return null
  const lastSep = Math.max(raw.lastIndexOf(','), raw.lastIndexOf('.'))
  let normalized = raw
  if (lastSep !== -1) {
    const whole = raw.slice(0, lastSep).replace(/[.,]/g, '')
    normalized = `${whole || '0'}.${raw.slice(lastSep + 1)}`
  }
  const value = Number(normalized)
  if (!Number.isFinite(value) || value < 0) return null
  return Math.round(value * 100)
}

export function centsToDollars(cents: number): string {
  return (cents / 100).toFixed(2).replace('.', ',')
}

/** Precio más bajo del producto, para la columna "desde". */
export function minPrice(product: Product): number | null {
  if (!product.variants?.length) return null
  return Math.min(...product.variants.map((v) => v.pvc))
}

/** wa.me exige el número internacional: 0984… → 593984… */
export function toWhatsappNumber(phone: string): string {
  const digits = String(phone ?? '').replace(/\D/g, '')
  if (digits.startsWith('0')) return `593${digits.slice(1)}`
  return digits
}

export function customerWhatsapp(order: Order): string {
  const number = toWhatsappNumber(order.customer.phone)
  const text = adminCopy.orders.greeting(order.customer.name.split(' ')[0] || '', order.code)
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`
}

export function storeName(key: string): string {
  return adminCopy.orders.stores[key] ?? key
}

export function statusLabel(status: string): string {
  return site.labels.orderStatus[status] ?? status
}

/** Texto plano del pedido para pegarlo en WhatsApp o en una nota. */
export function orderAsText(order: Order): string {
  const c = adminCopy.orders
  const lines = [
    `${order.code} · ${formatDate(order.createdAt)}`,
    `${order.customer.name} · ${order.customer.phone}`,
    `${c.wroteTo}: ${storeName(order.store)}`,
    '',
    ...order.items.map(
      (i) => `${i.qty} x ${i.name} (${i.size}) — ${formatCents(i.pvc * i.qty)}${i.promo ? ` · ${i.promo}` : ''}`,
    ),
    '',
    `${c.total}: ${formatCents(order.total)}`,
  ]
  if (order.customer.note) lines.push(`${c.note}: ${order.customer.note}`)
  return lines.join('\n')
}

/** Miniatura liviana si la foto vive en Cloudinary; si no, la URL tal cual. */
export function thumbUrl(url: string | undefined, width = 160): string {
  if (!url) return ''
  return url.includes('/upload/') ? url.replace('/upload/', `/upload/f_auto,q_auto,c_pad,b_white,w_${width},h_${width}/`) : url
}
