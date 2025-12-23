<script setup lang="ts">
import Slider from './Slider.vue';
import { turnSpeed, isRotating } from '@/composables/cubeLogic';
import { updatedCubeMoves, moveCount, currMove, usePlayMoveLogic, currPlaying } from '@/composables/playMoveLogic';
import { showFaceSymbols, resetCube } from '@/composables/cubeVisual';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faChevronLeft, faChevronRight, faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import MarkdownIt from 'markdown-it';
import Modal from './Modal.vue';
import { ref, watch } from 'vue';

const showModal = ref(false);

// Hiding overlay
const overlayFolded = ref(false);

// Markdown for the modal
const md = new MarkdownIt();
import keybindMd from '../assets/keybinds.md?raw';
const modalContent = md.render(keybindMd);

// For playing moves
const { forceMoveCompletion, readMoves, playMoves, playMoveRange, stepMove } = usePlayMoveLogic();
const moveSet = ref('');
const invalidMoveSet = ref(false);

// For the slider functinality
const playSliderValue = ref(currMove.value);

watch(currMove, (newMove) => {
    playSliderValue.value = newMove;
})

watch(playSliderValue, async (newVal, oldVal) => {
    // If changed to currMove, don't run
    if (newVal == currMove.value) return;

    console.log(newVal, oldVal);

    // Play moves to that range
    await playMoveRange(moveSet.value, 0, oldVal, newVal);
    currMove.value = newVal;
})

// If ever interacting with the slider, finish move immediately
const playSliderOnMouseDown = () => { forceMoveCompletion(); }

// Use debouncing to update the moves based on what the user typed in
let inputTimer;
const finishTypingInterval = 1000; // 1 second

watch(moveSet, (newMoveSet) => {
    invalidMoveSet.value = false;
    updatedCubeMoves.value = false;
    clearTimeout(inputTimer);

    inputTimer = setTimeout(async () => {
        let res = await readMoves(newMoveSet);

        // Lets user know if its invalid by coloring the field red
        if (res == -1) invalidMoveSet.value = true;

    }, finishTypingInterval);
})

// Handling playing moves
function play() {
    // Clear timeout for reading moves
    clearTimeout(inputTimer);
    playMoves(moveSet.value, turnSpeed.value);
}

// Handling reset cube
function onResetCube() {
    resetCube();

    // Move the play slider to the start
    currMove.value = 0;
}

</script>

<template>
    <div ref="controlsRef" class="controls">
        <div ref="overlayRef" class="overlay" v-if="!overlayFolded">
            <h2>Turn Speed {{ turnSpeed / 10 }}s</h2>
            <Slider v-model="turnSpeed"/>

            <div class="spacer"></div>

            <label>
                Show Face Symbols <input type="checkbox" v-model="showFaceSymbols">
            </label>

            <!-- Modal for keybinds -->
            <teleport to="body">
                <Modal v-model="showModal">
                    <div class="modal-content">
                        <div v-html="modalContent"></div>
                    </div>
                </Modal>
            </teleport>
            <div class="button" @click="showModal = true">Show Keybinds</div>
            <div class="button" @click="isRotating ? null : onResetCube()">Reset Cube</div>

            <div class="spacer"></div>

            <!-- Move the cube by giving it a set of moves -->
            <textarea :class="invalidMoveSet ? 'input-error' : '' " v-model="moveSet" placeholder="R U R' U' ..." style="max-width: 160px; min-width: 160px;"/>
            <Slider :max-val="moveCount" :on-mouse-down="playSliderOnMouseDown" v-model="playSliderValue"/>
            <div class="play-button-row">
                <div class="button play-button" @click="stepMove(turnSpeed, true)"><FontAwesomeIcon :icon="faChevronLeft" /></div>
                <div class="button play-button" @click="!currPlaying ? play() : currPlaying = false" ><FontAwesomeIcon :icon="!currPlaying ? faPlay : faPause" /></div>
                <div class="button play-button" @click="stepMove(turnSpeed)"><FontAwesomeIcon :icon="faChevronRight" /></div>
            </div>
        </div>

        <div @click="overlayFolded = !overlayFolded;" class="fold-button" >
            <FontAwesomeIcon :icon="overlayFolded ? faChevronRight : faChevronLeft" />
        </div>
    </div>
</template>

<style scoped>
    .controls {
        display: flex;
        flex-direction: row;

        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;
        height: 100%;
    }

    .overlay {
        display: flex;
        flex-direction: column;
        gap: 10px;

        background-color: rgb(40, 40, 40);
        border-radius: 0 0px 10px 0;
        height: 100%;
        padding: 20px;
    }

    .fold-button {
        background-color: rgb(40, 40, 40);
        border-radius: 0px 10px 10px 0px;
        height: fit-content;

        font-size: large;
        font-weight: bolder;

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

    .bold {
        font-weight: 900;
    }

    .spacer {
        height: 20px;
        padding: 0;
        margin: 0;
    }

    .input-error {
        border-color: #ef4444 !important; 
        background-color: #fef2f2;
        color: #b91c1c;
    }

    .input-error:focus {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
    }

    /* Play button specifics */
    .play-button-row {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 5px;
    }

    .play-button {
        padding: 5px;
    }

    /* Interactive style */
    .fold-button:hover {
        cursor: grab;
    }

    .button:hover {
        background-color: rgb(80,80,80);
        cursor: grab;
    }

</style>