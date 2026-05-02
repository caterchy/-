import type { BaGua } from '../types'

/** 梅花易数：余数(0-7) → 八卦（1乾2兑3离4震5巽6坎7艮8坤→0） */
export const REMAINDER_TO_TRIGRAM: BaGua[] = [
  '坤', '乾', '兑', '离', '震', '巽', '坎', '艮',
]

/** 时辰地支索引（子=0, 丑=1, ..., 亥=11） */
export const SHI_CHEN_INDEX: Record<string, number> = {
  '子': 0, '丑': 1, '寅': 2, '卯': 3,
  '辰': 4, '巳': 5, '午': 6, '未': 7,
  '申': 8, '酉': 9, '戌': 10, '亥': 11,
}

/** 根据小时数(0-23)获取时辰地支索引 */
export function getHourShiChenIndex(hour: number): number {
  const map: Record<number, number> = {
    23: 0, 0: 0,
    1: 1, 2: 1,
    3: 2, 4: 2,
    5: 3, 6: 3,
    7: 4, 8: 4,
    9: 5, 10: 5,
    11: 6, 12: 6,
    13: 7, 14: 7,
    15: 8, 16: 8,
    17: 9, 18: 9,
    19: 10, 20: 10,
    21: 11, 22: 11,
  }
  return map[hour] ?? 0
}
