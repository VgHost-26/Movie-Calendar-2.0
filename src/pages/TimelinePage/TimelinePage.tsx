import { differenceInDays, format } from 'date-fns'
import { ReactLenis } from 'lenis/react'
import { ChevronRightIcon, PlusIcon } from 'lucide-react'
import { useMemo } from 'react'

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
  }, [data])

  const firstUnreleasedMovieIndex = useMemo(
    () => movies.findIndex(m => !isReleased(m.date)),
    [movies],
  )

  // hold first element left offset (80px)
  // treat first unreleased as first one, or last released as first one
  const handleScrollToFirstMovie = () => {
    scrollToCard(firstUnreleasedMovieIndex)
  }

  const activeCardMonth = useMemo(() => {
    if (isMobile) {
      const activeMovie = movies[activeCardIndex]
      if (!activeMovie) return 'Timeline'
      const [month, day, ending] = format(activeMovie.date, 'MMM do').split(/(\d+)/).filter(Boolean)
      return (
        <>
          {month} {day?.padStart(2, '0')}
          <span className="ml-2 text-[0.6em] leading-0 font-light lowercase">{ending}</span>
        </>
      )
    } else {
      const focusedMovie = movies.find(m => m.id === focusedCardId)
      if (focusedMovie) {
        return format(focusedMovie.date, 'MMMM')
      }
      const activeMovie = movies[activeCardIndex]
      if (!activeMovie) return 'Timeline'
      return format(activeMovie.date, 'MMMM')
    }
  }, [activeCardIndex, focusedCardId, isMobile, movies])

  const focusedCardDate = useMemo(() => {
    if (!focusedCardId) return ' '
    const focusedMovie = movies.find(m => m.id === focusedCardId)
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
        <h1 className="flex w-full gap-10 text-8xl font-bold uppercase md:ml-[-0.05em] md:text-9xl">
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
          gestureOrientation: 'vertical',
          smoothWheel: true,
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
      <footer className="flex justify-between gap-6 p-window ">
        <div className="flex gap-2">
          <Button size={'icon'} className='h-14 md:h-auto w-14 md:w-auto ' variant={'default'} onPress={handleScrollToFirstMovie}>
            <ChevronRightIcon className="text-primary-foreground" />
          </Button>
          <Button size={'icon'} className='h-14 md:h-auto w-14 md:w-auto' variant={'default'} onPress={() => setIsAddMovieDialogOpen(true)}>
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
        <div className="flex items-center md:hidden justify-center">
          <ProfileIcon />
        </div>
      </footer>
    </div>
  )
}
export default TimelinePage
