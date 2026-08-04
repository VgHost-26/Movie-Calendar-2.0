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
import { fetchMovie } from '@/api/apiTMDB'
import imagePlaceholder from '@/assets/images/poster-placeholder.png'

type Props = {
  date: CalendarDate | null
  handleOpenChange?: (open: boolean) => void
}

const AddMovieDialog = ({ date, handleOpenChange }: Props) => {
  const [selectedDate, setSelectedDate] = useState<CalendarDate | null>(date)

  const { addMovie, isLoading, error } = useAddMovie()

  const {
    reset,
    register,
    handleSubmit,
    watch,
    setValue,
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

  const handleTitleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    const movieList = await fetchMovie(title)
    console.log('Fetched movie data:', movieList)
    if (movieList.length > 0) {
      const movieData = movieList[0]
      const partialPosterPath = movieData.poster_path
      const posterUrl = `https://image.tmdb.org/t/p/w1280/${partialPosterPath}`
      console.log('Poster URL:', posterUrl)
      setValue('poster', posterUrl)
    }
  }

  return (
    <Dialog>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldSet>
          <FieldLegend>Add Movie</FieldLegend>
          <Field>
            <FieldLabel htmlFor="title">Title</FieldLabel>
            <input
              {...register('title')}
              onBlur={handleTitleChange}
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
                    onDateChange={(date) => {
                      setSelectedDate(date)
                      field.onChange(date ? date.toString() : '')
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
                      {PLATFORMS.map((platform) => (
                        // TODO: add icons
                        <SelectItem id={platform} key={platform} value={platform}>
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
            <Input type="text" placeholder="Poster (optional)" {...register('poster')} />
            <FieldDescription>Preview</FieldDescription>
            <AspectRatio ratio={2 / 3} className="">
              <img
                src={
                  watch('poster') ||
                  imagePlaceholder
                }
                alt="Poster preview"
                className="w-full"
              />
            </AspectRatio>
          </Field>
          <div className="flex justify-end gap-4">
            <Button type="button" variant="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="default">
              Submit
            </Button>
          </div>
        </FieldSet>
      </form>
    </Dialog>
  )
}

export default AddMovieDialog
