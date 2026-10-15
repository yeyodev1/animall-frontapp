<script setup lang="ts">
import TennisBall from '@/components/home/TennisBall.vue'
import { site } from '@/config/site'

const copy = site.notFound
</script>

<template>
  <section class="not-found">
    <p class="not-found__code" aria-label="Error 404">
      4<span class="not-found__ball"><TennisBall outline /></span>4
    </p>
    <h1 class="not-found__title">{{ copy.title }}</h1>
    <p class="not-found__text">{{ copy.text }}</p>
    <RouterLink to="/" class="btn btn--dark btn--dot">{{ copy.cta }}</RouterLink>
  </section>
</template>

<style scoped lang="scss">
.not-found {
  @include container(720px);
  @include flex(column, center, center, 1rem);
  flex: 1;
  text-align: center;
  padding-block: 4rem $space-section;

  &__code {
    @include display(clamp(8rem, 40vw, 18rem), $accent-deep);
    line-height: 0.8;
    @include flex(row, center, center, 0.04em);
  }

  &__ball {
    display: inline-block;
    width: 0.62em;
    height: 0.62em;
    animation: nf-bounce 1.1s cubic-bezier(0.3, 0, 0.6, 1) infinite alternate;
  }

  &__title {
    @include display($display-md, $ink);
    margin-top: 1rem;
  }

  &__text {
    color: $ink-soft;
    max-width: 40ch;
    margin-bottom: 0.6rem;
  }
}

@keyframes nf-bounce {
  from {
    transform: translateY(-0.25em) rotate(-20deg);
  }
  to {
    transform: translateY(0.05em) rotate(30deg);
  }
}
</style>
