import { describe, it, expect } from 'vitest'
import { detectFanYinFuYin } from './fanyin'
import type { YaoDetail, DiZhi } from '../types'

function makeYaoDetail(
  index: number,
  zhi: DiZhi,
  changing: boolean,
): YaoDetail {
  return {
    position: index + 1,
    yao: { yang: true, changing, type: changing ? '老阳' : '少阳' },
    najia: { gan: '甲', zhi },
    wuxing: '木',
    liuqin: '兄弟',
    liushou: '青龙',
    isShi: false,
    isYing: false,
    isEmpty: false,
    shensha: [],
  }
}

describe('detectFanYinFuYin', () => {
  it('detects lower fanyin when lower zhids all chong', () => {
    // 子→午, 寅→申, 辰→戌 are all chong pairs
    const original = [
      makeYaoDetail(0, '子', true),
      makeYaoDetail(1, '寅', true),
      makeYaoDetail(2, '辰', true),
      makeYaoDetail(3, '午', false),
      makeYaoDetail(4, '申', false),
      makeYaoDetail(5, '戌', false),
    ]
    const changed = [
      makeYaoDetail(0, '午', false),
      makeYaoDetail(1, '申', false),
      makeYaoDetail(2, '戌', false),
      makeYaoDetail(3, '午', false),
      makeYaoDetail(4, '申', false),
      makeYaoDetail(5, '戌', false),
    ]
    const result = detectFanYinFuYin(original, changed)
    expect(result).not.toBeNull()
    expect(result!.type).toBe('反吟')
    expect(result!.description).toContain('下卦反吟')
  })

  it('detects upper fanyin when upper zhids all chong', () => {
    const original = [
      makeYaoDetail(0, '子', false),
      makeYaoDetail(1, '寅', false),
      makeYaoDetail(2, '辰', false),
      makeYaoDetail(3, '午', true),
      makeYaoDetail(4, '申', true),
      makeYaoDetail(5, '戌', true),
    ]
    const changed = [
      makeYaoDetail(0, '子', false),
      makeYaoDetail(1, '寅', false),
      makeYaoDetail(2, '辰', false),
      makeYaoDetail(3, '子', false),
      makeYaoDetail(4, '寅', false),
      makeYaoDetail(5, '辰', false),
    ]
    const result = detectFanYinFuYin(original, changed)
    expect(result).not.toBeNull()
    expect(result!.type).toBe('反吟')
    expect(result!.description).toContain('上卦反吟')
  })

  it('detects lower fuyin when lower zhids unchanged', () => {
    const original = [
      makeYaoDetail(0, '子', true),
      makeYaoDetail(1, '寅', true),
      makeYaoDetail(2, '辰', true),
      makeYaoDetail(3, '午', false),
      makeYaoDetail(4, '申', false),
      makeYaoDetail(5, '戌', false),
    ]
    const changed = [
      makeYaoDetail(0, '子', false),
      makeYaoDetail(1, '寅', false),
      makeYaoDetail(2, '辰', false),
      makeYaoDetail(3, '午', false),
      makeYaoDetail(4, '申', false),
      makeYaoDetail(5, '戌', false),
    ]
    const result = detectFanYinFuYin(original, changed)
    expect(result).not.toBeNull()
    expect(result!.type).toBe('伏吟')
    expect(result!.description).toContain('下卦伏吟')
  })

  it('returns null when no moving yaos', () => {
    const original = [
      makeYaoDetail(0, '子', false),
      makeYaoDetail(1, '寅', false),
      makeYaoDetail(2, '辰', false),
      makeYaoDetail(3, '午', false),
      makeYaoDetail(4, '申', false),
      makeYaoDetail(5, '戌', false),
    ]
    const changed = [
      makeYaoDetail(0, '子', false),
      makeYaoDetail(1, '寅', false),
      makeYaoDetail(2, '辰', false),
      makeYaoDetail(3, '午', false),
      makeYaoDetail(4, '申', false),
      makeYaoDetail(5, '戌', false),
    ]
    expect(detectFanYinFuYin(original, changed)).toBeNull()
  })

  it('returns null when lower has moving yao but zhids are neither identical nor all chong', () => {
    const original = [
      makeYaoDetail(0, '子', true),
      makeYaoDetail(1, '寅', true),
      makeYaoDetail(2, '辰', true),
      makeYaoDetail(3, '午', false),
      makeYaoDetail(4, '申', false),
      makeYaoDetail(5, '戌', false),
    ]
    // changed lower zhids are only partially chong
    const changed = [
      makeYaoDetail(0, '午', false), // 子→午 ✓ (chong)
      makeYaoDetail(1, '寅', false), // 寅→寅 ✗ (same, not chong)
      makeYaoDetail(2, '戌', false), // 辰→戌 ✓ (chong)
      makeYaoDetail(3, '午', false),
      makeYaoDetail(4, '申', false),
      makeYaoDetail(5, '戌', false),
    ]
    expect(detectFanYinFuYin(original, changed)).toBeNull()
  })
})
