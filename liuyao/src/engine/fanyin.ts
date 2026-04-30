import type { DiZhi, FanYinFuYin } from '../types'
import { DI_ZHI_LIU_CHONG } from '../data/bazi'

/**
 * 检测反吟伏吟
 */
export function detectFanYinFuYin(
  originalZhis: DiZhi[],
  changedZhis: DiZhi[],
  originalName: string,
  changedName: string,
): FanYinFuYin | null {
  // 伏吟: 变卦与本卦相同
  if (originalName === changedName) {
    return { type: '伏吟', description: '变卦与本卦相同，为伏吟之象' }
  }

  // 反吟: 上下卦地支相冲
  // 上卦(4-6爻)和下卦(1-3爻)各自对冲
  const lowerOriginal = originalZhis.slice(0, 3)
  const lowerChanged = changedZhis.slice(0, 3)
  const upperOriginal = originalZhis.slice(3, 6)
  const upperChanged = changedZhis.slice(3, 6)

  const allChong = originalZhis.every((zhi, i) => {
    return DI_ZHI_LIU_CHONG[zhi] === changedZhis[i]
  })

  const upperChong = upperOriginal.every((zhi, i) => {
    return DI_ZHI_LIU_CHONG[zhi] === upperChanged[i]
  })

  const lowerChong = lowerOriginal.every((zhi, i) => {
    return DI_ZHI_LIU_CHONG[zhi] === lowerChanged[i]
  })

  if (allChong) {
    return { type: '反吟', description: '变卦与本卦全部相冲，为大反吟之象' }
  }

  if (upperChong && lowerChong) {
    return { type: '反吟', description: '变卦上下卦均与本卦对冲，为反吟之象' }
  }

  if (upperChong || lowerChong) {
    return {
      type: '反吟',
      description: `${upperChong ? '上卦' : '下卦'}与本卦${upperChong ? '上卦' : '下卦'}对冲，为反吟之象`,
    }
  }

  return null
}
