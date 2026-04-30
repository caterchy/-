import type { BaGua, TianGan, DiZhi } from '../types'

/**
 * 纳甲规则: 八卦纳天干
 * 阳卦纳阳干，阴卦纳阴干
 * 乾纳甲壬，坤纳乙癸，其余各纳一干
 */
export const GUA_NA_GAN: Record<BaGua, { inner: TianGan; outer: TianGan }> = {
  '乾': { inner: '甲', outer: '壬' },
  '兑': { inner: '丁', outer: '丁' },
  '离': { inner: '己', outer: '己' },
  '震': { inner: '庚', outer: '庚' },
  '巽': { inner: '辛', outer: '辛' },
  '坎': { inner: '戊', outer: '戊' },
  '艮': { inner: '丙', outer: '丙' },
  '坤': { inner: '乙', outer: '癸' },
}

/**
 * 纳支规则: 八卦纳地支
 * 阳卦顺行(子寅辰午申戌)，阴卦逆行(丑亥酉未巳卯)
 * 内卦从初爻开始，外卦从四爻开始
 */
export const GUA_NA_ZHI: Record<BaGua, { inner: [DiZhi, DiZhi, DiZhi]; outer: [DiZhi, DiZhi, DiZhi] }> = {
  '乾': { inner: ['子', '寅', '辰'], outer: ['午', '申', '戌'] },
  '兑': { inner: ['巳', '卯', '丑'], outer: ['亥', '酉', '未'] },
  '离': { inner: ['卯', '丑', '亥'], outer: ['酉', '未', '巳'] },
  '震': { inner: ['子', '寅', '辰'], outer: ['午', '申', '戌'] },
  '巽': { inner: ['丑', '亥', '酉'], outer: ['未', '巳', '卯'] },
  '坎': { inner: ['寅', '辰', '午'], outer: ['申', '戌', '子'] },
  '艮': { inner: ['辰', '午', '申'], outer: ['戌', '子', '寅'] },
  '坤': { inner: ['未', '巳', '卯'], outer: ['丑', '亥', '酉'] },
}

/** 地支对应的五行 */
export const ZHI_WU_XING_NAJA: Record<DiZhi, '金' | '木' | '水' | '火' | '土'> = {
  '子': '水', '丑': '土',
  '寅': '木', '卯': '木',
  '辰': '土', '巳': '火',
  '午': '火', '未': '土',
  '申': '金', '酉': '金',
  '戌': '土', '亥': '水',
}

/** 天干对应的五行 */
export const GAN_WU_XING_NAJA: Record<TianGan, '金' | '木' | '水' | '火' | '土'> = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水',
}
