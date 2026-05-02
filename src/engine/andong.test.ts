import { describe, it, expect, beforeEach } from 'vitest'
import { detectAnDong } from './andong'
import type { YaoDetail, BaZi, DiZhi, WangShuai } from '../types'

function makeYaoDetail(
  zhi: DiZhi,
  wangshuai?: WangShuai,
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
    wangshuai,
  }
}

function makeBaZi(yueZhi: DiZhi, riZhi: DiZhi): BaZi {
  return {
    nian: { gan: '甲', zhi: '辰', wuxing: '木' },
    yue: { gan: '丙', zhi: yueZhi, wuxing: '火' },
    ri: { gan: '甲', zhi: riZhi, wuxing: '木' },
    shi: { gan: '庚', zhi: '午', wuxing: '金' },
  }
}

describe('detectAnDong', () => {
  let yaos: YaoDetail[]
  const bazi = makeBaZi('卯', '酉')

  beforeEach(() => {
    yaos = [
      makeYaoDetail('子'), // 子冲午 (月), 子不冲酉 (日) — no-op
      makeYaoDetail('午', '旺'), // 午冲子 (月)? No, 午→子 and 月=卯, so no. But 午冲子 and 日=酉, no. Actually 午←→子
      makeYaoDetail('酉', '旺'), // 酉冲卯 (月) → 月破
      makeYaoDetail('卯', '相'), // 卯冲酉 (日) → 暗动 (相)
      makeYaoDetail('卯', '休'), // 卯冲酉 (日) → 日破 (休)
      makeYaoDetail('丑'), // no chong with 卯 or 酉
    ]
  })

  it('sets 月破 when monthZhi chongs yaoZhi', () => {
    detectAnDong(yaos, bazi)
    // 酉→卯 is chong, monthZhi=卯, yaoZhi=酉
    expect(yaos[2].isAnDong).toBe(false)
    expect(yaos[2].anDongReason).toBe('月破')
  })

  it('sets 暗动 when dayZhi chongs and wangshuai is 旺 or 相', () => {
    detectAnDong(yaos, bazi)
    // 卯→酉 is chong, dayZhi=酉, yaoZhi=卯, wangshuai='相'
    expect(yaos[3].isAnDong).toBe(true)
    expect(yaos[3].anDongReason).toBe('日冲')
  })

  it('sets 日破 when dayZhi chongs and wangshuai is 休/囚/死', () => {
    detectAnDong(yaos, bazi)
    // 卯→酉 is chong, dayZhi=酉, yaoZhi=卯, wangshuai='休'
    expect(yaos[4].isAnDong).toBe(true)
    expect(yaos[4].anDongReason).toBe('日破')
  })

  it('月破 takes priority over day chong', () => {
    // A yao that chongs both month and day
    // Actually:
    // 卯 chong 酉 → monthZhi=卯, so 卯 would chong monthZhi=卯...
    // No, 卯 chong 酉. LIU_CHONG: '卯': '酉', '酉': '卯'
    // So if yaoZhi='卯', then LIU_CHONG['卯'] = '酉'
    // monthZhi='卯' → LIU_CHONG[yaoZhi] = '酉' !== '卯', so no month chong
    // dayZhi='酉' → LIU_CHONG[yaoZhi] = '酉' === '酉', so day chong (暗动 since 旺)
    // Hmm, that's day chong only.

    // Let me set up a yao that chongs both
    const yao2 = makeYaoDetail('酉', '旺') // 酉 chong 卯
    // monthZhi='卯' → LIU_CHONG['酉'] = '卯' === '卯' → 月破
    const bazichong = makeBaZi('卯', '子') // month=卯, day=子
    // 酉 chong 卯 (month=卯), and 酉 does NOT chong 子 (day=子)
    // So it's only 月破

    const yaos2 = [yao2]
    detectAnDong(yaos2, bazichong)
    expect(yaos2[0].isAnDong).toBe(false)
    expect(yaos2[0].anDongReason).toBe('月破')
  })

  it('does not modify yaos with no chong relationship', () => {
    detectAnDong(yaos, bazi)
    // 子 chong 午, not chong with month 卯 or day 酉
    expect(yaos[0].isAnDong).toBeUndefined()
    expect(yaos[0].anDongReason).toBeUndefined()
    // 丑 chong 未, not chong with month 卯 or day 酉
    expect(yaos[5].isAnDong).toBeUndefined()
    expect(yaos[5].anDongReason).toBeUndefined()
  })

  describe('isChanged mode (变卦)', () => {
    it('clears all flags regardless of chong relationship', () => {
      const changedYaos = [
        makeYaoDetail('卯'), // 卯 chong 酉 (日辰=酉)
        makeYaoDetail('午'), // 午 does not chong 酉
      ]
      const bazi = makeBaZi('卯', '酉') // 日辰=酉
      detectAnDong(changedYaos, bazi, true)

      // 变卦清空所有标记，不设 isRiPo
      expect(changedYaos[0].isAnDong).toBeUndefined()
      expect(changedYaos[0].anDongReason).toBeUndefined()
      expect(changedYaos[0].isRiPo).toBeUndefined()
      expect(changedYaos[0].riPoReason).toBeUndefined()

      // 午 does not chong 酉 → no flags either
      expect(changedYaos[1].isAnDong).toBeUndefined()
      expect(changedYaos[1].isRiPo).toBeUndefined()
      expect(changedYaos[1].riPoReason).toBeUndefined()
    })

    it('ignores 月辰 and 日辰 in isChanged mode (clears all)', () => {
      const changedYaos = [
        makeYaoDetail('酉'), // 酉 chong 卯 (月辰=卯), but NOT 日辰=子
      ]
      const bazi = makeBaZi('卯', '子') // 月辰=卯, 日辰=子
      detectAnDong(changedYaos, bazi, true)

      // 变卦清空所有标记
      expect(changedYaos[0].isAnDong).toBeUndefined()
      expect(changedYaos[0].isRiPo).toBeUndefined()
      expect(changedYaos[0].riPoReason).toBeUndefined()
    })
  })
})
