import { PLATFORMS } from '@/global/globals'

export type Platform = (typeof PLATFORMS)[number]
export interface Movie {
  date: string
  title: string
  platform: Platform
  poster?: string
  trailerURL?: string
}

export interface CalendarDay {
  date: Date
  dayOfMonth: number
  isCurrentMonth: boolean
  isToday: boolean
  isWeekend: boolean
  movies?: Movie[]
}
