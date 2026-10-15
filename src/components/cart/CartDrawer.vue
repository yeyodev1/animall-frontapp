<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { site } from '@/config/site'
import { useCartStore } from '@/stores/cart'
import { useBodyScroll } from '@/composables/useBodyScroll'
import { useFocusTrap } from '@/composables/cart/useFocusTrap'
import { useCheckout } from '@/composables/cart/useCheckout'
import { cartCopy } from '@/config/site'
import CartItemRow from './CartItemRow.vue'
import CartSummary from './CartSummary.vue'
import CartForm from './CartForm.vue'
import CartEmpty from './CartEmpty.vue'
import CartSuccess from './CartSuccess.vue'

const cart = useCartStore()
const { step, errors, sending, order, popupBlocked, submit, openWhatsapp, goTo, resetIfDone } = useCheckout()

const open = computed(() => cart.isOpen)
const panel = ref<HTMLElement | null>(null)
const body = ref<HTMLElement | null>(null)

function close() {
  cart.close()
}

useBodyScroll(open)
useFocusTrap(panel, open, close)

watch(open, (on) => {
  if (!on) setTimeout(resetIfDone, 400)
})
// Si el carrito se vacía con el formulario abierto, se vuelve al primer paso.
watch(
  () => cart.items.length,
  (n) => {
    if (!n && step.value === 'form') goTo('cart')
  },
)
watch(step, () => body.value?.scrollTo({ top: 0 }))

const empty = computed(() => !cart.items.length && step.value !== 'success')
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="open" class="drawer" @click.self="close">
        <aside ref="panel" class="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="cart-title" tabindex="-1">
          <header class="drawer__head">
            <button v-if="step === 'form'" type="button" class="drawer__icon" :aria-label="cartCopy.back" @click="goTo('cart')">
              <i class="fa-solid fa-arrow-left"></i>
            </button>
            <h2 id="cart-title" class="drawer__title">
              {{ step === 'form' ? site.cart.formTitle : site.cart.title }}
              <span v-if="cart.count && step !== 'success'" class="drawer__count">{{ cart.count }}</span>
            </h2>
            <button type="button" class="drawer__icon drawer__icon--dark" :aria-label="cartCopy.close" @click="close">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </header>

          <ol v-if="!empty && step !== 'success'" class="drawer__steps" aria-hidden="true">
            <li :class="{ on: step === 'cart' }"><span>1</span>{{ cartCopy.stepCart }}</li>
            <li :class="{ on: step === 'form' }"><span>2</span>{{ cartCopy.stepForm }}</li>
          </ol>

          <div ref="body" class="drawer__body">
            <CartSuccess v-if="step === 'success'" :order="order" :blocked="popupBlocked" @open="openWhatsapp" @close="close" />
            <CartEmpty v-else-if="empty" @browse="close" />
            <ul v-else-if="step === 'cart'" class="drawer__list">
              <CartItemRow v-for="item in cart.items" :key="`${item.slug}-${item.size}`" :item="item" @navigate="close" />
            </ul>
            <form v-else id="checkout-form" novalidate @submit.prevent="submit">
              <CartForm />
            </form>
          </div>

          <footer v-if="!empty && step !== 'success'" class="drawer__foot">
            <CartSummary :compact="step === 'form'" />
            <p v-if="errors.general" class="drawer__error" role="alert">
              <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i>{{ errors.general }}
            </p>
            <button v-if="step === 'cart'" type="button" class="btn btn--dark btn--dot drawer__cta" @click="goTo('form')">
              {{ site.cart.checkout }}
            </button>
            <button v-else type="submit" form="checkout-form" class="btn btn--primary drawer__cta" :disabled="sending">
              <i :class="sending ? 'fa-solid fa-spinner fa-spin' : 'fa-brands fa-whatsapp'" aria-hidden="true"></i>
              {{ sending ? cartCopy.sending : site.cart.send }}
            </button>
            <p class="drawer__legal">{{ site.cart.disclaimer }}</p>
          </footer>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.drawer {
  position: fixed;
  inset: 0;
  z-index: 260;
  background: $overlay;
  @include flex(column, stretch, flex-end);

  @include from('md') {
    flex-direction: row;
    justify-content: flex-end;
  }

  &__panel {
    @include flex(column, stretch, flex-start);
    height: calc(100dvh - 10px);
    background: $paper;
    border-radius: $radius-lg $radius-lg 0 0;
    outline: none;
    overflow: hidden;

    @include from('md') {
      width: 470px;
      height: 100%;
      border-radius: $radius-lg 0 0 $radius-lg;
    }
  }

  &__head {
    @include flex(row, center, flex-start, 0.6rem);
    padding: 1.1rem 1.1rem 0.6rem 1.25rem;
  }

  &__title {
    flex: 1;
    @include display(2.6rem, $ink);
    @include flex(row, center, flex-start, 0.6rem);
  }

  &__count {
    min-width: 30px;
    height: 30px;
    padding-inline: 8px;
    border-radius: $radius-pill;
    background: $accent;
    font-size: 1.1rem;
    @include flex(row, center, center);
    padding-top: 0.12em;
  }

  &__icon {
    width: 46px;
    height: 46px;
    flex-shrink: 0;
    border-radius: 50%;
    border: 1.5px solid $ink;
    @include flex(row, center, center);

    &--dark {
      background: $ink;
      color: $surface;
      border-color: $ink;

      &:hover {
        background: $accent;
        color: $ink;
      }
    }
  }

  &__steps {
    list-style: none;
    @include flex(row, center, flex-start, 1rem);
    padding: 0 1.25rem 0.8rem;
    font-size: 0.74rem;
    font-weight: 700;
    color: $ink-muted;

    li {
      @include flex(row, center, flex-start, 0.4rem);

      &.on {
        color: $ink;

        span {
          background: $ink;
          color: $accent;
        }
      }
    }

    span {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: $line;
      @include flex(row, center, center);
      font-size: 0.68rem;
    }
  }

  &__body {
    flex: 1;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 0.2rem 1rem 1rem;
    @include flex(column, stretch, flex-start);
  }

  &__list {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.5rem);
  }

  &__foot {
    @include flex(column, stretch, flex-start, 0.8rem);
    padding: 1rem 1.25rem calc(1rem + env(safe-area-inset-bottom));
    background: $surface;
    border-top: 1.5px solid $ink;
  }

  &__error {
    @include flex(row, flex-start, flex-start, 0.5rem);
    padding: 0.7rem 0.9rem;
    border-radius: $radius-sm;
    background: $danger-bg;
    color: $danger;
    font-size: 0.85rem;
    font-weight: 600;

    i {
      margin-top: 0.2em;
    }
  }

  &__cta {
    width: 100%;
    min-height: 56px;
    font-size: 1.2rem;
  }

  &__legal {
    font-size: 0.7rem;
    line-height: 1.4;
    color: $ink-muted;
    text-align: center;
  }
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.35s ease;

  .drawer__panel {
    transition: transform 0.5s $ease;
  }
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;

  .drawer__panel {
    transform: translateY(100%);

    @include from('md') {
      transform: translateX(100%);
    }
  }
}
</style>
