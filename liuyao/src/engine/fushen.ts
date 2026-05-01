import type { BaGua, YaoDetail, FuShen } from '../types'
import { ALL_HEXAGRAMS } from '../data/hexagrams'
import { GUA_NA_ZHI, ZHI_WU_XING_NAJA } from '../data/naja'
import { GUA_WU_XING } from '../data/bazi'
import { getLiuQin } from './liuqin'

/**
 * 计算伏神
 * 伏神规则：本卦中未出现的六亲类型，以宫卦（纯卦）对应爻位的六亲为伏神
 */
export function calcFuShen(palace: BaGua, yaos: YaoDetail[]): (FuShen | undefined)[] {
  const palaceHex = ALL_HEXAGRAMS.find(h => h.palace === palace && h.palacePos === 0)
  if (!palaceHex) return []

  const gongWuxing = GUA_WU_XING[palaceHex.palace]
  const zhiInner = GUA_NA_ZHI[palaceHex.lower].inner
  const zhiOuter = GUA_NA_ZHI[palaceHex.upper].outer
  const allZhis = [...zhiInner, ...zhiOuter]

  // 本卦中已有的六亲类型
  const existingLiuqin = new Set(yaos.map(y => y.liuqin))

  return yaos.map((_y, i) => {
    const palaceWuxing = ZHI_WU_XING_NAJA[allZhis[i]]
    const palaceLiuqin = getLiuQin(gongWuxing, palaceWuxing)
    // 只在宫卦六亲类型不在本卦中时标记为伏神
    if (!existingLiuqin.has(palaceLiuqin)) {
      return { liuqin: palaceLiuqin, zhi: allZhis[i], wuxing: palaceWuxing }
    }
    return undefined
  })
}
