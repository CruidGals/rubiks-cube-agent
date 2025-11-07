<script setup lang="ts">
import Slider from './Slider.vue';
import { turnSpeed } from '@/composables/cubeLogic';
import { showFaceSymbols } from '@/composables/cubeVisual';
import Modal from './Modal.vue';
import { ref } from 'vue';

const showModal = ref(false);

</script>

<template>
    <div class="overlay">
        <h2>Turn Speed {{ turnSpeed }}</h2>
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
</style>