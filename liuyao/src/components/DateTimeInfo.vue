<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { BaZi, KongWang, BaGua, ShenShaType } from '../types'
import { calcTimeShenSha } from '../engine/shensha'
import type { TimeShenSha } from '../engine/shensha'
import { getCurrentSolarTerm, getDaysSinceSolarTerm, getNextJieQi } from '../data/jieqi'

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

const nextJieQi = getNextJieQi(props.timestamp)

function formatTermDate(date: Date): string {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
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
          <!-- 左列: 起卦时间 -->
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
        <div class="text-right">
          <!-- 右列: 节气 + 下一个节气 -->
          <div>
            <span class="text-gray-500">节气:</span>
            <span class="ml-2 text-green-700 font-medium">{{ jieqiText }}</span>
            <span v-if="currentTerm && daysSinceTerm > 0" class="ml-1 text-xs text-gray-400">
              (已过 {{ daysSinceTerm }} 天)
            </span>
          </div>
          <div v-if="nextJieQi" class="mt-1">
            <span class="text-gray-500">下一个节气：</span>
            <span class="text-green-700 font-medium">{{ nextJieQi.name }} {{ formatTermDate(nextJieQi.date) }}</span>
            <span class="ml-1 text-xs text-gray-400">（还有 {{ nextJieQi.daysUntil }} 天）</span>
          </div>
        </div>
      </div>
      <!-- 第二行: 干支 (full-width) -->
      <div class="text-sm">
        <span class="text-gray-500">干支：</span>
        <span class="ml-2 font-medium">{{ bazi.nian.gan }}{{ bazi.nian.zhi }}年
          {{ bazi.yue.gan }}{{ bazi.yue.zhi }}月
          {{ bazi.ri.gan }}{{ bazi.ri.zhi }}日
          {{ bazi.shi.gan }}{{ bazi.shi.zhi }}时</span>
      </div>

      <!-- 旬空/卦身/世身 -->
      <div class="border-t pt-3" :style="{ borderColor: 'var(--border-color)' }">
        <div class="flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <span><span class="text-gray-500">旬空：</span><span class="font-bold text-red-600">{{ kongwangText }}</span></span>
          <span><span class="text-gray-500">卦身：</span><span class="font-bold text-blue-600">{{ guaShenText }}</span></span>
          <span><span class="text-gray-500">世身：</span><span class="font-bold text-purple-600">{{ shiShenText }}</span></span>
        </div>
      </div>

      <!-- 第三组：神煞（可折叠） -->
      <div class="border-t pt-3" :style="{ borderColor: 'var(--border-color)' }">
        <!-- 折叠切换 -->
        <button
          @click="shenshaExpanded = !shenshaExpanded"
          class="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          style="background: none; border: none; padding: 0; cursor: pointer;"
        >
          <span v-if="!shenshaExpanded">展开 神煞</span>
          <span v-else>收起 神煞</span>
        </button>

        <!-- 3列网格（收起时显示前3个，展开时显示全部） -->
        <div v-if="collapsibleShensha.length > 0" class="mt-2 grid grid-cols-3 gap-x-3 gap-y-1">
          <template v-for="s in collapsibleShensha" :key="s.name">
            <div v-if="shenshaExpanded || collapsibleShensha.indexOf(s) < 3" class="text-sm px-2 py-0.5" style="color: #666;">
              <span class="text-gray-500">{{ getShenshaDisplayName(s.name) }}：</span>
              <span>{{ s.value }}</span>
            </div>
          </template>
        </div>
        <div v-if="!shenshaExpanded && collapsibleShensha.length > 3" class="mt-1 text-sm text-gray-400">
          ...
        </div>
        <div v-if="collapsibleShensha.length === 0" class="mt-1 text-sm text-gray-400">
          无
        </div>
      </div>
    </div>
  </div>
</template>
