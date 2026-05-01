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

// 备注功能：双字段 + 标签
const questionText = ref('')
const resultText = ref('')
const presetTags = ['已验证', '待验证', '错卦', '参考', '教学'] as const
const selectedTags = ref<string[]>([])

function toggleTag(tag: string) {
  const idx = selectedTags.value.indexOf(tag)
  if (idx === -1) {
    selectedTags.value.push(tag)
  } else {
    selectedTags.value.splice(idx, 1)
  }
}

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

  // Reset notes for new result
  questionText.value = ''
  resultText.value = ''
  selectedTags.value = []

  // Scroll to result
  nextTick(() => {
    resultRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

function goToResult() {
  const question = questionText.value.trim()
  const result = resultText.value.trim()
  const tags = selectedTags.value
  if (question || result || tags.length > 0) {
    store.updateNote({ question, result, tags })
  }
  router.push('/result')
}

function resetDivination() {
  showResult.value = false
  questionText.value = ''
  resultText.value = ''
  selectedTags.value = []
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

      <!-- Note section (双字段 + 标签) -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5">
        <h3 class="text-sm font-bold text-gray-700 mb-3">备注</h3>
        <div class="space-y-3">
          <div>
            <label class="text-xs text-gray-500 mb-1 block">占卜问题</label>
            <input
              v-model="questionText"
              placeholder="例如：占问明日面试结果"
              class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-[#8b0000]/30 transition-all duration-200 bg-gray-50 hover:bg-white"
              maxlength="200"
            />
          </div>
          <div>
            <label class="text-xs text-gray-500 mb-1 block">占卜结果</label>
            <textarea
              v-model="resultText"
              placeholder="记录应验情况..."
              class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none
                     focus:outline-none focus:ring-2 focus:ring-[#8b0000]/30 transition-all duration-200 bg-gray-50 hover:bg-white"
              rows="2"
              maxlength="500"
            />
          </div>
          <div>
            <label class="text-xs text-gray-500 mb-1 block">标签</label>
            <div class="flex gap-1.5 flex-wrap">
              <button
                v-for="tag in presetTags"
                :key="tag"
                @click="toggleTag(tag)"
                class="px-2.5 py-1 rounded-full text-xs font-bold border transition-all"
                :class="selectedTags.includes(tag)
                  ? 'bg-[#8b0000]/10 border-[#8b0000]/30 text-[#8b0000]'
                  : 'border-gray-200 text-gray-400 hover:border-gray-300'"
              >
                {{ tag }}
              </button>
            </div>
          </div>
        </div>
      </div>

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
