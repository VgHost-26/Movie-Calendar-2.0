import { type Movie } from '@/Types/types'
import { AspectRatio } from '../ui/aspect-ratio'
import { differenceInDays } from 'date-fns'
import { isReleased } from '@/utils/movieFunctions'
import posterPlaceholder from '@/assets/images/poster-placeholder.png'
import TimelineMovieEditor from './TimelineMovieEditor'
import { useMemo, useState } from 'react'
import { useTimeline } from '@/hooks/useTimeline'
import { PLATFORMS_ICONS } from '@/global/globals'

type Props = {
  movie: Movie
  firstUnreleasedMovieIndex: number
  index: number
}
const currentDate = new Date()

const TimelineMovieCard = ({ movie, firstUnreleasedMovieIndex, index: i }: Props) => {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [posterPreview, setPosterPreview] = useState(movie.poster || posterPlaceholder)

  const { scrollToCard, activeCardIndex, lenisRef } = useTimeline()

  const handleCardClick = () => {
    // TODO: Close other open editors
    setIsEditOpen((prev) => !prev)
    scrollToCard(i)
  }

  lenisRef?.current?.lenis?.on('scroll', (e) => {
    if (e.userData && e.userData.source !== 'scrollToCard') {
      setIsEditOpen(false)
    }
  })

  const posterToDisplay = useMemo(() => {
    if (isEditOpen) {
      return posterPreview || posterPlaceholder
    } else {
      return movie.poster || posterPlaceholder
    }
  }, [isEditOpen, posterPreview, movie.poster])

  return (
    <div className="flex">
      <AspectRatio
        onClick={handleCardClick}
        data-movie-index={i}
        {...(firstUnreleasedMovieIndex === i && { 'data-first-unreleased': true })}
        key={`${movie.date}-${i}`}
        ratio={2 / 3}
        className="z-50 h-[80dvh] cursor-pointer"
      >
        <img
          src={posterToDisplay}
          // alt={movie.title}
          className={`h-full object-cover ${isReleased(movie.date) ? '' : 'grayscale'}`}
        />
        <div className="absolute inset-0 flex flex-1 flex-col justify-between p-4">
          <div className="ml-auto flex">
            <img
              title={movie.platform}
              src={PLATFORMS_ICONS[movie.platform]}
              alt={movie.platform}
              className="h-10 bg-accent p-2"
            />
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
      <TimelineMovieEditor
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        movieData={movie}
        setPosterPreview={setPosterPreview}
      />
    </div>
  )
}

export default TimelineMovieCard
