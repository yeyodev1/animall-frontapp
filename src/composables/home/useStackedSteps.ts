import type { Ref } from 'vue'
import { gsap, useGsap } from './useMotion'

const DESKTOP = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)'
const MOBILE = '(max-width: 1023px) and (prefers-reduced-motion: no-preference)'

/**
 * Desktop: la sección se fija y, con el scroll, las tarjetas entran desde abajo
 * una por una y quedan apiladas y rotadas sobre el título.
 * Mobile: carrusel con scroll-snap; solo un fade de entrada.
 */
export function useStackedSteps(root: Ref<HTMLElement | null>) {
  useGsap(root, (mm) => {
    mm.add(DESKTOP, () => {
      const cards = gsap.utils.toArray<HTMLElement>('[data-step]')
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: {
          trigger: '[data-steps-pin]',
          start: 'top top',
          end: () => `+=${window.innerHeight * cards.length * 0.7}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
      tl.from('[data-steps-title]', { scale: 0.88, duration: 0.6 }, 0)
      cards.forEach((card, i) => {
        tl.from(
          card,
          { y: () => window.innerHeight, rotation: i % 2 ? 22 : -22, xPercent: (i - 1.5) * 18, duration: 1 },
          0.3 + i * 0.85,
        )
      })
      tl.to({}, { duration: 0.5 })
    })

    mm.add(MOBILE, () => {
      gsap.from('[data-step]', {
        y: 60,
        opacity: 0,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.1,
        scrollTrigger: { trigger: '[data-steps-row]', start: 'top 85%' },
      })
    })
  })
}
