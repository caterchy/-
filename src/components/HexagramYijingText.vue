<script setup lang="ts">
import { ref } from 'vue'
import type { GuaDetail } from '../types'

const props = defineProps<{
  gua: GuaDetail
}>()

const yaociOpen = ref(false)

const POSITION_NAMES = ['初', '二', '三', '四', '五', '上']
</script>

<template>
  <div>
    <div class="font-bold text-gray-700 mb-1">{{ gua.name }}</div>
    <div class="text-gray-600 leading-relaxed space-y-1">
      <p><span class="font-medium text-gray-500">卦辞：</span>{{ gua.guaci }}</p>
      <p v-if="gua.tuancizhuan"><span class="font-medium text-gray-500">彖传：</span>{{ gua.tuancizhuan }}</p>
      <p v-if="gua.xiangzhuan"><span class="font-medium text-gray-500">象传：</span>{{ gua.xiangzhuan }}</p>
    </div>

    <!-- 爻辞（可折叠） -->
    <div class="mt-2 border-t border-gray-100 pt-2">
      <button
        @click="yaociOpen = !yaociOpen"
        class="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        style="background: none; border: none; padding: 0; cursor: pointer;"
      >
        <span>{{ yaociOpen ? '收起' : '展开' }} 爻辞 ({{ gua.yaos.length }}条)</span>
      </button>
      <div v-if="yaociOpen" class="mt-2 space-y-1.5">
        <div
          v-for="(y, i) in gua.yaos"
          :key="i"
          class="pl-2 border-l-2 border-gray-200 text-xs"
        >
          <div class="flex items-baseline gap-1.5">
            <span class="font-medium text-gray-500 min-w-[2em]">{{ POSITION_NAMES[i] }}爻：</span>
            <span :class="y.yao.changing ? 'text-green-700 font-medium' : 'text-gray-700'">
              {{ gua.yaoci?.[i] || '—' }}
            </span>
          </div>
          <div v-if="gua.yaoxiang?.[i]" class="ml-[2em] text-gray-400">
            象曰：{{ gua.yaoxiang[i] }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
