<script setup lang="ts">
import Slider from './Slider.vue';
import { turnSpeed } from '@/composables/cubeLogic';
import { showFaceSymbols, resetCube } from '@/composables/cubeVisual';
import { useCubeLogic, isRotating } from '@/composables/cubeLogic';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Modal from './Modal.vue';
import { ref } from 'vue';

// const { scene } = useTres();
const showModal = ref(false);

// For playing moves
const { playMoves } = useCubeLogic();
const moveSet = ref('');

// Hiding overlay
const overlayFolded = ref(false);

</script>

<template>
    <div ref="controlsRef" class="controls">
        <div ref="overlayRef" class="overlay" :style="{display: `${overlayFolded ? 'none' : 'flex'}`}">
            <h2>Turn Speed {{ turnSpeed / 10 }}s</h2>
            <Slider />
            <label class>
                Show Face Symbols <input type="checkbox" v-model="showFaceSymbols">
            </label>

            <!-- Modal for keybinds -->
            <teleport to="body">
                <Modal v-model="showModal">
                    <div class="modal-content">
                        <h1>Keybinds</h1>

                        <div style="display: flex; gap: 20px; justify-content: center;">
                            <div style="display: flex; flex-direction: column;">
                                <p><span class="bold">R</span>: Move R face CW</p>
                                <p><span class="bold">L</span>: Move L face CW</p>
                                <p><span class="bold">F</span>: Move F face CW</p>
                                <p><span class="bold">B</span>: Move B face CW</p>
                                <p><span class="bold">U</span>: Move U face CW</p>
                                <p><span class="bold">D</span>: Move D face CW</p>
                            </div>
                            <div style="display: flex; flex-direction: column;">
                                <p><span class="bold">M</span>: Move the M layer CW</p>
                                <p><span class="bold">S</span>: Move the S layer CW</p>
                                <p><span class="bold">E</span>: Move the E layer CW</p>
                            </div>
                            <div style="display: flex; flex-direction: column;">
                                <p><span class="bold">X</span>: Rotate cube CW from R Face</p>
                                <p><span class="bold">Y</span>: Rotate cube CW from U Face</p>
                                <p><span class="bold">Z</span>: Rotate cube CW from F Face</p>
                            </div>
                        </div>
                        
                        <div>
                            <p>Holding <span class="bold">Shift</span> will reverse the direction to CCW.</p>
                            <p>Holding <span class="bold">Left Ctrl</span> will perform wide moves.</p>
                        </div>
                    </div>
                </Modal>
            </teleport>
            <button @click="showModal = true">Show Keybinds</button>
            <button @click="isRotating ? null : resetCube()">Reset Cube</button>

            <div class="spacer"></div>

            <!-- Move the cube by giving it a set of moves -->
            <textarea v-model="moveSet" placeholder="R U R' U' ..." style="max-width: 160px;"/>
            <button @click="playMoves(moveSet)">Apply Moves</button>
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

    .modal-content {    
        background-color: black;
        color: white;
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
        height: 50px;
        padding: 0;
        margin: 0;
    }

    /* Interactive style */
    .fold-button:hover {
        cursor: grab;
    }
</style>