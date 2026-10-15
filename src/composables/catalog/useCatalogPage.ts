import { computed, onMounted, ref, type Ref } from 'vue'
import { activeChips, type ActiveChip } from './activeChips'
import { useCatalogFilters } from './useCatalogFilters'
import { useCatalogProducts } from './useCatalogProducts'
import { useCatalogQuery } from './useCatalogQuery'
import { useInfiniteScroll } from './useInfiniteScroll'

/** Une URL, facetas, resultados y scroll infinito para que la vista solo componga. */
export function useCatalogPage(sentinel: Readonly<Ref<HTMLElement | null>>) {
  const query = useCatalogQuery()
  const { filters, load } = useCatalogFilters()
  const products = useCatalogProducts(query.apiQuery, query.key)
  const sheetOpen = ref(false)

  onMounted(load)

  const chips = computed(() =>
    activeChips(
      query.selected.value,
      { search: query.search.value, catalog: query.catalog.value, promo: query.promo.value },
      filters.value,
    ),
  )

  function removeChip(chip: ActiveChip) {
    if (chip.facet === 'search') query.setSearch('')
    else if (chip.facet === 'promo') query.setPromo(false)
    else if (chip.facet === 'catalog') query.setCatalog(null)
    else query.toggle(chip.facet, chip.value)
  }

  function clearAll() {
    sheetOpen.value = false
    query.clear()
  }

  // Mientras se cargan más, el observer se apaga para no pedir dos veces la misma página.
  const autoLoad = computed(() => products.hasMore.value && !products.loading.value && !products.loadingMore.value)
  useInfiniteScroll(sentinel, products.loadMore, autoLoad)

  return { query, filters, products, sheetOpen, chips, removeChip, clearAll }
}
