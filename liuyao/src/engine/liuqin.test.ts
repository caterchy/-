import { describe, it, expect } from 'vitest'
import { getLiuQin } from './liuqin'

describe('getLiuQin', () => {
  it('same wuxing returns 兄弟', () => {
    expect(getLiuQin('金', '金')).toBe('兄弟')
    expect(getLiuQin('木', '木')).toBe('兄弟')
    expect(getLiuQin('水', '水')).toBe('兄弟')
    expect(getLiuQin('火', '火')).toBe('兄弟')
    expect(getLiuQin('土', '土')).toBe('兄弟')
  })

  it('生我 (gong is sheng by yao) returns 父母', () => {
    // 土生金 → 金为gong, 土为yao
    expect(getLiuQin('金', '土')).toBe('父母')
    // 水生木
    expect(getLiuQin('木', '水')).toBe('父母')
    // 木生火
    expect(getLiuQin('火', '木')).toBe('父母')
    // 火生土
    expect(getLiuQin('土', '火')).toBe('父母')
    // 金生水
    expect(getLiuQin('水', '金')).toBe('父母')
  })

  it('我生 (gong sheng yao) returns 子孙', () => {
    // 金生水
    expect(getLiuQin('金', '水')).toBe('子孙')
    // 水生木
    expect(getLiuQin('水', '木')).toBe('子孙')
    // 木生火
    expect(getLiuQin('木', '火')).toBe('子孙')
    // 火生土
    expect(getLiuQin('火', '土')).toBe('子孙')
    // 土生金
    expect(getLiuQin('土', '金')).toBe('子孙')
  })

  it('克我 (yao ke gong) returns 官鬼', () => {
    // 火克金
    expect(getLiuQin('金', '火')).toBe('官鬼')
    // 金克木
    expect(getLiuQin('木', '金')).toBe('官鬼')
    // 木克土
    expect(getLiuQin('土', '木')).toBe('官鬼')
    // 土克水
    expect(getLiuQin('水', '土')).toBe('官鬼')
    // 水克火
    expect(getLiuQin('火', '水')).toBe('官鬼')
  })

  it('我克 (gong ke yao) returns 妻财', () => {
    // 金克木
    expect(getLiuQin('金', '木')).toBe('妻财')
    // 木克土
    expect(getLiuQin('木', '土')).toBe('妻财')
    // 土克水
    expect(getLiuQin('土', '水')).toBe('妻财')
    // 水克火
    expect(getLiuQin('水', '火')).toBe('妻财')
    // 火克金
    expect(getLiuQin('火', '金')).toBe('妻财')
  })
})
