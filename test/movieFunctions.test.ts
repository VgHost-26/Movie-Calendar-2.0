import { describe, expect, test } from 'vitest'
import { countToRelease, isReleased } from '../src/utils/movieFunctions'
import { addDays, format } from 'date-fns'

const formattedToday = format(new Date(), 'yyyy-MM-dd')
const formattedTommorow = format(addDays(new Date(), 1), 'yyyy-MM-dd')
const formattedYesterday = format(addDays(new Date(), -1), 'yyyy-MM-dd')

describe('isReleased', () => {
  test('Future', () => {
    expect(isReleased('2200-12-31')).toBe(false)
  })

  test('Past', () => {
    expect(isReleased('1999-01-01')).toBe(true)
  })

  test('Today', () => {
    expect(isReleased(format(new Date(), 'yyyy-MM-dd'))).toBe(true)
  })

  test('Unspecified (Comming Soon)', () => {
    expect(isReleased('')).toBe(false)
  })

  test('Partial dates (Future)', () => {
    expect(isReleased('2999-00-00')).toBe(false)
    expect(isReleased('2999-01-00')).toBe(false)
    expect(isReleased('2999-10-31')).toBe(false)
  })

  test('Partial dates (Past)', () => {
    expect(isReleased('1999-00-00')).toBe(true)
    expect(isReleased('1999-01-00')).toBe(true)
    expect(isReleased('1999-10-31')).toBe(true)
  })

  test('Invalid dates (Should fallback to future)', () => {
    expect(isReleased('invalid-date')).toBe(false)
    expect(isReleased('45-67-88')).toBe(false)
    expect(isReleased('456788')).toBe(false)
  })

  test('Tomorrow', () => {
    expect(isReleased(formattedTommorow)).toBe(false)
  })

  test('Yesterday', () => {
    expect(isReleased(formattedYesterday)).toBe(true)
  })
})

describe('countToRelease', () => {
  test('1-9 should have leading zero (01 - 09) and none beyound', () => {
    expect(countToRelease(formattedTommorow)).toBe('01')
    expect(countToRelease(format(addDays(formattedToday, 9), 'yyyy-MM-dd'))).toBe('09')
    expect(countToRelease(format(addDays(formattedToday, 10), 'yyyy-MM-dd'))).toBe('10')
    expect(countToRelease(format(addDays(formattedToday, 99), 'yyyy-MM-dd'))).toBe('99')
    expect(countToRelease(format(addDays(formattedToday, 100), 'yyyy-MM-dd'))).toBe('100')
    expect(countToRelease(format(addDays(formattedToday, 999), 'yyyy-MM-dd'))).toBe('999')
  })
  test('One day left should be 01', () => {
    expect(countToRelease(formattedTommorow)).toBe('01')
  })
  test('Released', () => {
    expect(countToRelease('1999-01-01')).toBe('Released')
    expect(countToRelease(formattedYesterday)).toBe('Released')
    expect(countToRelease(formattedToday)).toBe('Released')
  })
  test('Coming Soon', () => {
    expect(countToRelease('')).toBe('Coming Soon')
  })
})
