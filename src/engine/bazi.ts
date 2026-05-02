import type { TianGan, DiZhi, Zhu, BaZi } from '../types'
import {
  TIAN_GAN, DI_ZHI, GAN_WU_XING,
  WU_HU_DUN, WU_SHU_DUN,
} from '../data/bazi'
import { getSolarTermDates } from '../data/jieqi'

/**
 * 根据日期确定月柱地支（以节气为界）
 *
 * 月建规则（以节为界）：
 *   寅月 立春 → 惊蛰   卯月 惊蛰 → 清明   辰月 清明 → 立夏
 *   巳月 立夏 → 芒种   午月 芒种 → 小暑   未月 小暑 → 立秋
 *   申月 立秋 → 白露   酉月 白露 → 寒露   戌月 寒露 → 立冬
 *   亥月 立冬 → 大雪   子月 大雪 → 小寒   丑月 小寒 → 立春
 *
 * 节气索引与月地支对照：
 *   0=立春→寅, 2=惊蛰→卯, 4=清明→辰, 6=立夏→巳,
 *   8=芒种→午, 10=小暑→未, 12=立秋→申, 14=白露→酉,
 *   16=寒露→戌, 18=立冬→亥, 20=大雪→子, 22=小寒→丑
 */
function calcMonthZhi(date: Date): DiZhi {
  const year = date.getFullYear()
  const terms = getSolarTermDates(year)

  // 将上一年最后两个节气（小寒、大寒）也纳入，用于判断丑月
  const prevYearTerms = getSolarTermDates(year - 1)
  const prevYearsLastTwo = prevYearTerms.filter(t => t.index >= 22)

  const allTerms = [...prevYearsLastTwo, ...terms]
  allTerms.sort((a, b) => {
    // 跨年排序
    const aDays = (a.month === 1 && a.index >= 22 ? 0 : a.month) * 31 + a.day
    const bDays = (b.month === 1 && b.index >= 22 ? 0 : b.month) * 31 + b.day
    return aDays - bDays
  })

  const m = date.getMonth() + 1
  const d = date.getDate()
  const h = date.getHours()

  // 找到 date 所在的节气区间
  let currentTermIdx = -1
  for (let i = 0; i < allTerms.length; i++) {
    const t = allTerms[i]
    if (t.month < m || (t.month === m && t.day < d) || (t.month === m && t.day === d && t.hour <= h)) {
      currentTermIdx = i
    } else {
      break
    }
  }

  // 月的节气索引（只取节：立春、惊蛰、清明、立夏、芒种、小暑、立秋、白露、寒露、立冬、大雪、小寒）
  const MONTH_TERM_INDICES = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22]
  const MONTH_ZHI: DiZhi[] = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑']

  if (currentTermIdx >= 0 && currentTermIdx < allTerms.length) {
    const currentTerm = allTerms[currentTermIdx]
    const idxInMonth = MONTH_TERM_INDICES.indexOf(currentTerm.index)
    if (idxInMonth >= 0) {
      return MONTH_ZHI[idxInMonth]
    }
    // 当前节气不是"节"（可能是中气），向前找最近的"节"
    for (let j = currentTermIdx; j >= 0; j--) {
      const idxInMonth2 = MONTH_TERM_INDICES.indexOf(allTerms[j].index)
      if (idxInMonth2 >= 0) {
        return MONTH_ZHI[idxInMonth2]
      }
    }
  }

  // 默认 fallback（极少数边界情况）
  // 如果在第一个节之前，用丑月
  return '丑'
}

/**
 * 计算年柱
 * 甲子年对应公历年份的规律: 1984 = 甲子年
 * 年以立春为界（使用精确节气计算）
 */
function calcYearPillar(year: number, month: number, day: number, hour?: number): Zhu {
  // 使用精确节气判断立春
  let realYear = year
  try {
    const terms = getSolarTermDates(year)
    const liChun = terms.find(t => t.index === 0)
    if (liChun) {
      // 若当前时间在立春之前，则年柱为上一年
      const beforeLiChun =
        month < liChun.month ||
        (month === liChun.month && day < liChun.day) ||
        (month === liChun.month && day === liChun.day && hour !== undefined && hour < liChun.hour)
      if (beforeLiChun) {
        realYear = year - 1
      }
    } else {
      // fallback: 硬编码 2月4日（仅当节气数据获取失败时使用）
      if (month < 2 || (month === 2 && day < 4)) {
        realYear = year - 1
      }
    }
  } catch {
    // fallback: 硬编码 2月4日（仅当节气计算异常时使用）
    if (month < 2 || (month === 2 && day < 4)) {
      realYear = year - 1
    }
  }

  const ganIdx = (realYear - 4) % 10
  const zhiIdx = (realYear - 4) % 12
  const gan = TIAN_GAN[(ganIdx + 10) % 10]
  const zhi = DI_ZHI[(zhiIdx + 12) % 12]

  return { gan, zhi, wuxing: GAN_WU_XING[gan] }
}

/**
 * 计算月柱（五虎遁 + 节气定月）
 *
 * @param yearGan 年柱天干
 * @param date 当前日期（用于根据节气确定月地支）
 */
function calcMonthPillar(yearGan: TianGan, date: Date): Zhu {
  const zhi = calcMonthZhi(date)
  // 月地支索引（从寅=0 开始）
  const zhiIdx = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'].indexOf(zhi)
  // 五虎遁定月干
  const startGan = WU_HU_DUN[yearGan]
  const startGanIdx = TIAN_GAN.indexOf(startGan)
  const ganIdx = (startGanIdx + zhiIdx) % 10
  const gan = TIAN_GAN[ganIdx]

  return { gan, zhi, wuxing: GAN_WU_XING[gan] }
}

/**
 * 计算日柱
 * 使用基准日期法: 1900-01-01 = 甲戌日(干支索引: 10, 10)
 * 天干索引: 甲=0, 乙=1...
 * 地支索引: 子=0, 丑=1...
 *
 * 注意：在农历中，日柱以子时（23:00）为界，
 * 23:00 之后属于次日的日柱。
 */
function calcDayPillar(year: number, month: number, day: number, hour?: number): Zhu {
  // 子时 (23:00-23:59) 属于下一日
  let adjustedYear = year
  let adjustedMonth = month
  let adjustedDay = day
  if (hour !== undefined && hour >= 23) {
    adjustedDay += 1
    const daysInMonth = new Date(year, month, 0).getDate()
    if (adjustedDay > daysInMonth) {
      adjustedDay = 1
      adjustedMonth += 1
      if (adjustedMonth > 12) {
        adjustedMonth = 1
        adjustedYear += 1
      }
    }
  }

  // 基准: 1900-01-01 = 甲戌日 (天干索引10→甲, 地支索引10→戌)
  // 实际上 1900-01-01 是甲戌日, ganIdx=10%10=0=甲, zhiIdx=10%12=10=戌
  const baseDate = new Date(1900, 0, 1) // Jan 1, 1900
  const targetDate = new Date(adjustedYear, adjustedMonth - 1, adjustedDay)
  const diffDays = Math.round((targetDate.getTime() - baseDate.getTime()) / 86400000)

  const ganIdx = ((diffDays % 10) + 10) % 10
  const zhiIdx = ((diffDays + 10) % 12 + 12) % 12

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

  const nian = calcYearPillar(year, month, day, hour)
  const yue = calcMonthPillar(nian.gan, date)
  const ri = calcDayPillar(year, month, day, hour)
  const shi = calcHourPillar(ri.gan, hour)

  return { nian, yue, ri, shi }
}

/** 格式化八字为字符串 */
export function formatBaZi(bazi: BaZi): string {
  return `${bazi.nian.gan}${bazi.nian.zhi}年 ${bazi.yue.gan}${bazi.yue.zhi}月 ${bazi.ri.gan}${bazi.ri.zhi}日 ${bazi.shi.gan}${bazi.shi.zhi}时`
}
