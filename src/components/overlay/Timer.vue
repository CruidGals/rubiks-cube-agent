<script setup lang="ts">

import { ref } from 'vue';
import { randomScrambleForEvent } from "cubing/scramble";

const props = defineProps<{
    width?: string;
}>();

const scramble = ref('');

async function generateScramble() {
    let res = await randomScrambleForEvent("333");
    scramble.value = res.toString();
}

</script>

<template>
    <div class="overlay" :style="{ width: props.width }">
        <div class="button" @click="generateScramble">Generate Scramble</div>

        <h3 class="scramble">{{ scramble }}</h3>
    </div>
</template>

<style scoped>
    .overlay {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;

        background-color: rgb(40, 40, 40);
        border-radius: 0 0px 10px 0;
        height: 100%;
        padding: 20px;
    }

    .scramble {
        font-size: 1.25rem;
        font-weight: bold;
        text-align: center;
    }
    
    .button {
        display: flex;
        align-items: center;
        justify-content: center;

        background-color: rgb(60, 60, 60);
        border-radius: 5px;

        width: 100%;
        transition: all 0.1s ease-out;
    }

    .button:hover {
        background-color: rgb(80,80,80);
        cursor: grab;
    }
</style>