<script setup lang="ts">
import { site } from '@/config/site'
import { formatCents } from '@/utils/format'
import { useCartStore } from '@/stores/cart'

defineProps<{ compact?: boolean }>()
const cart = useCartStore()
</script>

<template>
  <dl class="sum" :class="{ 'sum--compact': compact }">
    <div v-if="cart.savings > 0 && !compact" class="sum__line">
      <dt>{{ site.catalog.pvpLabel }}</dt>
      <dd><s>{{ formatCents(cart.totalPvp) }}</s></dd>
    </div>
    <div v-if="cart.savings > 0" class="sum__line sum__line--save">
      <dt>{{ site.cart.savings }}</dt>
      <dd>{{ formatCents(cart.savings) }}</dd>
    </div>
    <div class="sum__line sum__line--total">
      <dt>{{ site.cart.total }}</dt>
      <dd>{{ formatCents(cart.total) }}</dd>
    </div>
  </dl>
</template>

<style scoped lang="scss">
.sum {
  @include flex(column, stretch, flex-start, 0.35rem);

  &__line {
    @include flex(row, baseline, space-between, 1rem);
    font-size: 0.85rem;
    color: $ink-soft;

    s {
      color: $ink-muted;
    }

    &--save {
      color: $accent-deep;
      font-weight: 700;

      dd {
        padding: 0.1rem 0.6rem;
        border-radius: $radius-pill;
        background: $accent;
        color: $ink;
      }
    }

    &--total {
      margin-top: 0.3rem;
      color: $ink;

      dt {
        font-family: $font-display;
        font-size: 1.5rem;
        text-transform: uppercase;
        line-height: 1;
      }

      dd {
        font-family: $font-display;
        font-size: 2.6rem;
        line-height: 0.9;
      }
    }
  }

  &--compact &__line--total dd {
    font-size: 2rem;
  }
}
</style>
