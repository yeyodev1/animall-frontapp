import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * Header que se esconde al bajar y vuelve al subir. `scrolled` indica que ya
 * no estamos sobre el hero, para pasar de transparente a fondo crema.
 */
export function useHideOnScroll(threshold = 8) {
  const hidden = ref(false)
  const scrolled = ref(false)
  let last = 0
  let ticking = false

  function update() {
    const y = window.scrollY
    scrolled.value = y > 24
    if (Math.abs(y - last) > threshold) {
      hidden.value = y > last && y > 160
      last = y
    }
    ticking = false
  }

  function onScroll() {
    if (ticking) return
    ticking = true
    requestAnimationFrame(update)
  }

  onMounted(() => {
    last = window.scrollY
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
  })

  onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

  return { hidden, scrolled }
}
