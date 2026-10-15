<script setup lang="ts">
import { site } from '@/config/site'
import { useFeatured } from '@/composables/home/useFeatured'
import ProductCard from '@/components/catalog/ProductCard.vue'

const { products, loading } = useFeatured()
</script>

<template>
  <section v-if="loading || products.length" class="featured" aria-labelledby="featured-title" :aria-busy="loading">
    <div class="featured__head">
      <div>
        <p class="featured__eyebrow">
          {{ site.featured.eyebrow }} <i class="fa-solid fa-arrow-down-long" aria-hidden="true"></i>
        </p>
        <h2 id="featured-title" class="featured__title">{{ site.featured.title }}</h2>
      </div>
      <RouterLink to="/catalogo" class="btn btn--dark btn--dot featured__cta">{{ site.featured.cta }}</RouterLink>
    </div>

    <ul class="featured__row">
      <template v-if="loading">
        <li v-for="n in 4" :key="n" class="featured__item">
          <div class="featured__skeleton" aria-hidden="true">
            <span class="featured__sk-img"></span>
            <span class="featured__sk-line"></span>
            <span class="featured__sk-line featured__sk-line--short"></span>
          </div>
        </li>
      </template>
      <li v-for="product in products" v-else :key="product._id" class="featured__item">
        <ProductCard :product="product" />
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.featured {
  background: $paper;
  padding-block: $space-section;
  border-top: 1px solid rgba($accent-deep, 0.25);

  &__head {
    @include container(1320px);
    @include flex(column, flex-start, space-between, 1.5rem);

    @include from('md') {
      flex-direction: row;
      align-items: flex-end;
    }
  }

  &__eyebrow {
    @include eyebrow;
    @include flex(row, center, flex-start, 0.5rem);
    margin-bottom: 0.8rem;
  }

  &__title {
    @include display($display-lg, $accent-deep);
  }

  &__row {
    list-style: none;
    display: flex;
    gap: 1rem;
    margin-top: 2.5rem;
    padding: 0.5rem max(1.25rem, calc((100vw - 1320px) / 2 + 2rem)) 1.5rem;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding-inline: 1.25rem;
    scrollbar-width: thin;
    scrollbar-color: $accent-deep transparent;

    @include from('md') {
      gap: 1.5rem;
    }
  }

  &__item {
    flex: 0 0 min(72vw, 280px);
    scroll-snap-align: start;
  }

  &__skeleton {
    @include flex(column, stretch, flex-start, 0.7rem);
  }

  &__sk-img,
  &__sk-line {
    display: block;
    border-radius: $radius-md;
    background: linear-gradient(90deg, $sand 0%, $paper 50%, $sand 100%);
    background-size: 200% 100%;
    animation: shimmer 1.4s ease-in-out infinite;
  }

  &__sk-img {
    aspect-ratio: 1;
  }

  &__sk-line {
    height: 1rem;
    border-radius: $radius-pill;

    &--short {
      width: 55%;
    }
  }
}

@keyframes shimmer {
  to {
    background-position: -200% 0;
  }
}
</style>
