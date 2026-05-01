<script setup lang="ts">
import type { PaipanResult } from '../types'

defineProps<{
  result: PaipanResult
}>()

const POSITION_LABELS = ['初', '二', '三', '四', '五', '上']
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
    <h3 class="text-sm font-bold text-gray-700 mb-3">排盘预览</h3>

    <!-- Original hexagram -->
    <div class="bg-[#faf5eb] rounded-lg p-4 border border-[#d4c5a9]/40">
      <div class="flex flex-col-reverse gap-1.5">
        <div
          v-for="(yao, i) in result.original.yaos"
          :key="i"
          class="flex items-center gap-3 py-1.5 px-2 rounded transition-colors"
          :class="yao.yao.changing ? 'bg-amber-50/80' : ''"
        >
          <!-- Position label -->
          <span class="w-8 text-xs text-gray-400 shrink-0">{{ POSITION_LABELS[i] }}爻</span>

          <!-- Yang line -->
          <div v-if="yao.yao.yang" class="h-2 bg-red-600 rounded-full w-16" />

          <!-- Yin line -->
          <div v-else class="flex items-center gap-1.5 w-16">
            <div class="h-2 bg-blue-600 rounded-full flex-1" />
            <div class="w-1.5" />
            <div class="h-2 bg-blue-600 rounded-full flex-1" />
          </div>

          <!-- Changing marker -->
          <span
            v-if="yao.yao.changing"
            class="text-emerald-600 text-xs font-bold shrink-0"
          >● 动</span>
          <span v-else class="text-xs text-transparent shrink-0 select-none">·</span>

          <!-- Najia -->
          <span class="text-xs text-gray-400 ml-auto shrink-0">{{ yao.najia.gan }}{{ yao.najia.zhi }}</span>
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
