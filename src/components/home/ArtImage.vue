<script setup lang="ts">
import { ref, watch } from 'vue'
import TennisBall from './TennisBall.vue'

/**
 * Ilustración con proporción fija: reserva su alto antes de cargar (sin layout
 * shift) y, si la imagen todavía no existe en Cloudinary, muestra un dibujo de
 * reemplazo en vez de un ícono roto.
 */
const props = withDefaults(
  defineProps<{
    src: string
    alt: string
    ratio?: string
    icon?: string
    eager?: boolean
    // Para ilustraciones decorativas que no tienen sentido sin la imagen.
    hideOnError?: boolean
  }>(),
  { ratio: '1 / 1', icon: 'fa-solid fa-paw', eager: false, hideOnError: false },
)

const failed = ref(false)
watch(
  () => props.src,
  () => (failed.value = false),
)
</script>

<template>
  <div v-if="!(failed && hideOnError)" class="art" :style="{ aspectRatio: ratio }">
    <img
      v-if="!failed"
      class="art__img"
      :src="src"
      :alt="alt"
      :loading="eager ? 'eager' : 'lazy'"
      :fetchpriority="eager ? 'high' : 'auto'"
      decoding="async"
      draggable="false"
      @error="failed = true"
    />
    <div v-else class="art__fallback" role="img" :aria-label="alt">
      <span class="art__disc">
        <i :class="icon" aria-hidden="true"></i>
      </span>
      <span class="art__ball"><TennisBall outline /></span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.art {
  position: relative;
  width: 100%;

  &__img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    user-select: none;
  }

  &__fallback {
    position: absolute;
    inset: 0;
    @include flex(row, center, center);
  }

  &__disc {
    @include flex(row, center, center);
    width: 62%;
    max-height: 92%;
    aspect-ratio: 1;
    border-radius: 50%;
    background: $surface;
    border: 2px solid $ink;
    color: $ink;
    container-type: inline-size;

    i {
      font-size: 34cqi;
    }
  }

  &__ball {
    position: absolute;
    width: 20%;
    aspect-ratio: 1;
    right: 16%;
    bottom: 10%;
  }
}
</style>
