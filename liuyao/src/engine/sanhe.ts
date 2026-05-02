import type { DiZhi, YaoDetail, BaZi, SanHeResult } from '../types'
import { SAN_HE_JU } from '../data/bazi'

const POSITION_NAMES = ['初', '二', '三', '四', '五', '上']

/**
 * 检测三合局（高级版）
 *
 * 规则：
 *   1. 写明什么地支合成什么局 — e.g. "申子辰合水局"
 *   2. 优先写已经形成的局 — completed 优先排在结果数组前面
 *   3. 其他三合局折叠，并写明缺什么 — missingZhis 标明缺失的地支
 *   4. 对于已形成的局要标明来源 — 哪个爻位 / 日辰 / 月辰
 *   5. 来源检查：动爻、旺爻、世应所在爻、日辰、月辰
 *
 * @param yaos 六个爻的完整信息
 * @param bazi 四柱八字（用于日辰、月辰）
 * @param _shiYing 世应信息
 * @returns 三合局结果数组，完整局优先
 */
export function detectSanHe(
  yaos: YaoDetail[],
  bazi: BaZi,
  _shiYing: { shiIndex: number; yingIndex: number }
): SanHeResult[] {
  // 收集所有可能的地支来源
  const allSources: { zhi: DiZhi; source: string }[] = []

  // 从爻位收集（含状态标注）
  for (let i = 0; i < yaos.length; i++) {
    const yao = yaos[i]
    const pos = POSITION_NAMES[i]
    let desc = `${pos}爻`
    const extras: string[] = []
    if (yao.yao.changing) extras.push('动爻')
    if (yao.wangshuai === '旺' || yao.wangshuai === '相') extras.push('旺爻')
    if (yao.isShi) extras.push('世爻')
    if (yao.isYing) extras.push('应爻')
    if (extras.length > 0) desc += `(${extras.join('/')})`
    allSources.push({ zhi: yao.najia.zhi, source: desc })
  }

  // 从日辰收集
  allSources.push({ zhi: bazi.ri.zhi, source: '日辰' })

  // 从月辰收集
  allSources.push({ zhi: bazi.yue.zhi, source: '月辰' })

  const results: SanHeResult[] = []

  for (const [key, info] of Object.entries(SAN_HE_JU)) {
    const [z1, z2, z3] = info.zhis
    const matchedZhis: DiZhi[] = []
    const sources: { zhi: DiZhi; source: string }[] = []

    for (const z of [z1, z2, z3]) {
      const matchingSources = allSources.filter(s => s.zhi === z)
      if (matchingSources.length > 0) {
        matchedZhis.push(z)
        sources.push(...matchingSources)
      }
    }

    const missingZhis: DiZhi[] = [z1, z2, z3].filter(z => !matchedZhis.includes(z))
    const completed = matchedZhis.length === 3

    results.push({
      name: `${key}合${info.wuxing}局`,
      wuxing: info.wuxing,
      completed,
      zhis: [z1, z2, z3],
      matchedZhis,
      missingZhis,
      sources,
    })
  }

  // 排序：已形成的局优先，其余保持原序
  results.sort((a, b) => {
    if (a.completed && !b.completed) return -1
    if (!a.completed && b.completed) return 1
    return 0
  })

  return results
}
