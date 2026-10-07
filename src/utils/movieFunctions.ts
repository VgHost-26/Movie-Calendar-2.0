import { differenceInDays, differenceInHours, format, isDate } from 'date-fns'
const currentDate = format(new Date(), 'yyyy-MM-dd')

// Consider maybe to the last day of
function partialToFirstDayOf(movieDate: string): string {
  return movieDate.replace(/-00/g, '-01')
}

// Will it brake on DST summer time change?
export function isReleased(date: string): boolean {
  if (!date || date === '') return false
  const parsedDate = partialToFirstDayOf(date)
  return differenceInDays(parsedDate, currentDate) <= 0
  // const daysDiff = Math.trunc(differenceInHours(parsedDate, currentDate) / 24) | 0
  // return daysDiff <= 0
}

export function countToRelease(date: string): string {
  if (!date || date === '') return 'Coming Soon'
  const parsedDate = partialToFirstDayOf(date)
  const daysDiff = Math.trunc(differenceInHours(parsedDate, currentDate) / 24) | 0
  if (daysDiff <= 0) return 'Released'
  return daysDiff.toString().padStart(2, '0')
}
