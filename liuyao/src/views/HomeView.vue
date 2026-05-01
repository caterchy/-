<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import type { Yao, DivinationMethod } from '../types'
import DivinationForm from '../components/DivinationForm.vue'
import HexagramPreview from '../components/HexagramPreview.vue'
import { generatePaipanResult, buildPaipanResult } from '../engine/paipan'
import { usePaipanStore } from '../stores/paipan'

const router = useRouter()
const store = usePaipanStore()

const showResult = ref(false)
const resultRef = ref<HTMLElement | null>(null)

function onDivinationComplete(yaos: Yao[], method: DivinationMethod) {
  let result
  if (method === 'auto') {
    result = generatePaipanResult()
  } else {
    result = buildPaipanResult(yaos)
  }
  result.method = method
  store.setResult(result)
  store.saveToHistory(result)
  showResult.value = true

  // Scroll to result
  nextTick(() => {
    resultRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

function goToResult() {
  router.push('/result')
}

function resetDivination() {
  showResult.value = false
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const METHOD_LABELS: Record<DivinationMethod, string> = {
  coin: '手动摇钱',
  manual: '手工指定',
  auto: '自动起卦',
  time: '时间起卦',
  number: '数字起卦',
  character: '汉字起卦',
  hexagram: '卦名起卦',
}
</script>

<template>
  <div class="space-y-5 pb-20">
    <!-- Header -->
    <div class="text-center py-4">
      <h1 class="text-2xl font-bold text-[#8b0000] tracking-wider">六爻排盘</h1>
      <p class="text-gray-400 text-xs mt-1">传统六爻纳甲筮法</p>
    </div>

    <!-- Divination Form -->
    <DivinationForm @complete="onDivinationComplete" />

    <!-- Divider -->
    <div v-if="showResult" class="border-t border-gray-200" />

    <!-- Result Section -->
    <div v-if="showResult && store.currentResult" ref="resultRef" class="space-y-4">
      <!-- Method label -->
      <div class="text-center">
        <span class="inline-block bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">
          起卦方式：{{ METHOD_LABELS[store.currentResult.method ?? 'auto'] }}
        </span>
      </div>

      <!-- Hexagram Preview -->
      <HexagramPreview :result="store.currentResult" />

      <!-- Action buttons -->
      <div class="flex gap-3 pt-1">
        <button
          @click="resetDivination"
          class="flex-1 border-2 border-gray-200 text-gray-500 py-3 rounded-xl text-sm font-bold
                 hover:border-gray-300 hover:text-gray-600 active:scale-[0.98]
                 transition-all duration-200"
        >
          重新起卦
        </button>
        <button
          @click="goToResult"
          class="flex-1 bg-[#8b0000] text-white py-3 rounded-xl text-sm font-bold
                 hover:bg-red-900 active:scale-[0.98]
                 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          查看完整排盘
        </button>
      </div>
    </div>

    <!-- History link (only shown when no result) -->
    <div v-if="!showResult" class="text-center">
      <router-link
        to="/history"
        class="text-gray-400 hover:text-[#8b0000] text-xs transition-colors"
      >
        查看历史记录 ({{ store.historyCount }})
      </router-link>
    </div>
  </div>
</template>
