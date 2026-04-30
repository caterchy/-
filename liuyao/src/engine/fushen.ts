import type { BaGua, YaoDetail, FuShen } from '../types'
import { ALL_HEXAGRAMS } from '../data/hexagrams'
import { GUA_NA_ZHI, ZHI_WU_XING_NAJA } from '../data/naja'
import { GUA_WU_XING } from '../data/bazi'
import { getLiuQin } from './liuqin'

/**
 * 计算伏神: 以宫卦（纯卦）的各爻六亲为伏神
 * 每爻的伏神 = 该爻位在宫卦中所对应的六亲
 */
export function calcFuShen(palace: BaGua, yaos: YaoDetail[]): FuShen[] {
  const palaceHex = ALL_HEXAGRAMS.find(h => h.palace === palace && h.palacePos === 0)
  if (!palaceHex) return []

  const gongWuxing = GUA_WU_XING[palaceHex.palace]
  const zhiInner = GUA_NA_ZHI[palaceHex.lower].inner
  const zhiOuter = GUA_NA_ZHI[palaceHex.upper].outer
  const allZhis = [...zhiInner, ...zhiOuter]

  return yaos.map((_y, i) => {
    const palaceWuxing = ZHI_WU_XING_NAJA[allZhis[i]]
    const palaceLiuqin = getLiuQin(gongWuxing, palaceWuxing)
    return { liuqin: palaceLiuqin, zhi: allZhis[i], wuxing: palaceWuxing }
  })
}
