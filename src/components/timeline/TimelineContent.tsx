import { useTimeline } from '@/hooks/useTimeline'
import TimelineMovieCard from './TimelineMovieCard'
import type { Movie } from '@/Types/types'
import { useLenis } from 'lenis/react'
import { useRef, type Dispatch } from 'react'

type Props = {
  movies: Movie[]
  firstUnreleasedMovieIndex: number
  setScrollDirection: Dispatch<-1 | 1 | 0>
}

const TimelineContent = ({ movies, firstUnreleasedMovieIndex, setScrollDirection }: Props) => {
  const { setActiveCardIndex } = useTimeline()
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useLenis(({ scroll, direction }) => {
    setScrollDirection(direction)
    const windowWidth = window.innerWidth
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
          key={`${movie.title}-${i}`}
        >
          <TimelineMovieCard
            movie={movie}
            firstUnreleasedMovieIndex={firstUnreleasedMovieIndex}
            i={i}
          />
        </div>
      ))}
    </div>
  )
}

export default TimelineContent
