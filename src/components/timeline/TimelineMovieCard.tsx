import { ScrollDirection, type Movie } from '@/Types/types'
import { AspectRatio } from '../ui/aspect-ratio'
import { Badge } from '../ui/badge'
import { differenceInDays } from 'date-fns'
import { isReleased } from '@/utils/movieFunctions'
import TimelineMovieEditor from './TimelineMovieEditor'
import { useEffect, useState } from 'react'
import { useTimeline } from '@/hooks/useTimeline'

type Props = {
  movie: Movie
  firstUnreleasedMovieIndex: number
  i: number
}
const currentDate = new Date()

const TimelineMovieCard = ({ movie, firstUnreleasedMovieIndex, i }: Props) => {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const { scrollToCard, activeCardIndex, lenisRef } = useTimeline()

  const handleCardClick = () => {
    setIsEditOpen((prev) => !prev)
    scrollToCard(i)
  }

  lenisRef?.current?.lenis?.on('scroll', (e) => {
    if (e.userData && e.userData.source !== 'scrollToCard') {
      setIsEditOpen(false)
    }
  })

  return (
    <div className="flex">
      <AspectRatio
        onClick={handleCardClick}
        data-movie-index={i}
        {...(firstUnreleasedMovieIndex === i && { 'data-first-unreleased': true })}
        key={`${movie.date}-${i}`}
        ratio={2 / 3}
        className="z-90 h-[80dvh] cursor-pointer"
      >
        <img
          src={
            movie.poster
              ? movie.poster
              : 'https://www.juliedray.com/wp-content/uploads/2022/01/sans-affiche.png'
          }
          // alt={movie.title}
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
      <TimelineMovieEditor isOpen={isEditOpen} onOpenChange={setIsEditOpen} movieData={movie} />
    </div>
  )
}

export default TimelineMovieCard
