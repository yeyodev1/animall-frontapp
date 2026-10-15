<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { site } from '@/config/site'
import { useBodyScroll } from '@/composables/useBodyScroll'
import { markGateSeen, shouldShowGate } from '@/composables/home/useEntryGate'
import { useGateBall } from '@/composables/home/useGateBall'
import TennisBall from './TennisBall.vue'

const open = ref(shouldShowGate())
const leadLines = site.gate.title.slice(0, -1)
const lastLine = site.gate.title[site.gate.title.length - 1]
useBodyScroll(open)

const root = ref<HTMLElement | null>(null)
const ball = ref<HTMLButtonElement | null>(null)
const body = ref<HTMLElement | null>(null)
const spin = ref<HTMLElement | null>(null)
const shadow = ref<HTMLElement | null>(null)
const skip = ref<HTMLButtonElement | null>(null)

const { bounces, bounce, leave, intro, total } = useGateBall({
  root,
  ball,
  body,
  spin,
  shadow,
  onDone: () => {
    markGateSeen()
    open.value = false
  },
})

onMounted(async () => {
  if (!open.value) return
  window.scrollTo(0, 0)
  await nextTick()
  intro()
  root.value?.focus({ preventScroll: true })
})

// Foco atrapado entre la pelota y "Entrar sin jugar"; Escape también deja entrar.
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.preventDefault()
    leave()
  } else if (e.key === 'Tab') {
    e.preventDefault()
    const next = document.activeElement === ball.value ? skip.value : ball.value
    next?.focus()
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      ref="root"
      class="gate"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-title"
      aria-describedby="gate-hint"
      tabindex="-1"
      @click="bounce"
      @keydown="onKeydown"
    >
      <button ref="skip" type="button" class="gate__skip" data-gate-fade @click.stop="leave">
        {{ site.gate.skip }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
      </button>

      <h2 id="gate-title" class="gate__title">
        <span v-for="line in leadLines" :key="line" class="gate__mask">
          <span class="gate__line" data-gate-line>{{ line }}</span>
        </span>
        <span class="gate__mask">
          <span class="gate__line" data-gate-line>
            {{ lastLine }}
            <span class="gate__ballwrap">
              <button ref="ball" type="button" class="gate__ball" :aria-label="`Rebotar la pelota (${bounces} de ${total})`" @click.stop="bounce">
                <span ref="body" class="gate__body"><span ref="spin" class="gate__spin"><TennisBall outline /></span></span>
              </button>
              <span ref="shadow" class="gate__shadow" aria-hidden="true"></span>
            </span>
          </span>
        </span>
      </h2>

      <div class="gate__foot" data-gate-fade>
        <ol class="gate__dots" aria-hidden="true">
          <li v-for="n in total" :key="n" :class="{ 'is-on': n <= bounces }"></li>
        </ol>
        <p id="gate-hint" class="gate__hint">{{ site.gate.hint }}</p>
        <p class="visually-hidden" aria-live="polite">{{ bounces }} / {{ total }}</p>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.gate {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: $mint;
  @include flex(column, center, center);
  padding: 5rem 1.25rem 7rem;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  will-change: clip-path;
  outline: none;

  // Pelotas de fondo, enormes y apenas visibles: el patrón de la referencia.
  background-image:
    radial-gradient(circle at 8% 112%, rgba($surface, 0.55) 0 22vmax, transparent 22.1vmax),
    radial-gradient(circle at 102% -6%, rgba($surface, 0.55) 0 18vmax, transparent 18.1vmax);

  &__skip {
    position: absolute;
    top: 1.25rem;
    right: 1.25rem;
    @include eyebrow;
    @include flex(row, center, center, 0.5rem);
    min-height: 44px;
    padding: 0 0.9rem;
    border-radius: $radius-pill;
    border: 1.5px solid rgba($accent-deep, 0.35);
    @include transition;
    @include focus-ring($accent-deep);

    &:hover {
      background: $accent-deep;
      border-color: $accent-deep;
      color: $surface;
    }
  }

  &__title {
    @include display(clamp(4rem, 19vw, 11.5rem), $accent-deep);
    line-height: 0.86;
    text-align: center;
    @include flex(column, center, center);
  }

  &__mask {
    display: block;
    overflow: hidden;
    // Espacio para que la pelota pueda subir sin recortarse en la última línea.
    padding-inline: 0.05em;

    &:last-child {
      overflow: visible;
    }
  }

  &__line {
    display: inline-block;
    white-space: nowrap;
  }

  &__ballwrap {
    position: relative;
    display: inline-block;
    width: 0.62em;
    height: 0.62em;
    margin-left: 0.08em;
    vertical-align: 0.02em;
  }

  &__ball {
    position: relative;
    z-index: 1;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    will-change: transform;
    @include focus-ring($accent-deep);
  }

  &__body {
    display: block;
    width: 100%;
    height: 100%;
    transform-origin: 50% 100%;
  }

  &__spin {
    display: block;
    width: 100%;
    height: 100%;
  }

  &__shadow {
    position: absolute;
    left: 8%;
    right: 8%;
    bottom: -0.07em;
    height: 0.09em;
    border-radius: 50%;
    background: $ink;
    opacity: 0.35;
    filter: blur(3px);
  }

  &__foot {
    position: absolute;
    bottom: 1.75rem;
    left: 1.25rem;
    right: 1.25rem;
    @include flex(column, center, center, 0.9rem);
    text-align: center;
  }

  &__dots {
    list-style: none;
    @include flex(row, center, center, 0.45rem);

    li {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      border: 1.5px solid $accent-deep;
      transition: background 0.25s ease, transform 0.25s $ease;

      &.is-on {
        background: $accent-deep;
        transform: scale(1.25);
      }
    }
  }

  &__hint {
    @include eyebrow;
    max-width: 34ch;
    line-height: 1.5;
  }
}
</style>
