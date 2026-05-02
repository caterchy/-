import type { YaoDetail, BaZi } from '../types'

/** 地支六冲映射 */
const LIU_CHONG: Record<string, string> = {
  '子': '午', '丑': '未', '寅': '申', '卯': '酉',
  '辰': '戌', '巳': '亥', '午': '子', '未': '丑',
  '申': '寅', '酉': '卯', '戌': '辰', '亥': '巳',
}

/**
 * 检测暗动/月破/日破
 *
 * 本卦规则：
 *   月冲 → 月破
 *   日冲+旺相(旺/相) → 暗动
 *   日冲+休囚(休/囚/死) → 日破
 *
 * 变卦规则（isChanged=true）：
 *   变卦不出暗动，改为检测日破（六冲日辰）
 *
 * @param yaos 爻位列表（会被原地修改）
 * @param bazi 八字
 * @param isChanged 是否为变卦（变卦不出暗动）
 */
export function detectAnDong(yaos: YaoDetail[], bazi: BaZi, isChanged: boolean = false): void {
  if (isChanged) {
    // 变卦：不标记任何状态（暗动、日破等均不适用）
    for (const yao of yaos) {
      yao.isAnDong = undefined
      yao.anDongReason = undefined
      yao.isRiPo = undefined
      yao.riPoReason = undefined
    }
    return
  }

  // 本卦：原有暗动/月破/日破逻辑
  const monthZhi = bazi.yue.zhi
  const dayZhi = bazi.ri.zhi

  for (const yao of yaos) {
    const yaoZhi = yao.najia.zhi
    // 月冲 → 月破（月破不归入暗动）
    if (LIU_CHONG[yaoZhi] === monthZhi) {
      yao.isAnDong = false
      yao.anDongReason = '月破'
    }
    // 日冲（不与月破同时判断，月破优先级更高）
    else if (LIU_CHONG[yaoZhi] === dayZhi) {
      // 旺相 → 暗动，休囚 → 日破
      yao.isAnDong = true
      yao.anDongReason = (yao.wangshuai === '旺' || yao.wangshuai === '相') ? '日冲' : '日破'
    }
  }
}
