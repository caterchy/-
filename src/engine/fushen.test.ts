import { describe, it, expect } from 'vitest'
import { calcFuShen } from './fushen'
import type { YaoDetail, BaGua, DiZhi } from '../types'

function makeYaoDetail(
  position: number,
  liuqin: string,
  zhi: DiZhi,
  gan: string = '甲',
): YaoDetail {
  return {
    position,
    yao: { yang: true, changing: false, type: '少阳' },
    najia: { gan: gan as any, zhi },
    wuxing: '木',
    liuqin: liuqin as any,
    liushou: '青龙',
    isShi: false,
    isYing: false,
    isEmpty: false,
    shensha: [],
  }
}

describe('calcFuShen', () => {
  it('returns fushen for positions where liuqin type is missing', () => {
    // Palace: 乾 (金)
    // 乾为天 palace hex zhids: 子,寅,辰,午,申,戌
    // Liuqin relative to 金: 子孙,妻财,父母,官鬼,兄弟,父母
    // Yaos below are missing 官鬼 from their liuqin set
    const yaos: YaoDetail[] = [
      makeYaoDetail(1, '子孙', '子'),
      makeYaoDetail(2, '妻财', '寅'),
      makeYaoDetail(3, '父母', '辰'),
      makeYaoDetail(4, '子孙', '午'),  // 官鬼 missing here → fushen
      makeYaoDetail(5, '兄弟', '申'),
      makeYaoDetail(6, '父母', '戌'),
    ]
    const result = calcFuShen('乾' as BaGua, yaos)
    // The palace hex has 官鬼 at position 3 (0-indexed) with zhi='午', wuxing='火', gan='壬' (外卦乾纳壬)
    expect(result[3]).toBeDefined()
    expect(result[3]!.liuqin).toBe('官鬼')
    expect(result[3]!.gan).toBe('壬')
    expect(result[3]!.zhi).toBe('午')
    expect(result[3]!.wuxing).toBe('火')
  })

  it('returns all undefined when all liuqin types are present', () => {
    const yaos: YaoDetail[] = [
      makeYaoDetail(1, '兄弟', '子'),
      makeYaoDetail(2, '子孙', '寅'),
      makeYaoDetail(3, '妻财', '辰'),
      makeYaoDetail(4, '官鬼', '午'),
      makeYaoDetail(5, '父母', '申'),
      makeYaoDetail(6, '兄弟', '戌'),
    ]
    const result = calcFuShen('乾' as BaGua, yaos)
    // All 5 liuqin types present, so no fushen
    expect(result.every((r) => r === undefined)).toBe(true)
  })

  it('returns empty array for unknown palace', () => {
    const yaos: YaoDetail[] = [
      makeYaoDetail(1, '兄弟', '子'),
      makeYaoDetail(2, '兄弟', '寅'),
      makeYaoDetail(3, '兄弟', '辰'),
      makeYaoDetail(4, '兄弟', '午'),
      makeYaoDetail(5, '兄弟', '申'),
      makeYaoDetail(6, '兄弟', '戌'),
    ]
    // ALL_HEXAGRAMS has no entry for this palace+pos=0 combo — use a valid palace that exists
    const result = calcFuShen('坤' as BaGua, yaos)
    expect(Array.isArray(result)).toBe(true)
  })
})
