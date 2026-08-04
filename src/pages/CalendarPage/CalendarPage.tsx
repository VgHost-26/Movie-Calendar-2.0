import { useGetMovies } from '@/api/apiFirebase'
import CalendarCard from '@/components/calendar/CalendarCard'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import TextTransition from '@/components/ui/TextTransition'
import { WEEKDAYS } from '@/global/globals'
import useAuth from '@/hooks/useAuth'
import type { Movie } from '@/Types/types'
import { getCalendarGrid } from '@/utils/dateFunctions'
import { addMonths, subMonths, format, isSameMonth } from 'date-fns'
import { ChevronLeftIcon, ChevronRightIcon, TimerResetIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

const currentDate = new Date()
const CalendarPage = () => {
  const [viewingDate, setViewingDate] = useState(currentDate)
  const [switchDirection, setSwitchDirection] = useState<'up' | 'down'>('up')

  const { user, loading } = useAuth()
  const userId = user?.uid ?? ''
  console.log('authLoading:', loading, 'userId:', userId)
  const { data: movies, isLoading, error, isFetching } = useGetMovies(userId)
  
  console.log('query state:', { isLoading, isFetching, dataLength: movies?.length });

  const monthDays = getCalendarGrid(viewingDate)
  const monthDaysWithMovies = useMemo(() => {
    return monthDays.map((day) => {
      let moviesForDay: Movie[] = []
      if (movies) {
        moviesForDay = movies.filter((movie) => {
          const movieDate = new Date(movie.date)
          return movieDate.toDateString() === day.date.toDateString()
        })
      }
      return { ...day, movies: moviesForDay }
    })
  }, [movies, monthDays])

  const handlePreviousMonth = () => {
    setViewingDate((prevDate) => subMonths(prevDate, 1))
  }

  const handleNextMonth = () => {
    setViewingDate((prevDate) => addMonths(prevDate, 1))
  }

  useEffect(() => {
    if (isLoading) {
      console.log('loading')
      return
    }
    if (error) {
      console.log('error:', error)
      return
    }
    if (movies) {
      console.log(movies)
    }
  }, [movies, error, isLoading])

  return (
    <div className="flex flex-1 flex-col items-start gap-4 p-4">
      <div className="flex w-full items-end justify-between">
        <div className="flex flex-1 flex-col">
          {/* <h5 className="text-5xl font-bold text-primary">
            <TextTransition speed={200} direction={switchDirection}>
              {format(viewingDate, 'yyyy')}
            </TextTransition>
          </h5> */}
          <h1 className="ml-[-0.05em] text-9xl font-bold uppercase">
            <TextTransition direction={switchDirection}>
              {format(viewingDate, 'MMMM')}
            </TextTransition>
          </h1>
        </div>
        <div>
          {isSameMonth(viewingDate, currentDate) ? null : (
            <Button variant="secondary" onPress={() => setViewingDate(currentDate)}>
              <TimerResetIcon />
            </Button>
          )}
          <Button
            variant="secondary"
            onMouseOver={() => setSwitchDirection('down')}
            onPress={handlePreviousMonth}
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            variant="secondary"
            onMouseOver={() => setSwitchDirection('up')}
            onPress={handleNextMonth}
          >
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
