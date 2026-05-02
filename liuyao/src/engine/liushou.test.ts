import { describe, it, expect } from 'vitest'
import { getLiuShen } from './liushou'
import type { TianGan } from '../types'

describe('getLiuShen', () => {
  it.each([
    ['甲', 0, '青龙'],
    ['甲', 1, '朱雀'],
    ['甲', 2, '勾陈'],
    ['甲', 3, '腾蛇'],
    ['甲', 4, '白虎'],
    ['甲', 5, '玄武'],
  ] as [TianGan, number, string][])('dayGan=%s cycles through all 6 positions', (gan, idx, expected) => {
    expect(getLiuShen(gan, idx)).toBe(expected)
  })

  it.each([
    ['甲', '青龙'],
    ['乙', '青龙'],
    ['丙', '朱雀'],
    ['丁', '朱雀'],
    ['戊', '勾陈'],
    ['己', '腾蛇'],
    ['庚', '白虎'],
    ['辛', '白虎'],
    ['壬', '玄武'],
    ['癸', '玄武'],
  ] as [TianGan, string][])('dayGan=%s starts with %s at yaoIndex 0', (gan, expected) => {
    expect(getLiuShen(gan, 0)).toBe(expected)
  })

  it('wraps around correctly from yaoIndex 6', () => {
    expect(getLiuShen('甲', 6)).toBe('青龙')
    expect(getLiuShen('甲', 7)).toBe('朱雀')
    expect(getLiuShen('庚', 6)).toBe('白虎')
  })
})
