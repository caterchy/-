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

    <div class="grid grid-cols-2 gap-3">
      <!-- Left column: 本卦 -->
      <div class="bg-[#faf5eb] rounded-lg p-4 border border-[#d4c5a9]/40">
        <div class="text-center text-sm font-bold text-gray-700 mb-2">
          {{ result.original.name }}
        </div>
        <div class="flex flex-col items-center gap-1">
          <div
            v-for="(yao, i) in [...result.original.yaos].reverse()"
            :key="i"
            class="flex items-center gap-1 py-0.5 px-2"
            :class="yao.yao.changing ? 'bg-amber-50/60 rounded' : ''"
          >
            <div class="flex items-center gap-2">
              <!-- Position label -->
              <span class="w-8 text-xs text-gray-400 shrink-0 text-right">{{ POSITION_LABELS[result.original.yaos.length - 1 - i] }}爻</span>

              <!-- Horizontal line -->
              <span class="font-mono text-lg shrink-0" style="color: #333; letter-spacing: 0.1em;">
                {{ yao.yao.yang ? '⚊' : '⚋' }}
              </span>
            </div>
            <div class="w-4 text-center">
              <!-- Changing marker -->
              <span v-if="yao.yao.changing" class="text-[#c00] font-bold text-sm">{{ yao.yao.yang ? '○' : '×' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right column: 变卦 -->
      <div v-if="result.changed" class="bg-[#f0faf5] rounded-lg p-4 border border-[#a9d4c5]/40">
        <div class="text-center text-sm font-bold text-green-700 mb-2">
          {{ result.changed.name }}
        </div>
        <div class="flex flex-col items-center gap-1">
          <div
            v-for="(yao, i) in [...result.changed.yaos].reverse()"
            :key="i"
            class="flex items-center gap-1 py-0.5 px-2"
          >
            <div class="flex items-center gap-2">
              <!-- Position label -->
              <span class="w-8 text-xs text-gray-400 shrink-0 text-right">{{ POSITION_LABELS[result.changed.yaos.length - 1 - i] }}爻</span>

              <!-- Horizontal line -->
              <span class="font-mono text-lg shrink-0" style="color: #333; letter-spacing: 0.1em;">
                {{ yao.yao.yang ? '⚊' : '⚋' }}
              </span>
            </div>
            <div class="w-4 text-center"></div>
          </div>
        </div>
      </div>

      <!-- No changed hexagram message -->
      <div v-else class="bg-gray-50 rounded-lg p-4 border border-gray-200 flex items-center justify-center">
        <span class="text-sm text-gray-400">静卦 — 无变卦</span>
      </div>
    </div>

    <!-- Time info -->
    <div class="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400 text-center">
      {{ result.bazi.nian.gan }}{{ result.bazi.nian.zhi }}年
      {{ result.bazi.yue.gan }}{{ result.bazi.yue.zhi }}月
      {{ result.bazi.ri.gan }}{{ result.bazi.ri.zhi }}日
    </div>
  </div>
</template>
