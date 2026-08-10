import { Dialog } from '../ui/dialog'
import { useState } from 'react'
import { Field, FieldDescription, FieldLabel, FieldLegend, FieldSet } from '../ui/field'
import { PLATFORMS } from '@/global/globals'
import DatePicker from '../ui/date-picker'
import type { CalendarDate } from '@internationalized/date'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import { useAddMovie } from '@/api/apiFirebase'
import { Controller, useForm } from 'react-hook-form'
import type { MovieFormData } from '@/Types/types'
import { movieSchema } from '@/schemas/zotSchemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Input } from '../ui/input'
import { AspectRatio } from '../ui/aspect-ratio'
import imagePlaceholder from '@/assets/images/poster-placeholder.png'
import FieldErrorMessage from '../ui/field-error-message'

type Props = {
  date?: CalendarDate | null
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const AddMovieDialog = ({ date, isOpen, setIsOpen }: Props) => {
  const [selectedDate, setSelectedDate] = useState<CalendarDate | null>(date ?? null)

  const { addMovie } = useAddMovie()

  const {
    reset,
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



  // const handleTitleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const title = e.target.value
  //   const movieList = await fetchMovie(title)
  //   console.log('Fetched movie data:', movieList)
  //   if (movieList.length > 0) {
  //     const movieData = movieList[0]
  //     const partialPosterPath = movieData.poster_path
  //     const posterUrl = `https://image.tmdb.org/t/p/w1280/${partialPosterPath}`
  //     console.log('Poster URL:', posterUrl)
  //     setValue('poster', posterUrl)
  //   }
  // }

  return (
    <Dialog isOpen={isOpen} onOpenChange={handleOpenChange}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldSet>
          <FieldLegend>Add Movie</FieldLegend>
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
          <div className="flex gap-8">
            <Field data-invalid={!!errors.date?.message}>
              <FieldLabel htmlFor="date">Date</FieldLabel>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    selectedDate={selectedDate}
                    onDateChange={(date) => {
                      setSelectedDate(date)
                      field.onChange(date ? date.toString() : '')
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
                      {PLATFORMS.map((platform) => (
                        <SelectItem id={platform} key={platform} value={platform}>
                          {platform}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldErrorMessage fieldError={errors.platform} />
            </Field>
          </div>
          <Field >
            <FieldLabel htmlFor="poster">Poster</FieldLabel>
            <div className="flex">
              <Input type="text" placeholder="Poster (optional)" {...register('poster')} />{' '}
              <Button type="button" variant="secondary">
                Autodetect
              </Button>
            </div>
            <FieldDescription>Preview</FieldDescription>
            <AspectRatio ratio={2 / 3} className="max-w-2/4">
              <img
                src={watch('poster') || imagePlaceholder}
                alt="Poster preview"
                className="w-full"
              />
            </AspectRatio>
          </Field>
          <div className="flex justify-end gap-4">
            <Button type="button" variant="secondary" onPress={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="default">
              Submit
            </Button>
          </div>
        </FieldSet>
      </form>
    </Dialog >
  )
}

export default AddMovieDialog
