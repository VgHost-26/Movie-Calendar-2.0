import { CheckIcon, EyeOffIcon } from 'lucide-react'
import { toast } from 'sonner'

import type { Movie } from '@/Types/types'

import { useUpdateMovie } from '@/api/apiFirebase'
import { useAnimatedCardRemoval } from '@/hooks/useAnimatedCardRemoval'
import { useTimelineStore } from '@/stores/timelineStore'
import { isReleased } from '@/utils/movieFunctions'

import { Button } from '../ui/button'

type Props = {
  movie: Movie
  onToggled?: (watched: boolean) => void
  className?: string
}

const WatchedButton = ({ movie, onToggled, className }: Props) => {
  const { updateMovie, isLoading } = useUpdateMovie()
  const { leavingCardIds, removeWithExit } = useAnimatedCardRemoval()
  const focusedCardId = useTimelineStore(state => state.focusedCardId)
  const clearFocusedCardId = useTimelineStore(state => state.clearFocusedCardId)
  const watched = !!movie.watched
  const isLeaving = leavingCardIds.includes(movie.id)

  // Not available for not yet released movies, unless already watched (allow undo).
  if (!watched && !isReleased(movie.date)) {
    return null
  }

  const handlePress = async () => {
    // Close the editor right away so it slides away while the card falls.
    if (focusedCardId === movie.id) {
      clearFocusedCardId()
    }
    try {
      // The card slides down first; the DB write (which drops it from the
      // list) runs only after the exit finishes.
      await removeWithExit(movie.id, () => updateMovie(movie.id, { watched: !watched }))
      toast.success(!watched ? 'Marked as watched!' : 'Moved back to timeline!')
      onToggled?.(!watched)
    } catch {
      // error toast is handled inside updateMovie, card springs back into place
    }
  }

  return (
    <span
      // Prevent the parent card click (open editor) when pressing the button.
      onClick={e => e.stopPropagation()}
      className={className}
    >
      <Button
        size="xs"
        variant="secondary"
        onPress={handlePress}
        isDisabled={isLoading || isLeaving}
        aria-label={watched ? `Mark ${movie.title} as unwatched` : `Mark ${movie.title} as watched`}
        className="bg-black/60 text-white backdrop-blur-sm hover:bg-black/80 hover:text-white"
      >
        {watched ? <EyeOffIcon data-icon="inline-start" /> : <CheckIcon data-icon="inline-start" />}
        {watched ? 'Watched' : 'Watched?'}
      </Button>
    </span>
  )
}

export default WatchedButton
