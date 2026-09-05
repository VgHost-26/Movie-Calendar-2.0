import { create } from 'zustand'

interface TimelineStore {
  focusedCardId: string | null
  setFocusedCardId: (id: string | null) => void
  clearFocusedCardId: () => void
  isAddMovieDialogOpen: boolean
  setIsAddMovieDialogOpen: (isOpen: boolean) => void
  cardWidth: number
  setCardWidth: (width: number) => void
  cardHeight: number
  leavingCardIds: string[]
  addLeavingCardId: (id: string) => void
  removeLeavingCardId: (id: string) => void
  clearLeavingCardIds: () => void
}

export const useTimelineStore = create<TimelineStore>(set => ({
  focusedCardId: null,
  setFocusedCardId: id => set({ focusedCardId: id }),
  clearFocusedCardId: () => set({ focusedCardId: null }),
  isAddMovieDialogOpen: false,
  setIsAddMovieDialogOpen: isOpen => set({ isAddMovieDialogOpen: isOpen }),
  cardWidth: 0,
  cardHeight: 0,
  setCardWidth: (width: number) => set({ cardWidth: width, cardHeight: width * 1.5 }),
  leavingCardIds: [],
  addLeavingCardId: id =>
    set(state =>
      state.leavingCardIds.includes(id) ? state : { leavingCardIds: [...state.leavingCardIds, id] },
    ),
  removeLeavingCardId: id =>
    set(state => ({ leavingCardIds: state.leavingCardIds.filter(x => x !== id) })),
  clearLeavingCardIds: () => set({ leavingCardIds: [] }),
}))
