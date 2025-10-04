<script setup lang="ts">
import { TresCanvas } from '@tresjs/core';
import { CameraControls } from '@tresjs/cientos';
import { useCameraControls } from './cameraControls';
import { useRubiksCube } from './cubeVisual';

const { hovering, onCameraControl, onCubePointerDown } = useCameraControls();
const { cubes, mats } = useRubiksCube();

</script>

<template>
    <div>
        <TresCanvas window-size >
            <TresPerspectiveCamera :args="[75, 1, 0.1, 1000]" :position="[5,5,5]" :look-at="[0,0,0]"/>
            <CameraControls make-default :mouse-buttons="onCameraControl()" />
            <TresScene>
                <TresMesh v-for="cube in cubes" :key="cube.id" :position="cube.position" :material="mats" @pointerenter="hovering = true" @pointerleave="hovering = false" @pointerdown="onCubePointerDown">
                    <TresBoxGeometry :args="[1, 1, 1]" />
                </TresMesh>
                <TresAmbientLight :intensity="0.5" />
                <TresPointLight :position="[10,-10,10]" />
            </TresScene>
        </TresCanvas>
    </div>
</template>