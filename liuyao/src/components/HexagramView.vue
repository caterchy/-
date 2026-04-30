<script setup lang="ts">
import type { GuaDetail } from '../types'

const props = defineProps<{
  gua: GuaDetail
  title?: string
  showGuaci?: boolean
  showShiYing?: boolean
}>()
</script>

<template>
  <div class="inline-block">
    <div v-if="title" class="text-center text-lg font-bold mb-2 text-[#8b0000]">
      {{ title }}
    </div>
    <div class="bg-[#faf5eb] border-2 border-[#8b7355] rounded-lg p-4 inline-block relative">
      <!-- 变爻标记 -->
      <div v-if="gua.yaos.some(y => y.yao.changing)" class="absolute -top-2 -right-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full shadow">
        动爻
      </div>
      <!-- 显示卦象: 从下到上, 但视觉上上卦在上 -->
      <div class="flex flex-col-reverse items-center gap-0">
        <div v-for="(y, i) in gua.yaos" :key="i" class="flex items-center gap-2 py-0.5 relative">
          <span class="w-6 text-right text-xs text-gray-500">
            {{ ['初', '二', '三', '四', '五', '上'][i] }}
            <span v-if="y.isShi && showShiYing" class="text-red-600 font-bold">世</span>
            <span v-else-if="y.isYing && showShiYing" class="text-blue-600 font-bold">应</span>
          </span>
          <div class="flex items-center relative">
            <!-- 阴爻 -->
            <div v-if="!y.yao.yang" class="flex items-center gap-1">
              <div class="w-6 h-1 bg-blue-600 rounded"></div>
              <div class="w-2"></div>
              <div class="w-6 h-1 bg-blue-600 rounded"></div>
            </div>
            <!-- 阳爻 -->
            <div v-else class="w-14 h-1 bg-red-600 rounded"></div>
            <!-- 动爻标记 -->
            <span v-if="y.yao.changing" class="absolute -right-5 text-green-600 text-xs font-bold">●</span>
          </div>
          <span class="w-16 text-xs text-gray-500">
            {{ y.najia.gan }}{{ y.najia.zhi }}
          </span>
        </div>
      </div>
      <div class="text-center mt-2 text-sm font-bold text-gray-700">
        {{ gua.name }}
      </div>
      <div v-if="showGuaci && gua.guaci" class="text-center mt-1 text-xs text-gray-500 italic max-w-[200px]">
        {{ gua.guaci }}
      </div>
    </div>
  </div>
</template>
