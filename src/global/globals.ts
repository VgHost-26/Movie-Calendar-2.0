import netflix from '../assets/icons/platforms/netflix.svg'
import disney from '../assets/icons/platforms/disney-plus.svg'
import amazon from '../assets/icons/platforms/amazon-prime-video.svg'
import hulu from '../assets/icons/platforms/hulu.svg'
import apple from '../assets/icons/platforms/apple-tv-light.svg'
import hbo from '../assets/icons/platforms/hbo-max-light.svg'
import youtube from '../assets/icons/platforms/youtube.svg'
import peacock from '../assets/icons/platforms/peacock-light.svg'
import paramount from '../assets/icons/platforms/paramount-plus.svg'
import cinema from '../assets/icons/platforms/popcorn.svg'

export const PLATFORMS = [
  'Netflix',
  'HBO Max',
  'Disney+',
  'Amazon Prime Video',
  'Apple TV+',
  'Hulu',
  'Peacock',
  'Paramount+',
  'YouTube',
  'Cinema',
] as const

export const PLATFORMS_ICONS = {
  Netflix: netflix,
  'HBO Max': hbo,
  'Disney+': disney,
  'Amazon Prime Video': amazon,
  'Apple TV+': apple,
  Hulu: hulu,
  Peacock: peacock,
  'Paramount+': paramount,
  YouTube: youtube,
  Cinema: cinema,
} as const

export const WEEKDAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const

export const WEEKDAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const

export const MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const
