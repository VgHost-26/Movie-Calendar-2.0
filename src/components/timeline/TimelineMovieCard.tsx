import type { Movie } from '@/Types/types'
import { AspectRatio } from '../ui/aspect-ratio'
import { Badge } from '../ui/badge'
import { differenceInDays } from 'date-fns'

type Props = {
  movie: Movie
  isReleased: (date: string) => boolean
  firstUnreleasedMovieIndex: number
  i: number
}
const currentDate = new Date()
const TimelineMovieCard = ({ movie, isReleased, firstUnreleasedMovieIndex, i }: Props) => {
  return (
    <AspectRatio
      data-movie-index={i}
      {...(firstUnreleasedMovieIndex === i && { 'data-first-unreleased': true })}
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
                {differenceInDays(new Date(movie.date), currentDate).toString().padStart(2, '0')}
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
  )
}

export default TimelineMovieCard
