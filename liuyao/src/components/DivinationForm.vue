<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Yao, DivinationMethod } from '../types'
import CommonDivinationHeader from './CommonDivinationHeader.vue'
import CoinToss from './CoinToss.vue'
import ManualInput from './ManualInput.vue'
import NumberDivination from './NumberDivination.vue'
import CharacterDivination from './CharacterDivination.vue'
import { divineByTime, divineByHexagram } from '../engine/divination'
import { ALL_HEXAGRAMS } from '../data/hexagrams'

const emit = defineEmits<{
  complete: [yaos: Yao[], method: DivinationMethod]
}>()

// --- Common header state ---
const questionType = ref('')
const questionText = ref('')
const gender = ref('')
const dateTimeStr = ref(formatDateTimeLocal(new Date()))

function formatDateTimeLocal(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${d}T${h}:${min}`
}

// --- Tabs ---
const tabs: { key: DivinationMethod; label: string }[] = [
  { key: 'coin', label: '摇钱' },
  { key: 'manual', label: '手工' },
  { key: 'auto', label: '自动' },
  { key: 'time', label: '时间' },
  { key: 'number', label: '数字' },
  { key: 'character', label: '汉字' },
  { key: 'hexagram', label: '卦名' },
]

const activeTab = ref<DivinationMethod>('coin')
const isLoading = ref(false)

// --- Hexagram form ---
const hexSearch = ref('')
const selectedHexagram = ref<string | null>(null)
const changedHexSearch = ref('')
const selectedChangedHexagram = ref<string | null>(null)
const dongYaos = ref<number[]>([])
const filteredHexagrams = computed(() => {
  if (!hexSearch.value.trim()) return ALL_HEXAGRAMS
  const q = hexSearch.value.trim()
  return ALL_HEXAGRAMS.filter(h => h.name.includes(q) || h.code.includes(q))
})
const filteredChangedHexagrams = computed(() => {
  if (!changedHexSearch.value.trim()) return ALL_HEXAGRAMS
  const q = changedHexSearch.value.trim()
  return ALL_HEXAGRAMS.filter(h => h.name.includes(q) || h.code.includes(q))
})
const selectedHexName = computed(() => {
  if (!selectedHexagram.value) return ''
  return ALL_HEXAGRAMS.find(h => h.code === selectedHexagram.value)?.name ?? ''
})
const selectedChangedHexName = computed(() => {
  if (!selectedChangedHexagram.value) return ''
  return ALL_HEXAGRAMS.find(h => h.code === selectedChangedHexagram.value)?.name ?? ''
})

function syncMovingFromHexagrams() {
  if (!selectedHexagram.value || !selectedChangedHexagram.value) return
  const origCode = selectedHexagram.value
  const changedCode = selectedChangedHexagram.value
  dongYaos.value = []
  for (let i = 0; i < 6; i++) {
    if (origCode[i] !== changedCode[i]) {
      dongYaos.value.push(i)
    }
  }
}

function toggleDongYao(pos: number) {
  const idx = dongYaos.value.indexOf(pos)
  if (idx === -1) {
    dongYaos.value.push(pos)
  } else {
    dongYaos.value.splice(idx, 1)
  }
}

// --- Methods ---
function onCoinComplete(yaos: Yao[]) {
  emit('complete', yaos, 'coin')
}

function onManualComplete(yaos: Yao[]) {
  emit('complete', yaos, 'manual')
}

function onNumberComplete(yaos: Yao[]) {
  emit('complete', yaos, 'number')
}

function onCharacterComplete(yaos: Yao[]) {
  emit('complete', yaos, 'character')
}

function startAuto() {
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
    emit('complete', [], 'auto')
  }, 800)
}

function startTime() {
  if (!dateTimeStr.value) return
  const date = new Date(dateTimeStr.value)
  if (isNaN(date.getTime())) return
  const yaos = divineByTime(date)
  emit('complete', yaos, 'time')
}

function startHexagram() {
  if (!selectedHexagram.value) return
  const dongPositions = dongYaos.value.length > 0 ? dongYaos.value : undefined
  const yaos = divineByHexagram(selectedHexagram.value, dongPositions)
  emit('complete', yaos, 'hexagram')
}

// --- Validation ---
const canSubmitHexagram = computed(() => !!selectedHexagram.value)
</script>

<template>
  <div class="bg-white rounded shadow-sm border overflow-hidden" style="border-color: var(--border-color);">
    <!-- Common Header -->
    <div class="px-4 pt-4 pb-2 border-b border-gray-100">
      <CommonDivinationHeader
        v-model:question-type="questionType"
        v-model:question-text="questionText"
        v-model:gender="gender"
        v-model:date-time="dateTimeStr"
      />
    </div>

    <!-- Method Tabs -->
    <div class="flex overflow-x-auto scrollbar-none bg-gray-50/50">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="activeTab = tab.key"
        class="shrink-0 px-4 py-3 text-sm font-bold transition-all duration-200 relative"
        :class="activeTab === tab.key
          ? 'text-[#8b0000] bg-white'
          : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'"
      >
        {{ tab.label }}
        <div
          v-if="activeTab === tab.key"
          class="absolute bottom-0 left-2 right-2 h-0.5 bg-[#8b0000] rounded-full"
        />
      </button>
    </div>

    <!-- Panel Content -->
    <div class="p-4 sm:p-5">
      <!-- 摇钱 -->
      <div v-if="activeTab === 'coin'">
        <CoinToss @complete="onCoinComplete" />
      </div>

      <!-- 手工指定 -->
      <div v-else-if="activeTab === 'manual'">
        <ManualInput @complete="onManualComplete" />
      </div>

      <!-- 自动起卦 -->
      <div v-else-if="activeTab === 'auto'" class="text-center py-8">
        <p class="text-gray-500 text-sm mb-2">静心默念所求之事</p>
        <p class="text-gray-400 text-xs mb-6">系统将随机生成卦象</p>
        <button
          @click="startAuto"
          :disabled="isLoading"
          class="bg-[#8b0000] text-white px-10 py-3 rounded-xl text-base font-bold
                 hover:bg-red-900 disabled:opacity-50 disabled:cursor-not-allowed
                 active:scale-[0.98] transition-all duration-200 shadow-sm"
        >
          <span v-if="isLoading" class="flex items-center gap-2">
            <span class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            起卦中...
          </span>
          <span v-else>开始起卦</span>
        </button>
      </div>

      <!-- 时间起卦 -->
      <div v-else-if="activeTab === 'time'" class="space-y-4">
        <p class="text-sm text-gray-500">使用当前时间自动推算卦象</p>
        <div>
          <label class="text-xs text-gray-500 mb-1 block">日期时间</label>
          <input
            v-model="dateTimeStr"
            type="datetime-local"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-[#8b0000]/30"
          />
        </div>
        <button
          @click="startTime"
          class="w-full bg-[#8b0000] text-white py-3 rounded-xl text-sm font-bold
                 hover:bg-red-900 active:scale-[0.98] transition-all duration-200 shadow-sm"
        >
          开始起卦
        </button>
      </div>

      <!-- 数字起卦 -->
      <div v-else-if="activeTab === 'number'">
        <NumberDivination @complete="onNumberComplete" />
      </div>

      <!-- 汉字起卦 -->
      <div v-else-if="activeTab === 'character'">
        <CharacterDivination @complete="onCharacterComplete" />
      </div>

      <!-- 卦名起卦 -->
      <div v-else-if="activeTab === 'hexagram'" class="space-y-4">
        <div>
          <label class="text-xs text-gray-500 mb-1 block">本卦</label>
          <input
            v-model="hexSearch"
            type="text"
            placeholder="搜索卦名或卦序..."
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2
                   focus:outline-none focus:ring-2 focus:ring-[#8b0000]/30"
          />
          <div class="max-h-40 overflow-y-auto border border-gray-100 rounded-lg bg-white">
            <button
              v-for="h in filteredHexagrams"
              :key="h.code"
              @click="selectedHexagram = h.code; hexSearch = h.name; syncMovingFromHexagrams()"
              class="w-full text-left px-3 py-1.5 text-sm transition-colors"
              :class="selectedHexagram === h.code
                ? 'bg-[#8b0000]/10 text-[#8b0000] font-bold'
                : 'text-gray-600 hover:bg-gray-50'"
            >
              {{ h.name }}
              <span class="text-gray-300 text-xs ml-1">({{ h.code }})</span>
            </button>
          </div>
        </div>

        <div>
          <label class="text-xs text-gray-500 mb-1 block">变卦（可选）</label>
          <input
            v-model="changedHexSearch"
            type="text"
            placeholder="搜索变卦..."
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2
                   focus:outline-none focus:ring-2 focus:ring-[#8b0000]/30"
          />
          <div class="max-h-40 overflow-y-auto border border-gray-100 rounded-lg bg-white">
            <button
              v-for="h in filteredChangedHexagrams"
              :key="h.code"
              @click="selectedChangedHexagram = h.code; changedHexSearch = h.name; syncMovingFromHexagrams()"
              class="w-full text-left px-3 py-1.5 text-sm transition-colors"
              :class="selectedChangedHexagram === h.code
                ? 'bg-[#8b0000]/10 text-[#8b0000] font-bold'
                : 'text-gray-600 hover:bg-gray-50'"
            >
              {{ h.name }}
              <span class="text-gray-300 text-xs ml-1">({{ h.code }})</span>
            </button>
          </div>
        </div>

        <div v-if="selectedHexagram">
          <label class="text-xs text-gray-500 mb-1 block">动爻（可多选）</label>
          <div class="flex gap-2 flex-wrap">
            <label
              v-for="i in 6"
              :key="i"
              class="flex items-center gap-1 px-3 py-2 rounded-lg border text-sm cursor-pointer select-none transition-all"
              :class="dongYaos.includes(i - 1)
                ? 'bg-green-50 border-green-400 text-green-700 font-bold'
                : 'border-gray-200 text-gray-500 hover:border-gray-300'"
            >
              <input
                type="checkbox"
                :checked="dongYaos.includes(i - 1)"
                @change="toggleDongYao(i - 1)"
                class="accent-green-600"
              />
              {{ ['初','二','三','四','五','上'][i - 1] }}
            </label>
            <button
              @click="dongYaos = []"
              class="px-3 py-2 rounded-lg border text-sm transition-all text-gray-400 hover:border-gray-300"
              :class="dongYaos.length === 0 ? 'bg-gray-100 border-gray-300 text-gray-600 font-bold' : ''"
            >
              静卦
            </button>
          </div>
        </div>

        <button
          @click="startHexagram"
          :disabled="!canSubmitHexagram"
          class="w-full bg-[#8b0000] text-white py-3 rounded-xl text-sm font-bold
                 hover:bg-red-900 disabled:opacity-40 disabled:cursor-not-allowed
                 active:scale-[0.98] transition-all duration-200 shadow-sm"
        >
          <span v-if="selectedHexagram && dongYaos.length > 0">以【{{ selectedHexName }}】变【{{ selectedChangedHexName || '...' }}】起卦</span>
          <span v-else-if="selectedHexagram">以【{{ selectedHexName }}】（静卦）起卦</span>
          <span v-else>请先选择卦象</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
