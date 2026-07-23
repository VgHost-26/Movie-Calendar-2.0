import { Dialog } from '../ui/dialog'
import { useState, type SubmitEvent } from 'react'
import { Field, FieldLabel, FieldLegend, FieldSet } from '../ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { PLATFORMS } from '@/global/globals'
import DatePicker from '../ui/date-picker'
import type { CalendarDate } from '@internationalized/date'
import { Button } from '../ui/button'
import { toast } from 'sonner'

type Props = {
  date: CalendarDate | null
  handleOpenChange?: (open: boolean) => void
}

const AddMovieDialog = ({ date, handleOpenChange }: Props) => {
  const [selectedDate, setSelectedDate] = useState<CalendarDate | null>(date)
  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (handleOpenChange) {
      handleOpenChange(false)
    }
    toast.success('Movie added successfully!')
  }
  return (
    <Dialog>
      <form onSubmit={handleSubmit}>
        <FieldSet>
          <FieldLegend>Add Movie</FieldLegend>
          <Field>
            <FieldLabel htmlFor="title">Title</FieldLabel>
            <input
              type="text"
              id="title"
              name="title"
              required
              placeholder="Enter movie title"
              className="px-2 py-1"
            />
          </Field>
          <div className="flex gap-8">
            <Field>
              <FieldLabel htmlFor="date">Date</FieldLabel>
              <DatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />
            </Field>
            <Field>
              <FieldLabel htmlFor="platform">Platform</FieldLabel>
              <Select placeholder="Select platform" id="platform" name="platform">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map((platform) => (
                    // TODO: add icon
                    <SelectItem key={platform} value={platform}>
                      {platform}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
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
