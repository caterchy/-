import { describe, it, expect } from 'vitest'
import { getSolarTermDates, getJieQi, getCurrentSolarTerm, getDaysSinceSolarTerm, SOLAR_TERM_NAMES } from './jieqi'

describe('SOLAR_TERM_NAMES', () => {
  it('has 24 entries starting from 立春', () => {
    expect(SOLAR_TERM_NAMES).toHaveLength(24)
    expect(SOLAR_TERM_NAMES[0]).toBe('立春')
    expect(SOLAR_TERM_NAMES[23]).toBe('大寒')
  })
})

describe('getSolarTermDates', () => {
  it('returns solar terms for 2024', () => {
    const terms = getSolarTermDates(2024)
    expect(terms.length).toBeGreaterThan(0)

    const lichun = terms.find((t) => t.name === '立春')
    expect(lichun).toBeDefined()
    expect(lichun!.month).toBe(2)
    expect(lichun!.day).toBeGreaterThanOrEqual(3)
    expect(lichun!.day).toBeLessThanOrEqual(5)
  })

  it('returns terms sorted by date', () => {
    const terms = getSolarTermDates(2024)
    for (let i = 1; i < terms.length; i++) {
      const prev = terms[i - 1]
      const curr = terms[i]
      const prevMinutes = prev.month * 31 * 1440 + prev.day * 1440 + prev.hour * 60 + prev.minute
      const currMinutes = curr.month * 31 * 1440 + curr.day * 1440 + curr.hour * 60 + curr.minute
      expect(currMinutes).toBeGreaterThanOrEqual(prevMinutes)
    }
  })
})

describe('getJieQi', () => {
  it('returns correct jieqi string', () => {
    // Feb 10 is after 立春 (around Feb 4)
    const date = new Date(2024, 1, 10, 12, 0, 0)
    const result = getJieQi(date)
    expect(result).toBe('立春后')
  })

  it('returns correct string before first term of year', () => {
    // Jan 1 is before 小寒
    const date = new Date(2024, 0, 1, 12, 0, 0)
    const result = getJieQi(date)
    // Should start with some term name
    expect(result.length).toBeGreaterThan(0)
  })
})

describe('getCurrentSolarTerm', () => {
  it('returns current solar term for a known date', () => {
    // June 15 is after 芒种 (around June 5) and before 小暑 (around July 7)
    const date = new Date(2024, 5, 15, 12, 0, 0)
    const result = getCurrentSolarTerm(date)
    expect(result).not.toBeNull()
    // Could be 芒种 or 夏至 depending on exact dates
    expect(['芒种', '夏至']).toContain(result!.name)
  })
})

describe('getDaysSinceSolarTerm', () => {
  it('returns non-negative days', () => {
    const date = new Date(2024, 5, 15, 12, 0, 0)
    const days = getDaysSinceSolarTerm(date)
    expect(days).toBeGreaterThanOrEqual(0)
  })
})
