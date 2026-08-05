import { Controller, useForm } from 'react-hook-form'
import { Field, FieldLabel, FieldLegend, FieldSet } from '../ui/field'
import DatePicker from '../ui/date-picker'
import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { PLATFORMS } from '@/global/globals'
import { Button } from '../ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { movieSchema } from '@/schemas/zotSchemas'
import type { Movie, MovieFormData } from '@/Types/types'
import { AnimatePresence, motion } from 'framer-motion'
import { XIcon } from 'lucide-react'
import { CalendarDate } from '@internationalized/date'

type Props = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  movieData: Movie
}
const TimelineMovieEditor = ({ isOpen, onOpenChange, movieData }: Props) => {
  const { title, platform, poster, date, trailerURL } = movieData

  const dateObj = new Date(date)
  const calendarDate = new CalendarDate(
    dateObj.getFullYear(),
    dateObj.getMonth() + 1,
    dateObj.getDate(),
  )
  const [selectedDate, setSelectedDate] = useState<CalendarDate | null>(calendarDate)

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<MovieFormData>({
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
    reset()
  }

  const onSubmit = async (data: MovieFormData) => {
    console.log('editing movie:', data)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ translateX: '-100%', marginRight: 'calc(var(--width-timeline-card) * -1)' }}

          animate={{ translateX: 0, marginRight: '0' }}

          exit={{ translateX: '-100%', marginRight: 'calc(var(--width-timeline-card) * -1)' }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}

          className={`z-10 w-timeline-card max-w-window-no-sidebar-icon-no-card-with-padding overflow-hidden bg-background`}
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-timeline-card flex-col gap-4 p-4"
          >
            <FieldSet>
              <FieldLegend className="flex items-center gap-2">
                <Button size="icon-xs" type="button" variant="secondary" onPress={handleCancel}>
                  <XIcon />
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
                <div className="flex gap-4">
                  <input
                    {...register('poster')}
                    type="url"
                    id="poster"
                    name="poster"
                    placeholder="https://example.com/poster"
                    className="grow px-2 py-1"
                  />
                  <Button type="button" variant="secondary">
                    Autodetect
                  </Button>
                </div>
              </Field>
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
                <Button type="button" variant="destructive">
                  Delete
                </Button>
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
