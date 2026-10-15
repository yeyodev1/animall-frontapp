<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { productImage, type Tone } from '@/composables/catalog/productMedia'

const props = withDefaults(
  defineProps<{ src?: string; alt: string; tone: Tone; width?: number; eager?: boolean; brand?: string }>(),
  { src: '', width: 500, eager: false, brand: '' },
)

const failed = ref(false)
watch(
  () => props.src,
  () => (failed.value = false),
)

const url = computed(() => productImage(props.src, props.width))
</script>

<template>
  <div class="art" :class="`art--${tone}`">
    <span class="art__circle" aria-hidden="true"></span>
    <img
      v-if="url && !failed"
      class="art__img"
      :src="url"
      :alt="alt"
      :loading="eager ? 'eager' : 'lazy'"
      decoding="async"
      @error="failed = true"
    />
    <div v-else class="art__placeholder" role="img" :aria-label="alt">
      <i class="fa-solid fa-paw"></i>
      <span v-if="brand" class="art__brand">{{ brand }}</span>
    </div>
    <slot />
  </div>
</template>

<style scoped lang="scss">
@use 'sass:color';

$tones: (
  mint: ($mint, $surface),
  ball: (color.mix($ball, $surface, 55%), $surface),
  sand: ($sand, $surface),
  leaf: ($mint-strong, color.mix($accent-soft, $surface, 40%)),
  cream: ($paper, $mint-strong),
);

.art {
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: $radius-md;
  overflow: hidden;
  isolation: isolate;

  @each $name, $pair in $tones {
    &--#{$name} {
      background: nth($pair, 1);

      .art__circle {
        background: nth($pair, 2);
      }
    }
  }

  &__circle {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 78%;
    aspect-ratio: 1;
    border-radius: 50%;
    transform: translate(-50%, -46%);
    transition: transform 0.6s $ease;
    z-index: -1;
  }

  &__img {
    position: absolute;
    inset: 9% 12% 7%;
    width: 76%;
    height: 84%;
    object-fit: contain;
    filter: drop-shadow(0 14px 14px rgba($ink, 0.16));
    transition: transform 0.6s $ease;
  }

  &__placeholder {
    position: absolute;
    inset: 0;
    @include flex(column, center, center, 0.4rem);
    color: rgba($accent-deep, 0.45);
    font-size: clamp(2.2rem, 9vw, 3.6rem);
  }

  &__brand {
    @include display(1.05rem, rgba($accent-deep, 0.75));
    max-width: 80%;
    text-align: center;
  }
}
</style>
