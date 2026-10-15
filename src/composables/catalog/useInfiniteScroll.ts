import { onBeforeUnmount, watch, type Ref } from 'vue'

/**
 * Llama a `onReach` cuando el centinela entra en pantalla (con margen para
 * que la siguiente página llegue antes de tocar fondo). El botón "Cargar más"
 * queda como respaldo para quien no hace scroll o sin IntersectionObserver.
 */
export function useInfiniteScroll(target: Readonly<Ref<HTMLElement | null>>, onReach: () => void, enabled: Ref<boolean>) {
  let observer: IntersectionObserver | null = null

  function stop() {
    observer?.disconnect()
    observer = null
  }

  watch(
    [target, enabled],
    ([el, on]) => {
      stop()
      if (!el || !on || typeof IntersectionObserver === 'undefined') return
      observer = new IntersectionObserver((entries) => entries[0]?.isIntersecting && onReach(), {
        rootMargin: '0px 0px 700px 0px',
      })
      observer.observe(el)
    },
    { flush: 'post' },
  )

  onBeforeUnmount(stop)
}
