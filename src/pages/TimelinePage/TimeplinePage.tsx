import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useLenisScroll } from '@/hooks/useLenisScroll'
import { differenceInDays } from 'date-fns'
import { ChevronLeft } from 'lucide-react'
import { useRef } from 'react'
const MOCKED_MOVIES = [
  {
    date: '2026-06-01',
    title: 'Batman',
    platform: 'HBO',
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
  const { containerRef, scrollTo } = useLenisScroll({
    orientation: 'horizontal',
    gestureOrientation: 'vertical',
  })
  const firstMovie = useRef<HTMLElement | null>(null)

  const isReleased = (movieDate: string) => {
    return differenceInDays(new Date(movieDate), currentDate) < 0
  }
  // hold first element left offset (80px)
  // treat first unreleased as first one, or last released as first one
  const handleScrollToFirstMovie = () => {
    if (firstMovie.current) {
      const el = firstMovie.current
      const offsetLeft = el.offsetLeft * -1
      scrollTo(el, {
        offset: offsetLeft,
        duration: 1.5,
      })
    }
  }
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <div className="flex flex-none items-end gap-2 p-4">
        <h1 className="mb-[-0.025em] ml-[-0.05em] text-9xl font-bold uppercase">Timeline</h1>
        <Button size={'icon'} variant={'secondary'} onPress={handleScrollToFirstMovie}>
          <ChevronLeft />
        </Button>
      </div>
      <div ref={containerRef} className="flex-1 overflow-hidden">
        <div className="flex w-max items-center gap-20 pl-4">
          {MOCKED_MOVIES.map((movie, i) => (
            <AspectRatio
              ref={(el) => {
                if (el && !firstMovie.current && !isReleased(movie.date)) {
                  firstMovie.current = el
                }
              }}
              key={`${movie.date}-${i}`}
              ratio={2 / 3}
              className="h-[80dvh] max-w-[90dvw]"
            >
              <img
                src={movie.poster}
                alt={movie.title}
                className={`h-full object-cover ${isReleased(movie.date) ? '' : 'grayscale'}`}
              />
              <div className="absolute inset-0 flex flex-1 flex-col justify-between p-4">
                <div className="ml-auto flex">
                  {/* TODO: Style this badge, or all of them */}
                  <Badge variant={'default'}>{movie.platform}</Badge>
                </div>
                <div className="flex flex-1 items-end justify-between">
                  <div className="flex items-baseline gap-2">
                    {isReleased(movie.date) ? (
                      <h1 className="text-5xl font-bold text-white">Released</h1>
                    ) : (
                      <h1 className="text-8xl font-bold text-white">
                        {differenceInDays(new Date(movie.date), currentDate)
                          .toString()
                          .padStart(2, '0')}
                      </h1>
                    )}
                    {isReleased(movie.date) ? (
                      ''
                    ) : (
                      <span className="font-heading text-lg text-primary">Days left</span>
                    )}
                  </div>
                  <h2 className="text-4xl font-bold text-white">{movie.title}</h2>
                </div>
              </div>
            </AspectRatio>
          ))}
        </div>
      </div>
    </div>
  )
}
export default TimelinePage
