import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import ReactLenis from 'lenis/react'
import { ChevronDownIcon } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import type { TMDBMovie, TMDBMulti } from '@/Types/tmdbTypes'
import type { MovieFormData } from '@/Types/types'

import { useAddMovie } from '@/api/apiFirebase'
import { getPosterUrl, useSearchMultiMutation } from '@/api/apiTMDB'
import imagePlaceholder from '@/assets/images/poster-placeholder.png'
import { PLATFORMS } from '@/global/globals'
import { movieSchema } from '@/schemas/zotSchemas'

import { AspectRatio } from '../ui/aspect-ratio'
import { Button } from '../ui/button'
import DatePicker from '../ui/date-picker'
import { Dialog } from '../ui/dialog'
import { Field, FieldDescription, FieldLabel, FieldLegend, FieldSet } from '../ui/field'
import FieldErrorMessage from '../ui/field-error-message'
import { Input } from '../ui/input'
import { Tooltip, TooltipTrigger } from '../ui/tooltip'
import PlatformPicker from '../utils/PlatformPicker'

type Props = {
  date?: string | null
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const AddMovieDialog = ({ date, isOpen, setIsOpen }: Props) => {
  const dateObj = new Date(date ? date.toString() : '')

  const [selectedDate, setSelectedDate] = useState(date ?? '')
  const [morePostersOpen, setMorePostersOpen] = useState(false)
  const [morePosters, setMorePosters] = useState<TMDBMulti[]>([])

  const { addMovie } = useAddMovie()
  const { mutateAsync: searchMulti } = useSearchMultiMutation()

  const {
    reset,
    setValue,
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
  } = useForm<MovieFormData>({
    resolver: zodResolver(movieSchema),
    defaultValues: {
      title: '',
      date: selectedDate ? selectedDate.toString() : '',
      platform: PLATFORMS[0],
    },
  })

  const onSubmit = async (data: MovieFormData) => {
    console.log('adding movie:', data)

    const movieData = {
      title: data.title,
      date: selectedDate ? selectedDate.toString() : '',
      platform: data.platform,
      poster: data.poster || '',
    }
    try {
      await addMovie(movieData)

      if (handleOpenChange) {
        handleOpenChange(false)
      }
      reset()
      toast.success('Movie added successfully!')
    } catch (err) {
      console.error('Error adding movie:', err)
      toast.error('Failed to add movie. Please try again.')
      return
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset()
    }
    setIsOpen(open)
  }

  const handleCancel = () => {
    reset()
    setIsOpen(false)
  }

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
          console.log('No results found for the movie:', title, 'year:', dateObj.getFullYear())
          return
        }
        const posterUrl = getPosterUrl(firstResult)
        console.log('Poster URL found:', posterUrl)
        setValue('poster', posterUrl)
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
  }

  return (
    <Dialog isOpen={isOpen} onOpenChange={handleOpenChange} className="min-w-fit">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldSet>
          <div>
            <FieldLegend>Add Movie</FieldLegend>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <FieldDescription>Poster Preview</FieldDescription>
                <AspectRatio ratio={2 / 3} className="w-full">
                  <img
                    src={watch('poster') || imagePlaceholder}
                    alt="Poster preview"
                    className="w-full"
                  />
                </AspectRatio>
              </div>
              <div className="flex flex-col gap-4">
                <Field data-invalid={!!errors.title?.message}>
                  <FieldLabel htmlFor="title">Title</FieldLabel>
                  <Input
                    {...register('title')}
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Movie title"
                    className="px-2 py-1"
                  />
                  <FieldErrorMessage fieldError={errors.title} />
                </Field>
                <div className="flex flex-row flex-wrap gap-4">
                  <Field data-invalid={!!errors.date?.message}>
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
                    <FieldErrorMessage fieldError={errors.date} />
                  </Field>
                  <Field data-invalid={!!errors.platform?.message}>
                    <FieldLabel htmlFor="platform">Platform</FieldLabel>
                    <Controller
                      name="platform"
                      control={control}
                      render={({ field }) => <PlatformPicker field={field} />}
                    />
                    <FieldErrorMessage fieldError={errors.platform} />
                  </Field>
                </div>
                <Field>
                  <FieldLabel htmlFor="poster">Poster URL</FieldLabel>
                  <div className="flex">
                    <Input type="text" placeholder="https://example.jpg" {...register('poster')} />{' '}
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
                <div className="flex justify-end gap-4">
                  <Button type="button" variant="secondary" onPress={handleCancel}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="default">
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </FieldSet>
      </form>
    </Dialog>
  )
}

export default AddMovieDialog
