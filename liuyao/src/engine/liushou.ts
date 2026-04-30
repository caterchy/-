import type { TianGan, LiuShen } from '../types'
import { LIU_SHEN_START, LIU_SHEN_ORDER } from '../data/deities'

/**
 * 安六神：按日柱天干定初爻的六神，每爻顺排
 * @param dayGan 日柱天干
 * @param yaoIndex 爻位索引(0=初爻, 5=上爻)
 */
export function getLiuShen(dayGan: TianGan, yaoIndex: number): LiuShen {
  const start = LIU_SHEN_START[dayGan]
  const startIdx = LIU_SHEN_ORDER.indexOf(start)
  return LIU_SHEN_ORDER[(startIdx + yaoIndex) % 6]
}
