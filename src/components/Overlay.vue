<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faSliders } from '@fortawesome/free-solid-svg-icons';
import { inject, Ref, computed, ref } from 'vue';
import { OVERLAY_WIDTH } from '@/composables/constants';
import Controls from './overlay/Controls.vue';

// Computed styles for overlay width
const overlayWidth = computed(() => `${OVERLAY_WIDTH}px`);
const overlayTransform = computed(() => `translateX(-${OVERLAY_WIDTH}px)`);

// Hiding overlay - get from parent or create local
const overlayFolded = inject<Ref<boolean>>('overlayFolded', ref(false));
</script>

<template>
    <div ref="controlsRef" class="controls" :class="{ 'controls-hidden': overlayFolded }">
        <Controls :width="overlayWidth" />

        <div @click="overlayFolded = !overlayFolded;" class="overlay-button" >
            <FontAwesomeIcon :icon="faSliders" />
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

        transition: transform 0.3s ease-in-out;
    }

    .overlay-button {
        position: relative;
        background-color: rgb(40, 40, 40);
        border-radius: 0px 10px 10px 0px;
        height: fit-content;
        padding: 2px;

        font-size: large;
    }

    /* Interactive style */
    .overlay-button:hover {
        cursor: grab;
    }

    /* Animations */
    .controls-hidden {
        transform: v-bind('overlayTransform');
    }
</style>