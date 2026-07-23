import type { TimelineContextProps } from '@/components/providers/TimelineContext'
import { createContext, useContext } from 'react'

export const TimelineContext = createContext<TimelineContextProps | null>(null)

export const useTimeline = () => {
  const ctx = useContext(TimelineContext)
  if (!ctx) {
    throw new Error('useTimeline must be used within a TimelineContextProvider')
  }
  return ctx
}
