import { motion } from 'framer-motion'
import { useLenis } from 'lenis/react'
import { useRef, useState, useEffect } from 'react'

import type { Movie } from '@/Types/types'

import { CARD_EXIT_DURATION_MS, useAnimatedCardRemoval } from '@/hooks/useAnimatedCardRemoval'
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
  const { activeCardIndex, setActiveCardIndex, setScrollDirection } = useTimeline()
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  const setFocusedCardId = useTimelineStore(state => state.setFocusedCardId)
  const setCardWidth = useTimelineStore(state => state.setCardWidth)
  const { leavingCardIds, removeLeavingCardId, clearLeavingCardIds } = useAnimatedCardRemoval()
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

  // The scroll tracker indexes into `movies` by position, so keep the active
  // index valid when a card is removed without a page reload. Truncating the
  // ref array is required too: otherwise the detached node of the removed card
  // would still skew the closest-card calculation.
  useEffect(() => {
    itemRefs.current.length = movies.length
    if (activeCardIndex > movies.length - 1) {
      setActiveCardIndex(Math.max(0, movies.length - 1))
    }
  }, [movies.length, activeCardIndex, setActiveCardIndex])

  // The exit marker outlives the DB commit (query refetch delay); drop it once
  // the id is actually gone from this list.
  useEffect(() => {
    if (leavingCardIds.length === 0) return
    const ids = new Set(movies.map(m => m.id))
    leavingCardIds.filter(id => !ids.has(id)).forEach(removeLeavingCardId)
  }, [movies, leavingCardIds, removeLeavingCardId])

  // Markers live in the global store; don't leak them when leaving the page mid-flight.
  useEffect(() => () => clearLeavingCardIds(), [clearLeavingCardIds])

  // Slide-down distance: enough to carry the card out of the scroll viewport,
  // which clips it (Lenis wrapper has overflow-hidden).
  const exitDistance = containerHeight

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
        movies.map((movie, i) => {
          const isLeaving = leavingCardIds.includes(movie.id)
          return (
            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              ref={el => {
                itemRefs.current[i] = el
              }}
              key={movie.id}
              className={`flex h-full items-center ${isLeaving ? 'overflow-visible' : 'overflow-clip'}`}
            >
              {/* Inner node carries the exit transform so it never fights the
                  outer node's `layout` glide that fills the gap afterwards. */}
              <motion.div
                initial={false}
                animate={isLeaving ? { y: exitDistance, opacity: 0 } : { y: 0, opacity: 1 }}
                transition={{ duration: CARD_EXIT_DURATION_MS / 1000, ease: 'easeIn' }}
                className="h-full"
              >
                <TimelineMovieCard
                  movie={movie}
                  firstUnreleasedMovieIndex={firstUnreleasedMovieIndex}
                  index={i}
                />
              </motion.div>
            </motion.div>
          )
        })
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
