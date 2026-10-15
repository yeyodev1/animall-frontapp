<script setup lang="ts">
import { computed, ref } from 'vue'
import { adminCopy } from '@/components/admin/adminCopy'
import { thumbUrl } from '@/composables/admin/adminFormat'

const props = defineProps<{ current: string; preview: string; pending: boolean; setFile: (f: File | null) => string }>()
const copy = adminCopy.editor
const input = ref<HTMLInputElement | null>(null)
const dragging = ref(false)
const fileError = ref('')

const shown = computed(() => props.preview || thumbUrl(props.current, 600))

function pick(file: File | undefined | null) {
  if (!file) return
  fileError.value = props.setFile(file)
}

function onChange(e: Event) {
  const target = e.target as HTMLInputElement
  pick(target.files?.[0])
  target.value = ''
}

function onDrop(e: DragEvent) {
  dragging.value = false
  pick(e.dataTransfer?.files?.[0])
}
</script>

<template>
  <section class="image" aria-labelledby="ed-image">
    <h3 id="ed-image" class="image__title">{{ copy.sectionImage }}</h3>
    <button
      type="button"
      class="image__drop"
      :class="{ 'is-dragging': dragging, 'has-image': shown }"
      @click="input?.click()"
      @dragover.prevent="dragging = true"
      @dragleave.prevent="dragging = false"
      @drop.prevent="onDrop"
    >
      <img v-if="shown" :src="shown" alt="" class="image__img" />
      <span class="image__cta">
        <i class="fa-solid fa-cloud-arrow-up" aria-hidden="true"></i>
        <strong>{{ shown ? copy.imageChange : copy.imageDrop }}</strong>
        <small>{{ copy.imageHint }}</small>
      </span>
    </button>
    <input ref="input" type="file" accept="image/*" class="visually-hidden" tabindex="-1" aria-hidden="true" @change="onChange" />
    <p v-if="pending" class="image__note" role="status">
      <i class="fa-solid fa-clock" aria-hidden="true"></i> {{ copy.imagePending }}
    </p>
    <p v-if="fileError" class="image__error" role="alert">{{ fileError }}</p>
  </section>
</template>

<style scoped lang="scss">
.image {
  @include flex(column, stretch, flex-start, 0.6rem);

  &__title {
    @include display(1.35rem, $ink);
  }

  &__drop {
    position: relative;
    @include flex(column, center, center, 0.6rem);
    min-height: 180px;
    padding: 1rem;
    border-radius: 14px;
    border: 2px dashed $line;
    background: $paper;
    overflow: hidden;
    text-align: center;
    @include transition(border-color);

    &:hover,
    &.is-dragging {
      border-color: $accent-deep;
      background: $mint;
    }

    &.has-image {
      background: $surface;
    }
  }

  &__img {
    width: 100%;
    max-height: 240px;
    object-fit: contain;
  }

  &__cta {
    @include flex(column, center, center, 0.2rem);
    color: $ink-soft;

    i {
      font-size: 1.5rem;
      color: $accent-deep;
    }

    strong {
      font-size: 0.9rem;
      color: $ink;
    }

    small {
      font-size: 0.75rem;
    }

    .has-image & {
      @include flex(row, center, center, 0.5rem);

      small {
        display: none;
      }

      i {
        font-size: 1rem;
      }
    }
  }

  &__note {
    font-size: 0.8rem;
    color: $ink-soft;
  }

  &__error {
    font-size: 0.82rem;
    color: #ae2a1d;
    font-weight: 600;
  }
}
</style>
