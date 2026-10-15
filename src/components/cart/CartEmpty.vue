<script setup lang="ts">
import { site } from '@/config/site'
import TennisBall from '@/components/catalog/TennisBall.vue'
import DisplayText from '@/components/catalog/DisplayText.vue'

const emit = defineEmits<{ browse: [] }>()
</script>

<template>
  <div class="empty">
    <div class="empty__art" aria-hidden="true">
      <span class="empty__circle"><i class="fa-solid fa-basket-shopping"></i></span>
      <TennisBall class="empty__ball" size="3rem" />
    </div>
    <p class="empty__title"><DisplayText :text="site.cart.empty" /></p>
    <RouterLink to="/catalogo" class="btn btn--dark btn--dot" @click="emit('browse')"><DisplayText :text="site.cart.emptyCta" /></RouterLink>
  </div>
</template>

<style scoped lang="scss">
.empty {
  flex: 1;
  @include flex(column, center, center, 1.1rem);
  text-align: center;
  padding: 2rem 1rem;

  &__art {
    position: relative;
  }

  &__circle {
    width: 130px;
    height: 130px;
    border-radius: 50%;
    background: $mint;
    @include flex(row, center, center);
    font-size: 2.8rem;
    color: $accent-deep;
  }

  &__ball {
    position: absolute;
    right: -0.8rem;
    bottom: 0;
  }

  &__title {
    @include display($display-sm, $ink);
    max-width: 12ch;
  }
}
</style>
