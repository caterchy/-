import { describe, it, expect } from 'vitest'
import { detectSanHe } from './sanhe'
import type { YaoDetail, BaZi, DiZhi } from '../types'

function makeYaoDetail(
  zhi: DiZhi,
  overrides: Partial<YaoDetail> = {},
): YaoDetail {
  return {
    position: 1,
    yao: { yang: true, changing: false, type: '少阳' },
    najia: { gan: '甲', zhi },
    wuxing: '木',
    liuqin: '兄弟',
    liushou: '青龙',
    isShi: false,
    isYing: false,
    isEmpty: false,
    shensha: [],
    ...overrides,
  }
}

function makeBaZi(yueZhi: DiZhi = '卯', riZhi: DiZhi = '酉'): BaZi {
  return {
    nian: { gan: '甲', zhi: '辰', wuxing: '木' },
    yue: { gan: '丙', zhi: yueZhi, wuxing: '火' },
    ri: { gan: '甲', zhi: riZhi, wuxing: '木' },
    shi: { gan: '庚', zhi: '午', wuxing: '金' },
  }
}

describe('detectSanHe', () => {
  it('detects completed sanhe from yaos only', () => {
    // 申子辰水局: position 0=申, position 1=子, position 2=辰
    const yaos: YaoDetail[] = [
      makeYaoDetail('申', { position: 1 }),
      makeYaoDetail('子', { position: 2 }),
      makeYaoDetail('辰', { position: 3 }),
      makeYaoDetail('午', { position: 4 }),
      makeYaoDetail('未', { position: 5 }),
      makeYaoDetail('戌', { position: 6 }),
    ]
    const bazi = makeBaZi('卯', '酉')
    const results = detectSanHe(yaos, bazi, { shiIndex: 1, yingIndex: 4 })

    // Should find 申子辰水局 as completed
    const shuiJu = results.find(r => r.name === '申子辰合水局')
    expect(shuiJu).toBeDefined()
    expect(shuiJu!.completed).toBe(true)
    expect(shuiJu!.matchedZhis).toEqual(['申', '子', '辰'])
    expect(shuiJu!.missingZhis).toEqual([])
    expect(shuiJu!.sources.length).toBeGreaterThanOrEqual(3)
  })

  it('returns completed results first, then incomplete', () => {
    // Only 申 and 子 (missing 辰), plus 寅午戌 complete
    const yaos: YaoDetail[] = [
      makeYaoDetail('申', { position: 1 }),
      makeYaoDetail('子', { position: 2 }),
      makeYaoDetail('午', { position: 3 }),
      makeYaoDetail('寅', { position: 4 }),
      makeYaoDetail('戌', { position: 5 }),
      makeYaoDetail('卯', { position: 6 }),
    ]
    const bazi = makeBaZi('卯', '酉')
    const results = detectSanHe(yaos, bazi, { shiIndex: 1, yingIndex: 4 })

    // First result should be completed
    expect(results[0].completed).toBe(true)
    // Subsequent should be incomplete
    const incomplete = results.filter(r => !r.completed)
    expect(incomplete.length).toBeGreaterThan(0)
  })

  it('marks missing zhi for incomplete sanhe', () => {
    // Only has 申 and 子, missing 辰
    const yaos: YaoDetail[] = [
      makeYaoDetail('申', { position: 1 }),
      makeYaoDetail('子', { position: 2 }),
      makeYaoDetail('午', { position: 3 }),
      makeYaoDetail('卯', { position: 4 }),
      makeYaoDetail('未', { position: 5 }),
      makeYaoDetail('戌', { position: 6 }),
    ]
    const bazi = makeBaZi('卯', '酉')
    const results = detectSanHe(yaos, bazi, { shiIndex: 1, yingIndex: 4 })

    const shuiJu = results.find(r => r.name === '申子辰合水局')
    expect(shuiJu).toBeDefined()
    expect(shuiJu!.completed).toBe(false)
    expect(shuiJu!.matchedZhis).toEqual(['申', '子'])
    expect(shuiJu!.missingZhis).toEqual(['辰'])
  })

  it('includes 日辰/月辰 as sources', () => {
    // Yaos have 辰 and 申, 日辰 provides 子
    const yaos: YaoDetail[] = [
      makeYaoDetail('申', { position: 1 }),
      makeYaoDetail('午', { position: 2 }),
      makeYaoDetail('辰', { position: 3 }),
      makeYaoDetail('卯', { position: 4 }),
      makeYaoDetail('未', { position: 5 }),
      makeYaoDetail('戌', { position: 6 }),
    ]
    const bazi = makeBaZi('卯', '子') // 月辰=卯, 日辰=子
    const results = detectSanHe(yaos, bazi, { shiIndex: 1, yingIndex: 4 })

    const shuiJu = results.find(r => r.name === '申子辰合水局')
    expect(shuiJu).toBeDefined()
    expect(shuiJu!.completed).toBe(true)
    // 子 should have a source from 日辰
    const riChenSource = shuiJu!.sources.find(s => s.source === '日辰')
    expect(riChenSource).toBeDefined()
    expect(riChenSource!.zhi).toBe('子')
  })

  it('annotates sources with yao attributes (dong/旺/shi/ying)', () => {
    const yaos: YaoDetail[] = [
      makeYaoDetail('申', { position: 1, yao: { yang: true, changing: true, type: '老阳' } }),
      makeYaoDetail('子', { position: 2 }),
      makeYaoDetail('辰', { position: 3, isShi: true }),
      makeYaoDetail('午', { position: 4, isYing: true }),
      makeYaoDetail('未', { position: 5 }),
      makeYaoDetail('戌', { position: 6 }),
    ]
    const bazi = makeBaZi('卯', '酉')
    const results = detectSanHe(yaos, bazi, { shiIndex: 1, yingIndex: 4 })

    const shuiJu = results.find(r => r.name === '申子辰合水局')
    expect(shuiJu).toBeDefined()
    expect(shuiJu!.completed).toBe(true)

    // 申 from 初爻(动爻)
    const dongSource = shuiJu!.sources.find(s => s.source.includes('动爻'))
    expect(dongSource).toBeDefined()
    expect(dongSource!.zhi).toBe('申')

    // 辰 from 三爻(世爻)
    const shiSource = shuiJu!.sources.find(s => s.source.includes('世爻'))
    expect(shiSource).toBeDefined()
    expect(shiSource!.zhi).toBe('辰')
  })

  it('returns all 4 sanhe combinations', () => {
    const yaos: YaoDetail[] = [
      makeYaoDetail('子', { position: 1 }),
      makeYaoDetail('丑', { position: 2 }),
      makeYaoDetail('寅', { position: 3 }),
      makeYaoDetail('卯', { position: 4 }),
      makeYaoDetail('辰', { position: 5 }),
      makeYaoDetail('巳', { position: 6 }),
    ]
    const bazi = makeBaZi('午', '酉')
    const results = detectSanHe(yaos, bazi, { shiIndex: 1, yingIndex: 4 })

    // Should have 4 results: 申子辰、亥卯未、寅午戌、巳酉丑
    expect(results).toHaveLength(4)
    const names = results.map(r => r.name)
    expect(names).toContain('申子辰合水局')
    expect(names).toContain('亥卯未合木局')
    expect(names).toContain('寅午戌合火局')
    expect(names).toContain('巳酉丑合金局')
  })
})
