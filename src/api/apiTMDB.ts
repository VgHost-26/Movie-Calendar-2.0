import type {
  TMDBMovie,
  TMDBMulti,
  TMDBMultiSearchResponse,
  TMDBSearchResponse,
} from '@/Types/tmdbTypes'
import {
  useMutation,
  useQuery,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query'
import { toast } from 'sonner'

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
  },
}

const baseUrl = 'https://api.themoviedb.org/3'

export const fetchMovie = async (title: string, year?: string): Promise<TMDBSearchResponse> => {
  console.log('Fetching TMDB movies...')
  try {
    const response = await fetch(
      `${baseUrl}/search/movie?query=${title}&include_adult=true&language=en-US&page=1` +
        (year ? `&primary_release_year=${year}` : ''),
      options,
    )

    const data = await response.json()
    console.log('TMDB movies fetched:', data.results)
    return data
  } catch (error) {
    console.error('Error fetching TMDB movies:', error)
    toast.error('Error fetching TMDB movies. Please try again later.')
    throw error
  }
}

export const fetchMulti = async (query: string): Promise<TMDBMultiSearchResponse> => {
  console.log('Fetching TMDB multi search...')
  try {
    const response = await fetch(
      `${baseUrl}/search/multi?query=${query}&include_adult=true&language=en-US&page=1`,
      options,
    )
    const data = await response.json()
    console.log('TMDB multi search fetched:', data.results)
    return data
  } catch (error) {
    console.error('Error fetching TMDB multi search:', error)
    toast.error('Error fetching TMDB multi search. Please try again later.')
    throw error
  }
}

type SearchMoviesParams = {
  query: string
  year?: string
}

export const useSearchMoviesMutation = (): UseMutationResult<
  TMDBSearchResponse,
  Error,
  SearchMoviesParams
> => {
  return useMutation({
    mutationKey: ['searchMovies'],
    mutationFn: ({ query, year }: SearchMoviesParams) => fetchMovie(query, year),
  })
}

type SearchMultiParams = {
  query: string
}

export const useSearchMultiMutation = (): UseMutationResult<
  TMDBMultiSearchResponse,
  Error,
  SearchMultiParams
> => {
  return useMutation({
    mutationKey: ['searchMulti'],
    mutationFn: ({ query }: SearchMultiParams) => fetchMulti(query),
  })
}

export const getPosterUrl = (movie: TMDBMovie | TMDBMulti) => {
  return movie.poster_path ? `https://image.tmdb.org/t/p/w1280/${movie.poster_path}` : ''
}

// https://image.tmdb.org/t/p/w1280/
