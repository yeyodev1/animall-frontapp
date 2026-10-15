<script setup lang="ts">
import { computed } from 'vue'
import { site } from '@/config/site'
import { formatCents } from '@/utils/format'
import { catalogCopy } from '@/config/site'

const props = withDefaults(
  defineProps<{ pvc: number; pvp: number; from?: boolean; size?: 'md' | 'lg'; label?: boolean }>(),
  { from: false, size: 'md', label: true },
)

// "$12,40" se parte en "$12" + ",40" para poner los centavos chiquitos.
const parts = computed(() => {
  const text = formatCents(props.pvc)
  const cut = text.lastIndexOf(',')
  return cut === -1 ? { main: text, cents: '' } : { main: text.slice(0, cut), cents: text.slice(cut) }
})
const showPvp = computed(() => props.pvp > props.pvc)
</script>

<template>
  <div class="price" :class="`price--${size}`">
    <span v-if="label" class="price__label">{{ site.catalog.priceLabel }}</span>
    <span class="price__row">
      <span v-if="from" class="price__from">{{ catalogCopy.from }}</span>
      <strong class="price__now">
        <span class="visually-hidden">{{ site.catalog.priceLabel }}: </span>{{ parts.main
        }}<small class="price__cents">{{ parts.cents }}</small>
      </strong>
      <s v-if="showPvp" class="price__was">
        <span class="visually-hidden">{{ site.catalog.pvpLabel }}: </span>{{ formatCents(pvp) }}
      </s>
    </span>
  </div>
</template>

<style scoped lang="scss">
.price {
  @include flex(column, flex-start, flex-start, 0.15rem);

  &__label {
    font-size: 0.66rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: $accent-deep;
  }

  &__row {
    @include flex(row, baseline, flex-start, 0 0.5rem);
    flex-wrap: wrap;
  }

  &__from {
    align-self: center;
    font-size: 0.7rem;
    font-weight: 700;
    color: $ink-soft;
    margin-right: -0.25rem;
  }

  &__now {
    font-family: $font-display;
    font-weight: 400;
    font-size: 2.1rem;
    line-height: 0.9;
    color: $ink;
    letter-spacing: 0.01em;
  }

  &__cents {
    font-size: 0.55em;
    vertical-align: 0.62em;
    margin-left: 0.04em;
  }

  &__was {
    font-size: $text-sm;
    font-weight: 500;
    color: $ink-muted;
    text-decoration-thickness: 1.5px;
  }

  &--lg {
    .price__label {
      font-size: $text-xs;
    }

    .price__now {
      font-size: clamp(3.4rem, 2.4rem + 4vw, 5.6rem);
      color: $accent-deep;
    }

    .price__was {
      font-size: $text-lg;
    }
  }
}
</style>
