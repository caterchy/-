import { describe, it, expect } from 'vitest'
import {
  TIAN_GAN,
  DI_ZHI,
  WU_HU_DUN,
  WU_SHU_DUN,
  DI_ZHI_LIU_CHONG,
  DI_ZHI_LIU_HE,
  SAN_HE_JU,
  XUN_KONG,
  getXun,
} from './bazi'

describe('TIAN_GAN', () => {
  it('has exactly 10 entries', () => {
    expect(TIAN_GAN).toHaveLength(10)
    expect(TIAN_GAN).toEqual(['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'])
  })
})

describe('DI_ZHI', () => {
  it('has exactly 12 entries', () => {
    expect(DI_ZHI).toHaveLength(12)
    expect(DI_ZHI).toEqual(['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'])
  })
})

describe('WU_HU_DUN', () => {
  it('has entries for all 10 gan', () => {
    for (const gan of TIAN_GAN) {
      expect(WU_HU_DUN[gan]).toBeDefined()
    }
  })

  it('甲己之年丙作首', () => {
    expect(WU_HU_DUN['甲']).toBe('丙')
    expect(WU_HU_DUN['己']).toBe('丙')
  })

  it('乙庚之岁戊为头', () => {
    expect(WU_HU_DUN['乙']).toBe('戊')
    expect(WU_HU_DUN['庚']).toBe('戊')
  })

  it('丙辛之年寻庚上', () => {
    expect(WU_HU_DUN['丙']).toBe('庚')
    expect(WU_HU_DUN['辛']).toBe('庚')
  })

  it('丁壬壬位顺行流', () => {
    expect(WU_HU_DUN['丁']).toBe('壬')
    expect(WU_HU_DUN['壬']).toBe('壬')
  })

  it('若问戊癸何方发，甲寅之上好追求', () => {
    expect(WU_HU_DUN['戊']).toBe('甲')
    expect(WU_HU_DUN['癸']).toBe('甲')
  })
})

describe('WU_SHU_DUN', () => {
  it('has entries for all 10 gan', () => {
    for (const gan of TIAN_GAN) {
      expect(WU_SHU_DUN[gan]).toBeDefined()
    }
  })

  it('甲己还加甲', () => {
    expect(WU_SHU_DUN['甲']).toBe('甲')
    expect(WU_SHU_DUN['己']).toBe('甲')
  })

  it('乙庚丙作初', () => {
    expect(WU_SHU_DUN['乙']).toBe('丙')
    expect(WU_SHU_DUN['庚']).toBe('丙')
  })

  it('丙辛从戊起', () => {
    expect(WU_SHU_DUN['丙']).toBe('戊')
    expect(WU_SHU_DUN['辛']).toBe('戊')
  })

  it('丁壬庚子居', () => {
    expect(WU_SHU_DUN['丁']).toBe('庚')
    expect(WU_SHU_DUN['壬']).toBe('庚')
  })

  it('戊癸何方发，壬子是真途', () => {
    expect(WU_SHU_DUN['戊']).toBe('壬')
    expect(WU_SHU_DUN['癸']).toBe('壬')
  })
})

describe('DI_ZHI_LIU_CHONG', () => {
  it('each zhi has a chong counterpart', () => {
    for (const zhi of DI_ZHI) {
      expect(DI_ZHI_LIU_CHONG[zhi]).toBeDefined()
    }
  })

  it('chong is symmetric', () => {
    for (const [zhi, chongZhi] of Object.entries(DI_ZHI_LIU_CHONG)) {
      expect(DI_ZHI_LIU_CHONG[chongZhi]).toBe(zhi)
    }
  })

  it('子午冲', () => {
    expect(DI_ZHI_LIU_CHONG['子']).toBe('午')
    expect(DI_ZHI_LIU_CHONG['午']).toBe('子')
  })

  it('卯酉冲', () => {
    expect(DI_ZHI_LIU_CHONG['卯']).toBe('酉')
    expect(DI_ZHI_LIU_CHONG['酉']).toBe('卯')
  })

  it('寅申冲', () => {
    expect(DI_ZHI_LIU_CHONG['寅']).toBe('申')
    expect(DI_ZHI_LIU_CHONG['申']).toBe('寅')
  })
})

describe('DI_ZHI_LIU_HE', () => {
  it('each zhi has a he counterpart', () => {
    for (const zhi of DI_ZHI) {
      expect(DI_ZHI_LIU_HE[zhi]).toBeDefined()
    }
  })

  it('he is symmetric', () => {
    for (const [zhi, heZhi] of Object.entries(DI_ZHI_LIU_HE)) {
      expect(DI_ZHI_LIU_HE[heZhi]).toBe(zhi)
    }
  })

  it('子丑合', () => {
    expect(DI_ZHI_LIU_HE['子']).toBe('丑')
    expect(DI_ZHI_LIU_HE['丑']).toBe('子')
  })

  it('寅亥合', () => {
    expect(DI_ZHI_LIU_HE['寅']).toBe('亥')
    expect(DI_ZHI_LIU_HE['亥']).toBe('寅')
  })
})

describe('SAN_HE_JU', () => {
  it('has 4 entries for 4 elements', () => {
    expect(Object.keys(SAN_HE_JU)).toHaveLength(4)
  })

  it('申子辰合水', () => {
    expect(SAN_HE_JU['申子辰'].wuxing).toBe('水')
    expect(SAN_HE_JU['申子辰'].zhis).toEqual(['申', '子', '辰'])
  })

  it('亥卯未合木', () => {
    expect(SAN_HE_JU['亥卯未'].wuxing).toBe('木')
    expect(SAN_HE_JU['亥卯未'].zhis).toEqual(['亥', '卯', '未'])
  })

  it('寅午戌合火', () => {
    expect(SAN_HE_JU['寅午戌'].wuxing).toBe('火')
    expect(SAN_HE_JU['寅午戌'].zhis).toEqual(['寅', '午', '戌'])
  })

  it('巳酉丑合金', () => {
    expect(SAN_HE_JU['巳酉丑'].wuxing).toBe('金')
    expect(SAN_HE_JU['巳酉丑'].zhis).toEqual(['巳', '酉', '丑'])
  })
})

describe('XUN_KONG', () => {
  it('has 6 entries', () => {
    expect(Object.keys(XUN_KONG)).toHaveLength(6)
  })

  it('甲子旬空戌亥', () => {
    expect(XUN_KONG['甲子']).toEqual(['戌', '亥'])
  })

  it('甲戌旬空申酉', () => {
    expect(XUN_KONG['甲戌']).toEqual(['申', '酉'])
  })

  it('甲申旬空午未', () => {
    expect(XUN_KONG['甲申']).toEqual(['午', '未'])
  })

  it('甲午旬空辰巳', () => {
    expect(XUN_KONG['甲午']).toEqual(['辰', '巳'])
  })

  it('甲辰旬空寅卯', () => {
    expect(XUN_KONG['甲辰']).toEqual(['寅', '卯'])
  })

  it('甲寅旬空子丑', () => {
    expect(XUN_KONG['甲寅']).toEqual(['子', '丑'])
  })
})

describe('getXun', () => {
  it('甲子日 is in 甲子旬', () => {
    expect(getXun('甲', '子')).toBe('甲子')
  })

  it('乙丑日 is in 甲子旬', () => {
    expect(getXun('乙', '丑')).toBe('甲子')
  })

  it('甲戌日 is in 甲戌旬', () => {
    expect(getXun('甲', '戌')).toBe('甲戌')
  })

  it('癸亥日 is in 甲寅旬', () => {
    expect(getXun('癸', '亥')).toBe('甲寅')
  })

  it('returns null for unsupported xun', () => {
    // 甲丑 is not a valid day
    expect(getXun('甲', '丑')).toBeNull()
  })
})
