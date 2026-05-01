import type { BaGua, Yao } from '../types'
import { TRIGRAM_TO_BIN, parseHexagramCode } from '../data/hexagrams'
import { REMAINDER_TO_TRIGRAM, getHourShiChenIndex } from '../data/trigrams'

/** 余数(0-7) → BaGua → 3位二进制 → 3个boolean（从下到上） */
function trigramRemainderToBits(r: number): boolean[] {
  const trigram = REMAINDER_TO_TRIGRAM[r & 7]
  const bin = TRIGRAM_TO_BIN[trigram as BaGua]
  return bin.split('').map(b => b === '1')
}

/** 将6个boolean转为Yao[]（从初爻到上爻），可选指定动爻位置(0-5) */
function bitsToYaos(bits: boolean[], dongPosition?: number | number[]): Yao[] {
  const positions = dongPosition !== undefined
    ? (Array.isArray(dongPosition) ? dongPosition : [dongPosition])
    : []
  return bits.map((bit, i) => {
    const changing = positions.includes(i)
    if (bit) {
      return { yang: true, changing, type: changing ? '老阳' : '少阳' }
    } else {
      return { yang: false, changing, type: changing ? '老阴' : '少阴' }
    }
  })
}

/** 获取汉字笔画数（启发式算法，非真实笔画数）
 *  实际笔画范围 1-36+，此处用 Unicode 编码通过乘数散列映射到 1-30，
 *  使相邻字获得不同的笔画数，分布更均匀
 */
function getStrokeCount(char: string): number {
  const code = char.charCodeAt(0)
  if (code >= 0x4E00 && code <= 0x9FFF) {
    // 使用乘数散列使相邻字的笔画数不同，分布更均匀
    return ((code - 0x4E00) * 13 + 7) % 30 + 1
  }
  return 1
}

/**
 * 时间起卦（使用具体时分秒）
 * @param date 日期时间（含时分秒）
 * 上卦 = (年 + 月 + 日 + 分钟) % 8
 * 下卦 = (年 + 月 + 日 + 时辰索引 + 秒钟) % 8
 * 动爻 = (年 + 月 + 日 + 时辰索引 + 分钟 + 秒钟) % 6
 */
export function divineByTime(date: Date): Yao[] {
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate()
  const hour = date.getHours()
  const min = date.getMinutes()
  const sec = date.getSeconds()
  const shiIndex = getHourShiChenIndex(hour)
  const total = y + m + d + shiIndex + min + sec

  const upperBits = trigramRemainderToBits(y + m + d + min)
  const lowerBits = trigramRemainderToBits(y + m + d + shiIndex + sec)
  const dongPos = total % 6

  return bitsToYaos([...lowerBits, ...upperBits], dongPos)
}

/**
 * 双数起卦
 * @param a 第一个数字 → 上卦
 * @param b 第二个数字 → 下卦
 * (a + b) % 6 → 动爻
 */
export function divineByTwoNumbers(a: number, b: number): Yao[] {
  const upperBits = trigramRemainderToBits(a)
  const lowerBits = trigramRemainderToBits(b)
  const dongPos = (a + b) % 6

  return bitsToYaos([...lowerBits, ...upperBits], dongPos)
}

/**
 * 单数起卦
 * 将数字转为字符串，分成前后两半
 * 前半部分和%8 → 上卦，后半部分和%8 → 下卦
 * 总和%6 → 动爻
 */
export function divineBySingleNumber(n: number): Yao[] {
  const str = String(n)
  const mid = Math.ceil(str.length / 2)
  const firstHalf = str.slice(0, mid)
  const secondHalf = str.slice(mid)

  const sumFirst = firstHalf.split('').reduce((s, c) => s + Number(c), 0)
  const sumSecond = secondHalf.split('').reduce((s, c) => s + Number(c), 0)

  const upperBits = trigramRemainderToBits(sumFirst)
  const lowerBits = trigramRemainderToBits(sumSecond)
  const dongPos = (sumFirst + sumSecond) % 6

  return bitsToYaos([...lowerBits, ...upperBits], dongPos)
}

/**
 * 汉字起卦
 * 将字符串分成前后两半，分别计算笔画总数
 * 前半%8 → 上卦，后半%8 → 下卦
 * 总笔画%6 → 动爻
 */
export function divineByCharacters(text: string): Yao[] {
  const chars = text.split('')
  const mid = Math.ceil(chars.length / 2)
  const firstHalf = chars.slice(0, mid)
  const secondHalf = chars.slice(mid)

  const strokesFirst = firstHalf.reduce((s, c) => s + getStrokeCount(c), 0)
  const strokesSecond = secondHalf.reduce((s, c) => s + getStrokeCount(c), 0)

  const upperBits = trigramRemainderToBits(strokesFirst)
  const lowerBits = trigramRemainderToBits(strokesSecond)
  const dongPos = (strokesFirst + strokesSecond) % 6

  return bitsToYaos([...lowerBits, ...upperBits], dongPos)
}

/**
 * 卦名起卦（直接指定六位二进制码）
 * @param code 六位二进制码（如 '111111' = 乾）
 * @param dongPosition 动爻位置 0-5（undefined = 静卦）
 */
export function divineByHexagram(code: string, dongPosition?: number | number[]): Yao[] {
  const { upper, lower } = parseHexagramCode(code)
  const upperBits = TRIGRAM_TO_BIN[upper].split('').map(b => b === '1')
  const lowerBits = TRIGRAM_TO_BIN[lower].split('').map(b => b === '1')

  return bitsToYaos([...lowerBits, ...upperBits], dongPosition)
}
