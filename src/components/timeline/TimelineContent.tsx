import { useLenis } from 'lenis/react'
import { useRef, useState, useEffect } from 'react'

import type { Movie } from '@/Types/types'

import { useIsMobile } from '@/hooks/useMobile'
import { useTimeline } from '@/hooks/useTimeline'
import { useTimelineStore } from '@/stores/timelineStore'

import { Skeleton } from '../ui/skeleton'
import TimelineMovieCard from './TimelineMovieCard'
import TimelineNoMovies from './TimelineNoMovies'

type Props = {
  movies: Movie[]
  isPending?: boolean
  isLoading?: boolean
  firstUnreleasedMovieIndex: number
}

const TimelineContent = ({
  movies,
  isPending = false,
  isLoading = false,
  firstUnreleasedMovieIndex,
}: Props) => {
  const { setActiveCardIndex, setScrollDirection, scrollToCard } = useTimeline()
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  const setFocusedCardId = useTimelineStore(state => state.setFocusedCardId)
  const setCardWidth = useTimelineStore(state => state.setCardWidth)
  const isMobile = useIsMobile()

  const [containerHeight, setContainerHeight] = useState(() =>
    typeof window !== 'undefined' ? Math.max(400, window.innerHeight - 350) : 600,
  )

  useEffect(() => {
    if (!containerRef.current) return

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        setContainerHeight(entry.contentRect.height)
      }
    })

    resizeObserver.observe(containerRef.current)
    return () => resizeObserver.disconnect()
  }, [])

  useLenis(({ scroll, direction, userData, lastVelocity }) => {
    setScrollDirection(direction)

    if (userData?.source !== 'scrollToCard' && (lastVelocity > 0.05 || lastVelocity < -0.05)) {
      setFocusedCardId(null)
    }

    if (isMobile) {
      const topOfTheScreen = scroll

      let closestIndex = 0
      let minDist = Infinity
      itemRefs.current.forEach((el, i) => {
        if (el) {
          const elCenterLeftEdge = el.offsetTop
          const dist = Math.abs(elCenterLeftEdge - topOfTheScreen)
          if (dist < minDist) {
            minDist = dist
            closestIndex = i
          }
        }
      })
      setActiveCardIndex(closestIndex)
    } else {
      // Desktop
      const leftQuarter = scroll + window.innerWidth / 4

      let closestIndex = 0
      let minDist = Infinity

      itemRefs.current.forEach((el, i) => {
        if (el) {
          const elCenterLeftEdge = el.offsetLeft
          const dist = Math.abs(elCenterLeftEdge - leftQuarter)
          if (dist < minDist) {
            minDist = dist
            closestIndex = i
          }
        }
      })
      setActiveCardIndex(closestIndex)
    }
  })
  const cardWidth = isMobile ? window.innerWidth - 2 * 4 : containerHeight * (2 / 3)
  const cardHeight = cardWidth * 1.5
  setCardWidth(cardWidth)


  return (
    <div
      ref={containerRef}
      style={
        {
          '--width-timeline-card': `${cardWidth}px`,
          '--height-timeline-card': `${cardHeight}px`,
          '--max-width-timeline-card': `${cardWidth}px`,
        } as React.CSSProperties
      }
      className="movie-card flex h-full w-full flex-col items-center gap-20 px-4 md:w-max md:flex-row md:items-stretch md:pl-4"
    >
      {isLoading && movies.length === 0 ? (
        <>
          <Skeleton className="h-timeline-card w-timeline-card" />
          <Skeleton className="h-timeline-card w-timeline-card" />
          <Skeleton className="h-timeline-card w-timeline-card" />
        </>
      ) : movies.length === 0 && !isPending ? (
        <TimelineNoMovies />
      ) : (
        movies.map((movie, i) => (
          <div
            ref={el => {
              itemRefs.current[i] = el
            }}
            key={movie.id}
            className="flex h-full items-center overflow-clip"
          >
            <TimelineMovieCard
              movie={movie}
              firstUnreleasedMovieIndex={firstUnreleasedMovieIndex}
              index={i}
            />
          </div>
        ))
      )}
      {/* Spacer to allow scrolling the last card to the target alignment point */}
      <div
        style={{
          width: `calc(100vw - ${cardWidth}px - 80px - var(--sidebar-width-icon) - var(--padding-window) * 1.5)`,
        }}
        className="hidden shrink-0 md:block"
      ></div>
      <div
        style={{
          height: `${containerHeight - cardHeight - 40}px`,
          width: '100%',
        }}
        className="block shrink-0 md:hidden"
      ></div>
    </div>
  )
}

export default TimelineContent
