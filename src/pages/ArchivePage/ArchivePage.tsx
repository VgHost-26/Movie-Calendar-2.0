import { ArchiveIcon, ClapperboardIcon } from 'lucide-react'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { useGetMovies } from '@/api/apiFirebase'
import ArchiveGrid from '@/components/archive/ArchiveGrid'
import ProfileIcon from '@/components/ProfileIcon/ProfileIcon'
import { Button } from '@/components/ui/button'
import TextTransition from '@/components/ui/TextTransition'
import useAuth from '@/hooks/useAuth'
import { toSortableTime } from '@/utils/movieDate'

const ArchivePage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const userId = user?.uid ?? ''

  const { data, isLoading, isPending } = useGetMovies(userId)

  const movies = useMemo(() => {
    if (!data) {
      return []
    }
    return data
      .filter(m => m.watched)
      .sort((a, b) => toSortableTime(a.date) - toSortableTime(b.date))
  }, [data])

  const isEmpty = !isLoading && !isPending && movies.length === 0

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <div className="flex items-end p-window pb-1">
        <h1 className="flex w-full items-end gap-6 text-8xl font-bold uppercase md:text-9xl">
          <TextTransition>Archive</TextTransition>
          <span className="pb-3 text-2xl font-medium text-muted-foreground normal-case">
            {movies.length > 0 &&
              `${movies.length} watched ${movies.length === 1 ? 'movie' : 'movies'}`}
          </span>
        </h1>
      </div>
      {isEmpty ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <ArchiveIcon className="size-12 text-muted-foreground" />
          <h2 className="text-2xl font-bold">No watched movies yet</h2>
          <p className="max-w-md text-muted-foreground">
            Mark a released movie as watched and it will move here, out of the timeline view.
          </p>
          <Button variant="default" onPress={() => navigate('/timeline')}>
            <ClapperboardIcon data-icon="inline-start" />
            Back to timeline
          </Button>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col">
          <ArchiveGrid movies={movies} isPending={isPending} isLoading={isLoading} />
        </div>
      )}
      <footer className="flex gap-6 p-window">
        <div className="hidden items-end text-muted-foreground md:flex">
          <p>Watched movies are hidden from the timeline. Unwatch a movie to move it back.</p>
        </div>
        <div className="flex items-center justify-center md:hidden">
          <ProfileIcon />
        </div>
      </footer>
    </div>
  )
}

export default ArchivePage
