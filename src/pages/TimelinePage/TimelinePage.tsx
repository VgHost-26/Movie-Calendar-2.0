import { Button } from '@/components/ui/button'
import { ChevronRightIcon, PlusIcon } from 'lucide-react'
import { ReactLenis } from 'lenis/react'
import { useTimeline } from '@/hooks/useTimeline'
import { TimelineContextProvider } from '@/components/providers/TimelineContext'
import { useMemo, useState } from 'react'
import { differenceInDays, format } from 'date-fns'
import TimelineContent from '@/components/timeline/TimelineContent'
import TextTransition from '@/components/ui/TextTransition'
import { isReleased } from '@/utils/movieFunctions'
import { useGetMovies } from '@/api/apiFirebase'
import useAuth from '@/hooks/useAuth'
import AddMovieDialog from '@/components/calendar/AddMovieDialog'
import { useTimelineStore } from '@/stores/timelineStore'

const currentDate = new Date()
const TimelinePage = () => (
  <TimelineContextProvider>
    <TimelinePageContent />
  </TimelineContextProvider>
)
const TimelinePageContent = () => {
  const { scrollToCard, activeCardIndex, registerLenisRef, scrollDirection } = useTimeline()
  const { user } = useAuth()
  const userId = user?.uid ?? ''

  const focusedCardId = useTimelineStore((state) => state.focusedCardId)
  const isAddMovieDialogOpen = useTimelineStore((state) => state.isAddMovieDialogOpen)
  const setIsAddMovieDialogOpen = useTimelineStore((state) => state.setIsAddMovieDialogOpen)
  const { data, isLoading, isPending } = useGetMovies(userId)

  const movies = useMemo(() => {
    if (!data) {
      return []
    }
    return data
  }, [data])

  const firstUnreleasedMovieIndex = useMemo(
    () => movies.findIndex((m) => !isReleased(m.date)),
    [movies],
  )

  // hold first element left offset (80px)
  // treat first unreleased as first one, or last released as first one
  const handleScrollToFirstMovie = () => {
    scrollToCard(firstUnreleasedMovieIndex)
  }

  const activeCardMonth = useMemo(() => {
    const focusedMovie = movies.find((m) => m.id === focusedCardId)
    if (focusedMovie) {
      return format(focusedMovie.date, 'MMMM')
    }
    const activeMovie = movies[activeCardIndex]
    if (!activeMovie) return 'Timeline'
    return format(activeMovie.date, 'MMMM')
  }, [activeCardIndex, focusedCardId])

  const focusedCardDate = useMemo(() => {
    if (!focusedCardId) return ' '
    const focusedMovie = movies.find((m) => m.id === focusedCardId)
    if (!focusedMovie) return ' '
    const date = new Date(focusedMovie.date)
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

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <div className="flex items-end p-window">
        <h1 className="ml-[-0.05em] flex w-full gap-10 text-9xl font-bold uppercase">
          <TextTransition direction={scrollDirection}>{activeCardMonth}</TextTransition>
          <TextTransition direction={-1} exitDirection="opposite" className="w-[4ch]">
            {focusedCardDate}
          </TextTransition>
        </h1>
      </div>
      <ReactLenis
        className="timeline-lenis flex-1 overflow-hidden"
        options={{ orientation: 'horizontal', gestureOrientation: 'vertical', smoothWheel: true }}
        ref={registerLenisRef}
      >
        <TimelineContent movies={movies} isPending={isPending} isLoading={isLoading} firstUnreleasedMovieIndex={firstUnreleasedMovieIndex} />


      </ReactLenis >
      <footer className="flex gap-6 p-window">
        <div className="flex gap-2">
          <Button size={'icon'} variant={'default'} onPress={handleScrollToFirstMovie}>
            <ChevronRightIcon className="text-primary-foreground" />
          </Button>
          <Button size={'icon'} variant={'default'} onPress={() => setIsAddMovieDialogOpen(true)}>
            <PlusIcon className="text-primary-foreground" />
          </Button>
          <AddMovieDialog isOpen={isAddMovieDialogOpen} setIsOpen={setIsAddMovieDialogOpen} />
        </div>
        <div className="flex items-end text-muted-foreground">
          <p>
            Next release:{' '}
            {movies[firstUnreleasedMovieIndex]?.title &&

              <span className="text-primary hover:underline hover:cursor-pointer" onClick={handleScrollToFirstMovie}>
                {movies[firstUnreleasedMovieIndex]?.title}
              </span>

            }
            {' '}
            {movies[firstUnreleasedMovieIndex]?.date && (
              <span>
                [
                {`in 
                ${differenceInDays(new Date(movies[firstUnreleasedMovieIndex].date), currentDate)
                    .toString()
                    .padStart(2, '0')}
                days`}
                ]
              </span>
            )}
          </p>
        </div>
      </footer>
    </div >
  )
}
export default TimelinePage
