import type { Product, Variant } from '@/types'

/**
 * Inserta transformaciones de Cloudinary tras `/upload/`. Los empaques vienen
 * en PNG transparente: f_auto entrega WebP/AVIF conservando la transparencia.
 */
export function productImage(url: string | undefined, width = 500): string {
  if (!url) return ''
  if (!url.includes('/upload/')) return url
  return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`)
}

/** Tonos pastel de los círculos: se eligen por slug para que no cambien al recargar. */
const TONES = ['mint', 'ball', 'sand', 'leaf', 'cream'] as const
export type Tone = (typeof TONES)[number]

export function toneFor(seed: string): Tone {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0
  return TONES[Math.abs(hash) % TONES.length] ?? 'mint'
}

export function savingOf(v: Variant | undefined): number {
  return v ? Math.max(0, v.pvp - v.pvc) : 0
}

export function savingPercent(v: Variant | undefined): number {
  if (!v || v.pvp <= 0) return 0
  return Math.round((savingOf(v) / v.pvp) * 100)
}

/** Presentación más barata: es la que se anuncia como "desde". */
export function cheapestVariant(product: Product): Variant | undefined {
  return [...(product.variants ?? [])].sort((a, b) => a.pvc - b.pvc)[0]
}

export function firstPromo(product: Product): string | null {
  return product.variants?.find((v) => v.promo)?.promo ?? null
}

export const speciesIcons: Record<string, string> = {
  perro: 'fa-dog',
  gato: 'fa-cat',
  ave: 'fa-dove',
  pez: 'fa-fish',
  roedor: 'fa-carrot',
  granja: 'fa-cow',
  general: 'fa-paw',
}

export const typeIcons: Record<string, string> = {
  'alimento-seco': 'fa-bowl-food',
  'alimento-humedo': 'fa-drumstick-bite',
  snack: 'fa-bone',
  farmacia: 'fa-kit-medical',
  higiene: 'fa-pump-soap',
  accesorio: 'fa-tag',
  otro: 'fa-shapes',
}
