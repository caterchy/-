<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen bg-[#f5f0e8]">
    <header class="bg-[#8b0000] text-white text-center py-3 text-lg tracking-wider shadow-md relative">
      <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent"></div>
      六爻排盘
    </header>
    <main class="max-w-2xl mx-auto px-4 py-6 pb-20">
      <router-view />
    </main>
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 shadow-lg">
      <router-link to="/" class="flex flex-col items-center text-sm text-gray-600 hover:text-[#8b0000] no-underline router-link-active:text-[#8b0000] router-link-active:font-bold">
        <span class="text-lg font-bold">⌨</span>
        <span>起卦</span>
      </router-link>
      <router-link to="/history" class="flex flex-col items-center text-sm text-gray-600 hover:text-[#8b0000] no-underline router-link-active:text-[#8b0000] router-link-active:font-bold">
        <span class="text-lg font-bold">☰</span>
        <span>历史</span>
      </router-link>
      <router-link to="/library" class="flex flex-col items-center text-sm text-gray-600 hover:text-[#8b0000] no-underline router-link-active:text-[#8b0000] router-link-active:font-bold">
        <span class="text-lg font-bold">📖</span>
        <span>卦库</span>
      </router-link>
      <a
        href="https://v.wjx.cn/vm/rMUYN4L.aspx"
        target="_blank"
        rel="noopener noreferrer"
        class="flex flex-col items-center text-sm text-gray-400 hover:text-[#8b0000] no-underline transition-colors"
      >
        <span class="text-lg font-bold">✉</span>
        <span>反馈</span>
      </a>
    </nav>
  </div>
</template>
