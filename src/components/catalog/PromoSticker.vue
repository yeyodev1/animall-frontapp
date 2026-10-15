<script setup lang="ts">
import { site } from '@/config/site'

// Sticker de promo con forma de pelota de tenis, rotado como pegado a mano.
withDefaults(defineProps<{ promo: string; size?: 'sm' | 'md' | 'lg' }>(), { size: 'md' })
</script>

<template>
  <span class="sticker" :class="`sticker--${size}`">
    <span class="sticker__label">{{ site.catalog.promoLabel }}</span>
    <span class="sticker__value">{{ promo }}</span>
  </span>
</template>

<style scoped lang="scss">
.sticker {
  --d: 4.4rem;
  position: relative;
  @include flex(column, center, center);
  width: var(--d);
  height: var(--d);
  border-radius: 50%;
  background: $ball;
  color: $ink;
  transform: rotate(-14deg);
  box-shadow:
    inset 0 -6px 0 rgba($ink, 0.07),
    0 8px 18px rgba($ink, 0.14);
  overflow: hidden;
  text-align: center;
  line-height: 1;

  &::before,
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 2px solid rgba($surface, 0.85);
  }

  &::before {
    left: -70%;
    right: 70%;
  }

  &::after {
    left: 70%;
    right: -70%;
  }

  &__label {
    position: relative;
    z-index: 1;
    font-size: 0.52rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  &__value {
    position: relative;
    z-index: 1;
    font-family: $font-display;
    font-size: calc(var(--d) * 0.36);
    margin-top: 0.12em;
    max-width: 88%;
    overflow: hidden;
    white-space: nowrap;
  }

  &--sm {
    --d: 2.6rem;

    .sticker__label {
      display: none;
    }
  }

  &--lg {
    --d: 6.2rem;

    .sticker__label {
      font-size: 0.66rem;
    }
  }
}
</style>
