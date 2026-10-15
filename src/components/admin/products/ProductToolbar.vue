<script setup lang="ts">
import { site } from '@/config/site'
import { adminCopy } from '@/components/admin/adminCopy'
import type { Visibility } from '@/composables/admin/useAdminProducts'

// Objeto reactivo del composable: los campos se editan en su lugar.
const props = defineProps<{
  filters: { search: string; species: string; type: string; visibility: Visibility }
  hasFilters: boolean
}>()
const emit = defineEmits<{ clear: [] }>()

const copy = adminCopy.products
const speciesOptions = Object.entries(site.labels.species)
const typeOptions = Object.entries(site.labels.types)
const visibilityOptions: { value: Visibility; label: string }[] = [
  { value: '', label: copy.all },
  { value: 'published', label: copy.published },
  { value: 'hidden', label: copy.hidden },
]
const f = props.filters
</script>

<template>
  <div class="toolbar">
    <div class="toolbar__search">
      <label for="product-search" class="visually-hidden">{{ copy.search }}</label>
      <i class="fa-solid fa-magnifying-glass toolbar__search-icon" aria-hidden="true"></i>
      <input
        id="product-search"
        v-model="f.search"
        type="search"
        enterkeyhint="search"
        autocomplete="off"
        :placeholder="copy.searchPlaceholder"
      />
    </div>

    <div class="toolbar__row">
      <div class="toolbar__field">
        <label for="filter-species">{{ copy.species }}</label>
        <select id="filter-species" v-model="f.species">
          <option value="">{{ copy.allSpecies }}</option>
          <option v-for="[value, label] in speciesOptions" :key="value" :value="value">{{ label }}</option>
        </select>
      </div>
      <div class="toolbar__field">
        <label for="filter-type">{{ copy.type }}</label>
        <select id="filter-type" v-model="f.type">
          <option value="">{{ copy.all }}</option>
          <option v-for="[value, label] in typeOptions" :key="value" :value="value">{{ label }}</option>
        </select>
      </div>
    </div>

    <div class="toolbar__row toolbar__row--end">
      <div class="toolbar__segment" role="radiogroup" :aria-label="copy.visibility">
        <button
          v-for="opt in visibilityOptions"
          :key="opt.value"
          type="button"
          role="radio"
          class="toolbar__seg"
          :class="{ 'is-active': f.visibility === opt.value }"
          :aria-checked="f.visibility === opt.value"
          @click="f.visibility = opt.value"
        >
          {{ opt.label }}
        </button>
      </div>
      <button v-if="hasFilters" type="button" class="toolbar__clear" @click="emit('clear')">
        <i class="fa-solid fa-xmark" aria-hidden="true"></i> {{ copy.clear }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.toolbar {
  @include flex(column, stretch, flex-start, 0.75rem);
  margin-bottom: 1.1rem;

  @include from('lg') {
    flex-direction: row;
    align-items: flex-end;
    flex-wrap: wrap;
  }

  &__search {
    position: relative;

    @include from('lg') {
      flex: 1 1 280px;
    }

    input {
      min-height: 48px;
      padding-left: 2.6rem;
    }
  }

  &__search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: $ink-muted;
    pointer-events: none;
  }

  &__row {
    @include flex(row, flex-end, flex-start, 0.6rem);

    &--end {
      flex-wrap: wrap;
    }
  }

  &__field {
    flex: 1 1 0;
    min-width: 0;

    @include from('lg') {
      flex: 0 0 170px;
    }

    label {
      font-size: 0.75rem;
    }

    select {
      min-height: 46px;
    }
  }

  &__segment {
    @include flex(row, stretch, flex-start);
    padding: 3px;
    border-radius: $radius-pill;
    background: $sand;
    flex: 1 1 auto;

    @include from('lg') {
      flex: none;
    }
  }

  &__seg {
    flex: 1;
    min-height: 40px;
    padding: 0.4rem 0.9rem;
    border-radius: $radius-pill;
    font-size: 0.85rem;
    font-weight: 600;
    color: $ink-soft;
    white-space: nowrap;
    @include transition(background);

    &.is-active {
      background: $surface;
      color: $ink;
      box-shadow: $shadow-sm;
    }
  }

  &__clear {
    min-height: 44px;
    padding: 0.4rem 0.6rem;
    font-size: 0.85rem;
    font-weight: 600;
    color: $accent-deep;
  }
}
</style>
