<script setup lang="ts">
import type { PaipanResult } from '../types'

defineProps<{
  result: PaipanResult
}>()

const POSITION_LABELS = ['初', '二', '三', '四', '五', '上']
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
    <h3 class="text-sm font-bold text-gray-700 mb-3">排盘预览</h3>

    <!-- Original hexagram -->
    <div class="bg-[#faf5eb] rounded-lg p-4 border border-[#d4c5a9]/40">
      <div class="flex flex-col items-center gap-1">
        <div
          v-for="(yao, i) in [...result.original.yaos].reverse()"
          :key="i"
          class="flex items-center gap-2 py-0.5 px-2"
          :class="yao.yao.changing ? 'bg-amber-50/60 rounded' : ''"
        >
          <!-- Position label -->
          <span class="w-8 text-xs text-gray-400 shrink-0 text-right">{{ POSITION_LABELS[result.original.yaos.length - 1 - i] }}爻</span>

          <!-- Horizontal line -->
          <span class="font-mono text-base" style="color: #333;">
            {{ yao.yao.yang ? '━━━━━' : '━ ━━' }}
          </span>

          <!-- Changing marker -->
          <span v-if="yao.yao.changing" class="text-[#c00] font-bold text-sm shrink-0">{{ yao.yao.yang ? '○' : '×' }}</span>

          <!-- Najia -->
          <span class="text-xs text-gray-400 shrink-0">{{ yao.najia.gan }}{{ yao.najia.zhi }}</span>
        </div>
      </div>

      <!-- Hexagram name -->
      <div class="text-center mt-3">
        <span class="text-sm font-bold text-gray-700">{{ result.original.name }}</span>
        <span class="text-xs text-gray-400 ml-2">({{ result.original.index }})</span>
      </div>
    </div>

    <!-- Changed hexagram -->
    <div v-if="result.changed" class="mt-3 text-center text-sm text-gray-500">
      <span class="text-gray-300">→</span>
      变卦：
      <span class="font-bold text-gray-700">{{ result.changed.name }}</span>
      <span class="text-xs text-gray-400">({{ result.changed.index }})</span>
    </div>

    <!-- Time info -->
    <div class="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400 text-center">
      {{ result.bazi.nian.gan }}{{ result.bazi.nian.zhi }}年
      {{ result.bazi.yue.gan }}{{ result.bazi.yue.zhi }}月
      {{ result.bazi.ri.gan }}{{ result.bazi.ri.zhi }}日
    </div>
  </div>
</template>
