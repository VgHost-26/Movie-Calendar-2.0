import type { Movie } from '@/Types/types'
import { Card, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { format } from 'date-fns'
import { Badge } from '../ui/badge'
import { AspectRatio } from '../ui/aspect-ratio'

type Props = {
  movies: Movie[]
  date: Date
}

const CalendarCard = ({ movies, date }: Props) => {
  return (
    <AspectRatio ratio={2 / 3} className="flex flex-1">
      <Card
        size="sm"
        className={`flex justify-between border border-muted bg-[url(https://static.posters.cz/image/1300/133030.jpg)] bg-contain bg-center bg-no-repeat p-0 hover:cursor-pointer hover:border-ring`}
      >
        <CardHeader className="flex flex-row-reverse bg-linear-to-b from-background px-3 py-1">
          <CardTitle className="color-muted text-2xl">{format(date, 'dd')}</CardTitle>
        </CardHeader>
        <CardFooter className="flex">
          {movies.map((movie) => (
            <div className="flex items-start justify-between">
              <p>{movie.title}</p>
              <Badge variant="secondary">
                {movie.platform}
                {/* <BadgeIcon data-icon="inline-end" /> */}
              </Badge>
            </div>
          ))}
        </CardFooter>
      </Card>
    </AspectRatio>
  )
}

export default CalendarCard
