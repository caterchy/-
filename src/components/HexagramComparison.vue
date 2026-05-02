<script setup lang="ts">
import type { GuaDetail, Yao } from '../types'
import { computed } from 'vue'

const props = defineProps<{
  original: GuaDetail
  changed?: GuaDetail
}>()

const POSITION_NAMES = ['初', '二', '三', '四', '五', '上']

/** 获取爻的显示符号 */
function getYaoSymbol(yao: Yao): string {
  if (yao.changing) {
    return yao.yang ? '○' : '×'
  }
  return yao.yang ? '⚊' : '⚋'
}

/** 检查这个位置是否是变爻 */
function isChangingPosition(index: number): boolean {
  return props.original.yaos[index].yao.changing
}

/** 是否有变爻 */
const hasChangingLines = computed(() => {
  return props.changed && props.original.yaos.some((y) => y.yao.changing)
})

/** 卦宫变化信息 */
const gongChange = computed(() => {
  if (!props.changed) return null
  return {
    orig: props.original.gong,
    changed: props.changed.gong,
    same: props.original.gong === props.changed.gong,
    origWuxing: props.original.gongWuxing,
    changedWuxing: props.changed.gongWuxing,
  }
})

/** 变爻变化列表 */
const changingDetails = computed(() => {
  if (!props.changed) return []
  return props.original.yaos
    .map((yao, i) => ({
      index: i,
      position: POSITION_NAMES[i],
      original: yao,
      changed: props.changed!.yaos[i],
      isChanging: yao.yao.changing,
    }))
    .filter(item => item.isChanging)
})
</script>

<template>
  <div class="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-orange-200 rounded-lg p-4 space-y-4">
    <!-- 标题 -->
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-bold text-[#8b0000]">卦象对比</h3>
      <span v-if="changed" class="text-xs text-gray-500">变爻用 <span class="text-red-500 font-bold">●</span> 标记</span>
    </div>

    <!-- 配对标题行：本卦 → 变卦 + 卦宫变化 -->
    <div v-if="changed" class="text-center bg-white/70 rounded-lg border border-orange-200 p-3">
      <div class="text-base font-bold flex items-center justify-center flex-wrap gap-x-2">
        <span class="text-red-700">本卦：{{ original.name }}</span>
        <span class="text-orange-400 text-xl font-extrabold arrow-animate">→</span>
        <span class="text-green-700">变卦：{{ changed.name }}</span>
      </div>
      <div v-if="gongChange" class="text-xs text-gray-500 mt-1 flex items-center justify-center flex-wrap gap-x-1">
        <span>卦宫：</span>
        <span class="text-gray-700 font-medium">{{ gongChange.orig }}（{{ gongChange.origWuxing }}）</span>
        <span class="text-orange-300">→</span>
        <span class="text-gray-700 font-medium">{{ gongChange.changed }}（{{ gongChange.changedWuxing }}）</span>
        <span v-if="gongChange.same" class="text-green-600 ml-1 font-medium">（卦宫不变）</span>
        <span v-else class="text-orange-600 ml-1 font-medium">（卦宫变化）</span>
      </div>
    </div>

    <!-- 双卡片布局 -->
    <div class="flex flex-col md:flex-row items-stretch gap-3">
      <!-- 本卦卡片 -->
      <div class="flex-1 bg-white rounded-lg border border-orange-300 overflow-hidden shadow-sm">
        <div class="bg-gradient-to-r from-red-800 to-red-700 text-white text-center text-sm font-bold py-1.5 tracking-wider">
          本　卦
        </div>
        <div class="p-2.5 space-y-1.5">
          <div
            v-for="(yao, i) in [...original.yaos].reverse()"
            :key="`orig-${i}`"
            class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all duration-200"
            :class="[
              isChangingPosition(original.yaos.length - 1 - i)
                ? 'bg-gradient-to-r from-yellow-100 via-amber-50 to-orange-50 border-2 border-red-400 shadow-md'
                : 'bg-gray-50 border border-gray-200',
            ]"
          >
            <span class="text-xs text-gray-500 font-medium w-7">{{ POSITION_NAMES[original.yaos.length - 1 - i] }}爻</span>
            <span
              class="font-bold"
              :class="[
                yao.yao.yang ? 'text-red-600' : 'text-blue-600',
                isChangingPosition(i) ? 'text-lg' : 'text-sm',
              ]"
            >
              {{ getYaoSymbol(yao.yao) }}
            </span>
            <span
              class="text-xs"
              :class="isChangingPosition(i) ? 'text-gray-700 font-medium' : 'text-gray-500'"
            >
              {{ yao.yao.type }}
            </span>
            <!-- 变爻标记：醒目红色 + 变字 -->
            <template v-if="isChangingPosition(i)">
              <span class="inline-flex items-center justify-center w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 text-white text-[10px] font-bold rounded-full shadow-sm ring-1 ring-red-300">
                变
              </span>
              <span class="text-red-500 text-base font-bold animate-pulse">→</span>
            </template>
          </div>
        </div>
      </div>

      <!-- 中间箭头（桌面端 →，移动端 ↓） -->
      <div v-if="changed" class="flex items-center justify-center text-3xl text-orange-400 font-bold py-1 select-none">
        <span class="hidden md:inline arrow-animate">→</span>
        <span class="md:hidden arrow-animate-vertical">↓</span>
      </div>

      <!-- 变卦卡片 -->
      <div v-if="changed" class="flex-1 bg-white rounded-lg border border-green-300 overflow-hidden shadow-sm">
        <div class="bg-gradient-to-r from-green-700 to-green-600 text-white text-center text-sm font-bold py-1.5 tracking-wider">
          变　卦
        </div>
        <div class="p-2.5 space-y-1.5">
          <div
            v-for="(yao, i) in [...changed.yaos].reverse()"
            :key="`changed-${i}`"
            class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all duration-200"
            :class="[
              isChangingPosition(changed.yaos.length - 1 - i)
                ? 'bg-green-50 border border-green-300'
                : 'bg-gray-50 border border-gray-200',
            ]"
          >
            <span class="text-xs text-gray-500 font-medium w-7">{{ POSITION_NAMES[changed.yaos.length - 1 - i] }}爻</span>
            <span
              class="text-sm font-medium"
              :class="yao.yao.yang ? 'text-red-600' : 'text-blue-600'"
            >
              {{ getYaoSymbol(yao.yao) }}
            </span>
            <span class="text-xs text-gray-500">{{ yao.yao.type }}</span>
            <!-- 变化结果标记 -->
            <span v-if="isChangingPosition(i)" class="inline-flex items-center justify-center w-5 h-5 bg-gradient-to-br from-green-500 to-green-600 text-white text-[10px] font-bold rounded-full shadow-sm ring-1 ring-green-300">
              化
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 无变爻提示 -->
    <div v-if="!changed" class="text-xs text-gray-500 italic pt-2 border-t border-orange-200">
      本卦无动爻，不产生变卦
    </div>

    <!-- 变爻变化详解 -->
    <div v-if="changed && hasChangingLines" class="pt-3 border-t border-orange-200">
      <h4 class="text-sm font-bold text-gray-700 mb-2.5 flex items-center gap-1.5">
        <span class="w-2 h-2 bg-red-500 rounded-full inline-block"></span>
        变爻变化详解
      </h4>
      <div class="space-y-1.5">
        <div
          v-for="detail in changingDetails"
          :key="detail.index"
          class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm px-3 py-2.5 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-orange-200 shadow-sm"
        >
          <span class="font-bold text-gray-700 w-10 shrink-0">{{ detail.position }}爻：</span>
          <span class="flex items-center gap-1.5">
            <span
              :class="[
                'font-medium',
                detail.original.yao.yang ? 'text-red-600' : 'text-blue-600',
              ]"
            >
              {{ detail.original.yao.type }}
            </span>
            <span class="text-orange-400 font-bold arrow-animate">→</span>
            <span
              :class="[
                'font-medium',
                detail.changed.yao.yang ? 'text-green-600' : 'text-blue-600',
              ]"
            >
              {{ detail.changed.yao.type }}
            </span>
          </span>
          <span class="text-gray-400 text-xs">
            （纳甲：{{ detail.original.najia.gan }}{{ detail.original.najia.zhi }} → {{ detail.changed.najia.gan }}{{ detail.changed.najia.zhi }}）
          </span>
          <span
            :class="[
              'text-xs px-1.5 py-0.5 rounded font-medium',
              detail.original.yao.yang
                ? 'bg-red-100 text-red-600'
                : 'bg-blue-100 text-blue-600',
            ]"
          >
            {{ detail.original.yao.yang ? '阳变阴' : '阴变阳' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes arrow-slide {
  0%, 100% { transform: translateX(0); opacity: 1; }
  50% { transform: translateX(4px); opacity: 0.6; }
}
@keyframes arrow-slide-vertical {
  0%, 100% { transform: translateY(0); opacity: 1; }
  50% { transform: translateY(4px); opacity: 0.6; }
}
.arrow-animate {
  animation: arrow-slide 1.5s ease-in-out infinite;
}
.arrow-animate-vertical {
  animation: arrow-slide-vertical 1.5s ease-in-out infinite;
}
</style>
