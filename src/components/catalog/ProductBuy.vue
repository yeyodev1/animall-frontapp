<script setup lang="ts">
import { ref } from 'vue'
import type { Product, Variant } from '@/types'
import { useCartStore } from '@/stores/cart'
import { useAddToCart } from '@/composables/catalog/useAddToCart'
import { useCheckout } from '@/composables/cart/useCheckout'
import { productCopy } from '@/composables/catalog/copy'
import QtyStepper from './QtyStepper.vue'

const props = defineProps<{ product: Product; variant: Variant | undefined }>()

const cart = useCartStore()
const { add } = useAddToCart()
const { goTo } = useCheckout()
const qty = ref(1)

function addToCart() {
  if (add(props.product, props.variant, qty.value, true)) qty.value = 1
}

// "Pedir por WhatsApp" agrega y abre el carrito directo en el paso de datos.
function orderNow() {
  if (!add(props.product, props.variant, qty.value)) return
  qty.value = 1
  goTo('form')
  cart.open()
}
</script>

<template>
  <div class="buy">
    <div class="buy__row">
      <QtyStepper
        v-model="qty"
        :label="productCopy.qty"
        :dec-label="productCopy.decrease"
        :inc-label="productCopy.increase"
      />
      <button type="button" class="btn btn--dark btn--dot buy__add" :disabled="!variant" @click="addToCart">
        {{ productCopy.addToCart }}
      </button>
    </div>
    <button type="button" class="btn btn--primary buy__wa" :disabled="!variant" @click="orderNow">
      <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
      {{ productCopy.orderWhatsapp }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.buy {
  @include flex(column, stretch, flex-start, 0.6rem);

  &__row {
    @include flex(row, stretch, flex-start, 0.6rem);
  }

  &__add {
    flex: 1;
    min-height: 52px;
  }

  &__wa {
    min-height: 56px;
    font-size: 1.05rem;
    text-align: center;

    @include from('sm') {
      font-size: 1.2rem;
    }

    i {
      font-size: 1.3em;
      margin-top: -0.15em;
    }
  }
}
</style>
