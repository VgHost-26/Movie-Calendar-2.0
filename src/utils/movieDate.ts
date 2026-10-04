import { format } from 'date-fns'

export type MovieDatePrecision = 'day' | 'month' | 'year' | 'none'

export interface ParsedMovieDate {
  year: number
  month: number | null  /** 1-12, null when unknown */
  day: number | null    /** 1-31, null when unknown */
  precision: MovieDatePrecision
}

const pad = (n: number) => String(n).padStart(2, '0')

const daysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate()

const parsePart = (raw: string | undefined): number | null => {
  if (raw === undefined) return null
  const t = raw.trim().toLowerCase()
  if (t === '' || t === '0' || t === '00' || t === 'xx') return null
  const n = Number(t)
  return Number.isInteger(n) ? n : null
}

/**
 * Tolerant parser for stored movie dates. Accepts the canonical form
 * ('' | YYYY-MM-DD | YYYY-MM-00 | YYYY-00-00, zero-padded) as well as legacy
 * rows ('xx' placeholders, non-padded parts). Returns null for '' and for
 * anything that isn't a plausible date.
 */
export function parseMovieDate(value: string | null | undefined): ParsedMovieDate | null {
  if (!value) return null
  const parts = value.trim().split('-')
  if (parts.length !== 3) return null

  const year = Number(parts[0]?.trim())
  if (!Number.isInteger(year) || year < 1000 || year > 9999) return null

  const month = parsePart(parts[1])
  const day = parsePart(parts[2])
  if (month !== null && (month < 1 || month > 12)) return null
  if (day !== null && month === null) return null
  if (day !== null && month !== null && (day < 1 || day > daysInMonth(year, month))) {
    return null
  }

  if (day !== null && month !== null) {
    return { year, month, day, precision: 'day' }
  }
  if (month !== null) {
    return { year, month, day: null, precision: 'month' }
  }
  return { year, month: null, day: null, precision: 'year' }
}

/** Canonical storage form: zero-padded, `00` for unknown parts. */
export function formatMovieDate(year: number, month?: number | null, day?: number | null): string {
  return `${year}-${pad(month ?? 0)}-${pad(day ?? 0)}`
}

/**
 * Concrete Date for date-fns formatting, sorting and countdowns.
 * Month/year precision resolves to the first of the period. Null for
 * undated or invalid values.
 */
export function toDisplayDate(value: string | null | undefined): Date | null {
  const parsed = parseMovieDate(value)
  if (!parsed) return null
  return new Date(parsed.year, (parsed.month ?? 1) - 1, parsed.day ?? 1)
}

/** Sort key for movie lists; undated entries sink to the end. */
export function toSortableTime(value: string | null | undefined): number {
  const date = toDisplayDate(value)
  return date ? date.getTime() : Number.POSITIVE_INFINITY
}

/** Human label honouring precision: full date, month + year, year, or Coming Soon. */
export function formatMovieDateLabel(value: string | null | undefined): string {
  const parsed = parseMovieDate(value)
  if (!parsed) return 'Coming Soon'
  switch (parsed.precision) {
    case 'day':
      return format(new Date(parsed.year, parsed.month! - 1, parsed.day!), 'dd MMMM yyyy')
    case 'month':
      return format(new Date(parsed.year, parsed.month! - 1, 1), 'MMMM yyyy')
    case 'year':
      return String(parsed.year)
    default:
      return 'Coming Soon'
  }
}

export function getReleaseYear(value: string | null | undefined): number | null {
  return parseMovieDate(value)?.year ?? null
}