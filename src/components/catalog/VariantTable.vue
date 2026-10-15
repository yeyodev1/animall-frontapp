<script setup lang="ts">
import { site } from '@/config/site'
import { formatCents } from '@/utils/format'
import type { Variant } from '@/types'
import { savingOf } from '@/composables/catalog/productMedia'
import { catalogCopy, productCopy } from '@/composables/catalog/copy'

defineProps<{ variants: Variant[]; modelValue: number; name: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: number] }>()
</script>

<template>
  <fieldset class="table">
    <legend class="table__legend">{{ productCopy.variants }}</legend>
    <div class="table__head" aria-hidden="true">
      <span>{{ productCopy.sizeCol }}</span>
      <span>{{ site.catalog.pvpLabel }}</span>
      <span>{{ site.catalog.priceLabel }}</span>
      <span>{{ catalogCopy.saving }}</span>
    </div>
    <label
      v-for="(variant, i) in variants"
      :key="variant.size"
      class="table__row"
      :class="{ 'table__row--on': i === modelValue }"
    >
      <input
        class="visually-hidden"
        type="radio"
        :name="`variant-${name}`"
        :checked="i === modelValue"
        @change="emit('update:modelValue', i)"
      />
      <span class="table__radio" aria-hidden="true"></span>
      <span class="table__size">
        {{ variant.size }}
        <span v-if="variant.promo" class="table__promo">{{ site.catalog.promoLabel }} {{ variant.promo }}</span>
      </span>
      <span class="table__pvp">
        <span class="table__mlabel">{{ site.catalog.pvpLabel }}</span>
        <s v-if="variant.pvp > variant.pvc">{{ formatCents(variant.pvp) }}</s>
        <span v-else>—</span>
      </span>
      <span class="table__pvc">
        <span class="table__mlabel">{{ site.catalog.priceLabel }}</span>
        {{ formatCents(variant.pvc) }}
      </span>
      <span class="table__save">
        <span v-if="savingOf(variant) > 0">{{ catalogCopy.saving }} {{ formatCents(savingOf(variant)) }}</span>
      </span>
    </label>
  </fieldset>
</template>

<style scoped lang="scss">
.table {
  border: 0;
  min-width: 0;
  @include flex(column, stretch, flex-start, 0.5rem);

  &__legend {
    @include eyebrow;
    color: $ink;
    margin-bottom: 0.7rem;
  }

  &__head {
    display: none;

    @include from('md') {
      @include flex(row, center);
      padding: 0 1rem 0 3.1rem;
      font-size: 0.66rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: $ink-muted;

      span {
        flex: 1;
      }

      span:first-child {
        flex: 1.5;
      }
    }
  }

  &__row {
    position: relative;
    @include flex(row, center, flex-start, 0.4rem 0.8rem);
    flex-wrap: wrap;
    margin: 0;
    padding: 0.85rem 1rem 0.85rem 3.1rem;
    border-radius: $radius-md;
    border: 1.5px solid $line;
    background: $surface;
    cursor: pointer;
    font-size: 0.9rem;
    color: $ink;
    transition:
      border-color 0.2s ease,
      background-color 0.2s ease;

    &:hover {
      border-color: $ink;
    }

    &--on {
      border-color: $ink;
      background: $mint;
      box-shadow: inset 0 0 0 1px $ink;
    }

    &:has(input:focus-visible) {
      outline: 3px solid $accent-deep;
      outline-offset: 2px;
    }

    @include from('md') {
      flex-wrap: nowrap;
      gap: 0;
    }
  }

  &__radio {
    position: absolute;
    left: 1rem;
    top: 1.05rem;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 2px solid $ink;
    background: $surface;

    .table__row--on & {
      background: $ink;
      box-shadow: inset 0 0 0 4px $accent;
    }

    @include from('md') {
      top: 50%;
      transform: translateY(-50%);
    }
  }

  &__size {
    flex: 1 1 100%;
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
    font-family: $font-display;
    font-size: 1.35rem;
    line-height: 1;
    padding-top: 0.15em;

    @include from('md') {
      flex: 1.5;
    }
  }

  &__promo {
    padding: 0.25rem 0.55rem 0.2rem;
    border-radius: $radius-pill;
    background: $ball;
    font-family: $font-principal;
    font-size: 0.66rem;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  &__pvp,
  &__pvc,
  &__save {
    @include from('md') {
      flex: 1;
    }
  }

  &__pvp {
    color: $ink-muted;
  }

  &__pvc {
    font-weight: 800;
    color: $accent-deep;
  }

  &__save {
    font-size: 0.78rem;
    font-weight: 700;
    color: $ink;

    @include until('md') {
      margin-left: auto;
    }
  }

  // En el celular cada cifra lleva su etiqueta porque no hay encabezado de columna.
  &__mlabel {
    @include from('md') {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip-path: inset(50%);
    }

    @include until('md') {
      font-size: 0.62rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: $ink-muted;
      margin-right: 0.3rem;
    }
  }
}
</style>
