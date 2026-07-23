import { getLocalTimeZone, type CalendarDate } from '@internationalized/date'
import { ChevronDownIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Popover, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from './calendar'

type Props = {
  selectedDate: CalendarDate | null
  onDateChange: (date: CalendarDate | null) => void
}

export default function DatePicker({ selectedDate, onDateChange }: Props) {
  return (
    <PopoverTrigger>
      <Button
        variant={'outline'}
        data-empty={!selectedDate}
        className="w-[212px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
      >
        {selectedDate ? (
          selectedDate
            .toDate(getLocalTimeZone())
            .toLocaleDateString(undefined, { dateStyle: 'long' })
        ) : (
          <span>Pick a date</span>
        )}
        <ChevronDownIcon data-icon="inline-end" />
      </Button>
      <Popover className="w-auto p-0" placement="bottom start">
        <Calendar value={selectedDate} onChange={onDateChange} />
      </Popover>
    </PopoverTrigger>
  )
}
