<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Yao } from '../types'
import headsImg from '../assets/coins/heads.webp'
import tailsImg from '../assets/coins/tails.webp'

const emit = defineEmits<{
  complete: [yaos: Yao[]]
}>()

type CoinFace = 'heads' | 'tails' | null

const MAX_TOSSES = 6
const yaos = ref<Yao[]>([])
const currentToss = ref(0)
const isAnimating = ref(false)
const coins = ref<CoinFace[]>([null, null, null])
const showResult = ref(false)
const lastResultText = ref('')
const lastHeadCount = ref(0)
const lastBackCount = ref(0)

// Independent flip animation tracking per coin
const coinFlipping = ref<boolean[]>([false, false, false])

const POSITION_NAMES = ['初', '二', '三', '四', '五', '上']

const isComplete = computed(() => currentToss.value >= MAX_TOSSES)
const progressText = computed(() =>
  isComplete.value ? '已完成' : `第 ${currentToss.value + 1} / ${MAX_TOSSES} 次`
)

/** Each coin flips independently with staggered delay */
function doToss() {
  if (isComplete.value || isAnimating.value) return

  isAnimating.value = true
  showResult.value = false
  coins.value = [null, null, null]
  coinFlipping.value = [false, false, false]
  lastResultText.value = ''

  // Generate random results for 3 coins independently
  const results: CoinFace[] = Array.from({ length: 3 }, () =>
    Math.random() < 0.5 ? 'heads' : 'tails'
  )
  const headCount = results.filter(r => r === 'heads').length
  const backCount = 3 - headCount
  lastHeadCount.value = headCount
  lastBackCount.value = backCount

  // Determine yao from head count
  let yao: Yao
  if (headCount === 3) {
    yao = { yang: true, changing: true, type: '老阳' }
    lastResultText.value = '三正（老阳）'
  } else if (headCount === 2) {
    yao = { yang: true, changing: false, type: '少阳' }
    lastResultText.value = '二正一反（少阳）'
  } else if (headCount === 1) {
    yao = { yang: false, changing: false, type: '少阴' }
    lastResultText.value = '一正二反（少阴）'
  } else {
    yao = { yang: false, changing: true, type: '老阴' }
    lastResultText.value = '三反（老阴）'
  }

  // Staggered flip: each coin starts its animation at a different time
  results.forEach((_, idx) => {
    setTimeout(() => {
      coinFlipping.value[idx] = true
    }, idx * 100)
  })

  // End animation and show results
  const animDuration = 400 + 2 * 100
  setTimeout(() => {
    coins.value = results
    yaos.value.push(yao)
    currentToss.value++
    showResult.value = true
    isAnimating.value = false
    coinFlipping.value = [false, false, false]

    if (currentToss.value >= MAX_TOSSES) {
      setTimeout(() => {
        emit('complete', yaos.value)
      }, 600)
    }
  }, animDuration)
}

function reset() {
  yaos.value = []
  currentToss.value = 0
  coins.value = [null, null, null]
  coinFlipping.value = [false, false, false]
  showResult.value = false
  lastResultText.value = ''
}
</script>

<template>
  <div class="text-center">
    <!-- Progress -->
    <div class="mb-5">
      <div class="text-sm text-gray-500 mb-2">{{ progressText }}</div>
      <div class="w-full bg-gray-200 h-2" style="border-radius: var(--radius);">
        <div
          class="bg-[#8b0000] h-2 transition-all duration-300"
          :style="{ width: `${(currentToss / MAX_TOSSES) * 100}%`, borderRadius: 'var(--radius)' }"
        />
      </div>
    </div>

    <!-- Three coins with independent 3D flip -->
    <div class="flex justify-center items-center gap-5 sm:gap-8 my-8">
      <div
        v-for="i in 3"
        :key="i"
        class="coin-container"
        :class="{
          'coin-spinning': isAnimating && !coinFlipping[i - 1] && coins[i - 1] === null,
          'coin-flipped': coinFlipping[i - 1] || (!isAnimating && coins[i - 1] === 'tails'),
        }"
      >
        <div class="coin-inner">
          <div class="coin-front">
            <img :src="headsImg" alt="正面" class="coin-img" />
          </div>
          <div class="coin-back">
            <img :src="tailsImg" alt="反面" class="coin-img" />
          </div>
        </div>
      </div>
    </div>

    <!-- Coin count display -->
    <div v-if="showResult" class="flex justify-center gap-6 mb-3 text-sm">
      <span class="text-red-600 font-bold">正: {{ lastHeadCount }}</span>
      <span class="text-blue-600 font-bold">背: {{ lastBackCount }}</span>
    </div>

    <!-- Toss button -->
    <div class="mb-4">
      <button
        v-if="!isComplete"
        @click="doToss"
        :disabled="isAnimating"
        class="bg-[#8b0000] text-white px-10 py-3 text-base font-bold
               hover:bg-red-900 disabled:opacity-50 disabled:cursor-not-allowed
               active:scale-[0.98] transition-all duration-200 shadow-sm"
        :style="{ borderRadius: 'var(--radius)' }"
      >
        <span v-if="isAnimating">摇卦中...</span>
        <span v-else>掷 币</span>
      </button>
      <button
        v-else
        @click="reset"
        class="bg-gray-500 text-white px-6 py-2 text-sm hover:bg-gray-600 transition-colors"
        :style="{ borderRadius: 'var(--radius)' }"
      >
        重新起卦
      </button>
    </div>

    <!-- Result text -->
    <div v-if="showResult" class="text-base text-gray-700 font-bold mb-4 animate-fade-in">
      {{ lastResultText }}
    </div>

    <!-- Accumulated yaos: horizontal lines from bottom to top -->
    <div v-if="yaos.length > 0" class="mt-4">
      <div class="text-xs text-gray-400 mb-2">已生成:</div>
      <div class="flex flex-col items-center gap-1">
        <div
          v-for="(y, i) in [...yaos].reverse()"
          :key="i"
          class="flex items-center justify-between w-full max-w-[220px] mx-auto"
        >
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-400 w-4 text-right">{{ POSITION_NAMES[yaos.length - 1 - i] }}</span>
            <span class="font-mono text-lg shrink-0" style="color: #333; letter-spacing: 0.1em;">
              {{ y.yang ? '⚊' : '⚋' }}
            </span>
          </div>
          <span v-if="y.changing" class="text-[#c00] font-bold text-sm">{{ y.type === '老阳' ? '○' : '×' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.coin-container {
  width: 68px;
  height: 68px;
  perspective: 200px;
}

.coin-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s ease;
  transform-style: preserve-3d;
}

.coin-flipped .coin-inner {
  transform: rotateY(180deg);
}

.coin-front,
.coin-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.coin-back {
  transform: rotateY(180deg);
}

.coin-img {
  width: 100%;
  height: 100%;
  display: block;
}

/* Spinning animation during toss before individual flip */
.coin-spinning .coin-inner {
  animation: coin-tumble 0.15s ease-in-out infinite;
}

@keyframes coin-tumble {
  0% { transform: rotateY(0deg) scale(1); }
  25% { transform: rotateY(90deg) scale(1.05); }
  50% { transform: rotateY(180deg) scale(1); }
  75% { transform: rotateY(270deg) scale(0.95); }
  100% { transform: rotateY(360deg) scale(1); }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
