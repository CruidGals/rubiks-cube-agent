<script setup lang="ts">
import Slider from './Slider.vue';
import { turnSpeed } from '@/composables/cubeLogic';
import { showFaceSymbols, resetCube } from '@/composables/cubeVisual';
import { useCubeLogic, isRotating } from '@/composables/cubeLogic';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import MarkdownIt from 'markdown-it';
import Modal from './Modal.vue';
import { ref } from 'vue';

// const { scene } = useTres();
const showModal = ref(false);

// For playing moves
const { playMoves } = useCubeLogic();
const moveSet = ref('');

// Hiding overlay
const overlayFolded = ref(false);

// Markdown for the modal
const md = new MarkdownIt();
import keybindMd from '../assets/keybinds.md?raw';
const modalContent = md.render(keybindMd);

</script>

<template>
    <div ref="controlsRef" class="controls">
        <div ref="overlayRef" class="overlay" v-if="!overlayFolded">
            <h2>Turn Speed {{ turnSpeed / 10 }}s</h2>
            <Slider />

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
            <div class="button" @click="isRotating ? null : resetCube()">Reset Cube</div>

            <div class="spacer"></div>

            <!-- Move the cube by giving it a set of moves -->
            <textarea v-model="moveSet" placeholder="R U R' U' ..." style="max-width: 160px; min-width: 160px;"/>
            <div class="button" @click="playMoves(moveSet)">Apply Moves</div>
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

    /* Interactive style */
    .fold-button:hover {
        cursor: grab;
    }

    .button:hover {
        background-color: rgb(80,80,80);
        cursor: grab;
    }

</style>