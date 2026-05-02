import { describe, it, expect } from 'vitest'
import { parseHexagramCode, getHexagramCode, ALL_HEXAGRAMS, TRIGRAM_TO_BIN } from './hexagrams'
import type { BaGua } from '../types'

describe('parseHexagramCode', () => {
  it('parses 6-bit code into upper and lower trigrams', () => {
    // 乾为天: 111111 → upper=111=乾, lower=111=乾
    const result = parseHexagramCode('111111')
    expect(result.upper).toBe('乾')
    expect(result.lower).toBe('乾')
  })

  it('parses 地天泰: 000111', () => {
    // 000=坤, 111=乾
    const result = parseHexagramCode('000111')
    expect(result.upper).toBe('坤')
    expect(result.lower).toBe('乾')
  })

  it('parses 水火既济: 010101', () => {
    const result = parseHexagramCode('010101')
    expect(result.upper).toBe('坎')
    expect(result.lower).toBe('离')
  })
})

describe('getHexagramCode', () => {
  it('generates correct code for 乾为天', () => {
    expect(getHexagramCode('乾', '乾')).toBe('111111')
  })

  it('generates correct code for 天地否', () => {
    expect(getHexagramCode('乾', '坤')).toBe('111000')
  })

  it('generates correct code for 水火既济', () => {
    expect(getHexagramCode('坎', '离')).toBe('010101')
  })
})

describe('ALL_HEXAGRAMS data integrity', () => {
  it('has exactly 64 hexagrams', () => {
    expect(ALL_HEXAGRAMS).toHaveLength(64)
  })

  it('each hexagram has a non-empty name', () => {
    for (const h of ALL_HEXAGRAMS) {
      expect(h.name).toBeTruthy()
    }
  })

  it('each hexagram has a valid 6-char binary code', () => {
    for (const h of ALL_HEXAGRAMS) {
      expect(h.code).toMatch(/^[01]{6}$/)
    }
  })

  it('each hexagram code matches its upper/lower trigrams', () => {
    for (const h of ALL_HEXAGRAMS) {
      expect(getHexagramCode(h.upper, h.lower)).toBe(h.code)
    }
  })

  it('each hexagram parses back to correct upper/lower', () => {
    for (const h of ALL_HEXAGRAMS) {
      const parsed = parseHexagramCode(h.code)
      expect(parsed.upper).toBe(h.upper)
      expect(parsed.lower).toBe(h.lower)
    }
  })

  it('each hexagram has a valid palace', () => {
    const validPalaces: BaGua[] = ['乾', '兑', '离', '震', '巽', '坎', '艮', '坤']
    for (const h of ALL_HEXAGRAMS) {
      expect(validPalaces).toContain(h.palace)
    }
  })

  it('each hexagram has palacePos 0-7', () => {
    for (const h of ALL_HEXAGRAMS) {
      expect(h.palacePos).toBeGreaterThanOrEqual(0)
      expect(h.palacePos).toBeLessThanOrEqual(7)
    }
  })

  it('each hexagram has non-empty guaci and 6 yaoci', () => {
    for (const h of ALL_HEXAGRAMS) {
      expect(h.guaci).toBeTruthy()
      expect(h.yaoci).toHaveLength(6)
      for (const y of h.yaoci) {
        expect(y).toBeTruthy()
      }
    }
  })

  it('each hexagram has non-empty tuancizhuan, xiangzhuan, and 6 yaoxiang', () => {
    for (const h of ALL_HEXAGRAMS) {
      expect(h.tuancizhuan).toBeTruthy()
      expect(h.xiangzhuan).toBeTruthy()
      expect(h.yaoxiang).toHaveLength(6)
    }
  })

  it('all 64 codes are unique', () => {
    const codes = ALL_HEXAGRAMS.map((h) => h.code)
    expect(new Set(codes).size).toBe(64)
  })

  it('every trigram appears as upper and lower in some entries', () => {
    const trigrams: BaGua[] = ['乾', '兑', '离', '震', '巽', '坎', '艮', '坤']
    for (const t of trigrams) {
      expect(ALL_HEXAGRAMS.some((h) => h.upper === t)).toBe(true)
      expect(ALL_HEXAGRAMS.some((h) => h.lower === t)).toBe(true)
    }
  })

  it('TRIGRAM_TO_BIN has entries for all 8 trigrams', () => {
    const trigrams: BaGua[] = ['乾', '兑', '离', '震', '巽', '坎', '艮', '坤']
    for (const t of trigrams) {
      expect(TRIGRAM_TO_BIN[t]).toMatch(/^[01]{3}$/)
    }
  })
})
