<script setup lang="ts">
import { computed } from 'vue'
import { splitWords } from '@/composables/catalog/display'

const props = defineProps<{ text: string }>()
const words = computed(() => splitWords(props.text))
const plain = computed(() => words.value.every((w) => w.every((p) => !p.mark)))
</script>

<template>
  <template v-if="plain">{{ text }}</template>
  <span v-else role="text" :aria-label="text">
    <template v-for="(word, w) in words" :key="w">
      <span class="word" aria-hidden="true"
        ><template v-for="(part, i) in word" :key="i"
          ><span v-if="part.mark" class="acc" :data-mark="part.mark">{{ part.text }}</span
          ><template v-else>{{ part.text }}</template></template
        ></span
      >{{ w < words.length - 1 ? ' ' : '' }}
    </template>
  </span>
</template>

<style scoped lang="scss">
.word {
  white-space: nowrap;
}

.acc {
  position: relative;
  display: inline-block;

  &::after {
    content: attr(data-mark);
    position: absolute;
    left: 50%;
    top: -0.2em;
    transform: translateX(-40%);
    font-family: $font-principal;
    font-weight: 900;
    font-size: 0.5em;
    line-height: 1;
  }
}
</style>
