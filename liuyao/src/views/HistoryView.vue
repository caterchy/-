<script setup lang="ts">
import { useRouter } from 'vue-router'
import { usePaipanStore } from '../stores/paipan'
import HistoryList from '../components/HistoryList.vue'

const router = useRouter()
const store = usePaipanStore()

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
</script>

<template>
  <div class="space-y-4 pb-20">
    <div class="flex items-center justify-between">
      <button @click="goBack" class="text-gray-500 hover:text-gray-700 text-sm">&larr; 返回</button>
      <h2 class="text-lg font-bold text-gray-700">历史记录</h2>
      <div class="w-12"></div>
    </div>

    <HistoryList
      :items="store.history"
      :showActions="true"
      @view="viewHistory"
      @delete="deleteHistory"
      @clear="clearHistory"
    />
  </div>
</template>
