<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { art, cld, site } from '@/config/site'
import { prefersReducedMotion } from '@/composables/catalog/useReducedMotion'
import { catalogCopy } from '@/config/site'
import TennisBall from './TennisBall.vue'

defineProps<{ total: number | null; superPremium: boolean }>()

const root = ref<HTMLElement | null>(null)
let ctx: gsap.Context | null = null

onMounted(() => {
  if (prefersReducedMotion() || !root.value) return
  ctx = gsap.context(() => {
    gsap.from('.hero__word', { yPercent: 105, duration: 1, ease: 'expo.out', stagger: 0.06 })
    gsap.from('.hero__pet', { y: 60, opacity: 0, duration: 1.1, ease: 'expo.out', delay: 0.15 })
    gsap.from('.hero__ball', { y: -160, duration: 1.2, ease: 'bounce.out', delay: 0.25 })
  }, root.value)
})

onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <section ref="root" class="hero">
    <div class="hero__inner">
      <div class="hero__copy">
        <p class="hero__eyebrow">
          <span class="hero__dot" aria-hidden="true"></span>
          {{ superPremium ? catalogCopy.superPremium : site.name }}
          <template v-if="total"> · {{ catalogCopy.results(total) }}</template>
        </p>
        <h1 class="hero__title">
          <span class="hero__mask"><span class="hero__word">{{ site.catalog.title }}</span></span>
        </h1>
        <p class="hero__lead">{{ site.catalog.lead }}</p>
        <p class="hero__promise"><i class="fa-solid fa-tag" aria-hidden="true"></i>{{ site.promise }}</p>
      </div>
      <div class="hero__tools"><slot /></div>
    </div>

    <img class="hero__pet" :src="cld(art.heroCat, 'f_auto,q_auto,w_520')" alt="" width="520" height="520" />
    <TennisBall class="hero__ball" size="clamp(2.6rem, 6vw, 4.6rem)" />
    <span class="hero__ring" aria-hidden="true"></span>
  </section>
</template>

<style scoped lang="scss">
.hero {
  position: relative;
  background: $mint;
  overflow: hidden;
  isolation: isolate;

  &__inner {
    @include container(1320px);
    @include flex(column, stretch, flex-start, 1.6rem);
    padding-block: 1.8rem 1.4rem;

    @include from('md') {
      padding-block: 3rem 2.4rem;
    }
  }

  &__copy {
    @include flex(column, flex-start, flex-start, 0.9rem);
    max-width: 760px;
  }

  &__tools {
    @include flex(column, stretch, flex-start, 1.1rem);

    @include from('md') {
      max-width: 68%;
    }
  }

  &__eyebrow {
    @include eyebrow;
    @include flex(row, center, flex-start, 0.5rem);
    color: $ink;
  }

  &__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: $accent-deep;
  }

  &__title {
    @include display($display-xl, $ink);
    line-height: 0.82;
    margin-left: -0.04em;
  }

  &__mask {
    display: block;
    overflow: hidden;
    padding-top: 0.06em;
  }

  &__word {
    display: block;
  }

  &__lead {
    font-size: $text-base;

    @include from('md') {
      font-size: $text-lg;
    }

    font-weight: 500;
    line-height: 1.4;
    color: $ink-soft;
    max-width: min(44ch, 66%);

    @include from('md') {
      max-width: 44ch;
    }
  }

  &__promise {
    @include flex(row, center, flex-start, 0.55rem);
    padding: 0.5rem 0.95rem 0.45rem;
    font-size: 0.78rem;
    border-radius: $radius-pill;
    background: $ink;
    color: $accent;
    font-weight: 600;

    i {
      font-size: 0.8em;
    }
  }

  &__pet {
    position: absolute;
    z-index: -1;
    right: -2.2rem;
    top: 5.5rem;
    width: clamp(150px, 40vw, 440px);
    height: auto;
    pointer-events: none;

    @include from('md') {
      right: 4%;
      top: auto;
      bottom: -3rem;
    }
  }

  &__ball {
    position: absolute;
    z-index: -1;
    right: 1.2rem;
    top: 1.2rem;

    @include from('md') {
      right: 30%;
      top: 18%;
    }
  }

  &__ring {
    position: absolute;
    z-index: -2;
    width: clamp(320px, 60vw, 760px);
    aspect-ratio: 1;
    border-radius: 50%;
    background: $mint-strong;
    right: -18%;
    top: -30%;

    @include from('md') {
      right: -6%;
      top: -45%;
    }
  }
}
</style>
