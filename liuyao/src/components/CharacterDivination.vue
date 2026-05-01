<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Yao } from '../types'
import { divineByCharacters } from '../engine/divination'

const emit = defineEmits<{
  complete: [yaos: Yao[]]
}>()

const characterText = ref('')

const canSubmit = computed(() => characterText.value.trim().length >= 2)

function startDivination() {
  const text = characterText.value.trim()
  if (!text) return
  const yaos = divineByCharacters(text)
  emit('complete', yaos)
}
</script>

<template>
  <div class="space-y-4">
    <p class="text-sm text-gray-500">输入 2 个以上汉字</p>

    <div class="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-700">
      <p><strong>笔画计算说明：</strong>采用启发式算法，根据 Unicode 编码通过乘数散列映射到 1-30，</p>
      <p>使相邻字获得不同的笔画数，分布更均匀。非实际笔画数，仅供起卦参考。</p>
    </div>

    <input
      v-model="characterText"
      placeholder="请输入汉字..."
      class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
             focus:outline-none focus:ring-2 focus:ring-[#8b0000]/30"
      maxlength="20"
    />

    <div class="text-xs text-gray-400">
      <p>起卦规则：将汉字分成前后两半，前半笔画总数 ÷ 8 余数 → 上卦</p>
      <p>后半笔画总数 ÷ 8 余数 → 下卦，总笔画数 ÷ 6 余数 → 动爻</p>
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
