import { describe, it, expect } from 'vitest'
import { calcBaZi, formatBaZi } from './bazi'

describe('calcBaZi', () => {
  it('computes BaZi for 2024-02-10 12:00 (after 立春)', () => {
    // 2024 is 甲辰年 (2024-4=2020, 2020%10=0→甲, 2020%12=4→辰)
    // After Feb 4 (立春), so 甲辰年
    // 丙寅月: 甲年, 正月=寅, 五虎遁 甲→丙
    // Day pillar depends on diff from 1900-01-01
    // Time: 12:00 = 午时, dayGan=甲→五鼠遁 甲→甲子, 午=index(午)=6, 甲+6=庚
    const result = calcBaZi(new Date(2024, 1, 10, 12, 0, 0))

    // Year
    expect(result.nian.gan).toBe('甲')
    expect(result.nian.zhi).toBe('辰')

    // Month: after 立春 → 寅月
    // 甲年 丙寅月
    expect(result.yue.gan).toBe('丙')
    expect(result.yue.zhi).toBe('寅')

    // Hour: 午时
    expect(result.shi.zhi).toBe('午')
  })

  it('returns same structure for year 2025', () => {
    const result = calcBaZi(new Date(2025, 5, 15, 12, 0, 0))
    expect(result.nian).toBeDefined()
    expect(result.yue).toBeDefined()
    expect(result.ri).toBeDefined()
    expect(result.shi).toBeDefined()
    expect(result.nian.gan).toBe('乙')
    expect(result.nian.zhi).toBe('巳')
  })

  it('handles the 23:00 boundary crossing to next day', () => {
    // 23:00 belongs to next day in day pillar calculation
    // Also 子时 (23:00-00:59) → 子=index 0
    const result = calcBaZi(new Date(2024, 1, 10, 23, 0, 0))
    // At 23:00, the day should be adjusted (23>=23 → day+1)
    // The hour pillar should be 子时
    expect(result.shi.zhi).toBe('子')
  })

  it('handles 00:00 as 子时', () => {
    const result = calcBaZi(new Date(2024, 1, 10, 0, 0, 0))
    expect(result.shi.zhi).toBe('子')
  })
})

describe('formatBaZi', () => {
  it('formats BaZi as a readable string', () => {
    const bazi = calcBaZi(new Date(2024, 1, 10, 12, 0, 0))
    const formatted = formatBaZi(bazi)
    expect(formatted).toContain('年')
    expect(formatted).toContain('月')
    expect(formatted).toContain('日')
    expect(formatted).toContain('时')
    expect(formatted.length).toBeGreaterThan(10)
  })
})
