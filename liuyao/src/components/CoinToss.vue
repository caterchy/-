<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Yao } from '../types'
import { tossCoin } from '../engine/coin'

const emit = defineEmits<{
  complete: [yaos: Yao[]]
}>()

const MAX_TOSSES = 6
const yaos = ref<Yao[]>([])
const currentToss = ref(0)
const isAnimating = ref(false)
const showResult = ref(false)
const tempResult = ref<string>('')

const isComplete = computed(() => currentToss.value >= MAX_TOSSES)
const progressText = computed(() => `第 ${currentToss.value + 1} / ${MAX_TOSSES} 次`)

function doToss() {
  if (isComplete.value || isAnimating.value) return

  isAnimating.value = true
  showResult.value = false

  // 动画延迟后显示结果
  setTimeout(() => {
    const yao = tossCoin()
    yaos.value.push(yao)
    currentToss.value++

    const yangCount = yao.yang ? (yao.changing ? 3 : 2) : (yao.changing ? 0 : 1)
    const text = yangCount === 3 ? '三正' : yangCount === 2 ? '二正一反' : yangCount === 1 ? '一正二反' : '三反'
    tempResult.value = `${text} → ${yao.type}${yao.changing ? ' (动爻)' : ''}`

    showResult.value = true
    isAnimating.value = false

    if (currentToss.value >= MAX_TOSSES) {
      // 所有爻已生成
      setTimeout(() => {
        emit('complete', yaos.value)
      }, 800)
    }
  }, 400)
}

function reset() {
  yaos.value = []
  currentToss.value = 0
  showResult.value = false
  tempResult.value = ''
}
</script>

<template>
  <div class="bg-white rounded-lg shadow p-6 text-center">
    <!-- 进度指示 -->
    <div v-if="!isComplete" class="mb-4">
      <div class="text-sm text-gray-500 mb-2">{{ progressText }}</div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div
          class="bg-[#8b0000] h-2 rounded-full transition-all duration-300"
          :style="{ width: `${(currentToss / MAX_TOSSES) * 100}%` }"
        />
      </div>
    </div>

    <!-- 掷币按钮 -->
    <div class="my-8">
      <!-- 硬币动画区 -->
      <div
        class="w-24 h-24 mx-auto rounded-full border-4 border-[#8b7355] flex items-center justify-center
               text-3xl font-bold bg-gradient-to-br from-yellow-100 to-yellow-200 mb-4
               transition-transform duration-300"
        :class="{ 'animate-spin': isAnimating }"
      >
        ☰
      </div>

      <button
        v-if="!isComplete"
        @click="doToss"
        :disabled="isAnimating"
        class="bg-[#8b0000] text-white px-8 py-3 rounded-lg text-lg
               hover:bg-red-900 disabled:opacity-50 disabled:cursor-not-allowed
               transition-colors shadow"
      >
        {{ isAnimating ? '掷币中...' : '掷 币' }}
      </button>

      <button
        v-else
        @click="reset"
        class="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
      >
        重新起卦
      </button>
    </div>

    <!-- 当前结果 -->
    <div v-if="showResult" class="text-lg text-gray-700 animate-fade-in">
      {{ tempResult }}
    </div>

    <!-- 已生成结果列表 -->
    <div v-if="yaos.length > 0" class="mt-6 text-left">
      <div class="text-sm text-gray-500 mb-2">已生成:</div>
      <div class="flex gap-2 justify-center">
        <div
          v-for="(y, i) in yaos"
          :key="i"
          class="w-10 h-10 rounded border-2 flex items-center justify-center text-lg font-bold"
          :class="y.yang ? 'border-red-500 bg-red-50 text-red-700' : 'border-blue-500 bg-blue-50 text-blue-700'"
        >
          {{ y.yang ? '⚊' : '⚋' }}
          <span v-if="y.changing" class="absolute text-xs text-green-600">●</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>
