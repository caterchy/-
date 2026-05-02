import type { DiZhi, YaoDetail, FanYinFuYin } from '../types'
import { DI_ZHI_LIU_CHONG } from '../data/bazi'

/**
 * 检测反吟伏吟
 *
 * 伏吟: 动爻所属半卦（上三爻/下三爻）的地支未发生变化
 * 反吟: 动爻所属半卦的地支全部变为互冲关系
 */
export function detectFanYinFuYin(
  originalYaos: YaoDetail[],
  changedYaos: YaoDetail[],
): FanYinFuYin | null {
  const descriptions: string[] = []

  // 下卦（初爻到三爻，索引 0-2）是否有动爻
  const lowerMoving = originalYaos.slice(0, 3).some(y => y.yao.changing)
  // 上卦（四爻到上爻，索引 3-5）是否有动爻
  const upperMoving = originalYaos.slice(3, 6).some(y => y.yao.changing)

  const originalLowerZhis = originalYaos.slice(0, 3).map(y => y.najia.zhi)
  const changedLowerZhis = changedYaos.slice(0, 3).map(y => y.najia.zhi)
  const originalUpperZhis = originalYaos.slice(3, 6).map(y => y.najia.zhi)
  const changedUpperZhis = changedYaos.slice(3, 6).map(y => y.najia.zhi)

  // 伏吟: 动爻所在半卦地支不变
  if (lowerMoving && zhiArraysEqual(originalLowerZhis, changedLowerZhis)) {
    descriptions.push('下卦伏吟')
  }
  if (upperMoving && zhiArraysEqual(originalUpperZhis, changedUpperZhis)) {
    descriptions.push('上卦伏吟')
  }

  // 反吟: 动爻所在半卦地支变为互冲
  if (lowerMoving && zhiArraysChong(originalLowerZhis, changedLowerZhis)) {
    descriptions.push('下卦反吟')
  }
  if (upperMoving && zhiArraysChong(originalUpperZhis, changedUpperZhis)) {
    descriptions.push('上卦反吟')
  }

  if (descriptions.length === 0) return null

  const type = descriptions.some(d => d.includes('反吟')) ? '反吟' : '伏吟'
  return { type, description: descriptions.join('；') }
}

function zhiArraysEqual(a: DiZhi[], b: DiZhi[]): boolean {
  return a.every((z, i) => z === b[i])
}

function zhiArraysChong(a: DiZhi[], b: DiZhi[]): boolean {
  return a.every((z, i) => DI_ZHI_LIU_CHONG[z] === b[i])
}
