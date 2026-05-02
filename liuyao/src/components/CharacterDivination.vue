<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Yao } from '../types'
import { divineByCharacters } from '../engine/divination'

const emit = defineEmits<{
  complete: [yaos: Yao[]]
}>()

const characterText = ref('')

const canSubmit = computed(() => characterText.value.trim().length >= 1)

function startDivination() {
  const text = characterText.value.trim()
  if (!text) return
  const yaos = divineByCharacters(text)
  emit('complete', yaos)
}
</script>

<template>
  <div class="space-y-4">
    <p class="text-sm text-gray-500">输入 1 个以上汉字起卦</p>

    <input
      v-model="characterText"
      placeholder="请输入汉字..."
      class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
             focus:outline-none focus:ring-2 focus:ring-[#8b0000]/30"
      maxlength="20"
    />

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
