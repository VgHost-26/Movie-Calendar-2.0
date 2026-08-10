import type { CalendarDay, Movie } from '@/Types/types'
import { Card, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { format } from 'date-fns'
import { Badge } from '../ui/badge'
import { useState } from 'react'
import AddMovieDialog from './AddMovieDialog'
import { CalendarDate } from '@internationalized/date'

type Props = {
  movies: Movie[]
  calendarDate: CalendarDay
}

const CalendarCard = ({ movies, calendarDate }: Props) => {
  const { date, isCurrentMonth } = calendarDate
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleCardClick = () => {
    setIsDialogOpen(true)
  }

  return (
    <><Card
      size="sm"
      className={`transition-border flex h-full w-full justify-between border border-muted duration-200 bg-[url(${movies[0]?.poster})] bg-start bg-cover bg-no-repeat p-0 hover:cursor-pointer hover:border-ring`}
      onClick={handleCardClick}
    >
      <CardHeader className="flex flex-row-reverse px-3 py-1">
        <CardTitle
          className={`text-2xl ${isCurrentMonth ? 'text-muted-foreground' : 'text-muted'}`}
        >
          {format(date, 'dd')}
        </CardTitle>
      </CardHeader>
      <CardFooter className="grid">
        {movies.map((movie) => (
          <div id={movie.id} className="flex flex-1 items-end justify-between">
            <p className="text-xl font-bold">{movie.title}</p>
            <Badge variant="secondary">
              {movie.platform}
              {/* <BadgeIcon data-icon="inline-end" /> */}
            </Badge>
          </div>
        ))}
      </CardFooter>
    </Card>
      <AddMovieDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        date={new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate())} />
    </>
  )
}

export default CalendarCard
