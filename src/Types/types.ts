import type z from 'zod'

import type { loginSchema, movieSchema, signupSchema } from '@/schemas/zotSchemas'

import { LANGUAGES, PLATFORMS } from '@/global/globals'

export const ScrollDirection = {
  BACKWARD: -1,
  NONE: 0,
  FORWARD: 1,
} as const
export type ScrollDirection = (typeof ScrollDirection)[keyof typeof ScrollDirection]

export type Platform = (typeof PLATFORMS)[number]
export type Language = (typeof LANGUAGES)[number]
export interface Movie {
  id: string
  date: string
  title: string
  platform: Platform
  poster?: string
  createdAt?: string
  trailerURL?: string
  TMDBId?: number
  YoutubeId?: string
}


export interface CalendarDay {
  date: Date
  dayOfMonth: number
  isCurrentMonth: boolean
  isToday: boolean
  isWeekend: boolean
  movies?: Movie[]
}
export interface UserSettings {
  platforms: Platform[]
  languageId: Language['id']
  isPosterText: boolean
  isPremiumUser?: boolean
}


export type MovieFormData = z.infer<typeof movieSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>