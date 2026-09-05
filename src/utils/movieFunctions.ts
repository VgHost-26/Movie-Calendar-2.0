import { differenceInDays } from 'date-fns'

import { parseMovieDate } from './movieDate'

/**
 * Day precision compares that day; coarser precisions only count as released
 * once the whole period has passed (end of month / end of year), since an
 * unknown day within the period may still lie ahead.
 */
export function isReleased(movieDate: string) {
  const parsed = parseMovieDate(movieDate)
  if (!parsed) return false
  const now = new Date()
  switch (parsed.precision) {
    case 'day':
      return differenceInDays(new Date(parsed.year, parsed.month! - 1, parsed.day!), now) <= 0
    case 'month':
      return differenceInDays(new Date(parsed.year, parsed.month!, 0), now) <= 0
    case 'year':
      return differenceInDays(new Date(parsed.year, 11, 31), now) <= 0
    default:
      return false
  }
}
