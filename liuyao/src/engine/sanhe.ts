import type { DiZhi, SanHe } from '../types'
import { SAN_HE_JU } from '../data/bazi'

/**
 * 检测三合局
 * @param zhis 六个爻位的地支列表
 * @returns 如果存在三合局则返回信息，否则null
 */
export function detectSanHe(zhis: DiZhi[]): SanHe | null {
  for (const [key, info] of Object.entries(SAN_HE_JU)) {
    const [z1, z2, z3] = info.zhis
    // 检查三个地支是否都在卦中出现
    const positions: number[] = []

    for (const z of [z1, z2, z3]) {
      const pos = zhis.indexOf(z)
      if (pos !== -1) {
        positions.push(pos + 1) // 1-indexed position
      }
    }

    // 三合局必须三个地支齐全
    if (positions.length === 3) {
      return {
        name: key,
        wuxing: info.wuxing,
        zhis: info.zhis,
        positions,
      }
    }
  }

  return null
}
