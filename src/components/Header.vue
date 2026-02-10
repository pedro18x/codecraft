<script setup lang="ts">
</script>

<template>
  <header class="glass-card border-b border-white/30 backdrop-blur-3xl sticky top-0 z-50 noise animate-slide-down">
    <div class="px-6 py-5 flex items-center justify-between max-w-[1800px] mx-auto">
      <!-- Logo -->
      <div class="flex items-center gap-4">
        <div class="relative group">
          <div class="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="relative w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-glass-lg">
            <span class="text-2xl text-white font-bold">&lt;/&gt;</span>
          </div>
        </div>
        <div>
          <h1 class="font-display font-bold text-2xl gradient-text tracking-tight">
            CodeCraft
          </h1>
          <p class="text-xs text-slate-500 font-medium">Master Technical Interviews</p>
        </div>
      </div>

      <!-- Stats -->
      <div class="hidden md:flex items-center gap-5">
        <div class="glass-card px-5 py-3 text-right animate-scale-in" style="animation-delay: 0.1s">
          <div class="text-xs text-slate-500 font-medium uppercase tracking-wider">Progress</div>
          <div class="font-display font-bold text-2xl gradient-text">0/6</div>
        </div>
        <div class="relative group">
          <div class="absolute inset-0 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="relative w-14 h-14 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl flex items-center justify-center shadow-glass-lg group-hover:scale-110 transition-transform duration-500 floating">
            <span class="text-2xl">🎯</span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
