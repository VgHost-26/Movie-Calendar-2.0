import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import ReactLenis from 'lenis/react'
import { CheckIcon, ChevronDownIcon, ChevronLeftIcon, EyeOffIcon } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import type { TMDBMovie, TMDBMulti } from '@/Types/tmdbTypes'
import type { Movie, MovieFormData } from '@/Types/types'

import { useDeleteMovie, useUpdateMovie } from '@/api/apiMovies'
import { getPosterUrl, useSearchMultiMutation } from '@/api/apiTMDB'
import { useAnimatedCardExit } from '@/hooks/useAnimatedCardExit'
import { movieSchema } from '@/schemas/zotSchemas'
import { useTimelineStore } from '@/stores/timelineStore'
import { isReleased } from '@/utils/movieFunctions'

import { AspectRatio } from '../ui/aspect-ratio'
import { Button } from '../ui/button'
import DatePicker from '../ui/date-picker'
import { AlertDeleteButton } from '../ui/delete-button'
import { Field, FieldLabel, FieldLegend, FieldSet } from '../ui/field'
import { Tooltip, TooltipTrigger } from '../ui/tooltip'
import PlatformPicker from '../utils/PlatformPicker'

type Props = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  movieData: Movie
  setPosterPreview: (poster: string) => void
}
const TimelineMovieEditor = ({ isOpen, onOpenChange, movieData, setPosterPreview }: Props) => {
  const { title, platform, poster, date, trailerURL } = movieData

  const [morePostersOpen, setMorePostersOpen] = useState(false)
  const [morePosters, setMorePosters] = useState<TMDBMulti[]>([])
  const clearFocusedCardId = useTimelineStore(state => state.clearFocusedCardId)

  const cardWidth = useTimelineStore(state => state.cardWidth)

  const { deleteMovie } = useDeleteMovie()
  const { updateMovie, isLoading: isUpdating } = useUpdateMovie()
  const { leavingCardIds, removeWithExit } = useAnimatedCardExit()
  const isLeaving = leavingCardIds.includes(movieData.id)
  const { mutateAsync: searchMulti } = useSearchMultiMutation()
  const { reset, setValue, register, handleSubmit, control, watch } = useForm<MovieFormData>({
    resolver: zodResolver(movieSchema),
    defaultValues: {
      title,
      date,
      platform,
      poster,
      trailerURL,
    },
  })

  const handleCancel = () => {
    onOpenChange(false)
    setMorePostersOpen(false)
    setPosterPreview(movieData.poster || '')
    clearFocusedCardId()
    reset()
  }

  const onSubmit = async (data: MovieFormData) => {
    console.log('editing movie:', data)
    setPosterPreview(data.poster || '')
    updateMovie(movieData.id, data)
  }

  const handleDelete = async () => {
    try {
      await removeWithExit(movieData.id, () => deleteMovie(movieData.id))
      toast.success('Movie deleted successfully!')
    } catch {
      //TODO error toast is handled inside deleteMovie, card springs back into place
    }
  }

  const isWatched = !!movieData.watched
  const canToggleWatched = isWatched || isReleased(movieData.date)

  const handleToggleWatched = async () => {
    onOpenChange(false)
    clearFocusedCardId()
    try {
      await removeWithExit(movieData.id, () => updateMovie(movieData.id, { watched: !isWatched }))
      toast.success(!isWatched ? 'Marked as watched!' : 'Moved back to timeline!')
    } catch {
      // error toast is handled inside updateMovie
    }
  }

  // TODO: put this to api or something
  const handleSearchPoster = async () => {
    const title = watch('title').trim()

    try {
      const response = await searchMulti({ query: title })
      if (response && response.results.length > 0) {
        if (response.results.length > 1) {
          setMorePosters(response.results)
        }
        const firstResult = response.results[0]
        if (!firstResult) {
          toast.error('No results found for the movie: ' + title)
          return
        }
        const posterUrl = getPosterUrl(firstResult)
        console.log('Poster URL found:', posterUrl)
        setValue('poster', posterUrl)
        setPosterPreview(posterUrl)
        setValue('TMDBId', firstResult.id)
      }
    } catch (error) {
      console.error('Error searching for poster:', error)
      toast.error(
        error instanceof Error ? error.message : 'Failed to search for poster. Please try again.',
      )
    }
  }

  const handleShowMorePosters = () => {
    setMorePostersOpen(prev => !prev)
  }

  const handleSwitchPoster = (movie: TMDBMulti | TMDBMovie) => {
    const { poster_path, id } = movie
    const posterUrl = poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : ''
    setValue('TMDBId', id)
    setValue('poster', posterUrl)
    setPosterPreview(posterUrl)
    // setMorePostersOpen(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          // TODO: after fixing sidebar there is something wrong heere, or maybe something else broke it, anyway it works on FHD displays, fix required for 4k
          initial={{ translateX: '-100%', marginRight: `${cardWidth * -1}px` }}

          animate={{ translateX: 0, marginRight: '0' }}

          exit={{ translateX: '-100%', marginRight: `${cardWidth * -1}px` }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}

          className={`scrollbar-hide z-10 h-full w-[${cardWidth}px] max-w-window-no-sidebar-icon-no-card-with-padding overflow-y-auto bg-background`}
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-timeline-card max-w-window-no-sidebar-icon-no-card-with-padding shrink-0 flex-col gap-4 p-4"
          >
            <FieldSet>
              <FieldLegend className="flex items-center gap-2">
                <Button size="icon-xs" type="button" variant="secondary" onPress={handleCancel}>
                  <ChevronLeftIcon />
                </Button>
                Edit Movie
              </FieldLegend>
              <Field>
                <FieldLabel htmlFor="title">Title</FieldLabel>
                <input
                  {...register('title')}
                  type="text"
                  id="title"
                  name="title"
                  required
                  placeholder="Movie title"
                  className="px-2 py-1"
                />
              </Field>
              <div className="flex gap-8">
                <Field>
                  <FieldLabel htmlFor="date">Date</FieldLabel>
                  <Controller
                    name="date"
                    control={control}
                    render={({ field }) => (
                      <DatePicker value={field.value ?? ''} onChange={field.onChange} />
                    )}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="platform">Platform</FieldLabel>
                  <Controller
                    name="platform"
                    control={control}
                    render={({ field }) => <PlatformPicker field={field} />}
                  />
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="poster">Poster URL</FieldLabel>
                <div className="flex gap-4">
                  <input
                    {...register('poster')}
                    type="url"
                    id="poster"
                    name="poster"
                    placeholder="https://example.com/poster"
                    className="grow px-2 py-1"
                  />
                  <div className="flex">
                    <Button type="button" variant="secondary" onPress={handleSearchPoster}>
                      Autodetect
                    </Button>
                    {morePosters.length > 1 && (
                      <TooltipTrigger>
                        <Button
                          type="button"
                          variant="secondary"
                          size="icon"
                          onPress={handleShowMorePosters}
                        >
                          <ChevronDownIcon className={morePostersOpen ? 'rotate-180' : ''} />
                        </Button>
                        <Tooltip placement="top end">
                          <p>Show More Posters</p>
                        </Tooltip>
                      </TooltipTrigger>
                    )}
                  </div>
                </div>
              </Field>
              <AnimatePresence>
                {morePostersOpen && morePosters.length > 0 && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="max-w-[calc(var(--max-width-timeline-card)-2rem)] overflow-hidden"
                  >
                    <ReactLenis
                      data-lenis-prevent
                      options={{
                        orientation: 'horizontal',
                        gestureOrientation: 'vertical',
                        smoothWheel: true,
                      }}
                      className="overflow-hidden"
                    >
                      <div className="flex gap-2">
                        {morePosters.map(movie => {
                          const posterUrl = getPosterUrl(movie)
                          const tooltipTitle = `${movie.title} ${movie.release_date ? `(${movie.release_date.split('-')[0]})` : ''}`

                          if (!posterUrl) return
                          return (
                            <TooltipTrigger>
                              <AspectRatio
                                ratio={2 / 3}
                                className="w-[calc(var(--width-timeline-card)/6)] shrink-0 cursor-pointer"
                                key={movie.id}
                              >
                                <img
                                  src={posterUrl}
                                  alt={movie.title}
                                  className="w-full object-cover"
                                  onClick={() => handleSwitchPoster(movie)}
                                />
                              </AspectRatio>
                              <Tooltip>
                                <p>{tooltipTitle}</p>
                              </Tooltip>
                            </TooltipTrigger>
                          )
                        })}
                      </div>
                    </ReactLenis>
                  </motion.div>
                )}
              </AnimatePresence>
              <Field>
                <FieldLabel htmlFor="trailerURL">Trailer URL</FieldLabel>
                <input
                  {...register('trailerURL')}
                  type="url"
                  id="trailerURL"
                  name="trailerURL"
                  placeholder="https://example.com/trailer"
                  className="px-2 py-1"
                />
              </Field>
              <div className="flex flex-wrap justify-end gap-4">
                {canToggleWatched && (
                  <Button
                    type="button"
                    variant="secondary"
                    onPress={handleToggleWatched}
                    isDisabled={isUpdating || isLeaving}
                    className="mr-auto"
                  >
                    {isWatched ? (
                      <EyeOffIcon data-icon="inline-start" />
                    ) : (
                      <CheckIcon data-icon="inline-start" />
                    )}
                    {isWatched ? 'Unwatch' : 'Watched'}
                  </Button>
                )}
                <AlertDeleteButton
                  title="Delete Movie"
                  description="Are you sure you want to delete this movie?"
                  onConfirm={handleDelete}
                >
                  Delete
                </AlertDeleteButton>
                <Button type="button" variant="secondary" onPress={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit" variant="default">
                  Save
                </Button>
              </div>
            </FieldSet>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default TimelineMovieEditor
