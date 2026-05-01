/**
 * 二十四节气精确计算模块
 *
 * 基于简化版太阳位置算法（Jean Meeus），精度约 ±2 分钟
 * 节气时刻表：立春(315°) 雨水(330°) 惊蛰(345°) 春分(0°) 清明(15°) 谷雨(30°)
 *             立夏(45°) 小满(60°) 芒种(75°) 夏至(90°) 小暑(105°) 大暑(120°)
 *             立秋(135°) 处暑(150°) 白露(165°) 秋分(180°) 寒露(195°) 霜降(210°)
 *             立冬(225°) 小雪(240°) 大雪(255°) 冬至(270°) 小寒(285°) 大寒(300°)
 */

export interface SolarTerm {
  /** 节气名 */
  name: string
  /** 在 24 节气中的序号 (0=立春 ... 23=大寒) */
  index: number
  /** 公历年份 */
  year: number
  /** 月份 (1-12) */
  month: number
  /** 日 */
  day: number
  /** 小时 (0-23) */
  hour: number
  /** 分钟 (0-59) */
  minute: number
}

/** 24 节气名称列表（从立春开始，与农历历法一致） */
export const SOLAR_TERM_NAMES: string[] = [
  '立春', '雨水', '惊蛰', '春分', '清明', '谷雨',
  '立夏', '小满', '芒种', '夏至', '小暑', '大暑',
  '立秋', '处暑', '白露', '秋分', '寒露', '霜降',
  '立冬', '小雪', '大雪', '冬至', '小寒', '大寒',
]

/**
 * 获取 24 节气在黄道上的目标经度（度）
 * @param index 节气索引 (0=立春 ... 23=大寒)
 */
function getTargetLongitude(index: number): number {
  return ((index * 15 + 315) % 360)
}

/**
 * 计算太阳在给定儒略日的地心黄经（度）
 * 使用低精度算法，误差 < 0.01°
 */
function sunLongitude(jd: number): number {
  const t = (jd - 2451545.0) / 36525.0  // 儒略世纪数

  // 太阳平黄经
  const L = 280.46646 + 36000.76983 * t + 0.0003032 * t * t
  // 太阳平近点角
  const M = 357.52911 + 35999.05029 * t - 0.0001537 * t * t

  const Mrad = M * Math.PI / 180
  // 中心差（轨道椭圆修正）
  const C = (1.914602 - 0.004817 * t - 0.000014 * t * t) * Math.sin(Mrad)
    + (0.019993 - 0.000101 * t) * Math.sin(2 * Mrad)
    + 0.000289 * Math.sin(3 * Mrad)

  // 真黄经（忽略黄赤交角和章动修正，精度足够）
  return ((L + C) % 360 + 360) % 360
}

/**
 * 使用牛顿迭代法计算太阳到达目标经度的儒略日
 */
function calcTermJD(year: number, termIndex: number): number {
  const targetLon = getTargetLongitude(termIndex)

  // 初值：该年近似 JD（立春约在 2 月 4 日，每节气约 15.218 天）
  const approxLichunJD = 2451545.0 + 365.25 * (year - 2000) + 3.5 // 约 2 月 4 日
  let jd = approxLichunJD + termIndex * 15.218

  // 迭代精化（5 次足够收敛到 < 1 分钟）
  for (let i = 0; i < 5; i++) {
    const lon = sunLongitude(jd)
    let diff = targetLon - lon
    if (diff > 180) diff -= 360
    if (diff < -180) diff += 360
    // 每度约 365.25/360 天
    jd += diff * 365.25 / 360
  }

  return jd
}

/**
 * 儒略日转公历日期
 */
function jdToDate(jd: number): { year: number; month: number; day: number; hour: number; minute: number } {
  // JD 转 Date 对象（精度到分钟）
  const ms = (jd - 2440587.5) * 86400000
  const d = new Date(ms)

  return {
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    day: d.getDate(),
    hour: d.getHours(),
    minute: d.getMinutes(),
  }
}

/**
 * 获取指定年份的 24 节气精确日期
 * 结果按时间排序（从立春到大寒）
 */
export function getSolarTermDates(year: number): SolarTerm[] {
  const terms: SolarTerm[] = []

  // 本年节气
  for (let i = 0; i < 24; i++) {
    const jd = calcTermJD(year, i)
    const { year: y, month, day, hour, minute } = jdToDate(jd)

    // 如果计算结果落在前一年（年初的节气可能在去年12月），修正年份
    if (y < year) continue
    if (y > year) continue

    // 对于立春前的节气（小寒、大寒），它们属于前一年的节气列表
    // 但我们的索引从立春开始，所以不会出现这个问题

    terms.push({
      name: SOLAR_TERM_NAMES[i],
      index: i,
      year,
      month,
      day,
      hour,
      minute,
    })
  }

  // 补上前一年的大寒和小寒（它们在本年立春之前）
  // 小寒(1月6日左右)和大寒(1月20日左右)发生在立春(2月4日左右)之前
  // 按节气顺序，它们是上一年冬至之后的节气
  // 但我们需要的显示是：对于某年来说，从小寒开始到下一年的立春前
  // 这里我们只计算本年的立春到下一年的立春前

  // 补上本年度立春之前的节气（小寒、大寒属于本年的节气周期）
  // 实际上，从立春开始的 24 节气周期中，小寒和大寒是上一周期的最后两个
  // 但对于公历年份来说，年初（1月）的小寒、大寒是本年气候的一部分
  // 我们额外计算前一年的最后两个节气（小寒、大寒）
  // 索引 22=小寒 285°, 23=大寒 300°
  for (const idx of [22, 23]) {
    const jd = calcTermJD(year, idx)
    // JD 可能小于立春的 JD
    const { year: y, month, day, hour, minute } = jdToDate(jd)
    if (y !== year) continue // 取本年的（可能在1月）
    terms.push({
      name: SOLAR_TERM_NAMES[idx],
      index: idx,
      year,
      month,
      day,
      hour,
      minute,
    })
  }

  // 按时间排序
  terms.sort((a, b) => {
    if (a.month !== b.month) return a.month - b.month
    if (a.day !== b.day) return a.day - b.day
    return a.hour - b.hour
  })

  return terms
}

/**
 * 获取指定日期所处的节气区间
 * 如 2024 年 2 月 10 日 → "立春后"
 */
export function getJieQi(date: Date): string {
  const terms = getSolarTermDates(date.getFullYear())

  const m = date.getMonth() + 1
  const d = date.getDate()
  const h = date.getHours()
  const min = date.getMinutes()

  // 查找最近一个已过的节气
  let current: SolarTerm | null = null
  let next: SolarTerm | null = null

  for (const term of terms) {
    const termMinutes = term.month * 31 * 1440 + term.day * 1440 + term.hour * 60 + term.minute
    const dateMinutes = m * 31 * 1440 + d * 1440 + h * 60 + min

    if (termMinutes <= dateMinutes) {
      current = term
    } else if (next === null) {
      next = term
      break
    }
  }

  if (current) {
    // 计算已过天数
    return `${current.name}后`
  }

  // 在第一个节气之前（本年第一个节气在小寒/大寒之前）
  if (terms.length > 0) {
    return `${terms[0].name}前`
  }
  return ''
}

/**
 * 获取指定日期所在的节气信息
 */
export function getCurrentSolarTerm(date: Date): SolarTerm | null {
  const terms = getSolarTermDates(date.getFullYear())

  const m = date.getMonth() + 1
  const d = date.getDate()
  const h = date.getHours()
  const min = date.getMinutes()
  const dateMinutes = m * 31 * 1440 + d * 1440 + h * 60 + min

  let current: SolarTerm | null = null

  for (const term of terms) {
    const termMinutes = term.month * 31 * 1440 + term.day * 1440 + term.hour * 60 + term.minute
    if (termMinutes <= dateMinutes) {
      current = term
    }
  }

  return current
}

/**
 * 获取指定日期距离当前节气已过天数
 */
export function getDaysSinceSolarTerm(date: Date): number {
  const term = getCurrentSolarTerm(date)
  if (!term) return 0

  const daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

  const termDayOfYear = daysInMonth.slice(0, term.month).reduce((a, b) => a + b, 0) + term.day
  const dateDayOfYear = daysInMonth.slice(0, date.getMonth() + 1).reduce((a, b) => a + b, 0) + date.getDate()

  return dateDayOfYear - termDayOfYear
}
