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
  { yang: true, changing: false, label: '少阳 ⚊' },
  { yang: true, changing: true, label: '老阳 ⚊○' },
  { yang: false, changing: false, label: '少阴 ⚋' },
  { yang: false, changing: true, label: '老阴 ⚋×' },
]

const POSITION_NAMES = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻']
const selections = ref<number[]>(Array(6).fill(0))
const currentStep = ref(0)
const confirmed = ref(false)

const currentSelection = computed(() => selections.value[currentStep.value])

const allDone = computed(() => currentStep.value >= 6 && confirmed.value)

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
  <div class="bg-white rounded-lg shadow p-6">
    <h3 class="text-lg font-bold text-center text-[#8b0000] mb-4">手工指定六爻</h3>

    <!-- 已选结果预览 -->
    <div class="flex gap-2 justify-center mb-6">
      <div
        v-for="(sel, i) in selections"
        :key="i"
        class="w-10 h-10 rounded border-2 flex items-center justify-center text-sm font-bold relative"
        :class="[
          i < currentStep || (i === currentStep && confirmed)
            ? (OPTIONS[sel].yang ? 'border-red-500 bg-red-50 text-red-700' : 'border-blue-500 bg-blue-50 text-blue-700')
            : 'border-gray-300 bg-gray-50 text-gray-300',
          i === currentStep && !confirmed ? 'ring-2 ring-[#8b0000]' : '',
        ]"
      >
        {{ i < currentStep || (i === currentStep && confirmed) ? (OPTIONS[sel].yang ? '⚊' : '⚋') : '?' }}
        <span v-if="i < currentStep && OPTIONS[sel].changing" class="absolute -top-1 -right-1 text-green-600 text-xs">●</span>
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
        class="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100"
      >
        上一步
      </button>

      <button
        v-if="allDone"
        @click="submit"
        class="bg-[#8b0000] text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-red-900 transition-colors shadow"
      >
        完成排盘
      </button>

      <button
        @click="resetAll"
        class="px-4 py-2 text-sm text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-100"
      >
        重置
      </button>
    </div>
  </div>
</template>
