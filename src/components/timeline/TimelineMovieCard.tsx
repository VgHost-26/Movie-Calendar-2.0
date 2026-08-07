import { type Movie } from '@/Types/types'
import { AspectRatio } from '../ui/aspect-ratio'
import { differenceInDays } from 'date-fns'
import { isReleased } from '@/utils/movieFunctions'
import posterPlaceholder from '@/assets/images/poster-placeholder.png'
import TimelineMovieEditor from './TimelineMovieEditor'
import {  useMemo, useState } from 'react'
import { useTimeline } from '@/hooks/useTimeline'
import { PLATFORMS_ICONS } from '@/global/globals'
import { useTimelineStore } from '@/store/store'

type Props = {
  movie: Movie
  firstUnreleasedMovieIndex: number
  index: number
}
const currentDate = new Date()

const TimelineMovieCard = ({ movie, firstUnreleasedMovieIndex, index }: Props) => {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [posterPreview, setPosterPreview] = useState(movie.poster || posterPlaceholder)

  const { scrollToCard, lenisRef } = useTimeline()
  const setFocusedCardId = useTimelineStore((state) => state.setFocusedCardId)

  const handleCardClick = () => {
    // TODO: Close other open editors
    if (isEditOpen) {
      setIsEditOpen(false)
      setFocusedCardId(null)
    } else {
      setFocusedCardId(movie.id)
      scrollToCard(index)
      setIsEditOpen(true)
    }
  }

  // close on scroll
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

  // useEffect(() => {
  //   // TODO: fix thiss so it will not scroll too far when both are oppen and one will close and move the scroll position
  //   // if (focusedCardId !== movie.id) {
  //   //   setIsEditOpen(false)
  //   // } else {
  //   //   setIsEditOpen(true)
  //   //   scrollToCard(index)
  //   // }
  // }, [focusedCardId, isEditOpen])

  return (
    <div className="flex">
      <AspectRatio
        onClick={handleCardClick}
        data-movie-index={index}
        {...(firstUnreleasedMovieIndex === index && { 'data-first-unreleased': true })}
        key={`${movie.date}-${index}`}
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
            <div className="flex gap-2">
              {isReleased(movie.date) ? (
                <h1 className="text-5xl font-bold text-white">Released</h1>
              ) : (
                <div className="flex items-stretch gap-1">
                  <h1 className="number-trim flex items-center text-8xl leading-none font-bold text-white">
                    {differenceInDays(new Date(movie.date), currentDate)
                      .toString()
                      .padStart(2, '0')}
                  </h1>

                  <div className="flex items-center justify-center">
                    <span className="text-md rotate-180 font-heading text-primary [text-align-last:justify] [text-orientation:sideways] [writing-mode:vertical-rl]">
                      Days left
                    </span>
                  </div>
                </div>
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
