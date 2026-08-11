import { create } from 'zustand'

interface TimelineStore {
  focusedCardId: string | null
  setFocusedCardId: (id: string | null) => void
  clearFocusedCardId: () => void
  isAddMovieDialogOpen: boolean
  setIsAddMovieDialogOpen: (isOpen: boolean) => void
}

export const useTimelineStore = create<TimelineStore>((set) => ({
  focusedCardId: null,
  setFocusedCardId: (id) => set({ focusedCardId: id }),
  clearFocusedCardId: () => set({ focusedCardId: null }),
  isAddMovieDialogOpen: false,
  setIsAddMovieDialogOpen: (isOpen) => set({ isAddMovieDialogOpen: isOpen }),
}))
