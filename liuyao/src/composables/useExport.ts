import type { PaipanResult, Yao, YaoType } from '../types'
import { formatBaZi } from '../engine/bazi'
import { buildPaipanResult } from '../engine/paipan'
import { saveAs } from 'file-saver'

/** 最小化编码：将 6 爻 yang/changing 状态编码为二进制字符串（各 6 位，共 12 字符） */
export function encodeResultToUrl(result: PaipanResult): string {
  const baseUrl = window.location.origin + window.location.pathname
  const yangBits = result.original.yaos.map(y => y.yao.yang ? '1' : '0').join('')
  const changingBits = result.original.yaos.map(y => y.yao.changing ? '1' : '0').join('')
  const timestamp = result.timestamp.toISOString()
  const note = result.note?.question || ''
  return `${baseUrl}?y=${yangBits}&c=${changingBits}&t=${encodeURIComponent(timestamp)}&n=${encodeURIComponent(note)}`
}

/** 从 URL 参数解码排盘结果并重建完整 PaipanResult */
export function decodeResultFromUrl(): PaipanResult | null {
  try {
    const params = new URLSearchParams(window.location.search)

    // 优先尝试新紧凑格式 (?y=&c=&t=)
    const yangBits = params.get('y')
    const changingBits = params.get('c')
    const timestampStr = params.get('t')
    if (yangBits && changingBits && timestampStr && yangBits.length === 6 && changingBits.length === 6) {
      const yaos: Yao[] = yangBits.split('').map((bit, i) => {
        const yang = bit === '1'
        const changing = changingBits[i] === '1'
        const type: YaoType = yang
          ? (changing ? '老阳' : '少阳')
          : (changing ? '老阴' : '少阴')
        return { yang, changing, type }
      })
      const date = new Date(timestampStr)
      const result = buildPaipanResult(yaos, date)
      const noteStr = params.get('n')
      if (noteStr) {
        result.note = { question: noteStr, result: '', tags: [] }
      }
      return result
    }

    // 降级尝试旧格式 (?result=JSON)
    const encoded = params.get('result')
    if (encoded) {
      const parsed = JSON.parse(decodeURIComponent(encoded))
      parsed.timestamp = new Date(parsed.timestamp)
      return parsed
    }

    return null
  } catch {
    return null
  }
}

/** 导出为文本文件 */
export function exportAsText(result: PaipanResult): void {
  const content = formatResultText(result)
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const dateStr = formatDate(result.timestamp)
  saveAs(blob, `六爻排盘_${result.original.name}_${dateStr}.txt`)
}

/** 导出为 JSON 文件 */
export function exportAsJson(result: PaipanResult): void {
  const blob = new Blob([JSON.stringify(result, null, 2)], {
    type: 'application/json;charset=utf-8',
  })
  const dateStr = formatDate(result.timestamp)
  saveAs(blob, `六爻排盘_${result.original.name}_${dateStr}.json`)
}

/** 格式化排盘文本 */
export function formatResultText(result: PaipanResult): string {
  const lines: string[] = [
    '═══════════════════════════════════',
    '          六 爻 排 盘',
    '═══════════════════════════════════',
    '',
    `起卦时间: ${result.timestamp.toLocaleString('zh-CN')}`,
    `四柱八字: ${formatBaZi(result.bazi)}`,
    `空亡: ${result.kongwang.zhi1}${result.kongwang.zhi2}`,
    '',
    '─── 本卦 ───',
    `卦名: ${result.original.name}`,
    `卦宫: ${result.original.gong} (${result.original.gongWuxing})`,
    `卦辞: ${result.original.guaci}`,
    `世应: 世在${result.original.shiPosition}爻 应在${result.original.yingPosition}爻`,
    '',
    '爻位 │ 六神 │ 六亲 │ 干支 │ 五行 │ 神煞 │ 空亡',
    '─────┼──────┼──────┼──────┼──────┼──────┼──────',
    ...result.original.yaos.map(y => {
      const pos = ['初', '二', '三', '四', '五', '上'][y.position - 1]
      const shiYing = y.isShi ? '●世' : y.isYing ? '○应' : '  '
      const empty = y.isEmpty ? '空' : ''
      const shensha = y.shensha.join('')
      return `${pos}${shiYing}│${y.liushou}│${y.liuqin}│${y.najia.gan}${y.najia.zhi}│${y.wuxing}│${shensha}│${empty}`
    }),
    '',
  ]

  if (result.changed) {
    lines.push(
      '─── 变卦 ───',
      `卦名: ${result.changed.name}`,
      `卦宫: ${result.changed.gong} (${result.changed.gongWuxing})`,
      `卦辞: ${result.changed.guaci}`,
      '',
      '爻位 │ 六神 │ 六亲 │ 干支 │ 五行',
      '─────┼──────┼──────┼──────┼──────',
      ...result.changed.yaos.map(y => {
        const pos = ['初', '二', '三', '四', '五', '上'][y.position - 1]
        return `${pos}  │${y.liushou}│${y.liuqin}│${y.najia.gan}${y.najia.zhi}│${y.wuxing}`
      }),
      '',
    )
  }

  if (result.sanhe && result.sanhe.length > 0) {
    for (const sh of result.sanhe) {
      if (sh.completed) {
        lines.push(`三合局: ${sh.name}（已形成）`)
      } else {
        lines.push(`三合局: ${sh.name}（缺${sh.missingZhis.join('、')}）`)
      }
      if (sh.sources.length > 0) {
        const srcText = sh.sources.map(s => `${s.zhi}(${s.source})`).join(', ')
        lines.push(`  来源: ${srcText}`)
      }
    }
    lines.push('')
  }

  if (result.fanyin) {
    lines.push(
      `${result.fanyin.type}: ${result.fanyin.description}`,
      '',
    )
  }

  lines.push('═══════════════════════════════════')
  return lines.join('\n')
}

function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  return `${y}${m}${d}_${h}${min}`
}

/** 导出全部历史记录为 JSON 文件 */
export function exportAllHistory(history: PaipanResult[]): void {
  const blob = new Blob([JSON.stringify(history, null, 2)], {
    type: 'application/json;charset=utf-8',
  })
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  saveAs(blob, `六爻历史_备份_${dateStr}.json`)
}

/** 导入历史记录 JSON 文件，处理向后兼容 */
export function importHistory(file: File): Promise<PaipanResult[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const parsed = JSON.parse(text)
        if (!Array.isArray(parsed)) {
          reject(new Error('文件格式不正确：应为 JSON 数组'))
          return
        }
        const results = parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
          note: item.note && typeof item.note === 'string'
            ? { question: item.note, result: '', tags: [] }
            : item.note,
        })) as PaipanResult[]
        resolve(results)
      } catch (err) {
        reject(new Error('文件解析失败，请确认选择了正确的 JSON 文件'))
      }
    }
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsText(file)
  })
}
