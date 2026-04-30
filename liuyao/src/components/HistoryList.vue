<script setup lang="ts">
import type { PaipanResult } from '../types'
import { formatBaZi } from '../engine/bazi'

defineProps<{
  items: PaipanResult[]
  showActions?: boolean
}>()

const emit = defineEmits<{
  view: [id: string]
  delete: [id: string]
  clear: []
}>()

function formatTime(date: Date): string {
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="space-y-2">
    <div v-if="items.length === 0" class="text-center text-gray-400 py-8">
      暂无历史记录
    </div>
    <div
      v-for="item in items"
      :key="item.id"
      class="bg-white rounded-lg shadow-sm border border-gray-200 p-3 flex items-center justify-between"
    >
      <div class="flex-1 cursor-pointer" @click="emit('view', item.id)">
        <div class="flex items-center gap-2">
          <span class="font-bold text-[#8b0000]">{{ item.original.name }}</span>
          <span v-if="item.changed" class="text-sm text-gray-500">
            → {{ item.changed.name }}
          </span>
        </div>
        <div class="text-xs text-gray-500 mt-1">
          <span>{{ formatTime(item.timestamp) }}</span>
          <span class="mx-1">|</span>
          <span class="font-mono">{{ formatBaZi(item.bazi) }}</span>
          <span v-if="item.note" class="mx-1">|</span>
          <span v-if="item.note" class="italic">「{{ item.note }}」</span>
        </div>
      </div>
      <div v-if="showActions" class="flex gap-2">
        <button
          @click="emit('delete', item.id)"
          class="text-red-500 hover:text-red-700 text-sm px-2"
        >
          删除
        </button>
      </div>
    </div>
    <div v-if="items.length > 0 && showActions" class="text-center pt-2">
      <button
        @click="emit('clear')"
        class="text-gray-400 hover:text-red-500 text-sm underline"
      >
        清空所有记录
      </button>
    </div>
  </div>
</template>
