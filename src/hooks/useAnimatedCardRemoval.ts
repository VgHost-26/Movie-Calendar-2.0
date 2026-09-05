import { useCallback } from 'react'

import { useTimelineStore } from '@/stores/timelineStore'

// Duration of the slide-down exit before the item is removed from the list.
export const CARD_EXIT_DURATION_MS = 250
// Duration of the rise-in entrance for freshly added cards.
export const CARD_ENTER_DURATION_MS = 650

/**
 * Orchestrates the two-phase card removal used by the timeline:
 * 1. the card slides down (transform only, layout/indices untouched),
 * 2. only then the DB commit runs, which drops the item from the list and
 *    lets the cards on the right glide left via `layout` animation.
 *
 * Keeping the item in the array during phase 1 is what keeps the scroll
 * system (itemRefs, data-movie-index selectors, activeCardIndex) stable.
 */
export function useAnimatedCardRemoval() {
  const leavingCardIds = useTimelineStore(state => state.leavingCardIds)
  const addLeavingCardId = useTimelineStore(state => state.addLeavingCardId)
  const removeLeavingCardId = useTimelineStore(state => state.removeLeavingCardId)
  const clearLeavingCardIds = useTimelineStore(state => state.clearLeavingCardIds)

  const removeWithExit = useCallback(
    async (movieId: string, commit: () => Promise<unknown>) => {
      if (useTimelineStore.getState().leavingCardIds.includes(movieId)) return
      addLeavingCardId(movieId)
      await new Promise(resolve => setTimeout(resolve, CARD_EXIT_DURATION_MS))
      try {
        await commit()
      } catch (error) {
        // Commit failed: let the card spring back into place.
        removeLeavingCardId(movieId)
        throw error
      }
      // On success the id stays marked until TimelineContent observes it gone
      // from the list and clears it (covers the query refetch delay).
    },
    [addLeavingCardId, removeLeavingCardId],
  )

  return { leavingCardIds, removeWithExit, removeLeavingCardId, clearLeavingCardIds }
}
