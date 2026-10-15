import { onBeforeUnmount, onMounted, type Ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }

/** Media query que cumple quien acepta movimiento. Úsala en gsap.matchMedia(). */
export const MOTION_OK = '(prefers-reduced-motion: no-preference)'

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Corre animaciones GSAP acotadas al elemento raíz del componente.
 * Todo lo creado dentro del contexto (tweens, ScrollTriggers, matchMedia)
 * se revierte al desmontar: navegar fuera del home no deja triggers huérfanos.
 */
export function useGsap(scope: Ref<HTMLElement | null>, setup: (mm: gsap.MatchMedia) => void) {
  let ctx: gsap.Context | null = null

  onMounted(() => {
    if (!scope.value) return
    ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      setup(mm)
    }, scope.value)
  })

  onBeforeUnmount(() => {
    ctx?.revert()
    ctx = null
  })
}
