import type { UserSettings } from '@/Types/types'

import amazon from '../assets/icons/platforms/amazon-prime-video.svg'
import apple from '../assets/icons/platforms/apple-tv-light.svg'
import disney from '../assets/icons/platforms/disney-plus.svg'
import hbo from '../assets/icons/platforms/hbo-max-light.svg'
import hulu from '../assets/icons/platforms/hulu.svg'
import netflix from '../assets/icons/platforms/netflix.svg'
import paramount from '../assets/icons/platforms/paramount-plus.svg'
import peacock from '../assets/icons/platforms/peacock-light.svg'
import player from '../assets/icons/platforms/player.svg'
import cinema from '../assets/icons/platforms/popcorn.svg'
import youtube from '../assets/icons/platforms/youtube.svg'

export const PLATFORMS = [
  'Netflix',
  'HBO Max',
  'Disney+',
  'Prime Video',
  'Apple TV+',
  'Hulu',
  'Peacock',
  'Paramount+',
  'YouTube',
  'Player',
  'Cinema',
] as const

export const PLATFORMS_ICONS = {
  Netflix: netflix,
  'HBO Max': hbo,
  'Disney+': disney,
  'Prime Video': amazon,
  'Apple TV+': apple,
  Hulu: hulu,
  Peacock: peacock,
  'Paramount+': paramount,
  YouTube: youtube,
  // TODO: Optimise player icon
  Player: player,
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

export const LANGUAGES = [
  { id: 'en-US', name: 'English', flag: '' },
  { id: 'pl-PL', name: 'Polish', flag: '' },
]
export const POSTER_LANGUAGES = [
  { id: 'original', name: 'Original', flag: '' },
  { id: 'xx-XX', name: 'None', flag: '' },
  ...LANGUAGES
]
export const DEFAULT_SETTINGS: UserSettings = {
  languageId: 'en-US',
  platforms: [...PLATFORMS],
  preferedPosterLanguage: 'en-US',
  isPremiumUser: false
}

