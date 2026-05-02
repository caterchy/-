import { describe, it, expect, vi, beforeEach } from 'vitest'
import { tossCoin, autoCast, getChangedYaos, yaosToCode } from './coin'
import type { Yao } from '../types'

describe('tossCoin', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns 老阳 when all 3 are yang (random < 0.5)', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.4)
      .mockReturnValueOnce(0.4)
      .mockReturnValueOnce(0.4)
    expect(tossCoin()).toEqual({ yang: true, changing: true, type: '老阳' })
  })

  it('returns 少阳 when 2 yang, 1 yin', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.4)
      .mockReturnValueOnce(0.4)
      .mockReturnValueOnce(0.6)
    expect(tossCoin()).toEqual({ yang: true, changing: false, type: '少阳' })
  })

  it('returns 少阴 when 1 yang, 2 yin', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.4)
      .mockReturnValueOnce(0.6)
      .mockReturnValueOnce(0.6)
    expect(tossCoin()).toEqual({ yang: false, changing: false, type: '少阴' })
  })

  it('returns 老阴 when all 3 are yin (random >= 0.5)', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.6)
      .mockReturnValueOnce(0.6)
      .mockReturnValueOnce(0.6)
    expect(tossCoin()).toEqual({ yang: false, changing: true, type: '老阴' })
  })
})

describe('autoCast', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns 6 yaos', () => {
    vi.spyOn(Math, 'random')
      // 老阳
      .mockReturnValueOnce(0.4).mockReturnValueOnce(0.4).mockReturnValueOnce(0.4)
      // 少阳
      .mockReturnValueOnce(0.4).mockReturnValueOnce(0.4).mockReturnValueOnce(0.6)
      // 少阴
      .mockReturnValueOnce(0.4).mockReturnValueOnce(0.6).mockReturnValueOnce(0.6)
      // 老阴
      .mockReturnValueOnce(0.6).mockReturnValueOnce(0.6).mockReturnValueOnce(0.6)
      // 少阳
      .mockReturnValueOnce(0.4).mockReturnValueOnce(0.4).mockReturnValueOnce(0.6)
      // 少阴
      .mockReturnValueOnce(0.4).mockReturnValueOnce(0.6).mockReturnValueOnce(0.6)

    const result = autoCast()
    expect(result).toHaveLength(6)
    expect(result[0]).toEqual({ yang: true, changing: true, type: '老阳' })
    expect(result[1]).toEqual({ yang: true, changing: false, type: '少阳' })
    expect(result[2]).toEqual({ yang: false, changing: false, type: '少阴' })
    expect(result[3]).toEqual({ yang: false, changing: true, type: '老阴' })
    expect(result[4]).toEqual({ yang: true, changing: false, type: '少阳' })
    expect(result[5]).toEqual({ yang: false, changing: false, type: '少阴' })
  })
})

describe('getChangedYaos', () => {
  it('transforms 老阳 to 少阴 and 老阴 to 少阳', () => {
    const yaos: Yao[] = [
      { yang: true, changing: true, type: '老阳' },
      { yang: true, changing: false, type: '少阳' },
      { yang: false, changing: false, type: '少阴' },
      { yang: false, changing: true, type: '老阴' },
      { yang: true, changing: true, type: '老阳' },
      { yang: false, changing: true, type: '老阴' },
    ]
    const result = getChangedYaos(yaos)
    expect(result[0]).toEqual({ yang: false, changing: false, type: '少阴' })
    expect(result[1]).toEqual({ yang: true, changing: false, type: '少阳' })
    expect(result[2]).toEqual({ yang: false, changing: false, type: '少阴' })
    expect(result[3]).toEqual({ yang: true, changing: false, type: '少阳' })
    expect(result[4]).toEqual({ yang: false, changing: false, type: '少阴' })
    expect(result[5]).toEqual({ yang: true, changing: false, type: '少阳' })
  })
})

describe('yaosToCode', () => {
  it('converts yaos to 6-bit binary code (bottom to top)', () => {
    const yaos: Yao[] = [
      { yang: true, changing: false, type: '少阳' },   // 初 (bottom)
      { yang: false, changing: false, type: '少阴' },
      { yang: true, changing: false, type: '少阳' },
      { yang: false, changing: false, type: '少阴' },
      { yang: true, changing: false, type: '少阳' },
      { yang: true, changing: false, type: '少阳' },   // 上 (top)
    ]
    expect(yaosToCode(yaos)).toBe('101011')
  })

  it('returns all zeros for all-yin', () => {
    const yaos: Yao[] = Array.from({ length: 6 }, () => ({
      yang: false, changing: false, type: '少阴' as const,
    }))
    expect(yaosToCode(yaos)).toBe('000000')
  })

  it('returns all ones for all-yang', () => {
    const yaos: Yao[] = Array.from({ length: 6 }, () => ({
      yang: true, changing: false, type: '少阳' as const,
    }))
    expect(yaosToCode(yaos)).toBe('111111')
  })
})
