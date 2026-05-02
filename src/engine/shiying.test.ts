import { describe, it, expect } from 'vitest'
import { getShiYing } from './shiying'

describe('getShiYing', () => {
  it.each([
    [0, 6, 3],
    [1, 1, 4],
    [2, 2, 5],
    [3, 3, 6],
    [4, 4, 1],
    [5, 5, 2],
    [6, 4, 1],
    [7, 3, 6],
  ])('palacePos %i returns shi=%i ying=%i', (pos, shi, ying) => {
    expect(getShiYing(pos)).toEqual({ shi, ying })
  })

  it('returns default [6,3] for invalid palacePos', () => {
    expect(getShiYing(8)).toEqual({ shi: 6, ying: 3 })
    expect(getShiYing(-1)).toEqual({ shi: 6, ying: 3 })
  })
})
