import type { DiZhi, HeResult, XingResult } from '../types'

/**
 * 六合规则
 * 子丑合土、寅亥合木、卯戌合火、辰酉合金、巳申合水、午未合土
 */
const HE_RULES: { z1: DiZhi; z2: DiZhi; wuxing: string; description: string }[] = [
  { z1: '子', z2: '丑', wuxing: '土', description: '子丑合土' },
  { z1: '寅', z2: '亥', wuxing: '木', description: '寅亥合木' },
  { z1: '卯', z2: '戌', wuxing: '火', description: '卯戌合火' },
  { z1: '辰', z2: '酉', wuxing: '金', description: '辰酉合金' },
  { z1: '巳', z2: '申', wuxing: '水', description: '巳申合水' },
  { z1: '午', z2: '未', wuxing: '土', description: '午未合土' },
]

/**
 * 计算六合
 *
 * 六合规则：
 *   子丑合土、寅亥合木、卯戌合火、辰酉合金、巳申合水、午未合土
 *
 * @param zhis 所有爻的地支列表
 * @returns 匹配到的六合结果数组
 */
export function calcHe(zhis: DiZhi[]): HeResult[] {
  const results: HeResult[] = []

  for (const rule of HE_RULES) {
    if (zhis.includes(rule.z1) && zhis.includes(rule.z2)) {
      results.push({
        name: `${rule.z1}${rule.z2}合`,
        wuxing: rule.wuxing,
        zhis: [rule.z1, rule.z2],
        description: rule.description,
      })
    }
  }

  return results
}

/**
 * 三刑规则
 */
const XING_GROUPS: { name: string; zhis: DiZhi[]; description: string }[] = [
  {
    name: '无恩之刑',
    zhis: ['寅', '巳', '申'],
    description: '寅刑巳上巳刑申，申刑寅上总无情',
  },
  {
    name: '恃势之刑',
    zhis: ['丑', '戌', '未'],
    description: '丑刑戌上戌刑未，未刑丑上势不均',
  },
  {
    name: '无礼之刑',
    zhis: ['子', '卯'],
    description: '子刑卯上卯刑子，无礼相欺祸自临',
  },
]

/**
 * 自刑规则
 */
const ZI_XING_RULES: { zhi: DiZhi; description: string }[] = [
  { zhi: '辰', description: '辰午酉亥自相刑' },
  { zhi: '午', description: '辰午酉亥自相刑' },
  { zhi: '酉', description: '辰午酉亥自相刑' },
  { zhi: '亥', description: '辰午酉亥自相刑' },
]

/**
 * 计算三刑
 *
 * 三刑规则：
 *   无恩之刑：寅刑巳、巳刑申、申刑寅（循环）
 *   恃势之刑：丑刑戌、戌刑未、未刑丑（循环）
 *   无礼之刑：子刑卯、卯刑子
 *   自刑：辰刑辰、午刑午、酉刑酉、亥刑亥
 *
 * @param zhis 所有爻的地支列表
 * @returns 匹配到的三刑结果数组
 */
export function calcXing(zhis: DiZhi[]): XingResult[] {
  const results: XingResult[] = []

  // 检查三刑组（无恩、恃势、无礼）：组内至少出现2个地支即构成刑
  for (const group of XING_GROUPS) {
    const matchedZhis = group.zhis.filter(z => zhis.includes(z))
    if (matchedZhis.length >= 2) {
      results.push({
        name: group.name,
        zhis: matchedZhis,
        description: group.description,
      })
    }
  }

  // 检查自刑：同一地支出现2次或以上
  for (const rule of ZI_XING_RULES) {
    const count = zhis.filter(z => z === rule.zhi).length
    if (count >= 2) {
      // 避免重复添加同一口诀
      if (!results.some(r => r.name === '自刑' && r.zhis[0] === rule.zhi)) {
        results.push({
          name: '自刑',
          zhis: [rule.zhi, rule.zhi],
          description: rule.description,
        })
      }
    }
  }

  return results
}
