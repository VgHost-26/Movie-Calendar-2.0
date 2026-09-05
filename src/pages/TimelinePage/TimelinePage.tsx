import { differenceInDays, format } from 'date-fns'
import { ReactLenis } from 'lenis/react'
import { CalendarClockIcon, ChevronRightIcon, PlusIcon } from 'lucide-react'
import { useEffect, useMemo, useRef } from 'react'

import { useGetMovies } from '@/api/apiFirebase'
import AddMovieDialog from '@/components/calendar/AddMovieDialog'
import ProfileIcon from '@/components/ProfileIcon/ProfileIcon'
import { TimelineContextProvider } from '@/components/providers/TimelineContext'
import TimelineContent from '@/components/timeline/TimelineContent'
import { Button } from '@/components/ui/button'
import TextTransition from '@/components/ui/TextTransition'
import useAuth from '@/hooks/useAuth'
import { useIsMobile } from '@/hooks/useMobile'
import { useTimeline } from '@/hooks/useTimeline'
import { useTimelineStore } from '@/stores/timelineStore'
import {
  formatMovieDateLabel,
  parseMovieDate,
  toDisplayDate,
  toSortableTime,
} from '@/utils/movieDate'
import { isReleased } from '@/utils/movieFunctions'

const currentDate = new Date()
const TimelinePage = () => (
  <TimelineContextProvider>
    <TimelinePageContent />
  </TimelineContextProvider>
)
const TimelinePageContent = () => {
  const { scrollToCard, activeCardIndex, registerLenisRef, scrollDirection } = useTimeline()
  const { user } = useAuth()
  const isMobile = useIsMobile()
  const userId = user?.uid ?? ''

  const focusedCardId = useTimelineStore(state => state.focusedCardId)
  const isAddMovieDialogOpen = useTimelineStore(state => state.isAddMovieDialogOpen)
  const setIsAddMovieDialogOpen = useTimelineStore(state => state.setIsAddMovieDialogOpen)
  const { data, isLoading, isPending } = useGetMovies(userId)

  const movies = useMemo(() => {
    if (!data) {
      return []
    }
    return data
      .filter(m => !m.watched)
      .sort((a, b) => toSortableTime(a.date) - toSortableTime(b.date))
  }, [data])

  const firstUnreleasedMovieIndex = useMemo(
    () => movies.findIndex(m => !isReleased(m.date)),
    [movies],
  )

  // hold first element left offset (80px)
  // treat first unreleased as first one, or last released as first one
  const handleScrollToFirstMovie = () => {
    scrollToCard(firstUnreleasedMovieIndex === -1 ? movies.length - 1 : firstUnreleasedMovieIndex)
  }

  const activeCardMonth = useMemo(() => {
    if (isMobile) {
      const activeMovie = movies[activeCardIndex]
      if (!activeMovie) return 'Timeline'
      const precision = parseMovieDate(activeMovie.date)?.precision ?? 'none'
      if (precision === 'none') return 'Coming Soon'
      // Only day precision has a day-of-month to render; coarser dates show as-is.
      if (precision !== 'day') return formatMovieDateLabel(activeMovie.date)

      const [month, day, ending] = format(toDisplayDate(activeMovie.date)!, 'MMM do')
        .split(/(\d+)/)
        .filter(Boolean)
      return (
        <>
          {month} {day?.padStart(2, '0')}
          <span className="ml-2 text-[0.6em] leading-0 font-light lowercase">{ending}</span>
        </>
      )
    } else {
      const focusedMovie = movies.find(m => m.id === focusedCardId)
      if (focusedMovie) {
        const focusedDate = toDisplayDate(focusedMovie.date)
        if (!focusedDate) return 'Coming Soon'
        return format(focusedDate, 'MMMM')
      }
      const activeMovie = movies[activeCardIndex]
      if (!activeMovie) return 'Timeline'
      const activeDate = toDisplayDate(activeMovie.date)
      if (!activeDate) return 'Coming Soon'
      return format(activeDate, 'MMMM')
    }
  }, [activeCardIndex, focusedCardId, isMobile, movies])

  const focusedCardDate = useMemo(() => {
    if (!focusedCardId) return ' '
    const focusedMovie = movies.find(m => m.id === focusedCardId)
    if (!focusedMovie) return ' '
    if (parseMovieDate(focusedMovie.date)?.precision !== 'day') return ' '
    const date = toDisplayDate(focusedMovie.date)!
    const [day, ending] = format(date, 'do').split(/(\d+)/).filter(Boolean)
    return (
      <>
        {day?.padStart(2, '0')}
        <span className="text-[0.6em] leading-0 font-light lowercase">{ending}</span>
      </>
    )
  }, [focusedCardId, movies])

  // Alternative laoder
  /* <div className="flex h-full items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
           </div> */

  const hasInitialScrolled = useRef(false)

  // Glide to the first unreleased movie once the list has loaded and laid out.
  // Exactly once per mount: later list changes (watch, delete, add) must never
  // yank the scroll position.
  useEffect(() => {
    if (hasInitialScrolled.current) return
    if (isPending || isLoading || movies.length === 0) return
    const targetIndex =
      firstUnreleasedMovieIndex === -1 ? movies.length - 1 : firstUnreleasedMovieIndex
    if (targetIndex <= 0) {
      hasInitialScrolled.current = true
      return
    }
    let raf = 0
    let timer: ReturnType<typeof setTimeout> | undefined
    let attempts = 0
    const tryScroll = () => {
      // Lenis registers and cards mount a few frames after the data lands.
      if (document.querySelector(`[data-movie-index="${targetIndex}"]`)) {
        hasInitialScrolled.current = true
        timer = setTimeout(() => scrollToCard(targetIndex), 150)
      } else if (attempts < 60) {
        attempts += 1
        raf = requestAnimationFrame(tryScroll)
      } else {
        hasInitialScrolled.current = true
      }
    }
    raf = requestAnimationFrame(tryScroll)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timer)
    }
  }, [isPending, isLoading, movies, firstUnreleasedMovieIndex, scrollToCard])

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <div className="flex items-end p-window pb-1">
        <h1 className="flex w-full gap-10 text-8xl font-bold uppercase md:text-9xl">
          <TextTransition direction={scrollDirection}>{activeCardMonth}</TextTransition>
          {!isMobile && (
            <TextTransition direction={-1} exitDirection="opposite" className="w-[4ch]">
              {focusedCardDate}
            </TextTransition>
          )}
        </h1>
      </div>
      <ReactLenis
        className="timeline-lenis flex-1 overflow-hidden"
        options={{
          orientation: isMobile ? 'vertical' : 'horizontal',
          gestureOrientation: 'both',
          smoothWheel: true,
          syncTouch: true,
          touchMultiplier: 1,
          lerp: 0.1,
        }}
        ref={registerLenisRef}
      >
        <TimelineContent
          movies={movies}
          isPending={isPending}
          isLoading={isLoading}
          firstUnreleasedMovieIndex={firstUnreleasedMovieIndex}
        />
      </ReactLenis>
      <footer className="flex gap-6 p-window">
        <div className="flex gap-2">
          <Button size={'icon'} className="" variant={'default'} onPress={handleScrollToFirstMovie}>
            <CalendarClockIcon className="text-primary-foreground" />
          </Button>
          <Button
            size={'icon'}
            className=""
            variant={'default'}
            onPress={() => setIsAddMovieDialogOpen(true)}
          >
            <PlusIcon className="text-primary-foreground" />
          </Button>
          <AddMovieDialog isOpen={isAddMovieDialogOpen} setIsOpen={setIsAddMovieDialogOpen} />
        </div>
        <div className="hidden items-end text-muted-foreground md:flex">
          <p>
            Next release:{' '}
            {movies[firstUnreleasedMovieIndex]?.title && (
              <span
                className="text-primary hover:cursor-pointer hover:underline"
                onClick={handleScrollToFirstMovie}
              >
                {movies[firstUnreleasedMovieIndex]?.title}
              </span>
            )}{' '}
            {(() => {
              const nextDate = movies[firstUnreleasedMovieIndex]?.date
              const precision = parseMovieDate(nextDate)?.precision ?? 'none'
              if (precision === 'day') {
                const displayDate = toDisplayDate(nextDate)!
                return (
                  <span>
                    [
                    {`in 
                ${differenceInDays(displayDate, currentDate).toString().padStart(2, '0')}
                days`}
                    ]
                  </span>
                )
              }
              if (precision === 'month' || precision === 'year') {
                return <span>[{formatMovieDateLabel(nextDate)}]</span>
              }
              return null
            })()}
          </p>
        </div>
        <div className="flex items-center justify-center md:hidden">
          <ProfileIcon />
        </div>
      </footer>
    </div>
  )
}
export default TimelinePage
