<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { contacts, site, whatsappLink } from '@/config/site'
import { useBodyScroll } from '@/composables/useBodyScroll'

const open = defineModel<boolean>('open', { required: true })
const closeBtn = ref<HTMLButtonElement | null>(null)

useBodyScroll(open)

watch(open, async (value) => {
  if (!value) return
  await nextTick()
  closeBtn.value?.focus()
})

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}
</script>

<template>
  <Teleport to="body">
    <Transition name="menu">
      <div v-if="open" class="menu" role="dialog" aria-modal="true" aria-label="Menú" @keydown="onKeydown">
        <button ref="closeBtn" type="button" class="menu__close" aria-label="Cerrar menú" @click="open = false">
          <i class="fa-solid fa-xmark" aria-hidden="true"></i>
        </button>

        <nav class="menu__nav" aria-label="Principal">
          <RouterLink
            v-for="(link, i) in site.nav"
            :key="link.to"
            :to="link.to"
            class="menu__link"
            :style="{ '--i': i }"
            @click="open = false"
          >
            {{ link.label }}
          </RouterLink>
        </nav>

        <div class="menu__foot">
          <a
            v-for="c in contacts"
            :key="c.key"
            :href="whatsappLink(undefined, c.whatsapp)"
            class="menu__contact"
            target="_blank"
            rel="noopener"
          >
            <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
            <span>{{ c.name }} · {{ c.phone }}</span>
          </a>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.menu {
  position: fixed;
  inset: 0;
  z-index: 150;
  background: $accent;
  color: $ink;
  padding: 5.5rem 1.25rem 2rem;
  @include flex(column, stretch, space-between, 2rem);
  overflow-y: auto;
  clip-path: circle(150% at calc(100% - 2.5rem) 2rem);

  &__close {
    position: absolute;
    top: 0.6rem;
    right: 0.75rem;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: $ink;
    color: $accent;
    font-size: 1.4rem;
    @include flex(row, center, center);
    @include focus-ring($ink);
  }

  &__nav {
    @include flex(column, flex-start, flex-start, 0.2rem);
  }

  &__link {
    @include display(clamp(3.4rem, 17vw, 6rem), $ink);
    line-height: 0.95;
    @include transition(transform);
    @include focus-ring($ink);
    transition-delay: calc(var(--i) * 40ms);

    &:hover {
      transform: translateX(0.6rem);
    }
  }

  &__foot {
    border-top: 1.5px solid $ink;
    padding-top: 1.2rem;
    @include flex(column, flex-start, flex-start, 0.4rem);
  }

  &__contact {
    @include flex(row, center, flex-start, 0.6rem);
    min-height: 44px;
    font-weight: 600;
    font-size: $text-sm;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
}

.menu-enter-active,
.menu-leave-active {
  transition: clip-path 0.6s $ease;
}

.menu-enter-from,
.menu-leave-to {
  clip-path: circle(0% at calc(100% - 2.5rem) 2rem);
}
</style>
