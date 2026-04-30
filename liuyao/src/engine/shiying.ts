/**
 * 根据卦在宫中的位置确定世应位置
 */

/** 世应规则: [世爻位置, 应爻位置] (1=初爻 ... 6=上爻) */
const SHI_YING_RULES: Record<number, [number, number]> = {
  0: [6, 3],  // 纯卦: 世六 应三
  1: [1, 4],  // 一世: 世初 应四
  2: [2, 5],  // 二世: 世二 应五
  3: [3, 6],  // 三世: 世三 应六
  4: [4, 1],  // 四世: 世四 应初
  5: [5, 2],  // 五世: 世五 应二
  6: [4, 1],  // 游魂: 世四 应初
  7: [3, 6],  // 归魂: 世三 应六
}

export function getShiYing(palacePos: number): { shi: number; ying: number } {
  const rule = SHI_YING_RULES[palacePos]
  if (!rule) {
    return { shi: 6, ying: 3 }
  }
  return { shi: rule[0], ying: rule[1] }
}
