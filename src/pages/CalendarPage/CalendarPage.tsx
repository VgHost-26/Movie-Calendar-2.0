import CalendarCard from '@/components/calendar/CalendarCard'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { WEEKDAYS } from '@/global/globals'
import type { Movie } from '@/Types/types'
import { getCalendarGrid } from '@/utils/dateDunctions'
import { addMonths, subMonths, format, isSameMonth } from 'date-fns'
import { ChevronLeftIcon, ChevronRightIcon, TimerResetIcon } from 'lucide-react'
import { useState } from 'react'

const MOCKED_MOVIES: Movie[] = [
  {
    date: '2026-07-26',
    title: 'Batman',
    platform: 'Netflix',
    poster: 'https://static.posters.cz/image/1300/133030.jpg',
  },
]

const currentDate = new Date()
const CalendarPage = () => {
  const [viewingDate, setViewingDate] = useState(currentDate)

  const monthDays = getCalendarGrid(viewingDate)
  const monthDaysWithMovies = monthDays.map((day) => {
    const moviesForDay = MOCKED_MOVIES.filter((movie) => {
      const movieDate = new Date(movie.date)
      return movieDate.toDateString() === day.date.toDateString()
    })

    return { ...day, movies: moviesForDay }
  })

  const handlePreviousMonth = () => {
    setViewingDate((prevDate) => subMonths(prevDate, 1))
  }

  const handleNextMonth = () => {
    setViewingDate((prevDate) => addMonths(prevDate, 1))
  }

  return (
    <div className="flex flex-1 flex-col items-start gap-4 p-4">
      <div className="flex w-full items-end justify-between">
        {/* check if different font will align on the bottom */}
        <div>
          <h5 className="text-5xl font-bold text-primary">{format(viewingDate, 'yyyy')}</h5>
          <h1 className="ml-[-0.05em] text-9xl font-bold uppercase">
            {format(viewingDate, 'MMMM')}
          </h1>
        </div>
        <div>
          {/* not working */}
          {isSameMonth(viewingDate, currentDate) ? null : (
            <Button variant="secondary" onClick={() => setViewingDate(currentDate)}>
              <TimerResetIcon />
            </Button>
          )}
          <Button variant="secondary" onClick={handlePreviousMonth}>
            <ChevronLeftIcon />
          </Button>
          <Button variant="secondary" onClick={handleNextMonth}>
            <ChevronRightIcon />
          </Button>
        </div>
      </div>
      <div className="grid h-full w-full grid-cols-7 grid-rows-[min-content]">
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
          <CalendarCard key={day.date.toISOString()} calendarDate={day} movies={day.movies} />
        ))}
      </div>
    </div>
  )
}

export default CalendarPage
