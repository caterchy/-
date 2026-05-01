<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePaipanStore } from '../stores/paipan'
import type { PaipanNote } from '../types'
import DateTimeInfo from '../components/DateTimeInfo.vue'
import TraditionalView from '../components/TraditionalView.vue'
import InfoToggles from '../components/InfoToggles.vue'
import { encodeResultToUrl, formatResultText, exportAsText, exportAsJson } from '../composables/useExport'
import HexagramYijingText from '../components/HexagramYijingText.vue'

const router = useRouter()
const store = usePaipanStore()

const result = computed(() => store.currentResult)
const displayOptions = computed(() => store.displayOptions)

const editingNote = ref(false)
const editQuestion = ref('')
const editResult = ref('')
const editTags = ref<string[]>([])
const showYijing = ref(false)

const presetTags = ['已验证', '待验证', '错卦', '参考', '教学'] as const

function toggleEditTag(tag: string) {
  const idx = editTags.value.indexOf(tag)
  if (idx === -1) {
    editTags.value.push(tag)
  } else {
    editTags.value.splice(idx, 1)
  }
}

function goBack() {
  router.push('/')
}

function startEditNote() {
  const note = result.value?.note
  if (note) {
    editQuestion.value = note.question || ''
    editResult.value = note.result || ''
    editTags.value = [...(note.tags || [])]
  } else {
    editQuestion.value = ''
    editResult.value = ''
    editTags.value = []
  }
  editingNote.value = true
}

function saveNote() {
  const note: PaipanNote = {
    question: editQuestion.value.trim(),
    result: editResult.value.trim(),
    tags: editTags.value,
  }
  store.updateNote(note)
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

function copyText() {
  if (!result.value) return
  const text = formatResultText(result.value)
  navigator.clipboard.writeText(text).then(() => {
    alert('排盘文本已复制到剪贴板！')
  }).catch(() => {
    const textarea = document.createElement('textarea')
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    alert('排盘文本已复制！')
  })
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

  <div v-else>
    <!-- 第1模块：时间信息（只读） -->
    <DateTimeInfo
      :bazi="result.bazi"
      :timestamp="result.timestamp"
      :kongwang="result.kongwang"
      :readonly="true"
      :palace="result.original.gong"
      :palace-pos="result.original.palacePos"
    />
    <hr class="divider" />

    <!-- 第2模块：排盘（传统排盘） -->
    <TraditionalView
      :original="result.original"
      :changed="result.changed"
    />
    <hr class="divider" />

    <!-- 第3模块：卦辞（可折叠） -->
    <div class="card">
      <button
        @click="showYijing = !showYijing"
        class="w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-[#8b0000] hover:bg-gray-50 transition-colors"
      >
        <span>易经原文</span>
        <span class="text-gray-400 text-xs">{{ showYijing ? '收起' : '展开' }}</span>
      </button>
      <div v-show="showYijing" class="border-t" :style="{ borderColor: 'var(--border-color)' }">
        <div class="p-4 space-y-4 text-sm">
          <!-- 本卦 -->
          <HexagramYijingText :gua="result.original" />
          <!-- 变卦 -->
          <HexagramYijingText v-if="result.changed" :gua="result.changed" />
        </div>
      </div>
    </div>
    <hr class="divider" />

    <!-- 第4模块：可选信息 -->
    <div class="space-y-3">
      <!-- 三合局 -->
      <div v-if="displayOptions.showSanhe && result.sanhe" class="card px-3 py-2 text-sm">
        <span class="font-bold text-gray-700">三合局:</span>
        <span class="ml-2">{{ result.sanhe.name }} {{ result.sanhe.wuxing }}局</span>
        <span class="ml-2 text-gray-500">（{{ result.sanhe.positions.join('、') }}爻）</span>
      </div>

      <!-- 反吟伏吟 -->
      <div v-if="displayOptions.showFanyin && result.fanyin" class="card px-3 py-2 text-sm">
        <span class="font-bold text-gray-700">{{ result.fanyin.type }}:</span>
        <span class="ml-2">{{ result.fanyin.description }}</span>
      </div>

      <!-- 备注 -->
      <div class="card px-3 py-2">
        <div class="flex items-center justify-between">
          <span class="font-bold text-gray-700 text-sm">备注</span>
          <button
            v-if="!editingNote"
            @click="startEditNote"
            class="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            {{ result.note ? '编辑' : '添加' }}
          </button>
        </div>
        <template v-if="!editingNote">
          <div v-if="result.note?.tags && result.note.tags.length > 0" class="flex flex-wrap gap-1 mt-1">
            <span
              v-for="tag in result.note.tags"
              :key="tag"
              class="px-2 py-0.5 rounded text-xs font-medium bg-[#8b0000] text-white"
            >
              {{ tag }}
            </span>
          </div>
          <p v-if="result.note?.question" class="mt-1 text-sm text-gray-700">
            <span class="font-medium text-gray-500">占卜问题：</span>{{ result.note.question }}
          </p>
          <p v-if="result.note?.result" class="mt-1 text-sm text-gray-700">
            <span class="font-medium text-gray-500">占卜结果：</span>{{ result.note.result }}
          </p>
          <p v-if="!result.note" class="mt-1 text-sm text-gray-400 italic">暂无备注</p>
        </template>
        <div v-if="editingNote" class="mt-1 space-y-2">
          <textarea
            v-model="editQuestion"
            placeholder="占卜问题..."
            class="w-full border rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#8b0000]/30"
            :style="{ borderColor: 'var(--border-color)', borderRadius: 'var(--radius)' }"
            rows="2"
            maxlength="500"
          ></textarea>
          <textarea
            v-model="editResult"
            placeholder="占卜结果记录（可选）..."
            class="w-full border rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#8b0000]/30"
            :style="{ borderColor: 'var(--border-color)', borderRadius: 'var(--radius)' }"
            rows="2"
            maxlength="500"
          ></textarea>
          <div>
            <div class="text-xs text-gray-400 mb-1">标签</div>
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="tag in presetTags"
                :key="tag"
                @click="toggleEditTag(tag)"
                class="px-2 py-0.5 rounded text-xs font-medium transition-all duration-200"
                :class="editTags.includes(tag)
                  ? 'bg-[#8b0000] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
              >
                {{ tag }}
              </button>
            </div>
          </div>
          <div class="flex gap-2 mt-2">
            <button
              @click="cancelEditNote"
              class="flex-1 border text-gray-600 py-1.5 rounded text-xs hover:bg-gray-50 transition-colors"
              :style="{ borderColor: 'var(--border-color)' }"
            >
              取消
            </button>
            <button
              @click="saveNote"
              class="flex-1 bg-[#8b0000] text-white py-1.5 rounded text-xs font-bold hover:bg-red-900 transition-colors"
            >
              保存
            </button>
          </div>
        </div>
      </div>

      <!-- Info Toggles -->
      <InfoToggles />
    </div>
    <hr class="divider" />

    <!-- 第5模块：导出操作 -->
    <div class="flex flex-wrap gap-2">
      <button
        @click="copyShareLink"
        class="flex-1 min-w-[100px] bg-indigo-600 text-white px-3 py-2 text-sm hover:bg-indigo-700 transition-colors"
        :style="{ borderRadius: 'var(--radius)' }"
      >
        复制分享链接
      </button>
      <button
        @click="copyText"
        class="flex-1 min-w-[80px] bg-emerald-600 text-white px-3 py-2 text-sm hover:bg-emerald-700 transition-colors"
        :style="{ borderRadius: 'var(--radius)' }"
      >
        复制文本
      </button>
      <button
        @click="downloadTxt"
        class="flex-1 min-w-[80px] bg-gray-600 text-white px-3 py-2 text-sm hover:bg-gray-700 transition-colors"
        :style="{ borderRadius: 'var(--radius)' }"
      >
        导出文本
      </button>
      <button
        @click="downloadJson"
        class="flex-1 min-w-[80px] bg-gray-600 text-white px-3 py-2 text-sm hover:bg-gray-700 transition-colors"
        :style="{ borderRadius: 'var(--radius)' }"
      >
        导出 JSON
      </button>
    </div>

    <!-- 返回 -->
    <div class="text-center mt-4">
      <button @click="goBack" class="text-gray-500 hover:text-[#8b0000] underline text-sm">
        返回起卦
      </button>
    </div>
  </div>
</template>
