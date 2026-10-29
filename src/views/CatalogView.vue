<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { useCatalogPage } from '@/composables/catalog/useCatalogPage'
import { catalogCopy } from '@/config/site'
import CatalogHero from '@/components/catalog/CatalogHero.vue'
import CatalogSearch from '@/components/catalog/CatalogSearch.vue'
import SpeciesTabs from '@/components/catalog/SpeciesTabs.vue'
import FilterPanel from '@/components/catalog/FilterPanel.vue'
import FilterSheet from '@/components/catalog/FilterSheet.vue'
import CatalogToolbar from '@/components/catalog/CatalogToolbar.vue'
import ProductGrid from '@/components/catalog/ProductGrid.vue'
import CatalogEmpty from '@/components/catalog/CatalogEmpty.vue'

const sentinel = useTemplateRef<HTMLElement>('sentinel')
const { query, filters, products, sheetOpen, chips, removeChip, clearAll } = useCatalogPage(sentinel)
const { items, total, loading, loadingMore, error, hasMore, loadMore, retry } = products
</script>

<template>
  <div class="catalog">
    <CatalogHero :total="filters?.total ?? null" :super-premium="query.catalog.value === 'super-premium'">
      <CatalogSearch :model-value="query.search.value" @update:model-value="query.setSearch" />
      <SpeciesTabs
        v-if="filters?.species.length"
        :options="filters.species"
        :selected="query.selected.value.species"
        @toggle="query.toggle('species', $event)"
        @all="query.setFacet('species', [])"
      />
    </CatalogHero>

    <div class="catalog__body">
      <aside class="catalog__side" :aria-label="catalogCopy.filters">
        <div class="catalog__side-head">
          <h2 class="catalog__side-title">{{ catalogCopy.filters }}</h2>
          <button v-if="query.activeCount.value" type="button" class="catalog__side-clear" @click="clearAll">
            {{ catalogCopy.clear }}
          </button>
        </div>
        <FilterPanel
          :filters="filters"
          :selected="query.selected.value"
            :super-premium="query.catalog.value === 'super-premium'"
          @toggle="query.toggle"
            @catalog="query.setCatalog"
        />
      </aside>

      <section class="catalog__main" aria-labelledby="catalog-results">
        <h2 id="catalog-results" class="visually-hidden">{{ catalogCopy.results(total) }}</h2>
        <CatalogToolbar
          class="catalog__toolbar"
          :total="total"
          :loading="loading"
          :sort="query.sort.value"
          :active-count="query.activeCount.value"
          :chips="chips"
          @sort="query.setSort"
          @filters="sheetOpen = true"
          @remove="removeChip"
          @clear="clearAll"
        />

        <CatalogEmpty v-if="error && !items.length" :error="error" @retry="retry" />
        <CatalogEmpty v-else-if="!loading && !items.length" @clear="clearAll" />
        <ProductGrid
          v-else
          :class="{ 'catalog__grid--busy': loading && items.length }"
          :items="loading && !items.length ? [] : items"
          :skeletons="loading && !items.length ? 8 : loadingMore ? 4 : 0"
        />

        <div v-if="items.length && !loading" class="catalog__more">
          <span ref="sentinel" class="catalog__sentinel" aria-hidden="true"></span>
          <p class="catalog__showing">{{ catalogCopy.showing(items.length, total) }}</p>
          <span class="catalog__bar" aria-hidden="true">
            <span class="catalog__bar-fill" :style="{ transform: `scaleX(${items.length / Math.max(total, 1)})` }"></span>
          </span>
          <button v-if="hasMore" type="button" class="btn btn--ghost btn--dot" :disabled="loadingMore" @click="loadMore">
            {{ catalogCopy.loadMore }}
          </button>
        </div>
      </section>
    </div>

    <FilterSheet :open="sheetOpen" :total="total" :active-count="query.activeCount.value" @close="sheetOpen = false" @clear="clearAll">
      <FilterPanel
        :filters="filters"
        :selected="query.selected.value"
        :super-premium="query.catalog.value === 'super-premium'"
        @toggle="query.toggle"
        @catalog="query.setCatalog"
      />
    </FilterSheet>
  </div>
</template>

<style scoped lang="scss">
.catalog {
  &__body {
    @include container(1320px);
    @include flex(row, flex-start, flex-start, 2.5rem);
    padding-block: 1.5rem $space-section;

    @include from('md') {
      padding-top: 2.2rem;
    }
  }

  &__side {
    display: none;

    @include from('lg') {
      display: block;
      flex: 0 0 260px;
      position: sticky;
      top: 84px;
      max-height: calc(100vh - 100px);
      overflow-y: auto;
      overscroll-behavior: contain;
      padding-right: 0.5rem;
      scrollbar-width: thin;
    }
  }

  &__side-head {
    @include flex(row, baseline, space-between);
    margin-bottom: 1rem;
  }

  &__side-title {
    @include display(2.6rem, $ink);
  }

  &__side-clear {
    font-size: 0.82rem;
    font-weight: 700;
    color: $accent-deep;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  &__main {
    flex: 1;
    min-width: 0;
    @include flex(column, stretch, flex-start, 1.2rem);
  }

  &__grid--busy {
    opacity: 0.5;
    transition: opacity 0.2s ease;
  }

  &__more {
    position: relative;
    @include flex(column, center, flex-start, 0.8rem);
    padding-top: 2rem;
  }

  &__sentinel {
    position: absolute;
    top: 0;
    height: 1px;
    width: 1px;
  }

  &__showing {
    font-size: 0.82rem;
    font-weight: 600;
    color: $ink-soft;
  }

  &__bar {
    width: 180px;
    height: 4px;
    border-radius: 4px;
    background: $line;
    overflow: hidden;
  }

  &__bar-fill {
    display: block;
    height: 100%;
    background: $accent-deep;
    transform-origin: left;
    transition: transform 0.6s $ease;
  }
}
</style>
