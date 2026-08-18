import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import ReactLenis from 'lenis/react'
import { ChevronDownIcon, ChevronLeftIcon } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import type { TMDBMovie, TMDBMulti } from '@/Types/tmdbTypes'
import type { Movie, MovieFormData } from '@/Types/types'

import { useDeleteMovie, useUpdateMovie } from '@/api/apiFirebase'
import { getPosterUrl, useSearchMultiMutation } from '@/api/apiTMDB'
import { PLATFORMS, PLATFORMS_ICONS } from '@/global/globals'
import { movieSchema } from '@/schemas/zotSchemas'
import { useTimelineStore } from '@/stores/timelineStore'

import { AspectRatio } from '../ui/aspect-ratio'
import { Button } from '../ui/button'
import DatePicker from '../ui/date-picker'
import { AlertDeleteButton } from '../ui/delete-button'
import { Field, FieldLabel, FieldLegend, FieldSet } from '../ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Tooltip, TooltipTrigger } from '../ui/tooltip'

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
  const [selectedDate, setSelectedDate] = useState(date)
  const clearFocusedCardId = useTimelineStore(state => state.clearFocusedCardId)

  const { deleteMovie } = useDeleteMovie()
  const { updateMovie } = useUpdateMovie()
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

  const handleDelete = () => {
    deleteMovie(movieData.id)
    onOpenChange(false)
    toast.success('Movie deleted successfully!')
  }

  // TODO: mut this to api or something
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
      toast.error('Failed to search for poster. Please try again.')
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
          initial={{ translateX: '-100%', marginRight: 'calc(var(--width-timeline-card) * -1)' }}

          animate={{ translateX: 0, marginRight: '0' }}

          exit={{ translateX: '-100%', marginRight: 'calc(var(--width-timeline-card) * -1)' }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}

          className={`scrollbar-hide z-10 h-full w-timeline-card max-w-window-no-sidebar-icon-no-card-with-padding overflow-y-auto bg-background`}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-4 p-4">
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
                      <DatePicker
                        selectedDate={selectedDate}
                        onDateChange={date => {
                          setSelectedDate(date)
                          field.onChange(date)
                        }}
                      />
                    )}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="platform">Platform</FieldLabel>
                  <Controller
                    name="platform"
                    control={control}
                    render={({ field }) => (
                      <Select
                        placeholder="Select platform"
                        id="platform"
                        value={field.value}
                        onChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PLATFORMS.map(platform => (
                            <SelectItem id={platform} key={platform} value={platform}>
                              <img
                                src={PLATFORMS_ICONS[platform]}
                                alt={`${platform} icon`}
                                className="mr-2 size-4"
                              />
                              {platform}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="poster">Poster</FieldLabel>
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
              <div className="flex justify-end gap-4">
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
