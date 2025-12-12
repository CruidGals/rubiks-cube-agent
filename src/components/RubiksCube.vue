<script setup lang="ts">
import { markRaw } from 'vue';
import { ref } from 'vue';
import { useCameraControls } from '../composables/cameraControls';
import { cubes, faceSymbols, showFaceSymbols, useRubiksCube } from '../composables/cubeVisual';
import { useCubeLogic } from '../composables/cubeLogic';
import { Text3D } from '@tresjs/cientos';
import { useFocus } from '@vueuse/core';

const { hovering, onCubePointerDown } = useCameraControls();
const { mats, setCubeObject } = useRubiksCube();
const { masterGroup, handleRotation } = useCubeLogic();

// Handling focus
const focusedElement = ref<HTMLElement | null>(null);
const { focused } = useFocus(focusedElement);

window.addEventListener('keydown', async (event) => {
    // DOn't apply when typing into an input
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
    }

    if (focused) await handleRotation(event);
});

</script>

<template>
    <TresScene ref="focusedElement">
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