import { onBeforeUnmount, ref, type Ref } from 'vue'
import { gsap } from './useMotion'

const BOUNCES_TO_ENTER = 3
// Cada rebote sube más que el anterior: el tercero "lanza" la pelota y abre el sitio.
const HEIGHTS = [0.22, 0.32, 0.46]

interface GateRefs {
  root: Ref<HTMLElement | null>
  ball: Ref<HTMLElement | null>
  body: Ref<HTMLElement | null>
  spin: Ref<HTMLElement | null>
  shadow: Ref<HTMLElement | null>
  onDone: () => void
}

/**
 * Física simple de la pelota del gate: sube con desaceleración, cae con
 * aceleración y se aplasta al tocar el piso. Solo anima transform/opacity.
 */
export function useGateBall({ root, ball, body, spin, shadow, onDone }: GateRefs) {
  const bounces = ref(0)
  const leaving = ref(false)
  let tl: gsap.core.Timeline | null = null

  function intro() {
    if (!root.value) return
    const lines = root.value.querySelectorAll('[data-gate-line]')
    gsap.from(lines, { yPercent: 110, duration: 0.9, ease: 'expo.out', stagger: 0.08, delay: 0.1 })
    gsap.from(root.value.querySelectorAll('[data-gate-fade]'), { opacity: 0, y: 12, duration: 0.6, delay: 0.7, stagger: 0.1 })
    if (ball.value) {
      gsap.from(ball.value, { y: -window.innerHeight * 0.6, duration: 1.1, ease: 'bounce.out', delay: 0.45 })
    }
  }

  function leave() {
    if (leaving.value || !root.value) return
    leaving.value = true
    // El sitio aparece por un círculo que se cierra sobre la pelota.
    const rect = ball.value?.getBoundingClientRect()
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2
    const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2
    const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
    gsap.fromTo(
      root.value,
      { clipPath: `circle(${r}px at ${x}px ${y}px)` },
      { clipPath: `circle(0px at ${x}px ${y}px)`, duration: 1, ease: 'expo.inOut', onComplete: onDone },
    )
  }

  function bounce() {
    if (leaving.value || !ball.value || !body.value) return
    const count = Math.min(bounces.value + 1, BOUNCES_TO_ENTER)
    bounces.value = count
    const h = window.innerHeight * (HEIGHTS[count - 1] ?? 0.4)
    const up = 0.32 + count * 0.05

    tl?.kill()
    gsap.set(ball.value, { y: 0 })
    tl = gsap.timeline()
    tl.to(body.value, { scaleX: 1.2, scaleY: 0.8, duration: 0.07, ease: 'power1.out' })
      .to(body.value, { scaleX: 0.92, scaleY: 1.1, duration: 0.12, ease: 'power1.out' })
      .to(ball.value, { y: -h, duration: up, ease: 'power2.out' }, '<')
      .to(spin.value, { rotation: `+=${120 + count * 60}`, duration: up * 2, ease: 'none' }, '<')
      .to(body.value, { scaleX: 1, scaleY: 1, duration: 0.2 }, '<')
      .to(ball.value, { y: 0, duration: up, ease: 'power2.in' }, `<${up}`)
      .to(body.value, { scaleX: 1.22, scaleY: 0.76, duration: 0.07, ease: 'power1.in' })
      .to(body.value, { scaleX: 1, scaleY: 1, duration: 0.35, ease: 'elastic.out(1.1, 0.4)' })

    if (shadow.value) {
      gsap.fromTo(
        shadow.value,
        { scale: 1, opacity: 0.35 },
        { scale: 0.45, opacity: 0.12, duration: up, ease: 'power2.out', yoyo: true, repeat: 1, delay: 0.07 },
      )
    }

    if (count >= BOUNCES_TO_ENTER) tl.add(leave, '-=0.3')
  }

  onBeforeUnmount(() => {
    tl?.kill()
    if (root.value) gsap.killTweensOf(root.value)
  })

  return { bounces, leaving, bounce, leave, intro, total: BOUNCES_TO_ENTER }
}
