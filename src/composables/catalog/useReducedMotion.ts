/** GSAP no lee `prefers-reduced-motion`: cada animación pregunta antes de correr. */
export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
