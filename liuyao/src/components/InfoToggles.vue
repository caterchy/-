<script setup lang="ts">
import { usePaipanStore } from '../stores/paipan'

const store = usePaipanStore()
const options = store.displayOptions
</script>

<template>
  <div class="bg-white rounded-lg shadow p-4">
    <h3 class="text-sm font-bold text-gray-700 mb-3">信息显示开关</h3>
    <div class="flex flex-wrap gap-3">
      <label class="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          :checked="options.showGuaci"
          @change="store.updateDisplayOptions({ showGuaci: !options.showGuaci })"
          class="accent-[#8b0000]"
        />
        <span class="text-sm">卦辞</span>
      </label>
      <label class="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          :checked="options.showSanhe"
          @change="store.updateDisplayOptions({ showSanhe: !options.showSanhe })"
          class="accent-[#8b0000]"
        />
        <span class="text-sm">三合局</span>
      </label>
      <label class="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          :checked="options.showFanyin"
          @change="store.updateDisplayOptions({ showFanyin: !options.showFanyin })"
          class="accent-[#8b0000]"
        />
        <span class="text-sm">反吟伏吟</span>
      </label>
      <label class="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          :checked="options.showFuShen"
          @change="store.updateDisplayOptions({ showFuShen: !options.showFuShen })"
          class="accent-[#8b0000]"
        />
        <span class="text-sm">伏神</span>
      </label>
      <label class="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          :checked="options.showWangShuai"
          @change="store.updateDisplayOptions({ showWangShuai: !options.showWangShuai })"
          class="accent-[#8b0000]"
        />
        <span class="text-sm">旺衰</span>
      </label>
      <label class="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          :checked="options.showShensha"
          @change="store.updateDisplayOptions({ showShensha: !options.showShensha })"
          class="accent-[#8b0000]"
        />
        <span class="text-sm">神煞</span>
      </label>
      <label class="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          :checked="options.showKongwang"
          @change="store.updateDisplayOptions({ showKongwang: !options.showKongwang })"
          class="accent-[#8b0000]"
        />
        <span class="text-sm">空亡</span>
      </label>
    </div>
  </div>
</template>
