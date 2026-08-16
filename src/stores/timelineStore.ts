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
}

export const useTimelineStore = create<TimelineStore>((set) => ({
  focusedCardId: null,
  setFocusedCardId: (id) => set({ focusedCardId: id }),
  clearFocusedCardId: () => set({ focusedCardId: null }),
  isAddMovieDialogOpen: false,
  setIsAddMovieDialogOpen: (isOpen) => set({ isAddMovieDialogOpen: isOpen }),
  cardWidth: 0,
  cardHeight: 0,
  setCardWidth: (width: number) => set({ cardWidth: width, cardHeight: width * 1.5 }),
 
}))
