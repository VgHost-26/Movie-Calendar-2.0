import type { Movie } from '@/Types/types'
import { Card, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { format } from 'date-fns'
import { Badge } from '../ui/badge'

type Props = {
  movies: Movie[]
  date: Date
}

const CalendarCard = ({ movies, date }: Props) => {
  return (
    // <AspectRatio ratio={1 / 1} className="flex">
    <Card
      size="sm"
      className={`flex h-full w-full justify-between border border-muted bg-[url(${movies[0]?.poster})] bg-start bg-cover bg-no-repeat p-0 hover:cursor-pointer hover:border-ring`}
    >
      <CardHeader className="flex flex-row-reverse px-3 py-1">
        <CardTitle className="text-2xl text-muted-foreground">{format(date, 'dd')}</CardTitle>
      </CardHeader>
      <CardFooter className="flex">
        {movies.map((movie) => (
          <div className="flex flex-1 items-end justify-between">
            <p className="text-xl font-bold">{movie.title}</p>
            <Badge variant="secondary">
              {movie.platform}
              {/* <BadgeIcon data-icon="inline-end" /> */}
            </Badge>
          </div>
        ))}
      </CardFooter>
    </Card>
    // </AspectRatio>
  )
}

export default CalendarCard
