<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import type { FilterOption } from '@/types'
import { catalogCopy } from '@/composables/catalog/copy'

const props = withDefaults(
  defineProps<{
    title: string
    options: FilterOption[]
    selected: string[]
    icons?: Record<string, string>
    searchable?: boolean
    limit?: number
  }>(),
  { icons: undefined, searchable: false, limit: 8 },
)
const emit = defineEmits<{ toggle: [value: string] }>()

const id = useId()
const open = ref(true)
const expanded = ref(false)
const query = ref('')

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return q ? props.options.filter((o) => o.label.toLowerCase().includes(q)) : props.options
})
// Lo elegido siempre se ve aunque quede fuera del recorte.
const visible = computed(() => {
  if (expanded.value || query.value) return filtered.value
  const head = filtered.value.slice(0, props.limit)
  const extra = filtered.value.slice(props.limit).filter((o) => props.selected.includes(o.value))
  return [...head, ...extra]
})
</script>

<template>
  <section class="group">
    <h3 class="group__head">
      <button type="button" class="group__toggle" :aria-expanded="open" :aria-controls="id" @click="open = !open">
        {{ title }}
        <span v-if="selected.length" class="group__badge">{{ selected.length }}</span>
        <i class="fa-solid fa-chevron-down group__chevron" aria-hidden="true"></i>
      </button>
    </h3>

    <div v-show="open" :id="id" class="group__body">
      <div v-if="searchable && options.length > limit" class="group__search">
        <label :for="`${id}-q`" class="visually-hidden">{{ catalogCopy.brandSearch }}</label>
        <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
        <input :id="`${id}-q`" v-model="query" type="search" :placeholder="catalogCopy.brandSearch" />
      </div>

      <ul class="group__list">
        <li v-for="option in visible" :key="option.value">
          <button
            type="button"
            class="group__option"
            :class="{ 'group__option--on': selected.includes(option.value) }"
            :aria-pressed="selected.includes(option.value)"
            @click="emit('toggle', option.value)"
          >
            <span class="group__check" aria-hidden="true">
              <i v-if="icons" :class="`fa-solid ${icons[option.value] ?? 'fa-circle'}`"></i>
              <i v-else class="fa-solid fa-check"></i>
            </span>
            <span class="group__label">{{ option.label }}</span>
            <span class="group__count">{{ option.count }}</span>
          </button>
        </li>
      </ul>

      <button
        v-if="!query && filtered.length > limit"
        type="button"
        class="group__more"
        @click="expanded = !expanded"
      >
        {{ expanded ? catalogCopy.showLess : `${catalogCopy.showMore} (${filtered.length - limit})` }}
      </button>
    </div>
  </section>
</template>

<style scoped lang="scss">
.group {
  border-top: 1.5px solid $ink;
  padding-block: 0.9rem 1.1rem;

  &__head {
    font: inherit;
  }

  &__toggle {
    @include flex(row, center, flex-start, 0.5rem);
    width: 100%;
    min-height: 40px;
    font-family: $font-display;
    font-size: 1.5rem;
    line-height: 1;
    text-transform: uppercase;
    color: $ink;
    text-align: left;

    &[aria-expanded='false'] .group__chevron {
      transform: rotate(-90deg);
    }
  }

  &__badge {
    min-width: 22px;
    height: 22px;
    padding-inline: 6px;
    border-radius: $radius-pill;
    background: $accent;
    font-family: $font-principal;
    font-size: 0.72rem;
    font-weight: 700;
    @include flex(row, center, center);
  }

  &__chevron {
    margin-left: auto;
    font-size: 0.8rem;
    transition: transform 0.3s $ease;
  }

  &__body {
    @include flex(column, stretch, flex-start, 0.4rem);
    padding-top: 0.4rem;
  }

  &__search {
    position: relative;
    margin-bottom: 0.3rem;

    i {
      position: absolute;
      left: 0.95rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.8rem;
      color: $ink-muted;
    }

    input {
      border-radius: $radius-pill;
      padding-left: 2.4rem;
      min-height: 44px;
    }
  }

  &__list {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.1rem);
  }

  &__option {
    @include flex(row, center, flex-start, 0.7rem);
    width: 100%;
    min-height: 40px;
    padding: 0.3rem 0.5rem 0.3rem 0.3rem;
    border-radius: $radius-sm;
    text-align: left;
    font-size: 0.9rem;
    font-weight: 500;
    color: $ink-soft;
    transition: background-color 0.2s ease;

    &:hover {
      background: rgba($ink, 0.05);
    }

    &--on {
      color: $ink;
      font-weight: 700;

      .group__check {
        background: $ink;
        border-color: $ink;
        color: $accent;
      }
    }
  }

  &__check {
    width: 28px;
    height: 28px;
    flex-shrink: 0;
    border-radius: 50%;
    border: 1.5px solid $line;
    background: $surface;
    @include flex(row, center, center);
    font-size: 0.7rem;
    color: $ink-muted;
    transition:
      background-color 0.2s ease,
      color 0.2s ease;
  }

  &__label {
    flex: 1;
    line-height: 1.25;
  }

  &__count {
    font-size: 0.74rem;
    font-weight: 600;
    color: $ink-muted;
  }

  &__more {
    align-self: flex-start;
    margin-top: 0.3rem;
    padding: 0.4rem 0;
    font-size: 0.82rem;
    font-weight: 700;
    color: $accent-deep;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
}
</style>
