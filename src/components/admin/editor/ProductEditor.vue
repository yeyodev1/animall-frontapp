<script setup lang="ts">
import { nextTick, ref, toRef, watch } from 'vue'
import EditorBasics from './EditorBasics.vue'
import EditorVariants from './EditorVariants.vue'
import EditorImage from './EditorImage.vue'
import { adminCopy } from '@/components/admin/adminCopy'
import { useProductForm } from '@/composables/admin/useProductForm'
import { useBodyScroll } from '@/composables/useBodyScroll'
import type { Product } from '@/types'

const props = defineProps<{ open: boolean; product: Product | null }>()
const emit = defineEmits<{ close: []; saved: [product: Product] }>()

const copy = adminCopy.editor
const editor = useProductForm()
const { form, variants, currentImage, previewUrl, pendingFile, saving, error, isNew, suggestions } = editor
const panel = ref<HTMLElement | null>(null)

useBodyScroll(toRef(props, 'open'))

watch(
  () => props.open,
  async (open) => {
    if (!open) return
    editor.reset(props.product)
    await nextTick()
    panel.value?.querySelector<HTMLInputElement>('#ed-name')?.focus()
  },
  { immediate: true },
)

async function submit() {
  const product = await editor.save()
  if (!product) return
  emit('saved', product)
  // Si la foto falló, el producto ya existe: el editor queda abierto con el aviso.
  if (!error.value) emit('close')
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && !saving.value) emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="open" class="drawer" @click.self="emit('close')" @keydown="onKey">
        <form
          ref="panel"
          class="drawer__panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ed-title"
          novalidate
          @submit.prevent="submit"
        >
          <header class="drawer__head">
            <h2 id="ed-title" class="drawer__title">{{ isNew ? copy.createTitle : copy.editTitle }}</h2>
            <button type="button" class="drawer__close" :aria-label="copy.close" @click="emit('close')">
              <i class="fa-solid fa-xmark" aria-hidden="true"></i>
            </button>
          </header>

          <div class="drawer__body">
            <EditorImage
              :current="currentImage"
              :preview="previewUrl"
              :pending="Boolean(pendingFile)"
              :set-file="editor.setFile"
            />
            <EditorVariants
              :rows="variants"
              :warn="editor.pvcAboveFunda"
              @add="editor.addVariant"
              @remove="editor.removeVariant"
            />
            <!-- Al crear, los datos van primero; al editar, lo más tocado (precios) queda arriba. -->
            <EditorBasics :form="form" :suggestions="suggestions" :style="{ order: isNew ? -1 : 0 }" />
          </div>

          <footer class="drawer__foot">
            <p v-if="error" class="drawer__error" role="alert">
              <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i> {{ error }}
            </p>
            <div class="drawer__actions">
              <button type="button" class="btn btn--ghost" :disabled="saving" @click="emit('close')">
                {{ copy.cancel }}
              </button>
              <button type="submit" class="btn btn--dark btn--dot drawer__save" :disabled="saving" :aria-busy="saving">
                <i v-if="saving" class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
                {{ saving ? copy.saving : copy.save }}
              </button>
            </div>
          </footer>
        </form>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.drawer {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba($ink, 0.55);
  @include flex(row, stretch, flex-end);

  &__panel {
    width: 100%;
    height: 100%;
    background: $surface;
    @include flex(column, stretch, flex-start);

    @include from('md') {
      width: min(640px, 92vw);
      box-shadow: $shadow-lg;
    }
  }

  &__head {
    flex: none;
    @include flex(row, center, space-between, 1rem);
    padding: 0.75rem 0.75rem 0.75rem 1.25rem;
    border-bottom: 1px solid $line;
  }

  &__title {
    @include display(1.9rem, $ink);
  }

  &__close {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    font-size: 1.2rem;
    @include flex(row, center, center);

    &:hover {
      background: $sand;
    }
  }

  &__body {
    flex: 1;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 1.25rem;
    @include flex(column, stretch, flex-start, 1.8rem);
  }

  &__foot {
    flex: none;
    border-top: 1px solid $line;
    padding: 0.75rem 1.25rem calc(0.75rem + env(safe-area-inset-bottom));
    @include flex(column, stretch, flex-start, 0.6rem);
    background: $surface;
  }

  &__error {
    @include flex(row, center, flex-start, 0.5rem);
    padding: 0.6rem 0.8rem;
    border-radius: $radius-sm;
    background: $danger-bg;
    color: #ae2a1d;
    font-size: 0.85rem;
    font-weight: 600;
  }

  &__actions {
    @include flex(row, center, flex-end, 0.6rem);

    .btn {
      flex: 1;

      @include from('md') {
        flex: none;
      }
    }
  }

  &__save {
    min-width: 150px;
  }
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.25s ease;

  .drawer__panel {
    transition: transform 0.35s $ease;
  }
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;

  .drawer__panel {
    transform: translateX(40px);
  }
}
</style>
