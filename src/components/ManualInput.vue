<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Yao } from '../types'

const emit = defineEmits<{
  complete: [yaos: Yao[]]
}>()

interface YaoSelection {
  yang: boolean
  changing: boolean
  label: string
}

const OPTIONS: YaoSelection[] = [
  { yang: true, changing: false, label: '少阳 (⚊) 二正一背' },
  { yang: true, changing: true, label: '老阳 (⚊○) 三背' },
  { yang: false, changing: false, label: '少阴 (⚋) 一正两背' },
  { yang: false, changing: true, label: '老阴 (⚋×) 三正' },
]

const POSITION_NAMES = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻']
const selections = ref<number[]>(Array(6).fill(0))
const currentStep = ref(0)
const confirmed = ref(false)

const currentSelection = computed(() => selections.value[currentStep.value])

const allDone = computed(() => confirmed.value)

function yaoStateClass(forwardIdx: number): string {
  if (allDone.value) return 'text-[#8b0000] font-bold'
  if (forwardIdx < currentStep.value) return 'text-green-600 bg-green-50'
  if (forwardIdx === currentStep.value) return 'text-[#8b0000] font-bold'
  return 'text-gray-300'
}

function selectOption(idx: number) {
  if (currentStep.value >= 6) return
  selections.value[currentStep.value] = idx
  if (currentStep.value < 5) {
    currentStep.value++
  } else {
    confirmed.value = true
  }
}

function goPrev() {
  if (currentStep.value > 0) {
    currentStep.value--
    confirmed.value = false
  }
}

function resetAll() {
  selections.value = Array(6).fill(0)
  currentStep.value = 0
  confirmed.value = false
}

function randomFill() {
  selections.value = Array.from({ length: 6 }, () => Math.floor(Math.random() * 4))
  currentStep.value = 6
  confirmed.value = true
}

function submit() {
  const yaos: Yao[] = selections.value.map(idx => ({
    yang: OPTIONS[idx].yang,
    changing: OPTIONS[idx].changing,
    type: (OPTIONS[idx].changing
      ? (OPTIONS[idx].yang ? '老阳' : '老阴')
      : (OPTIONS[idx].yang ? '少阳' : '少阴')) as any,
  }))
  emit('complete', yaos)
}
</script>

<template>
  <div class="bg-white rounded shadow-sm border p-6" style="border-color: var(--border-color);">
    <h3 class="text-lg font-bold text-center text-[#8b0000] mb-4">手工指定六爻</h3>

    <!-- 已选结果预览：horizontal lines bottom-to-top -->
    <div class="hexagram-center mb-6">
      <div class="flex flex-col items-center gap-1">
        <div
          v-for="(sel, i) in [...selections].reverse()"
          :key="i"
          class="flex items-center justify-between w-full max-w-[220px] mx-auto"
          :class="!allDone && selections.length - 1 - i === currentStep ? 'bg-amber-50 rounded-lg' : ''"
        >
          <div class="flex items-center gap-2">
            <span
              class="text-xs w-8 text-right"
              :class="allDone ? 'font-bold text-[#8b0000]' : 'text-gray-400'"
            >{{ POSITION_NAMES[selections.length - 1 - i] }}</span>
            <span
              class="font-mono text-lg shrink-0"
              :class="yaoStateClass(selections.length - 1 - i)"
              style="letter-spacing: 0.1em;"
            >
              {{ OPTIONS[sel].yang ? '⚊' : '⚋' }}
            </span>
          </div>
          <span v-if="OPTIONS[sel].changing" class="text-[#c00] font-bold text-sm">{{ OPTIONS[sel].yang ? '○' : '×' }}</span>
        </div>
      </div>
    </div>

    <!-- 当前爻选择 -->
    <div v-if="!allDone" class="text-center mb-4">
      <div class="text-lg font-bold text-gray-700 mb-1">{{ POSITION_NAMES[currentStep] }}</div>
      <div class="text-sm text-gray-500">第 {{ currentStep + 1 }} / 6 爻</div>
    </div>

    <div v-if="!allDone" class="grid grid-cols-2 gap-3 mb-6">
      <button
        v-for="(opt, idx) in OPTIONS"
        :key="idx"
        @click="selectOption(idx)"
        class="py-3 px-4 rounded-lg border-2 text-center font-bold transition-colors"
        :class="currentSelection === idx
          ? 'border-[#8b0000] bg-red-50 text-[#8b0000]'
          : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-[#8b7355]'"
      >
        {{ opt.label }}
      </button>
    </div>

    <!-- 操作按钮 -->
    <div class="flex gap-2 justify-center">
      <button
        v-if="currentStep > 0 && !allDone"
        @click="goPrev"
        class="px-4 py-2 text-sm text-gray-600 border rounded hover:bg-gray-100"
        style="border-color: var(--border-color); border-radius: var(--radius);"
      >
        上一步
      </button>

      <button
        v-if="allDone"
        @click="submit"
        class="bg-[#8b0000] text-white px-8 py-3 text-lg font-bold hover:bg-red-900 transition-colors shadow-sm"
        :style="{ borderRadius: 'var(--radius)' }"
      >
        完成排盘
      </button>

      <button
        @click="resetAll"
        class="px-4 py-2 text-sm text-gray-500 border rounded hover:bg-gray-100"
        style="border-color: var(--border-color); border-radius: var(--radius);"
      >
        重置
      </button>

      <button
        v-if="!allDone"
        @click="randomFill"
        class="px-4 py-2 text-sm text-yellow-700 border border-yellow-400 bg-yellow-50 rounded hover:bg-yellow-100"
        :style="{ borderRadius: 'var(--radius)' }"
      >
        随机填充
      </button>
    </div>
  </div>
</template>
