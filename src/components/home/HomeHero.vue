<script setup lang="ts">
import { computed, ref } from 'vue'
import { art, cld, site, whatsappLink } from '@/config/site'
import { MOTION_OK, useGsap, gsap } from '@/composables/home/useMotion'
import ArtImage from './ArtImage.vue'

const root = ref<HTMLElement | null>(null)

const socialIcons: Record<string, string> = {
  instagram: 'fa-brands fa-instagram',
  facebook: 'fa-brands fa-facebook-f',
  tiktok: 'fa-brands fa-tiktok',
}

// Solo las redes que ya tienen URL; WhatsApp siempre, es el canal de venta.
const socials = computed(() => [
  ...Object.entries(site.social)
    .filter(([, url]) => Boolean(url))
    .map(([key, url]) => ({ key, url, icon: socialIcons[key] ?? 'fa-solid fa-link' })),
  { key: 'whatsapp', url: whatsappLink(), icon: 'fa-brands fa-whatsapp' },
])

useGsap(root, (mm) => {
  mm.add(MOTION_OK, () => {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
    tl.from('[data-hero-line]', { yPercent: 105, duration: 1.1, stagger: 0.07 })
      .from('[data-hero-dog]', { y: 120, opacity: 0, duration: 1.3 }, 0.15)
      .from('[data-hero-fade]', { y: 16, opacity: 0, duration: 0.8, stagger: 0.06 }, 0.5)

    // El perro baja más lento que la página: se hunde en la sección siguiente.
    gsap.to('[data-hero-dog-inner]', {
      yPercent: 8,
      ease: 'none',
      scrollTrigger: { trigger: root.value, start: 'top top', end: 'bottom top', scrub: true },
    })
  })
})
</script>

<template>
  <section ref="root" class="hero" aria-labelledby="hero-title">
    <h1 id="hero-title" class="hero__title">
      <span class="hero__left">
        <span v-for="line in site.hero.titleLeft" :key="line" class="hero__mask">
          <span class="hero__line" data-hero-line>{{ line }}</span>
        </span>
      </span>
      <span class="hero__right">
        <span v-for="line in site.hero.titleRight" :key="line" class="hero__mask">
          <span class="hero__line" data-hero-line>{{ line }}</span>
        </span>
      </span>
    </h1>

    <p class="hero__eyebrow" data-hero-fade>
      {{ site.hero.eyebrow }}
      <i class="fa-solid fa-arrow-down-long" aria-hidden="true"></i>
    </p>

    <div class="hero__copy" data-hero-fade>
      <p class="hero__lead">{{ site.hero.lead }}</p>
      <div class="hero__actions">
        <RouterLink to="/catalogo" class="btn btn--dark btn--dot">{{ site.hero.cta }}</RouterLink>
        <a :href="whatsappLink()" class="hero__wa" target="_blank" rel="noopener">
          <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
          {{ site.hero.ctaSecondary }}
        </a>
      </div>
    </div>

    <ul class="hero__social" data-hero-fade>
      <li v-for="s in socials" :key="s.key">
        <a :href="s.url" target="_blank" rel="noopener" :aria-label="s.key">
          <i :class="s.icon" aria-hidden="true"></i>
        </a>
      </li>
    </ul>

    <div class="hero__dog" data-hero-dog>
      <div data-hero-dog-inner>
        <ArtImage
          :src="cld(art.heroDog, 'f_auto,q_auto,w_1400')"
          alt="Perro pastor blanco ilustrado sosteniendo su correa verde en el hocico"
          ratio="1493 / 2000"
          icon="fa-solid fa-dog"
          eager
        />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
$title-size: clamp(3.2rem, 17.4vw, 6.5rem);
$title-size-lg: clamp(5.5rem, 8.4vw, 10rem);

.hero {
  position: relative;
  // Por encima de la sección siguiente: el perro se sale y la pisa.
  z-index: 2;
  @include flex(column, stretch, flex-start);
  padding: 1.5rem 1.25rem 0;

  @include from('md') {
    padding-inline: 2rem;
  }

  @include from('lg') {
    display: block;
    height: calc(100svh - 76px);
    min-height: 660px;
    max-height: 980px;
    padding: 0;
  }

  &__title {
    @include display($title-size);
    line-height: 0.86;
    order: 1;

    @include from('lg') {
      font-size: $title-size-lg;
    }
  }

  &__left,
  &__right {
    display: block;
    position: relative;
    z-index: 3;
  }

  &__right {
    text-align: right;
    margin-top: 0.08em;

    @include from('lg') {
      position: absolute;
      right: 2rem;
      bottom: 10%;
      margin: 0;
    }
  }

  &__left {
    @include from('lg') {
      position: absolute;
      left: 2rem;
      top: 5%;
    }
  }

  &__mask {
    display: block;
    overflow: hidden;
    // Bayon corta acentos y signos si el recorte es justo.
    padding-top: 0.06em;
    margin-top: -0.06em;
  }

  &__line {
    display: block;
    white-space: nowrap;
  }

  &__eyebrow {
    @include eyebrow;
    order: 0;
    margin-bottom: 1rem;
    @include flex(row, center, flex-start, 0.6rem);

    @include from('lg') {
      position: absolute;
      z-index: 3;
      right: 2rem;
      // Justo encima del titular de la derecha, como en la referencia.
      bottom: calc(10% + 1.8 * #{$title-size-lg} + 1.4rem);
      max-width: 24ch;
      margin: 0;
      @include flex(column, flex-end, flex-start, 0.6rem);
      text-align: right;
      line-height: 1.45;
    }
  }

  &__copy {
    order: 2;
    margin-top: 1.4rem;
    position: relative;
    z-index: 3;

    @include from('lg') {
      position: absolute;
      left: 2rem;
      bottom: 9%;
      max-width: 31ch;
      margin: 0;
    }
  }

  &__lead {
    color: $ink-soft;
    font-size: $text-base;
    max-width: 38ch;
  }

  &__actions {
    @include flex(row, center, flex-start, 0.6rem 1.2rem);
    flex-wrap: wrap;
    margin-top: 1.2rem;
  }

  &__wa {
    @include flex(row, center, center, 0.45rem);
    min-height: 44px;
    font-weight: 600;
    font-size: $text-sm;
    color: $accent-deep;
    text-decoration: underline;
    text-decoration-thickness: 1.5px;
    text-underline-offset: 5px;
    @include transition(color);

    &:hover {
      color: $ink;
    }
  }

  &__social {
    display: none;

    @include from('lg') {
      position: absolute;
      z-index: 3;
      left: 2rem;
      top: calc(5% + 1.8 * #{$title-size-lg} + 2rem);
      list-style: none;
      @include flex(row, center, flex-start, 0.8rem);
    }

    a {
      @include flex(row, center, center);
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: $accent-deep;
      color: $surface;
      font-size: 1.15rem;
      @include transition;

      &:hover {
        background: $ink;
        color: $accent;
        transform: rotate(-12deg) scale(1.06);
      }
    }
  }

  &__dog {
    order: 3;
    position: relative;
    z-index: 2;
    width: min(100%, 460px);
    align-self: center;
    margin-top: 1.5rem;
    // Se sale hacia la sección de abajo.
    margin-bottom: -38%;
    pointer-events: none;

    @include from('md') {
      width: 62%;
    }

    @include from('lg') {
      position: absolute;
      left: 50%;
      top: 11%;
      width: clamp(460px, 45vw, 740px);
      margin: 0 0 0 calc(clamp(460px, 45vw, 740px) / -2);
    }
  }
}
</style>
