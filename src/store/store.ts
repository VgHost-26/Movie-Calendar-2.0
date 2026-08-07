import { create } from 'zustand'

interface TimelineStore {
  focusedCardId: string | null
  setFocusedCardId: (id: string | null) => void
  clearFocusedCardId: () => void
}

export const useTimelineStore = create<TimelineStore>((set) => ({
  focusedCardId: null,
  setFocusedCardId: (id) => set({ focusedCardId: id }),
  clearFocusedCardId: () => set({ focusedCardId: null }),
}))
