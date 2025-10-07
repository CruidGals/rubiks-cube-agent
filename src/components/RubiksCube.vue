<script setup lang="ts">
import { onMounted, nextTick, markRaw } from 'vue';
import { useTres } from '@tresjs/core';
import { useCameraControls } from '../composables/cameraControls';
import { cubes, useRubiksCube } from '../composables/cubeVisual';
import { CubeFace, useCubeLogic } from '../composables/cubeLogic';
import { Texture } from 'three';

const { hovering, onCubePointerDown } = useCameraControls();
const { mats, setCubeObject } = useRubiksCube();
const { masterGroup, rotateFace } = useCubeLogic();

const { scene } = useTres();

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case "r": case "R":
            rotateFace(scene.value, CubeFace.R, event.shiftKey); break;
        case "l": case "L":
            rotateFace(scene.value, CubeFace.L, event.shiftKey); break;
        case "u": case "U":
            rotateFace(scene.value, CubeFace.U, event.shiftKey); break;
        case "d": case "D":
            rotateFace(scene.value, CubeFace.D, event.shiftKey); break;
        case "f": case "F":
            rotateFace(scene.value, CubeFace.F, event.shiftKey); break;
        case "b": case "B":
            rotateFace(scene.value, CubeFace.B, event.shiftKey); break;
        case "m": case "M":
            rotateFace(scene.value, CubeFace.M, event.shiftKey); break;
        case "s": case "S":
            rotateFace(scene.value, CubeFace.S, event.shiftKey); break;
        case "e": case "E":
            rotateFace(scene.value, CubeFace.E, event.shiftKey); break;
    }
});

</script>

<template>
    <TresScene>
        <TresGroup ref="masterGroup">
            <TresMesh v-for="cube in cubes" 
                :key="cube.id" 
                :position="cube.position" 
                :material="mats" 
                :ref="(el) => setCubeObject(cube.id, markRaw(el))"
                @pointerenter="hovering = true" 
                @pointerleave="hovering = false" 
                @pointerdown="onCubePointerDown"
            >
                <TresBoxGeometry :args="[1, 1, 1]" />
            </TresMesh>
        </TresGroup>

        <!-- Lights -->
        <TresAmbientLight :intensity="1.0" />
        <TresPointLight :position="[10,-10,10]" />
    </TresScene>
</template>