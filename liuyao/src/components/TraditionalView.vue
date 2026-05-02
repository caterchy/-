<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import type { GuaDetail, YaoDetail } from '../types'
import { usePaipanStore } from '../stores/paipan'

const props = defineProps<{
  original: GuaDetail
  changed?: GuaDetail
}>()

const store = usePaipanStore()
const { displayOptions } = storeToRefs(store)

const POSITION_NAMES = ['初', '二', '三', '四', '五', '上']

const expandedYaoPosition = ref<number | null>(null)

function toggleExpand(position: number) {
  if (expandedYaoPosition.value === position) {
    expandedYaoPosition.value = null
  } else {
    expandedYaoPosition.value = position
  }
}

/**
 * 生成纳甲详解说明文本
 */
function getNajaDetail(yao: YaoDetail, _gua: GuaDetail): string[] {
  const lines: string[] = []
  lines.push(`${yao.najia.gan}${yao.najia.zhi} ${yao.wuxing} — ${yao.liuqin}`)
  if (yao.wangshuai) {
    lines.push(`旺衰: ${yao.wangshuai}`)
  }
  if (yao.fushen) {
    lines.push(`伏神: ${yao.fushen.liuqin}${yao.fushen.gan}${yao.fushen.zhi} ${yao.fushen.wuxing}`)
  }
  return lines
}

/** Build row data: for each position (top-to-bottom display), show both original and changed */
const rows = Array.from({ length: 6 }, (_, i) => {
  const idx = 5 - i // top-to-bottom display order
  const origYao = props.original.yaos[idx]
  const changedYao = props.changed?.yaos[idx] ?? null
  return {
    pos: POSITION_NAMES[idx],
    posNum: idx + 1,
    orig: origYao,
    changed: changedYao,
  }
})

/** 六冲: 八纯卦 (palacePos === 0) */
function hasLiuChong(gua: GuaDetail): boolean {
  return gua.palacePos === 0
}
</script>

<template>
  <div class="card" style="background: #faf5eb; border-color: #8b7355;">
    <!-- Header: 本卦 | 变卦 -->
    <div class="grid grid-cols-2 text-xs text-gray-500 px-3 pt-2 pb-1 border-b bg-[#f0e8d8]" style="border-color: #d4c5a9;">
      <div class="text-center font-bold text-sm" style="color: #8b0000;">
        {{ original.gong }}宫{{ original.gongWuxing }} — {{ original.name }}
        <span v-if="hasLiuChong(original)" class="text-orange-600"> 六冲</span>
        <span v-if="original.palacePos === 6" class="text-purple-600">（游魂）</span>
        <span v-if="original.palacePos === 7" class="text-purple-600">（归魂）</span>
      </div>
      <div v-if="changed" class="text-center font-bold text-sm" style="color: #2e7d32;">
        变卦: {{ changed.gong }}宫{{ changed.gongWuxing }} — {{ changed.name }}
      </div>
      <div v-else class="text-center text-gray-400 text-sm">
        静卦 — 无变卦
      </div>
    </div>

    <!-- Rows: each row has left (本卦) and right (变卦) columns -->
    <div class="px-2 py-1">
      <div
        v-for="(row, idx) in rows"
        :key="idx"
        class="border-b border-dashed last:border-b-0"
        :class="idx % 2 === 0 ? 'bg-white/60' : 'bg-[#f5efe5]/60'"
        style="border-color: #e0d5c0;"
      >
        <div class="grid grid-cols-2 items-stretch gap-1 py-1.5">
          <!-- Left column: 本卦 -->
          <div class="flex items-center gap-0.5">
            <!-- 六神 -->
            <span class="text-xs font-bold w-10 text-center shrink-0" style="color: #333;">
              {{ row.orig.liushou }}
            </span>

            <!-- 六亲 -->
            <span class="text-sm font-medium px-1 rounded shrink-0" style="color: #333;">
              {{ row.orig.liuqin }}
            </span>

            <!-- 纳甲干支 + 五行 + 旺衰 -->
            <span
              class="text-sm cursor-pointer hover:text-amber-600 transition-colors duration-200 shrink-0"
              :class="{ 'text-amber-600 font-medium': expandedYaoPosition === row.orig.position }"
              @click.stop="toggleExpand(row.orig.position)"
              style="color: #333;"
            >
              {{ row.orig.najia.gan }}{{ row.orig.najia.zhi }}<span class="text-gray-400">{{ row.orig.wuxing }}</span>
              <span v-if="displayOptions.showWangShuai && row.orig.wangshuai" class="text-xs text-gray-500 ml-0.5">{{ row.orig.wangshuai }}</span>
            </span>

            <!-- 爻线 -->
            <span class="font-mono text-lg shrink-0" style="color: #333; letter-spacing: 0.1em;">
              {{ row.orig.yao.yang ? '⚊' : '⚋' }}
            </span>

            <!-- 空亡 -->
            <span v-if="displayOptions.showKongwang && row.orig.isEmpty" class="text-red-400 text-xs shrink-0">空</span>

            <!-- 暗动（受 showAnDong 开关控制） -->
            <span v-if="displayOptions.showAnDong && row.orig.isAnDong" class="text-blue-500 text-xs shrink-0 font-bold">
              <span class="inline-flex items-center justify-center w-3.5 h-3.5 bg-blue-500 text-white text-[9px] font-bold rounded">暗</span>
              <span class="text-blue-400">({{ row.orig.anDongReason }})</span>
            </span>

            <!-- 世应 -->
            <span class="text-center text-xs shrink-0 ml-auto min-w-[2em]">
              <span v-if="row.orig.isShi" class="font-bold">世</span>
              <span v-else-if="row.orig.isYing" class="font-bold">应</span>
            </span>

            <!-- 动爻标记 -->
            <span v-if="row.orig.yao.changing" class="text-[#c00] font-bold text-sm shrink-0">
              →
            </span>
          </div>

          <!-- Right column: 变卦 (no 六神) -->
          <div v-if="row.changed" class="flex items-center gap-0.5">
            <!-- 六神 placeholder for alignment -->
            <span class="w-10 shrink-0"></span>

            <!-- 六亲 -->
            <span class="text-sm font-medium px-1 rounded shrink-0" style="color: #333;">
              {{ row.changed.liuqin }}
            </span>

            <!-- 纳甲干支 + 五行 + 旺衰 -->
            <span
              class="text-sm cursor-pointer hover:text-amber-600 transition-colors duration-200 shrink-0"
              :class="{ 'text-amber-600 font-medium': expandedYaoPosition === (row.changed.position + 10) }"
              @click.stop="toggleExpand(row.changed.position + 10)"
              style="color: #333;"
            >
              {{ row.changed.najia.gan }}{{ row.changed.najia.zhi }}<span class="text-gray-400">{{ row.changed.wuxing }}</span>
              <span v-if="displayOptions.showWangShuai && row.changed.wangshuai" class="text-xs text-gray-500 ml-0.5">{{ row.changed.wangshuai }}</span>
            </span>

            <!-- 爻线 -->
            <span class="font-mono text-lg shrink-0" style="color: #333; letter-spacing: 0.1em;">
              {{ row.changed.yao.yang ? '⚊' : '⚋' }}
            </span>

            <!-- 空亡 -->
            <span v-if="displayOptions.showKongwang && row.changed.isEmpty" class="text-red-400 text-xs shrink-0">空</span>

            <!-- 世应 -->
            <span class="text-center text-xs shrink-0 ml-auto min-w-[2em]">
              <span v-if="row.changed.isShi" class="font-bold">世</span>
              <span v-else-if="row.changed.isYing" class="font-bold">应</span>
            </span>

            <!-- 动爻标记 -->
            <span v-if="row.changed.yao.changing" class="text-[#c00] font-bold text-sm shrink-0">
              →
            </span>
          </div>
          <div v-else class="flex items-center justify-center text-gray-300 text-xs">
            —
          </div>
        </div>

        <!-- 伏神 row (only when fushen exists) -->
        <div v-if="row.orig.fushen" class="flex items-center gap-1 ml-10 mb-1">
          <span class="text-xs text-gray-400">↑ 伏神:{{ row.orig.fushen.liuqin }}{{ row.orig.fushen.gan }}{{ row.orig.fushen.zhi }}{{ row.orig.fushen.wuxing }}</span>
        </div>

        <!-- 纳甲详解 (collapsible) -->
        <transition name="naja-fade">
          <div
            v-if="expandedYaoPosition === row.orig.position"
            class="ml-12 mr-2 mb-1.5 bg-amber-50 border-l-2 border-amber-400 rounded-r px-3 py-2 text-xs space-y-0.5"
          >
            <p v-for="(line, li) in getNajaDetail(row.orig, original)" :key="li" class="text-gray-700 leading-relaxed">
              {{ line }}
            </p>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.naja-fade-enter-active,
.naja-fade-leave-active {
  transition: all 0.2s ease;
}
.naja-fade-enter-from,
.naja-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
