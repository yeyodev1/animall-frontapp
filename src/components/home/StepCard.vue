<script setup lang="ts">
import { cld } from '@/config/site'
import ArtImage from './ArtImage.vue'

defineProps<{
  item: { number: string; title: string; text: string; art: string }
  tag: string
  icon: string
}>()
</script>

<template>
  <article class="step">
    <span class="step__tag">{{ tag }}</span>
    <h3 class="step__title">{{ item.title }}</h3>
    <p class="step__number">{{ item.number }}</p>
    <p class="step__text">{{ item.text }}</p>
    <div class="step__art">
      <ArtImage :src="cld(item.art, 'f_auto,q_auto,w_700')" :alt="item.title" ratio="2000 / 1493" :icon="icon" />
    </div>
  </article>
</template>

<style scoped lang="scss">
.step {
  position: relative;
  background: $surface;
  border-radius: 8px;
  padding: 1.6rem 1.1rem 1.1rem;
  box-shadow: 0 2px 4px rgba($ink, 0.04), 0 22px 50px rgba($ink, 0.12);
  @include flex(column, center, flex-start);
  text-align: center;

  &__tag {
    position: absolute;
    top: -0.85rem;
    left: 1.4rem;
    @include eyebrow;
    color: $ink-soft;
    background: $surface;
    padding: 0.35rem 0.7rem;
    border-radius: 6px 6px 0 0;
  }

  &__title {
    @include display(clamp(2rem, 1.6rem + 1.2vw, 2.6rem), $ink);
    line-height: 0.92;
    min-height: 1.84em;
    @include flex(row, center, center);
  }

  &__number {
    @include display(clamp(3.4rem, 2.8rem + 2vw, 4.6rem), $accent-deep);
    margin-top: 0.6rem;
  }

  &__text {
    font-size: $text-xs;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    line-height: 1.45;
    color: $ink-soft;
    margin-top: 0.5rem;
    min-height: 4.4em;
    max-width: 30ch;
  }

  &__art {
    width: 100%;
    margin-top: 1rem;
    border-radius: 4px;
    background: var(--step-bg, #{$mint});
    padding: 0.6rem;
  }
}
</style>
