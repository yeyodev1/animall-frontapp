<script setup lang="ts">
import { site } from '@/config/site'
import { catalogCopy } from '@/config/site'
import TennisBall from './TennisBall.vue'

defineProps<{ error?: string }>()
const emit = defineEmits<{ clear: []; retry: [] }>()
</script>

<template>
  <div class="empty" role="status">
    <div class="empty__art" aria-hidden="true">
      <span class="empty__circle"><i class="fa-solid fa-paw"></i></span>
      <TennisBall class="empty__ball" size="3.4rem" />
    </div>
    <h2 class="empty__title">{{ error ? catalogCopy.errorTitle : catalogCopy.emptyTitle }}</h2>
    <p class="empty__text">{{ error || site.catalog.empty }} <template v-if="!error">{{ catalogCopy.emptyHint }}</template></p>
    <button v-if="error" type="button" class="btn btn--dark btn--dot" @click="emit('retry')">{{ catalogCopy.retry }}</button>
    <button v-else type="button" class="btn btn--dark btn--dot" @click="emit('clear')">{{ site.catalog.emptyCta }}</button>
  </div>
</template>

<style scoped lang="scss">
.empty {
  @include flex(column, center, center, 0.9rem);
  text-align: center;
  padding: 3rem 1rem 4rem;
  border-radius: $radius-lg;
  background: $surface;

  &__art {
    position: relative;
    margin-bottom: 0.6rem;
  }

  &__circle {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    background: $mint;
    @include flex(row, center, center);
    font-size: 3.4rem;
    color: $accent-deep;
    transform: rotate(-12deg);
  }

  &__ball {
    position: absolute;
    right: -1.2rem;
    bottom: -0.2rem;
  }

  &__title {
    @include display($display-sm, $ink);
  }

  &__text {
    max-width: 38ch;
    color: $ink-soft;
    margin-bottom: 0.5rem;
  }
}
</style>
