import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  type DateArg,
} from 'date-fns'

import type { CalendarDay } from '@/Types/types'

export function getCalendarGrid(date: DateArg<Date>): CalendarDay[] {
  const monthStart = startOfMonth(date)
  const monthEnd = endOfMonth(date)

  const gridStartOffset = startOfWeek(monthStart, { weekStartsOn: 1 }) // 1 = Monday
  const gridEndOffset = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const days = eachDayOfInterval({ start: gridStartOffset, end: gridEndOffset })

  return days.map((day) => ({
    date: day,
    dayOfMonth: day.getDate(),
    isCurrentMonth: isSameMonth(day, monthStart),
    isToday: isToday(day),
    isWeekend: day.getDay() === 0 || day.getDay() === 6,
  }))
}
