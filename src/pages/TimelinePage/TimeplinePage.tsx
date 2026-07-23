import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { ReactLenis } from 'lenis/react'
import { useTimeline } from '@/hooks/useTimeline'
import { TimelineContextProvider } from '@/components/providers/TimelineContext'
import { useMemo, useState } from 'react'
import type { Movie } from '@/Types/types'
import { format } from 'date-fns'
import TimelineContent from '@/components/timeline/TimelineContent'
import TextTransition from '@/components/ui/TextTransition'
import { isReleased } from '@/utils/movieFunctions'

const MOCKED_MOVIES: Movie[] = [
  {
    date: '2026-06-01',
    title: 'Batman',
    platform: 'HBO Max',
    poster: 'https://static.posters.cz/image/1300/133029.jpg',
  },
  {
    date: '2026-06-02',
    title: 'Batman',
    platform: 'HBO Max',
    poster: 'https://static.posters.cz/image/1300/133028.jpg',
  },
  {
    date: '2026-07-19',
    title: 'Batman',
    platform: 'Netflix',
    poster: 'https://static.posters.cz/image/1300/133030.jpg',
  },
  {
    date: '2026-07-26',
    title: 'Superman',
    platform: 'Disney+',
    poster: 'https://static.posters.cz/image/1300/133031.jpg',
  },
  {
    date: '2026-07-29',
    title: 'Spiderman',
    platform: 'HBO Max',
    poster: 'https://static.posters.cz/image/1300/133032.jpg',
  },
  {
    date: '2026-07-29',
    title: 'Spiderman',
    platform: 'HBO Max',
    poster: 'https://static.posters.cz/image/1300/133032.jpg',
  },
  {
    date: '2026-08-29',
    title: 'Spiderman',
    platform: 'HBO Max',
    poster: 'https://static.posters.cz/image/1300/133040.jpg',
  },
  {
    date: '2026-08-29',
    title: 'Spiderman',
    platform: 'HBO Max',
    poster: 'https://static.posters.cz/image/1300/133040.jpg',
  },
  {
    date: '2026-08-29',
    title: 'Spiderman',
    platform: 'HBO Max',
    poster: 'https://static.posters.cz/image/1300/133040.jpg',
  },
]
const TimelinePage = () => (
  <TimelineContextProvider>
    <TimelinePageContent />
  </TimelineContextProvider>
)
const TimelinePageContent = () => {
  const { scrollToCard, activeCardIndex, registerLenisRef } = useTimeline()
  // TODO: Create type
  const [scrollDirection, setScrollDirection] = useState<-1 | 1 | 0>(0)

  const firstUnreleasedMovieIndex = useMemo(
    () => MOCKED_MOVIES.findIndex((m) => !isReleased(m.date)),
    [/*movies*/],
  )

  // hold first element left offset (80px)
  // treat first unreleased as first one, or last released as first one
  const handleScrollToFirstMovie = () => {
    scrollToCard(firstUnreleasedMovieIndex)
  }

  const activeCardMonth = useMemo(() => {
    const activeMovie = MOCKED_MOVIES[activeCardIndex]
    if (!activeMovie) return 'Timeline'
    return format(activeMovie.date, 'MMMM')
  }, [activeCardIndex])

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <div className="flex flex-none items-end gap-2 p-4">
        <h1 className="mb-[-0.025em] ml-[-0.05em] w-full text-9xl font-bold uppercase">
          <TextTransition direction={scrollDirection !== 1 ? 'down' : 'up'}>
            {activeCardMonth}
          </TextTransition>
        </h1>
      </div>
      <ReactLenis
        className="flex-1 overflow-hidden"
        options={{ orientation: 'horizontal', gestureOrientation: 'vertical', smoothWheel: true }}
        ref={registerLenisRef}
      >
        <TimelineContent
          movies={MOCKED_MOVIES}
          firstUnreleasedMovieIndex={firstUnreleasedMovieIndex}
          setScrollDirection={setScrollDirection}
        />
      </ReactLenis>
      <div className="p-4">
        <Button
          size={'icon'}
          variant={'default'}
          className="p-0"
          onPress={handleScrollToFirstMovie}
        >
          <ChevronLeft className="text-primary-foreground" />
        </Button>
      </div>
    </div>
  )
}
export default TimelinePage
