<script setup lang="ts">
import { } from 'vue'

const props = withDefaults(defineProps<{
  showGender?: boolean
  showTime?: boolean
}>(), {
  showGender: true,
  showTime: true,
})

const emit = defineEmits<{
  'update:questionType': [value: string]
  'update:questionText': [value: string]
  'update:gender': [value: string]
  'update:dateTime': [value: string]
}>()

const QUESTION_TYPES = [
  { value: 'love-m', label: '感情-男' },
  { value: 'love-f', label: '感情-女' },
  { value: 'career', label: '事业' },
  { value: 'wealth', label: '财运' },
  { value: 'health', label: '健康' },
  { value: 'travel', label: '出行' },
  { value: 'exam', label: '考试' },
  { value: 'other', label: '其他' },
] as const

const questionType = defineModel<string>('questionType', { default: '' })
const questionText = defineModel<string>('questionText', { default: '' })
const gender = defineModel<string>('gender', { default: '' })
const dateTimeStr = defineModel<string>('dateTime', { default: '' })

// Auto-fill question text when selecting a type
function onQuestionTypeChange(val: string) {
  questionType.value = val
  const map: Record<string, string> = {
    'love-m': '感情运势（男）',
    'love-f': '感情运势（女）',
    'career': '事业发展',
    'wealth': '财运走势',
    'health': '健康状况',
    'travel': '出行事宜',
    'exam': '考试结果',
    'other': '',
  }
  if (map[val] && !questionText.value) {
    questionText.value = map[val]
  }
}
</script>

<template>
  <div class="space-y-3">
    <!-- Question type pills -->
    <div>
      <div class="text-xs text-gray-500 mb-2">问题类型</div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="qt in QUESTION_TYPES"
          :key="qt.value"
          @click="onQuestionTypeChange(qt.value)"
          class="px-3 py-1.5 text-xs font-medium border rounded-full transition-all"
          :class="questionType === qt.value
            ? 'bg-[#8b0000] text-white border-[#8b0000]'
            : 'bg-white text-gray-600 border-gray-200 hover:border-[#8b7355]'"
        >
          {{ qt.label }}
        </button>
      </div>
    </div>

    <!-- Question text -->
    <div>
      <input
        v-model="questionText"
        placeholder="具体问题（可选）..."
        class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
               focus:outline-none focus:ring-2 focus:ring-[#8b0000]/30 transition-all"
        maxlength="100"
      />
    </div>

    <!-- Gender + Time row -->
    <div class="flex items-center gap-4">
      <div v-if="showGender" class="flex items-center gap-3">
        <span class="text-xs text-gray-500">性别:</span>
        <label class="flex items-center gap-1 text-sm cursor-pointer">
          <input type="radio" v-model="gender" value="male" class="accent-[#8b0000]" />
          <span>男</span>
        </label>
        <label class="flex items-center gap-1 text-sm cursor-pointer">
          <input type="radio" v-model="gender" value="female" class="accent-[#8b0000]" />
          <span>女</span>
        </label>
      </div>

      <div v-if="showTime" class="flex items-center gap-2">
        <span class="text-xs text-gray-500">起卦时间:</span>
        <input
          v-model="dateTimeStr"
          type="datetime-local"
          class="border border-gray-200 rounded-lg px-2 py-1.5 text-xs
                 focus:outline-none focus:ring-2 focus:ring-[#8b0000]/30"
        />
      </div>
    </div>
  </div>
</template>
