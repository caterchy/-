/** 节气数据（简化版，按平均日期近似） */
export interface JieQi {
  name: string
  month: number
  day: number
}

export const JIE_QI: JieQi[] = [
  { name: '小寒', month: 1, day: 6 },
  { name: '大寒', month: 1, day: 20 },
  { name: '立春', month: 2, day: 4 },
  { name: '雨水', month: 2, day: 19 },
  { name: '惊蛰', month: 3, day: 6 },
  { name: '春分', month: 3, day: 21 },
  { name: '清明', month: 4, day: 5 },
  { name: '谷雨', month: 4, day: 20 },
  { name: '立夏', month: 5, day: 6 },
  { name: '小满', month: 5, day: 21 },
  { name: '芒种', month: 6, day: 6 },
  { name: '夏至', month: 6, day: 21 },
  { name: '小暑', month: 7, day: 7 },
  { name: '大暑', month: 7, day: 23 },
  { name: '立秋', month: 8, day: 7 },
  { name: '处暑', month: 8, day: 23 },
  { name: '白露', month: 9, day: 8 },
  { name: '秋分', month: 9, day: 23 },
  { name: '寒露', month: 10, day: 8 },
  { name: '霜降', month: 10, day: 23 },
  { name: '立冬', month: 11, day: 7 },
  { name: '小雪', month: 11, day: 22 },
  { name: '大雪', month: 12, day: 7 },
  { name: '冬至', month: 12, day: 22 },
]

/**
 * 获取指定日期所在的节气区间
 * 如 4月10日 → "清明后"
 */
export function getJieQi(date: Date): string {
  const m = date.getMonth() + 1
  const d = date.getDate()

  // 找到最近的已过节气
  let current: JieQi | null = null
  let next: JieQi | null = null

  for (let i = 0; i < JIE_QI.length; i++) {
    const jq = JIE_QI[i]
    if (jq.month < m || (jq.month === m && jq.day <= d)) {
      current = jq
    } else if (next === null && (jq.month > m || (jq.month === m && jq.day > d))) {
      next = jq
      break
    }
  }

  if (current) {
    return `${current.name}后`
  }
  // 在第一个节气之前
  return `${JIE_QI[0].name}前`
}
