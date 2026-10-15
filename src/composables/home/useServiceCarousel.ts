import { ref } from 'vue'

/**
 * Estado del carrusel de servicios: índice circular, dirección del cambio
 * (para animar hacia el lado correcto), teclado y swipe.
 */
export function useServiceCarousel(count: number) {
  const index = ref(0)
  const direction = ref<1 | -1>(1)

  const go = (target: number, dir?: 1 | -1) => {
    const next = (target + count) % count
    if (next === index.value) return
    direction.value = dir ?? (next > index.value ? 1 : -1)
    index.value = next
  }
  const next = () => go(index.value + 1, 1)
  const prev = () => go(index.value - 1, -1)

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      next()
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      prev()
    }
  }

  // Swipe con pointer events: sirve igual para touch y para arrastrar con mouse.
  let startX = 0
  let startY = 0
  let tracking = false

  function onPointerDown(e: PointerEvent) {
    if (e.pointerType === 'mouse') return
    tracking = true
    startX = e.clientX
    startY = e.clientY
  }

  function onPointerUp(e: PointerEvent) {
    if (!tracking) return
    tracking = false
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy)) return
    if (dx < 0) next()
    else prev()
  }


  return { index, direction, go, next, prev, onKeydown, onPointerDown, onPointerUp }
}
