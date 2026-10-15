<script setup lang="ts">
import { computed } from 'vue'
import { site } from '@/config/site'
import type { ProductFilters } from '@/types'
import type { Facet } from '@/composables/catalog/useCatalogQuery'
import { typeIcons } from '@/composables/catalog/productMedia'
import { catalogCopy } from '@/composables/catalog/copy'
import FilterGroup from './FilterGroup.vue'

const props = defineProps<{
  filters: ProductFilters | null
  selected: Record<Facet, string[]>
  promo: boolean
  superPremium: boolean
}>()
const emit = defineEmits<{
  toggle: [facet: Facet, value: string]
  promo: [on: boolean]
  catalog: [value: string | null]
}>()

const types = computed(() =>
  (props.filters?.types ?? []).map((o) => ({ ...o, label: site.labels.types[o.value] ?? o.label })),
)
</script>

<template>
  <div class="panel">
    <div class="panel__switches">
      <button
        type="button"
        class="panel__switch"
        :class="{ 'panel__switch--on': promo }"
        :aria-pressed="promo"
        @click="emit('promo', !promo)"
      >
        <i class="fa-solid fa-certificate" aria-hidden="true"></i>{{ catalogCopy.promoOnly }}
      </button>
      <button
        type="button"
        class="panel__switch"
        :class="{ 'panel__switch--on': superPremium }"
        :aria-pressed="superPremium"
        @click="emit('catalog', superPremium ? null : 'super-premium')"
      >
        <i class="fa-solid fa-star" aria-hidden="true"></i>{{ catalogCopy.superPremium }}
      </button>
    </div>

    <FilterGroup
      v-if="types.length"
      :title="catalogCopy.type"
      :options="types"
      :selected="selected.type"
      :icons="typeIcons"
      @toggle="emit('toggle', 'type', $event)"
    />
    <FilterGroup
      v-if="filters?.categories.length"
      :title="catalogCopy.category"
      :options="filters.categories"
      :selected="selected.category"
      @toggle="emit('toggle', 'category', $event)"
    />
    <FilterGroup
      v-if="filters?.brands.length"
      :title="catalogCopy.brand"
      :options="filters.brands"
      :selected="selected.brand"
      searchable
      @toggle="emit('toggle', 'brand', $event)"
    />
  </div>
</template>

<style scoped lang="scss">
.panel {
  @include flex(column, stretch, flex-start);

  &__switches {
    @include flex(row, center, flex-start, 0.4rem);
    flex-wrap: wrap;
    padding-bottom: 1.1rem;
  }

  &__switch {
    @include flex(row, center, center, 0.45rem);
    min-height: 40px;
    padding: 0.4rem 0.95rem;
    border-radius: $radius-pill;
    border: 1.5px solid $ink;
    font-size: 0.82rem;
    font-weight: 700;
    color: $ink;
    transition:
      background-color 0.2s ease,
      color 0.2s ease;

    i {
      font-size: 0.75rem;
      color: $accent-deep;
    }

    &:hover {
      background: rgba($ink, 0.06);
    }

    &--on {
      background: $ink;
      color: $surface;

      i {
        color: $accent;
      }

      &:hover {
        background: $ink;
      }
    }
  }
}
</style>
