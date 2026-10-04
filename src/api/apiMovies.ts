import type { UseQueryResult } from '@tanstack/react-query'

import { toast } from 'sonner'

import type { Movie, MovieFormData } from '@/Types/types'

import { useDemoStore } from '@/stores/demoStore'
import {
  useAddMovie as useFirebaseAddMovie,
  useDeleteMovie as useFirebaseDeleteMovie,
  useGetMovies as useFirebaseGetMovies,
  useUpdateMovie as useFirebaseUpdateMovie,
} from './apiFirebase'

/**
 * Unified movies API.
 *
 * Components always import from here — never from `apiFirebase` directly.
 * This module picks the backend (Firebase vs. local in-memory demo store)
 * in ONE place, so UI code contains zero `if (isDemoMode)` branches and new
 * features only need to be implemented once per backend, here.
 *
 * Hook names and signatures intentionally mirror `apiFirebase`.
 */

export function useGetMovies(userId: string): UseQueryResult<Movie[]> {
  const isDemoMode = useDemoStore(state => state.isDemoMode)
  const demoMovies = useDemoStore(state => state.movies)
  const firebaseQuery = useFirebaseGetMovies(userId, { enabled: !isDemoMode })

  if (!isDemoMode) {
    return firebaseQuery
  }

  return {
    ...firebaseQuery,
    data: demoMovies,
    isLoading: false,
    isPending: false,
    isSuccess: true,
    isError: false,
    error: null,
    fetchStatus: 'idle',
  } as UseQueryResult<Movie[]>
}

export function useAddMovie() {
  const isDemoMode = useDemoStore(state => state.isDemoMode)
  const addDemoMovie = useDemoStore(state => state.addMovie)
  const firebase = useFirebaseAddMovie()

  const addMovie = async (movie: Omit<Movie, 'id' | 'createdAt'>) => {
    if (isDemoMode) {
      return addDemoMovie(movie)
    }
    return firebase.addMovie(movie)
  }

  return {
    addMovie,
    isLoading: isDemoMode ? false : firebase.isLoading,
    error: isDemoMode ? null : firebase.error,
  }
}

export function useUpdateMovie() {
  const isDemoMode = useDemoStore(state => state.isDemoMode)
  const updateDemoMovie = useDemoStore(state => state.updateMovie)
  const firebase = useFirebaseUpdateMovie()

  const updateMovie = async (movieId: string, updatedMovie: Partial<MovieFormData>) => {
    if (isDemoMode) {
      updateDemoMovie(movieId, updatedMovie)
      toast.success('Movie updated successfully!')
      return
    }
    return firebase.updateMovie(movieId, updatedMovie)
  }

  return {
    updateMovie,
    isLoading: isDemoMode ? false : firebase.isLoading,
    error: isDemoMode ? null : firebase.error,
  }
}

export function useDeleteMovie() {
  const isDemoMode = useDemoStore(state => state.isDemoMode)
  const deleteDemoMovie = useDemoStore(state => state.deleteMovie)
  const firebase = useFirebaseDeleteMovie()

  const deleteMovie = async (movieId: string) => {
    if (isDemoMode) {
      deleteDemoMovie(movieId)
      toast.success('Movie deleted successfully!')
      return
    }
    return firebase.deleteMovie(movieId)
  }

  return { deleteMovie }
}
