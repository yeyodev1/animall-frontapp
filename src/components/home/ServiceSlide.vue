<script setup lang="ts">
import { cld, site, whatsappLink } from '@/config/site'
import ArtImage from './ArtImage.vue'

defineProps<{
  item: { key: string; number: string; title: string; text: string; art: string }
  total: number
}>()

const message = (title: string) => site.services.ctaMessage.replace('{servicio}', title.toLowerCase())

const icons: Record<string, string> = {
  alimento: 'fa-solid fa-bowl-food',
  farmacia: 'fa-solid fa-kit-medical',
  grooming: 'fa-solid fa-shower',
  accesorios: 'fa-solid fa-bone',
}
</script>

<template>
  <div class="slide">
    <div class="slide__visual">
      <span class="slide__circle" aria-hidden="true"></span>
      <div class="slide__art" data-anim data-art>
        <ArtImage :src="cld(item.art, 'f_auto,q_auto,w_900')" :alt="`Ilustración de ${item.title.toLowerCase()} para mascotas`" :icon="icons[item.key]" />
      </div>
      <a
        :href="whatsappLink(message(item.title))"
        class="btn btn--forest btn--dot slide__book"
        target="_blank"
        rel="noopener"
        data-anim
      >
        {{ site.services.cta }}
      </a>
    </div>

    <div class="slide__info">
      <p class="slide__number" data-anim>
        {{ item.number }}<span class="slide__total">/0{{ total }}</span>
      </p>
      <h3 class="slide__title" data-anim>{{ item.title }}</h3>
      <p class="slide__text" data-anim>{{ item.text }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.slide {
  width: 100%;
  @include flex(column, center, flex-start, 1.5rem);

  @include from('lg') {
    flex-direction: row-reverse;
    align-items: center;
    justify-content: space-between;
    gap: 3rem;
  }

  &__visual {
    position: relative;
    width: min(100%, 420px);
    aspect-ratio: 1;
    @include flex(row, center, center);

    @include from('lg') {
      width: min(52vw, 600px);
      margin-right: 6%;
    }
  }

  &__circle {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: $paper;
  }

  &__art {
    position: relative;
    width: 82%;
  }

  &__book {
    position: absolute;
    right: -4%;
    top: 8%;
    transform: rotate(-12deg);
    box-shadow: $shadow-md;

    @include from('lg') {
      right: -10%;
      top: 12%;
      font-size: 1.4rem;
      padding: 1rem 1.9rem 0.9rem;
    }
  }

  &__info {
    width: 100%;
    text-align: center;

    @include from('lg') {
      text-align: left;
      max-width: 30rem;
    }
  }

  &__number {
    @include display(clamp(4.5rem, 3rem + 7vw, 9rem), $accent-deep);
    line-height: 0.8;
  }

  &__total {
    font-size: 0.3em;
    color: rgba($accent-deep, 0.55);
    margin-left: 0.25em;
    vertical-align: top;
  }

  &__title {
    @include display(clamp(2.8rem, 2rem + 4vw, 5.5rem), $ink);
    margin-top: 0.4rem;
  }

  &__text {
    margin: 0.9rem auto 0;
    color: $ink-soft;
    max-width: 34ch;

    @include from('lg') {
      margin-inline: 0;
      font-size: $text-lg;
    }
  }
}
</style>
