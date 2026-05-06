import { describe, it, expect } from 'vitest'
import { yaosToCode } from '../engine/coin'
import { findHexagramByCode, getHexagramCode, ALL_HEXAGRAMS, parseHexagramCode } from './hexagrams'
import type { Yao, BaGua } from '../types'

describe('hexagram code direction fix', () => {
  it('getHexagramCode produces lower+upper format', () => {
    // 天地否 = 上乾下坤 → lower=坤(000) + upper=乾(111) = '000111'
    expect(getHexagramCode('乾', '坤')).toBe('000111')
    // 地天泰 = 上坤下乾 → lower=乾(111) + upper=坤(000) = '111000'
    expect(getHexagramCode('坤', '乾')).toBe('111000')
    // 水火既济 = 上坎下离 → lower=离(101) + upper=坎(010) = '101010'
    expect(getHexagramCode('坎', '离')).toBe('101010')
    // 火水未济 = 上离下坎 → lower=坎(010) + upper=离(101) = '010101'
    expect(getHexagramCode('离', '坎')).toBe('010101')
  })

  it('parseHexagramCode parses lower from first 3 bits', () => {
    // '000111' → lower=000=坤, upper=111=乾 (天地否)
    const result = parseHexagramCode('000111')
    expect(result.lower).toBe('坤')
    expect(result.upper).toBe('乾')
  })

  it('天地否: yaosToCode matches hexagram code', () => {
    const yaos: Yao[] = [
      { yang: false, changing: false, type: '少阴' },
      { yang: false, changing: false, type: '少阴' },
      { yang: false, changing: false, type: '少阴' },
      { yang: true, changing: false, type: '少阳' },
      { yang: true, changing: false, type: '少阳' },
      { yang: true, changing: false, type: '少阳' },
    ]
    const code = yaosToCode(yaos)
    expect(code).toBe('000111')
    const found = findHexagramByCode(code)
    expect(found).toBeDefined()
    expect(found!.name).toBe('天地否')
  })

  it('水火既济: yaosToCode matches hexagram code', () => {
    // 既济: 下离(101) + 上坎(010) → yaos = 1,0,1,0,1,0 → '101010'
    const yaos: Yao[] = [
      { yang: true, changing: false, type: '少阳' },
      { yang: false, changing: false, type: '少阴' },
      { yang: true, changing: false, type: '少阳' },
      { yang: false, changing: false, type: '少阴' },
      { yang: true, changing: false, type: '少阳' },
      { yang: false, changing: false, type: '少阴' },
    ]
    const code = yaosToCode(yaos)
    expect(code).toBe('101010')
    const found = findHexagramByCode(code)
    expect(found).toBeDefined()
    expect(found!.name).toBe('水火既济')
  })

  it('all 64 codes are consistent with getHexagramCode', () => {
    for (const h of ALL_HEXAGRAMS) {
      expect(h.code).toBe(getHexagramCode(h.upper, h.lower))
    }
  })

  it('all 64 codes are unique', () => {
    const codes = ALL_HEXAGRAMS.map(h => h.code)
    expect(new Set(codes).size).toBe(64)
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
})
