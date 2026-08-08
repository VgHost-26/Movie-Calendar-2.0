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
import { DialogTrigger } from '@/components/ui/dialog'
import { useTimelineStore } from '@/store/store'

const currentDate = new Date()
const TimelinePage = () => (
  <TimelineContextProvider>
    <TimelinePageContent />
  </TimelineContextProvider>
)
const TimelinePageContent = () => {
  const { scrollToCard, activeCardIndex, registerLenisRef, scrollDirection } = useTimeline()
  const [isAddMovieDialogOpen, setIsAddMovieDialogOpen] = useState(false)

  const { user } = useAuth()
  const userId = user?.uid ?? ''

  const focusedCardId = useTimelineStore((state) => state.focusedCardId)
  const { data, isLoading } = useGetMovies(userId)

  const movies = useMemo(() => {
    if (isLoading) {
      return []
    }
    if (!data) {
      return []
    }
    return data
  }, [data, isLoading])

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
        <TimelineContent movies={movies} firstUnreleasedMovieIndex={firstUnreleasedMovieIndex} />
      </ReactLenis>
      <footer className="flex gap-6 p-window">
        <div className="flex gap-2">
          <Button size={'icon'} variant={'default'} onPress={handleScrollToFirstMovie}>
            <ChevronRightIcon className="text-primary-foreground" />
          </Button>
          <DialogTrigger isOpen={isAddMovieDialogOpen} onOpenChange={setIsAddMovieDialogOpen}>
            <Button size={'icon'} variant={'default'}>
              <PlusIcon className="text-primary-foreground" />
            </Button>
            <AddMovieDialog handleOpenChange={setIsAddMovieDialogOpen} />
          </DialogTrigger>
        </div>
        <div className="flex items-end text-muted-foreground">
          <p>
            Next release:{' '}
            <span className="text-primary hover:underline hover:cursor-pointer" onClick={handleScrollToFirstMovie}>
              {movies[firstUnreleasedMovieIndex]?.title || 'No upcoming releases'}
            </span>{' '}
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
    </div>
  )
}
export default TimelinePage
