import { keepPreviousData, useQuery, useQueryClient, type UseQueryResult } from '@tanstack/react-query'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import { useState } from 'react'
import { toast } from 'sonner'

import type { Movie, MovieFormData } from '@/Types/types'

import useAuth from '@/hooks/useAuth'
import { db } from '@/lib/firebase'

const fetchMovies = async (userId: string) => {
  const q = query(collection(db, 'users', userId, 'movies'), orderBy('date', 'asc'))
  const snapshot = await getDocs(q)
  console.log(
    'Fetched movies for user:',
    userId,
    snapshot.docs.map((doc) => doc.data()),
  )
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Movie[]
}

// TODO: add listener
export function useGetMovies(userId: string): UseQueryResult<Movie[]> {
  return useQuery({
    queryKey: ['movies', userId],
    queryFn: () => fetchMovies(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!userId,
    placeholderData: keepPreviousData,
  })
}

export function useAddMovie() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const queryClient = useQueryClient()

  const addMovie = async (movie: Omit<Movie, 'id' | 'createdAt'>) => {
    if (!user) {
      setError(new Error('User not authenticated'))
      // throw new Error('User not authenticated')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const docRef = await addDoc(collection(db, 'users', user.uid, 'movies'), {
        ...movie,
        createdAt: serverTimestamp(),
      })
      queryClient.invalidateQueries({ queryKey: ['movies', user.uid] })
      return docRef.id
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setIsLoading(false)
    }
  }
  return { addMovie, isLoading, error }
}

export function useUpdateMovie() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const queryClient = useQueryClient()

  const updateMovie = async (movieId: string, updatedMovie: Partial<MovieFormData>) => {
    if (!user) {
      setError(new Error('User not authenticated'))
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      await setDoc(doc(db, 'users', user.uid, 'movies', movieId), updatedMovie, { merge: true })
      toast.success('Movie updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['movies', user.uid] })
    } catch (err) {
      setError(err as Error)
      toast.error('Failed to update movie. Please try again.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { updateMovie, isLoading, error }
}

export function useDeleteMovie() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const deleteMovie = async (movieId: string) => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    try {
      await deleteDoc(doc(db, 'users', user.uid, 'movies', movieId))
      toast.success('Movie deleted successfully!')
      queryClient.invalidateQueries({ queryKey: ['movies', user.uid] })
    } catch (err) {
      console.error('Error deleting movie:', err)
      toast.error('Failed to delete movie. Please try again.')
      throw err
    }
  }

  return { deleteMovie }
}
