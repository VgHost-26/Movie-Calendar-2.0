import { create } from 'zustand'

import type { Movie, MovieFormData } from '@/Types/types'

import { getDemoSeedMovies } from '@/data/demoMovies'

interface DemoStore {
  /** When true, the app runs fully locally: no Firebase reads/writes. */
  isDemoMode: boolean
  /** In-memory demo collection. Intentionally NOT persisted: a hard refresh wipes it. */
  movies: Movie[]
  enterDemo: () => void
  exitDemo: () => void
  resetDemo: () => void
  addMovie: (movie: Omit<Movie, 'id' | 'createdAt'>) => string
  updateMovie: (movieId: string, updatedMovie: Partial<MovieFormData>) => void
  deleteMovie: (movieId: string) => void
}

export const useDemoStore = create<DemoStore>(set => ({
  isDemoMode: false,
  movies: [],

  enterDemo: () => set({ isDemoMode: true, movies: getDemoSeedMovies() }),
  exitDemo: () => set({ isDemoMode: false, movies: [] }),
  resetDemo: () => set({ movies: getDemoSeedMovies() }),

  addMovie: movie => {
    const id = `demo-${crypto.randomUUID()}`
    set(state => ({ movies: [...state.movies, { ...movie, id }] }))
    return id
  },
  updateMovie: (movieId, updatedMovie) =>
    set(state => ({
      movies: state.movies.map(movie =>
        movie.id === movieId ? { ...movie, ...updatedMovie } : movie,
      ),
    })),
  deleteMovie: movieId =>
    set(state => ({ movies: state.movies.filter(movie => movie.id !== movieId) })),
}))
