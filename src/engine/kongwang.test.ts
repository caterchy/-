import { describe, it, expect } from 'vitest'
import { calcKongWang, isKong } from './kongwang'
import type { TianGan, DiZhi } from '../types'

describe('calcKongWang', () => {
  it.each([
    // [dayGan, dayZhi, expectedXun, expectedZhi1, expectedZhi2]
    ['甲', '子', '甲子', '戌', '亥'],
    ['乙', '丑', '甲子', '戌', '亥'],
    ['丙', '寅', '甲子', '戌', '亥'],
    ['丁', '卯', '甲子', '戌', '亥'],
    ['戊', '辰', '甲子', '戌', '亥'],
    ['己', '巳', '甲子', '戌', '亥'],
    ['庚', '午', '甲子', '戌', '亥'],
    ['辛', '未', '甲子', '戌', '亥'],
    ['壬', '申', '甲子', '戌', '亥'],
    ['癸', '酉', '甲子', '戌', '亥'],
    ['甲', '戌', '甲戌', '申', '酉'],
    ['甲', '申', '甲申', '午', '未'],
    ['甲', '午', '甲午', '辰', '巳'],
    ['甲', '辰', '甲辰', '寅', '卯'],
    ['甲', '寅', '甲寅', '子', '丑'],
  ] as [TianGan, DiZhi, string, DiZhi, DiZhi][])(
    'day %s%s belongs to xun %s with kong %s%s',
    (gan, zhi, xun, z1, z2) => {
      const result = calcKongWang(gan, zhi)
      expect(result).not.toBeNull()
      expect(result!.xun).toBe(xun)
      expect(result!.zhi1).toBe(z1)
      expect(result!.zhi2).toBe(z2)
    },
  )

  it('returns null for invalid gan-zhi combination', () => {
    // 甲丑 is not a valid sexagenary pair
    expect(calcKongWang('甲', '丑')).toBeNull()
  })
})

describe('isKong', () => {
  it('returns true when zhi matches either kong zhi', () => {
    const kw = calcKongWang('甲', '子')!
    expect(isKong('戌', kw)).toBe(true)
    expect(isKong('亥', kw)).toBe(true)
  })

  it('returns false when zhi does not match', () => {
    const kw = calcKongWang('甲', '子')!
    expect(isKong('子', kw)).toBe(false)
    expect(isKong('丑', kw)).toBe(false)
    expect(isKong('申', kw)).toBe(false)
  })
})
