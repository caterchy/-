<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { BaZi, KongWang, BaGua, ShenShaType } from '../types'
import { formatBaZi } from '../engine/bazi'
import { calcTimeShenSha } from '../engine/shensha'
import type { TimeShenSha } from '../engine/shensha'
import { getCurrentSolarTerm, getDaysSinceSolarTerm } from '../data/jieqi'

const props = defineProps<{
  bazi: BaZi
  timestamp: Date
  kongwang: KongWang
  /** 是否只读模式（ResultView中不可编辑） */
  readonly?: boolean
  /** 卦宫信息（用于计算世身/卦身） */
  palace?: BaGua
  palacePos?: number
}>()

const emit = defineEmits<{
  change: [date: Date]
}>()

const dateTimeStr = ref('')
const isEditing = ref(false)
const shenshaExpanded = ref(false)

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
  if (props.readonly) return
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


// ---- 神煞计算 ----
const hexagramInfo = computed(() => {
  if (props.palace && props.palacePos !== undefined) {
    return { palace: props.palace, palacePos: props.palacePos }
  }
  return undefined
})

const allShensha = computed<TimeShenSha[]>(() => {
  return calcTimeShenSha(props.bazi, hexagramInfo.value)
})

/** 旬空 — 单独展示 */
const kongwangText = computed(() => {
  if (!props.kongwang || !props.kongwang.xun) return '—'
  return `${props.kongwang.zhi1}${props.kongwang.zhi2}（${props.kongwang.xun}旬）`
})

/** 世身 - 单独展示 */
const shiShenText = computed(() => {
  const s = allShensha.value.find(s => s.name === '世身')
  return s ? s.value : '—'
})

/** 卦身 - 单独展示 */
const guaShenText = computed(() => {
  const s = allShensha.value.find(s => s.name === '卦身')
  return s ? s.value : '—'
})

/** 神煞列表（排除旬空/世身/卦身） */
const collapsibleShensha = computed(() => {
  return allShensha.value.filter(s => s.name !== '世身' && s.name !== '卦身')
})

/** 神煞显示名映射 */
function getShenshaDisplayName(name: ShenShaType): string {
  const map: Partial<Record<ShenShaType, string>> = {
    '桃花': '咸池',
    '天乙贵人': '贵人',
  }
  return map[name] || name
}
</script>

<template>
  <div class="card p-4">
    <div class="space-y-3">
      <!-- 第一行：起卦时间 -->
      <div class="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span class="text-gray-500">起卦时间:</span>
          <template v-if="!readonly">
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
          </template>
          <span v-else class="ml-2 font-medium">{{ formatTime(timestamp) }}</span>
        </div>
        <div>
          <span class="text-gray-500">节气:</span>
          <span class="ml-2 text-green-700 font-medium">{{ jieqiText }}</span>
          <span v-if="currentTerm && daysSinceTerm > 0" class="ml-1 text-xs text-gray-400">
            (已过 {{ daysSinceTerm }} 天)
          </span>
        </div>
      </div>

      <!-- 第二组：四柱八字 -->
      <div class="border-t pt-3 space-y-2" :style="{ borderColor: 'var(--border-color)' }">
        <div class="flex items-center gap-2">
          <span class="text-xs font-medium text-gray-400 uppercase tracking-wider">四柱</span>
          <span class="flex-1 h-px" :style="{ background: 'var(--border-color)' }"></span>
        </div>
        <div>
          <span class="text-gray-500">八字:</span>
          <span class="ml-2 font-mono font-bold text-[#8b0000] text-lg">{{ formatBaZi(bazi) }}</span>
        </div>

        <!-- 旬空/卦身/世身 - 独立显示，在八字下方 -->
        <div class="flex flex-wrap gap-4 text-sm">
          <div class="bg-red-50 border rounded px-3 py-1.5" style="border-color: var(--border-color);">
            <span class="text-gray-500 text-xs">旬空</span>
            <span class="ml-1 font-bold text-red-600">{{ kongwangText }}</span>
          </div>
          <div class="bg-blue-50 border rounded px-3 py-1.5" style="border-color: var(--border-color);">
            <span class="text-gray-500 text-xs">卦身</span>
            <span class="ml-1 font-bold text-blue-600">{{ guaShenText }}</span>
          </div>
          <div class="bg-purple-50 border rounded px-3 py-1.5" style="border-color: var(--border-color);">
            <span class="text-gray-500 text-xs">世身</span>
            <span class="ml-1 font-bold text-purple-600">{{ shiShenText }}</span>
          </div>
        </div>
      </div>

      <!-- 第三组：月建日辰 -->
      <div class="border-t pt-3 space-y-2" :style="{ borderColor: 'var(--border-color)' }">
        <div class="flex items-center gap-2">
          <span class="text-xs font-medium text-gray-400 uppercase tracking-wider">月日</span>
          <span class="flex-1 h-px" :style="{ background: 'var(--border-color)' }"></span>
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

      <!-- 第四组：神煞（可折叠） -->
      <div class="border-t pt-3" :style="{ borderColor: 'var(--border-color)' }">
        <!-- 折叠切换 - text link style -->
        <button
          @click="shenshaExpanded = !shenshaExpanded"
          class="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          style="background: none; border: none; padding: 0; cursor: pointer;"
        >
          <span v-if="!shenshaExpanded">展开 神煞</span>
          <span v-else>收起 神煞</span>
        </button>

        <!-- 展开列表 -->
        <div v-if="shenshaExpanded && collapsibleShensha.length > 0" class="mt-1 space-y-0.5">
          <div
            v-for="s in collapsibleShensha"
            :key="s.name"
            class="text-xs px-2 py-0.5"
            style="color: #666;"
          >
            {{ getShenshaDisplayName(s.name) }} — {{ s.value }}
          </div>
        </div>
        <div v-if="shenshaExpanded && collapsibleShensha.length === 0" class="mt-1 text-xs text-gray-400">
          无
        </div>
      </div>
    </div>
  </div>
</template>
