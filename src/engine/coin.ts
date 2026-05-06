import type { Yao, YaoType } from '../types'

/** 掷三枚硬币一次，返回爻 */
export function tossCoin(): Yao {
  const values = [
    randomCoin(),
    randomCoin(),
    randomCoin(),
  ]
  const yangCount = values.filter(Boolean).length // 正面(阳)数量
  return getYaoFromCount(yangCount)
}

/** 随机一枚硬币：true=正(阳)，false=反(阴) */
function randomCoin(): boolean {
  return Math.random() < 0.5
}

/** 根据正面数量确定爻 */
function getYaoFromCount(yangCount: number): Yao {
  switch (yangCount) {
    case 3: // 三正 → 老阴(变)
      return { yang: false, changing: true, type: '老阴' }
    case 2: // 二正一反 → 少阳(不变)
      return { yang: true, changing: false, type: '少阳' }
    case 1: // 一正二反 → 少阴(不变)
      return { yang: false, changing: false, type: '少阴' }
    case 0: // 三反 → 老阳(变)
    default:
      return { yang: true, changing: true, type: '老阳' }
  }
}

/** 自动起卦：一次生成6个爻（从初爻到上爻） */
export function autoCast(): Yao[] {
  const yaos: Yao[] = []
  for (let i = 0; i < 6; i++) {
    yaos.push(tossCoin())
  }
  return yaos
}

/** 手动起卦：逐个添加爻 */
export function manualCast(yangCount: number): Yao {
  return getYaoFromCount(yangCount)
}

/** 从6个爻计算变卦后的爻 */
export function getChangedYaos(yaos: Yao[]): Yao[] {
  return yaos.map(y => {
    if (y.type === '老阳') {
      return { yang: false, changing: false, type: '少阴' as YaoType }
    }
    if (y.type === '老阴') {
      return { yang: true, changing: false, type: '少阳' as YaoType }
    }
    return { ...y }
  })
}

/** 从爻序列得到二进制编码(从下到上, 阳=1阴=0) */
export function yaosToCode(yaos: Yao[]): string {
  return yaos.map(y => (y.yang ? '1' : '0')).join('')
}
