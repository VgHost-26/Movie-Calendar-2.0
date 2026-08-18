import { z } from 'zod'

import { PLATFORMS } from '@/global/globals'

export const movieSchema = z.object({
  date: z.string(),
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(100, { message: 'Title must be less than 100 characters' }),
  platform: z.enum(PLATFORMS),
  trailerURL: z.string().optional(),
  poster: z.string().optional(),
  TMDBId: z.number().optional(),
  YoutubeId: z.string().optional(),
})


export const loginSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' }),
})

export const signupSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
  confirmPassword: z
    .string()
    .min(1, { message: 'Confirm password is required' }),
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .max(20, { message: 'Name must be less than 20 characters' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})