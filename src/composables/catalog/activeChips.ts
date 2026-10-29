import { site } from '@/config/site'
import type { ProductFilters } from '@/types'
import { catalogCopy } from '@/config/site'
import { FACETS, type Facet } from './useCatalogQuery'

export interface ActiveChip {
  id: string
  label: string
  facet: Facet | 'catalog' | 'search'
  value: string
}

/** Filtros aplicados como chips removibles, con su etiqueta legible. */
export function activeChips(
  selected: Record<Facet, string[]>,
  extra: { search: string; catalog: string },
  filters: ProductFilters | null,
): ActiveChip[] {
  const labelOf = (facet: Facet, value: string) => {
    if (facet === 'species') return site.labels.species[value] ?? value
    if (facet === 'type') return site.labels.types[value] ?? value
    const list = facet === 'category' ? filters?.categories : filters?.brands
    return list?.find((o) => o.value === value)?.label ?? value
  }
  const chips: ActiveChip[] = []
  if (extra.search) chips.push({ id: 'search', label: `“${extra.search}”`, facet: 'search', value: extra.search })
  if (extra.catalog) {
    const label = extra.catalog === 'super-premium' ? catalogCopy.superPremium : extra.catalog
    chips.push({ id: 'catalog', label, facet: 'catalog', value: extra.catalog })
  }
  for (const facet of FACETS) {
    for (const value of selected[facet]) {
      chips.push({ id: `${facet}:${value}`, label: labelOf(facet, value), facet, value })
    }
  }
  return chips
}
