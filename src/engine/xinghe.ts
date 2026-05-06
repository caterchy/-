import type { DiZhi, HeResult, XingResult, ChongResult } from '../types'

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
 * 返回全部六条六合规则，标记与 activeZhis 相关的条目
 *
 * @param activeZhis 日辰、月辰、动爻、世应等涉及的地支集合
 * @returns 全部六合规则数组
 */
export function calcHe(activeZhis: Set<DiZhi>): HeResult[] {
  return HE_RULES.map(rule => ({
    name: `${rule.z1}${rule.z2}合`,
    wuxing: rule.wuxing,
    zhis: [rule.z1, rule.z2],
    description: rule.description,
    active: activeZhis.has(rule.z1) || activeZhis.has(rule.z2),
  }))
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
 * 返回全部三刑组和自刑条目，标记与 activeZhis 相关的条目
 *
 * @param activeZhis 日辰、月辰、动爻、世应等涉及的地支集合
 * @returns 全部三刑规则数组
 */
export function calcXing(activeZhis: Set<DiZhi>): XingResult[] {
  const results: XingResult[] = []

  for (const group of XING_GROUPS) {
    results.push({
      name: group.name,
      zhis: [...group.zhis],
      description: group.description,
      active: group.zhis.some(z => activeZhis.has(z)),
    })
  }

  for (const rule of ZI_XING_RULES) {
    // 不用去重，每个自刑地支独立展示
    results.push({
      name: '自刑',
      zhis: [rule.zhi],
      description: rule.description,
      active: activeZhis.has(rule.zhi),
    })
  }

  return results
}

/**
 * 六冲规则
 */
const CHONG_RULES: { z1: DiZhi; z2: DiZhi; description: string }[] = [
  { z1: '子', z2: '午', description: '子午相冲' },
  { z1: '丑', z2: '未', description: '丑未相冲' },
  { z1: '寅', z2: '申', description: '寅申相冲' },
  { z1: '卯', z2: '酉', description: '卯酉相冲' },
  { z1: '辰', z2: '戌', description: '辰戌相冲' },
  { z1: '巳', z2: '亥', description: '巳亥相冲' },
]

/**
 * 计算六冲
 *
 * @param activeZhis 日辰、月辰、动爻、世应等涉及的地支集合
 * @returns 全部六冲规则数组
 */
export function calcChong(activeZhis: Set<DiZhi>): ChongResult[] {
  return CHONG_RULES.map(rule => ({
    name: `${rule.z1}${rule.z2}冲`,
    z1: rule.z1,
    z2: rule.z2,
    description: rule.description,
    active: activeZhis.has(rule.z1) || activeZhis.has(rule.z2),
  }))
}
