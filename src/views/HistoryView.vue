<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePaipanStore } from '../stores/paipan'
import { exportAllHistory, importHistory } from '../composables/useExport'
import HistoryList from '../components/HistoryList.vue'

const router = useRouter()
const store = usePaipanStore()

const fileInput = ref<HTMLInputElement | null>(null)

function viewHistory(id: string) {
  const item = store.getHistoryById(id)
  if (item) {
    store.setResult(item)
    router.push('/result')
  }
}

function deleteHistory(id: string) {
  store.deleteHistory(id)
}

function clearHistory() {
  if (confirm('确定清空所有历史记录？')) {
    store.clearHistory()
  }
}

function goBack() {
  router.push('/')
}

function onExportAll() {
  exportAllHistory(store.history)
}

function triggerImport() {
  fileInput.value?.click()
}

async function onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return
  const file = input.files[0]
  try {
    const imported = await importHistory(file)
    // 弹窗确认合并策略
    const strategy = confirm('选择"确定"合并（保留现有记录，按 ID 去重），选择"取消"则替换（清空现有后导入）。')
    if (strategy) {
      // 合并策略
      const existingIds = new Set(store.history.map(h => h.id))
      const newItems = imported.filter(h => !existingIds.has(h.id))
      store.history.unshift(...newItems)
      store.saveHistory()
    } else {
      // 替换策略
      store.history = imported
      store.saveHistory()
    }
    alert(`导入成功！共导入 ${imported.length} 条记录。`)
  } catch (err: any) {
    alert(err.message || '导入失败')
  }
  // 重置 input 以允许重复选择同一文件
  input.value = ''
}
</script>

<template>
  <div class="space-y-4 pb-20">
    <div class="flex items-center justify-between">
      <button @click="goBack" class="text-gray-500 hover:text-gray-700 text-sm">&larr; 返回</button>
      <h2 class="text-lg font-bold text-gray-700">历史记录</h2>
      <div class="flex gap-1.5">
        <button
          @click="triggerImport"
          class="text-xs text-gray-500 hover:text-[#8b0000] border border-gray-300 hover:border-[#8b0000]/40 px-2 py-1 rounded transition-colors"
        >
          导入
        </button>
        <button
          @click="onExportAll"
          class="text-xs text-gray-500 hover:text-[#8b0000] border border-gray-300 hover:border-[#8b0000]/40 px-2 py-1 rounded transition-colors"
        >
          导出全部
        </button>
      </div>
    </div>

    <!-- 隐藏的文件选择器 -->
    <input
      ref="fileInput"
      type="file"
      accept=".json"
      class="hidden"
      @change="onFileSelected"
    />

    <HistoryList
      :items="store.history"
      :showActions="true"
      @view="viewHistory"
      @delete="deleteHistory"
      @clear="clearHistory"
    />
  </div>
</template>
