import type { PaipanResult } from '../types'
import { formatBaZi } from '../engine/bazi'
import { saveAs } from 'file-saver'

/** 将排盘结果编码为 URL 参数 */
export function encodeResultToUrl(result: PaipanResult): string {
  const baseUrl = window.location.origin + window.location.pathname
  const encoded = encodeURIComponent(JSON.stringify(result))
  return `${baseUrl}?result=${encoded}`
}

/** 从 URL 参数解码排盘结果 */
export function decodeResultFromUrl(): PaipanResult | null {
  try {
    const params = new URLSearchParams(window.location.search)
    const encoded = params.get('result')
    if (!encoded) return null
    const parsed = JSON.parse(decodeURIComponent(encoded))
    parsed.timestamp = new Date(parsed.timestamp)
    return parsed
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
function formatResultText(result: PaipanResult): string {
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

  if (result.sanhe) {
    lines.push(
      `三合局: ${result.sanhe.name} ${result.sanhe.wuxing}局`,
      `参与爻位: ${result.sanhe.positions.join(', ')}爻`,
      '',
    )
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
