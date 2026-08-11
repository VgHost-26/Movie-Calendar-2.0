import Lenis from 'lenis'
// components/SmoothHorizontalScroll.tsx
import { useEffect, useRef } from 'react'

interface Props {
  children: React.ReactNode
  className?: string
}

export function SmoothHorizontalScroll({ children, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const lenis = new Lenis({
      wrapper: el, // scrolled element
      content: el.firstElementChild as HTMLElement,
      orientation: 'horizontal',
      gestureOrientation: 'vertical', // ← wheel vertical → scroll horizontal
      smoothWheel: true,
      wheelMultiplier: 1.5, // speed (1 = default)
      touchMultiplier: 2, // on touch devices
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => lenis.destroy()
  }, [])

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      {children}
    </div>
  )
}
