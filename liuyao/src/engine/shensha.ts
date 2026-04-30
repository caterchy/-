import type { TianGan, DiZhi, ShenShaType, ShenShaMark } from '../types'
import { getShenShaZhi, getGuiRenZhi } from '../data/deities'

const ALL_SHEN_SHA: ShenShaType[] = ['天乙贵人', '驿马', '桃花', '劫煞', '亡神', '禄神', '羊刃', '文昌', '华盖']

/**
 * 计算爻位的所有神煞
 */
export function calcShenSha(
  riGan: TianGan,
  riZhi: DiZhi,
  yaoZhis: DiZhi[],
): ShenShaMark[] {
  const result: ShenShaMark[] = []

  for (let pos = 0; pos < yaoZhis.length; pos++) {
    const yaoZhi = yaoZhis[pos]
    for (const type of ALL_SHEN_SHA) {
      let zhisToMatch: DiZhi[] = []

      if (type === '天乙贵人') {
        zhisToMatch = getGuiRenZhi(riGan)
      } else {
        zhisToMatch = getShenShaZhi(type, riZhi)
      }

      if (zhisToMatch.includes(yaoZhi)) {
        result.push({ position: pos, type })
      }
    }
  }

  return result
}

/**
 * 获取某爻位对应的神煞列表
 */
export function getShenShaForYao(
  riGan: TianGan,
  riZhi: DiZhi,
  yaoZhi: DiZhi,
): ShenShaType[] {
  const matched: ShenShaType[] = []

  for (const type of ALL_SHEN_SHA) {
    let zhisToMatch: DiZhi[] = []

    if (type === '天乙贵人') {
      zhisToMatch = getGuiRenZhi(riGan)
    } else {
      zhisToMatch = getShenShaZhi(type, riZhi)
    }

    if (zhisToMatch.includes(yaoZhi)) {
      matched.push(type)
    }
  }

  return matched
}
