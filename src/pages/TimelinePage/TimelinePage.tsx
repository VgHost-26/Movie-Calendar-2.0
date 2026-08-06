import { Button } from '@/components/ui/button'
import { CalendarSyncIcon, ChevronLeft, ChevronRightIcon, PlusIcon } from 'lucide-react'
import { ReactLenis } from 'lenis/react'
import { useTimeline } from '@/hooks/useTimeline'
import { TimelineContextProvider } from '@/components/providers/TimelineContext'
import { useMemo, useState } from 'react'
import type { Movie, ScrollDirection } from '@/Types/types'
import { differenceInDays, format } from 'date-fns'
import TimelineContent from '@/components/timeline/TimelineContent'
import TextTransition from '@/components/ui/TextTransition'
import { isReleased } from '@/utils/movieFunctions'
import { useGetMovies } from '@/api/apiFirebase'
import useAuth from '@/hooks/useAuth'
import AddMovieDialog from '@/components/calendar/AddMovieDialog'
import { DialogTrigger } from '@/components/ui/dialog'

const MOCKED_MOVIES: Movie[] = [
  {
    id: '1',
    date: '2026-06-01',
    title: 'Batman',
    platform: 'HBO Max',
    poster: 'https://static.posters.cz/image/1300/133029.jpg',
  },
  {
    id: '2',
    date: '2026-06-02',
    title: 'Batman',
    platform: 'HBO Max',
    poster: 'https://static.posters.cz/image/1300/133028.jpg',
  },
  {
    id: '3',
    date: '2026-07-19',
    title: 'Batman',
    platform: 'Netflix',
    poster: 'https://static.posters.cz/image/1300/133030.jpg',
  },
  {
    id: '4',
    date: '2026-07-26',
    title: 'Superman',
    platform: 'Disney+',
    poster: 'https://static.posters.cz/image/1300/133031.jpg',
  },
  {
    id: '5',
    date: '2026-07-29',
    title: 'Spiderman',
    platform: 'HBO Max',
    poster: 'https://static.posters.cz/image/1300/133032.jpg',
  },
  {
    id: '6',
    date: '2026-07-29',
    title: 'Spiderman',
    platform: 'HBO Max',
    poster: 'https://static.posters.cz/image/1300/133032.jpg',
  },
  {
    id: '7',
    date: '2026-08-29',
    title: 'Spiderman',
    platform: 'HBO Max',
    poster: 'https://static.posters.cz/image/1300/133044.jpg',
  },
  {
    id: '8',
    date: '2026-08-29',
    title: 'Spiderman',
    platform: 'HBO Max',
    poster: 'https://static.posters.cz/image/1300/133040.jpg',
  },
  {
    id: '9',
    date: '2026-08-29',
    title: 'Spiderman',
    platform: 'HBO Max',
    poster: 'https://static.posters.cz/image/1300/133040.jpg',
  },
]
const currentDate = new Date()
const TimelinePage = () => (
  <TimelineContextProvider>
    <TimelinePageContent />
  </TimelineContextProvider>
)
const TimelinePageContent = () => {
  const { scrollToCard, activeCardIndex, registerLenisRef, scrollDirection } = useTimeline()
  const [isAddMovieDialogOpen, setIsAddMovieDialogOpen] = useState(false)

  const { user, loading } = useAuth()
  const userId = user?.uid ?? ''

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
    const activeMovie = movies[activeCardIndex]
    if (!activeMovie) return 'Timeline'
    return format(activeMovie.date, 'MMMM')
  }, [activeCardIndex])

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <div className="flex flex-none items-end p-window">
        <h1 className="ml-[-0.05em] w-full text-9xl font-bold uppercase">
          <TextTransition direction={scrollDirection}>{activeCardMonth}</TextTransition>
        </h1>
      </div>
      <ReactLenis
        className="flex-1 overflow-hidden"
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
            <span className="text-primary">
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
