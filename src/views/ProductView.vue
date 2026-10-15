<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { site } from '@/config/site'
import { formatCents } from '@/utils/format'
import { toneFor } from '@/composables/catalog/productMedia'
import { useProductDetail } from '@/composables/catalog/useProductDetail'
import { useVariantPicker } from '@/composables/catalog/useVariantPicker'
import { catalogCopy, productCopy } from '@/composables/catalog/copy'
import ProductBreadcrumb from '@/components/catalog/ProductBreadcrumb.vue'
import ProductStage from '@/components/catalog/ProductStage.vue'
import ProductInfo from '@/components/catalog/ProductInfo.vue'
import PriceTag from '@/components/catalog/PriceTag.vue'
import VariantTable from '@/components/catalog/VariantTable.vue'
import ProductBuy from '@/components/catalog/ProductBuy.vue'
import RelatedCarousel from '@/components/catalog/RelatedCarousel.vue'
import ProductNotFound from '@/components/catalog/ProductNotFound.vue'
import CatalogEmpty from '@/components/catalog/CatalogEmpty.vue'

const route = useRoute()
const slug = computed(() => String(route.params.slug ?? ''))
const { product, related, loading, notFound, error, reload } = useProductDetail(slug)
const { index, variants, variant, saving, percent } = useVariantPicker(product)
const tone = computed(() => toneFor(slug.value))
</script>

<template>
  <div class="pdp">
    <ProductNotFound v-if="notFound" />

    <div v-else-if="error" class="pdp__wrap">
      <CatalogEmpty :error="error" @retry="reload" />
    </div>

    <div v-else-if="loading && !product" class="pdp__wrap pdp__top" aria-busy="true">
      <div class="pdp__media"><div class="pdp__sk pdp__sk--stage"></div></div>
      <div class="pdp__content">
        <div class="pdp__sk pdp__sk--line"></div>
        <div class="pdp__sk pdp__sk--title"></div>
        <div class="pdp__sk pdp__sk--title pdp__sk--short"></div>
        <div class="pdp__sk pdp__sk--block"></div>
      </div>
    </div>

    <template v-else-if="product">
      <div class="pdp__wrap">
        <ProductBreadcrumb
          class="pdp__crumbs"
          :category="product.category"
          :category-slug="product.categorySlug"
          :name="product.name"
        />
      </div>

      <div :key="product.slug" class="pdp__wrap pdp__top">
        <div class="pdp__media">
          <ProductStage
            :src="product.image?.url ?? ''"
            :alt="product.name"
            :tone="tone"
            :promo="variant?.promo ?? null"
            :brand="product.brand"
          />
        </div>

        <div class="pdp__content">
          <ProductInfo :product="product" />

          <div v-if="variant" class="pdp__price">
            <PriceTag :pvc="variant.pvc" :pvp="variant.pvp" size="lg" />
            <p v-if="saving > 0" class="pdp__saving">
              <strong>{{ catalogCopy.saving }} {{ formatCents(saving) }}</strong>
              <span>-{{ percent }}%</span>
            </p>
          </div>

          <VariantTable v-if="variants.length" v-model="index" :variants="variants" :name="product.slug" />

          <ProductBuy :product="product" :variant="variant" />

          <ul class="pdp__perks">
            <li v-for="perk in productCopy.perks" :key="perk"><i class="fa-solid fa-check" aria-hidden="true"></i>{{ perk }}</li>
          </ul>
          <p class="pdp__note">{{ site.cart.disclaimer }}</p>
        </div>
      </div>

      <div v-if="related.length" class="pdp__related">
        <div class="pdp__wrap">
          <RelatedCarousel :items="related" />
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.pdp {
  padding-bottom: $space-section;

  &__wrap {
    @include container(1320px);
  }

  &__crumbs {
    padding-block: 1rem 0.6rem;
  }

  &__top {
    @include flex(column, stretch, flex-start, 1.8rem);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
      gap: clamp(2.5rem, 5vw, 5rem);
      padding-top: 0.5rem;
    }
  }

  &__media {
    @include from('lg') {
      flex: 1 1 52%;
      position: sticky;
      top: 84px;
    }
  }

  &__content {
    @include flex(column, stretch, flex-start, 1.6rem);

    @include from('lg') {
      flex: 1 1 48%;
      min-width: 0;
      padding-top: 1rem;
    }
  }

  &__price {
    @include flex(row, flex-end, space-between, 1rem);
    flex-wrap: wrap;
    padding-block: 1.2rem;
    border-block: 1.5px solid $ink;
  }

  &__saving {
    @include flex(column, flex-end, center, 0.1rem);
    padding: 0.7rem 1.1rem 0.6rem;
    border-radius: $radius-md;
    background: $ink;
    color: $surface;
    text-align: right;

    strong {
      font-size: 0.82rem;
      font-weight: 700;
    }

    span {
      font-family: $font-display;
      font-size: 2rem;
      line-height: 1;
      color: $accent;
    }
  }

  &__perks {
    list-style: none;
    @include flex(column, flex-start, flex-start, 0.45rem);
    font-size: 0.88rem;
    font-weight: 600;

    li {
      @include flex(row, center, flex-start, 0.6rem);
    }

    i {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: $accent;
      font-size: 0.6rem;
      @include flex(row, center, center);
    }
  }

  &__note {
    font-size: 0.78rem;
    color: $ink-muted;
  }

  &__related {
    margin-top: $space-xl;
    padding-block: $space-xl;
    background: $mint;
    overflow: hidden;
  }

  &__sk {
    border-radius: $radius-md;
    background: $sand;
    animation: pulse 1.4s ease-in-out infinite;

    &--stage {
      aspect-ratio: 1;
      border-radius: $radius-lg;
      background: $mint;
    }

    &--line {
      height: 14px;
      width: 40%;
    }

    &--title {
      height: 64px;
    }

    &--short {
      width: 60%;
    }

    &--block {
      height: 220px;
    }
  }
}

@keyframes pulse {
  50% {
    opacity: 0.55;
  }
}
</style>
