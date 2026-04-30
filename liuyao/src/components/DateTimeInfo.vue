<script setup lang="ts">
import type { BaZi, KongWang } from '../types'
import { formatBaZi } from '../engine/bazi'
import { getJieQi } from '../data/jieqi'

const props = defineProps<{
  bazi: BaZi
  timestamp: Date
  kongwang: KongWang
}>()

function formatTime(date: Date): string {
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const jieqi = getJieQi(props.timestamp)
</script>

<template>
  <div class="bg-white rounded-lg shadow p-4">
    <div class="grid grid-cols-2 gap-3 text-sm">
      <div>
        <span class="text-gray-500">起卦时间:</span>
        <span class="ml-2 font-medium">{{ formatTime(timestamp) }}</span>
      </div>
      <div>
        <span class="text-gray-500">节气:</span>
        <span class="ml-2 text-green-700 font-medium">{{ jieqi }}</span>
      </div>
      <div>
        <span class="text-gray-500">四柱八字:</span>
        <span class="ml-2 font-mono font-bold text-[#8b0000]">{{ formatBaZi(bazi) }}</span>
      </div>
      <div>
        <span class="text-gray-500">月建:</span>
        <span class="ml-1 font-medium text-orange-700">{{ bazi.yue.gan }}{{ bazi.yue.zhi }}（{{ bazi.yue.wuxing }}）</span>
        <span class="ml-3 text-gray-500">日建:</span>
        <span class="ml-1 font-medium text-orange-700">{{ bazi.ri.gan }}{{ bazi.ri.zhi }}（{{ bazi.ri.wuxing }}）</span>
      </div>
      <div>
        <span class="text-gray-500">年柱:</span>
        <span class="ml-1">{{ bazi.nian.gan }}{{ bazi.nian.zhi }}（{{ bazi.nian.wuxing }}）</span>
        <span class="ml-3 text-gray-500">月柱:</span>
        <span class="ml-1">{{ bazi.yue.gan }}{{ bazi.yue.zhi }}（{{ bazi.yue.wuxing }}）</span>
      </div>
      <div>
        <span class="text-gray-500">日柱:</span>
        <span class="ml-1">{{ bazi.ri.gan }}{{ bazi.ri.zhi }}（{{ bazi.ri.wuxing }}）</span>
        <span class="ml-3 text-gray-500">时柱:</span>
        <span class="ml-1">{{ bazi.shi.gan }}{{ bazi.shi.zhi }}（{{ bazi.shi.wuxing }}）</span>
      </div>
      <div>
        <span class="text-gray-500">空亡:</span>
        <span class="ml-2 font-medium text-red-600">{{ kongwang.zhi1 }}{{ kongwang.zhi2 }}</span>
        <span v-if="kongwang.xun" class="ml-2 text-gray-400">（{{ kongwang.xun }}旬）</span>
      </div>
    </div>
  </div>
</template>
