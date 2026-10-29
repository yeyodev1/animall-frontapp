<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { productImage, type Tone } from '@/composables/catalog/productMedia'
import { prefersReducedMotion } from '@/composables/catalog/useReducedMotion'
import TennisBall from './TennisBall.vue'

const props = defineProps<{ src: string; alt: string; tone: Tone; brand: string }>()

const root = ref<HTMLElement | null>(null)
const failed = ref(false)
let ctx: gsap.Context | null = null
let onMove: ((e: PointerEvent) => void) | null = null

onMounted(() => {
  const el = root.value
  if (!el || prefersReducedMotion()) return
  ctx = gsap.context(() => {
    gsap.from('.stage__disc', { scale: 0.6, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.08 })
    gsap.from('.stage__img, .stage__ph', { y: 50, rotate: -6, opacity: 0, duration: 1.1, ease: 'expo.out', delay: 0.1 })
    gsap.from('.stage__ball', { y: -220, duration: 1.3, ease: 'bounce.out', delay: 0.3 })

    // Parallax sutil con el puntero: cada capa se mueve distinto según su profundidad.
    const layers = gsap.utils.toArray<HTMLElement>('[data-depth]', el).map((node) => ({
      depth: Number(node.dataset.depth),
      x: gsap.quickTo(node, 'x', { duration: 0.9, ease: 'power3.out' }),
      y: gsap.quickTo(node, 'y', { duration: 0.9, ease: 'power3.out' }),
    }))
    onMove = (e: PointerEvent) => {
      const box = el.getBoundingClientRect()
      const nx = (e.clientX - box.left) / box.width - 0.5
      const ny = (e.clientY - box.top) / box.height - 0.5
      layers.forEach((l) => {
        l.x(nx * l.depth)
        l.y(ny * l.depth)
      })
    }
    el.addEventListener('pointermove', onMove)
  }, el)
})

onBeforeUnmount(() => {
  if (onMove) root.value?.removeEventListener('pointermove', onMove)
  ctx?.revert()
})
</script>

<template>
  <div ref="root" class="stage" :class="`stage--${tone}`">
    <span class="stage__disc stage__disc--a" data-depth="-14" aria-hidden="true"></span>
    <span class="stage__disc stage__disc--b" data-depth="22" aria-hidden="true"></span>
    <span class="stage__disc stage__disc--c" data-depth="-30" aria-hidden="true"></span>
    <div class="stage__layer" data-depth="18">
      <img
        v-if="src && !failed"
        class="stage__img"
        :src="productImage(props.src, 900)"
        :alt="alt"
        width="900"
        height="900"
        fetchpriority="high"
        @error="failed = true"
      />
      <div v-else class="stage__ph" role="img" :aria-label="alt">
        <i class="fa-solid fa-paw"></i>
        <span>{{ brand }}</span>
      </div>
    </div>
    <TennisBall class="stage__ball" data-depth="40" size="clamp(2.8rem, 7vw, 4.4rem)" />
  </div>
</template>

<style scoped lang="scss">
@use 'sass:color';
@use 'sass:list';

$tones: (
  mint: ($mint, $mint-strong, $surface),
  ball: (color.mix($ball, $surface, 45%), color.mix($ball, $surface, 75%), $surface),
  sand: ($sand, $paper, $surface),
  leaf: ($mint-strong, $mint, $surface),
  cream: (color.mix($ball, $surface, 22%), $surface, color.mix($ball, $surface, 50%)),
);

.stage {
  position: relative;
  aspect-ratio: 1;
  border-radius: $radius-lg;
  overflow: hidden;
  isolation: isolate;

  @each $name, $c in $tones {
    &--#{$name} {
      background: list.nth($c, 1);

      .stage__disc--a {
        background: list.nth($c, 2);
      }

      .stage__disc--b {
        background: list.nth($c, 3);
      }

      .stage__disc--c {
        background: list.nth($c, 2);
      }
    }
  }

  &__disc {
    position: absolute;
    border-radius: 50%;
    z-index: -1;

    &--a {
      width: 92%;
      aspect-ratio: 1;
      left: 4%;
      top: 6%;
    }

    &--b {
      width: 62%;
      aspect-ratio: 1;
      left: 19%;
      top: 21%;
    }

    &--c {
      width: 22%;
      aspect-ratio: 1;
      left: -6%;
      bottom: -5%;
    }
  }

  &__layer {
    position: absolute;
    inset: 10%;
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 30px 28px rgba($ink, 0.2));
  }

  &__ph {
    width: 100%;
    height: 100%;
    @include flex(column, center, center, 0.6rem);
    font-size: clamp(4rem, 14vw, 8rem);
    color: rgba($accent-deep, 0.4);

    span {
      @include display($display-sm, rgba($accent-deep, 0.7));
    }
  }

  &__ball {
    position: absolute;
    right: 9%;
    bottom: 10%;
  }
}
</style>
