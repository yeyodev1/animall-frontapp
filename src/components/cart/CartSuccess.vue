<script setup lang="ts">
import { site } from '@/config/site'
import type { Order } from '@/types'
import { cartCopy } from '@/composables/cart/copy'
import TennisBall from '@/components/catalog/TennisBall.vue'

defineProps<{ order: Order | null; blocked: boolean }>()
const emit = defineEmits<{ open: []; close: [] }>()
</script>

<template>
  <div class="ok" role="status">
    <div class="ok__art" aria-hidden="true">
      <span class="ok__circle"><i class="fa-solid fa-check"></i></span>
      <TennisBall class="ok__ball" size="3.2rem" />
    </div>
    <h3 class="ok__title">{{ cartCopy.successTitle }}</h3>
    <div v-if="order" class="ok__code">
      <span>{{ cartCopy.codeLabel }}</span>
      <strong>{{ order.code }}</strong>
    </div>
    <p class="ok__text" :class="{ 'ok__text--warn': blocked }">{{ blocked ? cartCopy.blocked : site.cart.sent }}</p>
    <div class="ok__actions">
      <button type="button" class="btn btn--primary" @click="emit('open')">
        <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>{{ cartCopy.openWhatsapp }}
      </button>
      <button type="button" class="btn btn--ghost btn--dot" @click="emit('close')">{{ cartCopy.keepShopping }}</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ok {
  flex: 1;
  @include flex(column, center, center, 1rem);
  text-align: center;
  padding: 2rem 0.5rem;

  &__art {
    position: relative;
  }

  &__circle {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: $accent;
    @include flex(row, center, center);
    font-size: 3rem;
    color: $ink;
  }

  &__ball {
    position: absolute;
    left: -1rem;
    top: -0.4rem;
  }

  &__title {
    @include display($display-md, $ink);
  }

  &__code {
    @include flex(column, center, center, 0.3rem);
    padding: 0.9rem 1.6rem;
    border-radius: $radius-md;
    background: $ink;
    color: $surface;

    span {
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      opacity: 0.8;
    }

    strong {
      font-family: $font-display;
      font-weight: 400;
      font-size: 2.4rem;
      line-height: 1;
      letter-spacing: 0.04em;
      color: $accent;
    }
  }

  &__text {
    max-width: 34ch;
    font-size: 0.9rem;
    color: $ink-soft;

    &--warn {
      color: $ink;
      font-weight: 700;
    }
  }

  &__actions {
    @include flex(column, stretch, flex-start, 0.5rem);
    width: 100%;
    max-width: 320px;
  }
}
</style>
