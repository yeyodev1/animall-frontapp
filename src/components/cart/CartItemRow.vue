<script setup lang="ts">
import type { CartItem } from '@/types'
import { useCartStore } from '@/stores/cart'
import { formatCents } from '@/utils/format'
import { productImage, toneFor } from '@/composables/catalog/productMedia'
import { cartCopy } from '@/config/site'
import QtyStepper from '@/components/catalog/QtyStepper.vue'

const props = defineProps<{ item: CartItem }>()
const emit = defineEmits<{ navigate: [] }>()
const cart = useCartStore()

function setQty(qty: number) {
  cart.setQty(props.item.slug, props.item.size, qty)
}
</script>

<template>
  <li class="row">
    <RouterLink
      :to="`/producto/${item.slug}`"
      class="row__thumb"
      :class="`row__thumb--${toneFor(item.slug)}`"
      tabindex="-1"
      aria-hidden="true"
      @click="emit('navigate')"
    >
      <img v-if="item.image" :src="productImage(item.image, 160)" alt="" loading="lazy" />
      <i v-else class="fa-solid fa-paw"></i>
    </RouterLink>

    <div class="row__body">
      <RouterLink :to="`/producto/${item.slug}`" class="row__name" @click="emit('navigate')">{{ item.name }}</RouterLink>
      <p class="row__meta">
        <span class="row__size">{{ item.size }}</span>
      </p>
      <div class="row__foot">
        <QtyStepper
          size="sm"
          :model-value="item.qty"
          :min="1"
          :label="cartCopy.qtyOf(item.name)"
          :dec-label="cartCopy.decrease(item.name)"
          :inc-label="cartCopy.increase(item.name)"
          @update:model-value="setQty"
        />
        <p class="row__price">
          <strong>{{ formatCents(item.pvc * item.qty) }}</strong>
          <s v-if="item.pvp > item.pvc">{{ formatCents(item.pvp * item.qty) }}</s>
        </p>
      </div>
    </div>

    <button type="button" class="row__remove" :aria-label="cartCopy.remove(item.name)" @click="cart.remove(item.slug, item.size)">
      <i class="fa-regular fa-trash-can"></i>
    </button>
  </li>
</template>

<style scoped lang="scss">
@use 'sass:color';

.row {
  position: relative;
  @include flex(row, flex-start, flex-start, 0.9rem);
  padding: 0.85rem;
  border-radius: $radius-md;
  background: $surface;

  &__thumb {
    flex: 0 0 72px;
    height: 72px;
    border-radius: 50%;
    @include flex(row, center, center);
    background: $mint;
    color: rgba($accent-deep, 0.5);
    font-size: 1.4rem;

    &--ball {
      background: color.mix($ball, $surface, 55%);
    }

    &--sand {
      background: $sand;
    }

    &--leaf {
      background: $mint-strong;
    }

    img {
      width: 82%;
      height: 82%;
      object-fit: contain;
    }
  }

  &__body {
    flex: 1;
    min-width: 0;
    @include flex(column, stretch, flex-start, 0.3rem);
  }

  &__name {
    font-size: 0.88rem;
    font-weight: 700;
    line-height: 1.25;
    padding-right: 2rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;

    &:hover {
      text-decoration: underline;
    }
  }

  &__meta {
    @include flex(row, center, flex-start, 0.4rem);
    flex-wrap: wrap;
  }

  &__size {
    padding: 0.15rem 0.55rem;
    border-radius: $radius-pill;
    background: $paper;
    font-size: 0.72rem;
    font-weight: 600;
  }

  &__foot {
    @include flex(row, center, space-between, 0.6rem);
    margin-top: 0.3rem;
  }

  &__price {
    @include flex(column, flex-end, center);
    text-align: right;

    strong {
      font-family: $font-display;
      font-weight: 400;
      font-size: 1.4rem;
      line-height: 1;
    }

    s {
      font-size: 0.74rem;
      color: $ink-muted;
    }
  }

  &__remove {
    position: absolute;
    top: 0.45rem;
    right: 0.45rem;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    @include flex(row, center, center);
    color: $ink-muted;
    font-size: 0.9rem;

    &:hover {
      background: rgba($danger, 0.1);
      color: $danger;
    }
  }
}
</style>
