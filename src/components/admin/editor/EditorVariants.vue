<script setup lang="ts">
import { adminCopy } from '@/components/admin/adminCopy'
import type { VariantRow } from '@/composables/admin/useProductForm'

defineProps<{ rows: VariantRow[]; warn: (row: VariantRow) => boolean }>()
const emit = defineEmits<{ add: []; remove: [key: number] }>()
const copy = adminCopy.editor
</script>

<template>
  <section class="variants" aria-labelledby="ed-prices">
    <h3 id="ed-prices" class="variants__title">{{ copy.sectionPrices }}</h3>
    <p class="variants__hint">{{ copy.pricesHint }}</p>

    <ol class="variants__list">
      <li v-for="(row, i) in rows" :key="row.key" class="variants__row">
        <div class="variants__num" aria-hidden="true">{{ i + 1 }}</div>
        <div class="variants__fields">
          <div class="variants__field variants__field--size">
            <label :for="`v-size-${row.key}`">{{ copy.size }}</label>
            <input :id="`v-size-${row.key}`" v-model="row.size" type="text" :placeholder="copy.sizePlaceholder" />
          </div>
          <div class="variants__field">
            <label :for="`v-pvp-${row.key}`">{{ copy.pvp }} <small>{{ copy.pvpHint }}</small></label>
            <div class="variants__money">
              <span aria-hidden="true">$</span>
              <input :id="`v-pvp-${row.key}`" v-model="row.pvp" type="text" inputmode="decimal" placeholder="0,00" />
            </div>
          </div>
          <div class="variants__field">
            <label :for="`v-pvc-${row.key}`">{{ copy.pvc }} <small>{{ copy.pvcHint }}</small></label>
            <div class="variants__money">
              <span aria-hidden="true">$</span>
              <input
                :id="`v-pvc-${row.key}`"
                v-model="row.pvc"
                type="text"
                inputmode="decimal"
                placeholder="0,00"
                :aria-describedby="warn(row) ? `v-warn-${row.key}` : undefined"
              />
            </div>
          </div>
          <div class="variants__field variants__field--promo">
            <label :for="`v-promo-${row.key}`">{{ copy.promo }}</label>
            <input :id="`v-promo-${row.key}`" v-model="row.promo" type="text" :placeholder="copy.promoPlaceholder" />
          </div>
          <p v-if="warn(row)" :id="`v-warn-${row.key}`" class="variants__warn" role="status">
            <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i> {{ copy.pvcHigher }}
          </p>
        </div>
        <button
          type="button"
          class="variants__remove"
          :aria-label="copy.removeVariant(i + 1)"
          @click="emit('remove', row.key)"
        >
          <i class="fa-solid fa-xmark" aria-hidden="true"></i>
        </button>
      </li>
    </ol>

    <button type="button" class="variants__add" @click="emit('add')">
      <i class="fa-solid fa-plus" aria-hidden="true"></i> {{ copy.addVariant }}
    </button>
  </section>
</template>

<style scoped lang="scss">
.variants {
  @include flex(column, stretch, flex-start, 0.6rem);

  &__title {
    @include display(1.35rem, $ink);
  }

  &__hint {
    font-size: 0.8rem;
    color: $ink-muted;
  }

  &__list {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.6rem);
  }

  &__row {
    @include flex(row, flex-start, flex-start, 0.6rem);
    padding: 0.8rem;
    border-radius: 14px;
    background: $paper;
    border: 1px solid $line;
  }

  &__num {
    flex: none;
    width: 26px;
    height: 26px;
    margin-top: 1.7rem;
    border-radius: 50%;
    background: $night;
    color: $accent;
    font-size: 0.75rem;
    font-weight: 800;
    @include flex(row, center, center);
  }

  &__fields {
    flex: 1;
    min-width: 0;
    @include flex(row, flex-start, flex-start, 0.6rem);
    flex-wrap: wrap;
  }

  &__field {
    flex: 1 1 calc(50% - 0.3rem);
    min-width: 0;

    @include from('md') {
      flex-basis: 120px;
    }

    &--size,
    &--promo {
      flex-basis: 100%;

      @include from('md') {
        flex-basis: 120px;
      }
    }

    label {
      font-size: 0.76rem;
      white-space: nowrap;

      small {
        font-size: 0.66rem;
        color: $ink-muted;
        font-weight: 600;
        letter-spacing: 0.04em;
      }
    }
  }

  &__money {
    position: relative;

    span {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: $ink-muted;
      font-size: 0.9rem;
      pointer-events: none;
    }

    input {
      padding-left: 1.6rem;
      font-variant-numeric: tabular-nums;
    }
  }

  &__warn {
    flex: 1 1 100%;
    @include flex(row, center, flex-start, 0.45rem);
    padding: 0.5rem 0.7rem;
    border-radius: $radius-sm;
    background: $warning-bg;
    color: #6b4d00;
    font-size: 0.8rem;
    font-weight: 600;
  }

  &__remove {
    flex: none;
    width: 40px;
    height: 40px;
    margin-top: 1.4rem;
    border-radius: $radius-sm;
    color: $ink-muted;
    @include flex(row, center, center);

    &:hover {
      background: $danger-bg;
      color: $danger;
    }
  }

  &__add {
    align-self: flex-start;
    @include flex(row, center, center, 0.5rem);
    min-height: 44px;
    padding: 0.5rem 1rem;
    border-radius: $radius-pill;
    border: 1.5px dashed $ink-muted;
    font-weight: 600;
    font-size: 0.88rem;

    &:hover {
      border-color: $ink;
      border-style: solid;
    }
  }
}
</style>
