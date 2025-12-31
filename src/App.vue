<script setup lang="ts">
import SceneShell from './components/SceneShell.vue';
import Controls from './components/Controls.vue';
import { ref, provide } from 'vue';

const overlayFolded = ref(false);
provide('overlayFolded', overlayFolded);
</script>

<template>
  <div class="app">
    <Controls />
    <SceneShell />
  </div>
</template>

<style scoped>
  .app {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }
</style>