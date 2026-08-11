import { createContext, useContext } from 'react'

import type { TimelineContextProps } from '@/components/providers/TimelineContext'

export const TimelineContext = createContext<TimelineContextProps | null>(null)

export const useTimeline = () => {
  const ctx = useContext(TimelineContext)
  if (!ctx) {
    throw new Error('useTimeline must be used within a TimelineContextProvider')
  }
  return ctx
}
