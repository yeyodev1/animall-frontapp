<script setup lang="ts">
import { ref, toRef } from 'vue'
import { useBodyScroll } from '@/composables/useBodyScroll'
import { useFocusTrap } from '@/composables/cart/useFocusTrap'
import { catalogCopy } from '@/config/site'

const props = defineProps<{ open: boolean; total: number; activeCount: number }>()
const emit = defineEmits<{ close: []; clear: [] }>()

const panel = ref<HTMLElement | null>(null)
useBodyScroll(toRef(props, 'open'))
useFocusTrap(panel, toRef(props, 'open'), () => emit('close'))
</script>

<template>
  <Teleport to="body">
    <Transition name="sheet">
      <div v-if="open" class="sheet" @click.self="emit('close')">
        <div ref="panel" class="sheet__panel" role="dialog" aria-modal="true" :aria-label="catalogCopy.filters" tabindex="-1">
          <header class="sheet__head">
            <h2 class="sheet__title">{{ catalogCopy.filters }}</h2>
            <button v-if="activeCount" type="button" class="sheet__clear" @click="emit('clear')">
              {{ catalogCopy.clear }}
            </button>
            <button type="button" class="sheet__close" aria-label="Cerrar filtros" @click="emit('close')">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </header>
          <div class="sheet__body">
            <slot />
          </div>
          <footer class="sheet__foot">
            <button type="button" class="btn btn--dark btn--dot sheet__cta" @click="emit('close')">
              {{ catalogCopy.showResults(total) }}
            </button>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.sheet {
  position: fixed;
  inset: 0;
  z-index: 250;
  background: $overlay;
  @include flex(column, stretch, flex-end);

  &__panel {
    @include flex(column, stretch, flex-start);
    max-height: 90dvh;
    background: $paper;
    border-radius: $radius-lg $radius-lg 0 0;
    outline: none;
  }

  &__head {
    position: relative;
    @include flex(row, center, flex-start, 0.75rem);
    padding: 1.4rem 1.25rem 0.8rem;

    // Asa del bottom-sheet
    &::before {
      content: '';
      position: absolute;
      top: 0.55rem;
      left: calc(50% - 22px);
      width: 44px;
      height: 4px;
      border-radius: 4px;
      background: rgba($ink, 0.2);
    }
  }

  &__title {
    @include display(2.4rem, $ink);
    flex: 1;
  }

  &__clear {
    font-size: 0.85rem;
    font-weight: 700;
    color: $accent-deep;
    text-decoration: underline;
    text-underline-offset: 3px;
    min-height: 44px;
  }

  &__close {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: $ink;
    color: $surface;
    @include flex(row, center, center);
  }

  &__body {
    flex: 1;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 0.2rem 1.25rem 1rem;
  }

  &__foot {
    padding: 0.9rem 1.25rem calc(0.9rem + env(safe-area-inset-bottom));
    border-top: 1px solid $line;
    background: $paper;
  }

  &__cta {
    width: 100%;
  }
}

.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.3s ease;

  .sheet__panel {
    transition: transform 0.45s $ease;
  }
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;

  .sheet__panel {
    transform: translateY(100%);
  }
}
</style>
