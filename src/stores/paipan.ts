import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PaipanResult, PaipanNote, DisplayOptions } from '../types'

const STORAGE_KEY = 'liuyao-history'
const MAX_HISTORY = 100

export const usePaipanStore = defineStore('paipan', () => {
  const currentResult = ref<PaipanResult | null>(null)
  const history = ref<PaipanResult[]>([])
  const displayOptions = ref<DisplayOptions>({
    showSanhe: true,
    showHe: false,
    showXing: false,
    showChong: false,
    showGuaci: true,
    showFanyin: true,
    showShensha: true,
    showKongwang: true,
    showFuShen: true,
    showWangShuai: true,
    showAnDong: true,
  })

  /** 加载历史记录 */
  function loadHistory() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        // 转换日期字符串为Date对象，并处理旧版string类型note
        history.value = parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
          note: item.note && typeof item.note === 'string'
            ? { question: item.note, result: '', tags: [] }
            : item.note,
        }))
      }
    } catch {
      history.value = []
    }
  }

  /** 保存历史记录 */
  function saveHistory() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history.value.slice(0, MAX_HISTORY)))
    } catch {
      // localStorage 可能超出配额
    }
  }

  /** 设置当前排盘结果 */
  function setResult(result: PaipanResult) {
    currentResult.value = result
  }

  /** 保存到历史 */
  function saveToHistory(result: PaipanResult) {
    // 检查是否已存在
    const idx = history.value.findIndex(h => h.id === result.id)
    if (idx !== -1) {
      history.value[idx] = result
    } else {
      history.value.unshift(result)
    }
    saveHistory()
  }

  /** 删除历史记录 */
  function deleteHistory(id: string) {
    history.value = history.value.filter(h => h.id !== id)
    saveHistory()
  }

  /** 清空所有历史 */
  function clearHistory() {
    history.value = []
    saveHistory()
  }

  /** 获取历史中的某条记录 */
  function getHistoryById(id: string): PaipanResult | undefined {
    return history.value.find(h => h.id === id)
  }

  /** 更新当前结果的备注 */
  function updateNote(note: PaipanNote) {
    if (currentResult.value) {
      currentResult.value = { ...currentResult.value, note }
      saveToHistory(currentResult.value)
    }
  }

  /** 更新显示选项 */
  function updateDisplayOptions(options: Partial<DisplayOptions>) {
    displayOptions.value = { ...displayOptions.value, ...options }
  }

  const historyCount = computed(() => history.value.length)

  // 初始化时加载历史
  loadHistory()

  return {
    currentResult,
    history,
    displayOptions,
    historyCount,
    setResult,
    saveToHistory,
    saveHistory,
    updateNote,
    deleteHistory,
    clearHistory,
    getHistoryById,
    updateDisplayOptions,
  }
})
