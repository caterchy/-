import type { DiZhi, KongWang } from '../types'
import { TIAN_GAN, DI_ZHI, XUN_KONG } from '../data/bazi'

/**
 * 计算空亡：根据日柱确定所属旬，再找空亡地支
 */
export function calcKongWang(dayGan: string, dayZhi: string): KongWang | null {
  const ganIdx = TIAN_GAN.indexOf(dayGan as any)
  const zhiIdx = DI_ZHI.indexOf(dayZhi as any)

  // 旬的判断: 甲子旬从甲子日开始 10天一周期
  // xunStartZhi = 日支索引 - 日干索引 (mod 12)
  const xunStartZhiIdx = ((zhiIdx - ganIdx) % 12 + 12) % 12
  const xunStartZhi = DI_ZHI[xunStartZhiIdx]
  const xunKey = `甲${xunStartZhi}`

  if (xunKey in XUN_KONG) {
    const [zhi1, zhi2] = XUN_KONG[xunKey as keyof typeof XUN_KONG]
    return { xun: xunKey, zhi1, zhi2 }
  }

  return null
}

/** 检查某个地支是否空亡 */
export function isKong(zhi: DiZhi, kongwang: KongWang): boolean {
  return zhi === kongwang.zhi1 || zhi === kongwang.zhi2
}
