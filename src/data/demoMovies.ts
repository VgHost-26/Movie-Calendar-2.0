import type { Movie } from '@/Types/types'

const poster = (path: string) => `https://image.tmdb.org/t/p/w500${path}`

/**
 * Seed movies for demo mode.
 *
 * A fresh copy is created on every `enterDemo()` / `resetDemo()` call, so
 * edits in one demo session never leak into the next one.
 */
export const getDemoSeedMovies = (): Movie[] => [
  {
    id: 'demo-dune-part-two',
    title: 'Dune: Part Two',
    date: '2024-03-01',
    platform: 'Cinema',
    poster: poster('/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg'),
    TMDBId: 693134,
  },
  {
    id: 'demo-toy-story-5',
    title: 'Toy Story 5',
    date: '2026-06-19',
    platform: 'Cinema',
    poster: poster('/1Yu8ILEVcUIVOPWJxGuPqgUdwD9.jpg'),
  },
  {
    id: 'demo-odyssey',
    title: 'The Odyssey',
    date: '2026-07-17',
    platform: 'Cinema',
    poster: poster('/sNCSVuHgteWjWJbtjsY3yahRAhZ.jpg'),
  },
  {
    id: 'demo-spider-man',
    title: 'Spider-Man: Brand New Day',
    date: '2026-07-31',
    platform: 'Cinema',
    poster: poster('/sp8BH41oNdYwIKQFswqluNYa3SM.jpg'),
  },
  {
    id: 'demo-dune-part-three',
    title: 'Dune: Part Three',
    date: '2026-12-18',
    platform: 'Cinema',
    poster: poster('/d43fvHQsIMa4kpyhKXw0haEJIvI.jpg'),
    TMDBId: 1170608,
  },
  {
    id: 'demo-avengers-doomsday',
    title: 'Avengers: Doomsday',
    date: '2026-12-18',
    platform: 'Cinema',
    poster: poster('/jzPwsojjFStf5lR5Nm07w2hH56G.jpg'),
  },
  {
    id: 'demo-batman-part-two',
    title: 'The Batman Part II',
    date: '2027-10-01',
    platform: 'Cinema',
    poster: poster('/r5fl4aMsmTjgc8DdDqQaM84roWp.jpg'),
  },
  {
    id: 'demo-backrooms',
    title: 'Backrooms',
    date: '2026-05-07',
    platform: 'Cinema',
    poster: poster('/3E9KVlHelP6E0MGVvhV9Hp7yXEi.jpg'),
  },
]
