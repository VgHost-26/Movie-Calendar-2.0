import { differenceInDays } from 'date-fns'
import { useEffect, useMemo, useState } from 'react'

import posterPlaceholder from '@/assets/images/poster-placeholder.png'
import { PLATFORMS_ICONS } from '@/global/globals'
import { useIsMobile } from '@/hooks/useMobile'
import { useTimeline } from '@/hooks/useTimeline'
import { useTimelineStore } from '@/stores/timelineStore'
import { type Movie } from '@/Types/types'
import { formatMovieDateLabel, parseMovieDate, toDisplayDate } from '@/utils/movieDate'
import { isReleased } from '@/utils/movieFunctions'

import { AspectRatio } from '../ui/aspect-ratio'
import TimelineMovieEditor from './TimelineMovieEditor'
import WatchedButton from './WatchedButton'

type Props = {
  movie: Movie
  firstUnreleasedMovieIndex: number
  index: number
}
const currentDate = new Date()

const TimelineMovieCard = ({ movie, firstUnreleasedMovieIndex, index }: Props) => {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [posterPreview, setPosterPreview] = useState(movie.poster || posterPlaceholder)
  // const [scroll, setScroll] = useState(0)

  const datePrecision = parseMovieDate(movie.date)?.precision ?? 'none'
  const displayDate = toDisplayDate(movie.date)

  const isMobile = useIsMobile()
  // const debouncedScroll = useDebounce(scroll, 150)

  const { scrollToCard } = useTimeline()
  const setFocusedCardId = useTimelineStore(state => state.setFocusedCardId)
  const focusedCardId = useTimelineStore(state => state.focusedCardId)

  const handleCardClick = () => {
    // TODO: Close other open editors
    if (isEditOpen) {
      console.log('editor is open -> closing')
      setIsEditOpen(false)
      setFocusedCardId(null)
    } else {
      console.log('editor is closed -> opening')
      setFocusedCardId(movie.id)
      scrollToCard(index)
      setIsEditOpen(true)
    }
  }

  const posterToDisplay = useMemo(() => {
    if (isEditOpen) {
      return posterPreview || posterPlaceholder
    } else {
      return movie.poster || posterPlaceholder
    }
  }, [isEditOpen, posterPreview, movie.poster])

  useEffect(() => {
    if (!isEditOpen) return
    console.log('trigger card id:', focusedCardId, movie.id)
    if (focusedCardId !== movie.id) {
      setIsEditOpen(false)
    }
  }, [focusedCardId, isEditOpen, movie.id])

  // useEffect(() => {
  //   if (!isMobile) return
  //   scrollToCard(activeCardIndex)
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [activeCardIndex, isMobile])

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
          loading="lazy"
          src={posterToDisplay}
          // alt={movie.title}
          className={`h-full w-full object-cover ${isReleased(movie.date) ? '' : 'grayscale'}`}
        />
        <div className="absolute inset-0 flex flex-1 flex-col justify-between bg-linear-0 from-black/80 from-0% to-transparent to-30% p-3">
          {/* Top badges row */}
          <div className="flex items-start justify-between">
            <WatchedButton movie={movie} />
            <div className="ml-auto flex">
              <img
                title={movie.platform}
                src={PLATFORMS_ICONS[movie.platform]}
                alt={movie.platform}
                className="h-10 w-10 bg-accent p-1.5"
              />
            </div>
          </div>
          <div className="flex items-end justify-between gap-10">
            <div>
              {datePrecision === 'none' ? (
                <h1 className="text-4xl font-semibold text-white">Coming&nbsp;Soon</h1>
              ) : isReleased(movie.date) ? (
                <h1 className="text-5xl font-semibold text-white">Released</h1>
              ) : datePrecision === 'day' && displayDate ? (
                <div className="flex items-stretch gap-0.5">
                  <h1 className="number-trim flex items-center text-8xl font-bold text-white">
                    {differenceInDays(displayDate, currentDate).toString().padStart(2, '0')}
                  </h1>

                  <div className="flex items-center justify-center">
                    <span className="text-md rotate-180 font-heading leading-none text-primary [text-align-last:justify] [text-orientation:sideways] [writing-mode:vertical-rl]">
                      Days left
                    </span>
                  </div>
                </div>
              ) : (
                <h1 className="text-4xl font-semibold text-white">
                  {formatMovieDateLabel(movie.date)}
                </h1>
              )}
            </div>
            <h2 className="text-right text-4xl leading-tight font-semibold text-white">
              {movie.title}
            </h2>
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
