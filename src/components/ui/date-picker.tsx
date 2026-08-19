import { CalendarDate, getLocalTimeZone } from '@internationalized/date'
import { ChevronDownIcon } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Popover, PopoverHeader, PopoverTrigger } from '@/components/ui/popover'

import { Calendar } from './calendar'
import { format } from 'date-fns'

type Props = {
  selectedDate: string
  onDateChange: (date: string) => void
}
type Mode = 'day' | 'month' | 'year' | 'undefined'

const calendarDateToString = (date: CalendarDate | null, mode: Mode) => {
  if (!date) return ''

  switch (mode) {
    case 'day':
      return `${date.year}-${date.month}-${date.day}`
    case 'month':
      return `${date.year}-${date.month}-00`
    case 'year':
      return `${date.year}-00-00`
    default:
      return ''
  }
}

const displayDate = (date: CalendarDate | null, mode: Mode) => {
  if (!date) return <span>Coming Soon</span>
  const dateObj = date.toDate(getLocalTimeZone())
  switch (mode) {
    case 'day':
      return format(dateObj, 'dd MMMMyyyy')
    case 'month':
      return format(dateObj, 'MMMM yyyy')
    case 'year':
      return `${date.year}`
    default:
      return ''
  }
}

const modeFromDate = (date: string): Mode => {
  if (!date) return 'undefined'
  const [year, month, day] = date.split('-')
  if (month === 'xx') return 'year'
  if (day === 'xx') return 'month'
  return 'day'
}

export default function DatePicker({ selectedDate, onDateChange }: Props) {
  const date = selectedDate ? new CalendarDate(...(selectedDate.split('-').map(Number) as [number, number, number])) : null
  const initialMode = modeFromDate(selectedDate)

  const [activeMode, setActiveMode] = useState(initialMode)
  const [selectedDateState, setSelectedDateState] = useState<CalendarDate | null>(date)
  const [isOpen, setIsOpen] = useState(false)

  const handleComingSoonButton = () => {
    setSelectedDateState(null)
    onDateChange('')
    setActiveMode('undefined')
    setIsOpen(false)
  }
  const handleDateChange = (date: CalendarDate | null) => {
    setSelectedDateState(date)
    onDateChange(calendarDateToString(date, activeMode))
    setIsOpen(false)
  }
  return (
    <PopoverTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button
        variant={'outline'}
        data-empty={!selectedDate}
        className="w-[212px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
      >
        {displayDate(selectedDateState, activeMode)}
        <ChevronDownIcon data-icon="inline-end" />
      </Button>
      <Popover className="w-auto p-0" placement="bottom start">
        <PopoverHeader className="grid grid-cols-3">
          <Button
            variant={activeMode === 'day' ? 'default' : 'ghost'}
            onPress={() => setActiveMode('day')}
          >
            Day
          </Button>
          <Button
            variant={activeMode === 'month' ? 'default' : 'ghost'}
            onPress={() => setActiveMode('month')}
          >
            Month
          </Button>
          <Button
            variant={activeMode === 'year' ? 'default' : 'ghost'}
            onPress={() => setActiveMode('year')}
          >
            Year
          </Button>
          <Button
            variant={activeMode === 'undefined' ? 'default' : 'ghost'}
            className="col-span-3"
            onPress={handleComingSoonButton}
          >
            Comign soon
          </Button>
        </PopoverHeader>
        <Calendar
          captionLayout="dropdown"
          value={selectedDateState}
          onChange={handleDateChange}
          className={'w-full'}
        />
      </Popover>
    </PopoverTrigger>
  )
}
