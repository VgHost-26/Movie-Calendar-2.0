import { PLATFORMS } from '@/global/globals'
import type { movieSchema } from '@/schemas/zotSchemas'
import type z from 'zod'

export type Platform = (typeof PLATFORMS)[number]
export interface Movie {
  id: string
  date: string
  title: string
  platform: Platform
  poster?: string
  createdAt?: string
  trailerURL?: string
}

export type MovieFormData = z.infer<typeof movieSchema>

export interface CalendarDay {
  date: Date
  dayOfMonth: number
  isCurrentMonth: boolean
  isToday: boolean
  isWeekend: boolean
  movies?: Movie[]
}
