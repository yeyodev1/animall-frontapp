import { computed, ref, watch, type Ref } from 'vue'
import type { Product } from '@/types'
import { savingOf, savingPercent } from './productMedia'

/** Presentación elegida (por defecto la primera) y cifras derivadas. */
export function useVariantPicker(product: Ref<Product | null | undefined>) {
  const index = ref(0)

  watch(
    () => product.value?.slug,
    () => (index.value = 0),
  )

  const variants = computed(() => product.value?.variants ?? [])
  const variant = computed(() => variants.value[index.value] ?? variants.value[0])
  const saving = computed(() => savingOf(variant.value))
  const percent = computed(() => savingPercent(variant.value))

  return { index, variants, variant, saving, percent, select: (i: number) => (index.value = i) }
}
