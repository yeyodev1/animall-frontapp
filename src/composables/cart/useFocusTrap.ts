import { nextTick, onBeforeUnmount, watch, type Ref } from 'vue'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Focus trap básico para paneles modales: al abrir enfoca el primer control,
 * Tab no sale del panel, Esc cierra y al cerrar devuelve el foco a quien abrió.
 */
export function useFocusTrap(container: Ref<HTMLElement | null>, active: Ref<boolean>, onEscape: () => void) {
  let previous: HTMLElement | null = null

  function focusables(): HTMLElement[] {
    if (!container.value) return []
    return [...container.value.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null)
  }

  function onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault()
      onEscape()
      return
    }
    if (event.key !== 'Tab') return
    const list = focusables()
    if (!list.length) return
    const first = list[0]
    const last = list[list.length - 1]
    if (!first || !last) return
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  watch(active, async (on) => {
    if (on) {
      previous = document.activeElement as HTMLElement | null
      document.addEventListener('keydown', onKeydown)
      await nextTick()
      // El panel en sí recibe el foco: así el lector anuncia el diálogo sin saltar a un botón.
      container.value?.focus()
    } else {
      document.removeEventListener('keydown', onKeydown)
      previous?.focus?.()
      previous = null
    }
  })

  onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
}
