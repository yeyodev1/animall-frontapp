import { computed } from 'vue'
import { useRoute, useRouter, type LocationQueryRaw } from 'vue-router'
import type { ProductQuery } from '@/types'

export const FACETS = ['species', 'type', 'category', 'brand'] as const
export type Facet = (typeof FACETS)[number]

/**
 * El estado del catálogo vive en la URL: el link se puede compartir y el botón
 * atrás deshace el último filtro. Las facetas aceptan varios valores separados
 * por coma, igual que el API.
 */
export function useCatalogQuery() {
  const route = useRoute()
  const router = useRouter()

  const text = (key: string) => {
    const value = route.query[key]
    return typeof value === 'string' ? value : ''
  }
  const list = (key: string) => text(key).split(',').filter(Boolean)

  const search = computed(() => text('search'))
  const sort = computed(() => text('sort') || 'relevancia')
  const catalog = computed(() => text('catalog'))
  const selected = computed(() =>
    Object.fromEntries(FACETS.map((f) => [f, list(f)])) as Record<Facet, string[]>,
  )

  const activeCount = computed(
    () => FACETS.reduce((n, f) => n + selected.value[f].length, 0) + (catalog.value ? 1 : 0),
  )
  const hasAny = computed(() => activeCount.value > 0 || Boolean(search.value))

  const apiQuery = computed<ProductQuery>(() => {
    const q: ProductQuery = { sort: sort.value }
    if (search.value) q.search = search.value
    if (catalog.value) q.catalog = catalog.value
    for (const f of FACETS) if (selected.value[f].length) q[f] = selected.value[f].join(',')
    return q
  })
  const key = computed(() => JSON.stringify(apiQuery.value))

  function update(patch: Record<string, string | string[] | null>, replace = false) {
    const next: LocationQueryRaw = { ...route.query }
    for (const [k, v] of Object.entries(patch)) {
      const value = Array.isArray(v) ? v.join(',') : v
      if (value) next[k] = value
      else delete next[k]
    }
    router[replace ? 'replace' : 'push']({ query: next })
  }

  function toggle(facet: Facet, value: string) {
    const current = selected.value[facet]
    update({ [facet]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value] })
  }

  return {
    search,
    sort,
    catalog,
    selected,
    activeCount,
    hasAny,
    apiQuery,
    key,
    toggle,
    setFacet: (facet: Facet, values: string[]) => update({ [facet]: values }),
    // Escribir no debe llenar el historial: cada tecla reemplaza la entrada.
    setSearch: (value: string) => update({ search: value.trim() || null }, true),
    setSort: (value: string) => update({ sort: value === 'relevancia' ? null : value }),
    setCatalog: (value: string | null) => update({ catalog: value }),
    clear: () => router.push({ query: {} }),
  }
}
