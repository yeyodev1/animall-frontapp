<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { cld, photos, site, whatsappLink } from '@/config/site'
import { useCartStore } from '@/stores/cart'
import { useHideOnScroll } from '@/composables/home/useHideOnScroll'
import MobileMenu from '@/components/home/MobileMenu.vue'
import WhatsAppFloat from '@/components/home/WhatsAppFloat.vue'

const route = useRoute()
const cart = useCartStore()
const menuOpen = ref(false)
const { hidden, scrolled } = useHideOnScroll()

watch(() => route.fullPath, () => (menuOpen.value = false))
</script>

<template>
  <header class="header" :class="{ 'is-hidden': hidden && !menuOpen, 'is-scrolled': scrolled }">
    <div class="header__inner">
      <RouterLink to="/" class="header__logo" aria-label="Animall, ir al inicio">
        <img :src="cld(photos.logo, 'f_auto,q_auto,w_220')" alt="Animall" width="220" height="203" />
      </RouterLink>

      <nav class="header__nav" aria-label="Principal">
        <RouterLink
          v-for="link in site.nav"
          :key="link.to"
          :to="link.to"
          class="header__link"
          :class="{ 'is-active': route.path === link.to }"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="header__actions">
        <a :href="whatsappLink()" class="header__icon header__icon--wa" target="_blank" rel="noopener" :aria-label="site.hero.ctaSecondary">
          <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
        </a>
        <button type="button" class="header__icon header__cart" :aria-label="`Abrir carrito, ${cart.count} productos`" @click="cart.open()">
          <i class="fa-solid fa-bag-shopping" aria-hidden="true"></i>
          <span v-if="cart.count" class="header__badge">{{ cart.count > 99 ? '99+' : cart.count }}</span>
        </button>
        <button
          type="button"
          class="header__burger"
          :aria-expanded="menuOpen"
          aria-label="Abrir menú"
          @click="menuOpen = true"
        >
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  </header>

  <MobileMenu v-model:open="menuOpen" />
  <WhatsAppFloat />
</template>

<style scoped lang="scss">
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: transparent;
  transition:
    transform 0.45s $ease,
    background-color 0.3s ease,
    box-shadow 0.3s ease;

  &.is-scrolled {
    background: rgba($paper, 0.9);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    box-shadow: 0 1px 0 rgba($accent-deep, 0.18);
  }

  &.is-hidden {
    transform: translateY(-100%);
  }

  &__inner {
    @include flex(row, center, space-between, 1rem);
    height: 64px;
    padding-inline: 1rem;

    @include from('lg') {
      height: 76px;
      padding-inline: 2rem;
    }
  }

  &__logo {
    flex-shrink: 0;
    @include focus-ring($accent-deep);

    img {
      height: 46px;
      width: auto;

      @include from('lg') {
        height: 58px;
      }
    }
  }

  &__nav {
    display: none;

    @include from('lg') {
      @include flex(row, center, center, 2.4rem);
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  &__link {
    @include eyebrow;
    color: $accent-deep;
    position: relative;
    padding-block: 0.6rem;
    @include focus-ring($accent-deep);

    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0.25rem;
      height: 1.5px;
      background: currentColor;
      transform: scaleX(0);
      transform-origin: right;
      transition: transform 0.35s $ease;
    }

    &:hover::after,
    &.is-active::after {
      transform: scaleX(1);
      transform-origin: left;
    }
  }

  &__actions {
    @include flex(row, center, flex-end, 0.5rem);
  }

  &__icon {
    position: relative;
    width: 46px;
    height: 46px;
    border-radius: 50%;
    font-size: 1.15rem;
    @include flex(row, center, center);
    @include transition;
    @include focus-ring($accent-deep);

    &--wa {
      display: none;
      background: $accent-deep;
      color: $surface;

      @include from('md') {
        display: flex;
      }

      &:hover {
        background: $ink;
        color: $accent;
      }
    }
  }

  &__cart {
    background: $ink;
    color: $surface;

    &:hover {
      background: $accent;
      color: $ink;
    }
  }

  &__badge {
    position: absolute;
    top: -4px;
    right: -4px;
    min-width: 22px;
    height: 22px;
    padding: 0 5px;
    border-radius: $radius-pill;
    background: $ball;
    color: $ink;
    border: 2px solid $paper;
    font-size: 0.7rem;
    font-weight: 700;
    line-height: 18px;
    text-align: center;
  }

  &__burger {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background: $accent;
    @include flex(column, center, center, 5px);
    @include focus-ring($accent-deep);

    @include from('lg') {
      display: none;
    }

    span {
      display: block;
      width: 18px;
      height: 2px;
      border-radius: 2px;
      background: $ink;
    }
  }
}
</style>
