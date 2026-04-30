import type { TianGan, DiZhi, WuXing, BaGua } from '../types'

/** 十天干列表 */
export const TIAN_GAN: TianGan[] = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']

/** 十二地支列表 */
export const DI_ZHI: DiZhi[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

/** 干支对应五行 */
export const GAN_WU_XING: Record<TianGan, WuXing> = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水',
}

/** 地支对应五行 */
export const ZHI_WU_XING: Record<DiZhi, WuXing> = {
  '寅': '木', '卯': '木',
  '巳': '火', '午': '火',
  '辰': '土', '未': '土', '戌': '土', '丑': '土',
  '申': '金', '酉': '金',
  '子': '水', '亥': '水',
}

/** 地支对应生肖 */
export const ZHI_SHENG_XIAO: Record<DiZhi, string> = {
  '子': '鼠', '丑': '牛', '寅': '虎', '卯': '兔',
  '辰': '龙', '巳': '蛇', '午': '马', '未': '羊',
  '申': '猴', '酉': '鸡', '戌': '狗', '亥': '猪',
}

/** 八卦对应五行 */
export const GUA_WU_XING: Record<BaGua, WuXing> = {
  '乾': '金', '兑': '金',
  '离': '火',
  '震': '木', '巽': '木',
  '坎': '水',
  '艮': '土', '坤': '土',
}

/** 五行生克: 生我 */
export const WU_XING_SHENG_WO: Record<WuXing, WuXing> = {
  '金': '土',
  '木': '水',
  '水': '金',
  '火': '木',
  '土': '火',
}

/** 五行生克: 我生 */
export const WU_XING_WO_SHENG: Record<WuXing, WuXing> = {
  '金': '水',
  '木': '火',
  '水': '木',
  '火': '土',
  '土': '金',
}

/** 五行生克: 克我 */
export const WU_XING_KE_WO: Record<WuXing, WuXing> = {
  '金': '火',
  '木': '金',
  '水': '土',
  '火': '水',
  '土': '木',
}

/** 五行生克: 我克 */
export const WU_XING_WO_KE: Record<WuXing, WuXing> = {
  '金': '木',
  '木': '土',
  '水': '火',
  '火': '金',
  '土': '水',
}

/** 地支六合 */
export const DI_ZHI_LIU_HE: Record<DiZhi, DiZhi> = {
  '子': '丑', '丑': '子',
  '寅': '亥', '亥': '寅',
  '卯': '戌', '戌': '卯',
  '辰': '酉', '酉': '辰',
  '巳': '申', '申': '巳',
  '午': '未', '未': '午',
}

/** 地支六冲 */
export const DI_ZHI_LIU_CHONG: Record<DiZhi, DiZhi> = {
  '子': '午', '午': '子',
  '丑': '未', '未': '丑',
  '寅': '申', '申': '寅',
  '卯': '酉', '酉': '卯',
  '辰': '戌', '戌': '辰',
  '巳': '亥', '亥': '巳',
}

/** 地支三合局 */
export const SAN_HE_JU: Record<string, { wuxing: WuXing; zhis: [DiZhi, DiZhi, DiZhi] }> = {
  '申子辰': { wuxing: '水', zhis: ['申', '子', '辰'] },
  '亥卯未': { wuxing: '木', zhis: ['亥', '卯', '未'] },
  '寅午戌': { wuxing: '火', zhis: ['寅', '午', '戌'] },
  '巳酉丑': { wuxing: '金', zhis: ['巳', '酉', '丑'] },
}

/** 旬空映射: 日柱天干 → 空亡地支 */
export const XUN_KONG: Record<string, [DiZhi, DiZhi]> = {
  '甲子': ['戌', '亥'],
  '甲戌': ['申', '酉'],
  '甲申': ['午', '未'],
  '甲午': ['辰', '巳'],
  '甲辰': ['寅', '卯'],
  '甲寅': ['子', '丑'],
}

/** 获取日柱所属旬 */
export function getXun(gan: TianGan, zhi: DiZhi): string | null {
  const ganIdx = TIAN_GAN.indexOf(gan)
  const zhiIdx = DI_ZHI.indexOf(zhi)
  const baseIdx = zhiIdx - (ganIdx % 10)
  const xunBase = baseIdx >= 0 ? baseIdx : baseIdx + 12
  const xunZhi = DI_ZHI[xunBase]
  const key = `${TIAN_GAN[ganIdx]}${xunZhi}`
  return key in XUN_KONG ? key : null
}

/** 五虎遁: 年干 → 正月天干 (月干从寅月开始) */
export const WU_HU_DUN: Record<TianGan, TianGan> = {
  '甲': '丙', // 甲己之年丙作首
  '己': '丙',
  '乙': '戊', // 乙庚之岁戊为头
  '庚': '戊',
  '丙': '庚', // 丙辛之年寻庚上
  '辛': '庚',
  '丁': '壬', // 丁壬壬位顺行流
  '壬': '壬',
  '戊': '甲', // 若问戊癸何方发，甲寅之上好追求
  '癸': '甲',
}

/** 五鼠遁: 日干 → 子时天干 */
export const WU_SHU_DUN: Record<TianGan, TianGan> = {
  '甲': '甲', // 甲己还加甲
  '己': '甲',
  '乙': '丙', // 乙庚丙作初
  '庚': '丙',
  '丙': '戊', // 丙辛从戊起
  '辛': '戊',
  '丁': '庚', // 丁壬庚子居
  '壬': '庚',
  '戊': '壬', // 戊癸何方发，壬子是真途
  '癸': '壬',
}
