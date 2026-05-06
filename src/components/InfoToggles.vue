<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { usePaipanStore } from '../stores/paipan'

const store = usePaipanStore()
const { displayOptions } = storeToRefs(store)
</script>

<template>
  <div class="bg-white rounded-lg shadow p-4">
    <h3 class="text-sm font-bold text-gray-700 mb-3">信息显示开关</h3>
    <div class="flex flex-wrap gap-3">
      <label class="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          :checked="displayOptions.showSanhe"
          @change="store.updateDisplayOptions({ showSanhe: ($event.target as HTMLInputElement).checked })"
          class="accent-[#8b0000]"
        />
        <span class="text-sm">三合局</span>
      </label>
      <label class="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          :checked="displayOptions.showFanyin"
          @change="store.updateDisplayOptions({ showFanyin: ($event.target as HTMLInputElement).checked })"
          class="accent-[#8b0000]"
        />
        <span class="text-sm">反吟伏吟</span>
      </label>
      <label class="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          :checked="displayOptions.showWangShuai"
          @change="store.updateDisplayOptions({ showWangShuai: ($event.target as HTMLInputElement).checked })"
          class="accent-[#8b0000]"
        />
        <span class="text-sm">旺衰</span>
      </label>
      <label class="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          :checked="displayOptions.showKongwang"
          @change="store.updateDisplayOptions({ showKongwang: ($event.target as HTMLInputElement).checked })"
          class="accent-[#8b0000]"
        />
        <span class="text-sm">空亡</span>
      </label>
      <label class="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          :checked="displayOptions.showAnDong"
          @change="store.updateDisplayOptions({ showAnDong: ($event.target as HTMLInputElement).checked })"
          class="accent-[#8b0000]"
        />
        <span class="text-sm">暗动/日破</span>
      </label>
      <label class="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          :checked="displayOptions.showHe"
          @change="store.updateDisplayOptions({ showHe: ($event.target as HTMLInputElement).checked })"
          class="accent-[#8b0000]"
        />
        <span class="text-sm">相合</span>
      </label>
      <label class="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          :checked="displayOptions.showXing"
          @change="store.updateDisplayOptions({ showXing: ($event.target as HTMLInputElement).checked })"
          class="accent-[#8b0000]"
        />
        <span class="text-sm">相刑</span>
      </label>
    </div>
  </div>
</template>
