<script setup lang="ts">
import { ref } from 'vue'
import type { GuaDetail } from '../types'

const props = defineProps<{
  gua: GuaDetail
  title?: string
  showGuaci?: boolean
  showShiYing?: boolean
  showDetail?: boolean
}>()

const detailOpen = ref(false)
</script>

<template>
  <div class="inline-block">
    <div v-if="title" class="text-center text-lg font-bold mb-2 text-[#8b0000]">
      {{ title }}
    </div>
    <div class="bg-[#faf5eb] border-2 border-[#8b7355] rounded-lg p-4 inline-block relative">
      <!-- 变爻标记 -->
      <div v-if="gua.yaos.some(y => y.yao.changing)" class="absolute -top-2 -right-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
        动爻
      </div>
      <!-- 显示卦象: 从下到上, 但视觉上上卦在上 -->
      <div class="flex flex-col-reverse items-center gap-0">
        <template v-for="(y, i) in gua.yaos" :key="i">
          <!-- 上下卦之间的分隔线 -->
          <div v-if="i === 2" class="w-full flex items-center gap-2 my-1">
            <span class="flex-1 h-px bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent"></span>
            <span class="text-xs text-[#8b7355] font-bold tracking-wider whitespace-nowrap">{{ gua.upper }}{{ gua.lower }}</span>
            <span class="flex-1 h-px bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent"></span>
          </div>
          <div class="flex items-center gap-2 py-0.5 relative">
            <span class="w-6 text-right text-xs text-gray-500">
              {{ ['初', '二', '三', '四', '五', '上'][i] }}
              <span v-if="y.isShi && showShiYing" class="text-red-600 font-bold">世</span>
              <span v-else-if="y.isYing && showShiYing" class="text-blue-600 font-bold">应</span>
            </span>
            <div class="flex items-center relative">
              <!-- 阴爻 -->
              <div v-if="!y.yao.yang" class="flex items-center gap-1">
                <div class="w-6 h-1 bg-blue-600 rounded"></div>
                <div class="w-2"></div>
                <div class="w-6 h-1 bg-blue-600 rounded"></div>
              </div>
              <!-- 阳爻 -->
              <div v-else class="w-14 h-1 bg-red-600 rounded"></div>
              <!-- 动爻标记 -->
              <span v-if="y.yao.changing" class="ml-2 text-[#c00] font-bold">→</span>
            </div>
            <span class="w-16 text-xs text-gray-500">
              {{ y.najia.gan }}{{ y.najia.zhi }}
            </span>
          </div>
          <!-- 伏神标注 -->
          <div v-if="y.fushen" class="text-xs text-center" style="font-size: 0.85em; margin-top: 2px;">
            <span style="color: #999;">↑</span>
            <span style="color: #999;"> 伏神：{{ y.fushen.liuqin }}{{ y.fushen.zhi }}{{ y.fushen.wuxing }}</span>
          </div>
        </template>
      </div>
      <div class="text-center mt-2 text-sm font-bold text-gray-700">
        {{ gua.name }}
      </div>
      <div v-if="showGuaci && gua.guaci" class="text-center mt-1 text-xs text-gray-500 italic max-w-[200px]">
        {{ gua.guaci }}
      </div>

      <!-- 彖传象传（折叠） -->
      <div v-if="showDetail && (gua.tuancizhuan || gua.xiangzhuan)" class="mt-2 border-t border-[#d4c5a9] pt-2">
        <button @click="detailOpen = !detailOpen" class="text-xs text-[#8b0000] hover:underline flex items-center gap-1 mx-auto">
          <span>{{ detailOpen ? '△' : '▽' }}</span>
          <span>十翼</span>
        </button>
        <div v-if="detailOpen" class="mt-2 space-y-2 text-xs text-gray-600 leading-relaxed max-w-[240px]">
          <div v-if="gua.tuancizhuan">
            <span class="font-bold text-[#8b0000]">彖曰：</span>
            <span>{{ gua.tuancizhuan }}</span>
          </div>
          <div v-if="gua.xiangzhuan">
            <span class="font-bold text-[#8b0000]">象曰：</span>
            <span>{{ gua.xiangzhuan }}</span>
          </div>
          <div v-if="gua.yaoxiang?.length">
            <div class="font-bold text-[#8b0000] mb-1">小象传：</div>
            <div v-for="(yx, i) in gua.yaoxiang" :key="i" class="pl-2 border-l-2 border-[#d4c5a9]">
              <span class="text-gray-400">{{ ['初', '二', '三', '四', '五', '上'][i] }}:</span>
              {{ yx }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
