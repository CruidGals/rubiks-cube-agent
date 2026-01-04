<script setup lang="ts">

import { ref, computed, onMounted, watch } from 'vue';
import { randomScrambleForEvent } from "cubing/scramble";
import { usePlayMoveLogic, lastMove } from '@/composables/playMoveLogic';
import { useTimestamp } from '@vueuse/core';
import MarkdownIt from 'markdown-it';
import Modal from '../models/Modal.vue';
import { isRotating, CubeNotation } from '@/composables/cubeLogic';
import { isSolved } from '@/composables/cubeNotation';

// Makrdown for the timer functionality
import timerMd from '../../assets/timer.md?raw';
const md = new MarkdownIt();
const modalContent = md.render(timerMd);

const showModal = ref(false);
const { timestamp, pause, resume } = useTimestamp({ controls: true });

const { playMoves, onResetCube } = usePlayMoveLogic();

const props = defineProps<{
    width?: string;
}>();

const scramble = ref('');

async function generateScramble() {
    let res = await randomScrambleForEvent("333");
    scramble.value = res.toString();
}

async function applyScramble() {
    // Reset the cube and timer
    await onResetCube();
    resetTimer();

    // Apply the scramble
    await playMoves(scramble.value, 0);
}

// Stop watch functionality
const isRunning = ref(false);
const startTime = ref(Date.now());
const currTime = computed(() => {
    // Display as mm:ss.sss
    const rawMillis = Math.max(0, Number(timestamp.value) - startTime.value);

    // Calculate the components
    const minutes = Math.floor(rawMillis / 60000);
    const seconds = Math.floor((rawMillis % 60000) / 1000);
    const milliseconds = rawMillis % 1000;

    if (minutes > 0) {
        return `${minutes.toString()}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
    } else {
        return `${seconds.toString()}.${milliseconds.toString().padStart(3, '0')}`;
    }
});

// Reset the timer (just pause timestamp and set it to start time)
function resetTimer() {
    pause();
    startTime.value = Date.now();
    isRunning.value = false;
}

onMounted(() => {
    // Reset Timer
    resetTimer();

    // Generate scramble once when component is first mounted
    generateScramble();
})

// Use the watch function to detect if start rotation cube
watch(isRotating, (newVal) => {
    if (newVal && !isRunning.value) {
        // Don't start timer if the last move was a rotation move (x, y, z)
        if (lastMove.value && (
            lastMove.value.face === CubeNotation.x ||
            lastMove.value.face === CubeNotation.y ||
            lastMove.value.face === CubeNotation.z
        )) {
            return; // Don't start the timer for rotation moves
        }
        
        startTime.value = Date.now();
        resume();
        isRunning.value = true;
    }

    // At end of each rotation, check if solved cube
    if (!newVal && isSolved.value) {
        isRunning.value = false;
        pause();
    }
});

</script>

<template>
    <div class="timer-overlay" :style="{ width: props.width }">
        <div class="button" @click="generateScramble">Generate Scramble</div>
        <div class="button" @click="applyScramble">Apply Scramble</div>

        <h3 class="scramble">{{ scramble }}</h3>
        <div class="horizontal-divider"></div>

        <!-- Modal for timer functionality -->
        <teleport to="body">
            <Modal v-model="showModal">
                <div class="modal-content">
                    <div v-html="modalContent"></div>
                </div>
            </Modal>
        </teleport>

        <div class="stopwatch">
            <div class="stopwatch-time">{{ currTime }}</div>
            <div class="stopwatch-controls">
                <div class="button stopwatch-button-small" @click="showModal = true">?</div>
                <div class="button stopwatch-button-large" @click="resetTimer">Reset Timer</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .timer-overlay {
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

    .horizontal-divider {
        width: 100%;
        height: 1px;
        background-color: rgb(80,80,80);
    }

    /* Stopwatch specific styles */

    .stopwatch {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;    
    }

    .stopwatch-time {
        font-size: 2rem;
        font-weight: bold;
        text-align: center;
    }

    .stopwatch-controls {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 10px;
        width: 100%;
    }

    .stopwatch-controls .button {
        padding: 0 10px;
    }

    .stopwatch-button-small {
        flex: 0 0 auto;
        width: auto;
    }

    .stopwatch-button-large {
        flex: 1;
        width: auto;
    }

    .modal-content {    
        background-color: black;
        color: white;
        margin: 20vw;
        padding: 50px;
        border-radius: 10px;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 20px;
    }

</style>