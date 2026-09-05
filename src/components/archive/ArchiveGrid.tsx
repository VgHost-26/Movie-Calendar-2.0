import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'

import type { Movie } from '@/Types/types'

import { useAnimatedCardRemoval } from '@/hooks/useAnimatedCardRemoval'

import { Skeleton } from '../ui/skeleton'
import ArchiveMovieCard from './ArchiveMovieCard'

type Props = {
  movies: Movie[]
  isPending?: boolean
  isLoading?: boolean
}

const SKELETON_COUNT = 12

const ArchiveGrid = ({ movies, isPending = false, isLoading = false }: Props) => {
  const { leavingCardIds, removeLeavingCardId, clearLeavingCardIds } = useAnimatedCardRemoval()

  // The exit marker outlives the DB commit (query refetch delay); drop it once
  // the id is actually gone from this list.
  useEffect(() => {
    if (leavingCardIds.length === 0) return
    const ids = new Set(movies.map(m => m.id))
    leavingCardIds.filter(id => !ids.has(id)).forEach(removeLeavingCardId)
  }, [movies, leavingCardIds, removeLeavingCardId])

  // Markers live in the global store; don't leak them when leaving the page mid-flight.
  useEffect(() => () => clearLeavingCardIds(), [clearLeavingCardIds])

  if (isLoading && movies.length === 0) {
    return (
      <div className="grid flex-1 grid-cols-2 gap-3 overflow-y-auto p-window pt-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <Skeleton key={i} className="aspect-[2/3] w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid flex-1 grid-cols-2 content-start gap-3 overflow-y-auto p-window pt-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      <AnimatePresence mode="popLayout">
        {!isPending &&
          movies.map(movie => {
            const isLeaving = leavingCardIds.includes(movie.id)
            return (
              <motion.div
                layout
                key={movie.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={isLeaving ? { opacity: 0, scale: 0.95 } : { opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <ArchiveMovieCard movie={movie} />
              </motion.div>
            )
          })}
      </AnimatePresence>
    </div>
  )
}

export default ArchiveGrid
