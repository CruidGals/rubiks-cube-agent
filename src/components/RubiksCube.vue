<script setup lang="ts">
import { markRaw } from 'vue';
import { ref } from 'vue';
import { useCameraControls } from '../composables/cameraControls';
import { faceSymbols, showFaceSymbols, useRubiksCube } from '../composables/cubeVisual';
import { useCubeLogic } from '../composables/cubeLogic';
import { usePlayMoveLogic } from '@/composables/playMoveLogic';
import { Text3D } from '@tresjs/cientos';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { useFocus } from '@vueuse/core';

const { hovering, onCubePointerDown } = useCameraControls();
const { meshes, setCubeObject } = useRubiksCube();
const { masterGroup } = useCubeLogic();
const { prepareMove, playMove } = usePlayMoveLogic();

// Font
import robotoJson from '@/assets/fonts/Roboto_Regular.json';
const loader = new FontLoader();
const font = loader.parse(robotoJson as any)

// Handling focus
const focusedElement = ref<HTMLElement | null>(null);
const { focused } = useFocus(focusedElement);

window.addEventListener('keydown', async (event) => {
    // DOn't apply when typing into an input
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
    }

    if (focused) {
        let move = prepareMove(event);

        // Don't proceed if invalid move
        if (move == null) return;

        await playMove(move);
    }
});

</script>

<template>
    <TresScene ref="focusedElement">
        <TresGroup ref="masterGroup">
            <TresMesh v-for="mesh in meshes" 
                :key="mesh.cube.id" 
                :position="mesh.cube.position" 
                :material="mesh.mats" 
                :ref="(el) => setCubeObject(mesh.cube.id, markRaw(el))"
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
                :font="font"
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