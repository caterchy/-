<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Yao } from '../types'
import CoinToss from '../components/CoinToss.vue'
import ManualInput from '../components/ManualInput.vue'
import { generatePaipanResult, buildPaipanResult } from '../engine/paipan'
import { usePaipanStore } from '../stores/paipan'

const router = useRouter()
const store = usePaipanStore()

const mode = ref<'choice' | 'manual' | 'auto' | 'specify'>('choice')
const showNoteDialog = ref(false)
const noteText = ref('')

function startManual() {
  mode.value = 'manual'
}

function startAuto() {
  mode.value = 'auto'
  const result = generatePaipanResult()
  store.setResult(result)
  store.saveToHistory(result)
  noteText.value = ''
  showNoteDialog.value = true
}

function startSpecify() {
  mode.value = 'specify'
}

function onManualComplete(yaos: Yao[]) {
  const result = buildPaipanResult(yaos)
  store.setResult(result)
  store.saveToHistory(result)
  noteText.value = ''
  showNoteDialog.value = true
}

function onSpecifyComplete(yaos: Yao[]) {
  const result = buildPaipanResult(yaos)
  store.setResult(result)
  store.saveToHistory(result)
  noteText.value = ''
  showNoteDialog.value = true
}

function confirmNote() {
  if (noteText.value.trim()) {
    store.updateNote(noteText.value.trim())
  }
  showNoteDialog.value = false
  router.push('/result')
}

function skipNote() {
  showNoteDialog.value = false
  router.push('/result')
}

function goBack() {
  mode.value = 'choice'
}
</script>

<template>
  <div class="space-y-6">
    <!-- 标题区域 -->
    <div class="text-center py-6">
      <h1 class="text-3xl font-bold text-[#8b0000] tracking-wider">六爻排盘</h1>
      <p class="text-gray-500 mt-2 text-sm">传统六爻纳甲筮法</p>
    </div>

    <!-- 选择起卦方式 -->
    <div v-if="mode === 'choice'" class="space-y-4">
      <button
        @click="startManual"
        class="w-full bg-white border-2 border-[#8b7355] text-[#8b0000] py-4 rounded-lg
               text-lg font-bold hover:bg-[#faf5eb] transition-colors shadow-sm"
      >
        手动起卦
        <div class="text-xs text-gray-500 font-normal mt-1">点击投掷硬币，六次成一卦</div>
      </button>

      <button
        @click="startSpecify"
        class="w-full bg-white border-2 border-[#8b7355] text-[#8b0000] py-4 rounded-lg
               text-lg font-bold hover:bg-[#faf5eb] transition-colors shadow-sm"
      >
        手工指定
        <div class="text-xs text-gray-500 font-normal mt-1">直接选择每爻的阴阳老少</div>
      </button>

      <button
        @click="startAuto"
        class="w-full bg-[#8b0000] text-white py-4 rounded-lg
               text-lg font-bold hover:bg-red-900 transition-colors shadow-sm"
      >
        自动起卦
        <div class="text-xs text-red-200 font-normal mt-1">系统随机生成卦象</div>
      </button>

      <div class="relative py-4">
        <div class="border-t border-gray-300"></div>
        <span class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#f5f0e8] px-4 text-gray-400 text-sm">或</span>
      </div>

      <router-link
        to="/history"
        class="block text-center text-gray-500 hover:text-[#8b0000] underline text-sm"
      >
        查看历史记录 ({{ store.historyCount }})
      </router-link>
    </div>

    <!-- 手动起卦界面 -->
    <div v-if="mode === 'manual'">
      <button @click="goBack" class="text-gray-500 hover:text-gray-700 text-sm mb-4">&larr; 返回</button>
      <CoinToss @complete="onManualComplete" />
    </div>

    <!-- 手工指定界面 -->
    <div v-if="mode === 'specify'">
      <button @click="goBack" class="text-gray-500 hover:text-gray-700 text-sm mb-4">&larr; 返回</button>
      <ManualInput @complete="onSpecifyComplete" />
    </div>

    <!-- 备注输入对话框 -->
    <Teleport to="body">
      <div
        v-if="showNoteDialog"
        class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        @click.self="skipNote"
      >
        <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
          <h3 class="text-lg font-bold text-gray-800 mb-2">添加备注（可选）</h3>
          <p class="text-sm text-gray-500 mb-4">可以为此卦象添加备注文字，方便日后回顾</p>
          <textarea
            v-model="noteText"
            placeholder="例如：占问明日面试结果..."
            class="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#8b0000] focus:border-transparent"
            rows="4"
            maxlength="500"
          ></textarea>
          <div class="text-right text-xs text-gray-400 mt-1">{{ noteText.length }}/500</div>
          <div class="flex gap-2 mt-4">
            <button
              @click="skipNote"
              class="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              跳过
            </button>
            <button
              @click="confirmNote"
              class="flex-1 bg-[#8b0000] text-white py-2.5 rounded-lg text-sm font-bold hover:bg-red-900 transition-colors"
            >
              确认
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
