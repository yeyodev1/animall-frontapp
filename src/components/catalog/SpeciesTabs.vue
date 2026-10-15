<script setup lang="ts">
import { site } from '@/config/site'
import type { FilterOption } from '@/types'
import { speciesIcons } from '@/composables/catalog/productMedia'
import { catalogCopy } from '@/composables/catalog/copy'

defineProps<{ options: FilterOption[]; selected: string[] }>()
const emit = defineEmits<{ toggle: [value: string]; all: [] }>()
</script>

<template>
  <div class="species" role="group" :aria-label="catalogCopy.species">
    <button
      type="button"
      class="species__chip"
      :class="{ 'species__chip--on': !selected.length }"
      :aria-pressed="!selected.length"
      @click="emit('all')"
    >
      <span class="species__icon"><i class="fa-solid fa-paw" aria-hidden="true"></i></span>
      {{ catalogCopy.allSpecies }}
    </button>
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      class="species__chip"
      :class="{ 'species__chip--on': selected.includes(option.value) }"
      :aria-pressed="selected.includes(option.value)"
      @click="emit('toggle', option.value)"
    >
      <span class="species__icon">
        <i :class="`fa-solid ${speciesIcons[option.value] ?? 'fa-paw'}`" aria-hidden="true"></i>
      </span>
      {{ site.labels.species[option.value] ?? option.label }}
      <span class="species__count">{{ option.count }}</span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.species {
  @include flex(row, center, flex-start, 0.5rem);
  overflow-x: auto;
  scrollbar-width: none;
  padding: 4px 1.25rem;
  margin-inline: -1.25rem;

  &::-webkit-scrollbar {
    display: none;
  }

  @include from('md') {
    flex-wrap: wrap;
    overflow: visible;
    padding-inline: 0;
    margin-inline: 0;
  }

  &__chip {
    @include flex(row, center, flex-start, 0.6rem);
    flex-shrink: 0;
    min-height: 56px;
    padding: 0.4rem 1.2rem 0.4rem 0.4rem;
    border-radius: $radius-pill;
    background: $surface;
    border: 2px solid transparent;
    font-family: $font-display;
    font-size: 1.3rem;
    line-height: 1;
    text-transform: uppercase;
    color: $ink;
    transition:
      background-color 0.25s ease,
      color 0.25s ease,
      border-color 0.25s ease;

    &:hover {
      border-color: $ink;
    }

    &--on {
      background: $ink;
      color: $surface;

      .species__icon {
        background: $accent;
        color: $ink;
      }

      .species__count {
        color: $accent;
      }
    }

    &:focus-visible {
      outline: 3px solid $accent-deep;
      outline-offset: 2px;
    }
  }

  &__icon {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    @include flex(row, center, center);
    background: $mint;
    font-size: 1.1rem;
    transition: background-color 0.25s ease;
  }

  &__count {
    font-family: $font-principal;
    font-size: 0.7rem;
    font-weight: 700;
    color: $ink-muted;
    margin-top: -0.6em;
  }
}
</style>
