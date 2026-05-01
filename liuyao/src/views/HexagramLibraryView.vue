<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { GuaGong, Yao, YaoType } from '../types'
import { ALL_HEXAGRAMS, getHexagramsByPalace } from '../data/hexagrams'
import type { HexagramInfo } from '../data/hexagrams'
import { GUA_WU_XING } from '../data/bazi'
import { buildPaipanResult } from '../engine/paipan'
import { usePaipanStore } from '../stores/paipan'

const router = useRouter()
const store = usePaipanStore()

const PALACE_ORDER: GuaGong[] = ['乾', '兑', '离', '震', '巽', '坎', '艮', '坤']
const PALACE_LABELS: Record<GuaGong, string> = {
  '乾': '乾宫',
  '兑': '兑宫',
  '离': '离宫',
  '震': '震宫',
  '巽': '巽宫',
  '坎': '坎宫',
  '艮': '艮宫',
  '坤': '坤宫',
}
const POSITION_LABELS = ['初', '二', '三', '四', '五', '上']

const searchQuery = ref('')
const selectedHexagram = ref<HexagramInfo | null>(null)
const showModal = ref(false)

const filteredPalaces = computed(() => {
  const result: Array<{ palace: GuaGong; hexagrams: HexagramInfo[] }> = []
  for (const palace of PALACE_ORDER) {
    let hexagrams = getHexagramsByPalace(palace)
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.trim()
      hexagrams = hexagrams.filter(h => h.name.includes(q) || h.guaci.includes(q))
    }
    if (hexagrams.length > 0) {
      result.push({ palace, hexagrams })
    }
  }
  return result
})

function getPalaceBg(palace: GuaGong): string {
  const map: Record<GuaGong, string> = {
    '乾': 'bg-red-50',
    '兑': 'bg-orange-50',
    '离': 'bg-rose-50',
    '震': 'bg-green-50',
    '巽': 'bg-emerald-50',
    '坎': 'bg-blue-50',
    '艮': 'bg-yellow-50',
    '坤': 'bg-amber-50',
  }
  return map[palace] || 'bg-gray-50'
}

function getPalaceBorder(palace: GuaGong): string {
  const map: Record<GuaGong, string> = {
    '乾': 'border-red-300',
    '兑': 'border-orange-300',
    '离': 'border-rose-300',
    '震': 'border-green-300',
    '巽': 'border-emerald-300',
    '坎': 'border-blue-300',
    '艮': 'border-yellow-300',
    '坤': 'border-amber-300',
  }
  return map[palace] || 'border-gray-300'
}

function openDetail(hex: HexagramInfo) {
  selectedHexagram.value = hex
  showModal.value = true
}

function closeDetail() {
  showModal.value = false
  selectedHexagram.value = null
}

function useHexagram(hex: HexagramInfo) {
  // 将六位二进制码转为 Yao 数组（无动爻，全静卦）
  // code[0..5] = 上卦上爻...下卦初爻 (top to bottom)
  // yaos[0] = 初爻 (bottom), yaos[5] = 上爻 (top)
  const yaos: Yao[] = []
  for (let i = 0; i < 6; i++) {
    const bit = hex.code[5 - i] // reverse: map from display order to yaos array order
    const yang = bit === '1'
    yaos.push({
      yang,
      changing: false,
      type: (yang ? '少阳' : '少阴') as YaoType,
    })
  }

  const result = buildPaipanResult(yaos)
  store.setResult(result)
  store.saveToHistory(result)
  closeDetail()
  router.push('/result')
}

function goBack() {
  router.push('/')
}
</script>

<template>
  <div class="space-y-4 pb-20">
    <!-- 头部 -->
    <div class="flex items-center justify-between">
      <button @click="goBack" class="text-gray-500 hover:text-gray-700 text-sm">&larr; 返回</button>
      <h2 class="text-lg font-bold text-gray-700">六十四卦象库</h2>
      <div class="w-12"></div>
    </div>

    <!-- 搜索栏 -->
    <div class="relative">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索卦名或卦辞..."
        class="w-full border border-gray-200 rounded-xl px-4 py-2.5 pl-10 text-sm bg-white
               focus:outline-none focus:ring-2 focus:ring-[#8b0000]/30 focus:border-[#8b0000]/50
               transition-all duration-200"
      />
      <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <button
        v-if="searchQuery"
        @click="searchQuery = ''"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
      >
        ✕
      </button>
    </div>

    <!-- 统计 -->
    <div class="text-xs text-gray-400 text-center">
      共 {{ ALL_HEXAGRAMS.length }} 卦
      <span v-if="searchQuery">，搜索到 {{ filteredPalaces.reduce((s, p) => s + p.hexagrams.length, 0) }} 卦</span>
    </div>

    <!-- 八宫分组展示 -->
    <div v-for="group in filteredPalaces" :key="group.palace" class="space-y-2">
      <!-- 宫标题 -->
      <div
        :class="[getPalaceBg(group.palace), getPalaceBorder(group.palace)]"
        class="rounded-lg border px-3 py-2"
      >
        <span class="font-bold text-gray-700">{{ PALACE_LABELS[group.palace] }}</span>
        <span class="text-gray-400 text-xs ml-2">（{{ GUA_WU_XING[group.palace] }}）</span>
        <span class="text-gray-300 text-xs ml-1">{{ group.hexagrams.length }}卦</span>
      </div>

      <!-- 卦卡片网格 -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        <div
          v-for="hex in group.hexagrams"
          :key="hex.code"
          @click="openDetail(hex)"
          class="bg-white rounded-lg border border-gray-100 shadow-sm p-3 cursor-pointer
                 hover:shadow-md hover:border-[#8b0000]/20 hover:-translate-y-0.5
                 active:scale-[0.98] transition-all duration-200 relative"
        >
          <!-- 卦序编号 -->
          <span class="absolute top-1 right-2 text-[10px] text-gray-300 font-mono">
            {{ ALL_HEXAGRAMS.indexOf(hex) + 1 }}
          </span>

          <!-- 卦名 -->
          <div class="text-base font-bold text-gray-800 mb-1.5">{{ hex.name }}</div>

          <!-- 卦画 (CSS 简化线条) -->
          <div class="flex flex-col items-center mb-1.5 space-y-0.5">
            <div v-for="(bit, bi) in hex.code" :key="bi">
              <div v-if="bit === '1'" class="h-1 bg-gray-700 rounded w-10 my-0.5"></div>
              <div v-else class="flex gap-0.5 justify-center my-0.5">
                <div class="h-1 bg-gray-700 rounded w-[18px]"></div>
                <div class="h-1 bg-gray-700 rounded w-[18px]"></div>
              </div>
            </div>
          </div>

          <!-- 卦辞 -->
          <div class="text-[11px] text-gray-400 truncate leading-relaxed">{{ hex.guaci }}</div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredPalaces.length === 0" class="text-center py-12 text-gray-400 text-sm">
      未找到匹配的卦象
    </div>

    <!-- 卦象详情弹窗 -->
    <teleport to="body">
      <transition name="modal-fade">
        <div
          v-if="showModal && selectedHexagram"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @click.self="closeDetail"
        >
          <!-- 遮罩 -->
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

          <!-- 弹窗内容 -->
          <div class="relative bg-[#faf5eb] border-2 border-[#8b7355] rounded-xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto">
            <!-- 关闭按钮 -->
            <button
              @click="closeDetail"
              class="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-white/80 text-gray-400 hover:text-gray-600 hover:bg-white transition-all text-sm z-10"
            >
              ✕
            </button>

            <!-- 卦名 + 卦序 -->
            <div class="bg-[#8b0000] text-white px-5 py-3 rounded-t-xl">
              <div class="flex items-center justify-between">
                <span class="text-xl font-bold tracking-wider">{{ selectedHexagram.name }}</span>
                <span class="text-sm text-white/70 font-mono">第 {{ ALL_HEXAGRAMS.indexOf(selectedHexagram) + 1 }} 卦</span>
              </div>
            </div>

            <div class="p-5 space-y-4">
              <!-- 卦画 -->
              <div class="flex flex-col items-center py-2 space-y-0.5">
                <div v-for="(bit, bi) in selectedHexagram.code" :key="bi">
                  <div v-if="bit === '1'" class="h-1.5 bg-gray-700 rounded w-24 my-0.5"></div>
                  <div v-else class="flex gap-1 justify-center my-0.5">
                    <div class="h-1.5 bg-gray-700 rounded w-[44px]"></div>
                    <div class="h-1.5 bg-gray-700 rounded w-[44px]"></div>
                  </div>
                </div>
              </div>

              <!-- 基本信息 -->
              <div class="grid grid-cols-2 gap-2 text-sm">
                <div class="bg-white/70 rounded-lg px-3 py-1.5">
                  <span class="text-gray-400 text-xs">上卦</span>
                  <div class="font-medium text-gray-700">{{ selectedHexagram.upper }}</div>
                </div>
                <div class="bg-white/70 rounded-lg px-3 py-1.5">
                  <span class="text-gray-400 text-xs">下卦</span>
                  <div class="font-medium text-gray-700">{{ selectedHexagram.lower }}</div>
                </div>
                <div class="bg-white/70 rounded-lg px-3 py-1.5">
                  <span class="text-gray-400 text-xs">卦宫</span>
                  <div class="font-medium text-gray-700">{{ PALACE_LABELS[selectedHexagram.palace] }}（{{ GUA_WU_XING[selectedHexagram.palace] }}）</div>
                </div>
                <div class="bg-white/70 rounded-lg px-3 py-1.5">
                  <span class="text-gray-400 text-xs">宫位</span>
                  <div class="font-medium text-gray-700">
                    {{ ['纯卦', '一世', '二世', '三世', '四世', '五世', '游魂', '归魂'][selectedHexagram.palacePos] }}
                  </div>
                </div>
              </div>

              <!-- 卦辞 -->
              <div>
                <div class="text-sm font-bold text-gray-700 mb-1">卦辞</div>
                <p class="text-sm text-gray-600 leading-relaxed bg-white/50 rounded-lg px-3 py-2">{{ selectedHexagram.guaci }}</p>
              </div>

              <!-- 彖传 -->
              <div v-if="selectedHexagram.tuancizhuan">
                <div class="text-sm font-bold text-gray-700 mb-1">彖传</div>
                <p class="text-sm text-gray-600 leading-relaxed bg-white/50 rounded-lg px-3 py-2">{{ selectedHexagram.tuancizhuan }}</p>
              </div>

              <!-- 象传 -->
              <div v-if="selectedHexagram.xiangzhuan">
                <div class="text-sm font-bold text-gray-700 mb-1">象传</div>
                <p class="text-sm text-gray-600 leading-relaxed bg-white/50 rounded-lg px-3 py-2">{{ selectedHexagram.xiangzhuan }}</p>
              </div>

              <!-- 爻辞 -->
              <div>
                <div class="text-sm font-bold text-gray-700 mb-2">爻辞</div>
                <div class="space-y-1.5">
                  <div
                    v-for="(yc, yi) in selectedHexagram.yaoci"
                    :key="yi"
                    class="flex gap-2 text-sm"
                  >
                    <span class="text-gray-400 w-6 shrink-0">{{ POSITION_LABELS[yi] }}</span>
                    <span class="text-gray-600">{{ yc }}</span>
                  </div>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="flex gap-3 pt-2">
                <button
                  @click="closeDetail"
                  class="flex-1 border-2 border-gray-200 text-gray-500 py-2.5 rounded-xl text-sm font-bold
                         hover:border-gray-300 hover:text-gray-600 active:scale-[0.98]
                         transition-all duration-200"
                >
                  关闭
                </button>
                <button
                  @click="useHexagram(selectedHexagram)"
                  class="flex-1 bg-[#8b0000] text-white py-2.5 rounded-xl text-sm font-bold
                         hover:bg-red-900 active:scale-[0.98]
                         transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  以此卦起卦
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.25s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-from > div:last-child,
.modal-fade-leave-to > div:last-child {
  transform: scale(0.95);
}
</style>
