const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
  },
}

export const fetchMovie = async (title: string) => {
  console.log('Fetching TMDB movies...')
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${title}&include_adult=true&language=en-US&page=1`,
      options,
    )

    const data = await response.json()
    console.log('TMDB movies fetched:', data.results)
    return data.results
  } catch (error) {
    console.error('Error fetching TMDB movies:', error)
    throw error
  }
}

// https://image.tmdb.org/t/p/w1280/


