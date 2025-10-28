<script setup lang="ts">
import Slider from './Slider.vue';
import { turnSpeed } from '@/composables/cubeLogic';
import { showFaceSymbols } from '@/composables/cubeVisual';
</script>

<template>
    <div class="overlay">
        <h2>Turn Speed {{ turnSpeed }}</h2>
        <Slider />
        <label class>
            Show Face Symbols <input type="checkbox" v-model="showFaceSymbols">
        </label>
    </div>
</template>

<style scoped>
    .overlay {
        display: flex;
        flex-direction: column;
        gap: 10px;

        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;

        padding: 20px;
    }
</style>