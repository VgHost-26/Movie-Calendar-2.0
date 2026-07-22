import { Button } from '@/components/ui/button'
import { differenceInDays } from 'date-fns'
import { ChevronLeft } from 'lucide-react'
import { useCallback, useMemo, useRef } from 'react'
import { ReactLenis, type LenisRef } from 'lenis/react'
import TimelineMovieCard from '@/components/timeline/TimelineMovieCard'
import type { Movie } from '@/Types/types'

const MOCKED_MOVIES: Movie[] = [
  {
    date: '2026-06-01',
    title: 'Batman',
    platform: 'HBO Max',
    poster: 'https://static.posters.cz/image/1300/133029.jpg',
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
    poster: 'https://static.posters.cz/image/1300/133032.jpg',
  },
  {
    date: '2026-08-29',
    title: 'Spiderman',
    platform: 'HBO Max',
    poster: 'https://static.posters.cz/image/1300/133032.jpg',
  },
  {
    date: '2026-08-29',
    title: 'Spiderman',
    platform: 'HBO Max',
    poster: 'https://static.posters.cz/image/1300/133032.jpg',
  },
]
const currentDate = new Date()
const TimelinePage = () => {
  const lenisRef = useRef<LenisRef>(null)

  const isReleased = (movieDate: string) => {
    return differenceInDays(new Date(movieDate), currentDate) < 0
  }
  const firstUnreleasedMovieIndex = useMemo(
    () => MOCKED_MOVIES.findIndex((m) => !isReleased(m.date)),
    [],
  )
  const scrollTo = useCallback(
    (target: string | number | HTMLElement, options?: object) => {
      lenisRef.current?.lenis?.scrollTo(target, options)
    },
    [lenisRef],
  )
  // hold first element left offset (80px)
  // treat first unreleased as first one, or last released as first one
  const handleScrollToFirstMovie = () => {
    const selector = `[data-movie-index="${firstUnreleasedMovieIndex}"]`
    const offset = -16
    console.log('scrolling to first movie', selector, lenisRef)
    scrollTo(selector, {
      offset,
      duration: 1.5,
    })
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <div className="flex flex-none items-end gap-2 p-4">
        <h1 className="mb-[-0.025em] ml-[-0.05em] text-9xl font-bold uppercase">Timeline</h1>
        <Button size={'icon'} variant={'secondary'} onPress={handleScrollToFirstMovie}>
          <ChevronLeft />
        </Button>
      </div>
      <ReactLenis
        className="flex-1 overflow-hidden"
        options={{ orientation: 'horizontal', gestureOrientation: 'vertical', smoothWheel: true }}
        ref={lenisRef}
      >
        <div className="flex w-max items-center gap-20 pl-4">
          {MOCKED_MOVIES.map((movie, i) => (
            <TimelineMovieCard
              key={`${movie.title}-${i}`}
              movie={movie}
              isReleased={isReleased}
              firstUnreleasedMovieIndex={firstUnreleasedMovieIndex}
              i={i}
            />
          ))}
        </div>
      </ReactLenis>
    </div>
  )
}
export default TimelinePage
