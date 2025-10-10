<script setup lang="ts">
import { TresCanvas } from '@tresjs/core';
import { CameraControls } from '@tresjs/cientos';
import RubiksCube from './RubiksCube.vue';
import { useCameraControls } from '../composables/cameraControls';

const { onCameraControl } = useCameraControls();

</script>

<template>
    <div class="canvas-wrap">
        <TresCanvas window-size >
            <TresPerspectiveCamera :args="[75, 1, 0.1, 1000]" :position="[5,5,5]" :look-at="[0,0,0]"/>
            <CameraControls make-default :mouse-buttons="onCameraControl()" />
            <RubiksCube />
        </TresCanvas>
    </div>
</template>

<style scoped>
    .canvas-wrap {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .canvas-wrap canvas {
        display: block;
    }

</style>