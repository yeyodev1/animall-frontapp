import { computed, onUnmounted, reactive, ref } from 'vue'
import { adminService } from '@/services/admin.service'
import { productService } from '@/services/product.service'
import { useToastStore } from '@/stores/toast'
import { adminCopy } from '@/components/admin/adminCopy'
import { centsToDollars, dollarsToCents } from './adminFormat'
import type { ApiError, CatalogKey, Product, ProductType, Species } from '@/types'

/** En el formulario los precios son texto en dólares; se pasan a centavos al guardar. */
export interface VariantRow {
  key: number
  size: string
  pvp: string
  pvc: string
  promo: string
}

const MAX_IMAGE = 10 * 1024 * 1024
let rowKey = 0

function emptyRow(): VariantRow {
  return { key: ++rowKey, size: '', pvp: '', pvc: '', promo: '' }
}

// Sugerencias de marca y categoría: se piden una vez por carga.
const suggestions = reactive({ brands: [] as string[], categories: [] as string[], loaded: false })

async function loadSuggestions() {
  if (suggestions.loaded) return
  suggestions.loaded = true
  try {
    const f = await productService.filters()
    suggestions.brands = f.brands.map((b) => b.label || b.value)
    suggestions.categories = f.categories.map((c) => c.label || c.value)
  } catch {
    suggestions.loaded = false
  }
}

export function useProductForm() {
  const toast = useToastStore()
  const copy = adminCopy.editor

  const productId = ref<string | null>(null)
  const form = reactive({
    name: '',
    brand: '',
    manufacturer: '',
    category: '',
    species: 'perro' as Species,
    type: 'alimento-seco' as ProductType,
    catalogs: ['general'] as CatalogKey[],
    isPublished: true,
    isFeatured: false,
    sortIndex: 0,
  })
  const variants = ref<VariantRow[]>([emptyRow()])
  const currentImage = ref('')
  const pendingFile = ref<File | null>(null)
  const previewUrl = ref('')
  const saving = ref(false)
  const error = ref('')

  const isNew = computed(() => !productId.value)

  function reset(product: Product | null) {
    productId.value = product?._id ?? null
    Object.assign(form, {
      name: product?.name ?? '',
      brand: product?.brand ?? '',
      manufacturer: product?.manufacturer ?? '',
      category: product?.category ?? '',
      species: product?.species ?? 'perro',
      type: product?.type ?? 'alimento-seco',
      catalogs: product ? [...product.catalogs] : ['general'],
      isPublished: product?.isPublished ?? true,
      isFeatured: product?.isFeatured ?? false,
      sortIndex: product?.sortIndex ?? 0,
    })
    variants.value = product?.variants.length
      ? product.variants.map((v) => ({
          key: ++rowKey,
          size: v.size,
          pvp: centsToDollars(v.pvp),
          pvc: centsToDollars(v.pvc),
          promo: v.promo ?? '',
        }))
      : [emptyRow()]
    currentImage.value = product?.image?.url ?? ''
    setFile(null)
    error.value = ''
    loadSuggestions()
  }

  function addVariant() {
    variants.value.push(emptyRow())
  }

  function removeVariant(key: number) {
    variants.value = variants.value.filter((v) => v.key !== key)
    if (!variants.value.length) variants.value.push(emptyRow())
  }

  /** Aviso no bloqueante: se puede guardar igual. */
  function pvcAboveFunda(row: VariantRow): boolean {
    const pvp = dollarsToCents(row.pvp)
    const pvc = dollarsToCents(row.pvc)
    return pvp !== null && pvc !== null && pvc > pvp
  }

  function setFile(file: File | null): string {
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = ''
    pendingFile.value = null
    if (!file) return ''
    if (!file.type.startsWith('image/')) return copy.imageNotImage
    if (file.size > MAX_IMAGE) return copy.imageTooBig
    pendingFile.value = file
    previewUrl.value = URL.createObjectURL(file)
    return ''
  }

  function buildPayload(): Partial<Product> | string {
    if (!form.name.trim()) return copy.nameRequired
    const rows = variants.value.filter((v) => v.size.trim() || v.pvp.trim() || v.pvc.trim())
    const parsed = rows.map((v) => ({
      size: v.size.trim(),
      pvp: dollarsToCents(v.pvp),
      pvc: dollarsToCents(v.pvc),
      promo: v.promo.trim() || null,
    }))
    if (parsed.some((v) => !v.size || v.pvp === null || v.pvc === null)) return copy.variantRequired
    return {
      ...form,
      name: form.name.trim(),
      sortIndex: Number(form.sortIndex) || 0,
      variants: parsed.map((v) => ({ ...v, pvp: v.pvp as number, pvc: v.pvc as number })),
    }
  }

  /** Guarda datos y, si hay foto nueva, la sube. Devuelve el producto final o null. */
  async function save(): Promise<Product | null> {
    if (saving.value) return null
    const payload = buildPayload()
    if (typeof payload === 'string') {
      error.value = payload
      return null
    }
    error.value = ''
    saving.value = true
    const creating = !productId.value
    try {
      let product = productId.value
        ? await adminService.updateProduct(productId.value, payload)
        : await adminService.createProduct(payload)
      productId.value = product._id
      if (pendingFile.value) {
        try {
          product = await adminService.uploadImage(product._id, pendingFile.value)
          currentImage.value = product.image?.url ?? ''
          setFile(null)
        } catch (e) {
          error.value = `${copy.imageFailed}: ${(e as ApiError).message}`
          toast.error(copy.imageFailed)
          return product
        }
      }
      toast.success(creating ? copy.created : copy.saved)
      return product
    } catch (e) {
      error.value = (e as ApiError).message
      return null
    } finally {
      saving.value = false
    }
  }

  onUnmounted(() => setFile(null))

  return {
    form, variants, currentImage, previewUrl, pendingFile, saving, error, isNew, suggestions,
    reset, addVariant, removeVariant, pvcAboveFunda, setFile, save,
  }
}

export type ProductForm = ReturnType<typeof useProductForm>
