export interface TMDBSearchResponse {
  page: number
  results: TMDBMovie[]
  total_pages: number
  total_results: number
}

export interface TMDBMovie {
  adult: boolean
  backdrop_path: null | string
  genre_ids: number[]
  id: number
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: null | string
  release_date: string
  title: string
  video: boolean
  vote_average: number
  vote_count: number
}

export interface TMDBMultiSearchResponse {
  page: number
  results: TMDBMulti[]
  total_pages: number
  total_results: number
}

export interface TMDBMulti {
  adult: boolean
  backdrop_path: null | string
  id: number
  name?: string
  original_name?: string
  overview: string
  poster_path: string
  media_type: MediaType
  original_language: string
  genre_ids: number[]
  popularity: number
  first_air_date?: string
  softcore: boolean
  vote_average: number
  vote_count: number
  origin_country?: string[]
  title?: string
  original_title?: string
  release_date?: string
  video?: boolean
}

export const MediaType = {
  Movie: 'movie',
  Tv: 'tv',
} as const
export type MediaType = (typeof MediaType)[keyof typeof MediaType]
