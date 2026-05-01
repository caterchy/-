<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Yao } from '../types'
import { divineByTwoNumbers, divineBySingleNumber } from '../engine/divination'

const emit = defineEmits<{
  complete: [yaos: Yao[]]
}>()

const numberMode = ref<'double' | 'single'>('single')
const numA = ref('')
const numB = ref('')
const singleNum = ref('')

const canSubmit = computed(() => {
  if (numberMode.value === 'double') {
    return numA.value.trim() !== '' && numB.value.trim() !== ''
  }
  return singleNum.value.trim() !== ''
})

function startDivination() {
  let yaos: Yao[]
  if (numberMode.value === 'double') {
    const a = parseInt(numA.value) || 0
    const b = parseInt(numB.value) || 0
    yaos = divineByTwoNumbers(a, b)
  } else {
    yaos = divineBySingleNumber(parseInt(singleNum.value) || 0)
  }
  emit('complete', yaos)
}
</script>

<template>
  <div class="space-y-4">
    <!-- Mode toggle -->
    <div class="flex gap-2">
      <button
        @click="numberMode = 'single'"
        class="flex-1 py-2 rounded-lg text-sm font-bold border-2 transition-all"
        :class="numberMode === 'single'
          ? 'border-[#8b0000] text-[#8b0000] bg-red-50'
          : 'border-gray-200 text-gray-500 hover:border-gray-300'"
      >单数起卦</button>
      <button
        @click="numberMode = 'double'"
        class="flex-1 py-2 rounded-lg text-sm font-bold border-2 transition-all"
        :class="numberMode === 'double'
          ? 'border-[#8b0000] text-[#8b0000] bg-red-50'
          : 'border-gray-200 text-gray-500 hover:border-gray-300'"
      >双数起卦</button>
    </div>

    <!-- Single number -->
    <div v-if="numberMode === 'single'">
      <label class="text-xs text-gray-500 mb-1 block">输入数字</label>
      <input
        v-model="singleNum"
        type="number"
        placeholder="如 2652"
        class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
               focus:outline-none focus:ring-2 focus:ring-[#8b0000]/30"
      />
    </div>

    <!-- Double numbers -->
    <div v-else class="space-y-3">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="text-xs text-gray-500 mb-1 block">数字一</label>
          <input
            v-model="numA"
            type="number"
            placeholder="如 3"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-[#8b0000]/30"
          />
        </div>
        <div>
          <label class="text-xs text-gray-500 mb-1 block">数字二</label>
          <input
            v-model="numB"
            type="number"
            placeholder="如 8"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-[#8b0000]/30"
          />
        </div>
      </div>
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
