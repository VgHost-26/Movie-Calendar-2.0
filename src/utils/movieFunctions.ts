import { differenceInDays } from 'date-fns'
const currentDate = new Date()
export function isReleased(movieDate: string) {
  return differenceInDays(new Date(movieDate), currentDate) <= 0
}
