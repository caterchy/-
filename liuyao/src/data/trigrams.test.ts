import { describe, it, expect } from 'vitest'
import { REMAINDER_TO_TRIGRAM, getHourShiChenIndex } from './trigrams'

describe('REMAINDER_TO_TRIGRAM', () => {
  it('maps indices 0-7 correctly', () => {
    expect(REMAINDER_TO_TRIGRAM[0]).toBe('坤')
    expect(REMAINDER_TO_TRIGRAM[1]).toBe('乾')
    expect(REMAINDER_TO_TRIGRAM[2]).toBe('兑')
    expect(REMAINDER_TO_TRIGRAM[3]).toBe('离')
    expect(REMAINDER_TO_TRIGRAM[4]).toBe('震')
    expect(REMAINDER_TO_TRIGRAM[5]).toBe('巽')
    expect(REMAINDER_TO_TRIGRAM[6]).toBe('坎')
    expect(REMAINDER_TO_TRIGRAM[7]).toBe('艮')
  })

  it('returns undefined for out-of-range index', () => {
    expect(REMAINDER_TO_TRIGRAM[8]).toBeUndefined()
    expect(REMAINDER_TO_TRIGRAM[-1]).toBeUndefined()
  })

  it('has exactly 8 entries', () => {
    expect(REMAINDER_TO_TRIGRAM).toHaveLength(8)
  })
})

describe('getHourShiChenIndex', () => {
  it('maps 子时 (23:00-00:59) to index 0', () => {
    expect(getHourShiChenIndex(23)).toBe(0)
    expect(getHourShiChenIndex(0)).toBe(0)
  })

  it('maps 丑时 (01:00-02:59) to index 1', () => {
    expect(getHourShiChenIndex(1)).toBe(1)
    expect(getHourShiChenIndex(2)).toBe(1)
  })

  it('maps 寅时 (03:00-04:59) to index 2', () => {
    expect(getHourShiChenIndex(3)).toBe(2)
    expect(getHourShiChenIndex(4)).toBe(2)
  })

  it('maps 卯时 (05:00-06:59) to index 3', () => {
    expect(getHourShiChenIndex(5)).toBe(3)
    expect(getHourShiChenIndex(6)).toBe(3)
  })

  it('maps 辰时 (07:00-08:59) to index 4', () => {
    expect(getHourShiChenIndex(7)).toBe(4)
    expect(getHourShiChenIndex(8)).toBe(4)
  })

  it('maps 巳时 (09:00-10:59) to index 5', () => {
    expect(getHourShiChenIndex(9)).toBe(5)
    expect(getHourShiChenIndex(10)).toBe(5)
  })

  it('maps 午时 (11:00-12:59) to index 6', () => {
    expect(getHourShiChenIndex(11)).toBe(6)
    expect(getHourShiChenIndex(12)).toBe(6)
  })

  it('maps 未时 (13:00-14:59) to index 7', () => {
    expect(getHourShiChenIndex(13)).toBe(7)
    expect(getHourShiChenIndex(14)).toBe(7)
  })

  it('maps 申时 (15:00-16:59) to index 8', () => {
    expect(getHourShiChenIndex(15)).toBe(8)
    expect(getHourShiChenIndex(16)).toBe(8)
  })

  it('maps 酉时 (17:00-18:59) to index 9', () => {
    expect(getHourShiChenIndex(17)).toBe(9)
    expect(getHourShiChenIndex(18)).toBe(9)
  })

  it('maps 戌时 (19:00-20:59) to index 10', () => {
    expect(getHourShiChenIndex(19)).toBe(10)
    expect(getHourShiChenIndex(20)).toBe(10)
  })

  it('maps 亥时 (21:00-22:59) to index 11', () => {
    expect(getHourShiChenIndex(21)).toBe(11)
    expect(getHourShiChenIndex(22)).toBe(11)
  })

  it('returns 0 for unknown hour', () => {
    expect(getHourShiChenIndex(24)).toBe(0)
  })
})
