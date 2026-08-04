import { PLATFORMS } from '@/global/globals'
import { z } from 'zod'

export const movieSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be in YYYY-MM-DD format' }),
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(100, { message: 'Title must be less than 100 characters' }),
  platform: z.enum(PLATFORMS),
  trailerURL: z.string().optional(),
  poster: z.string().optional(),
})
