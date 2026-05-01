<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Yao } from '../types'
import { divineByTwoNumbers, divineBySingleNumber } from '../engine/divination'

const emit = defineEmits<{
  complete: [yaos: Yao[]]
}>()

const numberMode = ref<'three' | 'one'>('three')
const num1 = ref('')
const num2 = ref('')
const num3 = ref('')
const singleNum = ref('')

const canSubmit = computed(() => {
  if (numberMode.value === 'three') {
    return num1.value.trim() !== '' && num2.value.trim() !== '' && num3.value.trim() !== ''
  }
  return singleNum.value.trim() !== ''
})

function startDivination() {
  let yaos: Yao[]
  if (numberMode.value === 'three') {
    const a = parseInt(num1.value) || 0
    const b = parseInt(num2.value) || 0
    const c = parseInt(num3.value) || 0
    // Three numbers: first → upper trigram, second → lower trigram, third → moving yao
    // Decode a and b into trigrams via divineByTwoNumbers
    yaos = divineByTwoNumbers(a, b)
    // Override moving yao with third number
    const dongPos = c % 6
    yaos = yaos.map((y, i) => ({
      ...y,
      changing: i === dongPos,
      type: i === dongPos
        ? (y.yang ? '老阳' as const : '老阴' as const)
        : (y.yang ? '少阳' as const : '少阴' as const),
    }))
  } else {
    yaos = divineBySingleNumber(parseInt(singleNum.value) || 0)
  }
  emit('complete', yaos)
}
</script>

<template>
  <div class="space-y-4">
    <p class="text-sm text-gray-500">输入数字以起卦</p>

    <!-- Mode toggle -->
    <div class="flex gap-2">
      <button
        @click="numberMode = 'three'"
        class="flex-1 py-2 rounded-lg text-sm font-bold border-2 transition-all"
        :class="numberMode === 'three'
          ? 'border-[#8b0000] text-[#8b0000] bg-red-50'
          : 'border-gray-200 text-gray-500 hover:border-gray-300'"
      >三数起卦</button>
      <button
        @click="numberMode = 'one'"
        class="flex-1 py-2 rounded-lg text-sm font-bold border-2 transition-all"
        :class="numberMode === 'one'
          ? 'border-[#8b0000] text-[#8b0000] bg-red-50'
          : 'border-gray-200 text-gray-500 hover:border-gray-300'"
      >单数起卦</button>
    </div>

    <!-- Three numbers -->
    <div v-if="numberMode === 'three'" class="space-y-3">
      <p class="text-xs text-gray-400">第一个数字（除8取余）→ 上卦，第二个数字（除8取余）→ 下卦，第三个数字（除6取余）→ 动爻</p>
      <div class="grid grid-cols-3 gap-3">
        <div>
          <label class="text-xs text-gray-500 mb-1 block">数字一（上卦）</label>
          <input
            v-model="num1"
            type="number"
            placeholder="如 3"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-[#8b0000]/30"
          />
        </div>
        <div>
          <label class="text-xs text-gray-500 mb-1 block">数字二（下卦）</label>
          <input
            v-model="num2"
            type="number"
            placeholder="如 8"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-[#8b0000]/30"
          />
        </div>
        <div>
          <label class="text-xs text-gray-500 mb-1 block">数字三（动爻）</label>
          <input
            v-model="num3"
            type="number"
            placeholder="如 4"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-[#8b0000]/30"
          />
        </div>
      </div>
    </div>

    <!-- Single number -->
    <div v-else>
      <label class="text-xs text-gray-500 mb-1 block">输入数字</label>
      <input
        v-model="singleNum"
        type="number"
        placeholder="如 2652"
        class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
               focus:outline-none focus:ring-2 focus:ring-[#8b0000]/30"
      />
      <p class="text-xs text-gray-400 mt-1">数字将分成前后两段，分别计算上下卦</p>
    </div>

    <button
      @click="startDivination"
      :disabled="!canSubmit"
      class="w-full bg-[#8b0000] text-white py-3 rounded-xl text-sm font-bold
             hover:bg-red-900 disabled:opacity-40 disabled:cursor-not-allowed
             active:scale-[0.98] transition-all duration-200 shadow-sm"
    >
      开始起卦
    </button>
  </div>
</template>
