<script setup lang="ts">
import { computed, onBeforeUnmount, ref, toRef } from 'vue'
import { gsap } from 'gsap'
import type { Product } from '@/types'
import { site } from '@/config/site'
import { cheapestVariant, savingPercent, toneFor } from '@/composables/catalog/productMedia'
import { useVariantPicker } from '@/composables/catalog/useVariantPicker'
import { useAddToCart } from '@/composables/catalog/useAddToCart'
import { prefersReducedMotion } from '@/composables/catalog/useReducedMotion'
import { catalogCopy } from '@/config/site'
import ProductArt from './ProductArt.vue'
import PriceTag from './PriceTag.vue'
import VariantChips from './VariantChips.vue'

const props = defineProps<{ product: Product }>()

const { index, variants, variant } = useVariantPicker(toRef(props, 'product'))
const { add } = useAddToCart()

const tone = computed(() => toneFor(props.product.slug))
const to = computed(() => `/producto/${props.product.slug}`)
const many = computed(() => variants.value.length > 1)
// Con una sola presentación se muestra su precio; con varias, el "desde" de la más barata
// hasta que el usuario elige una.
const touched = ref(false)
const shown = computed(() => (many.value && !touched.value ? cheapestVariant(props.product) : variant.value))
const percent = computed(() => savingPercent(shown.value))

function pick(i: number) {
  touched.value = true
  index.value = i
}

const root = ref<HTMLElement | null>(null)
const added = ref(false)
let timer = 0
let tween: gsap.core.Timeline | null = null

function onAdd() {
  if (!add(props.product, variant.value)) return
  added.value = true
  window.clearTimeout(timer)
  timer = window.setTimeout(() => (added.value = false), 1600)
  if (prefersReducedMotion() || !root.value) return
  tween?.kill()
  const q = gsap.utils.selector(root.value)
  tween = gsap
    .timeline()
    .fromTo(q('.card__add'), { scale: 0.92 }, { scale: 1, duration: 0.5, ease: 'back.out(3)' }, 0)
    .fromTo(q('.art__img'), { y: -14, rotate: -5 }, { y: 0, rotate: 0, duration: 0.7, ease: 'elastic.out(1, 0.45)' }, 0)
}

onBeforeUnmount(() => {
  tween?.kill()
  window.clearTimeout(timer)
})
</script>

<template>
  <article ref="root" class="card">
    <ProductArt class="card__art" :src="product.image?.url" :alt="product.name" :tone="tone" :brand="product.brand">
      <span v-if="percent > 0" class="card__off">-{{ percent }}%</span>
    </ProductArt>

    <div class="card__body">
      <p v-if="product.brand" class="card__brand">{{ product.brand }}</p>
      <h3 class="card__name">
        <RouterLink :to="to" class="card__link">{{ product.name }}</RouterLink>
      </h3>

      <PriceTag v-if="shown" class="card__price" :pvc="shown.pvc" :pvp="shown.pvp" :from="many && !touched" />

      <VariantChips
        v-if="many"
        class="card__chips"
        :variants="variants"
        :model-value="index"
        :label="catalogCopy.sizeLabel(product.name)"
        @update:model-value="pick"
      />
      <p v-else-if="variant" class="card__size"><span>{{ variant.size }}</span></p>

      <button
        type="button"
        class="btn btn--dot card__add"
        :class="added ? 'card__add--done' : 'btn--dark'"
        :disabled="!variant"
        :aria-label="`${site.catalog.addToCart} ${product.name} ${variant?.size ?? ''}`"
        @click="onAdd"
      >
        <i v-if="added" class="fa-solid fa-check" aria-hidden="true"></i>
        {{ added ? catalogCopy.added : site.catalog.addToCart }}
      </button>
    </div>
  </article>
</template>

<style scoped lang="scss">
.card {
  position: relative;
  @include flex(column, stretch, flex-start);
  height: 100%;
  background: $surface;
  border-radius: $radius-lg;
  padding: 0.5rem 0.5rem 0.75rem;
  transition:
    transform 0.5s $ease,
    box-shadow 0.5s $ease;

  @include from('md') {
    padding: 0.6rem 0.6rem 1rem;
  }

  @media (hover: hover) {
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 22px 40px -18px rgba($ink, 0.22);

      :deep(.art__img) {
        transform: translateY(-4%) rotate(-3deg) scale(1.04);
      }

      :deep(.art__circle) {
        transform: translate(-50%, -46%) scale(1.06);
      }
    }
  }

  &__off {
    position: absolute;
    top: 0.6rem;
    left: 0.6rem;
    padding: 0.32rem 0.6rem 0.24rem;
    border-radius: $radius-pill;
    background: $ink;
    color: $accent;
    font-family: $font-display;
    font-size: 0.95rem;
    line-height: 1;
    letter-spacing: 0.02em;
  }

  &__body {
    @include flex(column, stretch, flex-start, 0.45rem);
    flex: 1;
    padding: 0.8rem 0.35rem 0;

    @include from('md') {
      padding: 1rem 0.55rem 0;
    }
  }

  &__brand {
    font-size: 0.64rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: $accent-deep;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__name {
    font-family: $font-principal;
    font-size: 0.88rem;
    font-weight: 600;
    line-height: 1.25;
    text-transform: none;
    letter-spacing: -0.005em;
    color: $ink;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 2.5em;

    @include from('md') {
      font-size: 0.95rem;
    }
  }

  // Toda la tarjeta es clicable sin anidar botones dentro del enlace.
  &__link {
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      z-index: 1;
    }

    &:focus-visible {
      outline: none;

      &::after {
        outline: 3px solid $accent-deep;
        outline-offset: 3px;
      }
    }
  }

  &__price {
    margin-top: auto;
    padding-top: 0.2rem;
  }

  &__chips,
  &__add {
    position: relative;
    z-index: 2;
  }

  &__size {
    @include flex(row, center);

    span {
      min-height: 32px;
      padding: 0.3rem 0.75rem;
      border-radius: $radius-pill;
      background: $paper;
      font-size: 0.74rem;
      font-weight: 600;
      color: $ink-soft;
      @include flex(row, center);
    }
  }

  &__add {
    width: 100%;
    min-height: 44px;
    margin-top: 0.3rem;
    font-size: 1.05rem;
    padding-inline: 1rem;

    &--done {
      background: $accent;
      color: $ink;
    }
  }
}
</style>
