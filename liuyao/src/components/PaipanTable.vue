<script setup lang="ts">
import { usePaipanStore } from '../stores/paipan'
import type { GuaDetail } from '../types'

const props = defineProps<{
  gua: GuaDetail
}>()

const store = usePaipanStore()
const displayOptions = store.displayOptions

function getYaoSymbol(yang: boolean, changing: boolean): string {
  if (changing) return yang ? '○' : '×'
  return yang ? '⚊' : '⚋'
}

const POSITION_NAMES = ['初', '二', '三', '四', '五', '上']

const WANG_SHUAI_COLORS: Record<string, string> = {
  '旺': 'text-red-600 font-bold',
  '相': 'text-orange-600',
  '休': 'text-gray-500',
  '囚': 'text-gray-400',
  '死': 'text-gray-300',
}
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full text-sm border-collapse">
      <thead>
        <tr class="bg-[#8b7355] text-white">
          <th class="px-2 py-1.5 border border-[#8b7355]">爻位</th>
          <th class="px-2 py-1.5 border border-[#8b7355]">爻象</th>
          <th class="px-2 py-1.5 border border-[#8b7355]">六神</th>
          <th class="px-2 py-1.5 border border-[#8b7355]">六亲</th>
          <th v-if="displayOptions.showFuShen" class="px-2 py-1.5 border border-[#8b7355] text-yellow-200">伏神</th>
          <th class="px-2 py-1.5 border border-[#8b7355]">干支</th>
          <th class="px-2 py-1.5 border border-[#8b7355]">五行</th>
          <th v-if="displayOptions.showWangShuai" class="px-2 py-1.5 border border-[#8b7355]">旺衰</th>
          <th v-if="displayOptions.showShensha" class="px-2 py-1.5 border border-[#8b7355]">神煞</th>
          <th v-if="displayOptions.showKongwang" class="px-2 py-1.5 border border-[#8b7355]">空亡</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(y, i) in gua.yaos"
          :key="i"
          class="text-center"
          :class="i % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
        >
          <td class="px-2 py-1.5 border border-gray-300 font-medium">
            {{ POSITION_NAMES[i] }}
            <span v-if="y.isShi" class="text-red-600 text-xs ml-1">●世</span>
            <span v-else-if="y.isYing" class="text-blue-600 text-xs ml-1">○应</span>
          </td>
          <td class="px-2 py-1.5 border border-gray-300">
            <span :class="y.yao.yang ? 'text-red-600' : 'text-blue-600'" class="text-lg">
              {{ getYaoSymbol(y.yao.yang, y.yao.changing) }}
            </span>
          </td>
          <td class="px-2 py-1.5 border border-gray-300">{{ y.liushou }}</td>
          <td class="px-2 py-1.5 border border-gray-300 font-medium">
            <span :class="{
              'text-red-600': y.liuqin === '官鬼',
              'text-green-600': y.liuqin === '子孙',
              'text-blue-600': y.liuqin === '父母',
              'text-yellow-600': y.liuqin === '妻财',
              'text-gray-600': y.liuqin === '兄弟',
            }">
              {{ y.liuqin }}
            </span>
          </td>
          <td v-if="displayOptions.showFuShen" class="px-2 py-1.5 border border-gray-300 text-xs text-yellow-700">
            <template v-if="y.fushen">
              <span :class="{
                'text-red-600': y.fushen.liuqin === '官鬼',
                'text-green-600': y.fushen.liuqin === '子孙',
                'text-blue-600': y.fushen.liuqin === '父母',
                'text-yellow-600': y.fushen.liuqin === '妻财',
                'text-gray-600': y.fushen.liuqin === '兄弟',
              }">
                {{ y.fushen.liuqin }}
              </span>
              <span class="text-gray-400">({{ y.fushen.zhi }})</span>
            </template>
          </td>
          <td class="px-2 py-1.5 border border-gray-300">{{ y.najia.gan }}{{ y.najia.zhi }}</td>
          <td class="px-2 py-1.5 border border-gray-300">{{ y.wuxing }}</td>
          <td v-if="displayOptions.showWangShuai" class="px-2 py-1.5 border border-gray-300">
            <span v-if="y.wangshuai" :class="WANG_SHUAI_COLORS[y.wangshuai]">
              {{ y.wangshuai }}
            </span>
          </td>
          <td class="px-2 py-1.5 border border-gray-300 text-xs">
            <span v-for="s in y.shensha" :key="s" class="inline-block bg-purple-100 text-purple-700 px-1 rounded mr-0.5">
              {{ s }}
            </span>
          </td>
          <td class="px-2 py-1.5 border border-gray-300">
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
