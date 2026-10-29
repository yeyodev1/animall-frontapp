<script setup lang="ts">
import type { Variant } from '@/types'

defineProps<{ variants: Variant[]; modelValue: number; label: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: number] }>()
</script>

<template>
  <div class="chips" role="radiogroup" :aria-label="label">
    <button
      v-for="(variant, i) in variants"
      :key="variant.size"
      type="button"
      role="radio"
      class="chips__chip"
      :class="{ 'chips__chip--on': i === modelValue }"
      :aria-checked="i === modelValue"
      :tabindex="i === modelValue ? 0 : -1"
      @click="emit('update:modelValue', i)"
      @keydown.right.prevent="emit('update:modelValue', (modelValue + 1) % variants.length)"
      @keydown.left.prevent="emit('update:modelValue', (modelValue - 1 + variants.length) % variants.length)"
    >
      {{ variant.size }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.chips {
  @include flex(row, center, flex-start, 0.35rem);
  overflow-x: auto;
  scrollbar-width: none;
  // El scroll horizontal no recorta el anillo de foco
  padding: 3px;
  margin: -3px;

  &::-webkit-scrollbar {
    display: none;
  }

  &__chip {
    position: relative;
    flex-shrink: 0;
    min-height: 32px;
    padding: 0.3rem 0.75rem;
    border-radius: $radius-pill;
    border: 1.5px solid $line;
    background: $surface;
    font-size: 0.74rem;
    font-weight: 600;
    color: $ink-soft;
    white-space: nowrap;
    transition:
      background-color 0.2s ease,
      color 0.2s ease,
      border-color 0.2s ease;

    &:hover {
      border-color: $ink;
      color: $ink;
    }

    &--on {
      background: $ink;
      border-color: $ink;
      color: $surface;

      &:hover {
        color: $surface;
      }
    }

    &:focus-visible {
      outline: 2px solid $accent-deep;
      outline-offset: 2px;
    }
  }
}
</style>
