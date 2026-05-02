import { describe, it, expect } from 'vitest'
import { GUA_NA_GAN, GUA_NA_ZHI } from './naja'

describe('GUA_NA_GAN', () => {
  it('has entries for all 8 gua', () => {
    const guas = ['乾', '兑', '离', '震', '巽', '坎', '艮', '坤']
    for (const gua of guas) {
      expect(GUA_NA_GAN[gua as keyof typeof GUA_NA_GAN]).toBeDefined()
    }
  })

  it('乾 has inner 甲 and outer 壬', () => {
    expect(GUA_NA_GAN['乾'].inner).toBe('甲')
    expect(GUA_NA_GAN['乾'].outer).toBe('壬')
  })

  it('坤 has inner 乙 and outer 癸', () => {
    expect(GUA_NA_GAN['坤'].inner).toBe('乙')
    expect(GUA_NA_GAN['坤'].outer).toBe('癸')
  })

  it('other gua have same gan for inner and outer', () => {
    const sameGua: Array<keyof typeof GUA_NA_GAN> = ['兑', '离', '震', '巽', '坎', '艮']
    for (const gua of sameGua) {
      expect(GUA_NA_GAN[gua].inner).toBe(GUA_NA_GAN[gua].outer)
    }
  })
})

describe('GUA_NA_ZHI', () => {
  it('has entries for all 8 gua', () => {
    const guas = ['乾', '兑', '离', '震', '巽', '坎', '艮', '坤']
    for (const gua of guas) {
      expect(GUA_NA_ZHI[gua as keyof typeof GUA_NA_ZHI]).toBeDefined()
    }
  })

  it('乾 has inner 子寅辰 and outer 午申戌', () => {
    expect(GUA_NA_ZHI['乾'].inner).toEqual(['子', '寅', '辰'])
    expect(GUA_NA_ZHI['乾'].outer).toEqual(['午', '申', '戌'])
  })

  it('震 has same inner/outer as 乾 (子寅辰/午申戌)', () => {
    expect(GUA_NA_ZHI['震'].inner).toEqual(['子', '寅', '辰'])
    expect(GUA_NA_ZHI['震'].outer).toEqual(['午', '申', '戌'])
  })

  it('坤 has inner 未巳卯 and outer 丑亥酉', () => {
    expect(GUA_NA_ZHI['坤'].inner).toEqual(['未', '巳', '卯'])
    expect(GUA_NA_ZHI['坤'].outer).toEqual(['丑', '亥', '酉'])
  })

  it('each inner and outer array has length 3', () => {
    for (const [, val] of Object.entries(GUA_NA_ZHI)) {
      expect(val.inner).toHaveLength(3)
      expect(val.outer).toHaveLength(3)
    }
  })

  it('yang gua (乾震坎艮) inner zhids are yang zhi (子寅辰...)', () => {
    const yangZhi = ['子', '寅', '辰', '午', '申', '戌']
    const yangGua: Array<keyof typeof GUA_NA_ZHI> = ['乾', '震', '坎', '艮']
    for (const gua of yangGua) {
      for (const zhi of GUA_NA_ZHI[gua].inner) {
        expect(yangZhi).toContain(zhi)
      }
    }
  })
})
