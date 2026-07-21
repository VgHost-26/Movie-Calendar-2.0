import CalendarCard from '@/components/calendar/CalendarCard'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { WEEKDAYS } from '@/global/globals'
import type { Movie } from '@/Types/types'
import { getCalendarGrid } from '@/utils/dateDunctions'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

const MOCKED_MOVIES: Movie[] = [
  {
    date: '2026-07-26',
    title: 'Batman',
    platform: 'Netflix',
    poster: 'https://static.posters.cz/image/1300/133030.jpg',
  },
]

const CalendarPage = () => {
  const monthDays = getCalendarGrid(new Date())
  const monthDaysWithMovies = monthDays.map((day) => {
    const moviesForDay = MOCKED_MOVIES.filter((movie) => {
      const movieDate = new Date(movie.date)
      return movieDate.toDateString() === day.date.toDateString()
    })

    return { ...day, movies: moviesForDay }
  })

  return (
    <div className="flex flex-1 flex-col items-start gap-4 p-4">
      <div className="flex w-full items-end justify-between">
        {/* check if different font will align on the bottom */}
        <div>
          <h5 className="text-5xl font-bold text-primary">2026</h5>
          <h1 className="text-9xl font-bold uppercase">Month name</h1>
        </div>
        <div>
          <Button variant="secondary">
            <ChevronLeftIcon />
          </Button>
          <Button variant="secondary">
            <ChevronRightIcon />
          </Button>
        </div>
      </div>
      <div className="grid h-full w-full grid-cols-7">
        {WEEKDAYS.map((day) => (
          <Card
            size="sm"
            key={day}
            className="flex max-h-min items-end justify-start border border-muted bg-background p-2"
          >
            <p className="text-lg font-semibold">{day}</p>
          </Card>
        ))}
        {monthDaysWithMovies.map((day) => (
          <CalendarCard key={day.date.toISOString()} date={day.date} movies={day.movies} />
        ))}
      </div>
    </div>
  )
}

export default CalendarPage
