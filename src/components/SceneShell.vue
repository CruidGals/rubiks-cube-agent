<script setup lang="ts">
import { TresCanvas } from '@tresjs/core';
import { CameraControls } from '@tresjs/cientos';
import RubiksCube from './RubiksCube.vue';
import { useCameraControls } from '../composables/cameraControls';
import { inject, computed, Ref, ref } from 'vue';
import { OVERLAY_WIDTH } from '@/composables/constants';

const { onCameraControl } = useCameraControls();

const overlayFolded = inject<Ref<boolean>>('overlayFolded', ref(false));
const marginLeft = computed(() => overlayFolded.value ? '0px' : `${OVERLAY_WIDTH}px`);

</script>

<template>
    <div class="canvas-wrap" :style="{ marginLeft: marginLeft }">
        <TresCanvas >
            <TresPerspectiveCamera :args="[75, 1, 0.1, 1000]" :position="[5,5,5]" :look-at="[0,0,0]"/>
            <CameraControls make-default :mouse-buttons="onCameraControl()" />
            <RubiksCube />
        </TresCanvas>
    </div>
</template>

<style scoped>
    .canvas-wrap {
        flex: 1;
        width: 100%;
        height: 100%;
        overflow: hidden;
        transition: margin-left 0.3s ease-in-out;
    }

</style>