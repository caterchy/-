<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { BaZi, KongWang } from '../types'
import { formatBaZi } from '../engine/bazi'
import { getSolarTermDates, getCurrentSolarTerm, getDaysSinceSolarTerm } from '../data/jieqi'
import { usePaipanStore } from '../stores/paipan'

const props = defineProps<{
  bazi: BaZi
  timestamp: Date
  kongwang: KongWang
}>()

const store = usePaipanStore()
const displayOptions = store.displayOptions

const emit = defineEmits<{
  change: [date: Date]
}>()

const dateTimeStr = ref('')
const isEditing = ref(false)

onMounted(() => {
  dateTimeStr.value = formatDateTimeLocal(props.timestamp)
})

function formatDateTimeLocal(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${d}T${h}:${min}`
}

function onDateTimeChange() {
  if (!dateTimeStr.value) return
  const date = new Date(dateTimeStr.value)
  if (!isNaN(date.getTime())) {
    emit('change', date)
  }
}

function toggleEdit() {
  if (isEditing.value) {
    onDateTimeChange()
  }
  isEditing.value = !isEditing.value
}

function formatTime(date: Date): string {
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const currentTerm = getCurrentSolarTerm(props.timestamp)
const daysSinceTerm = getDaysSinceSolarTerm(props.timestamp)

let jieqiText: string
if (currentTerm) {
  jieqiText = `${currentTerm.name}（${currentTerm.month}月${currentTerm.day}日 ${String(currentTerm.hour).padStart(2, '0')}:${String(currentTerm.minute).padStart(2, '0')}）`
} else {
  jieqiText = '—'
}

/** 获取当前节气的结束日期 */
function getNextTermDate(): string {
  const year = props.timestamp.getFullYear()
  const terms = getSolarTermDates(year)
  if (!currentTerm) return ''
  const nextIdx = terms.findIndex(t => t.index === currentTerm.index) + 1
  if (nextIdx > 0 && nextIdx < terms.length) {
    const nextTerm = terms[nextIdx]
    return `${nextTerm.month}月${nextTerm.day}日`
  }
  return ''
}

const currentTermRange = (() => {
  if (!currentTerm) return ''
  const end = getNextTermDate()
  if (!end) return ''
  return `${currentTerm.month}月${currentTerm.day}日 — ${end}`
})()
</script>

<template>
  <div class="card p-4">
    <div class="space-y-3">
      <!-- 第一行：起卦时间 -->
      <div class="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span class="text-gray-500">起卦时间:</span>
          <button @click="toggleEdit" class="ml-2 font-medium hover:text-[#8b0000] transition-colors cursor-pointer" :title="isEditing ? '保存' : '修改'">
            {{ isEditing ? '✏️' : '' }}
          </button>
          <input
            v-if="isEditing"
            v-model="dateTimeStr"
            type="datetime-local"
            @change="onDateTimeChange"
            class="ml-2 border rounded px-2 py-1 text-sm"
            style="border-color: var(--border-color);"
          />
          <span v-else class="ml-2 font-medium">{{ formatTime(timestamp) }}</span>
        </div>
        <div>
          <span class="text-gray-500">节气:</span>
          <span class="ml-2 text-green-700 font-medium">{{ jieqiText }}</span>
          <span v-if="currentTerm && daysSinceTerm > 0" class="ml-1 text-xs text-gray-400">
            (已过 {{ daysSinceTerm }} 天)
          </span>
          <span v-if="currentTermRange" class="ml-2 text-xs text-gray-400">
            区间：{{ currentTermRange }}
          </span>
        </div>
      </div>

      <!-- 第二组：四柱八字和月建日辰 -->
      <div class="border-t pt-3 space-y-2" :style="{ borderColor: 'var(--border-color)' }">
        <div class="flex items-center gap-2">
          <span class="text-xs font-medium text-gray-400 uppercase tracking-wider">四柱</span>
          <span class="flex-1 h-px" :style="{ background: 'var(--border-color)' }"></span>
        </div>
        <div>
          <span class="text-gray-500">八字:</span>
          <span class="ml-2 font-mono font-bold text-[#8b0000] text-lg">{{ formatBaZi(bazi) }}</span>
        </div>
        <div class="flex flex-wrap gap-4 text-sm">
          <div class="bg-orange-50 border rounded px-3 py-1.5" style="border-color: var(--border-color);">
            <span class="text-gray-500 text-xs">月建</span>
            <span class="ml-1 font-bold text-orange-700 text-lg">{{ bazi.yue.zhi }}</span>
            <span class="text-gray-400 text-xs">({{ bazi.yue.gan }}{{ bazi.yue.zhi }} {{ bazi.yue.wuxing }})</span>
          </div>
          <div class="bg-orange-50 border rounded px-3 py-1.5" style="border-color: var(--border-color);">
            <span class="text-gray-500 text-xs">日辰</span>
            <span class="ml-1 font-bold text-orange-700 text-lg">{{ bazi.ri.zhi }}</span>
            <span class="text-gray-400 text-xs">({{ bazi.ri.gan }}{{ bazi.ri.zhi }} {{ bazi.ri.wuxing }})</span>
          </div>
        </div>
      </div>

      <!-- 第三组：其他柱支 -->
      <div class="border-t pt-3 space-y-2" :style="{ borderColor: 'var(--border-color)' }">
        <div class="flex items-center gap-2">
          <span class="text-xs font-medium text-gray-400 uppercase tracking-wider">柱支</span>
          <span class="flex-1 h-px" :style="{ background: 'var(--border-color)' }"></span>
        </div>
        <div class="grid grid-cols-2 gap-3 text-sm text-gray-600">
          <div class="bg-gray-50 rounded px-3 py-1.5" style="border-radius: var(--radius);">
            <span class="text-gray-400 text-xs">年柱</span>
            <span class="ml-2 font-medium">{{ bazi.nian.gan }}{{ bazi.nian.zhi }}（{{ bazi.nian.wuxing }}）</span>
          </div>
          <div class="bg-gray-50 rounded px-3 py-1.5" style="border-radius: var(--radius);">
            <span class="text-gray-400 text-xs">时柱</span>
            <span class="ml-2 font-medium">{{ bazi.shi.gan }}{{ bazi.shi.zhi }}（{{ bazi.shi.wuxing }}）</span>
          </div>
        </div>
      </div>

      <!-- 第四组：空亡信息 -->
      <div v-if="displayOptions.showKongwang" class="border-t pt-3" :style="{ borderColor: 'var(--border-color)' }">
        <div class="flex items-center gap-2 mb-1.5">
          <span class="text-xs font-medium text-gray-400 uppercase tracking-wider">神煞</span>
          <span class="flex-1 h-px" :style="{ background: 'var(--border-color)' }"></span>
        </div>
        <div class="text-sm">
          <span class="text-gray-500">空亡:</span>
          <span class="ml-2 font-bold text-red-600">{{ kongwang.zhi1 }}{{ kongwang.zhi2 }}</span>
          <span v-if="kongwang.xun" class="ml-2 text-gray-400">（{{ kongwang.xun }}旬）</span>
        </div>
      </div>
    </div>
  </div>
</template>
