import { CalendarDate } from '@internationalized/date'
import { format } from 'date-fns'
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Popover, PopoverHeader, PopoverTrigger } from '@/components/ui/popover'
import { formatMovieDate, formatMovieDateLabel, parseMovieDate } from '@/utils/movieDate'

import { Calendar } from './calendar'

type Props = {
  value: string
  onChange: (date: string) => void
}

type Tab = 'day' | 'month' | 'year'

const seedTab = (value: string): Tab => {
  const precision = parseMovieDate(value)?.precision ?? 'none'
  return precision === 'none' ? 'day' : precision
}

const seedYear = (value: string): number => {
  const now = new Date()
  return parseMovieDate(value)?.year ?? now.getFullYear()
}

export default function DatePicker({ value, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [tab, setTab] = useState<Tab>(() => seedTab(value))
  const [viewYear, setViewYear] = useState<number>(() => seedYear(value))

  const parsed = useMemo(() => parseMovieDate(value), [value])

  const selectedDay = useMemo(
    () =>
      parsed?.precision === 'day'
        ? new CalendarDate(parsed.year, parsed.month!, parsed.day!)
        : null,
    [parsed],
  )

  const focusSeed = useMemo(() => {
    if (parsed?.precision === 'day') {
      return new CalendarDate(parsed.year, parsed.month!, parsed.day!)
    }
    if (parsed) {
      return new CalendarDate(parsed.year, parsed.month ?? 1, 1)
    }
    const now = new Date()
    return new CalendarDate(now.getFullYear(), now.getMonth() + 1, now.getDate())
  }, [parsed])

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setTab(seedTab(value))
      setViewYear(seedYear(value))
    }
    setIsOpen(open)
  }

  const commit = (next: string) => {
    onChange(next)
    setIsOpen(false)
  }

  const handleDayClick = (date: CalendarDate | null) => {
    if (!date) return
    commit(formatMovieDate(date.year, date.month, date.day))
  }

  return (
    <PopoverTrigger isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Button
        variant={'outline'}
        data-empty={!parsed}
        className="w-[212px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
      >
        {formatMovieDateLabel(value)}
        <ChevronDownIcon data-icon="inline-end" />
      </Button>
      <Popover className="w-auto p-0" placement="bottom start">
        <PopoverHeader className="grid grid-cols-3">
          <Button variant={tab === 'day' ? 'default' : 'ghost'} onPress={() => setTab('day')}>
            Day
          </Button>
          <Button variant={tab === 'month' ? 'default' : 'ghost'} onPress={() => setTab('month')}>
            Month
          </Button>
          <Button variant={tab === 'year' ? 'default' : 'ghost'} onPress={() => setTab('year')}>
            Year
          </Button>
          <Button
            variant={!parsed ? 'default' : 'ghost'}
            className="col-span-3"
            onPress={() => commit('')}
          >
            Coming soon
          </Button>
        </PopoverHeader>
        {tab === 'year' ? (
          <YearGrid
            selectedYear={parsed?.year ?? null}
            onPick={year => commit(formatMovieDate(year))}
          />
        ) : tab === 'month' ? (
          <MonthGrid
            year={viewYear}
            onYearChange={setViewYear}
            selectedMonth={parsed?.year === viewYear ? (parsed.month ?? null) : null}
            onPick={month => commit(formatMovieDate(viewYear, month))}
          />
        ) : (
          <Calendar
            captionLayout="dropdown"
            value={selectedDay}
            defaultFocusedValue={focusSeed}
            onChange={handleDayClick}
            className={'w-full'}
          />
        )}
      </Popover>
    </PopoverTrigger>
  )
}

function MonthGrid({
  year,
  onYearChange,
  selectedMonth,
  onPick,
}: {
  year: number
  onYearChange: (year: number) => void
  selectedMonth: number | null
  onPick: (month: number) => void
}) {
  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), [])

  return (
    <div className="flex flex-col gap-1 p-3 pt-0">
      <div className="flex items-center justify-between">
        <Button
          size="icon-xs"
          variant="ghost"
          onPress={() => onYearChange(year - 1)}
          aria-label="Previous year"
        >
          <ChevronLeftIcon />
        </Button>
        <span className="text-sm font-semibold">{year}</span>
        <Button
          size="icon-xs"
          variant="ghost"
          onPress={() => onYearChange(year + 1)}
          aria-label="Next year"
        >
          <ChevronRightIcon />
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {months.map(month => (
          <Button
            key={month}
            size="sm"
            variant={month === selectedMonth ? 'default' : 'ghost'}
            onPress={() => onPick(month)}
          >
            {format(new Date(year, month - 1, 1), 'MMM')}
          </Button>
        ))}
      </div>
    </div>
  )
}

function YearGrid({
  selectedYear,
  onPick,
}: {
  selectedYear: number | null
  onPick: (year: number) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const currentYear = new Date().getFullYear()
  const years = useMemo(() => {
    const list: number[] = []
    for (let y = currentYear - 100; y <= currentYear + 20; y++) list.push(y)
    return list
  }, [currentYear])

  useEffect(() => {
    containerRef.current
      ?.querySelector('[data-selected="true"]')
      ?.scrollIntoView({ block: 'nearest' })
  }, [])

  return (
    <div
      ref={containerRef}
      data-lenis-prevent
      className="grid max-h-64 grid-cols-4 gap-1 overflow-y-auto p-3"
    >
      {years.map(year => (
        <Button
          key={year}
          size="sm"
          variant={year === selectedYear ? 'default' : 'ghost'}
          data-selected={year === selectedYear}
          onPress={() => onPick(year)}
        >
          {year}
        </Button>
      ))}
    </div>
  )
}