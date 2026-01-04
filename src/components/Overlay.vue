<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faSliders, faClock } from '@fortawesome/free-solid-svg-icons';
import { inject, Ref, computed, ref } from 'vue';
import { OVERLAY_WIDTH } from '@/composables/constants';
import Controls from './overlay/Controls.vue';
import Timer from './overlay/Timer.vue';

// Naming the overlays
enum OverlayType {
    CONTROLS = 0,
    TIMER = 1,
}

// Computed styles for overlay width
const overlayWidth = computed(() => `${OVERLAY_WIDTH}px`);
const overlayTransform = computed(() => `translateX(-${OVERLAY_WIDTH}px)`);

// Hiding overlay - get from parent or create local
const overlayFolded = inject<Ref<boolean>>('overlayFolded', ref(false));

// Shown overlay type
const shownOverlay = ref(OverlayType.CONTROLS);

function handleOverlayButtonClick(overlayType: OverlayType) {
    // overlay is folded, select correct overlay and unfold
    if (overlayFolded.value) {
        shownOverlay.value = overlayType;
        overlayFolded.value = false;
    } else {
        // If overlayType same as shownOverlay, fold
        if (shownOverlay.value === overlayType) {
            overlayFolded.value = true;
        } else {
            // Else switch the ovelray
            shownOverlay.value = overlayType;
        }
    }
}

</script>

<template>
    <div ref="overlayRef" class="overlay" :class="{ 'overlay-hidden': overlayFolded }">
        <Controls v-show="shownOverlay === OverlayType.CONTROLS" :width="overlayWidth" />
        <Timer v-show="shownOverlay === OverlayType.TIMER" :width="overlayWidth" />

        <div class="overlay-button-column">
            <div @click="handleOverlayButtonClick(OverlayType.CONTROLS)" class="overlay-button" :class="{ 'unselected': shownOverlay !== OverlayType.CONTROLS }">
                <FontAwesomeIcon :icon="faSliders" />
            </div>

            <div @click="handleOverlayButtonClick(OverlayType.TIMER)" class="overlay-button" :class="{ 'unselected': shownOverlay !== OverlayType.TIMER }">
                <FontAwesomeIcon :icon="faClock" />
            </div>
        </div>
    </div>
</template>

<style scoped>
    .overlay {
        display: flex;
        flex-direction: row;

        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;
        height: 100%;

        transition: transform 0.3s ease-in-out;
    }

    .overlay-button-column {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .overlay-button {
        position: relative;
        background-color: rgb(40, 40, 40);
        border-radius: 0px 10px 10px 0px;
        height: fit-content;
        padding: 2px;

        font-size: large;
    }

    .overlay-button.unselected {
        opacity: 0.5;
    }

    /* Interactive style */
    .overlay-button:hover {
        cursor: grab;
    }

    /* Animations */
    .overlay-hidden {
        transform: v-bind('overlayTransform');
    }
</style>