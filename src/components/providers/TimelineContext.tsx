import type { LenisOptions } from 'lenis'
import type { LenisRef } from 'lenis/react'

import React, { useCallback, useRef, useState } from 'react'

import { useIsMobile } from '@/hooks/useMobile'
import { TimelineContext } from '@/hooks/useTimeline'
import { useTimelineStore } from '@/stores/timelineStore'
import { ScrollDirection } from '@/Types/types'

export interface TimelineContextProps {
  activeCardIndex: number
  setActiveCardIndex: (index: number) => void
  scrollToCard: (index: number, options?: LenisOptions) => void
  registerLenisRef: (ref: LenisRef) => void
  scrollDirection: ScrollDirection
  setScrollDirection: (direction: ScrollDirection) => void
  lenisRef?: React.RefObject<LenisRef | null>
}

export const TimelineContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeCardIndex, setActiveCardIndex] = useState(0) // Card in the center of the screen
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(0)
  const focusedCardId = useTimelineStore(state => state.focusedCardId)
  const cardWidth = useTimelineStore(state => state.cardWidth)

  const lenisRef = useRef<LenisRef | null>(null)

  const isMobile = useIsMobile()

  const registerLenisRef = useCallback((ref: LenisRef) => {
    lenisRef.current = ref
  }, [])

  const scrollToCard = useCallback(
    (index: number) => {
      if (lenisRef.current?.lenis) {
        const selector = `[data-movie-index="${index}"]`
        // const el = document.querySelector(selector)
        // const parent = el?.parentElement
        let offset = 0
        const openEditorOffset = focusedCardId !== null ? (-cardWidth - 16) : 0

        // if (parent) {
        // TODO: fix this
        // const marginLeft = parseFloat(getComputedStyle(parent).paddingLeft)
        // console.log(marginLeft)
        const marginLeft = isMobile ? 0 : -16
        offset = marginLeft + openEditorOffset
        // }

        lenisRef.current.lenis.scrollTo(selector, {
          offset,
          duration: 1.5,
          userData: { source: 'scrollToCard' },
        })
      } else {
        console.warn('Lenis ref is not registered yet.')
      }
    },
    [cardWidth, focusedCardId, isMobile],
  )

  return (
    <TimelineContext.Provider
      value={{
        registerLenisRef,
        activeCardIndex,
        scrollToCard,
        setActiveCardIndex,
        scrollDirection,
        setScrollDirection,
        lenisRef,
      }}
    >
      {children}
    </TimelineContext.Provider>
  )
}
