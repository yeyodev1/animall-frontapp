<script setup lang="ts">
import { ref } from 'vue'
import type { Product } from '@/types'
import { productCopy } from '@/composables/catalog/copy'
import ProductCard from './ProductCard.vue'
import DisplayText from './DisplayText.vue'

defineProps<{ items: Product[] }>()

const track = ref<HTMLElement | null>(null)

function scroll(dir: 1 | -1) {
  const el = track.value
  if (!el) return
  el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
}
</script>

<template>
  <section class="related" aria-labelledby="related-title">
    <div class="related__head">
      <h2 id="related-title" class="related__title"><DisplayText :text="productCopy.related" /></h2>
      <div class="related__nav">
        <button type="button" class="related__btn" :aria-label="productCopy.prev" @click="scroll(-1)">
          <i class="fa-solid fa-arrow-left"></i>
        </button>
        <button type="button" class="related__btn" :aria-label="productCopy.next" @click="scroll(1)">
          <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
    <ul ref="track" class="related__track">
      <li v-for="product in items" :key="product._id" class="related__item">
        <ProductCard :product="product" />
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.related {
  @include flex(column, stretch, flex-start, 1.4rem);

  &__head {
    @include flex(row, flex-end, space-between, 1rem);
  }

  &__title {
    @include display($display-md, $ink);
    max-width: 12ch;
  }

  &__nav {
    display: none;

    @include from('md') {
      @include flex(row, center, flex-end, 0.5rem);
    }
  }

  &__btn {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: 1.5px solid $ink;
    @include flex(row, center, center);
    transition:
      background-color 0.2s ease,
      color 0.2s ease;

    &:hover {
      background: $ink;
      color: $accent;
    }
  }

  &__track {
    list-style: none;
    @include flex(row, stretch, flex-start, 0.9rem);
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding-inline: 1.25rem;
    padding: 0.5rem 1.25rem 1.5rem;
    margin-inline: -1.25rem;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    @include from('md') {
      margin-inline: -2rem;
      padding-inline: 2rem;
      scroll-padding-inline: 2rem;
      gap: 1.2rem;
    }
  }

  &__item {
    flex: 0 0 min(62vw, 260px);
    scroll-snap-align: start;
  }
}
</style>
