<script setup lang="ts">
import { site } from '@/config/site'
import { catalogCopy } from '@/config/site'
import type { ActiveChip } from '@/composables/catalog/activeChips'

defineProps<{ total: number; loading: boolean; sort: string; activeCount: number; chips: ActiveChip[] }>()
const emit = defineEmits<{ sort: [value: string]; filters: []; remove: [chip: ActiveChip]; clear: [] }>()
</script>

<template>
  <div class="toolbar">
    <div class="toolbar__row">
      <p class="toolbar__count" aria-live="polite">
        <strong>{{ loading ? '—' : total }}</strong>
        <span>{{ loading ? '' : catalogCopy.resultsWord(total) }}</span>
      </p>

      <button type="button" class="toolbar__filters" @click="emit('filters')">
        <i class="fa-solid fa-sliders" aria-hidden="true"></i>
        {{ catalogCopy.filters }}
        <span v-if="activeCount" class="toolbar__badge">{{ activeCount }}</span>
      </button>

      <div class="toolbar__sort">
        <label for="catalog-sort" class="visually-hidden">{{ catalogCopy.sort }}</label>
        <select id="catalog-sort" :value="sort" @change="emit('sort', ($event.target as HTMLSelectElement).value)">
          <option v-for="option in site.catalog.sorts" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
      </div>
    </div>

    <ul v-if="chips.length" class="toolbar__chips">
      <li v-for="chip in chips" :key="chip.id">
        <button type="button" class="toolbar__chip" :aria-label="`Quitar ${chip.label}`" @click="emit('remove', chip)">
          {{ chip.label }} <i class="fa-solid fa-xmark" aria-hidden="true"></i>
        </button>
      </li>
      <li>
        <button type="button" class="toolbar__clear" @click="emit('clear')">{{ site.catalog.emptyCta }}</button>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.toolbar {
  @include flex(column, stretch, flex-start, 0.8rem);

  &__row {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
  }

  &__count {
    @include flex(row, baseline, flex-start, 0.35rem);
    flex: 1 1 100%;
    margin-right: auto;
    font-size: 0.82rem;

    @include from('sm') {
      flex: 0 1 auto;
    }
    font-weight: 600;
    color: $ink-soft;

    strong {
      font-family: $font-display;
      font-weight: 400;
      font-size: 2rem;
      line-height: 1;
      color: $ink;
    }
  }

  &__filters,
  &__sort select {
    min-height: 44px;
    border-radius: $radius-pill;
    border: 1.5px solid $ink;
    background: $surface;
    font-size: 0.85rem;
    font-weight: 700;
    color: $ink;
  }

  &__filters {
    @include flex(row, center, center, 0.45rem);
    flex: 1;
    padding: 0 1rem;

    @include from('sm') {
      flex: 0 0 auto;
    }

    @include from('lg') {
      display: none;
    }
  }

  &__badge {
    min-width: 20px;
    height: 20px;
    padding-inline: 5px;
    border-radius: $radius-pill;
    background: $accent;
    font-size: 0.7rem;
    @include flex(row, center, center);
  }

  &__sort {
    position: relative;
    flex: 1;

    @include from('sm') {
      flex: 0 0 auto;
    }

    select {
      appearance: none;
      width: 100%;
      padding: 0 2.3rem 0 1rem;
      cursor: pointer;

      &:focus {
        box-shadow: none;
        outline: 3px solid $accent-deep;
        outline-offset: 2px;
      }
    }

    i {
      position: absolute;
      right: 0.95rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.65rem;
      pointer-events: none;
    }
  }

  &__chips {
    list-style: none;
    @include flex(row, center, flex-start, 0.4rem);
    flex-wrap: wrap;
  }

  &__chip {
    @include flex(row, center, center, 0.45rem);
    min-height: 34px;
    padding: 0.25rem 0.85rem;
    border-radius: $radius-pill;
    background: $ink;
    color: $surface;
    font-size: 0.78rem;
    font-weight: 600;

    i {
      font-size: 0.7rem;
      color: $accent;
    }

    &:hover {
      background: $accent-deep;
    }
  }

  &__clear {
    min-height: 34px;
    padding-inline: 0.4rem;
    font-size: 0.8rem;
    font-weight: 700;
    color: $accent-deep;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
}
</style>
