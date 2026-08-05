import { useTimeline } from '@/hooks/useTimeline'
import TimelineMovieCard from './TimelineMovieCard'
import type { Movie, ScrollDirection } from '@/Types/types'
import { useLenis } from 'lenis/react'
import { useRef } from 'react'

type Props = {
  movies: Movie[]
  firstUnreleasedMovieIndex: number
}

const TimelineContent = ({ movies, firstUnreleasedMovieIndex }: Props) => {
  const { setActiveCardIndex, setScrollDirection } = useTimeline()
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const windowWidth = window.innerWidth
  
  useLenis(({ scroll, direction }) => {
    setScrollDirection(direction)
    const leftQuarter = scroll + windowWidth / 4

    let closestIndex = 0
    let minDist = Infinity

    itemRefs.current.forEach((el, i) => {
      if (el) {
        const elCenterLeftEdge = el.offsetLeft
        const dist = Math.abs(elCenterLeftEdge - leftQuarter)
        if (dist < minDist) {
          minDist = dist
          closestIndex = i
        }
      }
    })
    setActiveCardIndex(closestIndex)
  })

  return (
    <div className="flex w-max items-center gap-20 pl-4">
      {movies.map((movie, i) => (
        <div
          ref={(el) => {
            itemRefs.current[i] = el
          }}
          key={`${movie.id}`}
        >
          <TimelineMovieCard
            movie={movie}
            firstUnreleasedMovieIndex={firstUnreleasedMovieIndex}
            i={i}
          />
        </div>
      ))}
      {/* NOTE: magick number */}
      <div className="w-[calc(100dvw-(160dvh/3)-142px)]"></div>
    </div>
  )
}

export default TimelineContent
