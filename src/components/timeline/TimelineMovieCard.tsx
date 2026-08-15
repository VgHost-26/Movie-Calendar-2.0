import { differenceInDays } from 'date-fns'
import { useEffect, useMemo, useState } from 'react'

import posterPlaceholder from '@/assets/images/poster-placeholder.png'
import { PLATFORMS_ICONS } from '@/global/globals'
import useDebounce from '@/hooks/useDebounce'
import { useIsMobile } from '@/hooks/useMobile'
import { useTimeline } from '@/hooks/useTimeline'
import { useTimelineStore } from '@/stores/timelineStore'
import { type Movie } from '@/Types/types'
import { isReleased } from '@/utils/movieFunctions'

import { AspectRatio } from '../ui/aspect-ratio'
import TimelineMovieEditor from './TimelineMovieEditor'

type Props = {
  movie: Movie
  firstUnreleasedMovieIndex: number
  index: number
}
const currentDate = new Date()

const TimelineMovieCard = ({ movie, firstUnreleasedMovieIndex, index }: Props) => {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [posterPreview, setPosterPreview] = useState(movie.poster || posterPlaceholder)
  const [scroll, setScroll] = useState(0)

  const isMobile = useIsMobile()
  const debouncedScroll = useDebounce(scroll, 150)

  const { scrollToCard, lenisRef, activeCardIndex } = useTimeline()
  const setFocusedCardId = useTimelineStore(state => state.setFocusedCardId)

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
  // TODO: Should i off() this?
  lenisRef?.current?.lenis?.on('scroll', e => {
    if (e.userData && e.userData.source !== 'scrollToCard') {
      setScroll(e.scroll)
      setIsEditOpen(false)
      setFocusedCardId(null)
    }
  })

  const posterToDisplay = useMemo(() => {
    if (isEditOpen) {
      return posterPreview || posterPlaceholder
    } else {
      return movie.poster || posterPlaceholder
    }
  }, [isEditOpen, posterPreview, movie.poster])

  useEffect(() => {
    if (!isMobile) return
    scrollToCard(activeCardIndex)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCardIndex, debouncedScroll, isMobile])

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
    <div className="flex h-full">
      <AspectRatio
        onClick={handleCardClick}
        data-movie-index={index}
        {...(firstUnreleasedMovieIndex === index && { 'data-first-unreleased': true })}
        key={`${movie.date}-${index}`}
        ratio={2 / 3}
        className="z-50 h-full cursor-pointer"
      >
        <img
          src={posterToDisplay}
          // alt={movie.title}
          className={`h-full w-full object-cover ${isReleased(movie.date) ? '' : 'grayscale'}`}
        />
        <div className="absolute inset-0 flex flex-1 flex-col justify-between bg-linear-0 from-black/80 from-0% to-transparent to-30% p-3">
          {/* Platform badge */}
          <div className="ml-auto flex">
            <img
              title={movie.platform}
              src={PLATFORMS_ICONS[movie.platform]}
              alt={movie.platform}
              className="h-10 w-10 bg-accent p-1.5"
            />
          </div>
          <div className="flex flex-1 items-end justify-between">
            <div>
              {isReleased(movie.date) ? (
                <h1 className="text-5xl font-semibold text-white">Released</h1>
              ) : (
                <div className="flex items-stretch gap-0.5">
                  <h1 className="number-trim flex items-center text-8xl font-bold text-white">
                    {differenceInDays(new Date(movie.date), currentDate)
                      .toString()
                      .padStart(2, '0')}
                  </h1>

                  <div className="flex items-center justify-center">
                    <span className="text-md rotate-180 font-heading leading-none text-primary [text-align-last:justify] [text-orientation:sideways] [writing-mode:vertical-rl]">
                      Days left
                    </span>
                  </div>
                </div>
              )}
            </div>
            <h2 className="text-4xl leading-tight font-semibold text-white">{movie.title}</h2>
          </div>
        </div>
      </AspectRatio>
      {!isMobile && (
        <TimelineMovieEditor
          isOpen={isEditOpen}
          onOpenChange={setIsEditOpen}
          movieData={movie}
          setPosterPreview={setPosterPreview}
        />
      )}
    </div>
  )
}

export default TimelineMovieCard
