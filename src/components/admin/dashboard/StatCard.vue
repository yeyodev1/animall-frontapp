<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{
  label: string
  value: string | number
  icon: string
  hint?: string
  to?: string
  highlight?: boolean
  loading?: boolean
}>()
</script>

<template>
  <component
    :is="to ? RouterLink : 'div'"
    :to="to"
    class="stat"
    :class="{ 'stat--highlight': highlight, 'stat--link': to }"
  >
    <span class="stat__icon" aria-hidden="true"><i :class="icon"></i></span>
    <span class="stat__label">{{ label }}</span>
    <span v-if="loading" class="stat__skeleton" aria-hidden="true"></span>
    <strong v-else class="stat__value">{{ value }}</strong>
    <span v-if="hint" class="stat__hint">{{ hint }}</span>
  </component>
</template>

<style scoped lang="scss">
.stat {
  position: relative;
  @include card;
  @include flex(column, flex-start, flex-start, 0.3rem);
  padding: 1rem 1.05rem 1.1rem;
  min-height: 132px;
  @include transition(transform);

  &--link:hover {
    transform: translateY(-2px);
    border-color: $ink;
  }

  &__icon {
    position: absolute;
    top: 0.9rem;
    right: 0.9rem;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: $mint;
    color: $accent-deep;
    font-size: 0.9rem;
    @include flex(row, center, center);
  }

  &__label {
    font-size: 0.8rem;
    font-weight: 600;
    color: $ink-soft;
    padding-right: 2.6rem;
  }

  // Cifras en Inter Tight: en Bayon el 1 se confunde con una I.
  &__value {
    font-family: $font-principal;
    font-weight: 800;
    font-size: clamp(1.9rem, 1.6rem + 1.2vw, 2.5rem);
    letter-spacing: -0.03em;
    line-height: 1;
    color: $ink;
    margin-top: auto;
    font-variant-numeric: tabular-nums;
  }

  &__hint {
    font-size: 0.76rem;
    color: $ink-muted;
  }

  &__skeleton {
    margin-top: auto;
    width: 60%;
    height: 2.4rem;
    border-radius: 8px;
    background: linear-gradient(90deg, $sand, $paper, $sand);
    background-size: 200% 100%;
    animation: shimmer 1.2s linear infinite;
  }

  &--highlight {
    background: $night;
    border-color: $night;
    color: $paper;

    .stat__label,
    .stat__hint {
      color: rgba($paper, 0.75);
    }

    .stat__value {
      color: $accent;
    }

    .stat__icon {
      background: $accent;
      color: $ink;
    }
  }
}

@keyframes shimmer {
  to {
    background-position: -200% 0;
  }
}
</style>
