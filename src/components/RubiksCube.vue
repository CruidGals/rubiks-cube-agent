<script setup lang="ts">
import { onMounted, nextTick, markRaw } from 'vue';
import { useTres } from '@tresjs/core';
import { useCameraControls } from '../composables/cameraControls';
import { cubes, useRubiksCube } from '../composables/cubeVisual';
import { CubeNotation, useCubeLogic } from '../composables/cubeLogic';
import { Texture } from 'three';

const { hovering, onCubePointerDown } = useCameraControls();
const { mats, setCubeObject } = useRubiksCube();
const { masterGroup, rotateFace } = useCubeLogic();

const { scene } = useTres();

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case "r": case "R":
            if (event.ctrlKey) rotateFace(scene.value, CubeNotation.WR, event.shiftKey); 
            else rotateFace(scene.value, CubeNotation.R, event.shiftKey); break;
        case "l": case "L":
            if (event.ctrlKey) rotateFace(scene.value, CubeNotation.WL, event.shiftKey); 
            else rotateFace(scene.value, CubeNotation.L, event.shiftKey); break;
        case "u": case "U":
            if (event.ctrlKey) rotateFace(scene.value, CubeNotation.WU, event.shiftKey); 
            else rotateFace(scene.value, CubeNotation.U, event.shiftKey); break;
        case "d": case "D":
            if (event.ctrlKey) rotateFace(scene.value, CubeNotation.WD, event.shiftKey); 
            else rotateFace(scene.value, CubeNotation.D, event.shiftKey); break;
        case "f": case "F":
            if (event.ctrlKey) rotateFace(scene.value, CubeNotation.WF, event.shiftKey); 
            else rotateFace(scene.value, CubeNotation.F, event.shiftKey); break;
        case "b": case "B":
            if (event.ctrlKey) rotateFace(scene.value, CubeNotation.WB, event.shiftKey); 
            else rotateFace(scene.value, CubeNotation.B, event.shiftKey); break;
        case "m": case "M":
            rotateFace(scene.value, CubeNotation.M, event.shiftKey); break;
        case "s": case "S":
            rotateFace(scene.value, CubeNotation.S, event.shiftKey); break;
        case "e": case "E":
            rotateFace(scene.value, CubeNotation.E, event.shiftKey); break;
        case "x": case "X":
            rotateFace(scene.value, CubeNotation.RX, event.shiftKey); break;
        case "y": case "Y":
            rotateFace(scene.value, CubeNotation.RY, event.shiftKey); break;
        case "z": case "Z":
            rotateFace(scene.value, CubeNotation.RZ, event.shiftKey); break;
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