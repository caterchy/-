<script setup lang="ts">
import { computed } from 'vue'
import { usePaipanStore } from '../stores/paipan'
import type { GuaDetail } from '../types'

const props = defineProps<{
  gua: GuaDetail
}>()

const store = usePaipanStore()
const displayOptions = store.displayOptions

const showAnDong = computed(() => props.gua.yaos.some(y => y.isAnDong || y.anDongReason === '月破'))

function getYaoSymbol(yang: boolean, changing: boolean): string {
  if (changing) return yang ? '○' : '×'
  return yang ? '⚊' : '⚋'
}

const POSITION_NAMES = ['初', '二', '三', '四', '五', '上']
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full text-sm border-collapse">
      <thead>
        <tr>
          <th class="px-2 py-2 border text-white font-medium" style="background: #8b7355; border-color: #8b7355;">爻位</th>
          <th class="px-2 py-2 border text-white font-medium" style="background: #8b7355; border-color: #8b7355;">爻象</th>
          <!-- 固定顺序：六神 → 六亲 → 干支 → 五行 -->
          <th class="px-2 py-2 border text-white font-medium" style="background: #8b7355; border-color: #8b7355;">六神</th>
          <th class="px-2 py-2 border text-white font-medium" style="background: #8b7355; border-color: #8b7355;">六亲</th>
          <th class="px-2 py-2 border text-white font-medium" style="background: #8b7355; border-color: #8b7355;">干支</th>
          <th class="px-2 py-2 border text-white font-medium" style="background: #8b7355; border-color: #8b7355;">五行</th>
          <th v-if="displayOptions.showFuShen" class="px-2 py-2 border text-yellow-200 font-medium" style="background: #8b7355; border-color: #8b7355;">伏神</th>
          <th v-if="displayOptions.showWangShuai" class="px-2 py-2 border text-white font-medium" style="background: #8b7355; border-color: #8b7355;">旺衰</th>
          <th v-if="showAnDong" class="px-2 py-2 border text-white font-medium" style="background: #8b7355; border-color: #8b7355;">暗动</th>
          <th v-if="displayOptions.showShensha" class="px-2 py-2 border text-white font-medium" style="background: #8b7355; border-color: #8b7355;">神煞</th>
          <th v-if="displayOptions.showKongwang" class="px-2 py-2 border text-white font-medium" style="background: #8b7355; border-color: #8b7355;">空亡</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(y, i) in [...gua.yaos].reverse()"
          :key="i"
          :class="i % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
        >
          <td class="px-2 py-2 border align-middle" style="border-color: var(--border-color);">
            {{ POSITION_NAMES[gua.yaos.length - 1 - i] }}
            <span v-if="y.isShi" class="text-red-600 text-xs ml-1">●世</span>
            <span v-else-if="y.isYing" class="text-blue-600 text-xs ml-1">○应</span>
          </td>
          <td class="px-2 py-2 border align-middle" style="border-color: var(--border-color);">
            <span class="text-lg" style="color: #333;">
              {{ getYaoSymbol(y.yao.yang, y.yao.changing) }}
            </span>
          </td>
          <td class="px-2 py-2 border align-middle" style="border-color: var(--border-color); color: #333;">
            {{ y.liushou }}
          </td>
          <td class="px-2 py-2 border align-middle font-medium" style="border-color: var(--border-color); color: #333;">
            {{ y.liuqin }}
          </td>
          <td class="px-2 py-2 border align-middle" style="border-color: var(--border-color); color: #333;">
            {{ y.najia.gan }}{{ y.najia.zhi }}
          </td>
          <td class="px-2 py-2 border align-middle" style="border-color: var(--border-color); color: #333;">
            {{ y.wuxing }}
          </td>
          <td v-if="displayOptions.showFuShen" class="px-2 py-2 border align-middle text-xs" style="border-color: var(--border-color); color: #888;">
            <template v-if="y.fushen">
              <span style="color: #333;">{{ y.fushen.liuqin }}</span>
              <span class="text-gray-400">({{ y.fushen.zhi }})</span>
            </template>
          </td>
          <td v-if="displayOptions.showWangShuai" class="px-2 py-2 border align-middle" style="border-color: var(--border-color);">
            <span v-if="y.wangshuai" :class="{
              'font-bold': y.wangshuai === '旺',
              'text-gray-500': y.wangshuai === '休',
              'text-gray-600': y.wangshuai === '囚' || y.wangshuai === '死',
            }">
              {{ y.wangshuai }}
            </span>
          </td>
          <td v-if="showAnDong" class="px-2 py-2 border align-middle" style="border-color: var(--border-color);">
            <span v-if="y.isAnDong" class="inline-flex items-center gap-1 text-xs font-medium">
              <span class="w-3.5 h-3.5 bg-blue-500 text-white text-[8px] font-bold rounded flex items-center justify-center">暗</span>
              {{ y.anDongReason }}
            </span>
            <span v-else-if="y.anDongReason === '月破'" class="inline-flex items-center gap-1 text-xs font-medium">
              <span class="w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-bold rounded flex items-center justify-center">破</span>
              月破
            </span>
            <span v-else class="text-gray-300">—</span>
          </td>
          <td v-if="displayOptions.showShensha" class="px-2 py-2 border align-middle text-xs" style="border-color: var(--border-color);">
            <span v-for="s in y.shensha" :key="s" class="inline-block bg-purple-100 text-purple-700 px-1 rounded mr-0.5">
              {{ s }}
            </span>
          </td>
          <td v-if="displayOptions.showKongwang" class="px-2 py-2 border align-middle" style="border-color: var(--border-color);">
            <span v-if="y.isEmpty" class="text-red-500 font-bold">空</span>
            <span v-else class="text-gray-300">—</span>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="mt-2 text-xs text-gray-400 text-right">
      卦宫: {{ gua.gong }}（{{ gua.gongWuxing }}）
    </div>
  </div>
</template>
