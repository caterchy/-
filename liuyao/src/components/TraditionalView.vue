<script setup lang="ts">
import { computed, ref } from 'vue'
import type { GuaDetail, YaoDetail, WuXing } from '../types'
import { usePaipanStore } from '../stores/paipan'
import { GUA_NA_GAN, GUA_NA_ZHI, GAN_WU_XING_NAJA, ZHI_WU_XING_NAJA } from '../data/naja'

const props = defineProps<{
  original: GuaDetail
  changed?: GuaDetail
}>()

const store = usePaipanStore()
const displayOptions = store.displayOptions

const POSITION_NAMES = ['初', '二', '三', '四', '五', '上']

const expandedYaoPosition = ref<number | null>(null)

function toggleExpand(position: number) {
  if (expandedYaoPosition.value === position) {
    expandedYaoPosition.value = null
  } else {
    expandedYaoPosition.value = position
  }
}

function getYaoSymbol(yang: boolean, changing: boolean): string {
  if (changing) return yang ? '○' : '×'
  return yang ? '⚊' : '⚋'
}

function yangLine(): string { return '━━━━━' }
function yinLine(): string { return '━ ━━' }

const showShenshaRow = computed(() => displayOptions.showShensha)

/** 汇总所有爻的 unique 神煞列表 */
const allShensha = computed(() => {
  const s = new Set<string>()
  for (const y of props.original.yaos) {
    y.shensha.forEach(sh => s.add(sh))
  }
  if (props.changed) {
    for (const y of props.changed.yaos) {
      y.shensha.forEach(sh => s.add(sh))
    }
  }
  return [...s]
})

// 构建排盘行（共6行，每行含两个卦的信息）
const rows = computed(() => {
  const result: Array<{
    pos: string
    posNum: number
    orig: { liushou: string; yao: YaoDetail; lineHtml: string; symbol: string }
    changedData: { liushou: string; yao: YaoDetail; lineHtml: string; symbol: string } | null
  }> = []

  for (let i = 5; i >= 0; i--) {
    const origYao = props.original.yaos[i]
    const changedYao = props.changed?.yaos[i] ?? null

    result.push({
      pos: POSITION_NAMES[i],
      posNum: i + 1,
      orig: {
        liushou: origYao.liushou,
        yao: origYao,
        lineHtml: origYao.yao.yang ? yangLine() : yinLine(),
        symbol: getYaoSymbol(origYao.yao.yang, origYao.yao.changing),
      },
      changedData: changedYao ? {
        liushou: changedYao.liushou,
        yao: changedYao,
        lineHtml: changedYao.yao.yang ? yangLine() : yinLine(),
        symbol: getYaoSymbol(changedYao.yao.yang, changedYao.yao.changing),
      } : null,
    })
  }

  return result
})

/**
 * 生成纳甲详解说明文本
 */
function getNajaDetail(yao: YaoDetail, gua: GuaDetail): string[] {
  const lines: string[] = []
  const position = yao.position
  const isInner = position <= 3
  const trigram = isInner ? gua.lower : gua.upper
  const innerOuter = isInner ? 'inner' : 'outer'
  const zhiIndex = (position - 1) % 3

  const gan = GUA_NA_GAN[trigram][innerOuter]
  const zhi = GUA_NA_ZHI[trigram][innerOuter][zhiIndex]

  const innerOuterText = isInner ? '内卦' : '外卦'
  lines.push(`${trigram}卦${innerOuterText}纳${gan}，${gan}${zhi}起`)

  const ganWx = GAN_WU_XING_NAJA[gan]
  const zhiWx = ZHI_WU_XING_NAJA[zhi]
  lines.push(`${gan}${ganWx} + ${zhi}${zhiWx} → ${yao.wuxing}`)

  const gongWx = gua.gongWuxing
  const yaoWx = yao.wuxing
  const SHENG: Record<WuXing, WuXing> = { '金': '水', '水': '木', '木': '火', '火': '土', '土': '金' }
  const KE: Record<WuXing, WuXing> = { '金': '木', '木': '土', '土': '水', '水': '火', '火': '金' }

  let verb = ''
  let liuqinDesc = ''
  if (gongWx === yaoWx) {
    verb = '同'
    liuqinDesc = '兄弟'
  } else if (SHENG[gongWx] === yaoWx) {
    verb = '生'
    liuqinDesc = '子孙'
  } else if (SHENG[yaoWx] === gongWx) {
    verb = '生'
    liuqinDesc = '父母'
  } else if (KE[gongWx] === yaoWx) {
    verb = '克'
    liuqinDesc = '妻财'
  } else if (KE[yaoWx] === gongWx) {
    verb = '克'
    liuqinDesc = '官鬼'
  }

  lines.push(`卦宫${gua.gong}${gongWx}为'我'，${gongWx}${verb}${yaoWx} → ${liuqinDesc}`)

  if (yao.fushen) {
    lines.push(`伏神${yao.fushen.liuqin}(${yao.fushen.zhi}) 藏于本爻之下`)
  }

  return lines
}
</script>

<template>
  <div class="card" style="background: #faf5eb; border-color: #8b7355;">
    <!-- 神煞行 -->
    <div v-if="showShenshaRow && allShensha.length > 0" class="bg-[#f0e8d8] border-b px-3 py-1.5 text-xs" style="border-color: #d4c5a9;">
      <span class="text-gray-500">神煞:</span>
      <span v-for="sh in allShensha" :key="sh" class="ml-2 text-purple-700">{{ sh }}</span>
    </div>

    <!-- 排盘表头 -->
    <div class="grid grid-cols-[auto_1fr_auto_auto_1fr_auto] text-xs text-gray-500 px-3 pt-2 pb-1 border-b bg-[#f0e8d8]" style="border-color: #d4c5a9;">
      <span class="text-center">六神</span>
      <span class="text-center">本卦 ({{ original.name }})</span>
      <span class="text-center w-6">动爻</span>
      <span class="text-center w-10">世应</span>
      <span v-if="changed" class="text-center">变卦 ({{ changed.name }})</span>
      <span v-if="changed" class="text-center">六神</span>
    </div>

    <!-- 排盘行 -->
    <div class="px-2 py-1">
      <div
        v-for="(row, idx) in rows"
        :key="idx"
        class="flex flex-col border-b border-dashed last:border-b-0"
        style="border-color: #e0d5c0;"
      >
        <!-- 主行：六神 + 本卦 + 动爻 + 世应 + 变卦 -->
        <div class="grid grid-cols-[auto_1fr_auto_auto_1fr_auto] items-center gap-1 py-1.5">
          <!-- 本卦六神 (无颜色) -->
          <span class="text-xs font-bold w-12 text-center" style="color: #333;">
            {{ row.orig.liushou }}
          </span>

          <!-- 本卦爻线 + 六亲 + 干支 -->
          <div class="flex items-center gap-1.5">
            <span class="font-mono text-sm" style="color: #333;">
              {{ row.orig.yao.yao.yang ? '━━━━━' : '━ ━━' }}
            </span>
            <span class="flex items-center gap-0.5">
              <span class="text-sm font-medium px-1 rounded" style="color: #333;">
                {{ row.orig.yao.liuqin }}
              </span>
              <span v-if="displayOptions.showWangShuai && row.orig.yao.wangshuai" class="text-xs text-gray-500">
                {{ row.orig.yao.wangshuai }}
              </span>
            </span>
            <span v-if="displayOptions.showKongwang && row.orig.yao.isEmpty" class="text-red-400 text-xs ml-0.5">空</span>
            <span v-if="row.orig.yao.isAnDong" class="text-blue-500 text-xs ml-0.5 font-bold">
              <span class="inline-flex items-center justify-center w-3.5 h-3.5 bg-blue-500 text-white text-[9px] font-bold rounded">暗</span>
              <span class="text-blue-400">({{ row.orig.yao.anDongReason }})</span>
            </span>
            <span v-else-if="row.orig.yao.anDongReason === '月破'" class="text-red-500 text-xs ml-0.5 font-bold">
              <span class="inline-flex items-center justify-center w-3.5 h-3.5 bg-red-500 text-white text-[9px] font-bold rounded">破</span>
              <span class="text-red-400">(月破)</span>
            </span>
            <!-- 干支 + 五行 -->
            <span
              class="text-xs ml-0.5 cursor-pointer hover:text-amber-600 transition-colors duration-200"
              :class="{ 'text-amber-600 font-medium': expandedYaoPosition === row.orig.yao.position }"
              @click.stop="toggleExpand(row.orig.yao.position)"
              style="color: #999;"
            >
              {{ row.orig.yao.najia.gan }}{{ row.orig.yao.najia.zhi }}
              <span class="text-gray-400">({{ row.orig.yao.wuxing }})</span>
            </span>
          </div>

          <!-- 动爻 -->
          <span class="text-center w-6">
            <span v-if="row.orig.yao.yao.changing" class="text-[#c00] font-bold">→</span>
          </span>

          <!-- 世应 -->
          <span class="text-center text-xs w-10">
            <span v-if="row.orig.yao.isShi" class="text-red-600 font-bold">●世</span>
            <span v-else-if="row.orig.yao.isYing" class="text-blue-600 font-bold">○应</span>
          </span>

          <!-- 变卦行 -->
          <template v-if="changed && row.changedData">
            <div class="flex items-center gap-1.5">
              <span class="font-mono text-sm" style="color: #333;">
                {{ row.changedData.yao.yao.yang ? '━━━━━' : '━ ━━' }}
              </span>
              <span v-if="row.changedData.yao.yao.changing" class="flex items-center gap-0.5">
                <span class="text-[#c00] font-bold">→</span>
              </span>
              <span class="flex items-center gap-0.5">
                <span class="text-sm font-medium px-1 rounded" style="color: #333;">
                  {{ row.changedData.yao.liuqin }}
                </span>
                <span v-if="displayOptions.showWangShuai && row.changedData.yao.wangshuai" class="text-xs text-gray-500">
                  {{ row.changedData.yao.wangshuai }}
                </span>
              </span>
              <span v-if="displayOptions.showKongwang && row.changedData.yao.isEmpty" class="text-red-400 text-xs ml-0.5">空</span>
              <span v-if="row.changedData.yao.isAnDong" class="text-blue-500 text-xs ml-0.5 font-bold">
                <span class="inline-flex items-center justify-center w-3.5 h-3.5 bg-blue-500 text-white text-[9px] font-bold rounded">暗</span>
                <span class="text-blue-400">({{ row.changedData.yao.anDongReason }})</span>
              </span>
              <span v-else-if="row.changedData.yao.anDongReason === '月破'" class="text-red-500 text-xs ml-0.5 font-bold">
                <span class="inline-flex items-center justify-center w-3.5 h-3.5 bg-red-500 text-white text-[9px] font-bold rounded">破</span>
                <span class="text-red-400">(月破)</span>
              </span>
              <span class="text-xs ml-0.5" style="color: #999;">
                {{ row.changedData.yao.najia.gan }}{{ row.changedData.yao.najia.zhi }}
                <span class="text-gray-400">({{ row.changedData.yao.wuxing }})</span>
              </span>
            </div>
            <!-- 变卦六神 (无颜色) -->
            <span class="text-xs font-bold w-12 text-right" style="color: #333;">
              {{ row.changedData.liushou }}
            </span>
          </template>
          <template v-else-if="!changed">
            <span class="text-xs text-gray-400 text-center w-10">—</span>
          </template>
        </div>

        <!-- 纳甲详解（可折叠） -->
        <transition name="naja-fade">
          <div
            v-if="expandedYaoPosition === row.orig.yao.position"
            class="ml-12 mr-2 mb-1.5 bg-amber-50 border-l-2 border-amber-400 rounded-r px-3 py-2 text-xs space-y-0.5"
          >
            <p v-for="(line, li) in getNajaDetail(row.orig.yao, original)" :key="li" class="text-gray-700 leading-relaxed">
              <template v-if="li === 3">
                <span class="text-purple-600 font-medium">┊ </span>{{ line }}
              </template>
              <template v-else>
                {{ line }}
              </template>
            </p>
          </div>
        </transition>
      </div>
    </div>

    <!-- 底部信息：卦宫 + 伏神 -->
    <div class="bg-[#f0e8d8] border-t px-3 py-1.5 text-xs flex flex-wrap gap-x-4 gap-y-1" style="border-color: #d4c5a9;">
      <span>卦宫: {{ original.gong }}（{{ original.gongWuxing }}）</span>
      <span v-if="changed">变宫: {{ changed.gong }}（{{ changed.gongWuxing }}）</span>
      <span v-if="original.guaci && displayOptions.showGuaci" class="text-gray-500 italic">卦辞: {{ original.guaci }}</span>
    </div>

    <!-- 伏神信息 -->
    <div v-if="displayOptions.showFuShen" class="border-t px-3 py-1.5 text-xs bg-amber-50" style="border-color: #d4c5a9;">
      <span class="text-gray-500">伏神:</span>
      <span v-for="(y, i) in original.yaos" :key="i">
        <span v-if="y.fushen && y.fushen.liuqin !== y.liuqin" class="ml-3">
          {{ POSITION_NAMES[i] }}爻
          <span style="color: #333;">{{ y.fushen.liuqin }}</span>
          <span class="text-gray-400">({{ y.fushen.zhi }})</span>
        </span>
      </span>
    </div>
  </div>
</template>

<style scoped>
.naja-fade-enter-active,
.naja-fade-leave-active {
  transition: all 0.2s ease;
}
.naja-fade-enter-from,
.naja-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
