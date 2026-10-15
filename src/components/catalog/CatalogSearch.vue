<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { site } from '@/config/site'
import { catalogCopy } from '@/composables/catalog/copy'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

// Copia local para escribir sin esperar a la URL; se publica con debounce.
const text = ref(props.modelValue)
let timer = 0

watch(
  () => props.modelValue,
  (value) => {
    if (value !== text.value.trim()) text.value = value
  },
)

function onInput() {
  window.clearTimeout(timer)
  timer = window.setTimeout(() => emit('update:modelValue', text.value), 350)
}

function flush() {
  window.clearTimeout(timer)
  emit('update:modelValue', text.value)
}

function clearText() {
  text.value = ''
  flush()
}

onBeforeUnmount(() => window.clearTimeout(timer))
</script>

<template>
  <form class="search" role="search" @submit.prevent="flush">
    <label for="catalog-search" class="visually-hidden">{{ catalogCopy.searchLabel }}</label>
    <i class="fa-solid fa-magnifying-glass search__icon" aria-hidden="true"></i>
    <input
      id="catalog-search"
      v-model="text"
      class="search__input"
      type="search"
      enterkeyhint="search"
      autocomplete="off"
      :placeholder="site.catalog.searchPlaceholder"
      @input="onInput"
    />
    <button v-if="text" type="button" class="search__clear" :aria-label="catalogCopy.clearSearch" @click="clearText">
      <i class="fa-solid fa-xmark"></i>
    </button>
  </form>
</template>

<style scoped lang="scss">
.search {
  position: relative;
  width: 100%;
  max-width: 760px;

  &__icon {
    position: absolute;
    left: 1.35rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.05rem;
    color: $ink;
    pointer-events: none;
  }

  &__input {
    height: 62px;
    padding: 0 3.6rem 0 3.3rem;
    border-radius: $radius-pill;
    border: 2px solid $ink;
    background: $surface;
    font-size: 1rem;
    font-weight: 500;
    color: $ink;
    box-shadow: 0 6px 0 $ink;
    transition:
      box-shadow 0.25s $ease,
      transform 0.25s $ease;

    &::placeholder {
      color: $ink-muted;
    }

    &::-webkit-search-cancel-button {
      display: none;
    }

    &:focus {
      border-color: $ink;
      box-shadow: 0 3px 0 $ink;
      transform: translateY(3px);
      outline: 3px solid $accent-deep;
      outline-offset: 3px;
    }

    @include from('md') {
      height: 72px;
      font-size: 1.1rem;
    }
  }

  &__clear {
    position: absolute;
    right: 0.6rem;
    top: 50%;
    transform: translateY(-50%);
    width: 44px;
    height: 44px;
    border-radius: 50%;
    @include flex(row, center, center);
    background: $mint;
    color: $ink;

    &:hover {
      background: $ink;
      color: $surface;
    }
  }
}
</style>
