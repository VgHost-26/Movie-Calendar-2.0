import { ReactLenis } from 'lenis/react'
import { ArchiveIcon, ClapperboardIcon } from 'lucide-react'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { useGetMovies } from '@/api/apiFirebase'
import ProfileIcon from '@/components/ProfileIcon/ProfileIcon'
import { TimelineContextProvider } from '@/components/providers/TimelineContext'
import TimelineContent from '@/components/timeline/TimelineContent'
import { Button } from '@/components/ui/button'
import useAuth from '@/hooks/useAuth'
import { useIsMobile } from '@/hooks/useMobile'
import { useTimeline } from '@/hooks/useTimeline'
import { isReleased } from '@/utils/movieFunctions'
import TextTransition from '@/components/ui/TextTransition'

const ArchivePage = () => (
  <TimelineContextProvider>
    <ArchivePageContent />
  </TimelineContextProvider>
)

const ArchivePageContent = () => {
  const { registerLenisRef } = useTimeline()
  const { user } = useAuth()
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  const userId = user?.uid ?? ''

  const { data, isLoading, isPending } = useGetMovies(userId)

  const movies = useMemo(() => {
    if (!data) {
      return []
    }
    return data
      .filter(m => m.watched)
      .sort((a, b) =>
        a.date === ''
          ? 1
          : b.date === ''
            ? -1
            : new Date(a.date).getTime() - new Date(b.date).getTime(),
      )
  }, [data])

  const firstUnreleasedMovieIndex = useMemo(
    () => movies.findIndex(m => !isReleased(m.date)),
    [movies],
  )

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
        <ReactLenis
          className="timeline-lenis flex-1 overflow-hidden"
          options={{
            orientation: isMobile ? 'vertical' : 'horizontal',
            gestureOrientation: 'both',
            smoothWheel: true,
            syncTouch: true,
            touchMultiplier: 1,
            lerp: 0.1,
          }}
          ref={registerLenisRef}
        >
          <TimelineContent
            movies={movies}
            isPending={isPending}
            isLoading={isLoading}
            firstUnreleasedMovieIndex={firstUnreleasedMovieIndex}
          />
        </ReactLenis>
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
