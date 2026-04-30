import type { TianGan, DiZhi, Zhu, BaZi } from '../types'
import {
  TIAN_GAN, DI_ZHI, GAN_WU_XING,
  WU_HU_DUN, WU_SHU_DUN,
} from '../data/bazi'

/**
 * 计算年柱
 * 甲子年对应公历年份的规律: 1984 = 甲子年
 * 年以立春为界（简化处理：公历2月4日左右）
 */
function calcYearPillar(year: number, month: number, day: number): Zhu {
  // 立春前算上一年
  let realYear = year
  if (month < 2 || (month === 2 && day < 4)) {
    realYear = year - 1
  }

  const ganIdx = (realYear - 4) % 10
  const zhiIdx = (realYear - 4) % 12
  const gan = TIAN_GAN[(ganIdx + 10) % 10]
  const zhi = DI_ZHI[(zhiIdx + 12) % 12]

  return { gan, zhi, wuxing: GAN_WU_XING[gan] }
}

/**
 * 计算月柱（五虎遁）
 * 正月为寅，从寅开始
 */
function calcMonthPillar(yearGan: TianGan, month: number): Zhu {
  // 月的地支: 寅(1)卯(2)辰(3)巳(4)午(5)未(6)申(7)酉(8)戌(9)亥(10)子(11)丑(12)
  const zhi = DI_ZHI[(month + 1) % 12] // month: 1-12 → index: 2-1 → 寅到丑
  // 五虎遁定月干
  const startGan = WU_HU_DUN[yearGan]
  const startGanIdx = TIAN_GAN.indexOf(startGan)
  const ganIdx = (startGanIdx + month - 1) % 10
  const gan = TIAN_GAN[ganIdx]

  return { gan, zhi, wuxing: GAN_WU_XING[gan] }
}

/**
 * 计算日柱
 * 使用基准日期法: 1900-01-01 = 甲戌日(干支索引: 10, 10)
 * 天干索引: 甲=0, 乙=1...
 * 地支索引: 子=0, 丑=1...
 */
function calcDayPillar(year: number, month: number, day: number): Zhu {
  // 基准: 1900-01-01 = 甲戌日 (天干索引10→甲, 地支索引10→戌)
  // 实际上 1900-01-01 是甲戌日, ganIdx=10%10=0=甲, zhiIdx=10%12=10=戌
  const baseDate = new Date(1900, 0, 1) // Jan 1, 1900
  const targetDate = new Date(year, month - 1, day)
  const diffDays = Math.round((targetDate.getTime() - baseDate.getTime()) / 86400000)

  const ganIdx = ((diffDays % 10) + 10) % 10
  const zhiIdx = ((diffDays % 12) + 12) % 12

  const gan = TIAN_GAN[ganIdx]
  const zhi = DI_ZHI[zhiIdx]

  return { gan, zhi, wuxing: GAN_WU_XING[gan] }
}

/** 时辰地支对照 */
const SHI_CHEN_ZHI: Record<number, DiZhi> = {
  23: '子', 0: '子',
  1: '丑', 2: '丑',
  3: '寅', 4: '寅',
  5: '卯', 6: '卯',
  7: '辰', 8: '辰',
  9: '巳', 10: '巳',
  11: '午', 12: '午',
  13: '未', 14: '未',
  15: '申', 16: '申',
  17: '酉', 18: '酉',
  19: '戌', 20: '戌',
  21: '亥', 22: '亥',
}

/**
 * 计算时柱（五鼠遁）
 * 时辰: 0-23小时
 */
function calcHourPillar(dayGan: TianGan, hour: number): Zhu {
  const zhi = SHI_CHEN_ZHI[hour] || '子'

  // 五鼠遁定子时天干
  const startGan = WU_SHU_DUN[dayGan]
  const startGanIdx = TIAN_GAN.indexOf(startGan)

  // 时辰地支索引(子=0, 丑=1...)
  const zhiIdx = DI_ZHI.indexOf(zhi)
  // 时干 = 子时干 + 时辰索引
  const ganIdx = (startGanIdx + zhiIdx) % 10
  const gan = TIAN_GAN[ganIdx]

  return { gan, zhi, wuxing: GAN_WU_XING[gan] }
}

/** 计算完整八字 */
export function calcBaZi(date: Date): BaZi {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()

  const nian = calcYearPillar(year, month, day)
  const yue = calcMonthPillar(nian.gan, month)
  const ri = calcDayPillar(year, month, day)
  const shi = calcHourPillar(ri.gan, hour)

  return { nian, yue, ri, shi }
}

/** 格式化八字为字符串 */
export function formatBaZi(bazi: BaZi): string {
  return `${bazi.nian.gan}${bazi.nian.zhi} ${bazi.yue.gan}${bazi.yue.zhi} ${bazi.ri.gan}${bazi.ri.zhi} ${bazi.shi.gan}${bazi.shi.zhi}`
}
