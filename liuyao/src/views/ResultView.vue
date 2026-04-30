<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePaipanStore } from '../stores/paipan'
import DateTimeInfo from '../components/DateTimeInfo.vue'
import HexagramView from '../components/HexagramView.vue'
import PaipanTable from '../components/PaipanTable.vue'
import InfoToggles from '../components/InfoToggles.vue'
import { encodeResultToUrl, exportAsText, exportAsJson } from '../composables/useExport'

const router = useRouter()
const store = usePaipanStore()

const result = computed(() => store.currentResult)
const displayOptions = computed(() => store.displayOptions)

const editingNote = ref(false)
const editNoteText = ref('')

function goBack() {
  router.push('/')
}

function startEditNote() {
  if (result.value?.note) {
    editNoteText.value = result.value.note
  } else {
    editNoteText.value = ''
  }
  editingNote.value = true
}

function saveNote() {
  store.updateNote(editNoteText.value.trim())
  editingNote.value = false
}

function cancelEditNote() {
  editingNote.value = false
}

function copyShareLink() {
  if (!result.value) return
  const url = encodeResultToUrl(result.value)
  navigator.clipboard.writeText(url).then(() => {
    alert('分享链接已复制到剪贴板！')
  }).catch(() => {
    // fallback
    const textarea = document.createElement('textarea')
    textarea.value = url
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    alert('分享链接已复制！')
  })
}

function downloadTxt() {
  if (result.value) exportAsText(result.value)
}

function downloadJson() {
  if (result.value) exportAsJson(result.value)
}
</script>

<template>
  <div v-if="!result" class="text-center py-12 text-gray-500">
    <p>暂无排盘结果</p>
    <button @click="goBack" class="mt-4 text-[#8b0000] underline">返回起卦</button>
  </div>

  <div v-else class="space-y-4 pb-20">
    <!-- 时间信息 -->
    <DateTimeInfo
      :bazi="result.bazi"
      :timestamp="result.timestamp"
      :kongwang="result.kongwang"
    />

    <!-- 卦象对比显示 -->
    <div class="flex justify-center gap-4 flex-wrap">
      <HexagramView
        :gua="result.original"
        title="本卦"
        :showGuaci="displayOptions.showGuaci"
        :showShiYing="true"
      />
      <div v-if="result.changed" class="flex items-center text-2xl text-gray-400">
        →
      </div>
      <HexagramView
        v-if="result.changed"
        :gua="result.changed"
        title="变卦"
        :showGuaci="displayOptions.showGuaci"
        :showShiYing="true"
      />
    </div>

    <!-- 附加信息 -->
    <div v-if="displayOptions.showSanhe && result.sanhe" class="bg-green-50 border border-green-200 rounded-lg p-3">
      <span class="font-bold text-green-700">三合局:</span>
      <span class="ml-2">{{ result.sanhe.name }} {{ result.sanhe.wuxing }}局</span>
      <span class="ml-2 text-sm text-gray-500">（参与爻位: {{ result.sanhe.positions.join('、') }}）</span>
    </div>

    <div v-if="displayOptions.showFanyin && result.fanyin" class="bg-orange-50 border border-orange-200 rounded-lg p-3">
      <span class="font-bold text-orange-700">{{ result.fanyin.type }}:</span>
      <span class="ml-2">{{ result.fanyin.description }}</span>
    </div>

    <!-- 备注 -->
    <div class="bg-amber-50 border border-amber-200 rounded-lg p-3">
      <div class="flex items-center justify-between">
        <span class="font-bold text-amber-700">备注</span>
        <button
          v-if="!editingNote"
          @click="startEditNote"
          class="text-xs text-amber-600 hover:text-amber-800 underline"
        >
          {{ result.note ? '编辑' : '添加' }}
        </button>
      </div>
      <!-- 查看模式 -->
      <p v-if="!editingNote && result.note" class="mt-1 text-sm text-gray-700 whitespace-pre-wrap">{{ result.note }}</p>
      <p v-if="!editingNote && !result.note" class="mt-1 text-sm text-gray-400 italic">暂无备注</p>
      <!-- 编辑模式 -->
      <div v-if="editingNote" class="mt-1">
        <textarea
          v-model="editNoteText"
          placeholder="添加备注..."
          class="w-full border border-amber-300 rounded-lg p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          rows="3"
          maxlength="500"
        ></textarea>
        <div class="text-right text-xs text-gray-400 mt-1">{{ editNoteText.length }}/500</div>
        <div class="flex gap-2 mt-2">
          <button
            @click="cancelEditNote"
            class="flex-1 border border-gray-300 text-gray-600 py-1.5 rounded text-xs hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            @click="saveNote"
            class="flex-1 bg-amber-600 text-white py-1.5 rounded text-xs font-bold hover:bg-amber-700 transition-colors"
          >
            保存
          </button>
        </div>
      </div>
    </div>

    <!-- 排盘表 -->
    <div>
      <h3 class="font-bold text-gray-700 mb-1">本卦排盘</h3>
      <PaipanTable :gua="result.original" />
    </div>

    <div v-if="result.changed">
      <h3 class="font-bold text-gray-700 mb-1">变卦排盘</h3>
      <PaipanTable :gua="result.changed" />
    </div>

    <!-- 显示开关 -->
    <InfoToggles />

    <!-- 操作按钮 -->
    <div class="flex flex-wrap gap-2">
      <button
        @click="copyShareLink"
        class="flex-1 min-w-[100px] bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors"
      >
        复制分享链接
      </button>
      <button
        @click="downloadTxt"
        class="flex-1 min-w-[80px] bg-gray-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors"
      >
        导出文本
      </button>
      <button
        @click="downloadJson"
        class="flex-1 min-w-[80px] bg-gray-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors"
      >
        导出 JSON
      </button>
    </div>

    <!-- 返回 -->
    <div class="text-center">
      <button @click="goBack" class="text-gray-500 hover:text-[#8b0000] underline text-sm">
        返回起卦
      </button>
    </div>
  </div>
</template>
