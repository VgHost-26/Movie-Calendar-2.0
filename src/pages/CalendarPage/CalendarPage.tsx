import CalendarCard from '@/components/calendar/CalendarCard'
import type { Movie } from '@/Types/types'

const MOCKED_MOVIES: Movie[] = [
  {
    date: '2026-07-26',
    title: 'Batman',
    platform: 'Netflix',
    poster: 'https://static.posters.cz/image/1300/133030.jpg',
  },
]

const CalendarPage = () => {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="grid grid-cols-7">
        <CalendarCard date={new Date()} movies={MOCKED_MOVIES} />
        <CalendarCard date={new Date()} movies={MOCKED_MOVIES} />
        <CalendarCard date={new Date()} movies={MOCKED_MOVIES} />
        <CalendarCard date={new Date()} movies={MOCKED_MOVIES} />
        <CalendarCard date={new Date()} movies={MOCKED_MOVIES} />
        <CalendarCard date={new Date()} movies={MOCKED_MOVIES} />
        <CalendarCard date={new Date()} movies={MOCKED_MOVIES} />
        <CalendarCard date={new Date()} movies={MOCKED_MOVIES} />
        <CalendarCard date={new Date()} movies={MOCKED_MOVIES} />
        <CalendarCard date={new Date()} movies={MOCKED_MOVIES} />
      </div>
    </div>
  )
}

export default CalendarPage
