<script setup lang="ts">
import { markRaw } from 'vue';
import { useTres } from '@tresjs/core';
import { useCameraControls } from '../composables/cameraControls';
import { cubes, faceSymbols, showFaceSymbols, useRubiksCube } from '../composables/cubeVisual';
import { useCubeLogic } from '../composables/cubeLogic';
import { Text3D } from '@tresjs/cientos';

const { hovering, onCubePointerDown } = useCameraControls();
const { mats, setCubeObject } = useRubiksCube();
const { masterGroup, handleRotation, playMoves } = useCubeLogic();

const { scene } = useTres();

window.addEventListener('keydown', async (event) => {
    if (event.key == " ") {
        await playMoves(scene.value, "F' L2 F' D2 L2 B2 U2 R2 B F2 L2 R2 U L2 U L D B U B2 F");
    } else {
        await handleRotation(scene.value, event);
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

        <!-- Text -->
        <Suspense v-for="symbol in faceSymbols">
            <Text3D
                :text="symbol.symbol"
                font="/fonts/Roboto_Regular.json"
                :height="0.02"
                :position="symbol.position"
                :rotation="symbol.rotation"
                :visible="showFaceSymbols"
            >
                <TresMeshNormalMaterial transparent :opacity="0.5" />
            </Text3D>
        </Suspense> 
    </TresScene>
</template>