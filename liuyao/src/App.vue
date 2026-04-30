<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen bg-[#f5f0e8]">
    <header class="bg-[#8b0000] text-white text-center py-3 text-lg tracking-wider shadow-md">
      六爻排盘
    </header>
    <main class="max-w-2xl mx-auto px-4 py-6 pb-20">
      <router-view />
    </main>
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 shadow-lg">
      <router-link to="/" class="flex flex-col items-center text-sm text-gray-600 hover:text-[#8b0000] no-underline">
        <span class="text-lg">🏠</span>
        <span>起卦</span>
      </router-link>
      <router-link to="/history" class="flex flex-col items-center text-sm text-gray-600 hover:text-[#8b0000] no-underline">
        <span class="text-lg">📋</span>
        <span>历史</span>
      </router-link>
    </nav>
  </div>
</template>
