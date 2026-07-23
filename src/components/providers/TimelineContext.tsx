import type { LenisRef } from 'lenis/react'
import React, { useCallback, useRef, useState } from 'react'
import type { LenisOptions } from 'lenis'
import { TimelineContext } from '@/hooks/useTimeline'

export interface TimelineContextProps {
  activeCardIndex: number
  setActiveCardIndex: (index: number) => void
  scrollToCard: (index: number, options?: LenisOptions) => void
  registerLenisRef: (ref: LenisRef) => void
}

export const TimelineContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeCardIndex, setActiveCardIndex] = useState(0)
  const lenisRef = useRef<LenisRef | null>(null)

  const registerLenisRef = useCallback((ref: LenisRef) => {
    lenisRef.current = ref
  }, [])

  const scrollToCard = useCallback((index: number) => {
    if (lenisRef.current && lenisRef.current.lenis) {
      const selector = `[data-movie-index="${index}"]`
      const el = document.querySelector(selector)
      let offset = 0

      if (el) {
        // TODO: fix this
        const marginLeft = parseFloat(getComputedStyle(el).paddingLeft) || 0
        offset = marginLeft 
      }

      lenisRef.current.lenis.scrollTo(selector, { offset, duration: 1.5 })
    } else {
      console.warn('Lenis ref is not registered yet.')
    }
  }, [])

  return (
    <TimelineContext.Provider
      value={{ registerLenisRef, activeCardIndex, scrollToCard, setActiveCardIndex }}
    >
      {children}
    </TimelineContext.Provider>
  )
}
