import { differenceInDays, format } from 'date-fns'
const currentDate = format(new Date(), 'yyyy-MM-dd')

// Consider maybe to the last day of
function partialToFirstDayOf(movieDate: string): string {
  return movieDate.replace(/-00/g, '-01')
}

export function isReleased(movieDate: string): boolean {
  if (!movieDate || movieDate === '') return false
  return differenceInDays(partialToFirstDayOf(movieDate), currentDate) <= 0
}
