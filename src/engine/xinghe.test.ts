import { describe, it, expect } from 'vitest'
import { calcHe, calcXing, calcChong } from './xinghe'
import type { DiZhi } from '../types'

function setOf(...items: DiZhi[]): Set<DiZhi> {
  return new Set(items)
}

describe('calcHe', () => {
  it('returns all 6 he rules', () => {
    const result = calcHe(setOf())
    expect(result).toHaveLength(6)
    expect(result.map(r => r.description)).toEqual([
      '子丑合土', '寅亥合木', '卯戌合火', '辰酉合金', '巳申合水', '午未合土',
    ])
  })

  it('marks rules as active when their zhi is in activeZhis', () => {
    const result = calcHe(setOf('子'))
    expect(result.find(r => r.description === '子丑合土')!.active).toBe(true)
    expect(result.find(r => r.description === '寅亥合木')!.active).toBe(false)
    expect(result.find(r => r.description === '午未合土')!.active).toBe(false)
  })

  it('marks rules as active when either zhi matches', () => {
    const result = calcHe(setOf('丑'))
    expect(result.find(r => r.description === '子丑合土')!.active).toBe(true)

    const result2 = calcHe(setOf('戌', '亥'))
    expect(result2.find(r => r.description === '寅亥合木')!.active).toBe(true)
    expect(result2.find(r => r.description === '卯戌合火')!.active).toBe(true)
  })

  it('marks all inactive when no activeZhis match', () => {
    const result = calcHe(setOf())
    expect(result.every(r => r.active === false)).toBe(true)
  })

  it('includes wuxing and zhis for each rule', () => {
    const result = calcHe(setOf('子'))
    const ziChou = result.find(r => r.description === '子丑合土')!
    expect(ziChou.wuxing).toBe('土')
    expect(ziChou.zhis).toEqual(['子', '丑'])
  })
})

describe('calcXing', () => {
  it('returns all 3 xing groups plus 4 self-xing items', () => {
    const result = calcXing(setOf())
    expect(result).toHaveLength(7) // 3 groups + 4 self-xing
  })

  it('includes all xing groups', () => {
    const result = calcXing(setOf())
    const names = result.map(r => r.name)
    expect(names).toContain('无恩之刑')
    expect(names).toContain('恃势之刑')
    expect(names).toContain('无礼之刑')
    expect(names).toContain('自刑')
  })

  it('marks group as active when any zhi matches', () => {
    const result = calcXing(setOf('寅'))
    expect(result.find(r => r.name === '无恩之刑')!.active).toBe(true)
    expect(result.find(r => r.name === '恃势之刑')!.active).toBe(false)

    const result2 = calcXing(setOf('未', '子'))
    expect(result2.find(r => r.name === '恃势之刑')!.active).toBe(true)
    expect(result2.find(r => r.name === '无礼之刑')!.active).toBe(true)
  })

  it('marks self-xing items as active when their zhi matches', () => {
    const result = calcXing(setOf('辰'))
    const ziXing = result.filter(r => r.name === '自刑')
    expect(ziXing.find(r => r.zhis[0] === '辰')!.active).toBe(true)
    expect(ziXing.find(r => r.zhis[0] === '午')!.active).toBe(false)
    expect(ziXing.find(r => r.zhis[0] === '酉')!.active).toBe(false)
    expect(ziXing.find(r => r.zhis[0] === '亥')!.active).toBe(false)
  })

  it('marks multiple self-xing items as active when multiple match', () => {
    const result = calcXing(setOf('辰', '午'))
    const ziXing = result.filter(r => r.name === '自刑')
    expect(ziXing.find(r => r.zhis[0] === '辰')!.active).toBe(true)
    expect(ziXing.find(r => r.zhis[0] === '午')!.active).toBe(true)
    expect(ziXing.find(r => r.zhis[0] === '酉')!.active).toBe(false)
  })

  it('includes description for each rule', () => {
    const result = calcXing(setOf())
    expect(result.every(r => r.description.length > 0)).toBe(true)
  })
})

describe('calcChong', () => {
  it('returns all 6 chong rules', () => {
    const result = calcChong(setOf())
    expect(result).toHaveLength(6)
    expect(result.map(r => r.description)).toEqual([
      '子午相冲', '丑未相冲', '寅申相冲', '卯酉相冲', '辰戌相冲', '巳亥相冲',
    ])
  })

  it('marks rules as active when either zhi is in activeZhis', () => {
    const result = calcChong(setOf('子'))
    expect(result.find(r => r.description === '子午相冲')!.active).toBe(true)
    expect(result.find(r => r.description === '丑未相冲')!.active).toBe(false)

    const result2 = calcChong(setOf('酉'))
    expect(result2.find(r => r.description === '卯酉相冲')!.active).toBe(true)
  })

  it('marks all inactive when no activeZhis match', () => {
    const result = calcChong(setOf())
    expect(result.every(r => r.active === false)).toBe(true)
  })

  it('includes z1 and z2 fields', () => {
    const result = calcChong(setOf())
    const ziWu = result.find(r => r.description === '子午相冲')!
    expect(ziWu.z1).toBe('子')
    expect(ziWu.z2).toBe('午')
  })
})
